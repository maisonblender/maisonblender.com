import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wat kost AI automatisering voor een MKB-bedrijf in 2026? - Limburg AI Labs",
  description:
    "Realistische kosten, terugverdientijd en total cost of ownership voor AI-automatisering in het MKB. Op basis van Limburgse praktijkdata.",
  alternates: { canonical: "https://maisonblender.com/labs/kennisbank/kosten-ai-automatisering-mkb-2026" },
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
            Online prijzen laten vaak de helft zien. Hier: tool, implementatie, training en terugverdientijd, op
            basis van Limburgse praktijkdata.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              &ldquo;AI is goedkoop&rdquo; klopt deels. ChatGPT kost twintig euro per maand, een documenttool
              tachtig. Maar de volledige rekening is groter dan abonnementen alleen. Dat vergeten veel
              begrotingen.
            </p>

            <p>
              Op basis van twaalf AI-trajecten die we het afgelopen jaar begeleidden bij Limburgse MKB-bedrijven:
              wat het werkelijk kost en wat het oplevert.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Waar de kosten zitten
            </h2>

            <p>
              Drie lagen: toolkosten, implementatie en training. Veel begrotingen tellen alleen de eerste mee.
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
              De post die het meest wordt onderschat. Kiezen, inrichten, testen, koppelen aan bestaande systemen,
              documenteren.
            </p>

            <p>
              Zelf doen: 8 tot 20 uur eigen tijd per geautomatiseerd proces voor iets eenvoudigs als
              factuurverwerking. Complexere workflows (klantopvolging, rapportage): 30 tot 50 uur.
            </p>

            <p>
              Bureau inschakelen (zoals MAISON BLNDR): 1.500 tot 6.000 euro voor een volledig ingericht traject.
              Sneller, minder valkuilen, overdraagbaar als degene die het opzette vertrekt.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f] pt-2">3. Trainingskosten (eenmalig + doorlopend)</h3>

            <p>
              Een tool die niemand gebruikt, levert niets op. Reken op twee tot vier uur onboarding per
              medewerker, plus een maand extra vragen en bijsturen.
            </p>

            <p>
              Vijf medewerkers: al snel 10 tot 20 uur begeleiding. Intern of extern, het kost tijd en dus geld.
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
              Geen spreadsheet-model. Gebaseerd op het Sittardse accountantskantoor waarover we eerder schreven.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wanneer verdient het zich snel terug?
            </h2>

            <p>
              Snel terugverdiend als:
            </p>

            <ul className="space-y-3 pl-4">
              {[
                "Het proces is repetitief en regelmatig. Eenmalige taken zijn de moeite niet.",
                "Je wint minstens twee uur per week. Minder is lastig terug te verdienen op implementatiekosten.",
                "Medewerkers gebruiken de tool echt. Weerstand verlengt de terugverdientijd.",
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
              Start met een gratis of goedkope tool op een laag-risico proces. Facturen, e-mailsorteren,
              vergaderingen samenvatten. Probeer het zelf twee weken. Meet hoeveel tijd je bespaart.
            </p>

            <p>
              Werkt het? Dan pas investeren in een betere inrichting. De meeste bedrijven die wij begeleiden
              starten onder 50 euro per maand en breiden uit als het resultaat er is.
            </p>

            <p>
              Bouw geen uitgebreide automatisering voordat je weet of de basis werkt. Dan betaal je voor
              complexiteit die je nog niet nodig hebt.
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
            De AI Impact Scan geeft binnen 10 minuten een beeld van welke processen bij jou in aanmerking komen
            en wat de realistische besparing is. Gratis.
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
