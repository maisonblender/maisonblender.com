import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Brand Ambassador | MAISON BLNDR - Jouw merk. Altijd online.",
  description:
    "Een AI Brand Ambassador getraind op jouw producten, diensten en tone-of-voice. 24/7 bereikbaar via website, WhatsApp of Teams. Ervaar de live demo van de MAISON BLNDR Brand Ambassador.",
  alternates: { canonical: "https://maisonblender.com/brand-ambassador" },
  openGraph: {
    title: "AI Brand Ambassador | MAISON BLNDR",
    description: "Jouw merk. Altijd online. Altijd on-brand.",
    url: "https://maisonblender.com/brand-ambassador",
  },
};

const capabilities = [
  {
    title: "Productkennis",
    description: "Getraind op je volledige productcatalogus, prijzen en specificaties. Antwoordt accuraat op technische vragen.",
  },
  {
    title: "Tone-of-voice",
    description: "Communiceert in de stijl van jouw merk - of dat nu formeel, informeel, technisch of laagdrempelig is.",
  },
  {
    title: "Leadgeneratie",
    description: "Kwalificeert bezoekers, stelt gerichte vragen en stuurt warme leads door naar jouw salesteam.",
  },
  {
    title: "24/7 beschikbaar",
    description: "Beantwoordt vragen buiten kantooruren. Geen gemiste leads in het weekend of 's nachts.",
  },
  {
    title: "Multichannel",
    description: "Eén kennisbase, meerdere kanalen: website widget, WhatsApp Business en Microsoft Teams.",
  },
  {
    title: "Lerende kennisbase",
    description: "Groeit mee met jouw bedrijf. Nieuwe producten of FAQs? Binnen uren live in de Ambassador.",
  },
];

const channels = [
  { name: "Website widget", description: "Direct embedded op elke pagina van je website" },
  { name: "WhatsApp Business", description: "Via het officiële WhatsApp Business platform" },
  { name: "Microsoft Teams", description: "Als Teams-bot voor intern gebruik of klantenservice" },
];

export default function BrandAmbassadorPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {/* Hero */}
        <section className="relative bg-[#1f1f1f] px-6 py-28 text-white overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 mb-8">
              <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              Live demo beschikbaar
            </div>
            <h1
              className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[52px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              Jouw merk.
              <br />
              <span className="font-exposure">Altijd online. Altijd on-brand.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg mb-10 max-w-2xl mx-auto">
              Een AI Brand Ambassador spreekt met de stem van jouw merk - productkennis, tone-of-voice,
              commerciële instelling. Via je website, WhatsApp of Teams. Dag en nacht, zonder personeelskosten.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <a
                href="#demo"
                className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg"
              >
                Bekijk de live demo →
              </a>
              <a
                href="/strategiegesprek"
                className="inline-block rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
              >
                Vraag een offerte aan
              </a>
            </div>
          </div>
        </section>

        {/* Live demo section */}
        <section id="demo" className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-start">
              <div>
                <div className="inline-flex items-center gap-2 border border-black/10 bg-[#f2f3f5] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  Live demo
                </div>
                <h2
                  className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px] mb-4"
                  style={{ letterSpacing: "-0.95px" }}
                >
                  Ervaar onze eigen
                  <br />
                  <span className="font-exposure">Brand Ambassador.</span>
                </h2>
                <p className="text-base leading-relaxed text-[#575760] mb-6">
                  Dit is geen demo-omgeving - dit is de echte MAISON BLNDR Brand Ambassador.
                  Stel een vraag over onze diensten, tarieven of aanpak. Zo ervaar je precies
                  wat jouw klanten zullen ervaren.
                </p>
                <p className="text-sm leading-relaxed text-[#575760]">
                  Getraind op: onze diensten, veelgestelde vragen, werkwijze, sector-expertise en tone-of-voice.
                </p>
              </div>

              {/* Chat demo widget placeholder */}
              <div className="rounded-2xl border border-black/[0.06] bg-[#f2f3f5] overflow-hidden shadow-sm">
                <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#1f1f1f] flex items-center justify-center">
                      <span className="text-white text-xs font-medium">MB</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1f1f1f]">MAISON BLNDR</p>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        <span className="text-xs text-[#575760]">Online</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#b2b2be]">AI Brand Ambassador</span>
                </div>
                <div className="flex flex-col gap-3 p-5 min-h-[260px]">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm text-[#1f1f1f]">Goedemiddag! Ik ben de AI Brand Ambassador van MAISON BLNDR. Hoe kan ik je helpen?</p>
                  </div>
                  <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-sm bg-[#1f1f1f] px-4 py-3">
                    <p className="text-sm text-white">Wat maakt jullie anders dan andere AI-bureaus?</p>
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm text-[#1f1f1f]">We bouwen altijd werkende systemen - geen PowerPoint-strategie. Onze sessies leveren op dag 1 een live AI-oplossing op, in jouw systemen, overdraagbaar aan jouw team.</p>
                  </div>
                </div>
                <div className="border-t border-black/[0.06] bg-white px-4 py-3">
                  <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f2f3f5] px-4 py-3">
                    <span className="flex-1 text-sm text-[#b2b2be]">Stel een vraag aan onze Brand Ambassador...</span>
                    <div className="h-7 w-7 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs text-[#b2b2be]">Live integratie wordt binnenkort geactiveerd</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Wat een Brand Ambassador
                <br />
                <span className="font-exposure">voor jou doet.</span>
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((cap) => (
                <div key={cap.title} className="bg-white border border-black/[0.06] p-6 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-[#1f1f1f]">{cap.title}</h3>
                  <p className="text-sm leading-relaxed text-[#575760]">{cap.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Channels */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Eén kennisbase.
                <br />
                <span className="font-exposure">Drie kanalen.</span>
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {channels.map((ch) => (
                <div key={ch.name} className="border border-black/[0.06] bg-[#f2f3f5] p-6 text-center">
                  <h3 className="text-sm font-semibold text-[#1f1f1f] mb-2">{ch.name}</h3>
                  <p className="text-xs leading-relaxed text-[#575760]">{ch.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-[#1f1f1f] text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[26px] mb-4"
              style={{ letterSpacing: "-0.95px" }}
            >
              Klaar voor een Brand Ambassador
              <br />
              <span className="font-exposure">die nooit slaapt?</span>
            </h2>
            <p className="text-base leading-relaxed text-white/70 mb-8 max-w-xl mx-auto">
              Vraag een offerte aan. We bouwen een Ambassador getraind op jouw merk - live binnen twee weken.
            </p>
            <a
              href="/strategiegesprek"
              className="inline-block rounded-full bg-[#22c55e] px-10 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg"
            >
              Vraag een offerte aan →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
