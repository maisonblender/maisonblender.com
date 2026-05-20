import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hoe een Sittardse accountant 8 uur per week bespaart met AI - Limburg AI Labs",
  description:
    "Een accountantskantoor in Sittard automatiseerde factuurverwerking en won 8 uur per week terug. Praktische case met kosten, aanpak en valkuilen.",
  alternates: { canonical: "https://maisonblender.com/labs/kennisbank/sittardse-accountant-8-uur-besparen-ai" },
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
            <span className="text-xs text-white/40">6 min lezen</span>
          </div>
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[42px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            Hoe een Sittardse accountant
            <br />
            <span className="font-exposure">8 uur per week bespaart met AI</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-2xl">
            Factuurverwerking kostte dit kantoor 30 uur per maand. Na twee dagen inrichten: minder dan 2 uur.
            Inclusief de valkuilen die ze onderweg tegenkwamen.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              Inkomende facturen: controleren, coderen, boeken, archiveren. Bij een middelgroot kantoor in Sittard
              kostte dat ruim 30 uur personeelstijd per maand. Per jaar bijna negen werkweken. De directeur besloot
              er iets aan te doen. Hieronder wat hij aantrof, wat werkte en wat misging.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              De situatie voor de automatisering
            </h2>

            <p>
              Het kantoor - een Sittards accountantskantoor - behandelt de boekhouding voor 85 MKB-klanten in de regio.
              De meeste klanten leveren facturen via e-mail aan: soms als PDF, soms als foto van een bon. Een medewerker
              opende die bestanden, voerde de gegevens handmatig in in de boekhoudssoftware en archiveerde de
              originelen in een mappenstructuur.
            </p>

            <p>
              Dat klinkt eenvoudig. In de praktijk is het dat niet. Facturen zijn niet gestandaardiseerd: de ene
              leverancier zet het factuurnummer linksboven, de andere rechtsmidden. BTW-bedragen staan soms in
              meerdere regels gesplitst. En buitenlandse leveranciers houden er soms volledig eigen conventies op na.
            </p>

            <p>
              De medewerker die dit bijhield, besteedde er gemiddeld zes tot acht uur per week aan. Precies de acht
              uur die ze nu terugwinnen.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Welke tools zijn ingezet
            </h2>

            <p>
              Na een orientatiefase van drie weken kozen het kantoor voor een combinatie van twee tools:
            </p>

            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-[#1f1f1f]">Dext</strong> (voorheen Receipt Bank): een cloud-applicatie die
                  facturen en bonnen automatisch uitleest met OCR-technologie. Het systeem herkent leverancier, datum,
                  bedrag en BTW en stuurt de gegevens direct door naar de boekhoudssoftware.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-[#1f1f1f]">Zapier</strong>: een koppelaar die routinehandelingen
                  automatiseert, zoals het archiveren van het originele document en het sturen van een
                  bevestigingsmail naar de klant.
                </span>
              </li>
            </ul>

            <p>
              De koppeling met hun bestaande boekhoudpakket - in dit geval Exact Online - was binnen twee dagen
              operationeel. Er was geen maatwerkcode nodig en geen IT-aannemer.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat goed werkte
            </h2>

            <p>
              Na zes weken was de tijdsbesparing meetbaar. Voor standaardfacturen van bekende leveranciers daalde de
              doorlooptijd van vijf minuten handmatig werk naar minder dan dertig seconden controle. Dext herkent
              inmiddels 94 procent van alle inkomende documenten correct.
            </p>

            <p>
              De medewerker controleert nu in plaats van invoert. Dat voelde ook anders. "Ik doe nu eigenlijk
              kwaliteitscontrole", zei ze. "Dat is een stuk minder eentonig."
            </p>

            <p>
              Klanten merkten het ook. Bonnen worden niet meer per kwartaal maar real-time verwerkt, waardoor het
              kantoor sneller ziet hoe de financiele positie ervoor staat. Bij twee klanten met cashflowproblemen
              leverde dat al beter advies op.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat minder goed werkte
            </h2>

            <p>
              De inrijdperiode kostte tijd. De eerste twee weken moest Dext leren welke leveranciers het kantoor
              regelmatig ontvangt. Een paar facturen werden verkeerd ingelezen en op de verkeerde grootboekrekening
              geboekt. Dat kwam pas boven bij de maandafsluiting.
            </p>

            <p>
              Slechte bonfoto&apos;s blijven een probleem. Tegenlicht, wazige camera: ongeveer zes procent van de
              documenten moet nog handmatig.
            </p>

            <p>
              En het systeem kost geld op volume. Bij een piekmaand viel de factuur hoger uit dan verwacht. Het
              kantoor heeft inmiddels een maandelijks plafond afgesproken. De eerste factuur was een verrassing.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              De kosten op een rij
            </h2>

            <div className="bg-[#f2f3f5] border border-black/[0.06] p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#575760]">Dext (documentvolume dit kantoor)</span>
                <span className="font-medium text-[#1f1f1f]">60 - 80 euro/maand</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#575760]">Zapier (basisautomatiseringen)</span>
                <span className="font-medium text-[#1f1f1f]">20 euro/maand</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#575760]">Eenmalige inrichting (eigen tijd)</span>
                <span className="font-medium text-[#1f1f1f]">circa 4 uur, geen externe kosten</span>
              </div>
              <div className="border-t border-black/[0.08] pt-2 mt-2 flex justify-between text-sm">
                <span className="text-[#575760]">Besparing (8 uur x 40 euro x 4 weken)</span>
                <span className="font-semibold text-[#22c55e]">ca. 1.280 euro/maand</span>
              </div>
            </div>

            <p>
              Terugverdiend na de eerste maand. Sindsdien gaan twee fulltime werkdagen per maand naar advieswerk
              in plaats van gegevens invoeren.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat dit betekent voor jouw bedrijf
            </h2>

            <p>
              Factuurverwerking is repetitief werk. Daardoor is het een logisch eerste proces om te automatiseren.
              De tools zijn betaalbaar en je hebt geen IT-afdeling nodig.
            </p>

            <p>
              Onze les uit dit traject: begin klein. Automatiseer eerst een proces goed, voordat je er een tweede
              naast zet. Acht uur per week is genoeg om te starten. Ook genoeg om collega&apos;s mee te krijgen.
            </p>

            <p>
              Veel Limburgse MKB-bedrijven hebben meer van dit soort werk. Offertes, klantopvolging,
              e-mailsortering: dezelfde aanpak werkt daar ook.
            </p>

          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1f1f1f] text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#22c55e] mb-4">Volgende stap</p>
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight mb-4 sm:text-[28px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            Wil je weten wat er in
            <br />
            <span className="font-exposure">jouw bedrijf te automatiseren valt?</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-8 max-w-xl">
            Bij MAISON BLNDR kijken we mee welke processen bij jouw bedrijf het meest opleveren. Doe de gratis AI
            Impact Scan en ontdek waar jouw acht uur zit.
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
