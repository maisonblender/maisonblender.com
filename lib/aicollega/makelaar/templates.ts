/**
 * Makelaar-specifieke prompt-templates voor de AI Collega.
 *
 * Bevat:
 *  1. buildMakelaarKennisbase() — kennisbase-sectie voor de chat-prompt
 *  2. buildWoningomschrijvingPrompt() — prompt voor content-generatie
 *  3. buildSocialPostPrompt() — prompt voor social media content
 *  4. buildOpvolgmailPrompt() — prompt voor opvolg-e-mail na bezichtiging
 */

import type { AICollegaTenant, MakelaarObject } from "../types";

function formatObject(obj: MakelaarObject, idx: number): string {
  const prijsFormatted = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(obj.prijs);

  const lines = [
    `**Object ${idx + 1}: ${obj.adres}**`,
    `- Type: ${obj.type}`,
    `- Vraagprijs: ${prijsFormatted}`,
    `- Kamers: ${obj.kamers}`,
    `- Woonoppervlak: ${obj.oppervlak} m²`,
  ];

  if (obj.kenmerken && obj.kenmerken.length > 0) {
    lines.push(`- Kenmerken: ${obj.kenmerken.join(", ")}`);
  }
  lines.push(`- Status: ${obj.beschikbaar !== false ? "Beschikbaar" : "Verkocht / Onder bod"}`);

  return lines.join("\n");
}

/**
 * Bouw de kennisbase-sectie voor de makelaar chat-prompt.
 */
export function buildMakelaarKennisbase(tenant: AICollegaTenant): string {
  const sections: string[] = [];

  sections.push(`
**Bedrijfsgegevens ${tenant.naam}:**
- Naam: ${tenant.naam}
- ${tenant.stad ? `Vestigingsplaats: ${tenant.stad}` : ""}
- ${tenant.contactEmail ? `E-mail: ${tenant.contactEmail}` : ""}
- ${tenant.contactTelefoon ? `Telefoon: ${tenant.contactTelefoon}` : ""}
- ${tenant.website ? `Website: ${tenant.website}` : ""}
`);

  if (tenant.objecten && tenant.objecten.length > 0) {
    sections.push(`\n**Actieve objecten (${tenant.objecten.length} woningen in portefeuille):**\n`);
    sections.push(tenant.objecten.map((obj, i) => formatObject(obj, i)).join("\n\n"));
    sections.push(`
**Regels voor objectinformatie:**
- Geef alleen informatie over bovenstaande objecten.
- Weet je het antwoord niet op een specifieke vraag over een object? Zeg dat eerlijk en verwijs door naar het kantoor.
- Prijzen zijn vraagprijzen — onderhandelbaar tenzij anders vermeld.
- Bij "Onder bod" of "Verkocht": vertel dat dit object niet meer beschikbaar is, bied aan om vergelijkbare objecten te tonen.
`);
  } else {
    sections.push(`
**Objecten:**
Er zijn momenteel geen specifieke objecten in de kennisbase geladen. Verwijs geïnteresseerden door naar het kantoor of de website voor het actuele aanbod.
`);
  }

  if (tenant.faq && tenant.faq.length > 0) {
    sections.push(`\n**Veelgestelde vragen & antwoorden:**\n`);
    tenant.faq.forEach((item) => {
      sections.push(`Q: ${item.vraag}\nA: ${item.antwoord}\n`);
    });
  }

  sections.push(`
**Wat de AI Collega doet voor bezoekers:**
- Beantwoordt vragen over objecten, het aankoopproces en het verkoopproces
- Plant bezichtigingen in (vraagt naam + contactgegeven + gewenst object, geeft door aan kantoor)
- Schrijft geen contracten, geeft geen juridisch of financieel advies
- Verwijst bij complexe vragen altijd door naar een medewerker van het kantoor
`);

  return sections.join("\n");
}

/**
 * Prompt voor het genereren van woningomschrijvingen.
 */
export function buildWoningomschrijvingPrompt(input: Record<string, string | number | boolean | string[]>): string {
  return `Je bent een ervaren vastgoedcopywriter. Schrijf drie verschillende woningomschrijvingen op basis van onderstaande kenmerken. Schrijf in het Nederlands, zonder overdreven superlatieven.

**Woningkenmerken:**
- Adres: ${input.adres || "niet opgegeven"}
- Type woning: ${input.type || "niet opgegeven"}
- Vraagprijs: € ${input.prijs ? Number(input.prijs).toLocaleString("nl-NL") : "niet opgegeven"}
- Kamers: ${input.kamers || "niet opgegeven"}
- Woonoppervlak: ${input.oppervlak || "niet opgegeven"} m²
- Bijzondere kenmerken: ${Array.isArray(input.kenmerken) ? input.kenmerken.join(", ") : (input.kenmerken || "geen opgegeven")}
- Sfeer/toon: ${input.sfeer || "neutraal, professioneel"}
- Extra info: ${input.extraInfo || "geen"}

**Schrijf precies drie varianten in dit format:**

VARIANT_1_START
[Funda-omschrijving: zakelijk en informatief, 80-120 woorden, geschikt voor woningplatforms]
VARIANT_1_END

VARIANT_2_START
[Instagram-omschrijving: pakkend en visueel, 60-80 woorden, voor social media]
VARIANT_2_END

VARIANT_3_START
[E-mail omschrijving: persoonlijk en uitnodigend, 100-130 woorden, voor nieuwsbrief of direct mail]
VARIANT_3_END

Regels:
- Geen emoji's (behalve in de Instagram-variant, maximaal 2)
- Geen overdreven superlatieven ("fantastisch", "absoluut uniek", "droomwoning")
- Concrete feiten gebruiken: m², prijzen, kenmerken
- Elke variant heeft een andere aanpak en toon`;
}

/**
 * Prompt voor een opvolgmail na bezichtiging.
 */
export function buildOpvolgmailPrompt(input: Record<string, string | number | boolean | string[]>): string {
  return `Schrijf een professionele opvolgmail na een woningbezichtiging. Schrijf in het Nederlands.

**Context:**
- Makelaarskantoor: ${input.kantoorNaam || "het kantoor"}
- Naam bezoeker: ${input.bezoekerNaam || "de geïnteresseerde"}
- Object bezichtigd: ${input.object || "de woning"}
- Datum bezichtiging: ${input.datum || "recent"}
- Toon: ${input.toon || "informeel, vriendelijk"}

**Doel van de mail:**
- Bedank voor het bezoek
- Vraag hoe de woning beviel (open vraag)
- Vraag of er nog vragen zijn
- Bied aan om het biedproces uit te leggen
- Nodig uit voor contact

**Regels:**
- Maximaal 150 woorden
- Geen superlatieven of overdreven enthousiasme
- Persoonlijk en warm, niet formeel of robotachtig
- Eindig met een concrete uitnodiging tot actie

Schrijf alleen de e-mailtekst (onderwerp + body), geen uitleg eromheen.

Format:
ONDERWERP: [e-mailonderwerp]

[e-mailbody]`;
}

/**
 * Prompt voor een feedback-verzoek na bezichtiging.
 */
export function buildFeedbackRequestPrompt(input: Record<string, string | number | boolean | string[]>): string {
  return `Schrijf een kort feedback-verzoek dat na een woningbezichtiging wordt verstuurd. Schrijf in het Nederlands.

**Context:**
- Object: ${input.object || "de woning"}
- Naam bezoeker: ${input.bezoekerNaam || "de geïnteresseerde"}
- Toon: ${input.toon || "informeel"}

**Doel:**
- Vraag om concrete feedback: wat vond de bezoeker goed, wat minder?
- Vraag of er interesse is in een vervolggesprek
- Houd het kort (max 80 woorden)

Format:
ONDERWERP: [e-mailonderwerp]

[e-mailbody]`;
}

/**
 * Parse de drie varianten uit de LLM-output.
 */
export function parseWoningomschrijvingOutput(raw: string): { label: string; tekst: string }[] {
  const variants: { label: string; tekst: string }[] = [];

  const patterns = [
    { start: "VARIANT_1_START", end: "VARIANT_1_END", label: "Funda" },
    { start: "VARIANT_2_START", end: "VARIANT_2_END", label: "Instagram" },
    { start: "VARIANT_3_START", end: "VARIANT_3_END", label: "E-mail" },
  ];

  for (const { start, end, label } of patterns) {
    const startIdx = raw.indexOf(start);
    const endIdx = raw.indexOf(end);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const tekst = raw.slice(startIdx + start.length, endIdx).trim();
      if (tekst) variants.push({ label, tekst });
    }
  }

  // Fallback: als parsing mislukt, geef de raw tekst terug als één blok
  if (variants.length === 0 && raw.trim()) {
    variants.push({ label: "Omschrijving", tekst: raw.trim() });
  }

  return variants;
}
