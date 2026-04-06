import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildActieplanPrompt } from "@/lib/quickscan/prompt";
import type { ScanAntwoorden, ScanResultaat } from "@/lib/quickscan/types";

interface LeadRequest {
  email: string;
  naam?: string;
  bedrijf?: string;
  antwoorden: ScanAntwoorden;
  resultaat: ScanResultaat;
}

// Convert markdown sections to clean HTML for email, no markdown chars in output
function actieplanToHtml(text: string): string {
  const lines = text.replace(/—/g, "-").split("\n");
  let html = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Headings: ## or **Heading**
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/) || line.match(/^\*\*(.+?)\*\*:?\s*$/);
    if (headingMatch) {
      const heading = headingMatch[1].replace(/\*\*/g, "");
      html += `<h3 style="margin: 20px 0 6px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #1f1f1f;">${heading}</h3>`;
      continue;
    }

    // Bullets
    if (/^[-*]\s+/.test(line)) {
      const item = line.replace(/^[-*]\s+/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html += `<div style="display: flex; gap: 8px; margin-bottom: 6px; font-size: 14px; color: #575760; line-height: 1.6;">
        <span style="margin-top: 8px; width: 4px; height: 4px; border-radius: 50%; background: #b2b2be; flex-shrink: 0; display: inline-block;"></span>
        <span>${item}</span>
      </div>`;
      continue;
    }

    // Paragraph
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

  const { email, naam, bedrijf, antwoorden, resultaat } = body;

  if (!email || !antwoorden || !resultaat) {
    return Response.json({ error: "E-mailadres en scanresultaten zijn verplicht." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Genereer gepersonaliseerd actieplan via Claude
  let actieplanTekst = "";
  if (anthropicKey) {
    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const prompt = buildActieplanPrompt(antwoorden, resultaat);
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      });
      actieplanTekst = response.content
        .filter((block) => block.type === "text")
        .map((block) => (block as { type: "text"; text: string }).text)
        .join("");
    } catch (err) {
      console.error("Actieplan generatie mislukt:", err);
      actieplanTekst = `## Jouw AI Actieplan\n\nAI Readiness Score: ${resultaat.aiReadinessScore}/100\nROI Potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar`;
    }
  } else {
    actieplanTekst = `## Jouw AI Actieplan\n\nAI Readiness Score: ${resultaat.aiReadinessScore}/100\nROI Potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar`;
  }

  // Stuur e-mail via Resend
  if (resendKey) {
    const naamLabel = naam ? naam : "ondernemer";
    const bedrijfLabel = bedrijf ? ` van ${bedrijf}` : "";
    const scoreLabel = resultaat.scoreLabel.charAt(0).toUpperCase() + resultaat.scoreLabel.slice(1);

    const actieplanHtml = actieplanToHtml(actieplanTekst);

    const emailHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jouw AI Actieplan - MAISON BLNDR</title>
</head>
<body style="margin: 0; padding: 0; background: #f2f3f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f2f3f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: #1f1f1f; padding: 32px 40px; text-align: left;">
              <div style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">MAISON BLNDR</div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em;">AI Actieplan</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="background: #ffffff; padding: 40px 40px 32px;">
              <p style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #1f1f1f; letter-spacing: -0.4px;">Beste ${naamLabel},</p>
              <p style="margin: 0; font-size: 15px; color: #575760; line-height: 1.7;">
                Bedankt voor het invullen van de gratis AI Quickscan${bedrijfLabel}.
                Op basis van jouw antwoorden heeft onze AI een gepersonaliseerd actieplan samengesteld.
                Hieronder vind je jouw resultaten en de aanbevolen eerste stappen.
              </p>
            </td>
          </tr>

          <!-- Score strip -->
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
                          <div style="font-size: 28px; font-weight: 700; color: #1f1f1f; line-height: 1;">${scoreLabel}</div>
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
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Actieplan divider -->
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

          <!-- Actieplan body -->
          <tr>
            <td style="background: #ffffff; padding: 16px 40px 40px;">
              ${actieplanHtml}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background: #1f1f1f; padding: 36px 40px; text-align: center;">
              <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.3px;">Klaar voor de volgende stap?</div>
              <p style="margin: 0 0 24px; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6;">
                Plan een gratis 30-minuten strategiegesprek en ontdek hoe MAISON BLNDR<br>
                jouw AI-kansen concreet maakt.
              </p>
              <a href="https://maisonblender.com/quickscan" style="display: inline-block; background: #ffffff; color: #1f1f1f; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: -0.1px;">
                Plan gratis strategiegesprek
              </a>
            </td>
          </tr>

          <!-- Footer -->
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
          to: [email],
          bcc: ["info@maisonblender.com"],
          subject: `Jouw AI Actieplan - Score ${resultaat.aiReadinessScore}/100 | MAISON BLNDR`,
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
    // Dev mode: log
    console.log("Lead captured (no RESEND_API_KEY):", { email, naam, bedrijf, score: resultaat.aiReadinessScore });
  }

  return Response.json({ ok: true, actieplan: actieplanTekst });
}
