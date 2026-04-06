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
      actieplanTekst = `# AI Actieplan\n\nAI Readiness Score: ${resultaat.aiReadinessScore}/100\nROI Potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar`;
    }
  } else {
    actieplanTekst = `# AI Actieplan\n\nAI Readiness Score: ${resultaat.aiReadinessScore}/100\nROI Potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar`;
  }

  // Stuur e-mail via Resend
  if (resendKey) {
    const naamLabel = naam ? `Beste ${naam},` : "Beste ondernemer,";
    const bedrijfLabel = bedrijf ? ` van ${bedrijf}` : "";

    const emailHtml = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
  <div style="background: #0a0a0a; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">MAISON BLNDR</h1>
    <p style="color: #a0a0a0; margin: 8px 0 0;">Jouw gepersonaliseerd AI Actieplan</p>
  </div>

  <p>${naamLabel}</p>
  <p>Bedankt voor het invullen van de gratis AI Quickscan${bedrijfLabel}. Hieronder vind je jouw gepersonaliseerde AI Actieplan.</p>

  <div style="background: #f5f5f5; border-left: 4px solid #0a0a0a; padding: 20px; margin: 20px 0; border-radius: 4px;">
    <h2 style="margin-top: 0;">Jouw resultaten</h2>
    <p><strong>AI Readiness Score:</strong> ${resultaat.aiReadinessScore}/100 (${resultaat.scoreLabel})</p>
    <p><strong>Beter dan:</strong> ${resultaat.benchmarkPercentiel}% van vergelijkbare bedrijven</p>
    <p><strong>ROI potentieel:</strong> €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar</p>
    <p><strong>Tijdsbesparing:</strong> ${resultaat.tijdsbesparingTotaal} uur/week</p>
  </div>

  <div style="background: white; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
    ${actieplanTekst.replace(/\n/g, "<br>").replace(/#{1,3} (.*)/g, "<strong>$1</strong>")}
  </div>

  <div style="background: #0a0a0a; color: white; padding: 24px; border-radius: 8px; text-align: center; margin-top: 30px;">
    <h2 style="margin-top: 0; color: white;">Klaar om te starten?</h2>
    <p style="color: #a0a0a0;">Plan een gratis 30-minuten strategiegesprek en ontdek hoe MAISON BLNDR jouw AI-kansen concreet maakt.</p>
    <a href="https://maisonblender.com/#contact" style="background: white; color: #0a0a0a; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 8px;">
      Plan gratis strategiegesprek
    </a>
  </div>

  <p style="color: #a0a0a0; font-size: 12px; margin-top: 30px;">
    MAISON BLNDR | Burg. Coonenplein 37, 6141BZ Sittard | <a href="mailto:info@maisonblender.com">info@maisonblender.com</a>
  </p>
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
