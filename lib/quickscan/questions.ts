import type {
  Sector,
  Omvang,
  TechStack,
  Rol,
  Pijnpunt,
  UrenVerlies,
  KernApplicatie,
  DataKwaliteit,
  SysteemIntegratie,
  ITInfrastructuur,
  GevoeligeData,
  TeamSentiment,
  ManagementBetrokkenheid,
  Trainingsbehoefte,
  PrivacyBeleid,
  EuAiActBekendheid,
  AiZorg,
  AiMaturiteit,
} from "./types";

export type BadgeTone = "positive" | "warning" | "danger" | "neutral";

export interface OptionBadge {
  label: string;
  tone: BadgeTone;
}

export interface VraagOptie<T extends string = string> {
  value: T;
  label: string;
  beschrijving?: string;
  badge?: OptionBadge;
}

// ─── Pijler 1: Bedrijfsprofiel ────────────────────────────────────────────

// Sectoren — alfabetisch A-Z; AI-potentieel-badges op sectoren met bewezen
// hoge AI-impact (bron: McKinsey/PwC AI-adoptierapportages 2024-2025).
export const sectorOpties: VraagOptie<Sector>[] = [
  { value: "bouw", label: "Bouw & Installatietechniek" },
  { value: "financieel", label: "Financiële dienstverlening", badge: { label: "Hoog AI-potentieel", tone: "positive" } },
  { value: "horeca", label: "Horeca & Recreatie" },
  { value: "logistiek", label: "Logistiek & Transport" },
  { value: "onderwijs", label: "Onderwijs & Onderzoek" },
  { value: "overheid", label: "Overheid & Non-profit" },
  { value: "productie", label: "Productie & Industrie" },
  { value: "retail", label: "Retail & E-commerce", badge: { label: "Hoog AI-potentieel", tone: "positive" } },
  { value: "technologie", label: "Technologie & Software", badge: { label: "Hoog AI-potentieel", tone: "positive" } },
  { value: "zakelijk_dienstverlening", label: "Zakelijke dienstverlening", badge: { label: "Hoog AI-potentieel", tone: "positive" } },
  { value: "zorg", label: "Zorg & Welzijn", badge: { label: "Hoog AI-potentieel", tone: "positive" } },
  { value: "anders", label: "Anders" },
];

export const omvangOpties: VraagOptie<Omvang>[] = [
  { value: "1-10", label: "1-10 medewerkers", beschrijving: "Klein MKB" },
  { value: "11-50", label: "11-50 medewerkers", beschrijving: "Midden MKB" },
  { value: "51-200", label: "51-200 medewerkers", beschrijving: "Groot MKB" },
  { value: "200+", label: "200+ medewerkers", beschrijving: "Enterprise" },
];

export const rolOpties: VraagOptie<Rol>[] = [
  { value: "directeur_ceo", label: "Directeur / CEO / Eigenaar", beschrijving: "Eindverantwoordelijke van de organisatie" },
  { value: "manager", label: "Manager / Teamleider", beschrijving: "Verantwoordelijk voor een afdeling of team" },
  { value: "it_verantwoordelijke", label: "IT / Technologie verantwoordelijke", beschrijving: "Verantwoordelijk voor systemen en infrastructuur" },
  { value: "operations", label: "Operations / Processen", beschrijving: "Verantwoordelijk voor de operationele processen" },
  { value: "hr_people", label: "HR / People & Culture", beschrijving: "Personeel, training en organisatieontwikkeling" },
  { value: "finance", label: "Finance / Controlling", beschrijving: "Financiën, planning en rapportage" },
  { value: "marketing_sales", label: "Marketing / Sales", beschrijving: "Commerciële verantwoordelijkheid" },
  { value: "medewerker", label: "Medewerker", beschrijving: "Operationele rol binnen de organisatie" },
  { value: "anders", label: "Anders", beschrijving: "Andere functie of rol" },
];

export const techStackOpties: VraagOptie<TechStack>[] = [
  { value: "geen_systemen", label: "Voornamelijk handmatige processen", beschrijving: "Weinig digitale systemen" },
  { value: "basis_office", label: "Basis Office & e-mail", beschrijving: "Microsoft 365 of Google Workspace" },
  { value: "erp_crm", label: "ERP en/of CRM systeem", beschrijving: "Bijv. Exact, SAP, Salesforce" },
  { value: "cloud_first", label: "Cloud-first & API-gedreven", beschrijving: "Moderne integraties en automatisering" },
  { value: "al_ai_gebruik", label: "Al AI in gebruik", beschrijving: "ChatGPT, Copilot of eigen AI-tools" },
];

// ─── Pijler 2: Pijnpunten & Urgentie ─────────────────────────────────────

// Pijnpunten met "Quick win"-badge op activiteiten die met huidige LLM-/RPA-
// stack in 4-8 weken getransformeerd kunnen worden.
export const pijnpuntOpties: VraagOptie<Pijnpunt>[] = [
  { value: "data_invoer_administratie", label: "Data-invoer & administratie", beschrijving: "Invoeren, kopiëren en verwerken van data", badge: { label: "Quick win", tone: "positive" } },
  { value: "rapportages_verslaglegging", label: "Rapportages & verslaglegging", beschrijving: "Periodieke rapporten, notulen, samenvattingen", badge: { label: "Quick win", tone: "positive" } },
  { value: "klantvragen", label: "Beantwoorden van klantvragen", beschrijving: "Standaardvragen, support, FAQ", badge: { label: "Quick win", tone: "positive" } },
  { value: "email_verwerking", label: "E-mail verwerking & communicatie", beschrijving: "Triage, beantwoorden, samenvatten", badge: { label: "Quick win", tone: "positive" } },
  { value: "planning_roostering", label: "Planning & roostering", beschrijving: "Resources en capaciteit afstemmen" },
  { value: "factuurverwerking", label: "Factuurverwerking & boekhouding", beschrijving: "Facturen uitlezen, boeken, controleren", badge: { label: "Quick win", tone: "positive" } },
  { value: "contentcreatie", label: "Contentcreatie & marketing", beschrijving: "Teksten, social media, campagnes", badge: { label: "Quick win", tone: "positive" } },
  { value: "hr_administratie", label: "HR-administratie & onboarding", beschrijving: "Vacatures, contracten, onboardingflows" },
  { value: "data_analyse", label: "Data-analyse & rapportage", beschrijving: "Inzichten uit cijfers halen" },
  { value: "inkoop_leveranciers", label: "Inkoop & leveranciersbeheer", beschrijving: "Offertes, bestellingen, leverancierscommunicatie" },
  { value: "compliance_documentbeheer", label: "Compliance & documentbeheer", beschrijving: "Contracten, certificaten, archief" },
  { value: "kwaliteitscontrole", label: "Kwaliteitscontrole", beschrijving: "Controleren en toetsen aan normen" },
  { value: "anders", label: "Anders" },
];

export const urenVerliesOpties: VraagOptie<UrenVerlies>[] = [
  { value: "<2", label: "Minder dan 2 uur", beschrijving: "Per medewerker per week" },
  { value: "2-5", label: "2-5 uur", beschrijving: "Per medewerker per week" },
  { value: "5-10", label: "5-10 uur", beschrijving: "Per medewerker per week", badge: { label: "Significant", tone: "warning" } },
  { value: "10-20", label: "10-20 uur", beschrijving: "Per medewerker per week", badge: { label: "Hoog potentieel", tone: "positive" } },
  { value: ">20", label: "Meer dan 20 uur", beschrijving: "Per medewerker per week", badge: { label: "Urgent", tone: "danger" } },
];

// ─── Pijler 3: Data & Systemen ────────────────────────────────────────────

export const kernApplicatieOpties: VraagOptie<KernApplicatie>[] = [
  { value: "microsoft365", label: "Microsoft 365", beschrijving: "Teams, SharePoint, Outlook, Office" },
  { value: "google_workspace", label: "Google Workspace", beschrijving: "Gmail, Drive, Docs, Sheets" },
  { value: "exact", label: "Exact", beschrijving: "ERP / boekhouding" },
  { value: "afas", label: "AFAS", beschrijving: "ERP / HR / financiën" },
  { value: "sap", label: "SAP", beschrijving: "Enterprise resource planning" },
  { value: "salesforce", label: "Salesforce", beschrijving: "CRM & sales platform" },
  { value: "hubspot", label: "HubSpot", beschrijving: "CRM & marketing automation" },
  { value: "shopify", label: "Shopify", beschrijving: "E-commerce platform" },
  { value: "magento", label: "Magento / Adobe Commerce", beschrijving: "E-commerce platform" },
  { value: "woocommerce", label: "WooCommerce", beschrijving: "E-commerce op WordPress" },
  { value: "lightspeed", label: "Lightspeed", beschrijving: "POS & e-commerce voor retail/horeca" },
  { value: "mailchimp", label: "Mailchimp", beschrijving: "E-mail marketing" },
  { value: "klaviyo", label: "Klaviyo", beschrijving: "E-mail & SMS marketing voor e-commerce" },
  { value: "asana_monday", label: "Asana / Monday / ClickUp", beschrijving: "Projectmanagement" },
  { value: "slack_teams", label: "Slack / MS Teams", beschrijving: "Team-communicatie" },
  { value: "powerbi_tableau", label: "Power BI / Tableau / Looker", beschrijving: "Business Intelligence" },
  { value: "branche_specifiek", label: "Branchespecifieke software", beschrijving: "Vakgebied-specifieke pakketten" },
  { value: "eigen_maatwerk", label: "Eigen / maatwerk software", beschrijving: "Intern ontwikkeld" },
  { value: "anders", label: "Andere software", beschrijving: "Niet in de lijst" },
  { value: "geen", label: "Geen specifieke systemen", beschrijving: "Voornamelijk handmatig / spreadsheets" },
];

export const dataKwaliteitOpties: VraagOptie<DataKwaliteit>[] = [
  { value: "chaotisch", label: "Chaotisch", beschrijving: "Data staat overal verspreid" },
  { value: "basis", label: "Basis", beschrijving: "Data is aanwezig maar niet gestructureerd" },
  { value: "redelijk", label: "Redelijk", beschrijving: "Data is grotendeels gestructureerd" },
  { value: "goed", label: "Goed", beschrijving: "Data is gestructureerd en consistent", badge: { label: "AI-ready", tone: "positive" } },
  { value: "uitstekend", label: "Uitstekend", beschrijving: "Data is clean, gecentraliseerd en goed gedocumenteerd", badge: { label: "AI-ready", tone: "positive" } },
];

export const systeemIntegratieOpties: VraagOptie<SysteemIntegratie>[] = [
  { value: "nauwelijks", label: "Nauwelijks", beschrijving: "Systemen staan los van elkaar" },
  { value: "beperkt", label: "Beperkt", beschrijving: "Enkele handmatige koppelingen" },
  { value: "gedeeltelijk", label: "Gedeeltelijk", beschrijving: "Sommige systemen zijn gekoppeld" },
  { value: "goed", label: "Goed", beschrijving: "De meeste systemen communiceren met elkaar" },
  { value: "uitstekend", label: "Uitstekend", beschrijving: "Volledig geïntegreerd ecosysteem", badge: { label: "AI-ready", tone: "positive" } },
];

export const itInfrastructuurOpties: VraagOptie<ITInfrastructuur>[] = [
  { value: "cloud_based", label: "Volledig cloud-based", beschrijving: "Alles in SaaS / cloudplatformen", badge: { label: "AI-ready", tone: "positive" } },
  { value: "hybride", label: "Hybride (cloud + on-premise)", beschrijving: "Mix van cloud en eigen servers" },
  { value: "on_premise", label: "Voornamelijk on-premise", beschrijving: "Eigen servers, lokale installaties" },
  { value: "weet_niet", label: "Weet ik niet", beschrijving: "Geen zicht op de infrastructuur" },
];

// Gevoelige data — hoog risico = bijzondere persoonsgegevens (AVG art. 9) +
// minderjarigen + IP. Vereist extra waarborgen voor AI-implementaties.
export const gevoeligeDataOpties: VraagOptie<GevoeligeData>[] = [
  { value: "klantgegevens", label: "Klantgegevens & contactinformatie", beschrijving: "NAW, e-mail, telefoonnummers (AVG)" },
  { value: "financieel", label: "Financiële gegevens", beschrijving: "Omzet, marges, bankgegevens" },
  { value: "medisch", label: "Medische / gezondheidsgegevens", beschrijving: "Bijzondere persoonsgegevens (AVG art. 9)", badge: { label: "Hoog risico", tone: "danger" } },
  { value: "personeel", label: "Personeelsgegevens", beschrijving: "HR-data, contracten, beoordelingen" },
  { value: "juridisch", label: "Juridische documenten & contracten", beschrijving: "Vertrouwelijke overeenkomsten" },
  { value: "intellectueel_eigendom", label: "Intellectueel eigendom & bedrijfsgeheimen", beschrijving: "R&D, formules, processen", badge: { label: "Hoog risico", tone: "danger" } },
  { value: "minderjarigen", label: "Gegevens van minderjarigen", beschrijving: "Vereist extra waarborgen (AVG)", badge: { label: "Hoog risico", tone: "danger" } },
  { value: "geen", label: "Geen bijzondere categorieën", beschrijving: "Alleen standaard bedrijfsdata" },
];

// ─── Pijler 4: Kennis, cultuur & governance ──────────────────────────────

export const aiMaturiteitOpties: VraagOptie<AiMaturiteit>[] = [
  { value: "geen_ai", label: "Geen — AI is een onbekend terrein", beschrijving: "We hebben nog niets met AI gedaan" },
  { value: "bewust", label: "Bewust — gehoord maar niet mee gewerkt", beschrijving: "We weten dat het bestaat" },
  { value: "experimenteel", label: "Experimenteel — enkele medewerkers gebruiken AI-tools", beschrijving: "ChatGPT, Copilot ad hoc" },
  { value: "gevorderd", label: "Gevorderd — meerdere AI-tools in gebruik", beschrijving: "AI maakt deel uit van werkprocessen" },
  { value: "expert", label: "Expert — AI is geïntegreerd in werkprocessen", beschrijving: "Geautomatiseerde AI-workflows actief", badge: { label: "AI-ready", tone: "positive" } },
];

export const teamSentimentOpties: VraagOptie<TeamSentiment>[] = [
  { value: "enthousiast", label: "Enthousiast & nieuwsgierig", beschrijving: "Het team omarmt nieuwe technologie" },
  { value: "verdeeld", label: "Verdeeld", beschrijving: "Deel enthousiast, deel sceptisch of afwachtend" },
  { value: "sceptisch", label: "Overwegend sceptisch", beschrijving: "Weerstand of onzekerheid over AI" },
  { value: "onbekend", label: "Onbekend / niet gemeten", beschrijving: "We hebben dit nog niet gepeild" },
];

export const managementBetrokkenheidOpties: VraagOptie<ManagementBetrokkenheid>[] = [
  { value: "niet_betrokken", label: "Niet betrokken — AI staat niet op de agenda", beschrijving: "Geen aandacht vanuit het management" },
  { value: "bewust", label: "Bewust — men erkent het belang maar er is geen actie", beschrijving: "AI is een gespreksonderwerp" },
  { value: "geinteresseerd", label: "Geïnteresseerd — er zijn gesprekken gaande", beschrijving: "Verkennende fase" },
  { value: "actief", label: "Actief — management stuurt op AI-adoptie", beschrijving: "Concrete initiatieven en eigenaarschap" },
  { value: "strategisch", label: "Strategisch — AI is kernonderdeel van de bedrijfsstrategie", beschrijving: "AI is een prioriteit op directieniveau", badge: { label: "Ideaal", tone: "positive" } },
];

export const trainingsbehoefteOpties: VraagOptie<Trainingsbehoefte>[] = [
  { value: "basiskennis_ai", label: "Basiskennis AI & automatisering", beschrijving: "Wat is AI en hoe werkt het" },
  { value: "prompt_engineering", label: "Prompt engineering & effectief AI-gebruik", beschrijving: "Beter resultaat uit AI-tools halen" },
  { value: "privacy_veilig_gebruik", label: "Privacy & veilig gebruik van AI-tools", beschrijving: "AVG-conform en datasecure werken" },
  { value: "specifieke_tools", label: "Specifieke tool-trainingen (Copilot, ChatGPT)", beschrijving: "Hands-on werken met concrete tools" },
  { value: "change_management", label: "Change management & adoptie", beschrijving: "Verandering begeleiden in het team" },
  { value: "ai_strategie_leidinggevenden", label: "AI-strategie voor leidinggevenden", beschrijving: "Strategische besluitvorming rond AI" },
  { value: "geen_training_nodig", label: "Geen training nodig", beschrijving: "Het team beheerst AI al voldoende" },
];

export const privacyBeleidOpties: VraagOptie<PrivacyBeleid>[] = [
  { value: "geen_richtlijnen", label: "Nee, helemaal niet", beschrijving: "Medewerkers gebruiken tools naar eigen inzicht" },
  { value: "informele_afspraken", label: "Informeel — er zijn mondelinge afspraken", beschrijving: "Geen formeel beleid" },
  { value: "basisbeleid", label: "Gedeeltelijk — er is een basisbeleid", beschrijving: "Hoofdlijnen op papier" },
  { value: "formeel_ai_beleid", label: "Ja — er is een formeel AI-gebruiksbeleid", beschrijving: "Vastgelegd, gecommuniceerd, getekend" },
  { value: "inclusief_toetsing", label: "Ja — inclusief toetsing en handhaving", beschrijving: "Periodieke audits en handhavingsmechanismen", badge: { label: "Ideaal", tone: "positive" } },
];

export const euAiActBekendheidOpties: VraagOptie<EuAiActBekendheid>[] = [
  { value: "nooit_gehoord", label: "Nee, nog nooit van gehoord", beschrijving: "Onbekend met de wetgeving" },
  { value: "gehoord_onbekend", label: "Heb ervan gehoord maar weet niet wat het betekent", beschrijving: "Globaal bewust" },
  { value: "globaal_bekend", label: "Globaal bekend — we moeten er nog mee aan de slag", beschrijving: "We weten dat het er aan komt" },
  { value: "goed_bekend", label: "Goed bekend — we zijn al bezig met compliance", beschrijving: "Actief bezig met implementatie" },
  { value: "volledig_compliant", label: "Volledig compliant — we voldoen aan alle vereisten", beschrijving: "Audits, documentatie en governance op orde", badge: { label: "Ideaal", tone: "positive" } },
];

export const aiZorgOpties: VraagOptie<AiZorg>[] = [
  { value: "dataveiligheid", label: "Dataveiligheid & privacy", beschrijving: "Gevoelige data in AI-tools" },
  { value: "banenverlies", label: "Impact op medewerkers", beschrijving: "Onzekerheid over functies en taken" },
  { value: "kwaliteitscontrole", label: "Kwaliteit & betrouwbaarheid", beschrijving: "AI maakt fouten of hallucineert" },
  { value: "compliance", label: "Compliance & wetgeving", beschrijving: "AVG, EU AI Act en andere regelgeving" },
  { value: "kosten", label: "Kosten & ROI", beschrijving: "Investering vs. opbrengst onzeker" },
  { value: "geen_zorgen", label: "Geen specifieke zorgen", beschrijving: "We zien AI als kans" },
];

// ─── Pijler 5: AI Ambitie ────────────────────────────────────────────────

export const budgetOpties: VraagOptie<"laag" | "midden" | "hoog">[] = [
  { value: "laag", label: "Tot €5.000 per jaar", beschrijving: "Kleine investering, snelle quick wins" },
  { value: "midden", label: "€5.000 – €25.000 per jaar", beschrijving: "Serieuze implementatie met meerdere use cases" },
  { value: "hoog", label: "Meer dan €25.000 per jaar", beschrijving: "Strategisch AI-programma op organisatieniveau" },
];

export const snelheidOpties: VraagOptie<"direct" | "kwartaal" | "jaar">[] = [
  { value: "direct", label: "Zo snel mogelijk", beschrijving: "We willen direct aan de slag" },
  { value: "kwartaal", label: "Binnen dit kwartaal", beschrijving: "Bewuste, geplande aanpak" },
  { value: "jaar", label: "Op termijn verkennen", beschrijving: "Oriëntatiefase" },
];
