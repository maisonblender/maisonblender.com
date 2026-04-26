import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Studio | MAISON BLNDR - Wie zijn wij",
  description:
    "MAISON BLNDR bouwt AI die werkt voor de mensen die het dagelijks moeten gebruiken. Gevestigd in Sittard, actief door heel Nederland. Van quickscan tot beheer - alles door hetzelfde team.",
  alternates: { canonical: "https://maisonblender.com/studio" },
  openGraph: {
    title: "Studio | MAISON BLNDR",
    description:
      "We bouwen AI die werkt voor de mensen die het dagelijks moeten gebruiken. Gevestigd in Sittard, actief door heel Nederland.",
    url: "https://maisonblender.com/studio",
  },
};


const process = [
  {
    title: "Gratis quickscan",
    description:
      "Van je processen - welke lenen zich voor automatisering, wat levert het op.",
  },
  {
    title: "Architectuur op maat",
    description:
      "Op basis van jouw bestaande systemen - geen big bang vervanging.",
  },
  {
    title: "Werkend prototype in 2 weken",
    description: "In je eigen omgeving - geen demo-data, geen mockups.",
  },
  {
    title: "Validatie met jouw team",
    description: "Samen testen en bijsturen voordat we verder bouwen.",
  },
  {
    title: "Lancering naar productie",
    description: "Robuust, veilig, schaalbaar - klaar voor dagelijks gebruik.",
  },
  {
    title: "Beheer & monitoring",
    description:
      "Blijft bij ons - ook als er iets verandert aan je systemen.",
  },
];


const sectors = [
  "Productiebedrijven",
  "Accountantskantoren",
  "Installatiebedrijven",
  "Logistieke bedrijven",
  "E-commerceplatforms",
];

const testimonials = [
  {
    quote:
      "In één gesprek werd duidelijk welke processen het meeste opleveren. Binnen zes weken stond de eerste automatisering live.",
    author: "Directeur Operations",
    company: "Productiebedrijf, Sittard",
  },
  {
    quote:
      "We hadden geen idee waar te beginnen met AI. Na de quickscan wisten we precies welke drie stappen we moesten zetten - en in welke volgorde.",
    author: "Eigenaar",
    company: "Accountantskantoor, Geleen",
  },
];

export default function StudioPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {/* Hero */}
        <section className="relative bg-[#1f1f1f] px-6 py-28 text-white overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 mb-8">
              Studio · Sittard, NL
            </div>
            <h1
              className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[52px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              We bouwen AI die werkt voor
              <br />
              <span className="font-exposure">
                de mensen die het dagelijks moeten gebruiken.
              </span>
            </h1>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg max-w-2xl mx-auto">
              Niet de mooiste slides. Niet het meest complexe systeem. Gewoon
              iets wat werkt - en dat we daarna ook blijven beheren.
            </p>
          </div>
        </section>


        {/* Waar we mee begonnen */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
              Waar we mee begonnen
            </p>
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[32px] mb-8"
              style={{ letterSpacing: "-0.95px" }}
            >
              AI-implementaties mislukken niet door de technologie.
              <br />
              <span className="font-exposure">
                Ze mislukken omdat bureaus leveren wat indrukwekkend klinkt -
                niet wat werkt voor de mensen die het dagelijks moeten
                gebruiken.
              </span>
            </h2>
            <div className="space-y-5 text-base leading-relaxed text-[#575760]">
              <p>
                We zijn dat vaak genoeg tegengekomen. Een mooi dashboard dat
                niemand opent. Een chatbot die na drie weken toch maar
                uitgeschakeld wordt. Een roadmap van vijftig slides die in de
                la verdwijnt. Goed bedoeld, slecht geland.
              </p>
              <p>
                Dat is waar MAISON BLNDR uit is ontstaan. Niet als reactie op
                een markttrend, maar als reactie op een patroon dat we bleven
                zien: de kloof tussen wat bureaus opleveren en wat bedrijven er
                dagelijks mee kunnen.
              </p>
              <p className="text-[#1f1f1f] font-medium">
                Wij beginnen altijd met je processen. Dan pas met de code.
              </p>
            </div>
          </div>
        </section>

        {/* Hoe we werken */}
        <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 mb-16">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
                  Hoe we werken
                </p>
                <h2
                  className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[32px]"
                  style={{ letterSpacing: "-0.95px" }}
                >
                  Geen grote beloftes voor de opdracht.
                  <br />
                  <span className="font-exposure">
                    Geen stille telefoon daarna.
                  </span>
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-[#575760]">
                <p>
                  We doen het hele traject zelf. Van het eerste gesprek over je
                  processen tot het beheer van de AI-agents die eruit
                  voortkomen. Geen wisselende consultants, geen uitbesteed
                  development, geen callcenter als er iets niet klopt.
                </p>
                <p>
                  Dat betekent ook: als iets niet gaat werken, zeggen we dat
                  eerder. In het eerste gesprek al, als dat nodig is. We
                  verdienen niets aan een project dat na drie maanden stilvalt.
                </p>
              </div>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {process.map((step, idx) => (
                <li
                  key={step.title}
                  className="flex flex-col gap-3 border border-black/[0.06] bg-white p-6"
                >
                  <span
                    className="font-exposure text-[32px] leading-none text-[#1f1f1f]/30"
                    style={{ letterSpacing: "-0.05em" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold text-[#1f1f1f]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#575760]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Waarmee we bouwen */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 mb-12">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
                  Waarmee we bouwen
                </p>
                <h2
                  className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[32px]"
                  style={{ letterSpacing: "-0.95px" }}
                >
                  Geen evangelisatie
                  <br />
                  <span className="font-exposure">van de nieuwste hype.</span>
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-[#575760]">
                <p>
                  We kiezen de tool die past bij het probleem — niet de tool
                  die we graag willen uitproberen, en niet de tool die de
                  hoogste marge heeft. Dat klinkt vanzelfsprekend. In de
                  praktijk is het dat niet altijd.
                </p>
                <p>
                  Voor intelligente agents werken we met <strong className="text-[#1f1f1f]">Anthropic Claude</strong> en{" "}
                  <strong className="text-[#1f1f1f]">OpenAI</strong>, georkestreerd via{" "}
                  <strong className="text-[#1f1f1f]">LangChain</strong> en{" "}
                  <strong className="text-[#1f1f1f]">LangGraph</strong>. Workflow-automatisering bouwen we
                  met <strong className="text-[#1f1f1f]">n8n</strong>, <strong className="text-[#1f1f1f]">Make.com</strong> of{" "}
                  <strong className="text-[#1f1f1f]">Zapier</strong> — afhankelijk van wat bij jouw systemen past.
                  Maatwerksoftware bouwen we op <strong className="text-[#1f1f1f]">Next.js</strong>,{" "}
                  <strong className="text-[#1f1f1f]">TypeScript</strong> en{" "}
                  <strong className="text-[#1f1f1f]">Python</strong>, gehost op{" "}
                  <strong className="text-[#1f1f1f]">Microsoft Azure</strong> of <strong className="text-[#1f1f1f]">AWS</strong>.
                </p>
                <p>
                  We beheren onze eigen infrastructuur en kennen de systemen
                  die we opleveren van binnen en buiten. Dat maakt beheer
                  sneller en eerlijker geprijsd.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Voor wie we werken */}
        <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 mb-16">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
                  Voor wie we werken
                </p>
                <h2
                  className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[32px]"
                  style={{ letterSpacing: "-0.95px" }}
                >
                  MKB-bedrijven die willen groeien
                  <br />
                  <span className="font-exposure">
                    zonder evenredig meer mensen aan te nemen.
                  </span>
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-[#575760]">
                <p>
                  Onze klanten zijn bedrijven tussen de tien en tweehonderd
                  medewerkers, actief in Nederland, die merken dat handmatige
                  processen de groei beginnen te remmen. Ze weten dat er
                  betere manieren zijn om te werken - maar hebben geen team
                  van data-scientists in dienst en geen zin in een half jaar
                  implementatietraject.
                </p>
                <p>
                  Wat ze gemeen hebben: processen die herhaald worden, data
                  die niet gebruikt wordt en mensen die tijd kwijtraken aan
                  werk dat een systeem beter kan doen.
                </p>
              </div>
            </div>

            <ul className="flex flex-wrap gap-3">
              {sectors.map((sector) => (
                <li
                  key={sector}
                  className="border border-black/[0.06] bg-white px-5 py-3 text-sm font-medium text-[#1f1f1f]"
                >
                  {sector}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2">
              {testimonials.map((t) => (
                <blockquote
                  key={t.author + t.company}
                  className="flex flex-col gap-6 border border-black/[0.06] bg-[#f2f3f5] p-8 lg:p-10"
                >
                  <p
                    className="text-lg font-normal leading-[1.4] text-[#1f1f1f] sm:text-xl"
                    style={{ letterSpacing: "-0.3px" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="text-sm text-[#575760]">
                    <span className="font-semibold text-[#1f1f1f]">
                      {t.author}
                    </span>
                    <span className="block text-xs uppercase tracking-widest mt-1">
                      {t.company}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Waar we zitten */}
        <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
              Waar we zitten
            </p>
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[32px] mb-8"
              style={{ letterSpacing: "-0.95px" }}
            >
              Gevestigd in Sittard.
              <br />
              <span className="font-exposure">Actief door heel Nederland.</span>
            </h2>
            <div className="space-y-5 text-base leading-relaxed text-[#575760]">
              <p>
                We werken vanuit Sittard, Limburg. Niet omdat we gebonden
                zijn aan de regio, maar omdat we hier geworteld zijn. Via{" "}
                <a
                  href="/labs"
                  className="font-medium text-[#1f1f1f] underline underline-offset-2 hover:no-underline"
                >
                  Limburg AI Labs
                </a>{" "}
                delen we praktische AI-kennis met Limburgse ondernemers -
                webinars, tools en een maandelijkse nieuwsbrief, allemaal
                gratis.
              </p>
              <p>
                Klanten buiten de regio bereiken we via videocall en on-site
                bezoeken waar nodig. Het geografisch bereik is heel Nederland.
              </p>
            </div>
          </div>
        </section>

        {/* Eerlijkheid */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
              Eerlijkheid
            </p>
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[32px] mb-8"
              style={{ letterSpacing: "-0.95px" }}
            >
              We zijn niet voor iedereen
              <br />
              <span className="font-exposure">de juiste keuze.</span>
            </h2>
            <div className="space-y-5 text-base leading-relaxed text-[#575760]">
              <p>
                Als je op zoek bent naar een bureau dat ja zegt op alles wat je
                vraagt, zijn wij dat niet. We denken mee, ook als dat betekent
                dat we je afraden ergens in te investeren. Sommige processen
                lenen zich niet voor AI-automatisering - niet omdat het
                technisch niet kan, maar omdat de ROI er niet is of de
                organisatie er nog niet klaar voor is. Dat zeggen we dan ook.
              </p>
              <p>
                Wat we wel zijn: een team dat jouw systemen leert kennen, dat
                bereikbaar is als er iets niet klopt, en dat langetermijn denkt
                in plaats van per project. Voor de meeste van onze klanten zijn
                we geen eenmalige leverancier maar een vaste technische
                partner.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-[#1f1f1f] text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[32px] mb-4"
              style={{ letterSpacing: "-0.95px" }}
            >
              Benieuwd of we bij
              <br />
              <span className="font-exposure">jouw bedrijf passen?</span>
            </h2>
            <p className="text-base leading-relaxed text-white/70 mb-8 max-w-xl mx-auto">
              Plan een gratis gesprek van 30 minuten. We bespreken wat er
              speelt, geven een eerlijk beeld van de mogelijkheden - en zijn
              ook eerlijk als het antwoord &ldquo;nu nog niet&rdquo; is.
            </p>
            <a
              href="/strategiegesprek"
              className="inline-block rounded-full bg-[#22c55e] px-10 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg"
            >
              Plan een strategiegesprek →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
