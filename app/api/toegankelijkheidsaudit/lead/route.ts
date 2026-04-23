import type { NextRequest } from "next/server";
import { runAudit, AuditError } from "@/lib/a11y/audit";
import { sendAuditEmailToLead, sendInternalLeadNotification } from "@/lib/a11y/email";
import { pushAuditLeadToTwenty } from "@/lib/a11y/crm";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import type { AuditLead } from "@/lib/a11y/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LeadRequest {
  url?: string;
  lead?: Partial<AuditLead>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLead(raw: Partial<AuditLead> | undefined): AuditLead | string {
  if (!raw) return "Lead-gegevens ontbreken.";
  const voornaam = (raw.voornaam ?? "").trim();
  const achternaam = (raw.achternaam ?? "").trim();
  const bedrijf = (raw.bedrijf ?? "").trim();
  const email = (raw.email ?? "").trim().toLowerCase();
  const telefoon = (raw.telefoon ?? "").trim();
  const toestemming = raw.toestemming === true;

  if (!voornaam) return "Voornaam is verplicht.";
  if (!achternaam) return "Achternaam is verplicht.";
  if (!bedrijf) return "Bedrijfsnaam is verplicht.";
  if (!email || !EMAIL_RE.test(email)) return "Een geldig e-mailadres is verplicht.";
  if (!toestemming) return "Toestemming voor gegevensverwerking is verplicht.";
  if (voornaam.length > 80 || achternaam.length > 80 || bedrijf.length > 120 || email.length > 200) {
    return "Een van de invoervelden is te lang.";
  }

  return {
    voornaam,
    achternaam,
    bedrijf,
    email,
    telefoon: telefoon || undefined,
    toestemming,
  };
}

export async function POST(request: NextRequest) {
  let body: LeadRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige invoer." }, { status: 400 });
  }

  const url = (body.url ?? "").toString().trim();
  if (!url) {
    return Response.json({ error: "URL is verplicht." }, { status: 400 });
  }

  const leadOrError = validateLead(body.lead);
  if (typeof leadOrError === "string") {
    return Response.json({ error: leadOrError }, { status: 400 });
  }
  const lead = leadOrError;

  // Rate limit: max 4 lead-audits per IP per 30 min
  const ip = getClientIp(request);
  const rate = checkRateLimit(`a11y-lead:${ip}`, 4, 30 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      {
        error: `Te veel verzoeken. Probeer het opnieuw over ${rate.retryAfterSeconds} seconden.`,
      },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  // 1. Audit uitvoeren — moet slagen, anders geen lead-capture (gebruiker krijgt error)
  let report;
  try {
    report = await runAudit(url);
  } catch (err) {
    if (err instanceof AuditError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error("[a11y/lead] audit error", err);
    return Response.json({ error: "Onverwachte fout tijdens de audit." }, { status: 500 });
  }

  // 2. Twenty + e-mails parallel — geen van deze mag de gebruiker tegenhouden.
  //    Twenty/Resend kunnen falen zonder dat we de UX breken; we loggen alleen.
  const sideEffects = Promise.allSettled([
    pushAuditLeadToTwenty(lead, report),
    sendAuditEmailToLead(lead, report),
    sendInternalLeadNotification(lead, report),
  ]);

  // We wachten kort: maximaal 8s zodat de UI niet eindeloos hangt als Twenty traag is.
  const TIMEOUT_MS = 8000;
  await Promise.race([
    sideEffects,
    new Promise((resolve) => setTimeout(resolve, TIMEOUT_MS)),
  ]);

  // Logging zodra alles klaar is, ook als we al hebben geantwoord (best-effort)
  sideEffects.then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const labels = ["twenty", "email-lead", "email-intern"];
        console.warn(`[a11y/lead] side-effect ${labels[i]} faalde:`, r.reason);
      }
    });
  });

  return Response.json({ ok: true, report });
}
