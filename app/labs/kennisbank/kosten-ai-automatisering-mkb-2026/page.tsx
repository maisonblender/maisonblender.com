import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wat kost AI automatisering voor een MKB-bedrijf in 2026? - Limburg AI Labs",
  description:
    "Realistische kosten, terugverdientijd en total cost of ownership voor AI-automatisering in het MKB. Op basis van Limburgse praktijkdata.",
  alternates: { canonical: "https://labs.maisonblender.com/kennisbank/kosten-ai-automatisering-mkb-2026" },
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
            <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">Achtergrond</span>
            <span className="text-xs text-white/40">6 min lezen</span>
          </div>
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[42px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            Wat kost AI automatisering
            <br />
            <span className="font-exposure">voor een MKB-bedrijf in 2026?</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-2xl">
            De meeste prijzen die je online tegenkomt zijn misleidend. Dit zijn de werkelijke kosten -
            tool, implementatie, training en terugverdientijd - op basis van Limburgse praktijkdata.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              &ldquo;AI is goedkoop&rdquo; is een halve waarheid. De tools zelf zijn inderdaad betaalbaar: twintig euro per
              maand voor ChatGPT, tachtig euro voor een document-verwerkingstool. Maar de volledige rekening
              bestaat uit meer dan de abonnementskosten. Wie dat vergeet, loopt later tegen onaangename verrassingen
              aan.
            </p>

            <p>
              Op basis van twaalf AI-trajecten die we het afgelopen jaar hebben begeleid bij Limburgse MKB-bedrijven,
              geven we hier een eerlijk beeld van wat AI-automatisering werkelijk kost - en wat het oplevert.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              De drie kostenposten
            </h2>

            <p>
              AI-automatisering kent drie kostenlagen die je allemaal mee moet rekenen: toolkosten,
              implementatiekosten en trainingskosten. De meeste begrotingen bevatten alleen de eerste.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f]">1. Toolkosten (maandelijks terugkerend)</h3>

            <p>
              Dit zijn de abonnementskosten voor de AI-tools zelf. Hier een overzicht van de meest gebruikte
              tools in het Limburgse MKB:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">Abonnementskosten AI-tools voor MKB</caption>
                <thead>
                  <tr className="bg-[#f2f3f5]">
                    <th scope="col" className="border border-black/[0.08] p-3 text-left font-semibold text-[#1f1f1f]">
                      Tool / categorie
                    </th>
                    <th scope="col" className="border border-black/[0.08] p-3 text-left font-semibold text-[#1f1f1f]">
                      Waarvoor
                    </th>
                    <th scope="col" className="border border-black/[0.08] p-3 text-left font-semibold text-[#1f1f1f]">
                      Prijs/maand
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ChatGPT Plus / Claude Pro", "Tekst, communicatie, analyse", "18 - 20 euro"],
                    ["Dext / Hubdoc", "Factuurverwerking", "40 - 80 euro"],
                    ["Zapier (Starter)", "Procesautomatisering", "20 - 50 euro"],
                    ["Microsoft Copilot (M365)", "Office-integratie", "28 euro per gebruiker"],
                    ["Notion AI", "Documentbeheer en notities", "10 euro per gebruiker"],
                    ["Make (Integromat)", "Geavanceerde workflows", "9 - 29 euro"],
                  ].map(([tool, use, price], i) => (
                    <tr key={tool} className={i % 2 === 1 ? "bg-[#f2f3f5]/50" : ""}>
                      <th scope="row" className="border border-black/[0.08] p-3 text-left font-medium text-[#1f1f1f]">
                        {tool}
                      </th>
                      <td className="p-3 border border-black/[0.08] text-[#575760]">{use}</td>
                      <td className="p-3 border border-black/[0.08] text-[#575760]">{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Een typisch MKB-traject werkt met twee tot drie tools tegelijk. De maandelijkse toolkosten
              liggen daarmee tussen de 80 en 200 euro voor een bedrijf met 5 tot 25 medewerkers.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f] pt-2">2. Implementatiekosten (eenmalig)</h3>

            <p>
              Dit is de post die het meest wordt onderschat. Implementatie omvat: het kiezen van de juiste
              tools, het inrichten van de workflows, het testen, het koppelen aan bestaande systemen en het
              documenteren van de nieuwe werkmethode.
            </p>

            <p>
              Als je dit zelf doet: reken op 8 tot 20 uur eigen tijd per geautomatiseerd proces. Dat is reeel
              voor een eenvoudige koppeling zoals factuurverwerking. Voor complexere workflows zoals klantopvolging
              of rapportage-automatisering loopt het al snel op naar 30 tot 50 uur.
            </p>

            <p>
              Als je hiervoor een bureau inschakelt (zoals MAISON BLNDR): de kosten lopen uiteen van
              1.500 tot 6.000 euro voor een volledig ingericht, getest en gedocumenteerd traject. Het voordeel
              is dat de inrichting sneller gaat, valkuilen worden vermeden en je een overdraagbaar systeem
              krijgt dat ook werkt als de persoon die het opzette ziek is of vertrekt.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f] pt-2">3. Trainingskosten (eenmalig + doorlopend)</h3>

            <p>
              De meest onderschatte kostenpost. Een tool die niemand gebruikt, levert niets op. Reken op
              minimaal twee tot vier uur onboardingtraining per medewerker die met de nieuwe tools gaat werken.
              Daarna: een maand van extra vragen, experimenteren en bijsturen.
            </p>

            <p>
              Voor een team van vijf medewerkers is dat al snel 10 tot 20 uur die door iemand moet worden
              begeleid. Intern of extern - het kost altijd tijd en dus geld.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Rekenvoorbeeld: factuurverwerking bij een administratiekantoor
            </h2>

            <div className="bg-[#f2f3f5] border border-black/[0.06] p-6 space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-4">Situatie: 10 medewerkers, circa 300 facturen per maand</p>
              {[
                ["Toolkosten (Dext + Zapier)", "100 euro/maand"],
                ["Implementatie (eigen tijd, 12 uur)", "480 euro eenmalig (intern uurtarief 40 euro)"],
                ["Training (3 medewerkers x 3 uur)", "360 euro eenmalig"],
                ["Totale eerste jaarskosten", "2.040 euro"],
                ["Tijdsbesparing (8 uur/week x 40 euro x 52)", "16.640 euro per jaar"],
                ["Netto besparing jaar 1", "14.600 euro"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm border-b border-black/[0.05] pb-2 last:border-0 last:pb-0 last:font-semibold last:text-[#1f1f1f]">
                  <span className="text-[#575760]">{label}</span>
                  <span className="font-medium text-[#1f1f1f]">{value}</span>
                </div>
              ))}
            </div>

            <p>
              Dit is geen theoretisch model. Het is gebaseerd op het werkelijke traject van het kantoor
              accountantskantoor in Sittard, waarover we eerder schreven.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wanneer is de terugverdientijd realistisch kort?
            </h2>

            <p>
              AI-automatisering verdient zichzelf snel terug als aan drie voorwaarden is voldaan:
            </p>

            <ul className="space-y-3 pl-4">
              {[
                "Het te automatiseren proces is repetitief en regelmatig. Eenmalige of zeldzame taken zijn de moeite niet waard.",
                "De tijdswinst is significant genoeg om te meten. Minder dan twee uur per week is moeilijk terug te verdienen op implementatiekosten.",
                "De medewerkers die ermee werken omarmen de tool. Weerstand vertraagt adoptie en verlengt de terugverdientijd.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Hoe begin je zonder te overinvesteren?
            </h2>

            <p>
              Begin met een gratis of goedkope tool op een laag-risico proces. Factuurverwerking, e-mailsortering,
              vergaderingen samenvatten - dat zijn de klassieke instapprocessen. Zet er geen grote implementatie
              op, maar probeer het zelf twee weken lang. Meet dan hoeveel tijd je hebt bespaard.
            </p>

            <p>
              Pas als je ziet dat het werkt, is het zinvol om te investeren in een grotere, beter ingerichte
              oplossing. De meeste bedrijven die wij begeleiden, beginnen met minder dan 50 euro per maand en
              breiden daarna gecontroleerd uit op basis van bewezen resultaten.
            </p>

            <p>
              Wat je niet moet doen: een uitgebreide automatisering bouwen voordat je weet of de basisprocessen
              werken. Dan betaal je voor complexiteit die je nog niet nodig hebt.
            </p>

          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1f1f1f] text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#22c55e] mb-4">Concrete analyse</p>
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight mb-4 sm:text-[28px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            Wat levert AI op
            <br />
            <span className="font-exposure">voor jouw specifieke bedrijf?</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-8 max-w-xl">
            De AI Impact Scan van MAISON BLNDR geeft je binnen 10 minuten een beeld van welke processen in
            jouw bedrijf in aanmerking komen voor automatisering en wat de realistische besparing is.
            Gratis. Zonder verkoopgesprek.
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
