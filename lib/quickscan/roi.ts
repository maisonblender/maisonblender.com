import type { ScanAntwoorden, KansItem } from "./types";

const UURLOON_PER_SECTOR: Record<string, number> = {
  productie: 45,
  logistiek: 40,
  zorg: 38,
  retail: 35,
  zakelijk_dienstverlening: 65,
  bouw: 48,
  horeca: 32,
  overig: 45,
};

// Uren/week besparing per pijnpunt, geschaald op bedrijfsomvang
const BESPARING_CONFIG: Record<
  string,
  { basisUren: number; omvangMultiplier: Record<string, number>; functie: string; beschrijving: string }
> = {
  repetitief_handwerk: {
    basisUren: 8,
    omvangMultiplier: { "1-10": 1, "11-50": 3, "51-200": 8, "200+": 20 },
    functie: "Procesautomatisering",
    beschrijving: "Automatiseer repetitieve data-invoer, kopieer- en plakwerk. AI-agents verwerken dit 24/7 foutloos.",
  },
  klantcommunicatie: {
    basisUren: 10,
    omvangMultiplier: { "1-10": 1, "11-50": 2.5, "51-200": 6, "200+": 15 },
    functie: "AI Klantenservice",
    beschrijving: "AI-chatbot beantwoordt 80% van klantvragen direct. Medewerkers focussen op complexe gevallen.",
  },
  data_analyse: {
    basisUren: 5,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 10 },
    functie: "Data-intelligentie",
    beschrijving: "Automatische rapportages en dashboards. Geen handmatig Excel-werk meer.",
  },
  documentverwerking: {
    basisUren: 7,
    omvangMultiplier: { "1-10": 1, "11-50": 2, "51-200": 5, "200+": 12 },
    functie: "Document AI",
    beschrijving: "Facturen, offertes en contracten worden automatisch uitgelezen en verwerkt.",
  },
  planning_roostering: {
    basisUren: 4,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 10 },
    functie: "Intelligente Planning",
    beschrijving: "AI optimaliseert roosters en resourceplanning op basis van realtime vraag en historische data.",
  },
  kwaliteitscontrole: {
    basisUren: 6,
    omvangMultiplier: { "1-10": 0.5, "11-50": 2, "51-200": 5, "200+": 12 },
    functie: "Kwaliteit & Compliance AI",
    beschrijving: "Automatische kwaliteitscontrole vermindert fouten en afkeur significant.",
  },
  hr_recruitment: {
    basisUren: 5,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 9 },
    functie: "HR Automatisering",
    beschrijving: "AI screent cv's, verstuurt geautomatiseerde communicatie en ondersteunt onboarding.",
  },
  inkoop_leveranciers: {
    basisUren: 4,
    omvangMultiplier: { "1-10": 0.5, "11-50": 1.5, "51-200": 4, "200+": 10 },
    functie: "Inkoop Automatisering",
    beschrijving: "AI verwerkt offerteaanvragen, bestellingen en leverancierscommunicatie automatisch.",
  },
  marketing_content: {
    basisUren: 6,
    omvangMultiplier: { "1-10": 1, "11-50": 2, "51-200": 4, "200+": 8 },
    functie: "AI Contentcreatie",
    beschrijving: "Genereer consistent hoogwaardige content voor social media, e-mail en website met AI.",
  },
};

// Vertaal de uren-verlies categorie naar een vermenigvuldigingsfactor voor ROI
const UREN_VERLIES_FACTOR: Record<string, number> = {
  "<5": 0.6,
  "5-15": 0.9,
  "15-30": 1.1,
  ">30": 1.3,
};

function berekenPrioriteit(potentieel: number): KansItem["prioriteit"] {
  if (potentieel >= 70) return "hoog";
  if (potentieel >= 40) return "midden";
  return "laag";
}

export function berekenTopKansen(antwoorden: ScanAntwoorden): KansItem[] {
  const uurloon = UURLOON_PER_SECTOR[antwoorden.sector] ?? 45;
  const urenFactor = UREN_VERLIES_FACTOR[antwoorden.urenVerlies ?? "5-15"] ?? 1.0;

  const kansen: KansItem[] = antwoorden.pijnpunten
    .map((pijnpunt) => {
      const config = BESPARING_CONFIG[pijnpunt];
      if (!config) return null;

      const multiplier = config.omvangMultiplier[antwoorden.omvang] ?? 1;
      const tijdsbesparing = Math.round(config.basisUren * multiplier * urenFactor);
      const roiEurosPerJaar = Math.round(tijdsbesparing * uurloon * 52);

      // Technisch potentieel
      const techBonus =
        antwoorden.techStack === "cloud_first" || antwoorden.techStack === "al_ai_gebruik"
          ? 15
          : antwoorden.techStack === "erp_crm"
            ? 7
            : 0;

      // Datakwaliteitsbonus
      const dataBonus =
        antwoorden.dataKwaliteit === "centraal_goed"
          ? 10
          : antwoorden.dataKwaliteit === "structureel_geisoleerd"
            ? 5
            : 0;

      const aiBonus = antwoorden.aiMaturiteit === "geen_ai" ? 0 : 8;

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
