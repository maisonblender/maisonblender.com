import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/quickscan/rate-limit';
import { checkOrigin } from '@/lib/security/origin';
import { readJsonBody } from '@/lib/security/json';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || '3'; // Limburg AI Labs list

// Optionele Brevo Double Opt-In configuratie — als beide gezet zijn, gebruiken we
// het DOI endpoint zodat een aanvaller niet andermans email-adres op de lijst kan
// zetten zonder bevestiging vanuit dat mailbox.
//   BREVO_DOI_TEMPLATE_ID — id van het bevestigings-mail template (in Brevo Templates)
//   BREVO_DOI_REDIRECT_URL — URL waar gebruiker naartoe wordt gestuurd na klik
const BREVO_DOI_TEMPLATE_ID = process.env.BREVO_DOI_TEMPLATE_ID;
const BREVO_DOI_REDIRECT_URL = process.env.BREVO_DOI_REDIRECT_URL;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const parsed = await readJsonBody<{ email?: unknown }>(request, 4 * 1024);
  if (!parsed.ok) return parsed.response;
  const { email } = parsed.data;

  if (typeof email !== 'string' || email.length > 200 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Geldig e-mailadres is verplicht' },
      { status: 400 }
    );
  }

  // Rate limit: 3 nieuwsbrief-inschrijvingen per IP per uur — anders kan een
  // aanvaller je Brevo-lijst pollueren met willekeurige adressen.
  const ip = getClientIp(request);
  const rate = checkRateLimit(`newsletter:${ip}`, 3, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Te veel verzoeken. Probeer het opnieuw over ${rate.retryAfterSeconds} seconden.` },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
    );
  }

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY not configured');
    return NextResponse.json(
      { error: 'Nieuwsbrief service niet geconfigureerd' },
      { status: 500 }
    );
  }

  try {
    const listId = parseInt(BREVO_LIST_ID, 10);
    const useDoi = Boolean(BREVO_DOI_TEMPLATE_ID && BREVO_DOI_REDIRECT_URL);

    // DOI flow (aanbevolen): Brevo stuurt een bevestigingsmail; alleen na klikken
    // wordt het adres aan de lijst toegevoegd. Voorkomt list-pollution + houdt
    // sender reputation hoog.
    if (useDoi) {
      const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          includeListIds: [listId],
          templateId: parseInt(BREVO_DOI_TEMPLATE_ID!, 10),
          redirectionUrl: BREVO_DOI_REDIRECT_URL,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Brevo DOI error:', response.status, errorData);
        if (response.status === 400 && errorData?.code === 'duplicate_parameter') {
          return NextResponse.json({ message: 'Je bent al ingeschreven!' }, { status: 200 });
        }
        return NextResponse.json(
          { error: 'Inschrijving mislukt, probeer het later opnieuw' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: 'Check je inbox — bevestig je inschrijving via de link die we je hebben gestuurd.' },
        { status: 200 }
      );
    }

    // Fallback flow: zonder DOI configuratie. We zetten updateEnabled bewust
    // op false zodat een aanvaller niet andermans contact-data kan overschrijven
    // door hun email opnieuw in te sturen.
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Brevo API error:', response.status, errorData);

      if (response.status === 400 && errorData?.code === 'duplicate_parameter') {
        return NextResponse.json(
          { message: 'Je bent al ingeschreven!' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Inschrijving mislukt, probeer het later opnieuw' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Succesvol ingeschreven!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis, probeer het later opnieuw' },
      { status: 500 }
    );
  }
}
