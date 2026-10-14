import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { sanitizeHeader } from "@/lib/security/escape";
import { verwerkLead } from "@/lib/leads/submit";

const isDev = process.env.NODE_ENV !== "production";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ANTWOORD_VELDEN = ["uitdaging", "bedrijfsgrootte", "budget", "timeline", "vergadertype"] as const;

type StrategiegesprekBody = Partial<
  Record<(typeof ANTWOORD_VELDEN)[number] | "naam" | "email" | "bedrijf", unknown>
>;

function tekst(value: unknown, maxLen: number): string | null | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || value.length > maxLen) return null;
  return value.trim();
}

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const parsed = await readJsonBody<StrategiegesprekBody>(request, 16 * 1024);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data ?? {};

  const naam = tekst(body.naam, 120);
  const email = tekst(body.email, 200);
  const bedrijf = tekst(body.bedrijf, 120);
  const antwoorden: Record<string, string> = {};
  for (const veld of ANTWOORD_VELDEN) {
    const v = tekst(body[veld], 120);
    if (v === null) return Response.json({ error: "Een van de invoervelden is ongeldig." }, { status: 400 });
    if (v) antwoorden[veld] = v;
  }

  if (naam === null || email === null || bedrijf === null) {
    return Response.json({ error: "Een van de invoervelden is ongeldig." }, { status: 400 });
  }
  if (!naam || !email) {
    return Response.json({ error: "Vul je naam en e-mailadres in." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(`strategiegesprek:${ip}`, 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer het opnieuw over ${rate.retryAfterSeconds} seconden.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const v = (key: (typeof ANTWOORD_VELDEN)[number]) => antwoorden[key] ?? "niet opgegeven";
  const datum = new Date().toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" });
  const kwalificatie = [
    `- **Uitdaging:** ${v("uitdaging")}`,
    `- **Bedrijfsgrootte:** ${v("bedrijfsgrootte")}`,
    `- **Budget:** ${v("budget")}`,
    `- **Timing:** ${v("timeline")}`,
    `- **Type gesprek:** ${v("vergadertype")}`,
  ].join("\n");

  const subjectNaam = sanitizeHeader(naam, 120);
  const subjectBedrijf = bedrijf ? sanitizeHeader(bedrijf, 120) : null;

  const result = await verwerkLead({
    lead: {
      bron: "Strategiegesprek",
      naam,
      email,
      bedrijf: bedrijf || undefined,
      noteTitel: `Strategiegesprek — ${naam}${bedrijf ? ` (${bedrijf})` : ""} — budget ${v("budget")}`,
      noteMarkdown: `# Strategiegesprek-aanvraag — ${datum}

## Kwalificatie
${kwalificatie}

## Contactgegevens
- **Bron:** Strategiegesprek
- **Naam:** ${naam}
- **Bedrijf:** ${bedrijf || "niet opgegeven"}
- **E-mail:** ${email}

Afspraak nog niet bevestigd: de bezoeker kiest zelf een datum via de agendalink.`,
    },
    mailSubject: `Nieuwe strategiegesprek-aanvraag: ${subjectNaam}${subjectBedrijf ? ` (${subjectBedrijf})` : ""}`,
    mailText: `Naam: ${naam}\nBedrijf: ${bedrijf || "-"}\nE-mail: ${email}\n\n${kwalificatie.replace(/\*\*/g, "")}`,
  });

  if (!result.stored) {
    if (isDev) {
      console.log("Strategiegesprek-aanvraag (geen CRM/Resend geconfigureerd):", { naam, bedrijf, email, ...antwoorden });
      return Response.json({ ok: true });
    }
    return Response.json(
      { error: "Je aanvraag kon niet automatisch worden doorgestuurd." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
