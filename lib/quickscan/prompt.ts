import type { ScanAntwoorden, ScanResultaat } from "./types";

const SECTOR_LABELS: Record<string, string> = {
  productie: "Productie & Industrie",
  logistiek: "Logistiek & Transport",
  zorg: "Zorg & Welzijn",
  retail: "Retail & E-commerce",
  zakelijk_dienstverlening: "Zakelijke Dienstverlening",
  bouw: "Bouw & Installatietechniek",
  horeca: "Horeca & Recreatie",
  overig: "Overig",
};

const PIJNPUNT_LABELS: Record<string, string> = {
  repetitief_handwerk: "Repetitief handmatig werk",
  klantcommunicatie: "Klantcommunicatie & support",
  data_analyse: "Data analyse & rapportage",
  documentverwerking: "Document- & factuurverwerking",
  planning_roostering: "Planning & roostering",
  kwaliteitscontrole: "Kwaliteitscontrole & compliance",
};

const MATURITY_LABELS: Record<string, string> = {
  geen_ai: "Geen AI in gebruik",
  experimenteren: "Experimenteert met AI (bijv. ChatGPT)",
  productief_gebruik: "AI productief in gebruik",
  ai_core: "AI is kern van hun processen",
};

export function buildAnalysePrompt(antwoorden: ScanAntwoorden, resultaat: ScanResultaat): string {
  const pijnpuntenTekst = antwoorden.pijnpunten
    .map((p) => `- ${PIJNPUNT_LABELS[p] ?? p}`)
    .join("\n");

  const kansenTekst = resultaat.topKansen
    .map(
      (k, i) =>
        `${i + 1}. ${k.functie}: €${k.roiEurosPerJaar.toLocaleString("nl-NL")} potentieel/jaar, ${k.tijdsbesparing} uur/week besparing`
    )
    .join("\n");

  return `Je bent een expert AI-strateeg van MAISON BLNDR, het toonaangevende AI-bureau van Zuid-Limburg. Je analyseert een bedrijfsprofiel en geeft een gepersonaliseerde, enthousiaste maar zakelijke AI-readiness analyse.

BEDRIJFSPROFIEL:
- Sector: ${SECTOR_LABELS[antwoorden.sector] ?? antwoorden.sector}
- Omvang: ${antwoorden.omvang} medewerkers
- Digitale volwassenheid: ${antwoorden.techStack}
- AI-maturiteit: ${MATURITY_LABELS[antwoorden.aiMaturiteit] ?? antwoorden.aiMaturiteit}
- Budget bereidheid: ${antwoorden.budgetBereidheid}
- Gewenste implementatiesnelheid: ${antwoorden.implementatieSnelheid}

GEÏDENTIFICEERDE UITDAGINGEN:
${pijnpuntenTekst}

BEREKENDE SCAN-UITKOMSTEN:
- AI Readiness Score: ${resultaat.aiReadinessScore}/100 (${resultaat.scoreLabel})
- Benchmark: beter dan ${resultaat.benchmarkPercentiel}% van vergelijkbare bedrijven
- Sectorgemiddelde: ${resultaat.sectorBenchmark}/100
- Totaal ROI potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
- Tijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week

TOP AI-KANSEN:
${kansenTekst}

TAAK: Schrijf een gestructureerde, gepersonaliseerde AI-analyse in het Nederlands. Wees concreet, enthousiast maar zakelijk. Gebruik de specifieke bedrijfsgegevens. Maximaal 400 woorden.

Structuur:
1. **Korte bedrijfsdiagnose** (2-3 zinnen): Wat zegt het profiel over dit bedrijf?
2. **Grootste AI-kans** (3-4 zinnen): Wat is de meest impactvolle eerste stap, met concrete numbers?
3. **Waarschuwing of kans** (2-3 zinnen): Wat moet dit bedrijf weten over risico's of timing?
4. **Aanbevolen eerste stap** (2 zinnen): Wat doen ze als eerste? Maak het actionabel.

Schrijf alsof je rechtstreeks tegen de ondernemer praat. Gebruik "je" en "jouw bedrijf".`;
}

export function buildActieplanPrompt(antwoorden: ScanAntwoorden, resultaat: ScanResultaat): string {
  return `Je bent een senior AI-strateeg van MAISON BLNDR. Schrijf een uitgebreid, gepersonaliseerd AI Actieplan voor dit bedrijf.

BEDRIJFSPROFIEL:
- Sector: ${SECTOR_LABELS[antwoorden.sector] ?? antwoorden.sector}
- Omvang: ${antwoorden.omvang} medewerkers
- AI Score: ${resultaat.aiReadinessScore}/100 (${resultaat.scoreLabel})
- ROI potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
- Tijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week

Schrijf een professioneel AI Actieplan (ca. 800 woorden) met de volgende secties:

# AI Actieplan - Gepersonaliseerd voor jouw bedrijf

## Samenvatting
[Executive summary, 3 zinnen]

## Jouw AI Positie
[Score, benchmark, wat dit betekent voor de competitie]

## Top 3 Prioriteiten
${resultaat.topKansen.map((k, i) => `### ${i + 1}. ${k.functie}\n[Concrete aanpak, tijdlijn, verwacht resultaat]`).join("\n\n")}

## 90-dagen Roadmap
[Fase 1: Quick wins (week 1-4), Fase 2: Implementatie (week 5-12), Fase 3: Optimalisatie]

## Investering & Rendement
[ROI berekening, terugverdientijd, businesscase]

## Volgende Stap
[Call to action: gratis strategiegesprek met MAISON BLNDR]

Schrijf in het Nederlands, professioneel maar toegankelijk. Gebruik concrete getallen.`;
}
