import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI in een Maastrichtse zorginstelling: wat werkt en wat (nog) niet? - Limburg AI Labs",
  description:
    "Een eerlijk verslag van een AI-pilot in een Maastrichtse zorginstelling. Successen, AVG-uitdagingen en de lessen die anderen kunnen gebruiken.",
  alternates: { canonical: "https://labs.maisonblender.com/kennisbank/ai-maastrichtse-zorginstelling" },
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
            <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">Case study</span>
            <span className="text-xs text-white/40">7 min lezen</span>
          </div>
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[42px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            AI in een Maastrichtse zorginstelling:
            <br />
            <span className="font-exposure">wat werkt en wat (nog) niet?</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-2xl">
            Een eerlijk verslag van een AI-pilot bij een kleinschalige zorginstelling in Maastricht.
            De successen zijn echt. De uitdagingen ook.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              Zorg en AI zijn een gevoelige combinatie. Persoonsgegevens, patientprivacy, AVG-verplichtingen,
              toezicht - de drempels zijn hoger dan in andere sectoren. En toch: de werkdruk in de zorg is
              ook hoger dan in andere sectoren. Dat maakt AI-automatisering hier tegelijk urgenter en risicovoller.
            </p>

            <p>
              Zorginstelling Heijmans Thuiszorg in Maastricht besloot vorig jaar een gecontroleerde pilot te starten.
              Niet met experimentele technologie, maar met bestaande tools ingezet op een duidelijk afgebakend
              administratief proces. Dit is wat ze deden, wat werkte, wat niet werkte en wat ze anderen aanraden.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              De aanleiding
            </h2>

            <p>
              Heijmans Thuiszorg biedt thuiszorg aan zo&#39;n 340 clienten in de regio Maastricht-Heuvelland.
              Het administratieve team van vijf medewerkers verwerkt dagelijks intakeformulieren, zorgplannen,
              rapportages en correspondentie met clienten, families en huisartsen.
            </p>

            <p>
              Het grootste tijdverlies zat in de intakeprocedure. Een nieuwe client betekent gemiddeld
              drie uur administratie: het verwerken van het intakeformulier, het opstellen van het eerste
              concept-zorgplan en de correspondentie naar de huisarts. Met gemiddeld 8 nieuwe clienten per
              maand liep dat op tot 24 uur per maand alleen aan intake-administratie.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat ze probeerden: AI-ondersteunde intake
            </h2>

            <p>
              De pilot richtte zich op twee concrete stappen binnen de intake:
            </p>

            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-[#22c55e] font-bold mt-0.5">1.</span>
                <span>
                  <strong className="text-[#1f1f1f]">Automatisch samenvatten van intakeformulieren.</strong> De
                  ingevulde formulieren worden geuploaded naar een beveiligde AI-omgeving. Het systeem genereert
                  een gestructureerde samenvatting die de zorgmedewerker als startpunt gebruikt.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#22c55e] font-bold mt-0.5">2.</span>
                <span>
                  <strong className="text-[#1f1f1f]">Concept-zorgplan genereren.</strong> Op basis van de
                  samenvatting en een set interne templates genereert het systeem een concept-zorgplan dat de
                  medewerker vervolgens aanvult en goedkeurt.
                </span>
              </li>
            </ul>

            <p>
              Belangrijk: er was geen sprake van volledig geautomatiseerde besluitvorming. Elke output van het
              systeem werd gereviewd en goedgekeurd door een bevoegde zorgmedewerker voor het naar de client
              ging.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat goed werkte
            </h2>

            <p>
              De tijdsbesparing was substantieel. De gemiddelde tijd per intake daalde van drie uur naar iets
              minder dan een uur. Het samenvatten van het formulier kostte het systeem minder dan een minuut.
              Het concept-zorgplan had nog 20 tot 30 minuten review en aanpassing nodig, maar de medewerker
              begon nu vanuit een bruikbaar startpunt in plaats van een lege pagina.
            </p>

            <p>
              Een bijkomend voordeel: de consistentie verbeterde. Voorheen verschilde de stijl en volledigheid
              van zorgplannen sterk per medewerker. Het AI-gegenereerde concept zorgde voor een vaste structuur
              die iedereen als basis gebruikte.
            </p>

            <p>
              Ook de medewerkers zelf reageerden positiever dan verwacht. "Ik dacht eerst dat het mijn werk
              zou overnemen", zei een van hen. "Maar het neemt juist het saaie deel over. Ik besteed nu meer
              tijd aan het client-contact en minder aan typen."
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat niet werkte: de AVG-uitdaging
            </h2>

            <p>
              De grootste hobbel was niet technisch maar juridisch. Zorgdata valt onder bijzondere persoonsgegevens
              in de AVG. Dat betekent strengere verplichtingen voor verwerking, opslag en doorgifte.
            </p>

            <p>
              De eerste tool die het team wilde gebruiken - een algemene AI-assistent - bleek niet geschikt.
              De aanbieder kon geen verwerkersovereenkomst aanleveren die voldeed aan de eisen voor bijzondere
              persoonsgegevens. Data werd verwerkt op servers buiten de EU. Dat was een harde no.
            </p>

            <p>
              Na drie weken zoeken kozen ze voor een EU-gebaseerde oplossing met een expliciete verwerkersovereenkomst,
              end-to-end versleuteling en de garantie dat data niet wordt gebruikt voor modeltraining. De
              opstartkosten waren daarmee hoger dan gepland, maar het was de enige route die juridisch houdbaar was.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat ook niet direct werkte: toestemming van clienten
            </h2>

            <p>
              De pilot stuitte ook op een praktische vraag: moeten clienten toestemming geven voor het gebruik
              van AI bij de verwerking van hun zorggegevens? Het antwoord was genuanceerd maar neigde naar ja -
              in elk geval als het gaat om het genereren van zorgplannen op basis van hun persoonsgegevens.
            </p>

            <p>
              Heijmans Thuiszorg paste hun intakeformulier aan met een expliciete verklaring over AI-gebruik.
              Twee van de eerste tien clienten gaven aan liever zonder AI te worden geholpen. Dat werd gehonoreerd.
              Het vergde een apart proces, maar dat bleek goed beheerbaar.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              De lessen
            </h2>

            <p>
              Na zes maanden trekt de directie vier concrete conclusies:
            </p>

            <div className="space-y-4">
              {[
                {
                  nr: "1",
                  title: "Begin met administratie, niet met zorgprocessen",
                  text: "De laagste risicos en hoogste tijdwinst zitten in administratieve taken: samenvatten, structureren, correspondentie. Laat zorginhoudelijke beslissingen aan mensen over.",
                },
                {
                  nr: "2",
                  title: "Juridische check eerst, tool later",
                  text: "Vraag een verwerkersovereenkomst op voor je ook maar iets test. In de zorg is dat geen formaliteit. Het bepaalt welke tools uberhaupt in aanmerking komen.",
                },
                {
                  nr: "3",
                  title: "Communiceer transparant naar clienten",
                  text: "Clienten reageren beter op eerlijkheid dan op stilte. Vertel wat je gebruikt, waarom en hoe de data is beschermd. De meeste mensen accepteren het als het goed is uitgelegd.",
                },
                {
                  nr: "4",
                  title: "Betrek medewerkers van het begin af",
                  text: "De zorgen van medewerkers zijn reeel. Adresseer ze direct. Leg uit wat het systeem doet en wat het niet doet. De acceptatie is veel hoger als mensen begrijpen dat het hen helpt, niet vervangt.",
                },
              ].map(({ nr, title, text }) => (
                <div key={nr} className="bg-[#f2f3f5] border border-black/[0.06] p-5">
                  <h3 className="text-[14px] font-semibold text-[#1f1f1f] mb-2">{nr}. {title}</h3>
                  <p className="text-sm text-[#575760] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat volgt
            </h2>

            <p>
              Heijmans Thuiszorg is nu bezig met de tweede fase van de pilot: het automatisch samenvatten van
              voortgangsrapportages. Dat zijn de wekelijkse notities die zorgmedewerkers schrijven over de
              toestand van een client. Doel is om de maandelijkse evaluatiegesprekken beter voor te bereiden
              met een automatisch gegenereerd overzicht van de afgelopen vier weken.
            </p>

            <p>
              De verwachting is voorzichtig positief - maar eerst komt een juridische toets van het nieuwe
              proces. Die les hebben ze inmiddels goed geleerd.
            </p>

          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1f1f1f] text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#22c55e] mb-4">Werkt u in de zorg?</p>
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight mb-4 sm:text-[28px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            AI in uw organisatie invoeren
            <br />
            <span className="font-exposure">zonder de juridische valkuilen.</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-8 max-w-xl">
            Bij MAISON BLNDR helpen we zorginstellingen in Limburg met een AVG-proof aanpak voor AI-implementatie.
            We beginnen altijd met de juridische basis, dan de techniek. Niet andersom.
          </p>
          <a
            href="https://maisonblender.com/contact"
            className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a]"
          >
            Plan een vrijblijvend gesprek →
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
