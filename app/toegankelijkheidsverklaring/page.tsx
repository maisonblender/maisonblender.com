import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Toegankelijkheidsverklaring | MAISON BLNDR",
  description:
    "Toegankelijkheidsverklaring voor maisonblender.com conform WCAG 2.1 niveau AA en EN 301 549 v3.2.1, inclusief contact- en klachtenprocedure.",
  alternates: { canonical: "https://maisonblender.com/toegankelijkheidsverklaring" },
  openGraph: {
    title: "Toegankelijkheidsverklaring | MAISON BLNDR",
    description: "Status, scope en procedure voor digitale toegankelijkheid van maisonblender.com.",
    url: "https://maisonblender.com/toegankelijkheidsverklaring",
  },
  robots: { index: true, follow: true },
};

const EVALUATION_DATE = "23 april 2026";

export default function ToegankelijkheidsverklaringPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        <section className="bg-white px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#b2b2be]">
              Juridisch
            </p>
            <h1
              className="mb-4 text-[28px] font-normal leading-[1.15] tracking-tight text-[#1f1f1f] sm:text-[36px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Toegankelijkheidsverklaring
            </h1>
            <p className="mb-12 text-sm text-[#b2b2be]">
              Laatst bijgewerkt: {EVALUATION_DATE}
            </p>

            <div className="prose-custom space-y-10 text-[#1f1f1f]">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">1. Status</h2>
              <p className="leading-relaxed text-[#575760]">
                MAISON BLNDR streeft ernaar dat de website{" "}
                <Link href="/" className="text-[#1f1f1f] underline underline-offset-2 hover:no-underline">
                  maisonblender.com
                </Link>{" "}
                (inclusief subpaden zoals <span lang="en">/labs</span> en <span lang="en">/quickscan</span>) voldoet aan{" "}
                <strong className="text-[#1f1f1f]">WCAG 2.1 niveau AA</strong>, geharmoniseerd via{" "}
                <strong className="text-[#1f1f1f]">EN 301 549 versie 3.2.1</strong> voor webcontent en mobiele applicaties.
                Na de laatste herziening van de codebase en een gecombineerde controle (handmatige review en
                geautomatiseerde tests) wordt de site als <strong className="text-[#1f1f1f]">volledig conform</strong>{" "}
                aan deze normen beschouwd, met uitzondering van onderstaande bekende beperkingen van derde partijen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">2. Reikwijdte</h2>
              <p className="leading-relaxed text-[#575760]">
                Deze verklaring geldt voor alle door MAISON BLNDR gepubliceerde webpagina&apos;s op het domein{" "}
                <strong className="text-[#1f1f1f]">maisonblender.com</strong>, waaronder de marketingpagina&apos;s, het
                quickscantraject, de toegankelijkheidsaudit-tool, en het <span lang="en">Limburg AI Labs</span>-gedeelte
                onder <span lang="en">/labs</span>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">3. Toepasselijke standaard</h2>
              <ul className="list-inside list-disc space-y-2 leading-relaxed text-[#575760]">
                <li>
                  <span lang="en">W3C Web Content Accessibility Guidelines (WCAG) 2.1</span>, conformeiseniveau AA.
                </li>
                <li>
                  Europese norm <span lang="en">EN 301 549 V3.2.1 (2021-03)</span>, Hoofdstuk 9 (web) en relevante
                  algemene eisen.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">4. Evaluatiemethode en datum</h2>
              <p className="leading-relaxed text-[#575760]">
                Laatste evaluatie: <strong className="text-[#1f1f1f]">{EVALUATION_DATE}</strong>. Methode: structurele
                code-review op toetsenbordnavigatie, focusmanagement, formulieren, semantiek, contrast en tabellen;
                aangevuld met geautomatiseerde checks (o.a. regels vergelijkbaar met axe-core en Lighthouse-toegankelijkheid)
                op representatieve pagina&apos;s: homepage, <span lang="en">/quickscan/scan</span>,{" "}
                <span lang="en">/toegankelijkheidsaudit</span>, <span lang="en">/strategiegesprek</span>,{" "}
                <span lang="en">/labs/tools-vergelijker</span>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">5. Bekende uitzonderingen (derde partijen)</h2>
              <p className="leading-relaxed text-[#575760]">
                De volledige toegankelijkheid van inhoud die buiten onze controle wordt aangeleverd of getoond in
                externe widgets, valt onder de verantwoordelijkheid van die derde partij:
              </p>
              <ul className="list-inside list-disc space-y-2 leading-relaxed text-[#575760]">
                <li>
                  <strong className="text-[#1f1f1f]">Google Analytics</strong> en cookie-/consentlogica: wij bieden een
                  toegankelijk voorkeurenpaneel; het script zelf wordt door Google beheerd.
                </li>
                <li>
                  <strong className="text-[#1f1f1f]">Google Agenda / booking</strong>: links naar externe agendadiensten
                  kunnen andere toegankelijkheidseisen hebben dan onze eigen pagina&apos;s.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">6. Feedback en contact</h2>
              <p className="leading-relaxed text-[#575760]">
                Loopt u tegen een toegankelijkheidsprobleem aan of mist u een voorziening? Laat het ons weten. Wij
                reageren binnen <strong className="text-[#1f1f1f]">6 weken</strong> op uw melding.
              </p>
              <address className="not-italic leading-relaxed text-[#575760]">
                <strong className="text-[#1f1f1f]">MAISON BLNDR</strong>
                <br />
                Burgemeester Coonenplein 37
                <br />
                6141 BZ Sittard, Nederland
                <br />
                E-mail:{" "}
                <a href="mailto:info@maisonblender.com" className="text-[#1f1f1f] underline underline-offset-2">
                  info@maisonblender.com
                </a>
                <br />
                Telefoon:{" "}
                <a href="tel:+31462004035" className="text-[#1f1f1f] underline underline-offset-2">
                  +31 (0)46 200 4035
                </a>
              </address>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">7. Klachtenprocedure</h2>
              <p className="leading-relaxed text-[#575760]">
                Bent u niet tevreden over de afhandeling van uw melding? Dan kunt u contact opnemen met het{" "}
                <a
                  href="https://www.mensenrechten.nl"
                  className="text-[#1f1f1f] underline underline-offset-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  College voor de Rechten van de Mens
                </a>{" "}
                (voor particulieren en bedrijven) of, indien van toepassing, met de{" "}
                <a
                  href="https://www.autoriteitpersoonsgegevens.nl"
                  className="text-[#1f1f1f] underline underline-offset-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Autoriteit Persoonsgegevens
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-widest text-[#575760]">8. Handhaving</h2>
              <p className="leading-relaxed text-[#575760]">
                Voor overheidsinstanties geldt het Tijdelijk besluit digitale toegankelijkheid overheid. MAISON BLNDR is
                een private dienstverlener; wij hanteren desalniettemin WCAG 2.1 AA en EN 301 549 als kwaliteitsnorm.
                Meer informatie over wet- en regelgeving:{" "}
                <a
                  href="https://www.toegankelijkheidsverklaring.nl"
                  className="text-[#1f1f1f] underline underline-offset-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  toegankelijkheidsverklaring.nl
                </a>
                .
              </p>
            </section>

            <section className="space-y-3 border-t border-black/[0.08] pt-8">
              <p className="text-sm text-[#575760]">
                Ondertekening: namens MAISON BLNDR — verantwoordelijk voor deze verklaring:{" "}
                <strong className="text-[#1f1f1f]">Karl</strong>, {EVALUATION_DATE}.
              </p>
            </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
