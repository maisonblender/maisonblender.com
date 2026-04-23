import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacybeleid | MAISON BLNDR",
  description:
    "Het privacybeleid van MAISON BLNDR. Lees hoe wij omgaan met jouw persoonsgegevens conform de AVG/GDPR.",
  alternates: { canonical: "https://maisonblender.com/privacybeleid" },
  openGraph: {
    title: "Privacybeleid | MAISON BLNDR",
    description: "Hoe MAISON BLNDR omgaat met jouw persoonsgegevens.",
    url: "https://maisonblender.com/privacybeleid",
  },
  robots: { index: true, follow: true },
};

const lastUpdated = "8 april 2026";

export default function PrivacybeleidPage() {
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
              Privacybeleid
            </h1>
            <p className="mb-12 text-sm text-[#b2b2be]">
              Laatst bijgewerkt: {lastUpdated}
            </p>

            <div className="prose-custom space-y-10 text-[#1f1f1f]">

              {/* 1. Wie zijn wij */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  1. Wie is de verwerkingsverantwoordelijke
                </h2>
                <p className="leading-relaxed text-[#575760]">
                  MAISON BLNDR is een handelsnaam van Applemooz, gevestigd aan Burg. Coonenplein 37,
                  6141BZ Sittard, Nederland.
                </p>
                <div className="mt-4 border border-black/[0.06] bg-[#f2f3f5] p-5 text-sm leading-relaxed text-[#575760]">
                  <p><strong className="text-[#1f1f1f]">Applemooz (handelsnaam: MAISON BLNDR)</strong></p>
                  <p>Burg. Coonenplein 37, 6141BZ Sittard</p>
                  <p>KvK: 14080126</p>
                  <p>BTW: NL001832932B87</p>
                  <p>
                    E-mail:{" "}
                    <a href="mailto:info@maisonblender.com" className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors">
                      info@maisonblender.com
                    </a>
                  </p>
                  <p>
                    Telefoon:{" "}
                    <a href="tel:+31462004035" className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors">
                      +31 (0)46 200 4035
                    </a>
                  </p>
                </div>
              </div>

              {/* 2. Welke gegevens */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  2. Welke persoonsgegevens verwerken wij
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Wij verwerken persoonsgegevens uitsluitend wanneer jij die actief aan ons verstrekt
                  of wanneer ze automatisch worden gegenereerd tijdens je bezoek aan onze website.
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Contactformulier</h3>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Via het contactformulier op maisonblender.com verzamelen wij: naam, bedrijfsnaam (optioneel),
                  e-mailadres en de inhoud van jouw bericht.
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">AI Impact Scan</h3>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Via de gratis AI Impact Scan verzamelen wij bedrijfsgegevens en antwoorden op vragen
                  over je bedrijfsprocessen. Wij gebruiken deze gegevens uitsluitend om jou een
                  gepersonaliseerde scan te leveren en eventueel op te volgen.
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Strategiegesprek en sessies</h3>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Bij het aanvragen van een strategiegesprek of AI-sessie verwerken wij naam,
                  e-mailadres, bedrijfsnaam en je vraagstelling.
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Nieuwsbrief (Limburg AI Labs)</h3>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Via het nieuwsbriefformulier op maisonblender.com/labs/nieuwsbrief verwerken wij je e-mailadres.
                  Afmelden kan altijd via de afmeldlink onderaan elke nieuwsbrief of per e-mail aan ons.
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Websitebezoek en analytics</h3>
                <p className="leading-relaxed text-[#575760]">
                  Bij elk bezoek aan onze website worden automatisch technische gegevens vastgelegd:
                  IP-adres (geanonimiseerd), browsertype, bezochte pagina&apos;s en tijdstip van bezoek.
                  Wij gebruiken Google Analytics (meetingscode G-27QXGGLZ07) voor websitestatistieken.
                  Zie sectie 6 voor meer informatie over cookies.
                </p>
              </div>

              {/* 3. Doel en rechtsgrondslag */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  3. Doel en rechtsgrondslag van de verwerking
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <caption className="sr-only">Doel en rechtsgrondslag van gegevensverwerking</caption>
                    <thead>
                      <tr className="border-b border-black/[0.08]">
                        <th scope="col" className="py-3 pr-6 text-left text-xs font-semibold uppercase tracking-widest text-[#575760]">
                          Doel
                        </th>
                        <th scope="col" className="py-3 pr-6 text-left text-xs font-semibold uppercase tracking-widest text-[#575760]">
                          Rechtsgrondslag
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.06] text-[#575760]">
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Beantwoorden van contactverzoeken
                        </th>
                        <td className="py-3 leading-relaxed">Gerechtvaardigd belang (art. 6 lid 1 sub f AVG)</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Uitvoering AI Impact Scan en sessies
                        </th>
                        <td className="py-3 leading-relaxed">Uitvoering overeenkomst (art. 6 lid 1 sub b AVG)</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Verzenden van de nieuwsbrief
                        </th>
                        <td className="py-3 leading-relaxed">Toestemming (art. 6 lid 1 sub a AVG)</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Websitestatistieken via Google Analytics
                        </th>
                        <td className="py-3 leading-relaxed">Gerechtvaardigd belang (art. 6 lid 1 sub f AVG)</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3 pr-6 text-left font-normal leading-relaxed">
                          Voldoen aan wettelijke verplichtingen
                        </th>
                        <td className="py-3 leading-relaxed">Wettelijke verplichting (art. 6 lid 1 sub c AVG)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Bewaartermijnen */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  4. Bewaartermijnen
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Wij bewaren jouw persoonsgegevens niet langer dan noodzakelijk voor het doel waarvoor
                  ze zijn verzameld, of zolang de wet dat vereist.
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-[#575760]">
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Contactformulier en projectcommunicatie:</strong> maximaal 2 jaar na het laatste contact, tenzij er een lopende klantrelatie is.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Nieuwsbrief:</strong> tot afmelding.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Fiscale en boekhoudkundige gegevens:</strong> 7 jaar conform de wettelijke bewaarplicht.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Google Analytics-gegevens:</strong> maximaal 14 maanden (geanonimiseerd).</span>
                  </li>
                </ul>
              </div>

              {/* 5. Delen met derden */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  5. Delen met derden
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Wij verkopen jouw gegevens nooit. We delen persoonsgegevens alleen wanneer dat
                  noodzakelijk is voor de dienstverlening of wettelijk verplicht is.
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-[#575760]">
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Brevo (Sendinblue):</strong> verwerker voor e-mailmarketing en nieuwsbrieven. Gegevens worden verwerkt binnen de EU.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Google Analytics:</strong> geanonimiseerde websitestatistieken. Google LLC is gecertificeerd onder het EU-US Data Privacy Framework.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Vercel Inc.:</strong> hostinginfrastructuur. Datacenters in de EU/VS. Vercel voldoet aan het EU-US Data Privacy Framework.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Bevoegde instanties:</strong> indien wij hiertoe wettelijk verplicht zijn.</span>
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-[#575760]">
                  Met alle verwerkers zijn verwerkersovereenkomsten gesloten conform de AVG.
                </p>
              </div>

              {/* 6. Cookies */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  6. Cookies
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Onze website maakt gebruik van de volgende cookies:
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Noodzakelijke cookies</h3>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Technisch vereist voor het functioneren van de website. Geen toestemming nodig.
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Analytische cookies</h3>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Google Analytics plaatst cookies om anoniem websitegebruik te meten (pagina&apos;s bekeken,
                  duur van het bezoek, herkomst van bezoekers). IP-adressen worden geanonimiseerd
                  voordat ze worden opgeslagen. Er wordt geen gekoppeld profiel aangemaakt.
                </p>

                <h3 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Marketingcookies</h3>
                <p className="leading-relaxed text-[#575760]">
                  Wij gebruiken momenteel geen marketingcookies van derden.
                </p>

                <p className="mt-4 leading-relaxed text-[#575760]">
                  Je kunt cookies weigeren of verwijderen via de instellingen van je browser. Let op: het
                  uitschakelen van bepaalde cookies kan de functionaliteit van de website beperken.
                </p>
              </div>

              {/* 7. Jouw rechten */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  7. Jouw rechten
                </h2>
                <p className="mb-4 leading-relaxed text-[#575760]">
                  Op grond van de AVG heb je de volgende rechten ten aanzien van je persoonsgegevens:
                </p>
                <ul className="space-y-3 text-sm leading-relaxed text-[#575760]">
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Recht op inzage:</strong> je kunt opvragen welke gegevens wij van jou hebben.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Recht op rectificatie:</strong> onjuiste of onvolledige gegevens laten we corrigeren.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span>
                      <strong className="text-[#1f1f1f]">Recht op verwijdering (&apos;recht op vergetelheid&apos;):</strong> je kunt vragen jouw gegevens te wissen, tenzij wij een wettelijke bewaarplicht hebben.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Recht op beperking van de verwerking:</strong> in bepaalde situaties kun je vragen de verwerking tijdelijk te stoppen.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Recht op dataportabiliteit:</strong> je kunt jouw gegevens in een gangbaar formaat opvragen.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Recht van bezwaar:</strong> je kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b2b2be]">-</span>
                    <span><strong className="text-[#1f1f1f]">Recht op intrekking van toestemming:</strong> wanneer verwerking op toestemming is gebaseerd, kun je die toestemming altijd intrekken.</span>
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-[#575760]">
                  Stuur een verzoek naar{" "}
                  <a href="mailto:info@maisonblender.com" className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors">
                    info@maisonblender.com
                  </a>
                  . Wij reageren binnen 30 dagen. We vragen je identiteit te verifiëren zodat we
                  zeker weten dat we met de juiste persoon te maken hebben.
                </p>
              </div>

              {/* 8. Beveiliging */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  8. Beveiliging
                </h2>
                <p className="leading-relaxed text-[#575760]">
                  Wij nemen passende technische en organisatorische maatregelen om jouw persoonsgegevens
                  te beschermen tegen verlies, misbruik en onbevoegde toegang. Onze website maakt gebruik
                  van HTTPS-versleuteling. Toegang tot persoonsgegevens is beperkt tot medewerkers die
                  deze gegevens nodig hebben voor hun werkzaamheden.
                </p>
              </div>

              {/* 9. Klacht */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  9. Klacht indienen
                </h2>
                <p className="leading-relaxed text-[#575760]">
                  Heb je een klacht over hoe wij met jouw gegevens omgaan? Neem dan eerst contact met
                  ons op via{" "}
                  <a href="mailto:info@maisonblender.com" className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors">
                    info@maisonblender.com
                  </a>
                  . Komen we er samen niet uit, dan heb je het recht een klacht in te dienen bij de
                  Autoriteit Persoonsgegevens via{" "}
                  <span className="text-[#1f1f1f]">autoriteitpersoonsgegevens.nl</span>.
                </p>
              </div>

              {/* 10. Wijzigingen */}
              <div>
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  10. Wijzigingen in dit privacybeleid
                </h2>
                <p className="leading-relaxed text-[#575760]">
                  Wij kunnen dit privacybeleid aanpassen. De meest recente versie staat altijd op
                  maisonblender.com/privacybeleid. Bij ingrijpende wijzigingen stellen wij je hiervan
                  op de hoogte via e-mail, als we jouw adres hebben.
                </p>
              </div>

              {/* Contact */}
              <div className="border-t border-black/[0.06] pt-10">
                <h2 className="mb-4 text-base font-semibold uppercase tracking-widest text-[#575760]">
                  Vragen?
                </h2>
                <p className="leading-relaxed text-[#575760]">
                  Voor vragen over dit privacybeleid of je persoonsgegevens kun je ons bereiken via:
                </p>
                <div className="mt-4 text-sm leading-relaxed text-[#575760]">
                  <p>MAISON BLNDR (Applemooz)</p>
                  <p>Burg. Coonenplein 37, 6141BZ Sittard</p>
                  <p>
                    <a href="mailto:info@maisonblender.com" className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors">
                      info@maisonblender.com
                    </a>
                  </p>
                  <p>
                    <a href="tel:+31462004035" className="text-[#1f1f1f] underline underline-offset-2 hover:text-[#575760] transition-colors">
                      +31 (0)46 200 4035
                    </a>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
