import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { sanitizeHeader } from "@/lib/security/escape";

const isDev = process.env.NODE_ENV !== "production";

interface ContactBody {
  naam?: string;
  bedrijf?: string;
  email?: string;
  bericht?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const parsed = await readJsonBody<ContactBody>(request, 32 * 1024);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  if (!body || !body.naam || !body.email || !body.bericht) {
    return Response.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
  }

  // Lengte-validatie — beschermt tegen abuse en zorgt dat email niet exploded
  if (
    body.naam.length > 120 ||
    (body.bedrijf && body.bedrijf.length > 120) ||
    body.email.length > 200 ||
    body.bericht.length > 5000
  ) {
    return Response.json({ error: "Een van de invoervelden is te lang." }, { status: 400 });
  }

  if (!EMAIL_RE.test(body.email)) {
    return Response.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  // Rate limit: 5 contact-formulieren per IP per uur — voorkomt abuse van
  // Resend-credits en spam via je eigen domein.
  const ip = getClientIp(request);
  const rate = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer het opnieuw over ${rate.retryAfterSeconds} seconden.` },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  const naam = body.naam.trim();
  const bedrijf = body.bedrijf?.trim();
  const email = body.email.trim();
  const bericht = body.bericht.trim();

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (isDev) {
      console.log("Contact form submission (no RESEND_API_KEY set):", { naam, bedrijf, email, bericht });
    }
    return Response.json({ ok: true });
  }

  // Sanitize subject — strip CR/LF om header-injectie via naam/bedrijf te voorkomen.
  const safeSubjectNaam = sanitizeHeader(naam, 120);
  const safeSubjectBedrijf = bedrijf ? sanitizeHeader(bedrijf, 120) : null;
  const subject = `Nieuw contactformulier: ${safeSubjectNaam}${safeSubjectBedrijf ? ` (${safeSubjectBedrijf})` : ""}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "website@maisonblender.com",
      to: ["info@maisonblender.com"],
      reply_to: email,
      subject,
      text: `Naam: ${naam}\nBedrijf: ${bedrijf ?? "-"}\nE-mail: ${email}\n\nBericht:\n${bericht}`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Resend error:", err);
    return Response.json({ error: "Verzenden mislukt. Probeer het later opnieuw." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
