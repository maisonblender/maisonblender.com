/**
 * POST /api/brand-ambassador/briefing
 *
 * Genereert via Claude een gepersonaliseerde samenvatting van het gesprek,
 * mailt die naar de lead (en BCC naar karl@) en pushed óók een note naar
 * Twenty zodat salesopvolging context heeft.
 *
 * Verschilt van /lead omdat briefing een AI-generatie stap bevat én de mail
 * naar de LEAD gaat i.p.v. naar karl@ alleen. Vaak wordt /lead eerst
 * aangeroepen (ontvangt Karl notificatie) en daarna /briefing als de
 * bezoeker expliciet zegt "stuur me een samenvatting".
 */

import type { NextRequest } from "next/server";
import { after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { escapeHtml, sanitizeHeader } from "@/lib/security/escape";
import { BRIEFING_SYSTEM_PROMPT } from "@/lib/brand-ambassador/system-prompt";
import { pushAmbassadorLead } from "@/lib/brand-ambassador/crm";
import type {
  BriefingRequest,
  ChatMessage,
  AmbassadorLead,
  BrandContext,
} from "@/lib/brand-ambassador/types";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeLead(raw: unknown): AmbassadorLead | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max = 200): string | undefined => {
    if (typeof v !== "string") return undefined;
    const t = v.trim().slice(0, max);
    return t || undefined;
  };
  return {
    naam: str(r.naam, 120),
    email: str(r.email, 200),
    bedrijf: str(r.bedrijf, 200),
    sector: str(r.sector, 120),
    teamgrootte: str(r.teamgrootte, 60),
    urgentie: str(r.urgentie, 120),
    interesse: str(r.interesse, 500),
  };
}

function sanitizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ChatMessage[] = [];
  for (const e of raw) {
    if (!e || typeof e !== "object") return null;
    const obj = e as Record<string, unknown>;
    if (obj.role !== "user" && obj.role !== "assistant") return null;
    if (typeof obj.content !== "string") return null;
    out.push({ role: obj.role, content: obj.content.slice(0, 4000) });
  }
  return out;
}

function sanitizeBrand(raw: unknown): BrandContext | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.name !== "string" || typeof r.hue !== "number") return null;
  const name = r.name.trim().slice(0, 60);
  if (!name) return null;
  return { name, hue: Math.max(0, Math.min(360, Math.round(r.hue))) };
}

function paragraphsToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 14px; font-size:14px; line-height:1.7; color:#3a3a42;">${escapeHtml(p).replace(/\n/g, "<br />")}</p>`
    )
    .join("");
}

function bouwUserPrompt(
  lead: AmbassadorLead,
  messages: ChatMessage[],
  brand: BrandContext | null
): string {
  const profielLijst = [
    lead.naam && `Naam: ${lead.naam}`,
    lead.bedrijf && `Bedrijf: ${lead.bedrijf}`,
    lead.sector && `Sector: ${lead.sector}`,
    lead.teamgrootte && `Teamgrootte: ${lead.teamgrootte}`,
    lead.urgentie && `Urgentie: ${lead.urgentie}`,
    lead.interesse && `Samenvatting interesse: ${lead.interesse}`,
  ]
    .filter(Boolean)
    .join("\n");

  const transcript = messages
    .map((m) => `${m.role === "user" ? "Bezoeker" : "Ambassador"}: ${m.content}`)
    .join("\n\n");

  const brandRegel = brand
    ? `\n\nLet op: de bezoeker testte de Ambassador in demo-modus namens het merk "${brand.name}" (Imagine-This-Is-Yours).`
    : "";

  return `Leadprofiel:\n${profielLijst || "geen expliciet profiel"}\n\nTranscript:\n\n${transcript}${brandRegel}\n\nSchrijf nu de briefing-email volgens de instructies.`;
}

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rate = checkRateLimit(`ba-briefing:${ip}`, 3, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer opnieuw over ${rate.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const parsed = await readJsonBody<BriefingRequest>(request, 128 * 1024);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const lead = sanitizeLead(body.lead);
  const messages = sanitizeMessages(body.messages);
  const brand = sanitizeBrand(body.brand);

  if (!lead || !messages) {
    return Response.json({ error: "Ongeldige invoer." }, { status: 400 });
  }
  if (!lead.email || !EMAIL_REGEX.test(lead.email)) {
    return Response.json({ error: "Geldig e-mailadres verplicht." }, { status: 400 });
  }
  if (body.toestemming !== true) {
    return Response.json({ error: "Toestemming verplicht." }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "Briefing tijdelijk niet beschikbaar." }, { status: 503 });
  }

  let briefingTekst = "";
  try {
    const client = new Anthropic({ apiKey: anthropicKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: BRIEFING_SYSTEM_PROMPT,
      messages: [{ role: "user", content: bouwUserPrompt(lead, messages, brand) }],
    });
    briefingTekst = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("")
      .trim();
  } catch (err) {
    console.error("[BA-briefing] Claude error:", err);
    return Response.json({ error: "Briefing genereren mislukt." }, { status: 502 });
  }

  if (!briefingTekst) {
    return Response.json({ error: "Lege briefing ontvangen." }, { status: 502 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return Response.json(
      { error: "E-mail versturen tijdelijk niet beschikbaar." },
      { status: 503 }
    );
  }

  const veiligNaam = escapeHtml(lead.naam ?? "");
  const veiligBedrijf = escapeHtml(lead.bedrijf ?? "");
  const veiligEmail = sanitizeHeader(lead.email, 200);

  const bodyHtml = `<!DOCTYPE html>
<html lang="nl"><head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#f2f3f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f5; padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
        <tr><td style="background:#1f1f1f; padding:32px 40px;">
          <div style="font-size:18px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">MAISON BLNDR</div>
          <div style="font-size:11px; color:rgba(255,255,255,0.5); margin-top:4px; text-transform:uppercase; letter-spacing:0.08em;">Brand Ambassador · Gesprekssamenvatting</div>
        </td></tr>
        <tr><td style="background:#ffffff; padding:32px 40px;">
          ${paragraphsToHtml(briefingTekst)}
        </td></tr>
        <tr><td style="background:#ffffff; padding:0 40px 32px;">
          <a href="https://maisonblender.com/strategiegesprek" style="display:inline-block; background:#22c55e; color:#1f1f1f; padding:14px 28px; border-radius:100px; text-decoration:none; font-size:14px; font-weight:700;">Plan een gratis strategiegesprek →</a>
        </td></tr>
        <tr><td style="background:#f2f3f5; padding:20px 40px;">
          <p style="margin:0; font-size:12px; color:#b2b2be; line-height:1.6;">MAISON BLNDR · Burg. Coonenplein 37, 6141BZ Sittard · <a href="mailto:info@maisonblender.com" style="color:#b2b2be;">info@maisonblender.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const subjectBedrijf = lead.bedrijf ? sanitizeHeader(lead.bedrijf, 80) : "jouw gesprek";
  const subject = `Samenvatting Brand Ambassador — ${subjectBedrijf}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "brand-ambassador@maisonblender.com",
        to: [veiligEmail],
        bcc: ["karl@maisonblender.com"],
        subject,
        html: bodyHtml,
        text: briefingTekst,
      }),
    });
    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error("[BA-briefing] Resend error:", res.status, errorBody);
      return Response.json({ error: "E-mail verzenden mislukt." }, { status: 502 });
    }
  } catch (err) {
    console.error("[BA-briefing] Resend fetch error:", err);
    return Response.json({ error: "E-mail verzenden mislukt." }, { status: 502 });
  }

  // CRM push met briefing als extra context-note (na response).
  after(async () => {
    try {
      const leadMetBriefing = {
        ...lead,
        interesse: [lead.interesse, `AI-briefing verstuurd op ${new Date().toLocaleString("nl-NL")}`]
          .filter(Boolean)
          .join(" — "),
      };
      await pushAmbassadorLead(leadMetBriefing, messages, brand);
    } catch (err) {
      console.warn("[BA-briefing] CRM push mislukt:", err);
    }
  });

  void veiligNaam;
  void veiligBedrijf;

  return Response.json({ ok: true });
}
