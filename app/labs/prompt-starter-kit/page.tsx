"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Copy, Check } from "lucide-react";

const CATEGORIEEN = ["Alle", "Klantenservice", "Marketing", "Financiën", "HR", "Juridisch"] as const;
type Categorie = (typeof CATEGORIEEN)[number];

interface Prompt {
  titel: string;
  categorie: Exclude<Categorie, "Alle">;
  doel: string;
  prompt: string;
  voorbeeldOutput: string;
}

const PROMPTS: Prompt[] = [
  // Klantenservice
  {
    titel: "Klantenklacht professioneel beantwoorden",
    categorie: "Klantenservice",
    doel: "Schrijf een empathisch en oplossingsgericht antwoord op een klantenklacht.",
    prompt: `Je bent een klantenservicemedewerker van [BEDRIJFSNAAM]. Een klant heeft de volgende klacht gestuurd:

"[KLACHT]"

Schrijf een professioneel antwoord dat:
1. De klacht erkent en empathie toont
2. Excuses aanbiedt indien van toepassing
3. Concrete vervolgstappen benoemt
4. Eindigt met een positieve noot

Toon: vriendelijk, oplossingsgericht, niet defensief.`,
    voorbeeldOutput: "Geachte [Naam], Hartelijk dank voor uw bericht. Wij begrijpen uw frustratie volledig en bieden onze welgemeende excuses aan voor het ongemak. We gaan dit direct voor u oplossen door... Met vriendelijke groeten, [Naam]",
  },
  {
    titel: "FAQ opstellen vanuit reviews",
    categorie: "Klantenservice",
    doel: "Genereer een FAQ op basis van veelgestelde vragen in klantreviews.",
    prompt: `Analyseer de volgende klantreviews van [BEDRIJFSNAAM] en stel een FAQ op met de 5 meest gestelde vragen en professionele antwoorden:

[REVIEWS PLAKKEN]

Formaat per vraag:
- Vraag: [vraag]
- Antwoord: [antwoord in max 3 zinnen]`,
    voorbeeldOutput: "V: Hoe snel wordt mijn bestelling geleverd?\nA: Wij leveren standaard binnen 2-3 werkdagen in Nederland. Spoedlevering is mogelijk voor €4,95 extra...",
  },
  {
    titel: "Chatbot-antwoord opstellen",
    categorie: "Klantenservice",
    doel: "Schrijf een beknopt en helder chatbot-antwoord op een specifieke vraag.",
    prompt: `Schrijf een chatbot-antwoord voor [BEDRIJFSNAAM] op de volgende vraag:
"[VRAAG]"

Richtlijnen:
- Max 3 zinnen
- Bied een vervolgoptie aan (bijv. doorverwijzen naar mens of FAQ)
- Informeel maar professioneel
- Geen jargon`,
    voorbeeldOutput: "Goed dat je contact opneemt! Je bestelling staat gepland voor levering op [datum]. Wil je de track & trace-link, of heb je een andere vraag?",
  },
  // Marketing
  {
    titel: "LinkedIn-post schrijven",
    categorie: "Marketing",
    doel: "Schrijf een engaging LinkedIn-post die expertise toont zonder reclameboodschap te zijn.",
    prompt: `Schrijf een LinkedIn-post voor [NAAM/BEDRIJFSNAAM] over het volgende onderwerp:
[ONDERWERP]

Richtlijnen:
- Begin met een pakkende eerste zin (geen vraag)
- Deel een concrete les of inzicht
- Max 150 woorden
- Eindig met een zachte call-to-action
- Geen hashtag-spam (max 3 relevante hashtags)
- Toon: persoonlijk, direct, niet verkoopachtig`,
    voorbeeldOutput: "Vorige week kostte een handmatig proces ons team 6 uur per week. Nu kost het 20 minuten.\n\nWat we leerden: automatisering werkt pas als je eerst het proces begrijpt...",
  },
  {
    titel: "E-mailcampagne onderwerpregel testen",
    categorie: "Marketing",
    doel: "Genereer 5 varianten van e-mailonderwerpregels voor A/B-testing.",
    prompt: `Schrijf 5 varianten van een e-mailonderwerpregel voor de volgende e-mail:

Doelgroep: [BESCHRIJF DOELGROEP]
Doel van de e-mail: [DOEL]
Kernboodschap: [BOODSCHAP]

Maak per variant een andere aanpak:
1. Nieuwsgierigheid wekken
2. Voordeel benoemen
3. Urgentie creëren
4. Persoonlijk aanspreken
5. Cijfer/statistiek gebruiken

Max 50 tekens per variant.`,
    voorbeeldOutput: "1. Wat 87% van MKB-ers nog niet weet over AI\n2. Bespaar 8 uur per week - zo doe je dat\n3. Aanbieding geldig t/m vrijdag: gratis scan\n4. [Voornaam], heb jij dit al geprobeerd?\n5. 3 minuten. 40% minder handwerk.",
  },
  {
    titel: "Productomschrijving schrijven",
    categorie: "Marketing",
    doel: "Schrijf een overtuigende productomschrijving gericht op voordelen, niet features.",
    prompt: `Schrijf een productomschrijving voor [PRODUCTNAAM].

Productkenmerken:
[KENMERKEN OPSOMMEN]

Doelgroep: [DOELGROEP]
Platform: [WEBSITE / WEBSHOP / FOLDER]

Richtlijnen:
- Begin met het grootste klantvoordeel
- Max 80 woorden
- Geen technisch jargon
- Actieve schrijfstijl
- Eindig met een zachte call-to-action`,
    voorbeeldOutput: "Stop met uren kwijt zijn aan factuurverwerking. [Productnaam] leest, categoriseert en boekt je inkoopfacturen automatisch - in seconden. Compatibel met Exact en Twinfield. Probeer 30 dagen gratis.",
  },
  // Financiën
  {
    titel: "Offerte schrijven",
    categorie: "Financiën",
    doel: "Schrijf een professionele offerte op basis van een projectomschrijving.",
    prompt: `Schrijf een professionele offerte voor de volgende opdracht:

Opdrachtgever: [NAAM]
Opdracht: [BESCHRIJVING]
Geschatte uren: [UREN]
Uurtarief: [TARIEF]
Projectduur: [DUUR]

Neem op:
- Korte projectomschrijving
- Scope (wat is inbegrepen, wat niet)
- Investering met subtotaal en BTW
- Betalingsvoorwaarden
- Geldigheid offerte
- Ondertekeningsveld

Toon: professioneel, bondig.`,
    voorbeeldOutput: "OFFERTE #2024-045\nDatum: [datum]\nGeldig tot: [datum + 30 dagen]\n\nProjectomschrijving:\nImplementatie van een geautomatiseerd facturatieproces voor [Naam]...",
  },
  {
    titel: "Kostenanalyse samenvatten",
    categorie: "Financiën",
    doel: "Vertaal een ruwe kostenopstelling naar een begrijpelijk management-overzicht.",
    prompt: `Hieronder staat een kostenopstelling. Schrijf een managementsamenvatting van max 150 woorden die:
1. De totale investering benoemt
2. De belangrijkste kostenposten uitlegt
3. De verwachte terugverdientijd schat
4. Een aanbeveling doet

Kostenopstelling:
[PLAK HIER DE CIJFERS]`,
    voorbeeldOutput: "Totale investering: €18.500 (eenmalig) + €350/maand licentie.\n\nDe drie grootste kostenposten zijn implementatie (€12.000), training (€3.500) en integraties (€3.000). Op basis van de huidige handmatige tijdsbesteding van 40 uur/week (€35/uur) verwachten wij een terugverdientijd van 14 maanden...",
  },
  // HR
  {
    titel: "Vacaturetekst schrijven",
    categorie: "HR",
    doel: "Schrijf een aantrekkelijke vacaturetekst die de juiste kandidaten aantrekt.",
    prompt: `Schrijf een vacaturetekst voor de volgende functie:

Functietitel: [TITEL]
Bedrijf: [BEDRIJFSNAAM]
Locatie: [LOCATIE] / [REMOTE/HYBRID/ON-SITE]
Kerntaken: [OPSOMMING]
Vereisten: [OPSOMMING]
Wat wij bieden: [OPSOMMING]

Richtlijnen:
- Begin met waarom iemand dit wil worden, niet met een bedrijfsbeschrijving
- Inclusief taalgebruik
- Max 300 woorden
- Geen clichés ("dynamisch team", "marktconform salaris")
- Sluit af met een concrete sollicitatieinstructie`,
    voorbeeldOutput: "Jij houdt van structuur in chaos. Als [Titel] bij [Bedrijf] ben jij degene die processen soepel laat lopen terwijl anderen opstarten. Wat je doet: ...",
  },
  {
    titel: "Beoordelingsgesprek voorbereiden",
    categorie: "HR",
    doel: "Stel gerichte vragen op voor een productief beoordelingsgesprek.",
    prompt: `Stel een gestructureerde gespreksopzet op voor een beoordelingsgesprek met een medewerker in de functie [FUNCTIE].

Beoordelingsperiode: [PERIODE]
Kernpunten om te bespreken: [EVENTUELE THEMA'S]

Maak een opzet met:
1. Openingsvraag (ijsbreker)
2. 3 terugblikvragen (prestaties, samenwerking, uitdagingen)
3. 2 vooruitblikvragen (doelen, ontwikkeling)
4. Afsluiting

Duur gesprek: 45 minuten.`,
    voorbeeldOutput: "Opening (5 min): 'Hoe kijk jij zelf terug op dit jaar?'\n\nTerugblik (20 min):\n- Welk resultaat ben je het meest trots op?\n- Waar liep je tegenaan en hoe heb je dat opgelost?\n...",
  },
  // Juridisch
  {
    titel: "Privacy policy samenvatten",
    categorie: "Juridisch",
    doel: "Vertaal een juridische privacy policy naar begrijpelijke taal voor gebruikers.",
    prompt: `Hieronder staat een privacy policy. Schrijf een begrijpelijke samenvatting voor eindgebruikers van max 200 woorden.

Gebruik eenvoudige taal, geen juridisch jargon. Structureer met deze kopjes:
- Wat we verzamelen
- Waarom we het gebruiken
- Met wie we het delen
- Hoe je je rechten gebruikt

Privacy policy:
[PLAK HIER DE TEKST]`,
    voorbeeldOutput: "Wat we verzamelen: We slaan je naam, e-mailadres en aankoopgeschiedenis op. Geen gevoelige gegevens.\n\nWaarom: Om je bestelling te verwerken en relevante updates te sturen...",
  },
  {
    titel: "Opdrachtbevestiging opstellen",
    categorie: "Juridisch",
    doel: "Schrijf een heldere opdrachtbevestiging die verwachtingen vastlegt.",
    prompt: `Schrijf een opdrachtbevestiging voor de volgende samenwerking:

Opdrachtnemer: [NAAM/BEDRIJF]
Opdrachtgever: [NAAM/BEDRIJF]
Opdracht: [BESCHRIJVING]
Startdatum: [DATUM]
Einddatum: [DATUM]
Vergoeding: [BEDRAG EN BETALINGSWIJZE]
Bijzonderheden: [EVENTUEEL]

Neem op: omschrijving werkzaamheden, vergoeding, looptijd, annuleringsregeling, intellectueel eigendom (standaard bij opdrachtnemer tenzij anders afgesproken), toepasselijk recht.`,
    voorbeeldOutput: "OPDRACHTBEVESTIGING\n\nHierbij bevestigen wij de samenwerking zoals mondeling overeengekomen:\n\n1. Werkzaamheden\n[Opdrachtnemer] zal de volgende werkzaamheden uitvoeren voor [Opdrachtgever]: ...",
  },
  {
    titel: "NDA checklist opstellen",
    categorie: "Juridisch",
    doel: "Controleer of een geheimhoudingsovereenkomst de juiste elementen bevat.",
    prompt: `Ik heb een geheimhoudingsovereenkomst (NDA) ontvangen. Controleer of de volgende elementen aanwezig en duidelijk zijn:

1. Definitie van vertrouwelijke informatie
2. Duur van de geheimhouding
3. Uitzonderingen (openbaar domein, al bekend)
4. Sancties bij schending
5. Toepasselijk recht
6. Contactpersonen / ondertekenaars

NDA-tekst:
[PLAK HIER DE NDA]

Geef per punt aan: aanwezig / ontbreekt / onduidelijk - met een korte toelichting.`,
    voorbeeldOutput: "1. Definitie vertrouwelijke informatie: Aanwezig - artikel 2.1 definieert dit breed als 'alle informatie gedeeld in het kader van de samenwerking'.\n2. Duur: Ontbreekt - geen expliciete eindtermijn...",
  },
  {
    titel: "Algemene voorwaarden samenvatten",
    categorie: "Juridisch",
    doel: "Maak algemene voorwaarden begrijpelijk voor klanten of nieuwe medewerkers.",
    prompt: `Samenvatting gevraagd van onderstaande algemene voorwaarden. Gebruik voor klanten of nieuwe medewerkers. Max 250 woorden, eenvoudige taal.

Neem op:
- Wat de klant mag verwachten
- Wat de klant niet mag doen
- Hoe klachten worden afgehandeld
- Wanneer de overeenkomst eindigt

Algemene voorwaarden:
[PLAK HIER DE TEKST]`,
    voorbeeldOutput: "Samenvatting voor klanten:\n\nWat u mag verwachten: Levering binnen de afgesproken termijn en een aanspreekpunt bij vragen. We reageren binnen 2 werkdagen...",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#575760] transition-all hover:border-[#22c55e]/40 hover:text-[#16a34a]"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-[#22c55e]" />
          Gekopieerd
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Kopieer prompt
        </>
      )}
    </button>
  );
}

export default function PromptStarterKitPage() {
  const [actief, setActief] = useState<Categorie>("Alle");

  const gefilterd = actief === "Alle" ? PROMPTS : PROMPTS.filter((p) => p.categorie === actief);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1f1f1f] px-6 py-20 text-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 mb-8">
            <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
            {PROMPTS.length} kant-en-klare prompts - gratis
          </div>
          <h1
            className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[48px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            Prompt Starter Kit
            <br />
            <span className="font-exposure">voor Limburgse MKB.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 sm:text-lg max-w-2xl mx-auto">
            Direct inzetbare AI-prompts voor klantenservice, marketing, financien, HR en juridisch.
            Kopieer, pas aan op jouw bedrijf, en gebruik.
          </p>
        </div>
      </section>

      {/* Filter + Prompts */}
      <section className="px-6 py-16 bg-[#f2f3f5]">
        <div className="mx-auto max-w-6xl">
          {/* Categorie filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIEEN.map((cat) => (
              <button
                key={cat}
                onClick={() => setActief(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  actief === cat
                    ? "bg-[#1f1f1f] text-white"
                    : "bg-white border border-black/10 text-[#575760] hover:border-[#1f1f1f]/20 hover:text-[#1f1f1f]"
                }`}
              >
                {cat}
                {cat !== "Alle" && (
                  <span className={`ml-1.5 text-xs ${actief === cat ? "text-white/60" : "text-[#b2b2be]"}`}>
                    ({PROMPTS.filter((p) => p.categorie === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Prompt cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {gefilterd.map((prompt) => (
              <div
                key={prompt.titel}
                className="flex flex-col gap-4 bg-white border border-black/[0.06] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">
                      {prompt.categorie}
                    </span>
                    <h2 className="text-base font-semibold text-[#1f1f1f] leading-snug">
                      {prompt.titel}
                    </h2>
                  </div>
                  <CopyButton text={prompt.prompt} />
                </div>

                <p className="text-sm text-[#575760] leading-relaxed">{prompt.doel}</p>

                <div className="rounded-lg bg-[#f2f3f5] p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#b2b2be] mb-2">Prompt</p>
                  <pre className="text-xs text-[#1f1f1f] leading-relaxed whitespace-pre-wrap font-mono">
                    {prompt.prompt}
                  </pre>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-xs font-medium text-[#575760] hover:text-[#1f1f1f] transition-colors list-none flex items-center gap-1">
                    <span className="inline-block transition-transform group-open:rotate-90">▶</span>
                    Voorbeeld output
                  </summary>
                  <div className="mt-3 rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5 p-4">
                    <p className="text-xs text-[#1f1f1f] leading-relaxed whitespace-pre-wrap">
                      {prompt.voorbeeldOutput}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[26px] mb-4"
            style={{ letterSpacing: "-0.6px" }}
          >
            Wil je weten welke AI-tools
            <br />
            <span className="font-exposure">bij jouw bedrijf passen?</span>
          </h2>
          <p className="text-sm leading-relaxed text-[#575760] mb-8 max-w-xl mx-auto">
            Vergelijk ChatGPT, Claude, Gemini en 7 andere tools op prijs, GDPR en gebruiksgemak.
          </p>
          <a
            href="/labs/tools-vergelijker"
            className="inline-block rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
          >
            Bekijk AI Tools Vergelijker →
          </a>
        </div>
      </section>
    </>
  );
}
