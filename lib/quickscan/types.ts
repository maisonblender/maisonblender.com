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

export type Rol =
  | "eigenaar_directeur"
  | "manager"
  | "it_verantwoordelijke"
  | "medewerker"
  | "anders";

export type Pijnpunt =
  | "repetitief_handwerk"
  | "klantcommunicatie"
  | "data_analyse"
  | "documentverwerking"
  | "planning_roostering"
  | "kwaliteitscontrole"
  | "hr_recruitment"
  | "inkoop_leveranciers"
  | "marketing_content";

export type UrenVerlies = "<5" | "5-15" | "15-30" | ">30";

export type KernApplicatie =
  | "exact"
  | "sap"
  | "salesforce"
  | "hubspot"
  | "microsoft365"
  | "google_workspace"
  | "eigen_maatwerk"
  | "geen"
  | "anders";

export type DataKwaliteit =
  | "verspreid_inconsistent"
  | "structureel_geisoleerd"
  | "centraal_goed";

export type GevoeligeData =
  | "klantdata"
  | "financieel"
  | "medisch"
  | "intellectueel_eigendom"
  | "geen";

export type TeamSentiment =
  | "enthousiast"
  | "verdeeld"
  | "sceptisch"
  | "onbekend";

export type DigitaleAgendasTrekker =
  | "directie"
  | "it_manager"
  | "geen_centrale_trekker";

export type PrivacyBeleid =
  | "geen_richtlijnen"
  | "informele_afspraken"
  | "formeel_avg"
  | "iso_gecertificeerd";

export type AiZorg =
  | "dataveiligheid"
  | "banenverlies"
  | "kwaliteitscontrole"
  | "compliance"
  | "kosten"
  | "geen_zorgen";

export type AiMaturiteit =
  | "geen_ai"
  | "experimenteren"
  | "productief_gebruik"
  | "ai_core";

export interface ScanAntwoorden {
  // Stap 1: Bedrijfsprofiel
  sector: Sector;
  omvang: Omvang;
  rol: Rol;
  techStack: TechStack;
  // Stap 2: Pijnpunten & Tijdvreters
  pijnpunten: Pijnpunt[];
  urenVerlies: UrenVerlies;
  // Stap 3: Data & Systemen
  kernApplicaties: KernApplicatie[];
  dataKwaliteit: DataKwaliteit;
  gevoeligeData: GevoeligeData[];
  // Stap 4: Cultuur & Governance
  teamSentiment: TeamSentiment;
  digitaleAgendasTrekker: DigitaleAgendasTrekker;
  privacyBeleid: PrivacyBeleid;
  aiZorgen: AiZorg[];
  // Stap 5: AI Ambitie
  aiMaturiteit: AiMaturiteit;
  budgetBereidheid: "laag" | "midden" | "hoog";
  implementatieSnelheid: "direct" | "kwartaal" | "jaar";
}

export interface LeadGegevens {
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  email: string;
  telefoon?: string;
  toestemming: boolean;
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
  governanceRisico: "laag" | "midden" | "hoog";
  cultuurReadiness: "laag" | "midden" | "hoog";
}

export interface OpportunityMapItem {
  gebied: string;
  potentieel: number; // 0-100, used for heatmap color intensity
}
