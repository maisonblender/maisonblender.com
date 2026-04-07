import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteImage from "@/components/SiteImage";
import LabsNewsletterForm from "@/components/LabsNewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Limburg AI Labs — AI kennis voor Zuid-Limburg",
  description:
    "Gratis AI-tools, Limburgse business cases, maandelijkse webinars en een nieuwsbrief voor ondernemers en professionals in Zuid-Limburg.",
};

export default function LabsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 bg-[#f2f3f5] text-[#1f1f1f]">
        {/* Hero */}
        <section className="relative px-6 pt-28 pb-20 overflow-hidden lg:pt-36 lg:pb-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: "radial-gradient(circle, #b2b2be 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit items-center gap-2 border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760]">
                  Limburg AI Labs · labs.maisonblender.com
                </div>

                <h1
                  className="text-[28px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[35px] lg:text-[32px]"
                  style={{ letterSpacing: "-0.95px" }}
                >
                  AI kennis voor
                  <br />
                  <span className="font-exposure">Zuid-Limburg.</span>
                </h1>

                <p className="text-base leading-relaxed text-[#575760] max-w-lg">
                  Gratis tools, Limburgse AI-cases, maandelijkse webinars en praktische kennis voor
                  ondernemers en professionals in de regio. Gebouwd door MAISON BLNDR, voor
                  iedereen.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#nieuwsbrief"
                    className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg text-center"
                  >
                    Schrijf je in voor de nieuwsbrief
                  </a>
                  <a
                    href="#webinar"
                    className="inline-block rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-medium text-[#1f1f1f] transition-all hover:border-black/20 hover:bg-[#ecedf0] text-center"
                  >
                    Volgende webinar →
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <SiteImage
                    src="/images/labs-hero.png"
                    alt="Limburg AI Labs regionale kennishub illustratie"
                    className="object-cover w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Toolbox */}
        <section className="relative bg-white px-6 py-20 lg:py-32">
          <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                Gratis tools
              </span>
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                AI Gereedschapskist.
                <br />
                <span className="font-exposure">Direct bruikbaar, gratis.</span>
              </h2>
              <p className="max-w-xl text-[#575760]">
                Praktische AI-tools en prompts voor Limburgse ondernemers. Geen registratie vereist.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "AI Quickscan",
                  description:
                    "10 gerichte vragen over jouw bedrijfsprocessen. Direct een score, ROI-berekening en top 3 kansen.",
                  cta: "Start scan →",
                  href: "/quickscan",
                  badge: "Meest gebruikt",
                },
                {
                  title: "Prompt Generator",
                  description:
                    "Genereer effectieve ChatGPT-prompts voor jouw specifieke branche en use case. Kopieer en gebruik direct.",
                  cta: "Binnenkort",
                  href: null,
                  badge: null,
                },
                {
                  title: "AI Readiness Checklist",
                  description:
                    "Een downloadbare checklist met 25 vragen om te bepalen of jouw organisatie klaar is voor AI-implementatie.",
                  cta: "Binnenkort",
                  href: null,
                  badge: null,
                },
              ].map((tool) => (
                <div key={tool.title} className="flex flex-col gap-4 bg-[#f2f3f5] p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    {tool.badge && (
                      <span className="border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1 text-xs text-[#22c55e] font-medium">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#1f1f1f]">{tool.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-[#575760]">{tool.description}</p>
                  {tool.href ? (
                    <a
                      href={tool.href}
                      className="text-sm font-semibold text-[#1f1f1f] hover:text-[#22c55e] transition-colors"
                    >
                      {tool.cta}
                    </a>
                  ) : (
                    <span className="text-sm text-[#575760]/50">{tool.cta}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
        </section>

        {/* Webinar */}
        <section id="webinar" className="relative bg-[#1f1f1f] px-6 py-20 text-white lg:py-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                Webinars
              </span>
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Maandelijks live.
                <br />
                <span className="font-exposure">AI in de Limburgse praktijk.</span>
              </h2>
              <p className="text-base leading-relaxed text-white/70 max-w-xl">
                Elke maand een gratis webinar met een praktijkcase uit de regio en directe
                Q&A. Opnames beschikbaar voor abonnees.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Next webinar */}
              <div className="border border-white/10 bg-white/5 p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#22c55e]" />
                  <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                    Volgende editie
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  AI in het MKB — eerste stappen zonder IT-afdeling
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  Hoe Limburgse mkb-bedrijven beginnen met AI zonder technische kennis in huis.
                  Praktijkcase + live demo.
                </p>
                <div className="mt-auto">
                  <a
                    href="/strategiegesprek"
                    className="inline-block rounded-full bg-[#22c55e] px-6 py-3 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a]"
                  >
                    Aanmelden — gratis
                  </a>
                </div>
              </div>

              {/* Archive placeholder */}
              <div className="border border-white/10 bg-white/5 p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                  Archief
                </span>
                <h3 className="text-xl font-bold text-white">Eerdere edities</h3>
                <p className="text-sm leading-relaxed text-white/60">
                  Webinar-opnames beschikbaar voor nieuwsbriefabonnees. Schrijf je in en ontvang
                  direct toegang tot alle eerdere sessies.
                </p>
                <div className="mt-auto">
                  <a
                    href="#nieuwsbrief"
                    className="inline-block border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
                  >
                    Schrijf je in voor toegang
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cases */}
        <section className="relative bg-white px-6 py-20 lg:py-32">
          <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                Kennisbank
              </span>
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                AI in Limburg.
                <br />
                <span className="font-exposure">Echte bedrijven, echte resultaten.</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  sector: "Logistiek · Heerlen",
                  title: "40 uur per week bespaard op factuurverwerking",
                  teaser:
                    "Hoe een regionaal transportbedrijf factuurverwerking volledig automatiseerde met AI en de administratie terugbracht van 40 naar 2 uur per week.",
                },
                {
                  sector: "Zorg · Maastricht",
                  title: "Klantenservice 24/7 zonder extra personeel",
                  teaser:
                    "Een Maastrichtse zorginstelling implementeerde een AI Brand Ambassador die 80% van de eerstelijns klantvragen automatisch afhandelt.",
                },
                {
                  sector: "Retail · Sittard",
                  title: "AI-offertetool: 20 minuten naar 2 minuten",
                  teaser:
                    "Een retailketen in Sittard reduceert offertetijd met 90% door AI-gegenereerde offertes op basis van klantinput.",
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-4 bg-[#f2f3f5] p-6 sm:p-8">
                  <span className="text-xs font-medium text-[#575760]/70 uppercase tracking-widest">
                    {item.sector}
                  </span>
                  <h3 className="text-lg font-bold text-[#1f1f1f] leading-snug">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#575760]">{item.teaser}</p>
                  <span className="text-xs text-[#575760]/40 mt-auto">Volledige case · Binnenkort</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
        </section>

        {/* Newsletter */}
        <section id="nieuwsbrief" className="bg-[#f2f3f5] px-6 py-20">
          <div className="mx-auto max-w-xl text-center flex flex-col gap-6 items-center">
            <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760]">
              Gratis · Geen spam · Maandelijks
            </div>
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              AI in Limburg Nieuwsbrief.
              <br />
              <span className="font-exposure">Elke maand in jouw inbox.</span>
            </h2>
            <p className="text-base leading-relaxed text-[#575760]">
              De nieuwste AI-tools, Limburgse cases, webinar-aankondigingen en praktische tips.
              Altijd gratis, altijd relevant voor de regio.
            </p>
            <LabsNewsletterForm />
            <p className="text-xs text-[#575760]/50">
              Uitschrijven kan altijd. Geen verplichtingen.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
