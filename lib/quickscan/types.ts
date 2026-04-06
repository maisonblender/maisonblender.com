export type Sector =
  | "productie"
  | "logistiek"
  | "zorg"
  | "retail"
  | "zakelijk_dienstverlening"
  | "bouw"
  | "horeca"
  | "overig";

export type Omvang = "1-10" | "11-50" | "51-200" | "200+";

export type TechStack =
  | "geen_systemen"
  | "basis_office"
  | "erp_crm"
  | "cloud_first"
  | "al_ai_gebruik";

export type Pijnpunt =
  | "repetitief_handwerk"
  | "klantcommunicatie"
  | "data_analyse"
  | "documentverwerking"
  | "planning_roostering"
  | "kwaliteitscontrole";

export type AiMaturiteit =
  | "geen_ai"
  | "experimenteren"
  | "productief_gebruik"
  | "ai_core";

export interface ScanAntwoorden {
  // Stap 1: Bedrijfsprofiel
  sector: Sector;
  omvang: Omvang;
  techStack: TechStack;
  // Stap 2: Uitdagingen (meerdere selecteerbaar)
  pijnpunten: Pijnpunt[];
  // Stap 3: AI Volwassenheid
  aiMaturiteit: AiMaturiteit;
  budgetBereidheid: "laag" | "midden" | "hoog";
  implementatieSnelheid: "direct" | "kwartaal" | "jaar";
}

export interface KansItem {
  functie: string;
  potentieel: number; // 0-100
  tijdsbesparing: number; // uren per week
  roiEurosPerJaar: number;
  prioriteit: "hoog" | "midden" | "laag";
  beschrijving: string;
}

export interface ScanResultaat {
  aiReadinessScore: number; // 0-100
  benchmarkPercentiel: number; // % bedrijven lager dan jij
  sectorBenchmark: number; // gemiddelde score in sector
  topKansen: KansItem[];
  opportunityMapData: OpportunityMapItem[];
  roiTotaal: number;
  tijdsbesparingTotaal: number;
  aanbevelingen: string[];
  scoreLabel: "beginner" | "bewust" | "actief" | "voorloper" | "koploper";
  scoreBeschrijving: string;
}

export interface OpportunityMapItem {
  gebied: string;
  potentieel: number; // 0-100, used for heatmap color intensity
}
