/**
 * Shared types voor het AI Collega platform.
 *
 * Multi-tenant architectuur: één engine, N klant-configuraties.
 * Elke Tenant is een bedrijf dat een AI Collega afneemt.
 * Elke Branche heeft zijn eigen prompt-templates en use-cases.
 */

export type Branche = "makelaar" | "accountant" | "bouwbedrijf";

export interface MakelaarObject {
  adres: string;
  type: string; // "appartement" | "vrijstaand" | "rijtjeshuis" | "penthouse" | etc.
  prijs: number; // vraagprijs in euro's
  kamers: number;
  oppervlak: number; // m²
  kenmerken?: string[]; // ["tuin", "garage", "zonnepanelen", ...]
  beschikbaar?: boolean;
  omschrijving?: string;
}

export interface FAQItem {
  vraag: string;
  antwoord: string;
}

export interface AICollegaTenant {
  id: string; // UUID
  branche: Branche;
  naam: string; // "Makelaardij Janssen"
  contactEmail: string;
  contactTelefoon?: string;
  website?: string;
  stad?: string;
  toon: "formeel" | "informeel";
  objecten?: MakelaarObject[];
  faq?: FAQItem[];
  createdAt: string; // ISO date string
  accessToken: string; // simple bearer token for dashboard access
  isDemo?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CollegaChatRequest {
  messages: ChatMessage[];
  tenantId: string;
  conversationId?: string;
}

export type LeadScore = "warm" | "lauw" | "koud" | "onbekend";

export interface MakelaarLead {
  naam?: string;
  email?: string;
  telefoon?: string;
  interesse?: string;
  urgentie?: string;
  toestemming_contact?: boolean;
  // Makelaar-specifieke kwalificatievelden
  budget?: string;           // "tot €250k" / "€250k-€400k" / "boven €500k"
  locatie_voorkeur?: string; // "Sittard centrum" / "rondom Maastricht" etc.
  type_woning?: string;      // "appartement", "vrijstaand", "rijtjeshuis"
  financiering?: string;     // "al goedgekeurd" / "hypotheekgesprek ingepland" / "nog niet gestart"
  al_in_bezit?: string;      // verkoopt al iets? "ja, al verkocht" / "ja, nog niet" / "nee"
  lead_score?: LeadScore;    // automatisch gescoord door de AI
}

export interface ContentRequest {
  tenantId: string;
  type: "woningomschrijving" | "social_post" | "opvolgmail" | "feedback_request";
  input: Record<string, string | number | boolean | string[]>;
}

export interface ContentVariant {
  label: string; // "Funda", "Instagram", "E-mail"
  tekst: string;
}

export interface OnboardingData {
  naam: string;
  stad: string;
  contactEmail: string;
  contactTelefoon?: string;
  website?: string;
  toon: "formeel" | "informeel";
  objectenRaw?: string; // vrij tekstblok met objecten info
  faqRaw?: string; // vrij tekstblok met FAQ
}
