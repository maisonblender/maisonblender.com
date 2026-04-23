import type { NextRequest } from "next/server";
import { runAudit, AuditError } from "@/lib/a11y/audit";
import { sendAuditEmailToLead, sendInternalLeadNotification } from "@/lib/a11y/email";
import { pushAuditLeadToTwenty, type TwentyPushResult } from "@/lib/a11y/crm";
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
  //    Twenty isoleren we wél, zodat we de status mee kunnen sturen in de response
  //    (handig voor diagnose vanuit de browser zonder Vercel-logs te openen).
  const twentyPromise = pushAuditLeadToTwenty(lead, report).catch(
    (err): TwentyPushResult => ({
      status: "exception",
      error: err instanceof Error ? err.message : String(err),
    })
  );
  const emailsPromise = Promise.allSettled([
    sendAuditEmailToLead(lead, report),
    sendInternalLeadNotification(lead, report),
  ]);

  // We wachten kort: maximaal 8s zodat de UI niet eindeloos hangt als Twenty traag is.
  const TIMEOUT_MS = 8000;
  const timeout = new Promise<"timeout">((resolve) =>
    setTimeout(() => resolve("timeout"), TIMEOUT_MS)
  );

  const twentyResult = await Promise.race([twentyPromise, timeout]);

  // Emails afwachten met dezelfde grenstijd
  await Promise.race([emailsPromise, timeout]);

  // Best-effort vervolg-log voor wat na het timeout-venster nog binnenkomt
  emailsPromise.then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const labels = ["email-lead", "email-intern"];
        console.warn(`[a11y/lead] side-effect ${labels[i]} faalde:`, r.reason);
      }
    });
  });
  twentyPromise.then((res) => {
    if (res.status !== "ok") {
      console.warn(`[a11y/lead] Twenty status=${res.status}`, res.error ?? "");
    }
  });

  const twentyStatus =
    typeof twentyResult === "string" ? "timeout" : twentyResult.status;
  const twentyNoteId =
    typeof twentyResult === "string" ? null : twentyResult.noteId ?? null;
  const personLink =
    typeof twentyResult === "string" ? undefined : twentyResult.personLinked;
  const companyLink =
    typeof twentyResult === "string" ? undefined : twentyResult.companyLinked;
  const companyId =
    typeof twentyResult === "string" ? undefined : twentyResult.companyId;

  // Compacte representatie: ✓ = aangemaakt, ✗ = POST mislukte, skip = overgeslagen
  const linkChar = (v: boolean | null | undefined): string =>
    v === true ? "ok" : v === false ? "fail" : v === null ? "skip" : "n/a";

  const headers: Record<string, string> = {
    "X-Twenty-Status": twentyStatus,
    "X-Twenty-Note-Person-Link": linkChar(personLink),
    "X-Twenty-Note-Company-Link": linkChar(companyLink),
  };
  if (twentyNoteId) headers["X-Twenty-Note-Id"] = twentyNoteId;
  if (companyId) headers["X-Twenty-Company-Id"] = companyId;

  return Response.json(
    {
      ok: true,
      report,
      twenty: {
        status: twentyStatus,
        noteId: twentyNoteId,
        companyId: companyId ?? null,
        personLinked: personLink ?? null,
        companyLinked: companyLink ?? null,
      },
    },
    { headers }
  );
}
