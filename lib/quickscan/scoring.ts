import type { ScanAntwoorden, ScanResultaat, KansItem, OpportunityMapItem } from "./types";

// Sector benchmark data (gemiddelde AI Readiness Score per sector, gebaseerd op marktonderzoek)
const SECTOR_BENCHMARKS: Record<string, number> = {
  productie: 32,
  logistiek: 38,
  zorg: 28,
  retail: 42,
  zakelijk_dienstverlening: 45,
  bouw: 24,
  horeca: 22,
  overig: 35,
};

// Hoeveel % van vergelijkbare MKB-bedrijven scoort lager (benchmark curve)
function berekenBenchmarkPercentiel(score: number, sectorGemiddelde: number): number {
  // Normaal verdeeld rond sectorgemiddelde, std dev ~15 punten
  const z = (score - sectorGemiddelde) / 15;
  // Benader normale cumulatieve verdeling
  const p = 0.5 * (1 + erf(z / Math.sqrt(2)));
  return Math.round(Math.min(99, Math.max(1, p * 100)));
}

function erf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export function berekenAiReadinessScore(antwoorden: ScanAntwoorden): number {
  let score = 0;

  // Tech stack (max 30 punten)
  const techScores: Record<string, number> = {
    geen_systemen: 0,
    basis_office: 8,
    erp_crm: 16,
    cloud_first: 24,
    al_ai_gebruik: 30,
  };
  score += techScores[antwoorden.techStack] ?? 0;

  // AI maturiteit (max 35 punten)
  const maturiteitScores: Record<string, number> = {
    geen_ai: 0,
    experimenteren: 12,
    productief_gebruik: 24,
    ai_core: 35,
  };
  score += maturiteitScores[antwoorden.aiMaturiteit] ?? 0;

  // Omvang (grotere bedrijven hebben meer resources, max 10 punten)
  const omvangScores: Record<string, number> = {
    "1-10": 4,
    "11-50": 7,
    "51-200": 9,
    "200+": 10,
  };
  score += omvangScores[antwoorden.omvang] ?? 0;

  // Budget bereidheid (max 15 punten)
  const budgetScores: Record<string, number> = {
    laag: 3,
    midden: 9,
    hoog: 15,
  };
  score += budgetScores[antwoorden.budgetBereidheid] ?? 0;

  // Implementatiesnelheid (max 10 punten)
  const snelheidScores: Record<string, number> = {
    direct: 10,
    kwartaal: 6,
    jaar: 2,
  };
  score += snelheidScores[antwoorden.implementatieSnelheid] ?? 0;

  return Math.min(100, Math.round(score));
}

export function bepaalScoreLabel(score: number): ScanResultaat["scoreLabel"] {
  if (score < 20) return "beginner";
  if (score < 40) return "bewust";
  if (score < 60) return "actief";
  if (score < 80) return "voorloper";
  return "koploper";
}

export function bepaalScoreBeschrijving(score: number, label: ScanResultaat["scoreLabel"]): string {
  const beschrijvingen: Record<ScanResultaat["scoreLabel"], string> = {
    beginner: "Je bedrijf staat aan het begin van de AI-reis. Dit is het perfecte moment om strategisch te starten - vroege movers hebben een significant concurrentievoordeel.",
    bewust: "Je bent je bewust van AI-kansen maar de implementatie is nog beperkt. Met gerichte pilots kun je snel concrete resultaten boeken.",
    actief: "Je gebruikt AI al productief. De volgende stap is het schalen en integreren van AI in meer kernprocessen voor maximale impact.",
    voorloper: "Je loopt voorop in jouw sector. Focus nu op geavanceerde use cases en het bouwen van een duurzaam AI-concurrentievoordeel.",
    koploper: "Je bent een AI-koploper in de markt. Blijf innoveren en overweeg AI als een kerncompetentie van je organisatie te positioneren.",
  };
  return beschrijvingen[label];
}

export function berekenOpportunityMap(antwoorden: ScanAntwoorden): OpportunityMapItem[] {
  const map: OpportunityMapItem[] = [
    { gebied: "Klantenservice", potentieel: 0 },
    { gebied: "Administratie", potentieel: 0 },
    { gebied: "Sales & Marketing", potentieel: 0 },
    { gebied: "Operations", potentieel: 0 },
    { gebied: "HR & Planning", potentieel: 0 },
    { gebied: "Data & Rapportage", potentieel: 0 },
  ];

  // Base potentieel op pijnpunten
  const pijnpuntMapping: Record<string, string[]> = {
    repetitief_handwerk: ["Administratie", "Operations"],
    klantcommunicatie: ["Klantenservice", "Sales & Marketing"],
    data_analyse: ["Data & Rapportage", "Operations"],
    documentverwerking: ["Administratie", "Operations"],
    planning_roostering: ["HR & Planning", "Operations"],
    kwaliteitscontrole: ["Operations", "Administratie"],
  };

  // Voeg potentieel toe op basis van geselecteerde pijnpunten
  for (const pijnpunt of antwoorden.pijnpunten) {
    const gebieden = pijnpuntMapping[pijnpunt] ?? [];
    for (const gebied of gebieden) {
      const item = map.find((m) => m.gebied === gebied);
      if (item) {
        item.potentieel = Math.min(100, item.potentieel + 30);
      }
    }
  }

  // Schaal op basis van tech stack en maturiteit
  const multiplier =
    antwoorden.techStack === "cloud_first" || antwoorden.techStack === "al_ai_gebruik"
      ? 1.2
      : antwoorden.techStack === "erp_crm"
        ? 1.0
        : 0.8;

  return map.map((item) => ({
    ...item,
    potentieel: Math.min(100, Math.round(item.potentieel * multiplier)),
  }));
}

export function berekenResultaat(antwoorden: ScanAntwoorden): Omit<ScanResultaat, "topKansen" | "aanbevelingen"> {
  const score = berekenAiReadinessScore(antwoorden);
  const label = bepaalScoreLabel(score);
  const sectorBenchmark = SECTOR_BENCHMARKS[antwoorden.sector] ?? 35;
  const benchmarkPercentiel = berekenBenchmarkPercentiel(score, sectorBenchmark);
  const opportunityMapData = berekenOpportunityMap(antwoorden);

  return {
    aiReadinessScore: score,
    benchmarkPercentiel,
    sectorBenchmark,
    opportunityMapData,
    roiTotaal: 0, // Berekend in roi.ts
    tijdsbesparingTotaal: 0, // Berekend in roi.ts
    scoreLabel: label,
    scoreBeschrijving: bepaalScoreBeschrijving(score, label),
  };
}
