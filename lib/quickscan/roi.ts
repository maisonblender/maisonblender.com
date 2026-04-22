import type { ScanAntwoorden, KansItem } from "./types";

const UURLOON_PER_SECTOR: Record<string, number> = {
  bouw: 48,
  financieel: 70,
  horeca: 32,
  logistiek: 40,
  onderwijs: 45,
  overheid: 50,
  productie: 45,
  retail: 35,
  technologie: 75,
  zakelijk_dienstverlening: 65,
  zorg: 38,
  anders: 45,
};

// Uren/week besparing per pijnpunt, geschaald op bedrijfsomvang.
// Functie + beschrijving worden teruggegeven als top-kans label.
const BESPARING_CONFIG: Record<
  string,
  { basisUren: number; omvangMultiplier: Record<string, number>; functie: string; beschrijving: string }
> = {
  data_invoer_administratie: {
    basisUren: 8,
    omvangMultiplier: { "1-10": 1, "11-50": 3, "51-200": 8, "200+": 20 },
    functie: "Procesautomatisering",
    beschrijving: "Automatiseer repetitieve data-invoer, kopieer- en plakwerk. AI-agents verwerken dit 24/7 foutloos.",
  },
  rapportages_verslaglegging: {
    basisUren: 6,
    omvangMultiplier: { "1-10": 0.8, "11-50": 2, "51-200": 5, "200+": 12 },
    functie: "AI Rapportages",
    beschrijving: "Genereer automatisch periodieke rapportages, samenvattingen en notulen uit ruwe data.",
  },
  klantvragen: {
    basisUren: 10,
    omvangMultiplier: { "1-10": 1, "11-50": 2.5, "51-200": 6, "200+": 15 },
    functie: "AI Klantenservice",
    beschrijving: "AI-chatbot beantwoordt 80% van klantvragen direct. Medewerkers focussen op complexe gevallen.",
  },
  email_verwerking: {
    basisUren: 8,
    omvangMultiplier: { "1-10": 1, "11-50": 2.5, "51-200": 6, "200+": 14 },
    functie: "AI E-mailassistent",
    beschrijving: "Triage, samenvatten en concept-antwoorden voor e-mail. Bespaart tot 50% van de inbox-tijd.",
  },
  planning_roostering: {
    basisUren: 4,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 10 },
    functie: "Intelligente Planning",
    beschrijving: "AI optimaliseert roosters en resourceplanning op basis van realtime vraag en historische data.",
  },
  factuurverwerking: {
    basisUren: 7,
    omvangMultiplier: { "1-10": 1, "11-50": 2, "51-200": 5, "200+": 12 },
    functie: "Document AI",
    beschrijving: "Facturen, offertes en contracten worden automatisch uitgelezen en geboekt.",
  },
  contentcreatie: {
    basisUren: 6,
    omvangMultiplier: { "1-10": 1, "11-50": 2, "51-200": 4, "200+": 8 },
    functie: "AI Contentcreatie",
    beschrijving: "Genereer consistent hoogwaardige content voor social media, e-mail en website met AI.",
  },
  hr_administratie: {
    basisUren: 5,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 9 },
    functie: "HR Automatisering",
    beschrijving: "AI screent cv's, verstuurt geautomatiseerde communicatie en ondersteunt onboarding.",
  },
  data_analyse: {
    basisUren: 5,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 10 },
    functie: "Data-intelligentie",
    beschrijving: "Automatische rapportages en dashboards. Geen handmatig Excel-werk meer.",
  },
  inkoop_leveranciers: {
    basisUren: 4,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 10 },
    functie: "Inkoop Automatisering",
    beschrijving: "AI verwerkt offerteaanvragen, bestellingen en leverancierscommunicatie automatisch.",
  },
  compliance_documentbeheer: {
    basisUren: 5,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 9 },
    functie: "Compliance AI",
    beschrijving: "Automatische controle van contracten, certificaten en compliance-documenten met AI.",
  },
  kwaliteitscontrole: {
    basisUren: 6,
    omvangMultiplier: { "1-10": 0.5, "11-50": 2, "51-200": 5, "200+": 12 },
    functie: "Kwaliteit & Compliance AI",
    beschrijving: "Automatische kwaliteitscontrole vermindert fouten en afkeur significant.",
  },
};

// Uren-verlies per medewerker per week → ROI-multiplier
const UREN_VERLIES_FACTOR: Record<string, number> = {
  "<2": 0.5,
  "2-5": 0.8,
  "5-10": 1.0,
  "10-20": 1.2,
  ">20": 1.4,
};

function berekenPrioriteit(potentieel: number): KansItem["prioriteit"] {
  if (potentieel >= 70) return "hoog";
  if (potentieel >= 40) return "midden";
  return "laag";
}

export function berekenTopKansen(antwoorden: ScanAntwoorden): KansItem[] {
  const uurloon = UURLOON_PER_SECTOR[antwoorden.sector] ?? 45;
  const urenFactor = UREN_VERLIES_FACTOR[antwoorden.urenVerlies ?? "5-10"] ?? 1.0;

  const kansen: KansItem[] = antwoorden.pijnpunten
    .map((pijnpunt) => {
      const config = BESPARING_CONFIG[pijnpunt];
      if (!config) return null;

      const multiplier = config.omvangMultiplier[antwoorden.omvang] ?? 1;
      const tijdsbesparing = Math.round(config.basisUren * multiplier * urenFactor);
      const roiEurosPerJaar = Math.round(tijdsbesparing * uurloon * 52);

      const techBonus =
        antwoorden.techStack === "cloud_first" || antwoorden.techStack === "al_ai_gebruik"
          ? 15
          : antwoorden.techStack === "erp_crm"
            ? 7
            : 0;

      // Datakwaliteitsbonus (5 niveaus)
      const dataBonus =
        antwoorden.dataKwaliteit === "uitstekend"
          ? 12
          : antwoorden.dataKwaliteit === "goed"
            ? 8
            : antwoorden.dataKwaliteit === "redelijk"
              ? 5
              : antwoorden.dataKwaliteit === "basis"
                ? 2
                : 0;

      const aiBonus = antwoorden.aiMaturiteit === "geen_ai" ? 0 : antwoorden.aiMaturiteit === "expert" ? 12 : 8;

      const potentieel = Math.min(100, 50 + techBonus + dataBonus + aiBonus);

      return {
        functie: config.functie,
        potentieel,
        tijdsbesparing,
        roiEurosPerJaar,
        prioriteit: berekenPrioriteit(potentieel),
        beschrijving: config.beschrijving,
      } satisfies KansItem;
    })
    .filter((k): k is KansItem => k !== null);

  return kansen.sort((a, b) => b.roiEurosPerJaar - a.roiEurosPerJaar).slice(0, 3);
}

export function berekenTotaalROI(kansen: KansItem[]): { roiTotaal: number; tijdsbesparingTotaal: number } {
  return {
    roiTotaal: kansen.reduce((sum, k) => sum + k.roiEurosPerJaar, 0),
    tijdsbesparingTotaal: kansen.reduce((sum, k) => sum + k.tijdsbesparing, 0),
  };
}
