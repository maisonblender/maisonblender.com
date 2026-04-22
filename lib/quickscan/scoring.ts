import type { ScanAntwoorden, ScanResultaat, OpportunityMapItem } from "./types";

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

// ─── AI Readiness Score ──────────────────────────────────────────────────
// Score is opgebouwd uit 8 componenten (totaal 100 punten):
// - Tech stack (20)
// - AI maturiteit (20)
// - Datakwaliteit (10) + Systeemintegratie (8) + IT-infrastructuur (6) = data-fundament (24)
// - Budget bereidheid (10) + Implementatiesnelheid (6) = ambitie (16)
// - Team sentiment (5) + Management betrokkenheid (8) = cultuur (13)
// - Privacy beleid (4) + EU AI Act (3) = governance (7)
export function berekenAiReadinessScore(antwoorden: ScanAntwoorden): number {
  let score = 0;

  // Tech stack (max 20)
  const techScores: Record<string, number> = {
    geen_systemen: 0,
    basis_office: 5,
    erp_crm: 11,
    cloud_first: 16,
    al_ai_gebruik: 20,
  };
  score += techScores[antwoorden.techStack] ?? 0;

  // AI maturiteit (max 20) — nu 5 niveaus
  const maturiteitScores: Record<string, number> = {
    geen_ai: 0,
    bewust: 4,
    experimenteel: 9,
    gevorderd: 15,
    expert: 20,
  };
  score += maturiteitScores[antwoorden.aiMaturiteit] ?? 0;

  // Datakwaliteit (max 10) — nu 5 niveaus
  const dataKwaliteitScores: Record<string, number> = {
    chaotisch: 0,
    basis: 3,
    redelijk: 6,
    goed: 8,
    uitstekend: 10,
  };
  score += dataKwaliteitScores[antwoorden.dataKwaliteit] ?? 0;

  // Systeem-integratie (max 8)
  const integratieScores: Record<string, number> = {
    nauwelijks: 0,
    beperkt: 2,
    gedeeltelijk: 4,
    goed: 6,
    uitstekend: 8,
  };
  score += integratieScores[antwoorden.systeemIntegratie] ?? 0;

  // IT-infrastructuur (max 6)
  const itInfraScores: Record<string, number> = {
    cloud_based: 6,
    hybride: 4,
    on_premise: 2,
    weet_niet: 1,
  };
  score += itInfraScores[antwoorden.itInfrastructuur] ?? 0;

  // Budget bereidheid (max 10)
  const budgetScores: Record<string, number> = {
    laag: 2,
    midden: 6,
    hoog: 10,
  };
  score += budgetScores[antwoorden.budgetBereidheid] ?? 0;

  // Implementatiesnelheid (max 6)
  const snelheidScores: Record<string, number> = {
    direct: 6,
    kwartaal: 4,
    jaar: 1,
  };
  score += snelheidScores[antwoorden.implementatieSnelheid] ?? 0;

  // Team sentiment (max 5)
  const sentimentScores: Record<string, number> = {
    enthousiast: 5,
    verdeeld: 3,
    sceptisch: 1,
    onbekend: 2,
  };
  score += sentimentScores[antwoorden.teamSentiment ?? "onbekend"] ?? 0;

  // Management betrokkenheid (max 8) — vervangt digitaleAgendasTrekker
  const mgmtScores: Record<string, number> = {
    niet_betrokken: 0,
    bewust: 2,
    geinteresseerd: 4,
    actief: 6,
    strategisch: 8,
  };
  score += mgmtScores[antwoorden.managementBetrokkenheid] ?? 0;

  // Privacy beleid (max 4) — 5 niveaus
  const privacyScores: Record<string, number> = {
    geen_richtlijnen: 0,
    informele_afspraken: 1,
    basisbeleid: 2,
    formeel_ai_beleid: 3,
    inclusief_toetsing: 4,
  };
  score += privacyScores[antwoorden.privacyBeleid] ?? 0;

  // EU AI Act bekendheid (max 3)
  const euAiActScores: Record<string, number> = {
    nooit_gehoord: 0,
    gehoord_onbekend: 1,
    globaal_bekend: 1,
    goed_bekend: 2,
    volledig_compliant: 3,
  };
  score += euAiActScores[antwoorden.euAiActBekendheid] ?? 0;

  // Bonus: hoge urgentie + bereidheid = readiness boost (max 3)
  // Lage urgentie = geen extra punten.
  const urgentie = antwoorden.urgentie ?? 5;
  if (urgentie >= 8) score += 3;
  else if (urgentie >= 6) score += 2;
  else if (urgentie >= 4) score += 1;

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

// ─── Governance risico ───────────────────────────────────────────────────
// Combineert: gevoelige data + bijzondere categorieën, privacy beleid,
// EU AI Act-kennis, ingeschat risico ongecontroleerd gebruik.
export function berekenGovernanceRisico(antwoorden: ScanAntwoorden): ScanResultaat["governanceRisico"] {
  let risicoPunten = 0;

  const heeftGevoeligeData =
    antwoorden.gevoeligeData &&
    !antwoorden.gevoeligeData.includes("geen") &&
    antwoorden.gevoeligeData.length > 0;
  if (heeftGevoeligeData) risicoPunten += 1;

  // Hoog-risico data (AVG art. 9 + minderjarigen + IP) telt extra
  const HOOG_RISICO_DATA = ["medisch", "intellectueel_eigendom", "minderjarigen"];
  const hoogRisicoCount = (antwoorden.gevoeligeData ?? []).filter((d) =>
    HOOG_RISICO_DATA.includes(d)
  ).length;
  risicoPunten += hoogRisicoCount;

  // Privacy beleid (5 niveaus)
  const privacyRisico: Record<string, number> = {
    geen_richtlijnen: 3,
    informele_afspraken: 2,
    basisbeleid: 1,
    formeel_ai_beleid: 0,
    inclusief_toetsing: 0,
  };
  risicoPunten += privacyRisico[antwoorden.privacyBeleid] ?? 0;

  // EU AI Act onbekendheid is een risico
  const euRisico: Record<string, number> = {
    nooit_gehoord: 2,
    gehoord_onbekend: 1,
    globaal_bekend: 1,
    goed_bekend: 0,
    volledig_compliant: 0,
  };
  risicoPunten += euRisico[antwoorden.euAiActBekendheid] ?? 0;

  // Eigen risico-inschatting (1-10)
  const eigenRisico = antwoorden.risicoOngecontroleerdAi ?? 0;
  if (eigenRisico >= 8) risicoPunten += 3;
  else if (eigenRisico >= 6) risicoPunten += 2;
  else if (eigenRisico >= 4) risicoPunten += 1;

  if (antwoorden.aiZorgen?.includes("dataveiligheid")) risicoPunten += 1;
  if (antwoorden.aiZorgen?.includes("compliance")) risicoPunten += 1;

  if (risicoPunten >= 7) return "hoog";
  if (risicoPunten >= 3) return "midden";
  return "laag";
}

// ─── Cultuur readiness ───────────────────────────────────────────────────
// Combineert: team sentiment, management betrokkenheid, trainingsbereidheid.
export function berekenCultuurReadiness(antwoorden: ScanAntwoorden): ScanResultaat["cultuurReadiness"] {
  let punten = 0;

  const sentimentPunten: Record<string, number> = {
    enthousiast: 3,
    verdeeld: 2,
    sceptisch: 0,
    onbekend: 1,
  };
  punten += sentimentPunten[antwoorden.teamSentiment ?? "onbekend"] ?? 0;

  const mgmtPunten: Record<string, number> = {
    niet_betrokken: 0,
    bewust: 1,
    geinteresseerd: 2,
    actief: 3,
    strategisch: 4,
  };
  punten += mgmtPunten[antwoorden.managementBetrokkenheid] ?? 0;

  // Investering in training = cultuur readiness booster
  const trainingCount = (antwoorden.trainingsbehoefte ?? []).filter(
    (t) => t !== "geen_training_nodig"
  ).length;
  if (trainingCount >= 3) punten += 2;
  else if (trainingCount >= 1) punten += 1;

  if (antwoorden.aiZorgen?.includes("banenverlies")) punten -= 1;
  if (antwoorden.aiZorgen?.includes("geen_zorgen")) punten += 1;

  if (punten >= 7) return "hoog";
  if (punten >= 4) return "midden";
  return "laag";
}

// ─── Opportunity Heatmap ─────────────────────────────────────────────────
// 8 bedrijfsfuncties — dekt alle bevraagde pijnpunten plus aanvullende
// gebieden waar AI typisch grote impact heeft.
export function berekenOpportunityMap(antwoorden: ScanAntwoorden): OpportunityMapItem[] {
  const map: OpportunityMapItem[] = [
    { gebied: "Klantenservice", potentieel: 0 },
    { gebied: "Sales & Marketing", potentieel: 0 },
    { gebied: "Administratie", potentieel: 0 },
    { gebied: "Operations", potentieel: 0 },
    { gebied: "Inkoop & Supply", potentieel: 0 },
    { gebied: "HR & Planning", potentieel: 0 },
    { gebied: "Kwaliteit & Compliance", potentieel: 0 },
    { gebied: "Data & Rapportage", potentieel: 0 },
  ];

  // Per pijnpunt: gebieden met gewogen scores (1.0 = primair, 0.5-0.7 = secundair).
  const pijnpuntMapping: Record<string, Array<{ gebied: string; gewicht: number }>> = {
    data_invoer_administratie: [
      { gebied: "Administratie", gewicht: 1.0 },
      { gebied: "Operations", gewicht: 0.6 },
    ],
    rapportages_verslaglegging: [
      { gebied: "Data & Rapportage", gewicht: 1.0 },
      { gebied: "Administratie", gewicht: 0.5 },
    ],
    klantvragen: [
      { gebied: "Klantenservice", gewicht: 1.0 },
      { gebied: "Sales & Marketing", gewicht: 0.5 },
    ],
    email_verwerking: [
      { gebied: "Klantenservice", gewicht: 0.7 },
      { gebied: "Administratie", gewicht: 0.7 },
    ],
    planning_roostering: [
      { gebied: "HR & Planning", gewicht: 1.0 },
      { gebied: "Operations", gewicht: 0.6 },
    ],
    factuurverwerking: [
      { gebied: "Administratie", gewicht: 1.0 },
      { gebied: "Inkoop & Supply", gewicht: 0.4 },
    ],
    contentcreatie: [
      { gebied: "Sales & Marketing", gewicht: 1.0 },
    ],
    hr_administratie: [
      { gebied: "HR & Planning", gewicht: 1.0 },
    ],
    data_analyse: [
      { gebied: "Data & Rapportage", gewicht: 1.0 },
      { gebied: "Operations", gewicht: 0.5 },
    ],
    inkoop_leveranciers: [
      { gebied: "Inkoop & Supply", gewicht: 1.0 },
      { gebied: "Administratie", gewicht: 0.4 },
    ],
    compliance_documentbeheer: [
      { gebied: "Kwaliteit & Compliance", gewicht: 1.0 },
      { gebied: "Administratie", gewicht: 0.4 },
    ],
    kwaliteitscontrole: [
      { gebied: "Kwaliteit & Compliance", gewicht: 1.0 },
      { gebied: "Operations", gewicht: 0.5 },
    ],
    anders: [],
  };

  for (const pijnpunt of antwoorden.pijnpunten) {
    const gebieden = pijnpuntMapping[pijnpunt] ?? [];
    for (const { gebied, gewicht } of gebieden) {
      const item = map.find((m) => m.gebied === gebied);
      if (item) item.potentieel += 32 * gewicht;
    }
  }

  // Baseline op basis van AI-maturiteit (5 niveaus).
  const baseline =
    antwoorden.aiMaturiteit === "expert" ? 28 :
    antwoorden.aiMaturiteit === "gevorderd" ? 22 :
    antwoorden.aiMaturiteit === "experimenteel" ? 15 :
    antwoorden.aiMaturiteit === "bewust" ? 10 : 6;

  // Tech & data multipliers: betere stack = hogere realiseerbare opbrengst.
  const techMultiplier =
    antwoorden.techStack === "al_ai_gebruik" ? 1.25 :
    antwoorden.techStack === "cloud_first" ? 1.15 :
    antwoorden.techStack === "erp_crm" ? 1.05 :
    antwoorden.techStack === "basis_office" ? 0.9 : 0.75;

  // Data-kwaliteit multiplier (5 niveaus)
  const dataMultiplier =
    antwoorden.dataKwaliteit === "uitstekend" ? 1.20 :
    antwoorden.dataKwaliteit === "goed" ? 1.10 :
    antwoorden.dataKwaliteit === "redelijk" ? 1.0 :
    antwoorden.dataKwaliteit === "basis" ? 0.88 :
    antwoorden.dataKwaliteit === "chaotisch" ? 0.75 : 1.0;

  // Integratie multiplier — gekoppelde systemen versnellen AI-implementatie
  const integratieMultiplier =
    antwoorden.systeemIntegratie === "uitstekend" ? 1.10 :
    antwoorden.systeemIntegratie === "goed" ? 1.05 :
    antwoorden.systeemIntegratie === "gedeeltelijk" ? 1.0 :
    antwoorden.systeemIntegratie === "beperkt" ? 0.92 :
    antwoorden.systeemIntegratie === "nauwelijks" ? 0.85 : 1.0;

  // Urgentie boost — als urgentie hoog is voelt het potentieel extra zwaar
  const urgentieBoost = (antwoorden.urgentie ?? 5) >= 8 ? 1.10 : (antwoorden.urgentie ?? 5) >= 6 ? 1.05 : 1.0;

  return map.map((item) => {
    const ruw = (item.potentieel + baseline) * techMultiplier * dataMultiplier * integratieMultiplier * urgentieBoost;
    return {
      ...item,
      potentieel: Math.min(100, Math.max(0, Math.round(ruw))),
    };
  });
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
