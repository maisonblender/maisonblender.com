import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import {
  berekenAiReadinessScore,
  bepaalScoreLabel,
  bepaalScoreBeschrijving,
  berekenOpportunityMap,
  berekenGovernanceRisico,
  berekenCultuurReadiness,
} from "@/lib/quickscan/scoring";
import { berekenTopKansen, berekenTotaalROI } from "@/lib/quickscan/roi";
import { pushLeadToTwenty } from "@/lib/quickscan/crm";
import type { ScanAntwoorden, ScanResultaat, LeadGegevens } from "@/lib/quickscan/types";

interface CaptureLeadRequest {
  lead: LeadGegevens;
  antwoorden: ScanAntwoorden;
}

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

function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function berekenVolledigResultaat(antwoorden: ScanAntwoorden): ScanResultaat {
  const aiReadinessScore = berekenAiReadinessScore(antwoorden);
  const scoreLabel = bepaalScoreLabel(aiReadinessScore);
  const scoreBeschrijving = bepaalScoreBeschrijving(aiReadinessScore, scoreLabel);
  const opportunityMapData = berekenOpportunityMap(antwoorden);
  const topKansen = berekenTopKansen(antwoorden);
  const { roiTotaal, tijdsbesparingTotaal } = berekenTotaalROI(topKansen);
  const governanceRisico = berekenGovernanceRisico(antwoorden);
  const cultuurReadiness = berekenCultuurReadiness(antwoorden);
  const sectorBenchmark = SECTOR_BENCHMARKS[antwoorden.sector] ?? 35;
  const z = (aiReadinessScore - sectorBenchmark) / 15;
  const benchmarkPercentiel = Math.round(
    Math.min(99, Math.max(1, 0.5 * (1 + erf(z / Math.sqrt(2))) * 100))
  );

  return {
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
}

export async function POST(request: NextRequest) {
  let body: CaptureLeadRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige invoer." }, { status: 400 });
  }

  const { lead, antwoorden } = body;

  if (!lead?.email || !lead?.voornaam || !lead?.achternaam || !lead?.bedrijf || !antwoorden) {
    return Response.json(
      { error: "Voornaam, achternaam, bedrijf, e-mailadres en scan zijn verplicht." },
      { status: 400 }
    );
  }

  if (!lead.toestemming) {
    return Response.json({ error: "Toestemming voor gegevensverwerking is verplicht." }, { status: 400 });
  }

  // Rate limiting: max 5 captures per IP per hour
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(`capture-lead:${ip}`, 5, 60 * 60 * 1000);
  if (!rateCheck.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer het opnieuw over ${rateCheck.retryAfterSeconds} seconden.` },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
    );
  }

  // Bereken resultaat server-side voor consistente CRM data
  const resultaat = berekenVolledigResultaat(antwoorden);

  // Push naar Twenty CRM — awaited zodat lead binnen is vóór de gebruiker resultaten ziet
  await pushLeadToTwenty(lead, antwoorden, resultaat);

  return Response.json({ success: true, resultaat });
}
