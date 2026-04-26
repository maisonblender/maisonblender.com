/**
 * Shared lead-notificatie helper voor de Brand Ambassador.
 *
 * Wordt aangeroepen vanuit:
 *  - `/api/brand-ambassador/chat` — wanneer Claude tijdens een gesprek via de
 *    `capture_lead` tool genoeg info + toestemming heeft verzameld
 *  - `/api/brand-ambassador/lead` — wanneer de bezoeker expliciet het
 *    briefing-formulier invult
 *
 * Doet twee dingen:
 *  1. Push naar Twenty CRM (via `pushAmbassadorLead`, silent-fail)
 *  2. Stuur HTML-notificatie naar karl@maisonblender.com via Resend
 *
 * De `variant` param past subtiel subject + label aan zodat ik in de inbox
 * meteen zie of een lead spontaan in het gesprek viel of via het formulier.
 */

import { escapeHtml, sanitizeHeader } from "@/lib/security/escape";
import { pushAmbassadorLead } from "./crm";
import type { AmbassadorLead, BrandContext, ChatMessage } from "./types";

export type NotifyVariant = "conversational" | "briefing";

const NOTIFY_EMAIL = "karl@maisonblender.com";
const FROM_EMAIL = "brand-ambassador@maisonblender.com";

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

function row(labelRaw: string, valueRaw: string): string {
  const label = escapeHtml(labelRaw);
  const value = escapeHtml(valueRaw);
  return `<tr><td style="padding:6px 0; color:#575760; width:140px;">${label}</td><td style="padding:6px 0;"><strong>${value}</strong></td></tr>`;
}

function buildEmailHtml(
  lead: AmbassadorLead,
  messages: ChatMessage[],
  brand: BrandContext | null | undefined,
  variant: NotifyVariant
): string {
  const label =
    variant === "conversational"
      ? "Spontane lead — Brand Ambassador gesprek"
      : "Nieuwe briefing — Brand Ambassador";

  const veiligBedrijf = lead.bedrijf ?? "—";
  const veiligBrand = brand ? escapeHtml(brand.name) : null;

  const rows: string[] = [];
  rows.push(row("Naam", lead.naam ?? "—"));
  rows.push(row("Email", lead.email ?? "—"));
  rows.push(row("Telefoon", lead.telefoon ?? "—"));
  rows.push(row("Bedrijf", veiligBedrijf));
  rows.push(row("Rol", lead.rol ?? "—"));
  rows.push(row("Sector", lead.sector ?? "—"));
  rows.push(row("Teamgrootte", lead.teamgrootte ?? "—"));
  rows.push(row("Urgentie", lead.urgentie ?? "—"));
  rows.push(
    row(
      "Toestemming contact",
      lead.toestemming_contact ? "Ja — expliciet bevestigd" : "Nee / onbekend"
    )
  );
  if (veiligBrand) {
    rows.push(
      `<tr><td style="padding:6px 0; color:#575760;">Imagine-brand</td><td style="padding:6px 0;"><strong>${veiligBrand}</strong></td></tr>`
    );
  }

  const interesse = escapeHtml(lead.interesse ?? "—");
  const veiligBedrijfHeader = escapeHtml(veiligBedrijf);
  const labelEsc = escapeHtml(label);

  return `<!DOCTYPE html>
<html lang="nl"><head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#f2f3f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f5; padding:40px 20px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%;">
        <tr><td style="background:#1f1f1f; padding:28px 36px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#22c55e; margin-bottom:4px;">${labelEsc}</div>
          <div style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">${veiligBedrijfHeader}</div>
        </td></tr>
        <tr><td style="background:#ffffff; padding:28px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; color:#1f1f1f;">
            ${rows.join("")}
          </table>
          <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,0,0,0.08);">
            <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#575760; margin-bottom:8px;">Interesse (samenvatting)</div>
            <div style="font-size:13px; line-height:1.6; color:#1f1f1f; white-space:pre-wrap;">${interesse}</div>
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
}

async function sendNotifyEmail(
  lead: AmbassadorLead,
  messages: ChatMessage[],
  brand: BrandContext | null | undefined,
  variant: NotifyVariant
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[BA-notify] RESEND_API_KEY niet gezet — skip (variant=${variant}, email=${lead.email ?? "geen"}, tel=${lead.telefoon ?? "geen"})`
      );
    }
    return;
  }

  const kanaal =
    variant === "conversational" ? "conversational lead" : "briefing";
  const identifier =
    lead.bedrijf ?? lead.naam ?? lead.email ?? lead.telefoon ?? "onbekend";
  const subject = `Brand Ambassador ${kanaal} — ${sanitizeHeader(identifier, 120)}`;

  try {
    const body: Record<string, unknown> = {
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      subject,
      html: buildEmailHtml(lead, messages, brand, variant),
    };
    // Reply-to alleen zetten als we een geldig email hebben.
    if (lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      body.reply_to = lead.email;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error(`[BA-notify] Resend ${res.status}: ${txt.slice(0, 400)}`);
    }
  } catch (err) {
    console.error("[BA-notify] Resend fetch error:", err);
  }
}

/**
 * Centrale lead-notificatie. Doet zowel CRM push (Twenty) als email naar
 * Karl. Bij falen van een van beide blijft de andere doorgaan (silent-fail
 * pattern). Beiden zijn "nice to have" tov de user-facing chat response.
 */
export async function notifyLead(
  lead: AmbassadorLead,
  messages: ChatMessage[],
  brand: BrandContext | null | undefined,
  variant: NotifyVariant
): Promise<void> {
  // Parallel uitvoeren — beide zijn onafhankelijk van elkaar.
  await Promise.allSettled([
    pushAmbassadorLead(lead, messages, brand).catch((err) => {
      console.warn("[BA-notify] CRM push mislukt:", err);
    }),
    sendNotifyEmail(lead, messages, brand, variant),
  ]);
}
