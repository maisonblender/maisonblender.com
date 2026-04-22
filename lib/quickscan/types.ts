// ─── Sectoren (alfabetisch A-Z) ──────────────────────────────────────────
export type Sector =
  | "anders"
  | "bouw"
  | "financieel"
  | "horeca"
  | "logistiek"
  | "onderwijs"
  | "overheid"
  | "productie"
  | "retail"
  | "technologie"
  | "zakelijk_dienstverlening"
  | "zorg";

export type Omvang = "1-10" | "11-50" | "51-200" | "200+";

// ─── Digitale volwassenheid / tech stack ─────────────────────────────────
export type TechStack =
  | "geen_systemen"
  | "basis_office"
  | "erp_crm"
  | "cloud_first"
  | "al_ai_gebruik";

// ─── Functie/rol binnen organisatie ──────────────────────────────────────
export type Rol =
  | "directeur_ceo"
  | "manager"
  | "it_verantwoordelijke"
  | "operations"
  | "hr_people"
  | "finance"
  | "marketing_sales"
  | "medewerker"
  | "anders";

// ─── Pijnpunten / activiteiten met tijdverlies ───────────────────────────
export type Pijnpunt =
  | "data_invoer_administratie"
  | "rapportages_verslaglegging"
  | "klantvragen"
  | "email_verwerking"
  | "planning_roostering"
  | "factuurverwerking"
  | "contentcreatie"
  | "hr_administratie"
  | "data_analyse"
  | "inkoop_leveranciers"
  | "compliance_documentbeheer"
  | "kwaliteitscontrole"
  | "anders";

// ─── Uren-verlies per medewerker per week ────────────────────────────────
export type UrenVerlies = "<2" | "2-5" | "5-10" | "10-20" | ">20";

// ─── Urgentie van behoefte aan procesverbetering (1-10) ──────────────────
export type UrgentieScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// ─── Kernapplicaties / systemen ──────────────────────────────────────────
export type KernApplicatie =
  | "microsoft365"
  | "google_workspace"
  | "exact"
  | "afas"
  | "sap"
  | "salesforce"
  | "hubspot"
  | "shopify"
  | "magento"
  | "woocommerce"
  | "lightspeed"
  | "mailchimp"
  | "klaviyo"
  | "asana_monday"
  | "slack_teams"
  | "powerbi_tableau"
  | "eigen_maatwerk"
  | "branche_specifiek"
  | "anders"
  | "geen";

// ─── Datakwaliteit (5 niveaus) ───────────────────────────────────────────
export type DataKwaliteit =
  | "chaotisch"
  | "basis"
  | "redelijk"
  | "goed"
  | "uitstekend";

// ─── Systeem-integratie (5 niveaus) ──────────────────────────────────────
export type SysteemIntegratie =
  | "nauwelijks"
  | "beperkt"
  | "gedeeltelijk"
  | "goed"
  | "uitstekend";

// ─── IT-infrastructuur ───────────────────────────────────────────────────
export type ITInfrastructuur =
  | "cloud_based"
  | "hybride"
  | "on_premise"
  | "weet_niet";

// ─── Gevoelige data (multi-select met risico-badges) ─────────────────────
export type GevoeligeData =
  | "klantgegevens"
  | "financieel"
  | "medisch"
  | "personeel"
  | "juridisch"
  | "intellectueel_eigendom"
  | "minderjarigen"
  | "geen";

// ─── Team sentiment ──────────────────────────────────────────────────────
export type TeamSentiment =
  | "enthousiast"
  | "verdeeld"
  | "sceptisch"
  | "onbekend";

// ─── Management-betrokkenheid bij AI-agenda ──────────────────────────────
export type ManagementBetrokkenheid =
  | "niet_betrokken"
  | "bewust"
  | "geinteresseerd"
  | "actief"
  | "strategisch";

// ─── Trainingsbehoefte (multi-select) ────────────────────────────────────
export type Trainingsbehoefte =
  | "basiskennis_ai"
  | "prompt_engineering"
  | "privacy_veilig_gebruik"
  | "specifieke_tools"
  | "change_management"
  | "ai_strategie_leidinggevenden"
  | "geen_training_nodig";

// ─── Privacy / AI-gebruiksbeleid (5 niveaus) ─────────────────────────────
export type PrivacyBeleid =
  | "geen_richtlijnen"
  | "informele_afspraken"
  | "basisbeleid"
  | "formeel_ai_beleid"
  | "inclusief_toetsing";

// ─── Bekendheid met EU AI Act ────────────────────────────────────────────
export type EuAiActBekendheid =
  | "nooit_gehoord"
  | "gehoord_onbekend"
  | "globaal_bekend"
  | "goed_bekend"
  | "volledig_compliant";

// ─── Risico ongecontroleerd AI-gebruik (1-10) ────────────────────────────
export type RisicoScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// ─── Zorgen rond AI-implementatie ────────────────────────────────────────
export type AiZorg =
  | "dataveiligheid"
  | "banenverlies"
  | "kwaliteitscontrole"
  | "compliance"
  | "kosten"
  | "geen_zorgen";

// ─── AI-maturiteit (5 niveaus) ───────────────────────────────────────────
export type AiMaturiteit =
  | "geen_ai"
  | "bewust"
  | "experimenteel"
  | "gevorderd"
  | "expert";

// ─── Volledig antwoordmodel ──────────────────────────────────────────────
export interface ScanAntwoorden {
  // Pijler 1: Bedrijfsprofiel
  sector: Sector;
  omvang: Omvang;
  rol: Rol;
  techStack: TechStack;
  // Pijler 2: Pijnpunten & Urgentie
  pijnpunten: Pijnpunt[];
  urenVerlies: UrenVerlies;
  urgentie: UrgentieScore;
  // Pijler 3: Data & Systemen
  kernApplicaties: KernApplicatie[];
  dataKwaliteit: DataKwaliteit;
  systeemIntegratie: SysteemIntegratie;
  itInfrastructuur: ITInfrastructuur;
  gevoeligeData: GevoeligeData[];
  // Pijler 4: Kennis, cultuur & governance
  aiMaturiteit: AiMaturiteit;
  teamSentiment: TeamSentiment;
  managementBetrokkenheid: ManagementBetrokkenheid;
  trainingsbehoefte: Trainingsbehoefte[];
  privacyBeleid: PrivacyBeleid;
  euAiActBekendheid: EuAiActBekendheid;
  risicoOngecontroleerdAi: RisicoScore;
  aiZorgen: AiZorg[];
  // Pijler 5: AI-ambitie & contact
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
