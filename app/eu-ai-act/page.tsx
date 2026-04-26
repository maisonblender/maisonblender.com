import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "EU AI Act: wat betekent het voor jouw bedrijf | MAISON BLNDR",
  description:
    "Een helder overzicht van de EU AI Act: wat het is, voor wie het geldt, welke verplichtingen er gelden en wanneer de regels in werking treden.",
  alternates: { canonical: "https://maisonblender.com/eu-ai-act" },
  openGraph: {
    title: "EU AI Act: wat betekent het voor jouw bedrijf | MAISON BLNDR",
    description:
      "Een helder overzicht van de EU AI Act: wat het is, voor wie het geldt en wat jouw bedrijf moet doen.",
    url: "https://maisonblender.com/eu-ai-act",
  },
  robots: { index: true, follow: true },
};

const lastUpdated = "22 april 2026";

export default function EuAiActPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        <section className="bg-white px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#b2b2be]">
              Regelgeving
            </p>
            <h1
              className="mb-4 text-[28px] font-normal leading-[1.15] tracking-tight text-[#1f1f1f] sm:text-[36px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              EU AI Act: wat betekent het voor jouw bedrijf?
            </h1>
            <p className="mb-12 text-sm text-[#b2b2be]">
              Laatst bijgewerkt: {lastUpdated}
            </p>

            <div className="space-y-10 text-[#1f1f1f]">

              {/* Inleiding */}
              <div>
                <p className="leading-relaxed text-[#575760]">
                  Op 1 augustus 2024 trad de EU AI Act in werking — de eerste uitgebreide AI-verordening ter
                  wereld, rechtstreeks van toepassing in alle EU-lidstaten. Voor de meeste MKB-bedrijven geldt:
                  de impact hangt volledig af van welke AI-systemen je gebruikt en waarvoor.
                </p>
                <p className="mt-4 leading-relaxed text-[#575760]">
                  De verordening werkt met vier risicocategorieën. Hoe groter het risico van een AI-systeem
                  voor de samenleving, des te strenger de verplichtingen.
                </p>
              </div>

              {/* 1. Wat regelt de EU AI Act */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  1. Wat regelt de EU AI Act?
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  De EU AI Act werkt met een <strong className="text-[#1f1f1f]">risicogebaseerde aanpak</strong>: hoe
                  groter het risico van een AI-systeem voor de samenleving, des te strenger de eisen. Er zijn vier
                  risicocategorieën:
                </p>

                <div className="space-y-4">
                  <div className="border border-black/[0.06] bg-[#f2f3f5] p-5">
                    <p className="mb-2 font-semibold text-[#1f1f1f]">
                      Onaanvaardbaar risico — verboden
                    </p>
                    <p className="leading-relaxed text-[#575760]">
                      AI-toepassingen die fundamentele rechten bedreigen zijn volledig verboden. Voorbeelden:
                      sociale scoringsystemen door overheden, realtime biometrische surveillance in de openbare
                      ruimte (met beperkte uitzonderingen voor rechtshandhaving), manipulatie van gedrag via
                      onbewuste technieken, en gezichtsherkenningsdatabases via ongerichte scraping van internet
                      of camerabeelden.
                    </p>
                  </div>

                  <div className="border border-black/[0.06] bg-[#f2f3f5] p-5">
                    <p className="mb-2 font-semibold text-[#1f1f1f]">
                      Hoog risico — strenge verplichtingen
                    </p>
                    <p className="leading-relaxed text-[#575760]">
                      AI-systemen in kritieke sectoren vallen onder de strengste eisen. Dit betreft onder andere
                      AI in kritieke infrastructuur (energie, water, transport), onderwijs (toelating, beoordeling),
                      werving en selectie van personeel, krediet- en verzekeringsbeoordeling van individuen,
                      rechtshandhaving, rechtspraak en asiel- en migratieprocedures. Ook AI-systemen die als
                      veiligheidscomponent worden gebruikt in producten die al onder andere EU-wetgeving vallen
                      (zoals medische hulpmiddelen of machines), vallen in deze categorie.
                    </p>
                  </div>

                  <div className="border border-black/[0.06] bg-[#f2f3f5] p-5">
                    <p className="mb-2 font-semibold text-[#1f1f1f]">
                      Beperkt risico — transparantieverplichtingen
                    </p>
                    <p className="leading-relaxed text-[#575760]">
                      AI-systemen die rechtstreeks met mensen interageren moeten dit kenbaar maken. Zo moeten
                      chatbots duidelijk aangeven dat de gebruiker niet met een mens communiceert, en moeten
                      deepfakes of AI-gegenereerde inhoud als zodanig worden gelabeld.
                    </p>
                  </div>

                  <div className="border border-black/[0.06] bg-[#f2f3f5] p-5">
                    <p className="mb-2 font-semibold text-[#1f1f1f]">
                      Minimaal risico — geen specifieke verplichtingen
                    </p>
                    <p className="leading-relaxed text-[#575760]">
                      De meeste AI-toepassingen vallen in deze categorie. Denk aan spamfilters, AI in
                      videospellen of aanbevelingssystemen voor films. Er gelden geen verplichtingen vanuit de
                      AI Act, al blijft andere wet- en regelgeving (zoals de AVG) van toepassing.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Voor wie geldt de wet */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  2. Voor wie geldt de EU AI Act?
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  De verordening is van toepassing op meerdere partijen in de keten:
                </p>
                <ul className="space-y-3 leading-relaxed text-[#575760]">
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Aanbieders (providers):</strong> bedrijven of personen die een AI-systeem ontwikkelen en op de EU-markt brengen of in gebruik stellen, ook als ze buiten de EU zijn gevestigd maar hun systeem in de EU werkt.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Deployers (gebruikers):</strong> organisaties die een AI-systeem inzetten voor hun eigen bedrijfsactiviteiten binnen de EU, ook als het systeem door een derde is ontwikkeld.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Importeurs en distributeurs:</strong> partijen die AI-systemen van buiten de EU in de EU-markt brengen of verspreiden.
                    </span>
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-[#575760]">
                  Kleine en middelgrote ondernemingen (mkb) en startups vallen ook onder de wet, maar de Europese
                  Commissie heeft maatregelen aangekondigd om de regeldruk voor deze groep te beperken, zoals
                  vereenvoudigde documentatievereisten en toegang tot regelgevingssandboxen.
                </p>
              </div>

              {/* 3. Verplichtingen hoog-risico AI */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  3. Verplichtingen voor hoog-risico AI-systemen
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Voor aanbieders van hoog-risico AI-systemen gelden de meest uitgebreide eisen:
                </p>
                <ul className="space-y-3 leading-relaxed text-[#575760]">
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Risicomanagementsysteem:</strong> een doorlopend systeem om risico&apos;s te identificeren, analyseren en te beheersen gedurende de volledige levenscyclus van het AI-systeem.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Datakwaliteit en datagovernance:</strong> trainings-, validatie- en testdata moeten voldoen aan kwaliteitscriteria en relevant zijn voor het beoogde gebruik.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Technische documentatie:</strong> uitgebreide documentatie vóór het in gebruik stellen, zodat toezichthouders de naleving kunnen beoordelen.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Automatische logging:</strong> het systeem moet activiteiten automatisch vastleggen zodat resultaten traceerbaar zijn.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Transparantie en gebruikersinformatie:</strong> deployers en gebruikers moeten voldoende informatie krijgen om het systeem correct en veilig te kunnen gebruiken.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Menselijk toezicht:</strong> het systeem moet zodanig zijn ontworpen dat een mens de werking kan monitoren, onderbreken of corrigeren.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Nauwkeurigheid, robuustheid en cyberveiligheid:</strong> het systeem moet een consistent prestatieniveau behalen en bestand zijn tegen fouten en aanvallen.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Conformiteitsbeoordeling en CE-markering:</strong> vóór marktintroductie moet een conformiteitsbeoordeling worden uitgevoerd. In veel gevallen kan de aanbieder dit zelf uitvoeren; voor sommige toepassingen is een notified body verplicht.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Registratie in EU-database:</strong> hoog-risico AI-systemen moeten worden geregistreerd in een door de EU beheerde openbare database vóór marktintroductie.
                    </span>
                  </li>
                </ul>
              </div>

              {/* 4. General Purpose AI */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  4. General Purpose AI (GPAI)-modellen
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  De AI Act bevat aparte regels voor zogenoemde <strong className="text-[#1f1f1f]">General Purpose AI (GPAI)-modellen</strong> — grote taalmodellen en andere fundamentele modellen die voor meerdere doeleinden kunnen worden ingezet, zoals GPT-4, Claude of Gemini.
                </p>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Alle aanbieders van GPAI-modellen die in de EU beschikbaar zijn moeten:
                </p>
                <ul className="space-y-2 leading-relaxed text-[#575760]">
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>Technische documentatie opstellen en bijhouden.</span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>Informatie aan downstreamaanbieders beschikbaar stellen.</span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>Een beleid voeren dat Europees auteursrecht respecteert.</span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>Een samenvatting publiceren van de trainingsdata die voor auteursrechtelijk beschermd materiaal is gebruikt.</span>
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-[#575760]">
                  Voor GPAI-modellen met <strong className="text-[#1f1f1f]">systemisch risico</strong> — modellen getraind met meer dan 10<sup>25</sup> FLOP (een rekenmaatstaf) — gelden aanvullende verplichtingen, waaronder het uitvoeren van adversarial testing (red-teaming), het melden van ernstige incidenten aan de Europese Commissie en het nemen van cyberveiligheidsmaatregelen.
                </p>
              </div>

              {/* 5. Tijdlijn */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  5. Tijdlijn: wanneer gelden welke regels?
                </h2>
                <p className="mb-6 leading-relaxed text-[#575760]">
                  De EU AI Act wordt gefaseerd van kracht. De verordening kende een inwerkingtreding op
                  1 augustus 2024; daarna gelden de volgende deadlines:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <caption className="sr-only">Tijdlijn van inwerkingtreding EU AI Act</caption>
                    <thead>
                      <tr className="border-b border-black/[0.08]">
                        <th scope="col" className="py-3 pr-6 text-left text-xs font-semibold uppercase tracking-widest text-[#575760]">
                          Datum
                        </th>
                        <th scope="col" className="py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#575760]">
                          Wat treedt in werking
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.06] text-[#575760]">
                      <tr>
                        <th scope="row" className="whitespace-nowrap py-3 pr-6 text-left font-medium leading-relaxed text-[#1f1f1f]">
                          2 februari 2025
                        </th>
                        <td className="py-3 leading-relaxed">Verbod op onaanvaardbare AI-praktijken (artikelen 5 en 6 van de verordening).</td>
                      </tr>
                      <tr>
                        <th scope="row" className="whitespace-nowrap py-3 pr-6 text-left font-medium leading-relaxed text-[#1f1f1f]">
                          2 augustus 2025
                        </th>
                        <td className="py-3 leading-relaxed">Verplichtingen voor GPAI-modellen en de governance-structuur (toezichthouders per lidstaat).</td>
                      </tr>
                      <tr>
                        <th scope="row" className="whitespace-nowrap py-3 pr-6 text-left font-medium leading-relaxed text-[#1f1f1f]">
                          2 augustus 2026
                        </th>
                        <td className="py-3 leading-relaxed">Verplichtingen voor hoog-risico AI-systemen (het merendeel van de verordening) en transparantie-eisen voor beperkt-risico systemen.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="whitespace-nowrap py-3 pr-6 text-left font-medium leading-relaxed text-[#1f1f1f]">
                          2 augustus 2027
                        </th>
                        <td className="py-3 leading-relaxed">Uitgebreide deadline voor hoog-risico AI-systemen die als veiligheidscomponent zijn opgenomen in producten die al onder andere EU-productwetgeving vallen (Bijlage I).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Sancties */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  6. Sancties bij overtredingen
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  De AI Act voorziet in aanzienlijke boetes:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <caption className="sr-only">Sancties bij overtredingen EU AI Act</caption>
                    <thead>
                      <tr className="border-b border-black/[0.08]">
                        <th scope="col" className="py-3 pr-6 text-left text-xs font-semibold uppercase tracking-widest text-[#575760]">
                          Overtreding
                        </th>
                        <th scope="col" className="py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#575760]">
                          Maximale boete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.06] text-[#575760]">
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Verboden AI-praktijken (onaanvaardbaar risico)
                        </th>
                        <td className="py-3 leading-relaxed">€ 35 miljoen of 7% van de wereldwijde jaarlijkse omzet</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Overige overtredingen (o.a. hoog-risico verplichtingen)
                        </th>
                        <td className="py-3 leading-relaxed">€ 15 miljoen of 3% van de wereldwijde jaarlijkse omzet</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Verstrekken van onjuiste of misleidende informatie aan toezichthouders
                        </th>
                        <td className="py-3 leading-relaxed">€ 7,5 miljoen of 1,5% van de wereldwijde jaarlijkse omzet</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 leading-relaxed text-[#575760]">
                  Bij mkb-bedrijven en startups geldt het lagere bedrag van de twee grenzen. Bij grote ondernemingen geldt het hogere bedrag.
                </p>
              </div>

              {/* 7. Wat moet jouw bedrijf doen */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  7. Wat moet jouw bedrijf concreet doen?
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Een eerste stap voor elk bedrijf dat AI inzet of ontwikkelt is een <strong className="text-[#1f1f1f]">AI-inventarisatie</strong>: breng in kaart welke AI-systemen je gebruikt, ontwikkelt of inzet en bepaal voor elk systeem in welke risicocategorie het valt.
                </p>
                <ul className="space-y-3 leading-relaxed text-[#575760]">
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Gebruik je uitsluitend minimaal-risico AI</strong> (bijv. spellingscorrectie, aanbevelingssystemen voor interne tools)? Dan gelden er vanuit de AI Act geen specifieke verplichtingen, maar controleer wel of andere wetgeving (AVG, sectorspecifiek) van toepassing is.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Zet je chatbots of andere AI-interfaces in</strong> richting klanten of medewerkers? Zorg dan voor duidelijke communicatie dat de gebruiker met een AI-systeem interageert (transparantieplicht, verplicht per 2 augustus 2026).
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Gebruik of ontwikkel je hoog-risico AI</strong> (bijv. voor cv-selectie, kredietbeoordeling of kritieke operationele beslissingen)? Start dan tijdig met de vereiste risicoanalyse, documentatie en governance. Dit vergt doorgaans meerdere maanden voorbereiding.
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Bouw je AI-producten voor de markt</strong>? Dan ben je aanbieder en gelden de zwaarste verplichtingen. Zorg voor technische documentatie, een conformiteitsbeoordeling en registratie in de EU-database vóór marktintroductie.
                    </span>
                  </li>
                </ul>
              </div>

              {/* 8. Toezicht */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  8. Wie houdt toezicht?
                </h2>
                <p className="leading-relaxed text-[#575760]">
                  Elke EU-lidstaat wijst een of meerdere nationale toezichthouders aan. In Nederland is dit naar
                  verwachting de Autoriteit Persoonsgegevens (AP) in combinatie met sectorspecifieke toezichthouders.
                  Op Europees niveau speelt het{" "}
                  <strong className="text-[#1f1f1f]">AI Office</strong> bij de Europese Commissie een centrale rol,
                  met name voor het toezicht op GPAI-modellen. Het AI Office is per 21 mei 2024 operationeel.
                </p>
              </div>

              {/* 9. Meer informatie */}
              <div className="border-t border-black/[0.06] pt-10">
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  Meer informatie
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  De officiële tekst van de verordening en aanvullende documenten zijn beschikbaar via:
                </p>
                <ul className="space-y-2 leading-relaxed text-[#575760]">
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <a
                        href="https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:32024R1689"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors"
                      >
                        EUR-Lex: Verordening (EU) 2024/1689 (volledige tekst)
                      </a>
                    </span>
                  </li>
                  <li className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                    <span className="text-[#b2b2be] leading-relaxed">—</span>
                    <span>
                      <a
                        href="https://digital-strategy.ec.europa.eu/nl/policies/regulatory-framework-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors"
                      >
                        Europese Commissie: AI-regelgevingskader
                      </a>
                    </span>
                  </li>
                </ul>
                <p className="mt-6 leading-relaxed text-[#575760]">
                  Wat betekent dit concreet voor jouw situatie? Stuur een mail naar{" "}
                  <a
                    href="mailto:info@maisonblender.com"
                    className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors"
                  >
                    info@maisonblender.com
                  </a>
                  {" "}of{" "}
                  <Link
                    href="/strategiegesprek"
                    className="text-[#1f1f1f] underline underline-offset-2 transition-colors hover:text-[#575760]"
                  >
                    plan een kort gesprek
                  </Link>
                  {" "}— we leggen je uit wat er voor jouw gebruik van AI geldt.
                </p>
                <p className="mt-4 text-xs leading-relaxed text-[#b2b2be]">
                  Deze pagina is informatief en geen juridisch advies. Voor vragen over naleving in je specifieke
                  situatie raden we aan een juridisch adviseur te raadplegen.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
