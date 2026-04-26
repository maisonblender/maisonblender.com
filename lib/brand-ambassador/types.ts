/**
 * Shared types voor de Brand Ambassador feature.
 *
 * Blijft bewust minimaal — alles wat user-facing state is, leeft client-side
 * in AmbassadorWidget. Server-kant weet alleen van losse requests.
 */

export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

/**
 * Brand-context die de client meestuurt wanneer "Imagine This Is Yours" actief is.
 * De AI gebruikt dit om on-the-fly de vertelling aan te passen (bv. "Voor [naam]
 * zou ik dezelfde aanpak gebruiken…") zonder dat we een parallel system-prompt
 * hoeven te cachen.
 */
export interface BrandContext {
  /** Weergavenaam van het merk dat de bezoeker "inklikt". */
  name: string;
  /** HSL-hue 0-360, deterministisch afgeleid van de naam. */
  hue: number;
}

/**
 * Leadprofiel dat gaandeweg het gesprek gevuld wordt door de AI
 * (conversationele capture, geen formulier). Alle velden optioneel tot het
 * moment van expliciete submit.
 *
 * Wordt op twee manieren gevuld:
 *  - Via de `capture_lead` tool die Claude aanroept tijdens het chat-streaming
 *    endpoint zodra het nieuwe info hoort.
 *  - Via het expliciete briefing-formulier (knop "Stuur mij een briefing").
 */
export interface AmbassadorLead {
  /** Vrij ingevulde naam (voor- + achternaam samen toegestaan). */
  naam?: string;
  email?: string;
  /** Telefoonnummer zoals opgegeven; wij normaliseren server-side. */
  telefoon?: string;
  bedrijf?: string;
  /** Rol/functie van de bezoeker binnen hun bedrijf. */
  rol?: string;
  sector?: string;
  teamgrootte?: string;
  urgentie?: string;
  /** Samenvatting van de interesse, door AI gegenereerd. */
  interesse?: string;
  /**
   * Heeft de bezoeker expliciet ingestemd met contactopname? Alleen `true`
   * wanneer de AI dit in het gesprek verifieerd heeft (bv. "Mag Karl je
   * terugbellen?" → "Ja").
   */
  toestemming_contact?: boolean;
}

export interface ChatRequest {
  messages: ChatMessage[];
  brand?: BrandContext | null;
  /** Client-generated conversation id — puur voor log-correlatie. */
  conversationId?: string;
}

export interface SuggestionsRequest {
  messages: ChatMessage[];
  brand?: BrandContext | null;
}

export interface LeadRequest {
  lead: AmbassadorLead;
  messages: ChatMessage[];
  brand?: BrandContext | null;
  toestemming: boolean;
}

export interface BriefingRequest {
  lead: AmbassadorLead;
  messages: ChatMessage[];
  brand?: BrandContext | null;
  toestemming: boolean;
}
