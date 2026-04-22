import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { buildActieplanPrompt } from "@/lib/quickscan/prompt";
import { pushLeadToTwenty } from "@/lib/quickscan/crm";
import type { ScanAntwoorden, ScanResultaat, LeadGegevens } from "@/lib/quickscan/types";

interface LeadRequest {
  lead: LeadGegevens;
  antwoorden: ScanAntwoorden;
  resultaat: ScanResultaat;
}

function actieplanToHtml(text: string): string {
  const lines = text.replace(/—/g, "-").split("\n");
  let html = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const headingMatch = line.match(/^#{1,3}\s+(.+)$/) || line.match(/^\*\*(.+?)\*\*:?\s*$/);
    if (headingMatch) {
      const heading = headingMatch[1].replace(/\*\*/g, "");
      html += `<h3 style="margin: 20px 0 6px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #1f1f1f;">${heading}</h3>`;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const item = line.replace(/^[-*]\s+/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html += `<div style="display: flex; gap: 8px; margin-bottom: 6px; font-size: 14px; color: #575760; line-height: 1.6;">
        <span style="margin-top: 8px; width: 4px; height: 4px; border-radius: 50%; background: #b2b2be; flex-shrink: 0; display: inline-block;"></span>
        <span>${item}</span>
      </div>`;
      continue;
    }

    const para = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html += `<p style="margin: 0 0 12px; font-size: 14px; color: #575760; line-height: 1.7;">${para}</p>`;
  }

  return html;
}

export async function POST(request: NextRequest) {
  let body: LeadRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige invoer." }, { status: 400 });
  }

  const { lead, antwoorden, resultaat } = body;

  if (!lead?.email || !lead?.voornaam || !lead?.bedrijf || !antwoorden || !resultaat) {
    return Response.json({ error: "Naam, bedrijf, e-mailadres en scanresultaten zijn verplicht." }, { status: 400 });
  }

  if (!lead.toestemming) {
    return Response.json({ error: "Toestemming voor gegevensverwerking is verplicht." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lead.email)) {
    return Response.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(`lead:${ip}`, 2, 60 * 60 * 1000);
  if (!rateCheck.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer het opnieuw over ${rateCheck.retryAfterSeconds} seconden.` },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Genereer gepersonaliseerd actieplan via Claude
  let actieplanTekst = "";
  if (anthropicKey) {
    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const prompt = buildActieplanPrompt(antwoorden, resultaat, { naam: `${lead.voornaam} ${lead.achternaam}`.trim(), bedrijf: lead.bedrijf });
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      });
      actieplanTekst = response.content
        .filter((block) => block.type === "text")
        .map((block) => (block as { type: "text"; text: string }).text)
        .join("");
    } catch (err) {
      console.error("Actieplan generatie mislukt:", err);
      actieplanTekst = `## AI Actieplan — ${lead.bedrijf}\n\nAI Readiness Score: ${resultaat.aiReadinessScore}/100\nROI Potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar\nTijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week`;
    }
  } else {
    actieplanTekst = `## AI Actieplan — ${lead.bedrijf}\n\nAI Readiness Score: ${resultaat.aiReadinessScore}/100\nROI Potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar\nTijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week`;
  }

  // Push naar Twenty CRM (awaited — Vercel serverless termineert anders te vroeg)
  await pushLeadToTwenty(lead, antwoorden, resultaat);

  // Stuur e-mail via Resend
  if (resendKey) {
    const scoreLabel = resultaat.scoreLabel.charAt(0).toUpperCase() + resultaat.scoreLabel.slice(1);
    const actieplanHtml = actieplanToHtml(actieplanTekst);
    const telefoonRegel = lead.telefoon
      ? `<td style="width: 25%; text-align: center; padding: 0 0 0 8px; border-left: 1px solid rgba(0,0,0,0.08);">
           <div style="font-size: 18px; font-weight: 700; color: #1f1f1f; line-height: 1;">${lead.telefoon}</div>
           <div style="font-size: 11px; color: #575760; margin-top: 4px;">Telefoonnummer</div>
         </td>`
      : "";

    const emailHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Kansenkaart — MAISON BLNDR</title>
</head>
<body style="margin: 0; padding: 0; background: #f2f3f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f2f3f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <tr>
            <td style="background: #1f1f1f; padding: 32px 40px; text-align: left;">
              <div style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">MAISON BLNDR</div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em;">AI Kansenkaart & Actieplan</div>
            </td>
          </tr>

          <tr>
            <td style="background: #ffffff; padding: 40px 40px 32px;">
              <p style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #1f1f1f; letter-spacing: -0.4px;">Beste ${lead.voornaam},</p>
              <p style="margin: 0; font-size: 15px; color: #575760; line-height: 1.7;">
                Bedankt voor het invullen van de AI Readiness Intake voor <strong>${lead.bedrijf}</strong>.
                Op basis van jouw uitgebreide profiel heeft onze AI een gepersonaliseerde AI Kansenkaart en actieplan samengesteld.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background: #ffffff; padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f2f3f5; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #575760; margin-bottom: 16px;">Jouw scanresultaten</div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 25%; text-align: center; padding: 0 8px 0 0;">
                          <div style="font-size: 28px; font-weight: 700; color: #1f1f1f; line-height: 1;">${resultaat.aiReadinessScore}</div>
                          <div style="font-size: 11px; color: #575760; margin-top: 4px;">Readiness Score</div>
                        </td>
                        <td style="width: 25%; text-align: center; padding: 0 8px; border-left: 1px solid rgba(0,0,0,0.08);">
                          <div style="font-size: 22px; font-weight: 700; color: #1f1f1f; line-height: 1;">${scoreLabel}</div>
                          <div style="font-size: 11px; color: #575760; margin-top: 4px;">Niveau</div>
                        </td>
                        <td style="width: 25%; text-align: center; padding: 0 8px; border-left: 1px solid rgba(0,0,0,0.08);">
                          <div style="font-size: 28px; font-weight: 700; color: #1f1f1f; line-height: 1;">€${(resultaat.roiTotaal / 1000).toFixed(0)}K</div>
                          <div style="font-size: 11px; color: #575760; margin-top: 4px;">ROI potentieel/jaar</div>
                        </td>
                        <td style="width: 25%; text-align: center; padding: 0 0 0 8px; border-left: 1px solid rgba(0,0,0,0.08);">
                          <div style="font-size: 28px; font-weight: 700; color: #1f1f1f; line-height: 1;">${resultaat.tijdsbesparingTotaal}u</div>
                          <div style="font-size: 11px; color: #575760; margin-top: 4px;">Besparing/week</div>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.06);">
                      <tr>
                        <td style="width: 33%; text-align: center; padding: 0 8px 0 0;">
                          <div style="font-size: 14px; font-weight: 600; color: #1f1f1f;">${resultaat.governanceRisico}</div>
                          <div style="font-size: 11px; color: #575760; margin-top: 2px;">Governance risico</div>
                        </td>
                        <td style="width: 33%; text-align: center; padding: 0 8px; border-left: 1px solid rgba(0,0,0,0.08);">
                          <div style="font-size: 14px; font-weight: 600; color: #1f1f1f;">${resultaat.cultuurReadiness}</div>
                          <div style="font-size: 11px; color: #575760; margin-top: 2px;">Cultuur readiness</div>
                        </td>
                        <td style="width: 33%; text-align: center; padding: 0 0 0 8px; border-left: 1px solid rgba(0,0,0,0.08);">
                          <div style="font-size: 14px; font-weight: 600; color: #1f1f1f;">${resultaat.benchmarkPercentiel}%</div>
                          <div style="font-size: 11px; color: #575760; margin-top: 2px;">Beter dan sector</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background: #ffffff; padding: 0 40px 8px;">
              <div style="height: 1px; background: rgba(0,0,0,0.06);"></div>
            </td>
          </tr>
          <tr>
            <td style="background: #ffffff; padding: 24px 40px 0;">
              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #575760;">Jouw gepersonaliseerde AI Actieplan</div>
            </td>
          </tr>

          <tr>
            <td style="background: #ffffff; padding: 16px 40px 40px;">
              ${actieplanHtml}
            </td>
          </tr>

          <tr>
            <td style="background: #1f1f1f; padding: 36px 40px; text-align: center;">
              <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.3px;">Klaar voor de volgende stap?</div>
              <p style="margin: 0 0 24px; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6;">
                Plan een gratis 30-minuten strategiegesprek en ontdek hoe MAISON BLNDR<br>
                jouw AI-kansen concreet maakt.
              </p>
              <a href="https://maisonblender.com/strategiegesprek" style="display: inline-block; background: #ffffff; color: #1f1f1f; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: -0.1px;">
                Plan gratis strategiegesprek
              </a>
            </td>
          </tr>

          <tr>
            <td style="background: #f2f3f5; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #b2b2be; line-height: 1.6;">
                MAISON BLNDR - Burg. Coonenplein 37, 6141BZ Sittard<br>
                <a href="mailto:info@maisonblender.com" style="color: #b2b2be; text-decoration: none;">info@maisonblender.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "quickscan@maisonblender.com",
          to: [lead.email],
          bcc: ["info@maisonblender.com"],
          subject: `AI Kansenkaart ${lead.bedrijf} — Score ${resultaat.aiReadinessScore}/100 | MAISON BLNDR`,
          html: emailHtml,
          text: actieplanTekst,
        }),
      });

      if (!res.ok) {
        console.error("Resend error:", await res.json().catch(() => ({})));
        return Response.json({ error: "E-mail verzenden mislukt. Probeer het later opnieuw." }, { status: 502 });
      }
    } catch (err) {
      console.error("Resend fetch error:", err);
      return Response.json({ error: "E-mail verzenden mislukt." }, { status: 502 });
    }
  } else {
      console.log("Lead captured (no RESEND_API_KEY):", {
      naam: `${lead.voornaam} ${lead.achternaam}`.trim(),
      bedrijf: lead.bedrijf,
      email: lead.email,
      telefoon: lead.telefoon,
      score: resultaat.aiReadinessScore,
    });
  }

  return Response.json({ ok: true, actieplan: actieplanTekst });
}
