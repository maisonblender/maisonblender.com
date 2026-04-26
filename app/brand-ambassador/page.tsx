import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AmbassadorWidget from "@/components/BrandAmbassador/AmbassadorWidget";

export const metadata: Metadata = {
  title: "AI Brand Ambassador | MAISON BLNDR — Geen chatbot. Een aanwezigheid.",
  description:
    "Geen chatbox. De eerste AI Brand Ambassador met een levende presence, voice, en live brand-transform. Getraind op jouw producten, diensten en tone-of-voice. Ervaar 'm nu.",
  alternates: { canonical: "https://maisonblender.com/brand-ambassador" },
  openGraph: {
    title: "AI Brand Ambassador | MAISON BLNDR",
    description:
      "Geen chatbox. Een levende brand presence die 24/7 namens je merk spreekt — op je website, WhatsApp en Teams.",
    url: "https://maisonblender.com/brand-ambassador",
    images: [
      {
        url: "https://maisonblender.com/images/brand-ambassador-encounter.png",
        width: 1024,
        height: 576,
        alt: "MAISON BLNDR · THE ENCOUNTER — AI Brand Ambassador met levende Liquid Presence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Brand Ambassador | MAISON BLNDR",
    description: "Geen chatbox. Een aanwezigheid — voice-ready, levend, en transformeert voor jouw merk.",
    images: ["https://maisonblender.com/images/brand-ambassador-encounter.png"],
  },
};

const differentiators = [
  {
    nummer: "01",
    titel: "Een levende presence, geen avatar",
    kop: "Geen profielfoto, geen robot-icoon.",
    body: "Een canvas-gerenderde entiteit die ademt, luistert, denkt en spreekt. Vier visuele states, reactief op audio en conversatie-intent. Niemand anders heeft dit.",
  },
  {
    nummer: "02",
    titel: "Imagine This Is Yours",
    kop: "Typ je bedrijfsnaam. De Ambassador transformeert.",
    body: "Kleur, tone, opening — ter plekke. De prospect ervaart hoe een Ambassador voor hun merk zou klinken. Geen concurrent biedt dit in de sales-flow.",
  },
  {
    nummer: "03",
    titel: "Voice-first, waar het past",
    kop: "Spreken, niet alleen typen.",
    body: "Web Speech API. Je spreekt je vraag in, de Ambassador antwoordt. Audio wordt nooit naar een server gestuurd — alles in de browser.",
  },
  {
    nummer: "04",
    titel: "Conversationele leadcapture",
    kop: "Geen formulier ooit.",
    body: "Bij een koopsignaal weeft de Ambassador kwalificatievragen in het gesprek. Jouw salesteam ontvangt volledig gekwalificeerde leads — zonder dat de bezoeker zich ingevuld voelt.",
  },
  {
    nummer: "05",
    titel: "AI-gegenereerde briefing",
    kop: "Na het gesprek: één persoonlijke e-mail.",
    body: "De bezoeker krijgt een samenvatting van wat hun voor ons gesprek relevant is. Jij ontvangt hetzelfde — in Twenty CRM, met volledig transcript en context. Vervolggesprek begint niet van nul.",
  },
];

const kanalen = [
  { name: "Website", description: "Embedded widget of fullscreen experience. Branded, snel, geen redirect." },
  { name: "WhatsApp Business", description: "Dezelfde Ambassador via het officiële Business Platform. Eén kennisbase." },
  { name: "Microsoft Teams", description: "Interne kennis-assistent of klantenservice-bot, met SSO." },
];

export default function BrandAmbassadorPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#1f1f1f] px-6 pb-14 pt-20 text-white lg:pb-20 lg:pt-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: "900px",
              height: "700px",
              background:
                "radial-gradient(closest-side, rgba(74,240,196,0.14), transparent 70%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#4af0c4]" />
              Niet zomaar een chatbot — een aanwezigheid
            </div>
            <h1
              className="mt-8 text-[34px] font-normal leading-[1.1] tracking-tight sm:text-[46px] lg:text-[58px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Elke website heeft een chatbox.
              <br />
              <span className="font-exposure">Jij verdient een Ambassador.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              De AI Brand Ambassador spreekt met de stem van je merk. Geen bolletje onderin je
              scherm. Een levende presence, voice-ready, die je merk herkenbaar maakt en leads
              kwalificeert zonder ooit een formulier te tonen. Probeer &apos;m nu live — en zie
              binnen drie klikken hoe hij voor jouw merk zou klinken.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full bg-[#4af0c4] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#7cf5d3] hover:shadow-lg"
              >
                Praat met de Ambassador →
              </a>
              <a
                href="/strategiegesprek"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
              >
                Vraag een offerte aan
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-white/40">
              <span>Live presence · 4 states</span>
              <span aria-hidden="true">·</span>
              <span>Voice · NL/EN</span>
              <span aria-hidden="true">·</span>
              <span>Imagine-this-is-yours</span>
              <span aria-hidden="true">·</span>
              <span>Twenty CRM sync</span>
            </div>
          </div>
        </section>

        {/* Live demo widget — DE kern van deze pagina */}
        <section id="demo" className="bg-[#0b0b0d] px-4 pb-20 pt-12 sm:px-6 lg:pt-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-3 text-center">
              <span className="text-xs uppercase tracking-widest text-white/50">Live demo</span>
              <h2
                className="text-[26px] font-normal leading-tight tracking-tight text-white sm:text-[32px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Dit is onze eigen Ambassador.
                <br />
                <span className="font-exposure">Probeer te zien waarom hij anders is.</span>
              </h2>
              <p className="mx-auto max-w-xl text-sm text-white/55">
                Stel gerust een vraag over tarieven, aanpak of implementatie. Druk op &quot;imagine
                this is yours&quot; om &apos;m voor jouw merk te zien transformeren.
              </p>
            </div>
            <AmbassadorWidget />
          </div>
        </section>

        {/* Differentiators — "waarom anders" */}
        <section className="bg-white px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                Waarom deze Ambassador anders is
              </span>
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[32px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Er zijn duizenden chatbots.
                <br />
                <span className="font-exposure">Geen enkele doet dit.</span>
              </h2>
              <p className="max-w-2xl text-[#575760]">
                Een gewone chatbot is een formulier met woorden. Dit is een gesprek dat bewijs
                levert terwijl het plaatsvindt — ontworpen om niet te lijken op elke andere
                widget rechtsonder op je scherm.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {differentiators.map((d) => (
                <article
                  key={d.nummer}
                  className="group flex flex-col gap-4 border border-black/[0.06] bg-[#f2f3f5] p-8 transition-colors hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-[#575760]/60">{d.nummer}</span>
                    <div className="h-px w-8 bg-black/20 transition-all group-hover:w-16 group-hover:bg-black/40" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1f1f1f]">{d.titel}</h3>
                  <p className="text-base font-medium text-[#1f1f1f]">{d.kop}</p>
                  <p className="text-sm leading-relaxed text-[#575760]">{d.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Kanalen */}
        <section className="bg-[#f2f3f5] px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[32px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Eén Ambassador.
                <br />
                <span className="font-exposure">Overal consistent.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[#575760]">
                Dezelfde kennisbase, dezelfde tone-of-voice. Beantwoordt overal wat je team
                anders zou beantwoorden — en doet het consequent.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {kanalen.map((ch) => (
                <div key={ch.name} className="border border-black/[0.06] bg-white p-6">
                  <h3 className="text-sm font-semibold text-[#1f1f1f]">{ch.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#575760]">{ch.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / timeline strip */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
            {[
              { label: "Live binnen", value: "2 weken" },
              { label: "Vanaf", value: "€3.000" },
              { label: "Beheer", value: "All-in" },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-black/20 pl-5">
                <span className="text-xs uppercase tracking-widest text-[#6b6b75]">
                  {item.label}
                </span>
                <p className="mt-1 text-3xl font-bold text-[#1f1f1f]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1f1f1f] px-6 py-20 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[32px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Wil je een Ambassador die
              <br />
              <span className="font-exposure">als jóuw merk klinkt?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
              We trainen &apos;m op jouw producten, diensten, FAQ&apos;s en tone-of-voice. Live
              binnen twee weken, inclusief integratie met je CRM en kanalen.
            </p>
            <a
              href="/strategiegesprek"
              className="mt-8 inline-block rounded-full bg-[#4af0c4] px-10 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#7cf5d3] hover:shadow-lg"
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
