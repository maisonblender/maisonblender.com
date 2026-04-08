import Link from "next/link";
import { Clock, TrendingUp, BarChart3 } from "lucide-react";

const KANSEN = [
  { Icon: Clock, tekst: "40+ uur/week besparing" },
  { Icon: TrendingUp, tekst: "Concrete ROI in euro's" },
  { Icon: BarChart3, tekst: "AI Readiness Score 0-100" },
];

export default function QuickscanBanner() {
  return (
    <section className="bg-[#1f1f1f] px-6 py-14 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left: badge + headline + sub */}
          <div className="flex flex-col gap-4 md:max-w-xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Gratis · Direct resultaat · Geen registratie
            </div>

            <h2 className="text-[26px] font-normal leading-tight tracking-tight sm:text-[32px]" style={{ letterSpacing: "-0.6px" }}>
              Ontdek jouw AI-kansen
              <br />
              <span className="font-exposure">in 3 minuten.</span>
            </h2>

            <p className="text-sm leading-relaxed text-white/60 sm:text-base">
              De AI Impact Scan analyseert jouw bedrijfsprofiel en geeft een
              gepersonaliseerde score, ROI-schatting en concrete implementatieroadmap - diepgaander
              dan een snelle scan, direct en zonder formulier of wachten.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              {KANSEN.map((k) => (
                <span key={k.tekst} className="flex items-center gap-1.5">
                  <k.Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                  {k.tekst}
                </span>
              ))}
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="w-full shrink-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:w-72 lg:w-80">
            <div className="mb-5 flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                AI Impact Scan
              </span>
              <span className="text-lg font-semibold text-white">Gratis · 3 minuten</span>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {[
                  "10 gerichte vragen",
                  "Live AI-analyse",
                  "Score + sector-benchmark",
                  "Top 3 kansen met ROI",
                  "Opportunity Map heatmap",
                  "Gratis Actieplan per e-mail",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 shrink-0 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/quickscan"
              className="block w-full rounded-full bg-white py-3 text-center text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#f2f3f5] hover:shadow-md"
            >
              Start jouw gratis AI Impact Scan
            </Link>
            <p className="mt-3 text-center text-xs text-white/40">
              Geen e-mail vereist voor resultaten
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
