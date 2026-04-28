import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Calculator, HardHat } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Collega — Digitale medewerkers voor het MKB | MAISON BLNDR",
  description:
    "Een AI Collega voor jouw branche. Beantwoordt vragen, schrijft content en kwalificeert leads — 24/7, in het Nederlands. Kies jouw branche en ga direct live.",
  alternates: { canonical: "https://maisonblender.com/aicollega" },
  openGraph: {
    title: "AI Collega — Digitale medewerkers voor het MKB",
    description:
      "Kies jouw branche en ga direct live met een AI Collega die jouw bedrijf kent.",
    url: "https://maisonblender.com/aicollega",
  },
};

const branches = [
  {
    Icon: Building2,
    titel: "AI Collega Makelaar",
    beschrijving:
      "Beantwoordt bezoekersvragen over objecten, plant bezichtigingen in en genereert woningomschrijvingen. 24/7 actief op jouw website.",
    href: "/aicollega/makelaar",
    status: "beschikbaar",
    highlight: true,
  },
  {
    Icon: Calculator,
    titel: "AI Collega Accountant",
    beschrijving:
      "Beantwoordt klantvragen over jaarrekeningen, belastingaangiften en dossiers. Kwalificeert leads voor het eerste gesprek.",
    href: "/aicollega/accountant",
    status: "binnenkort",
    highlight: false,
  },
  {
    Icon: HardHat,
    titel: "AI Collega Bouwbedrijf",
    beschrijving:
      "Verwerkt offerteaanvragen, beantwoordt vragen over projecten en genereert professionele offerteteksten.",
    href: "/aicollega/bouwbedrijf",
    status: "binnenkort",
    highlight: false,
  },
];

export default function AICollegaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-28 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle, #b2b2be 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="pointer-events-none absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760] mb-8">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live in 15 minuten — per branche geconfigureerd
          </div>

          <h1
            className="text-[32px] font-normal leading-[1.15] tracking-tight text-[#1f1f1f] sm:text-[42px] lg:text-[52px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            Jouw AI Collega.
            <br />
            <span className="font-exposure">Klaar als jij slaapt.</span>
          </h1>

          <p className="text-base leading-relaxed text-[#575760] sm:text-lg mb-10 max-w-2xl mx-auto">
            Een digitale medewerker die jouw bedrijf kent, vragen beantwoordt en leads vastlegt — 24/7,
            in het Nederlands. Kies jouw branche en ga direct live.
          </p>
        </div>
      </section>

      {/* Branches */}
      <section className="py-20 px-6 bg-white">
        <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent mb-20 -mt-20" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
              Kies jouw branche
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((b) => (
              <div
                key={b.titel}
                className={`relative flex flex-col p-8 transition-all ${
                  b.highlight
                    ? "bg-[#1f1f1f] text-white"
                    : "bg-[#f2f3f5] text-[#1f1f1f]"
                }`}
              >
                {b.status === "beschikbaar" && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className={`text-xs ${b.highlight ? "text-white/60" : "text-[#575760]"}`}>
                      Beschikbaar
                    </span>
                  </div>
                )}
                {b.status === "binnenkort" && (
                  <div className="absolute top-4 right-4">
                    <span className={`text-xs ${b.highlight ? "text-white/40" : "text-[#575760]/60"}`}>
                      Binnenkort
                    </span>
                  </div>
                )}

                <b.Icon
                  className={`h-7 w-7 mb-6 ${b.highlight ? "text-white" : "text-[#1f1f1f]"}`}
                  strokeWidth={1.5}
                />

                <h2 className="text-lg font-bold mb-3">{b.titel}</h2>
                <p className={`text-sm leading-relaxed mb-8 flex-1 ${b.highlight ? "text-white/70" : "text-[#575760]"}`}>
                  {b.beschrijving}
                </p>

                {b.status === "beschikbaar" ? (
                  <Link
                    href={b.href}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${
                      b.highlight
                        ? "text-white hover:text-white/80"
                        : "text-[#1f1f1f] hover:text-[#575760]"
                    }`}
                  >
                    Meer info & demo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                ) : (
                  <span className={`text-sm ${b.highlight ? "text-white/40" : "text-[#575760]/50"}`}>
                    In ontwikkeling
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#f2f3f5]">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 bg-white p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-[#1f1f1f]">Wil je weten hoe dit werkt voor jouw branche?</p>
            <p className="text-[#575760]">Plan een kort gesprek — we laten het live zien.</p>
          </div>
          <Link
            href="/strategiegesprek"
            className="shrink-0 rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#3a3a42] hover:shadow-md inline-flex items-center gap-2"
          >
            Plan een gesprek
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
