import type { NextRequest } from "next/server";
import { after } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { berekenAiReadinessScore, bepaalScoreLabel, bepaalScoreBeschrijving, berekenOpportunityMap, berekenGovernanceRisico, berekenCultuurReadiness } from "@/lib/quickscan/scoring";
import { berekenTopKansen, berekenTotaalROI } from "@/lib/quickscan/roi";
import { buildAnalysePrompt } from "@/lib/quickscan/prompt";
import { addNoteForLead } from "@/lib/quickscan/crm";
import type { ScanAntwoorden, ScanResultaat } from "@/lib/quickscan/types";

export async function POST(request: NextRequest) {
  let payload:
    | ScanAntwoorden
    | { antwoorden: ScanAntwoorden; bedrijf?: string; email?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige invoer." }, { status: 400 });
  }

  // Backwards compat: payload kan direct ScanAntwoorden zijn, of { antwoorden, bedrijf, email }
  const antwoorden: ScanAntwoorden =
    "antwoorden" in payload ? payload.antwoorden : (payload as ScanAntwoorden);
  const bedrijf: string | undefined =
    "antwoorden" in payload ? payload.bedrijf : undefined;
  const email: string | undefined =
    "antwoorden" in payload ? payload.email : undefined;

  if (!antwoorden.sector || !antwoorden.omvang || !antwoorden.techStack || !antwoorden.pijnpunten?.length || !antwoorden.aiMaturiteit) {
    return Response.json({ error: "Vul alle stappen in." }, { status: 400 });
  }

  // Rate limiting: max 3 scans per IP per hour
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(`analyze:${ip}`, 3, 60 * 60 * 1000);
  if (!rateCheck.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer het opnieuw over ${rateCheck.retryAfterSeconds} seconden.` },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  // Bereken score en kansen
  const aiReadinessScore = berekenAiReadinessScore(antwoorden);
  const scoreLabel = bepaalScoreLabel(aiReadinessScore);
  const scoreBeschrijving = bepaalScoreBeschrijving(aiReadinessScore, scoreLabel);
  const opportunityMapData = berekenOpportunityMap(antwoorden);
  const topKansen = berekenTopKansen(antwoorden);
  const { roiTotaal, tijdsbesparingTotaal } = berekenTotaalROI(topKansen);
  const governanceRisico = berekenGovernanceRisico(antwoorden);
  const cultuurReadiness = berekenCultuurReadiness(antwoorden);

  // Sectorgemiddelde (in sync met scoring.ts; inline om circulaire deps te vermijden)
  const SECTOR_BENCHMARKS: Record<string, number> = {
    bouw: 24,
    financieel: 48,
    horeca: 22,
    logistiek: 38,
    onderwijs: 30,
    overheid: 28,
    productie: 32,
    retail: 42,
    technologie: 55,
    zakelijk_dienstverlening: 45,
    zorg: 28,
    anders: 35,
  };
  const sectorBenchmark = SECTOR_BENCHMARKS[antwoorden.sector] ?? 35;

  // Benchmark percentiel (herbereken inline)
  function erf(x: number): number {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  const z = (aiReadinessScore - sectorBenchmark) / 15;
  const benchmarkPercentiel = Math.round(Math.min(99, Math.max(1, 0.5 * (1 + erf(z / Math.sqrt(2))) * 100)));

  const resultaat: ScanResultaat = {
    aiReadinessScore,
    benchmarkPercentiel,
    sectorBenchmark,
    topKansen,
    opportunityMapData,
    roiTotaal,
    tijdsbesparingTotaal,
    aanbevelingen: [],
    scoreLabel,
    scoreBeschrijving,
    governanceRisico,
    cultuurReadiness,
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Dev fallback: return static resultaat zonder AI-tekst
    return Response.json({
      resultaat,
      analysetekst: `Analyse voor ${antwoorden.sector} bedrijf met ${antwoorden.omvang} medewerkers. Score: ${aiReadinessScore}/100.`,
    });
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildAnalysePrompt(antwoorden, resultaat, { bedrijf });

  // Stream de AI-analyse terug naar de client
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Stuur eerst de berekende resultaten als JSON event
      const metaChunk = `data: ${JSON.stringify({ type: "meta", resultaat })}\n\n`;
      controller.enqueue(encoder.encode(metaChunk));

      let volledigeTekst = "";

      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            volledigeTekst += event.delta.text;
            const textChunk = `data: ${JSON.stringify({ type: "text", delta: event.delta.text })}\n\n`;
            controller.enqueue(encoder.encode(textChunk));
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      } catch (err) {
        console.error("Anthropic stream error:", err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message: "AI analyse tijdelijk niet beschikbaar." })}\n\n`)
        );
      } finally {
        controller.close();

        // Bewaar de gegenereerde scherm-analyse als note in Twenty (best-effort).
        // Via after() zodat de fetch naar Twenty mag voltooien NA de stream-close
        // ipv door Vercel serverless gekild te worden.
        if (email && volledigeTekst.trim()) {
          const datum = new Date().toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" });
          const noteBody = `# AI Analyse op scherm — ${datum}\n\n${volledigeTekst}\n\n---\n*Gegenereerd door Claude voor ${bedrijf ?? "klant"} — Score ${resultaat.aiReadinessScore}/100*`;
          after(async () => {
            try {
              await addNoteForLead(
                email,
                `AI Analyse (scherm) — ${bedrijf ?? "klant"} — ${datum}`,
                noteBody
              );
            } catch (noteErr) {
              console.warn("[Analyze] Note pushen naar Twenty mislukt:", noteErr);
            }
          });
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
