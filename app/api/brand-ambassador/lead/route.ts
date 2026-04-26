/**
 * POST /api/brand-ambassador/lead
 *
 * Eindpunt voor de conversationele leadcapture van de Brand Ambassador.
 * Client stuurt het (deels) ingevulde leadprofiel + volledige transcript.
 *
 * Dit endpoint:
 *  1. Valideert input
 *  2. Pusht lead (+ company + note met transcript) naar Twenty CRM
 *  3. Stuurt notificatie-email naar karl@maisonblender.com (via Resend)
 *
 * Het verzenden van een briefing-email naar de LEAD zelf zit in een aparte
 * route (/api/brand-ambassador/briefing) omdat dat alleen gebeurt als de
 * bezoeker er expliciet om vraagt.
 */

import type { NextRequest } from "next/server";
import { after } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { escapeHtml, sanitizeHeader } from "@/lib/security/escape";
import { pushAmbassadorLead } from "@/lib/brand-ambassador/crm";
import type { LeadRequest, ChatMessage, AmbassadorLead, BrandContext } from "@/lib/brand-ambassador/types";

export const runtime = "nodejs";

const isDev = process.env.NODE_ENV !== "production";
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

function transcriptHtml(messages: ChatMessage[]): string {
  return messages
    .map((m) => {
      const label = m.role === "user" ? "Bezoeker" : "Ambassador";
      const bg = m.role === "user" ? "#1f1f1f" : "#f2f3f5";
      const color = m.role === "user" ? "#ffffff" : "#1f1f1f";
      const align = m.role === "user" ? "right" : "left";
      return `
        <div style="margin:8px 0; text-align:${align};">
          <div style="display:inline-block; max-width:85%; padding:10px 14px; background:${bg}; color:${color}; border-radius:12px; text-align:left;">
            <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; opacity:0.6; margin-bottom:4px;">${label}</div>
            <div style="font-size:13px; line-height:1.5; white-space:pre-wrap;">${escapeHtml(m.content)}</div>
          </div>
        </div>`;
    })
    .join("");
}

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rate = checkRateLimit(`ba-lead:${ip}`, 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer opnieuw over ${rate.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const parsed = await readJsonBody<LeadRequest>(request, 128 * 1024);
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

  // CRM push mag na de response doorgaan (Twenty is nice-to-have).
  after(async () => {
    try {
      await pushAmbassadorLead(lead, messages, brand);
    } catch (err) {
      console.warn("[BA-lead] CRM push mislukt:", err);
    }
  });

  // Notificatie-email naar Karl
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const veiligBedrijf = escapeHtml(lead.bedrijf ?? "—");
    const veiligNaam = escapeHtml(lead.naam ?? "—");
    const veiligEmail = escapeHtml(lead.email);
    const veiligSector = escapeHtml(lead.sector ?? "—");
    const veiligTeam = escapeHtml(lead.teamgrootte ?? "—");
    const veiligUrgentie = escapeHtml(lead.urgentie ?? "—");
    const veiligInteresse = escapeHtml(lead.interesse ?? "—");
    const veiligBrand = brand ? escapeHtml(brand.name) : null;

    const emailHtml = `<!DOCTYPE html>
<html lang="nl"><head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#f2f3f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f5; padding:40px 20px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%;">
        <tr><td style="background:#1f1f1f; padding:28px 36px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#22c55e; margin-bottom:4px;">Nieuwe lead — Brand Ambassador</div>
          <div style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">${veiligBedrijf}</div>
        </td></tr>
        <tr><td style="background:#ffffff; padding:28px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; color:#1f1f1f;">
            <tr><td style="padding:6px 0; color:#575760; width:140px;">Naam</td><td style="padding:6px 0;"><strong>${veiligNaam}</strong></td></tr>
            <tr><td style="padding:6px 0; color:#575760;">Email</td><td style="padding:6px 0;"><a href="mailto:${veiligEmail}" style="color:#1f1f1f;">${veiligEmail}</a></td></tr>
            <tr><td style="padding:6px 0; color:#575760;">Bedrijf</td><td style="padding:6px 0;">${veiligBedrijf}</td></tr>
            <tr><td style="padding:6px 0; color:#575760;">Sector</td><td style="padding:6px 0;">${veiligSector}</td></tr>
            <tr><td style="padding:6px 0; color:#575760;">Teamgrootte</td><td style="padding:6px 0;">${veiligTeam}</td></tr>
            <tr><td style="padding:6px 0; color:#575760;">Urgentie</td><td style="padding:6px 0;">${veiligUrgentie}</td></tr>
            ${veiligBrand ? `<tr><td style="padding:6px 0; color:#575760;">Imagine-brand</td><td style="padding:6px 0;">${veiligBrand}</td></tr>` : ""}
          </table>
          <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,0,0,0.08);">
            <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#575760; margin-bottom:8px;">Interesse (samenvatting)</div>
            <div style="font-size:13px; line-height:1.6; color:#1f1f1f; white-space:pre-wrap;">${veiligInteresse}</div>
          </div>
        </td></tr>
        <tr><td style="background:#ffffff; padding:0 36px 28px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#575760; margin:8px 0 12px;">Transcript</div>
          <div style="background:#fafbfc; border:1px solid rgba(0,0,0,0.06); border-radius:10px; padding:14px;">
            ${transcriptHtml(messages)}
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const subject = `Brand Ambassador lead — ${sanitizeHeader(lead.bedrijf ?? lead.email, 120)}`;

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "brand-ambassador@maisonblender.com",
          to: ["karl@maisonblender.com"],
          reply_to: lead.email,
          subject,
          html: emailHtml,
        }),
      });
    } catch (err) {
      console.error("[BA-lead] Resend error:", err);
    }
  } else if (isDev) {
    console.log("[BA-lead] Captured (no RESEND_API_KEY):", { lead, brand });
  }

  return Response.json({ ok: true });
}
