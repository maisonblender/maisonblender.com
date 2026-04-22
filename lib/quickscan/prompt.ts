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
  hr_recruitment: "HR & recruitment",
  inkoop_leveranciers: "Inkoop & leveranciersbeheer",
  marketing_content: "Marketing & contentcreatie",
};

const MATURITY_LABELS: Record<string, string> = {
  geen_ai: "Geen AI in gebruik",
  experimenteren: "Experimenteert met AI (bijv. ChatGPT)",
  productief_gebruik: "AI productief in gebruik",
  ai_core: "AI is kern van hun processen",
};

const DATA_KWALITEIT_LABELS: Record<string, string> = {
  verspreid_inconsistent: "Verspreid & inconsistent — data staat in losse bestanden en systemen die niet communiceren",
  structureel_geisoleerd: "Structureel maar geïsoleerd — data is gestructureerd per systeem maar niet gekoppeld",
  centraal_goed: "Centraal & goed gestructureerd — data is gecentraliseerd en klaar voor analyse",
};

const PRIVACY_LABELS: Record<string, string> = {
  geen_richtlijnen: "Geen richtlijnen — medewerkers gebruiken tools naar eigen inzicht",
  informele_afspraken: "Informele afspraken — mondelinge of losse schriftelijke afspraken",
  formeel_avg: "Formeel AVG-beleid — privacyverklaring, verwerkersovereenkomsten en procedures aanwezig",
  iso_gecertificeerd: "ISO/NEN gecertificeerd informatiebeveiligingsbeleid",
};

const SENTIMENT_LABELS: Record<string, string> = {
  enthousiast: "Enthousiast & nieuwsgierig",
  verdeeld: "Verdeeld — deel enthousiast, deel sceptisch",
  sceptisch: "Overwegend sceptisch of weerstand",
  onbekend: "Onbekend — niet gemeten",
};

const TREKKER_LABELS: Record<string, string> = {
  directie: "Directie / eigenaar trekt de digitale agenda",
  it_manager: "IT of digitaliseringsmanager is aangewezen trekker",
  geen_centrale_trekker: "Geen centrale trekker — initiatieven zijn ad hoc",
};

const ROL_LABELS: Record<string, string> = {
  eigenaar_directeur: "Eigenaar / Directeur",
  manager: "Manager / Teamleider",
  it_verantwoordelijke: "IT / Digitalisering verantwoordelijke",
  medewerker: "Medewerker",
  anders: "Anders",
};

const UREN_LABELS: Record<string, string> = {
  "<5": "minder dan 5 uur per week",
  "5-15": "5 tot 15 uur per week",
  "15-30": "15 tot 30 uur per week",
  ">30": "meer dan 30 uur per week",
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

  const applicatiesTekst = (antwoorden.kernApplicaties ?? []).join(", ") || "niet opgegeven";
  const gevoeligeDataTekst = (antwoorden.gevoeligeData ?? []).join(", ") || "niet opgegeven";
  const aiZorgenTekst = (antwoorden.aiZorgen ?? []).join(", ") || "geen specifieke zorgen";

  return `Je bent een expert AI-strateeg van MAISON BLNDR. Je analyseert een uitgebreid bedrijfsprofiel en geeft een gepersonaliseerde, diepgaande maar toegankelijke AI-readiness analyse. Begin direct met de inhoud — geen titels, geen aanhef, geen "Opgesteld door" regels.

BEDRIJFSPROFIEL:
- Sector: ${SECTOR_LABELS[antwoorden.sector] ?? antwoorden.sector}
- Omvang: ${antwoorden.omvang} medewerkers
- Rol contactpersoon: ${ROL_LABELS[antwoorden.rol] ?? antwoorden.rol}
- Digitale volwassenheid: ${antwoorden.techStack}
- Tijdsverlies aan handmatig werk: ${UREN_LABELS[antwoorden.urenVerlies ?? "5-15"]}

PIJNPUNTEN & TIJDVRETERS:
${pijnpuntenTekst}

DATA & SYSTEMEN:
- Kernapplicaties: ${applicatiesTekst}
- Datakwaliteit: ${DATA_KWALITEIT_LABELS[antwoorden.dataKwaliteit ?? "verspreid_inconsistent"]}
- Gevoelige data aanwezig: ${gevoeligeDataTekst}

CULTUUR & GOVERNANCE:
- Team sentiment: ${SENTIMENT_LABELS[antwoorden.teamSentiment ?? "onbekend"]}
- Digitale agenda trekker: ${TREKKER_LABELS[antwoorden.digitaleAgendasTrekker ?? "geen_centrale_trekker"]}
- Privacy & databeleid: ${PRIVACY_LABELS[antwoorden.privacyBeleid ?? "geen_richtlijnen"]}
- Grootste zorgen bij AI: ${aiZorgenTekst}
- Governance risico: ${resultaat.governanceRisico}
- Cultuur readiness: ${resultaat.cultuurReadiness}

AI MATURITEIT & AMBITIE:
- Huidige AI-maturiteit: ${MATURITY_LABELS[antwoorden.aiMaturiteit] ?? antwoorden.aiMaturiteit}
- Budget bereidheid: ${antwoorden.budgetBereidheid}
- Gewenste implementatiesnelheid: ${antwoorden.implementatieSnelheid}

BEREKENDE SCAN-UITKOMSTEN:
- AI Readiness Score: ${resultaat.aiReadinessScore}/100 (${resultaat.scoreLabel})
- Benchmark: beter dan ${resultaat.benchmarkPercentiel}% van vergelijkbare bedrijven
- Sectorgemiddelde: ${resultaat.sectorBenchmark}/100
- Totaal ROI potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
- Tijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week

TOP AI-KANSEN:
${kansenTekst}

TAAK: Schrijf een gestructureerde, gepersonaliseerde AI-analyse in het Nederlands. Wees concreet, enthousiast maar zakelijk. Gebruik de specifieke bedrijfsgegevens. Maximaal 500 woorden.

Structuur:
1. **Korte bedrijfsdiagnose** (2-3 zinnen): Wat zegt dit profiel over de AI-gereedheid?
2. **Grootste AI-kans** (3-4 zinnen): De meest impactvolle eerste stap, met concrete cijfers uit de scan.
3. **Data & systemen** (2-3 zinnen): Wat betekent de datakwaliteit voor implementatiesnelheid en complexiteit?
4. **Cultuur & governance** (2-3 zinnen): Is het team klaar? Zijn er governance-risico's die aandacht vragen?
5. **Aanbevolen eerste stap** (2 zinnen): Concreet en actionabel — wat doen ze als allereerste?

Schrijf alsof je rechtstreeks tegen de ondernemer praat. Gebruik "je" en "jouw bedrijf". Benoem specifieke sectornuances.`;
}

export function buildActieplanPrompt(
  antwoorden: ScanAntwoorden,
  resultaat: ScanResultaat,
  klant?: { naam?: string; bedrijf?: string }
): string {
  const klantNaam = klant?.bedrijf ?? klant?.naam ?? "het bedrijf";
  const aanhef = klant?.naam ? klant.naam : "de ondernemer";

  const applicatiesTekst = (antwoorden.kernApplicaties ?? []).join(", ") || "niet gespecificeerd";
  const aiZorgenTekst = (antwoorden.aiZorgen ?? []).join(", ") || "geen specifieke zorgen";

  return `Je bent een senior AI-strateeg van MAISON BLNDR (het adviesbureau). Je schrijft een professioneel AI Actieplan voor een KLANT. MAISON BLNDR is de adviseur — NIET de klant. Begin DIRECT met de Executive Summary. Voeg GEEN titel zoals "AI Actieplan — [bedrijf]", GEEN "Opgesteld door" regel en GEEN "Ter attentie van" toe.

KLANT: ${klantNaam} (contactpersoon: ${aanhef})
BEDRIJFSPROFIEL KLANT:
- Sector: ${SECTOR_LABELS[antwoorden.sector] ?? antwoorden.sector}
- Omvang: ${antwoorden.omvang} medewerkers
- Rol contactpersoon: ${ROL_LABELS[antwoorden.rol] ?? antwoorden.rol}
- AI Score: ${resultaat.aiReadinessScore}/100 (${resultaat.scoreLabel})
- ROI potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
- Tijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week
- Tijdsverlies aan handmatig werk: ${UREN_LABELS[antwoorden.urenVerlies ?? "5-15"]}
- Huidige systemen: ${applicatiesTekst}
- Datakwaliteit: ${DATA_KWALITEIT_LABELS[antwoorden.dataKwaliteit ?? "verspreid_inconsistent"]}
- Governance risico: ${resultaat.governanceRisico}
- Cultuur readiness: ${resultaat.cultuurReadiness}
- Privacy beleid: ${PRIVACY_LABELS[antwoorden.privacyBeleid ?? "geen_richtlijnen"]}
- Grootste zorgen: ${aiZorgenTekst}

Schrijf een professioneel AI Actieplan (ca. 900 woorden) voor ${klantNaam}. Spreek de klant aan als "je/jouw bedrijf". Noem MAISON BLNDR alleen als adviseur/uitvoerder.

## Executive Summary
[3 zinnen over de huidige situatie, het grootste potentieel en de urgentie voor ${klantNaam}]

## AI Readiness Positie
[Score, benchmark, wat dit betekent voor de concurrentiepositie in de sector]

## Top 3 Quick Wins
${resultaat.topKansen.map((k, i) => `### ${i + 1}. ${k.functie}\n[Concrete aanpak op basis van huidige systemen van ${klantNaam}, tijdlijn, verwacht resultaat: €${k.roiEurosPerJaar.toLocaleString("nl-NL")}/jaar en ${k.tijdsbesparing}u/week besparing]`).join("\n\n")}

## Data & Technisch Fundament
[Wat de huidige datakwaliteit betekent voor de implementatievolgorde — wat kan direct, wat vraagt voorbereiding?]

## Governance & Privacy Roadmap
[Concrete stappen voor ${klantNaam} om AI veilig en AVG-compliant in te zetten, afgestemd op het governance risico niveau: ${resultaat.governanceRisico}]

## Change Management & Training
[Aanpak voor team adoptie gegeven het sentiment: ${antwoorden.teamSentiment ?? "onbekend"}. Concrete training en communicatiestappen]

## 90-Dagen Roadmap
[Week 1-4: Quick win selectie en voorbereiding | Week 5-8: Eerste implementatie | Week 9-12: Evaluatie en opschaling]

## Investering & Rendement
[ROI berekening, terugverdientijd, businesscase voor ${klantNaam} met concrete getallen]

## Volgende Stap
[Concrete eerste actie voor ${klantNaam} — wat doen ze morgen? Plan een strategiegesprek met MAISON BLNDR.]

Schrijf in het Nederlands, professioneel maar toegankelijk. Gebruik concrete getallen uit de scan.`;
}
