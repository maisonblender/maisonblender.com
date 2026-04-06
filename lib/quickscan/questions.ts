import type { Sector, Omvang, TechStack, Pijnpunt, AiMaturiteit } from "./types";

export interface VraagOptie<T extends string = string> {
  value: T;
  label: string;
  beschrijving?: string;
}

export interface Vraag<T extends string = string> {
  id: string;
  stap: 1 | 2 | 3;
  vraag: string;
  meerdere?: boolean;
  opties: VraagOptie<T>[];
}

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

export const techStackOpties: VraagOptie<TechStack>[] = [
  { value: "geen_systemen", label: "Voornamelijk handmatige processen", beschrijving: "Weinig digitale systemen" },
  { value: "basis_office", label: "Basis Office & e-mail", beschrijving: "Microsoft 365 of Google Workspace" },
  { value: "erp_crm", label: "ERP en/of CRM systeem", beschrijving: "Bijv. Exact, SAP, Salesforce" },
  { value: "cloud_first", label: "Cloud-first & API-gedreven", beschrijving: "Moderne integraties en automatisering" },
  { value: "al_ai_gebruik", label: "Al AI in gebruik", beschrijving: "ChatGPT, Copilot of eigen AI-tools" },
];

export const pijnpuntOpties: VraagOptie<Pijnpunt>[] = [
  { value: "repetitief_handwerk", label: "Repetitief handmatig werk", beschrijving: "Data invoer, kopiëren, verwerken" },
  { value: "klantcommunicatie", label: "Klantcommunicatie & support", beschrijving: "Vragen beantwoorden, afspraken plannen" },
  { value: "data_analyse", label: "Data analyse & rapportage", beschrijving: "Inzichten uit cijfers halen" },
  { value: "documentverwerking", label: "Document- & factuurverwerking", beschrijving: "Offertes, contracten, facturen" },
  { value: "planning_roostering", label: "Planning & roostering", beschrijving: "Resources en capaciteit afstemmen" },
  { value: "kwaliteitscontrole", label: "Kwaliteitscontrole & compliance", beschrijving: "Controleren en toetsen aan normen" },
];

export const aiMaturiteitOpties: VraagOptie<AiMaturiteit>[] = [
  { value: "geen_ai", label: "Geen AI in gebruik", beschrijving: "We hebben nog niet met AI gewerkt" },
  { value: "experimenteren", label: "Experimenteren", beschrijving: "We proberen soms ChatGPT of Copilot" },
  { value: "productief_gebruik", label: "Productief gebruik", beschrijving: "AI maakt deel uit van ons dagelijks werk" },
  { value: "ai_core", label: "AI is kern van ons proces", beschrijving: "Meerdere geautomatiseerde AI-workflows actief" },
];

export const budgetOpties: VraagOptie<"laag" | "midden" | "hoog">[] = [
  { value: "laag", label: "< €5.000", beschrijving: "Kleine investering, snelle winst" },
  { value: "midden", label: "€5.000 - €25.000", beschrijving: "Serieuze implementatie" },
  { value: "hoog", label: "> €25.000", beschrijving: "Strategisch AI-programma" },
];

export const snelheidOpties: VraagOptie<"direct" | "kwartaal" | "jaar">[] = [
  { value: "direct", label: "Zo snel mogelijk", beschrijving: "We willen direct aan de slag" },
  { value: "kwartaal", label: "Binnen dit kwartaal", beschrijving: "Bewuste, geplande aanpak" },
  { value: "jaar", label: "Op termijn verkennen", beschrijving: "Oriëntatiefase" },
];
