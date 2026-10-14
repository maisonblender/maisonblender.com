/**
 * E-mails voor website-aanvragen via Resend: interne notificatie naar info@
 * en een korte ontvangstbevestiging naar de bezoeker.
 *
 * Beide functies geven `true` terug als Resend de mail accepteerde, zodat de
 * API-route kan bepalen of de aanvraag ergens is opgeslagen.
 */

import { escapeHtml, sanitizeHeader } from "@/lib/security/escape";
import type { LeadBron } from "./crm";

const FROM = "MAISON BLNDR <website@maisonblender.com>";
const INTERN_TO = "info@maisonblender.com";

async function sendResend(payload: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("[leads/email] Resend fail:", res.status, err.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[leads/email] Resend fetch error:", err);
    return false;
  }
}

export async function sendInternalLeadNotification(params: {
  subject: string;
  text: string;
  replyTo: string;
}): Promise<boolean> {
  return sendResend({
    from: FROM,
    to: [INTERN_TO],
    reply_to: params.replyTo,
    subject: sanitizeHeader(params.subject, 180),
    text: params.text,
  });
}

const BEVESTIGING_ONDERWERP: Record<LeadBron, string> = {
  Strategiegesprek: "We hebben je aanvraag voor een strategiegesprek ontvangen",
  Contactformulier: "We hebben je bericht ontvangen",
};

export async function sendLeadConfirmation(params: {
  bron: LeadBron;
  naam: string;
  email: string;
}): Promise<boolean> {
  const voornaam = params.naam.trim().split(/\s+/)[0] ?? "";
  const aanvraag = params.bron === "Strategiegesprek" ? "aanvraag voor een strategiegesprek" : "bericht";

  const text = [
    `Hoi ${voornaam},`,
    "",
    `Bedankt voor je ${aanvraag}. We hebben het goed ontvangen en je hoort binnen 1 werkdag van ons.`,
    "",
    "Heb je in de tussentijd een vraag? Antwoord gewoon op deze e-mail of bel +31 (0)46 200 4035.",
    "",
    "Groet,",
    "MAISON BLNDR",
    "Burgemeester Coonenplein 37, 6141 BZ Sittard",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="nl"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:32px 12px;background:#f2f3f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f1f1f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(0,0,0,0.06);">
    <tr><td style="padding:32px;font-size:14px;line-height:1.6;color:#3a3a42;">
      <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#1f1f1f;">Hoi ${escapeHtml(voornaam)},</p>
      <p style="margin:0 0 16px;">Bedankt voor je ${aanvraag}. We hebben het goed ontvangen en je hoort <strong style="color:#1f1f1f;">binnen 1 werkdag</strong> van ons.</p>
      <p style="margin:0 0 24px;">Heb je in de tussentijd een vraag? Antwoord gewoon op deze e-mail of bel <a href="tel:+31462004035" style="color:#1f1f1f;">+31 (0)46 200 4035</a>.</p>
      <p style="margin:0;">Groet,<br/>MAISON BLNDR</p>
    </td></tr>
    <tr><td style="padding:16px 32px;border-top:1px solid rgba(0,0,0,0.06);font-size:11px;color:#b2b2be;">
      MAISON BLNDR · Burgemeester Coonenplein 37, 6141 BZ Sittard
    </td></tr>
  </table>
</body></html>`;

  return sendResend({
    from: FROM,
    to: [params.email],
    reply_to: INTERN_TO,
    subject: BEVESTIGING_ONDERWERP[params.bron],
    html,
    text,
  });
}
