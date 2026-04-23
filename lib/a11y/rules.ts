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
    guide: {
      problem:
        "Het openende <html>-element heeft geen lang-attribuut, of de waarde is ongeldig (bijv. leeg of 'xx').",
      impactExplanation:
        "Schermlezers (NVDA, JAWS, VoiceOver) weten hierdoor niet welke uitspraakregels te gebruiken. Een Nederlandse pagina wordt dan met Engelse stem voorgelezen — onverstaanbaar voor de gebruiker.",
      steps: [
        "Bepaal de primaire taal van de pagina (bijvoorbeeld nl, en, de).",
        "Voeg het lang-attribuut toe aan het <html>-element met de juiste BCP 47-taalcode.",
        "Voor regio-specifieke content gebruik je een sub-tag (bijv. nl-BE voor Vlaams).",
        "Bij meertalige stukken binnen een pagina: gebruik lang ook op het specifieke element (<p lang=\"en\">…</p>).",
      ],
      example: {
        bad: `<!DOCTYPE html>\n<html>\n  <head>…</head>\n  <body>…</body>\n</html>`,
        good: `<!DOCTYPE html>\n<html lang="nl">\n  <head>…</head>\n  <body>…</body>\n</html>`,
      },
    },
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
    guide: {
      problem:
        "De pagina heeft geen <title>-element in de <head>, óf de titel is leeg, óf hij is voor elke pagina identiek.",
      impactExplanation:
        "De titel is het eerste wat een schermlezer voorleest bij paginawissel en wat in browser-tabs en bookmarks verschijnt. Zonder titel is het onmogelijk meerdere tabs uit elkaar te houden of terug te navigeren via de browsergeschiedenis.",
      steps: [
        "Geef elke pagina een unieke, beschrijvende titel die het onderwerp samenvat.",
        "Plaats het belangrijkste sleutelwoord vooraan, gevolgd door de organisatienaam.",
        "Houd de titel tussen 30 en 65 tekens — wat in een browsertab past.",
        "Zorg dat de titel verandert wanneer de paginastatus verandert (bijv. winkelmandje, formulier-error).",
      ],
      example: {
        bad: `<head>\n  <meta charset="utf-8">\n</head>`,
        good: `<head>\n  <meta charset="utf-8">\n  <title>Toegankelijkheidsaudit · MAISON BLNDR</title>\n</head>`,
      },
    },
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
    guide: {
      problem:
        "De viewport-meta blokkeert zoomen via user-scalable=no of stelt maximum-scale lager dan 2 in. Gebruikers kunnen daardoor de tekst niet tot 200 % vergroten.",
      impactExplanation:
        "Slechtzienden, ouderen en mensen met motoriekproblemen zijn sterk afhankelijk van pinch-to-zoom. WCAG 1.4.4 vereist dat tekst minstens tot 200 % geschaald kan worden zonder verlies van inhoud of functionaliteit.",
      steps: [
        "Verwijder user-scalable=no uit de viewport-meta.",
        "Verwijder maximum-scale of zet minimaal 5 (geen praktische beperking).",
        "Houd width=device-width en initial-scale=1 zodat de pagina goed responsive blijft.",
        "Test op mobiel: pinch-to-zoom moet werken én tekst tot 200 % vergroot blijven leesbaar zonder horizontaal scrollen.",
      ],
      example: {
        bad: `<meta name="viewport"\n  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`,
        good: `<meta name="viewport"\n  content="width=device-width, initial-scale=1">`,
      },
    },
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
    fix: 'Voeg aan elke betekenisvolle <img> een beschrijvend alt-attribuut toe; gebruik alt="" voor puur decoratieve afbeeldingen.',
    guide: {
      problem:
        "Een of meer <img>-elementen hebben geen alt-attribuut. Het alt-attribuut zelf moet altijd aanwezig zijn — alleen de waarde mag leeg zijn voor decoratieve beelden.",
      impactExplanation:
        "Blinde en slechtziende gebruikers krijgen via een schermlezer in plaats van de beschrijving alleen het bestandspad te horen, bijvoorbeeld 'IMG_2384.jpg'. Bij betekenisvolle afbeeldingen (productfoto's, infographics, iconen met functie) gaat de inhoud volledig verloren.",
      steps: [
        "Beoordeel per afbeelding of die informatie overdraagt of puur decoratief is.",
        "Betekenisvolle afbeeldingen: schrijf een korte, beschrijvende alt-tekst die de functie/inhoud van de afbeelding overbrengt — niet 'foto van' of 'plaatje'.",
        "Decoratieve afbeeldingen (achtergrond, splitter, logo naast tekstlogo): gebruik alt=\"\" zodat schermlezers ze overslaan.",
        "Voor complexe afbeeldingen (grafieken, diagrammen): gebruik alt voor korte beschrijving en aria-describedby voor lange uitleg, of plaats de uitleg in omringende tekst.",
        "Gebruik nooit het bestandspad of dezelfde alt-tekst meermaals voor verschillende afbeeldingen.",
      ],
      example: {
        bad: `<img src="/img/team.jpg">\n<img src="/img/icon-mail.svg">`,
        good: `<img src="/img/team.jpg"\n  alt="Vier MAISON BLNDR-medewerkers in overleg rond een whiteboard">\n<img src="/img/icon-mail.svg" alt=""> <!-- decoratief naast tekst -->`,
      },
    },
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
    guide: {
      problem:
        "Eén of meer invoervelden (input, select, textarea) hebben geen programmatische koppeling met een label. Een placeholder telt niet als label.",
      impactExplanation:
        "Schermlezers kondigen het veld dan aan als 'tekstveld' zonder uitleg. Spraakbesturing kan het veld niet bij naam aansturen ('vul e-mailadres in' werkt niet). Voor mensen met cognitieve beperkingen verdwijnt placeholder-tekst zodra ze beginnen te typen — dan weten ze niet meer wat ze invullen.",
      steps: [
        "Voeg een zichtbare <label> toe en koppel met for=\"…\" aan de id van het invoerveld.",
        "Of wikkel het invoerveld in het label: <label>E-mail <input type=\"email\"></label>.",
        "Wanneer een zichtbaar label echt niet kan (zoekvak met icoon): gebruik aria-label=\"Zoeken\" op het invoerveld.",
        "Vervang placeholder-only labels door echte labels — placeholders verdwijnen tijdens typen en hebben slecht contrast.",
        "Gebruik geen voorgedrukte labels die naast (in plaats van boven) het veld staan — top-aligned labels werken het best.",
      ],
      example: {
        bad: `<input type="email" name="email" placeholder="E-mailadres">`,
        good: `<label for="email-field">E-mailadres</label>\n<input id="email-field" type="email" name="email" autocomplete="email">`,
      },
    },
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
    guide: {
      problem:
        "Een of meer <a>-elementen hebben geen tekst, geen aria-label en geen afbeelding met alt-tekst. De link bestaat wel, maar heeft geen toegankelijke naam.",
      impactExplanation:
        "Schermlezergebruikers krijgen alleen 'link, link' te horen — of in het beste geval de URL. Wanneer ze een lijst van alle links opvragen om te navigeren, zien ze meerdere identieke 'link'-items. Zo wordt navigeren onmogelijk.",
      steps: [
        "Geef de link zichtbare, beschrijvende tekst die op zichzelf duidelijk is ('Lees meer over toegankelijkheid', niet 'Klik hier').",
        "Bij icon-only links (sociale media, sluitknop): voeg aria-label toe met de bestemming/actie.",
        "Bij een link rond een afbeelding: zorg dat de afbeelding alt-tekst heeft die het doel beschrijft.",
        "Combineer aria-label met visueel verborgen tekst (sr-only) als je het icoon niet wilt verbergen.",
        "Vermijd duplicate linktekst die naar verschillende bestemmingen wijst ('Lees meer' × 5).",
      ],
      example: {
        bad: `<a href="https://linkedin.com/company/…"><img src="/icons/linkedin.svg"></a>\n<a href="/blog/post-1">Klik hier</a>`,
        good: `<a href="https://linkedin.com/company/…" aria-label="MAISON BLNDR op LinkedIn">\n  <img src="/icons/linkedin.svg" alt="">\n</a>\n<a href="/blog/post-1">Lees: hoe AI de bouwsector verandert</a>`,
      },
    },
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
    fix: 'Geef elke <button> zichtbare tekst of een aria-label, bijvoorbeeld <button aria-label="Sluiten">×</button>.',
    guide: {
      problem:
        "Een of meer <button>-elementen hebben geen zichtbare tekst en geen aria-label. Vaak zijn dit knoppen met alleen een icoon of een symbool zoals × of +.",
      impactExplanation:
        "Schermlezers kondigen de knop dan aan als 'knop' zonder context. Toetsenbord- en spraakgebruikers kunnen de knop niet identificeren of activeren via stem ('klik sluiten').",
      steps: [
        "Voeg zichtbare tekst toe wanneer dat past (heeft de voorkeur — werkt voor iedereen).",
        "Bij icon-only buttons: voeg aria-label toe met een werkwoord dat de actie beschrijft ('Sluiten', 'Menu openen', 'Vorige slide').",
        "Voeg ook een title-attribuut toe voor sighted-users tooltip — handig maar geen vervanging voor aria-label.",
        "Controleer dat het symbool zelf (×, ☰) decoratief is voor schermlezers door de tekst correct te coderen.",
        "Voor toggle-buttons (collapse, mute): gebruik aria-pressed of aria-expanded zodat de status hoorbaar is.",
      ],
      example: {
        bad: `<button class="modal-close">×</button>\n<button class="hamburger"><svg>…</svg></button>`,
        good: `<button class="modal-close" aria-label="Modal sluiten">\n  <span aria-hidden="true">×</span>\n</button>\n<button class="hamburger" aria-label="Hoofdmenu openen" aria-expanded="false">\n  <svg aria-hidden="true">…</svg>\n</button>`,
      },
    },
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
    guide: {
      problem:
        "Een of meer <iframe>-elementen hebben geen title-attribuut. Iframes worden vaak gebruikt voor video's (YouTube, Vimeo), kaarten (Google Maps) en widgets.",
      impactExplanation:
        "Schermlezers kondigen het iframe aan als 'frame' zonder context. Een gebruiker hoort alleen 'frame, …, frame' bij navigatie en weet niet wat de inhoud is. Tabbed access springt door de inhoud zonder duiding.",
      steps: [
        "Voeg een beschrijvend title-attribuut toe dat de inhoud benoemt (geen 'iframe' of 'embed').",
        "Beschrijf wat erin zit, niet de technologie ('Productdemo', niet 'YouTube-player').",
        "Voor decoratieve of lege iframes (analytics-pixel): gebruik tabindex=\"-1\" en aria-hidden=\"true\".",
        "Bij meerdere iframes naar dezelfde bron: maak elk title uniek (volgnummer, onderwerp).",
      ],
      example: {
        bad: `<iframe src="https://www.youtube.com/embed/abc123"></iframe>`,
        good: `<iframe\n  src="https://www.youtube.com/embed/abc123"\n  title="Productdemo: zo werkt de toegankelijkheidsaudit"\n  loading="lazy">\n</iframe>`,
      },
    },
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
    guide: {
      problem:
        "De pagina mist een <h1>, heeft meerdere <h1>-elementen, of slaat heading-niveaus over (bijv. <h2> direct gevolgd door <h4>).",
      impactExplanation:
        "Schermlezergebruikers navigeren primair via de heading-structuur (NVDA-toets H, VoiceOver rotor → headings). Een gebroken hiërarchie maakt het onmogelijk om de paginastructuur snel te scannen — vergelijkbaar met een inhoudsopgave waarin hoofdstukken willekeurig genummerd zijn.",
      steps: [
        "Begin elke pagina met precies één <h1> die het paginaonderwerp benoemt.",
        "Gebruik <h2> voor de hoofdsecties, <h3> voor subsecties daaronder, enzovoort.",
        "Sla nooit niveaus over: ga niet van <h2> naar <h4>.",
        "Kies heading-niveau op basis van semantiek, niet op basis van de gewenste tekstgrootte. Pas styling aan met CSS.",
        "Verberg headings visueel met sr-only als ze nodig zijn voor structuur maar niet zichtbaar moeten zijn.",
      ],
      example: {
        bad: `<h1>Welkom</h1>\n<h3>Onze diensten</h3>\n<h5>AI Quickscan</h5>\n<h2>Cases</h2>`,
        good: `<h1>Welkom bij MAISON BLNDR</h1>\n<h2>Onze diensten</h2>\n<h3>AI Quickscan</h3>\n<h2>Cases</h2>`,
      },
    },
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
    guide: {
      problem:
        "De pagina heeft geen <main>-element en geen element met role=\"main\". De hoofdinhoud is daardoor niet als landmark herkenbaar.",
      impactExplanation:
        "Schermlezergebruikers springen via landmarks (toets D in NVDA, rotor in VoiceOver) direct naar de relevante secties: header, navigation, main, complementary, footer. Zonder <main> moeten ze elke keer door de hele navigatie heen tabben om bij de inhoud te komen.",
      steps: [
        "Wikkel de unieke paginainhoud (alles behalve header, navigatie, footer) in één <main>-element.",
        "Plaats <main> direct onder <body>, naast <header> en <footer>.",
        "Gebruik per pagina precies één <main> — meerdere is verwarrend voor hulptechnologie.",
        "Voeg id=\"main\" toe zodat een skip-link direct naar de hoofdinhoud kan springen.",
        "Gebruik daarnaast <nav>, <header>, <footer>, <aside> voor de andere semantische landmarks.",
      ],
      example: {
        bad: `<body>\n  <div class="header">…</div>\n  <div class="content">\n    <h1>Onze diensten</h1>\n    …\n  </div>\n  <div class="footer">…</div>\n</body>`,
        good: `<body>\n  <header>…</header>\n  <nav aria-label="Hoofdmenu">…</nav>\n  <main id="main">\n    <h1>Onze diensten</h1>\n    …\n  </main>\n  <footer>…</footer>\n</body>`,
      },
    },
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
    guide: {
      problem:
        "De pagina mist een skip-link als eerste focusbaar element. Toetsenbordgebruikers moeten daarom op elke pagina opnieuw door alle navigatie-items tabben.",
      impactExplanation:
        "Voor mensen die met het toetsenbord navigeren (motoriekbeperking, schermlezers, power-users) is het uitputtend om bij elke paginawissel 20+ menu-items door te tabben voor ze bij de inhoud zijn. Een skip-link laat ze direct naar de hoofdinhoud springen.",
      steps: [
        "Plaats een <a href=\"#main\"> direct na de openende <body>, vóór header en navigatie.",
        "Geef het doel-element een matching id (bijv. id=\"main\" op <main>).",
        "Gebruik CSS om de link visueel te verbergen tot hij focus krijgt — dan moet hij prominent verschijnen.",
        "Zorg dat na activatie de focus daadwerkelijk naar de main verspringt (kan een tabindex=\"-1\" op de target nodig hebben).",
        "Test dat de link klikbaar én visueel zichtbaar is met enkel toetsenbord (Tab, Enter).",
      ],
      example: {
        bad: `<body>\n  <header>\n    <nav>… 25 menu-items …</nav>\n  </header>\n  <main>…</main>\n</body>`,
        good: `<body>\n  <a href="#main" class="skip-link">Naar hoofdinhoud</a>\n  <header>\n    <nav>…</nav>\n  </header>\n  <main id="main" tabindex="-1">…</main>\n</body>\n\n<style>\n.skip-link {\n  position: absolute; left: -9999px;\n}\n.skip-link:focus {\n  left: 1rem; top: 1rem;\n  background: #1f1f1f; color: #fff;\n  padding: 0.75rem 1rem;\n}\n</style>`,
      },
    },
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
    guide: {
      problem:
        "Het HTML-document begint niet met <!DOCTYPE html>. Browsers schakelen dan naar 'quirks mode' — een legacy renderingmodus uit de IE5-tijd.",
      impactExplanation:
        "Quirks mode brengt onverwacht CSS-gedrag, foutieve box-modellen en inconsistent gedrag van hulptechnologieën. Veel toegankelijkheidsfeatures (focus-styling, ARIA-rollen, semantische elementen) gedragen zich anders of werken helemaal niet.",
      steps: [
        "Plaats <!DOCTYPE html> als allereerste regel in het document — vóór <html>.",
        "Gebruik exact deze syntaxis (case-insensitive): de HTML5-doctype heeft geen URL of versie.",
        "Verwijder eventuele oude XHTML- of HTML4-doctypes.",
        "Controleer dat geen comments, BOM-tekens of whitespace voor de doctype staan.",
      ],
      example: {
        bad: `<html lang="nl">\n  <head>…</head>\n  <body>…</body>\n</html>`,
        good: `<!DOCTYPE html>\n<html lang="nl">\n  <head>…</head>\n  <body>…</body>\n</html>`,
      },
    },
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
    guide: {
      problem:
        "Twee of meer elementen op de pagina delen dezelfde id-waarde. Volgens de HTML-specificatie moeten id-waarden uniek zijn binnen een document.",
      impactExplanation:
        "ARIA-koppelingen (aria-labelledby, aria-describedby, for op labels) verwijzen naar een specifiek id. Als meerdere elementen dezelfde id hebben, wijst de koppeling alleen naar de eerste — schermlezers krijgen dan verkeerde of incomplete informatie. Ook JavaScript document.getElementById werkt onbetrouwbaar.",
      steps: [
        "Identificeer welke elementen de dubbele id's hebben (de scanner toont voorbeelden).",
        "Geef elk element een unieke id, bijvoorbeeld door een suffix toe te voegen (-1, -2 of een betekenisvolle naam).",
        "Vervang globale id's door class-namen waar je geen unieke verwijzing nodig hebt.",
        "In componenten/templates die meerdere keren op een pagina staan: genereer id's dynamisch met een uniek prefix.",
        "Update alle ARIA-koppelingen en label-for-koppelingen die naar de oude id wezen.",
      ],
      example: {
        bad: `<input id="email" type="email">\n…\n<input id="email" type="email">  <!-- 2× dezelfde id -->`,
        good: `<input id="email-primary" type="email">\n…\n<input id="email-confirm" type="email">`,
      },
    },
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
