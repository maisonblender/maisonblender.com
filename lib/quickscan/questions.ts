import type {
  Sector,
  Omvang,
  TechStack,
  Rol,
  Pijnpunt,
  UrenVerlies,
  KernApplicatie,
  DataKwaliteit,
  GevoeligeData,
  TeamSentiment,
  DigitaleAgendasTrekker,
  PrivacyBeleid,
  AiZorg,
  AiMaturiteit,
} from "./types";

export interface VraagOptie<T extends string = string> {
  value: T;
  label: string;
  beschrijving?: string;
}

// ─── Stap 1: Bedrijfsprofiel ───────────────────────────────────────────────

export const sectorOpties: VraagOptie<Sector>[] = [
  { value: "productie", label: "Productie & Industrie" },
  { value: "logistiek", label: "Logistiek & Transport" },
  { value: "zorg", label: "Zorg & Welzijn" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "zakelijk_dienstverlening", label: "Zakelijke Dienstverlening" },
  { value: "bouw", label: "Bouw & Installatietechniek" },
  { value: "horeca", label: "Horeca & Recreatie" },
  { value: "overig", label: "Overig" },
];

export const omvangOpties: VraagOptie<Omvang>[] = [
  { value: "1-10", label: "1-10 medewerkers", beschrijving: "Klein MKB" },
  { value: "11-50", label: "11-50 medewerkers", beschrijving: "Midden MKB" },
  { value: "51-200", label: "51-200 medewerkers", beschrijving: "Groot MKB" },
  { value: "200+", label: "200+ medewerkers", beschrijving: "Enterprise" },
];

export const rolOpties: VraagOptie<Rol>[] = [
  { value: "eigenaar_directeur", label: "Eigenaar / Directeur", beschrijving: "Eindverantwoordelijke van de organisatie" },
  { value: "manager", label: "Manager / Teamleider", beschrijving: "Verantwoordelijk voor een afdeling of team" },
  { value: "it_verantwoordelijke", label: "IT / Digitalisering", beschrijving: "Verantwoordelijk voor technologie en systemen" },
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

// ─── Stap 2: Pijnpunten & Tijdvreters ────────────────────────────────────

export const pijnpuntOpties: VraagOptie<Pijnpunt>[] = [
  { value: "repetitief_handwerk", label: "Repetitief handmatig werk", beschrijving: "Data invoer, kopiëren, verwerken" },
  { value: "klantcommunicatie", label: "Klantcommunicatie & support", beschrijving: "Vragen beantwoorden, afspraken plannen" },
  { value: "data_analyse", label: "Data analyse & rapportage", beschrijving: "Inzichten uit cijfers halen" },
  { value: "documentverwerking", label: "Document- & factuurverwerking", beschrijving: "Offertes, contracten, facturen" },
  { value: "planning_roostering", label: "Planning & roostering", beschrijving: "Resources en capaciteit afstemmen" },
  { value: "kwaliteitscontrole", label: "Kwaliteitscontrole & compliance", beschrijving: "Controleren en toetsen aan normen" },
  { value: "hr_recruitment", label: "HR & recruitment", beschrijving: "Vacatures, sollicitaties, onboarding" },
  { value: "inkoop_leveranciers", label: "Inkoop & leveranciersbeheer", beschrijving: "Offertes, bestellingen, leverancierscommunicatie" },
  { value: "marketing_content", label: "Marketing & contentcreatie", beschrijving: "Teksten, social media, campagnes" },
];

export const urenVerliesOpties: VraagOptie<UrenVerlies>[] = [
  { value: "<5", label: "Minder dan 5 uur per week", beschrijving: "Beperkte tijdverspilling" },
  { value: "5-15", label: "5 tot 15 uur per week", beschrijving: "Merkbare tijdverspilling" },
  { value: "15-30", label: "15 tot 30 uur per week", beschrijving: "Aanzienlijk tijdsverlies" },
  { value: ">30", label: "Meer dan 30 uur per week", beschrijving: "Kritieke bottleneck" },
];

// ─── Stap 3: Data & Systemen ──────────────────────────────────────────────

export const kernApplicatieOpties: VraagOptie<KernApplicatie>[] = [
  { value: "microsoft365", label: "Microsoft 365", beschrijving: "Teams, SharePoint, Outlook, Office" },
  { value: "google_workspace", label: "Google Workspace", beschrijving: "Gmail, Drive, Docs, Sheets" },
  { value: "exact", label: "Exact", beschrijving: "ERP / boekhouding" },
  { value: "sap", label: "SAP", beschrijving: "Enterprise resource planning" },
  { value: "salesforce", label: "Salesforce", beschrijving: "CRM & sales platform" },
  { value: "hubspot", label: "HubSpot", beschrijving: "CRM & marketing automation" },
  { value: "eigen_maatwerk", label: "Eigen / maatwerk systeem", beschrijving: "Intern ontwikkelde software" },
  { value: "anders", label: "Andere software", beschrijving: "Niet in de lijst" },
  { value: "geen", label: "Geen specifieke systemen", beschrijving: "Voornamelijk handmatig / spreadsheets" },
];

export const dataKwaliteitOpties: VraagOptie<DataKwaliteit>[] = [
  {
    value: "verspreid_inconsistent",
    label: "Verspreid & inconsistent",
    beschrijving: "Data staat in losse bestanden, e-mails en systemen die niet communiceren",
  },
  {
    value: "structureel_geisoleerd",
    label: "Structureel maar geïsoleerd",
    beschrijving: "Data is gestructureerd per systeem maar niet gekoppeld of centraal beschikbaar",
  },
  {
    value: "centraal_goed",
    label: "Centraal & goed gestructureerd",
    beschrijving: "Data is gecentraliseerd, up-to-date en toegankelijk voor analyses",
  },
];

export const gevoeligeDataOpties: VraagOptie<GevoeligeData>[] = [
  { value: "klantdata", label: "Klant- en persoonsgegevens", beschrijving: "Namen, adressen, contactgegevens (AVG)" },
  { value: "financieel", label: "Financiële gegevens", beschrijving: "Omzet, marges, bankgegevens" },
  { value: "medisch", label: "Medische of gezondheidsdata", beschrijving: "Bijzondere persoonsgegevens (AVG)" },
  { value: "intellectueel_eigendom", label: "Intellectueel eigendom", beschrijving: "Bedrijfsgeheimen, R&D, formules" },
  { value: "geen", label: "Geen bijzonder gevoelige data", beschrijving: "Standaard bedrijfsdata" },
];

// ─── Stap 4: Cultuur & Governance ────────────────────────────────────────

export const teamSentimentOpties: VraagOptie<TeamSentiment>[] = [
  { value: "enthousiast", label: "Enthousiast & nieuwsgierig", beschrijving: "Het team omarmt nieuwe technologie" },
  { value: "verdeeld", label: "Verdeeld", beschrijving: "Deel enthousiast, deel sceptisch of afwachtend" },
  { value: "sceptisch", label: "Overwegend sceptisch", beschrijving: "Weerstand of onzekerheid over AI" },
  { value: "onbekend", label: "Onbekend / niet gemeten", beschrijving: "We hebben dit nog niet gepeild" },
];

export const digitaleAgendasTrekkerOpties: VraagOptie<DigitaleAgendasTrekker>[] = [
  { value: "directie", label: "Directie / eigenaar", beschrijving: "Digitalisering is strategische prioriteit van bovenaf" },
  { value: "it_manager", label: "IT of digitaliserings­manager", beschrijving: "Er is een aangewezen persoon voor tech & innovatie" },
  { value: "geen_centrale_trekker", label: "Geen centrale trekker", beschrijving: "Initiatieven zijn ad hoc of liggen stil" },
];

export const privacyBeleidOpties: VraagOptie<PrivacyBeleid>[] = [
  { value: "geen_richtlijnen", label: "Geen richtlijnen", beschrijving: "Medewerkers gebruiken tools naar eigen inzicht" },
  { value: "informele_afspraken", label: "Informele afspraken", beschrijving: "Er zijn mondelinge of losse schriftelijke afspraken" },
  { value: "formeel_avg", label: "Formeel AVG-beleid", beschrijving: "Privacyverklaring, verwerkersovereenkomsten en procedures aanwezig" },
  { value: "iso_gecertificeerd", label: "ISO / NEN gecertificeerd", beschrijving: "Formeel gecertificeerd informatiebeveiligingsbeleid" },
];

export const aiZorgOpties: VraagOptie<AiZorg>[] = [
  { value: "dataveiligheid", label: "Dataveiligheid & privacy", beschrijving: "Gevoelige data in AI-tools" },
  { value: "banenverlies", label: "Impact op medewerkers", beschrijving: "Onzekerheid over functies en taken" },
  { value: "kwaliteitscontrole", label: "Kwaliteit & betrouwbaarheid", beschrijving: "AI maakt fouten of hallucineert" },
  { value: "compliance", label: "Compliance & wetgeving", beschrijving: "AVG, EU AI Act en andere regelgeving" },
  { value: "kosten", label: "Kosten & ROI", beschrijving: "Investering vs. opbrengst onzeker" },
  { value: "geen_zorgen", label: "Geen specifieke zorgen", beschrijving: "We zien AI als kans" },
];

// ─── Stap 5: AI Ambitie ───────────────────────────────────────────────────

export const aiMaturiteitOpties: VraagOptie<AiMaturiteit>[] = [
  { value: "geen_ai", label: "Geen AI in gebruik", beschrijving: "We hebben nog niet met AI gewerkt" },
  { value: "experimenteren", label: "Experimenteren", beschrijving: "We proberen soms ChatGPT of Copilot" },
  { value: "productief_gebruik", label: "Productief gebruik", beschrijving: "AI maakt deel uit van ons dagelijks werk" },
  { value: "ai_core", label: "AI is kern van ons proces", beschrijving: "Meerdere geautomatiseerde AI-workflows actief" },
];

export const budgetOpties: VraagOptie<"laag" | "midden" | "hoog">[] = [
  { value: "laag", label: "Tot €5.000", beschrijving: "Kleine investering, snelle winst" },
  { value: "midden", label: "€5.000 – €25.000", beschrijving: "Serieuze implementatie" },
  { value: "hoog", label: "Meer dan €25.000", beschrijving: "Strategisch AI-programma" },
];

export const snelheidOpties: VraagOptie<"direct" | "kwartaal" | "jaar">[] = [
  { value: "direct", label: "Zo snel mogelijk", beschrijving: "We willen direct aan de slag" },
  { value: "kwartaal", label: "Binnen dit kwartaal", beschrijving: "Bewuste, geplande aanpak" },
  { value: "jaar", label: "Op termijn verkennen", beschrijving: "Oriëntatiefase" },
];
