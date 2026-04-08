import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AVG en AI: wat mag je automatiseren en wat niet? - Limburg AI Labs",
  description:
    "Wat zegt de AVG over AI-gebruik in het MKB? Praktische gids over persoonsgegevens, dataverwerking en wat je wel en niet mag automatiseren.",
  alternates: { canonical: "https://labs.maisonblender.com/kennisbank/avg-en-ai-automatiseren" },
};

export default function ArticlePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1f1f1f] px-6 py-24 text-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">Gids</span>
            <span className="text-xs text-white/40">9 min lezen</span>
          </div>
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[42px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            AVG en AI: wat mag je
            <br />
            <span className="font-exposure">automatiseren en wat niet?</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-2xl">
            De privacywetgeving stopt niet bij je eigen systemen. Ze geldt ook voor AI-tools. Dit zijn de
            vragen die Limburgse ondernemers ons het meest stellen - en de antwoorden zonder juridisch jargon.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              AI-tools verwerken tekst. Tekst bevat regelmatig namen, adressen, telefoonnummers en soms
              medische of financiele gegevens. Zodra dat het geval is, geldt de Algemene Verordening
              Gegevensbescherming - de AVG. Dat is niet iets om omheen te werken. Het is iets om goed
              in te richten.
            </p>

            <p>
              Gelukkig hoeft AVG-compliance geen obstakel te zijn voor AI-gebruik. Het vereist wel dat je
              nadenkt over wat je doet met welke data, voordat je begint. Dit artikel helpt je daarmee.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat zijn persoonsgegevens? (ruimer dan je denkt)
            </h2>

            <p>
              Een persoonsgegeven is elke informatie die direct of indirect herleidbaar is tot een levend
              persoon. Dat zijn niet alleen namen en BSN-nummers. Het zijn ook:
            </p>

            <ul className="space-y-2 pl-4">
              {[
                "E-mailadressen (ook zakelijke: jan@bedrijf.nl herleid naar Jan van Bedrijf)",
                "IP-adressen",
                "Kentekens",
                "Foto's waarop iemand herkenbaar is",
                "Combinaties van gegevens die samen iemand identificeerbaar maken",
                "Klantnummers als die aan een persoon zijn gekoppeld",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p>
              Zodra je een van deze categorieën in een AI-tool invoert, verwerk je persoonsgegevens. Dan
              gelden de regels.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat zijn bijzondere persoonsgegevens?
            </h2>

            <p>
              Voor een aantal categorieen gelden extra strenge regels. Dit zijn de zogenaamde bijzondere
              persoonsgegevens:
            </p>

            <ul className="space-y-2 pl-4">
              {[
                "Gezondheidsgegevens en medische informatie",
                "Ras en etnische achtergrond",
                "Politieke opvattingen",
                "Religieuze of levensbeschouwelijke overtuigingen",
                "Vakbondslidmaatschap",
                "Genetische en biometrische gegevens",
                "Seksuele gerichtheid",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-red-400 font-bold mt-0.5">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p>
              Verwerk je dit soort gegevens in een AI-tool? Dan heb je in principe een expliciete wettelijke
              grondslag nodig en is een verwerkersovereenkomst met de tool-aanbieder verplicht. In de
              meeste gevallen is ook een Data Protection Impact Assessment (DPIA) vereist.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Drie categorieen: veilig, grijs gebied, niet toegestaan
            </h2>

            <h3 className="text-[16px] font-semibold text-[#22c55e]">Veilig</h3>
            <p>
              AI-tools gebruiken voor taken waarbij geen persoonsgegevens worden ingevoerd. Denk aan:
              een tekst schrijven op basis van een algemene briefing, een marketingtekst laten controleren,
              een brainstorm over productontwikkeling, een vergadering samenvatten zonder namen of identificeerbare
              informatie te noemen.
            </p>

            <h3 className="text-[16px] font-semibold text-[#f59e0b]">Grijs gebied</h3>
            <p>
              AI-tools gebruiken waarbij persoonsgegevens passeren, maar de verwerking beperkt en goed
              gedocumenteerd is. Voorbeelden: een klantmail samenvatten (naam en e-mailadres zichtbaar),
              factuurverwerking (naam leverancier, soms naam contactpersoon).
            </p>
            <p>
              Dit is toegestaan als: je een verwerkersovereenkomst hebt met de aanbieder, de data wordt
              verwerkt op EU-servers (of er is een afdoende overdrachtsgrond), de aanbieder geen data
              gebruikt voor modeltraining zonder toestemming en je het hebt opgenomen in je verwerkingsregister.
            </p>

            <h3 className="text-[16px] font-semibold text-[#ef4444]">Niet toegestaan (of zware vereisten)</h3>
            <p>
              Bijzondere persoonsgegevens verwerken via een standaard cloud-AI zonder aanvullende maatregelen.
              Dit geldt ook voor: het profilieren van klanten op basis van gezondheidsinformatie, volledig
              geautomatiseerde besluitvorming over personen zonder menselijk toezicht en het opslaan van
              persoonsgegevens langer dan noodzakelijk in een AI-omgeving.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              De drie dingen die je moet regelen
            </h2>

            <div className="space-y-4">
              {[
                {
                  nr: "1",
                  title: "Verwerkersovereenkomst",
                  text: "Als je een AI-tool gebruikt die persoonsgegevens verwerkt namens jouw bedrijf, dan is die toolaanbieder een 'verwerker' in AVG-termen. Je bent verplicht een verwerkersovereenkomst af te sluiten. Vraag dit actief op bij de aanbieder. Als ze die niet kunnen leveren, is dat een signaal om verder te kijken.",
                },
                {
                  nr: "2",
                  title: "Verwerkingsregister",
                  text: "Elk bedrijf met meer dan 250 medewerkers is verplicht een verwerkingsregister bij te houden. Kleine bedrijven zijn hier formeel van vrijgesteld, maar het is alsnog verstandig. Als de Autoriteit Persoonsgegevens langskomt, laat je daarmee zien dat je gestructureerd nadenkt over je datagebruik.",
                },
                {
                  nr: "3",
                  title: "Dataminimalisatie",
                  text: "Voer nooit meer persoonsgegevens in een AI-tool dan strikt noodzakelijk voor de taak. Als je een brief wil laten herschrijven, verwijder dan de naam en het adres eerst. Als je een vergadering wil samenvatten, gebruik dan initialen in plaats van volledige namen. Dit beperkt je risico drastisch.",
                },
              ].map(({ nr, title, text }) => (
                <div key={nr} className="bg-[#f2f3f5] border border-black/[0.06] p-5">
                  <h3 className="text-[14px] font-semibold text-[#1f1f1f] mb-2">{nr}. {title}</h3>
                  <p className="text-sm text-[#575760] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wanneer moet je een FG (functionaris gegevensbescherming) raadplegen?
            </h2>

            <p>
              Niet elk bedrijf is verplicht een Functionaris voor Gegevensbescherming (FG) aan te stellen.
              Maar er zijn situaties waarbij je er verstandig aan doet er een in te schakelen, ook als je
              er geen moet hebben:
            </p>

            <ul className="space-y-2 pl-4">
              {[
                "Je verwerkt op grote schaal bijzondere persoonsgegevens (zorg, HR, financiele dienstverlening)",
                "Je wil geautomatiseerde besluitvorming inzetten (denk aan kredietbeoordeling, sollicitatiescreening)",
                "Je twijfelt of een specifiek AI-gebruik een DPIA vereist",
                "Je ontvangt een verzoek van de Autoriteit Persoonsgegevens",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Praktische checklist voor MKB
            </h2>

            <div className="bg-[#f2f3f5] border border-black/[0.06] p-6 space-y-3">
              {[
                "Verwerkt de AI-tool die ik wil gebruiken persoonsgegevens? Zo ja: welke?",
                "Heeft de aanbieder een verwerkersovereenkomst die ik kan ondertekenen?",
                "Worden de gegevens verwerkt op EU-servers?",
                "Gebruikt de aanbieder mijn data voor modeltraining? Zo ja: kan ik dat uitzetten?",
                "Heb ik het gebruik van deze tool opgenomen in mijn verwerkingsregister?",
                "Heb ik de minimale hoeveelheid persoonsgegevens ingevoerd die noodzakelijk is?",
                "Zijn de betrokkenen (klanten, medewerkers) op de hoogte van het AI-gebruik?",
              ].map((item, i) => (
                <div key={item} className="flex gap-3 items-start text-sm">
                  <div className="w-5 h-5 border border-[#22c55e]/40 bg-white flex-shrink-0 mt-0.5" />
                  <span className="text-[#575760]">{item}</span>
                </div>
              ))}
            </div>

            <p>
              Als je alle vragen met "ja" of "opgelost" kunt beantwoorden, zit je goed. Zit er een twijfelgeval
              tussen? Dan is een uur met een privacy-adviseur goedkoper dan de boetes die de AP kan opleggen.
            </p>

            <p>
              Boetes voor AVG-overtredingen voor MKB-bedrijven lopen in de praktijk op tot tienduizenden euros.
              Dat is zelden de inzet als je aantoonbaar goede bedoelingen hebt en actief maatregelen treft -
              maar een goed gedocumenteerde aanpak is altijd je beste bescherming.
            </p>

          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1f1f1f] text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#22c55e] mb-4">AVG-proof starten</p>
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight mb-4 sm:text-[28px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            AI implementeren zonder
            <br />
            <span className="font-exposure">privacy-risico&#39;s voor jouw bedrijf.</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-8 max-w-xl">
            Bij MAISON BLNDR bouwen we AI-workflows die van het begin af aan AVG-compliant zijn. Geen nawerk,
            geen verassingen. Plan een gratis kennismakingsgesprek of doe de AI Impact Scan om te zien waar
            de kansen liggen.
          </p>
          <a
            href="https://maisonblender.com/impact-scan"
            className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a]"
          >
            Doe de gratis AI Impact Scan →
          </a>
        </div>
      </section>

      {/* Back link */}
      <section className="px-6 py-10 bg-[#f2f3f5]">
        <div className="mx-auto max-w-3xl">
          <Link href="/labs/kennisbank" className="text-sm text-[#575760] hover:text-[#1f1f1f] transition-colors">
            ← Terug naar de kennisbank
          </Link>
        </div>
      </section>
    </>
  );
}
