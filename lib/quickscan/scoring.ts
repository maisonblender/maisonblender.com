import type { ScanAntwoorden, ScanResultaat, OpportunityMapItem } from "./types";

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

function berekenBenchmarkPercentiel(score: number, sectorGemiddelde: number): number {
  const z = (score - sectorGemiddelde) / 15;
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

  // Tech stack (max 25 punten)
  const techScores: Record<string, number> = {
    geen_systemen: 0,
    basis_office: 6,
    erp_crm: 13,
    cloud_first: 20,
    al_ai_gebruik: 25,
  };
  score += techScores[antwoorden.techStack] ?? 0;

  // AI maturiteit (max 30 punten)
  const maturiteitScores: Record<string, number> = {
    geen_ai: 0,
    experimenteren: 10,
    productief_gebruik: 20,
    ai_core: 30,
  };
  score += maturiteitScores[antwoorden.aiMaturiteit] ?? 0;

  // Omvang (max 8 punten)
  const omvangScores: Record<string, number> = {
    "1-10": 3,
    "11-50": 5,
    "51-200": 7,
    "200+": 8,
  };
  score += omvangScores[antwoorden.omvang] ?? 0;

  // Budget bereidheid (max 12 punten)
  const budgetScores: Record<string, number> = {
    laag: 2,
    midden: 7,
    hoog: 12,
  };
  score += budgetScores[antwoorden.budgetBereidheid] ?? 0;

  // Implementatiesnelheid (max 8 punten)
  const snelheidScores: Record<string, number> = {
    direct: 8,
    kwartaal: 5,
    jaar: 1,
  };
  score += snelheidScores[antwoorden.implementatieSnelheid] ?? 0;

  // Datakwaliteit (max 8 punten) — nieuw
  const dataKwaliteitScores: Record<string, number> = {
    verspreid_inconsistent: 0,
    structureel_geisoleerd: 4,
    centraal_goed: 8,
  };
  score += dataKwaliteitScores[antwoorden.dataKwaliteit ?? "verspreid_inconsistent"] ?? 0;

  // Team sentiment (max 5 punten) — nieuw
  const sentimentScores: Record<string, number> = {
    enthousiast: 5,
    verdeeld: 3,
    sceptisch: 1,
    onbekend: 2,
  };
  score += sentimentScores[antwoorden.teamSentiment ?? "onbekend"] ?? 0;

  // Privacy beleid (max 4 punten) — nieuw: goed beleid = betere AI-readiness
  const privacyScores: Record<string, number> = {
    geen_richtlijnen: 0,
    informele_afspraken: 1,
    formeel_avg: 3,
    iso_gecertificeerd: 4,
  };
  score += privacyScores[antwoorden.privacyBeleid ?? "geen_richtlijnen"] ?? 0;

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
    beginner: "Je bedrijf staat aan het begin van de AI-reis. Dit is het perfecte moment om strategisch te starten — vroege movers bouwen een significant concurrentievoordeel op.",
    bewust: "Je bent je bewust van AI-kansen maar de implementatie is nog beperkt. Met gerichte pilots kun je snel concrete resultaten boeken.",
    actief: "Je gebruikt AI al productief. De volgende stap is het schalen en integreren van AI in meer kernprocessen voor maximale impact.",
    voorloper: "Je loopt voorop in jouw sector. Focus nu op geavanceerde use cases en het bouwen van een duurzaam AI-concurrentievoordeel.",
    koploper: "Je bent een AI-koploper in de markt. Blijf innoveren en positioneer AI als een kerncompetentie van je organisatie.",
  };
  return beschrijvingen[label];
}

export function berekenGovernanceRisico(antwoorden: ScanAntwoorden): ScanResultaat["governanceRisico"] {
  let risicoPunten = 0;

  // Gevoelige data zonder beleid = hoog risico
  const heeftGevoeligeData =
    antwoorden.gevoeligeData &&
    !antwoorden.gevoeligeData.includes("geen") &&
    antwoorden.gevoeligeData.length > 0;

  if (heeftGevoeligeData) risicoPunten += 2;

  const privacyRisico: Record<string, number> = {
    geen_richtlijnen: 3,
    informele_afspraken: 2,
    formeel_avg: 0,
    iso_gecertificeerd: 0,
  };
  risicoPunten += privacyRisico[antwoorden.privacyBeleid ?? "geen_richtlijnen"] ?? 0;

  if (antwoorden.aiZorgen?.includes("dataveiligheid")) risicoPunten += 1;
  if (antwoorden.aiZorgen?.includes("compliance")) risicoPunten += 1;

  if (risicoPunten >= 4) return "hoog";
  if (risicoPunten >= 2) return "midden";
  return "laag";
}

export function berekenCultuurReadiness(antwoorden: ScanAntwoorden): ScanResultaat["cultuurReadiness"] {
  let punten = 0;

  const sentimentPunten: Record<string, number> = {
    enthousiast: 3,
    verdeeld: 2,
    sceptisch: 0,
    onbekend: 1,
  };
  punten += sentimentPunten[antwoorden.teamSentiment ?? "onbekend"] ?? 0;

  const trekkerPunten: Record<string, number> = {
    directie: 3,
    it_manager: 2,
    geen_centrale_trekker: 0,
  };
  punten += trekkerPunten[antwoorden.digitaleAgendasTrekker ?? "geen_centrale_trekker"] ?? 0;

  // Zorgen over banenverlies verlagen readiness
  if (antwoorden.aiZorgen?.includes("banenverlies")) punten -= 1;
  if (antwoorden.aiZorgen?.includes("geen_zorgen")) punten += 1;

  if (punten >= 5) return "hoog";
  if (punten >= 3) return "midden";
  return "laag";
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

  const pijnpuntMapping: Record<string, string[]> = {
    repetitief_handwerk: ["Administratie", "Operations"],
    klantcommunicatie: ["Klantenservice", "Sales & Marketing"],
    data_analyse: ["Data & Rapportage", "Operations"],
    documentverwerking: ["Administratie", "Operations"],
    planning_roostering: ["HR & Planning", "Operations"],
    kwaliteitscontrole: ["Operations", "Administratie"],
    hr_recruitment: ["HR & Planning"],
    inkoop_leveranciers: ["Operations", "Administratie"],
    marketing_content: ["Sales & Marketing"],
  };

  for (const pijnpunt of antwoorden.pijnpunten) {
    const gebieden = pijnpuntMapping[pijnpunt] ?? [];
    for (const gebied of gebieden) {
      const item = map.find((m) => m.gebied === gebied);
      if (item) item.potentieel = Math.min(100, item.potentieel + 28);
    }
  }

  // Schaal op basis van tech stack en datakwaliteit
  const techMultiplier =
    antwoorden.techStack === "cloud_first" || antwoorden.techStack === "al_ai_gebruik"
      ? 1.2
      : antwoorden.techStack === "erp_crm"
        ? 1.0
        : 0.75;

  const dataMultiplier =
    antwoorden.dataKwaliteit === "centraal_goed"
      ? 1.15
      : antwoorden.dataKwaliteit === "structureel_geisoleerd"
        ? 1.0
        : 0.8;

  return map.map((item) => ({
    ...item,
    potentieel: Math.min(100, Math.round(item.potentieel * techMultiplier * dataMultiplier)),
  }));
}

export function berekenResultaat(antwoorden: ScanAntwoorden): Omit<ScanResultaat, "topKansen" | "aanbevelingen"> {
  const score = berekenAiReadinessScore(antwoorden);
  const label = bepaalScoreLabel(score);
  const sectorBenchmark = SECTOR_BENCHMARKS[antwoorden.sector] ?? 35;
  const benchmarkPercentiel = berekenBenchmarkPercentiel(score, sectorBenchmark);
  const opportunityMapData = berekenOpportunityMap(antwoorden);
  const governanceRisico = berekenGovernanceRisico(antwoorden);
  const cultuurReadiness = berekenCultuurReadiness(antwoorden);

  return {
    aiReadinessScore: score,
    benchmarkPercentiel,
    sectorBenchmark,
    opportunityMapData,
    roiTotaal: 0,
    tijdsbesparingTotaal: 0,
    scoreLabel: label,
    scoreBeschrijving: bepaalScoreBeschrijving(score, label),
    governanceRisico,
    cultuurReadiness,
  };
}
