import type { RuleDefinition } from "./types";

/**
 * Catalogus van structurele WCAG 2.1 AA-regels die we automatisch
 * kunnen detecteren in statische HTML. EN 301 549 v3.2.1 verwijst
 * (via Annex A / hoofdstuk 9) rechtstreeks naar deze success criteria;
 * de getoonde clausule is de bijbehorende sectie uit EN 301 549.
 */
export const RULES: RuleDefinition[] = [
  {
    id: "html-lang",
    title: "Documenttaal ontbreekt op <html>",
    description:
      "Het <html>-element heeft geen geldig lang-attribuut. Schermlezers gebruiken dit om de juiste uitspraak te kiezen.",
    category: "understandable",
    wcag: { sc: "3.1.1", name: "Language of Page", level: "A" },
    en301549: "9.3.1.1",
    impact: "serious",
    fix: 'Voeg een lang-attribuut toe aan het <html>-element, bijvoorbeeld <html lang="nl">.',
  },
  {
    id: "document-title",
    title: "Documenttitel ontbreekt of is leeg",
    description:
      "Een beschrijvende <title> helpt gebruikers de pagina te identificeren in tabbladen, geschiedenis en bookmarks.",
    category: "operable",
    wcag: { sc: "2.4.2", name: "Page Titled", level: "A" },
    en301549: "9.2.4.2",
    impact: "serious",
    fix: "Voeg een unieke, beschrijvende <title> toe in <head> die het onderwerp van de pagina samenvat.",
  },
  {
    id: "viewport-meta",
    title: "Viewport-meta ontbreekt of blokkeert zoomen",
    description:
      "Een ontbrekende viewport-meta of user-scalable=no / maximum-scale<2 verhindert dat gebruikers tekst tot 200% kunnen vergroten.",
    category: "perceivable",
    wcag: { sc: "1.4.4", name: "Resize Text", level: "AA" },
    en301549: "9.1.4.4",
    impact: "moderate",
    fix: 'Gebruik <meta name="viewport" content="width=device-width, initial-scale=1"> zonder user-scalable=no en zonder maximum-scale onder 2.',
  },
  {
    id: "image-alt",
    title: "Afbeeldingen zonder alt-attribuut",
    description:
      "Elke <img> heeft een alt-attribuut nodig. Gebruik alt='' alleen voor puur decoratieve afbeeldingen.",
    category: "perceivable",
    wcag: { sc: "1.1.1", name: "Non-text Content", level: "A" },
    en301549: "9.1.1.1",
    impact: "critical",
    fix: "Voeg aan elke betekenisvolle <img> een beschrijvend alt-attribuut toe; gebruik alt=\"\" voor puur decoratieve afbeeldingen.",
  },
  {
    id: "form-label",
    title: "Formulierelementen zonder label",
    description:
      "Inputs, selects en textareas moeten een gekoppeld <label>, aria-label of aria-labelledby hebben zodat de functie duidelijk is voor schermlezers.",
    category: "perceivable",
    wcag: { sc: "1.3.1", name: "Info and Relationships", level: "A" },
    en301549: "9.1.3.1",
    impact: "critical",
    fix: 'Koppel ieder invoerveld aan een <label for="id"> of voeg aria-label / aria-labelledby toe.',
  },
  {
    id: "link-name",
    title: "Links zonder toegankelijke naam",
    description:
      "Links moeten een naam hebben (tekstinhoud, aria-label of een afbeelding met alt) zodat het doel duidelijk is.",
    category: "operable",
    wcag: { sc: "2.4.4", name: "Link Purpose (In Context)", level: "A" },
    en301549: "9.2.4.4",
    impact: "serious",
    fix: "Voeg zichtbare linktekst toe of gebruik aria-label; vermijd alleen iconen zonder tekst.",
  },
  {
    id: "button-name",
    title: "Buttons zonder toegankelijke naam",
    description:
      "Knoppen moeten een tekst, aria-label of beeld met alt hebben, anders weet een schermlezergebruiker niet wat de knop doet.",
    category: "robust",
    wcag: { sc: "4.1.2", name: "Name, Role, Value", level: "A" },
    en301549: "9.4.1.2",
    impact: "critical",
    fix: "Geef elke <button> zichtbare tekst of een aria-label, bijvoorbeeld <button aria-label=\"Sluiten\">×</button>.",
  },
  {
    id: "iframe-title",
    title: "Iframes zonder title-attribuut",
    description:
      "Een <iframe> heeft een title nodig zodat hulptechnologieën de inhoud kunnen aankondigen.",
    category: "robust",
    wcag: { sc: "4.1.2", name: "Name, Role, Value", level: "A" },
    en301549: "9.4.1.2",
    impact: "moderate",
    fix: 'Voeg een beschrijvend title-attribuut toe, bijvoorbeeld <iframe title="YouTube-video over ...">.',
  },
  {
    id: "heading-order",
    title: "Onlogische heading-structuur",
    description:
      "De pagina mist een <h1> of slaat heading-niveaus over. Een logische hiërarchie helpt navigatie met schermlezers.",
    category: "perceivable",
    wcag: { sc: "1.3.1", name: "Info and Relationships", level: "A" },
    en301549: "9.1.3.1",
    impact: "moderate",
    fix: "Begin met één <h1> en gebruik <h2>...<h6> in opeenvolgende volgorde zonder niveaus over te slaan.",
  },
  {
    id: "landmarks",
    title: "Geen <main>-landmark gevonden",
    description:
      "Een <main>-element (of role=\"main\") helpt schermlezergebruikers direct naar de hoofdinhoud te springen.",
    category: "perceivable",
    wcag: { sc: "1.3.1", name: "Info and Relationships", level: "A" },
    en301549: "9.1.3.1",
    impact: "moderate",
    fix: "Wikkel de primaire pagina-inhoud in een <main>-element of voeg role=\"main\" toe.",
  },
  {
    id: "skip-link",
    title: "Skip-link naar hoofdinhoud ontbreekt",
    description:
      "Een 'Skip to content'-link als eerste focusbare element laat toetsenbordgebruikers de navigatie overslaan.",
    category: "operable",
    wcag: { sc: "2.4.1", name: "Bypass Blocks", level: "A" },
    en301549: "9.2.4.1",
    impact: "moderate",
    fix: 'Plaats <a href="#main" class="skip-link">Naar hoofdinhoud</a> als eerste focusbare element in de body.',
  },
  {
    id: "doctype-html5",
    title: "HTML5 doctype ontbreekt",
    description:
      "Zonder <!DOCTYPE html> kunnen browsers in quirks mode renderen, wat hulptechnologieën in de war kan brengen.",
    category: "robust",
    wcag: { sc: "4.1.1", name: "Parsing", level: "A" },
    en301549: "9.4.1.1",
    impact: "minor",
    fix: "Plaats <!DOCTYPE html> als eerste regel van het HTML-document.",
  },
  {
    id: "duplicate-ids",
    title: "Dubbele id-attributen",
    description:
      "Dubbele id-waarden breken aria-labelledby/aria-describedby-koppelingen en kunnen onverwacht gedrag veroorzaken.",
    category: "robust",
    wcag: { sc: "4.1.1", name: "Parsing", level: "A" },
    en301549: "9.4.1.1",
    impact: "moderate",
    fix: "Maak alle id-waarden uniek binnen het document.",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  perceivable: "Waarneembaar",
  operable: "Bedienbaar",
  understandable: "Begrijpelijk",
  robust: "Robuust",
};

export function ruleById(id: string): RuleDefinition | undefined {
  return RULES.find((r) => r.id === id);
}
