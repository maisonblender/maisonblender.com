import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Zap, Brain, BarChart3, TrendingUp, Map, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Impact Scan | MAISON BLNDR - Ontdek jouw AI-kansen",
  description:
    "Doe in 3 minuten de gratis AI Impact Scan van MAISON BLNDR. Ontdek jouw AI Readiness Score, ROI-potentieel en concrete implementatieroadmap. Direct resultaat, geen e-mail vereist.",
  alternates: { canonical: "https://maisonblender.com/quickscan" },
  openGraph: {
    title: "AI Impact Scan | MAISON BLNDR",
    description: "3 minuten. Echte AI. Gepersonaliseerde resultaten.",
    url: "https://maisonblender.com/quickscan",
  },
};

const voordelen = [
  { Icon: Zap, titel: "3 minuten", tekst: "10 korte vragen over jouw bedrijf en uitdagingen" },
  { Icon: Brain, titel: "Echte AI-analyse", tekst: "Analyseert live jouw situatie - geen generiek rapport" },
  { Icon: BarChart3, titel: "AI Readiness Score", tekst: "Jouw score 0-100 + benchmark vs. jouw sector" },
  { Icon: TrendingUp, titel: "ROI Berekening", tekst: "Concrete euro-indicaties voor tijds- en kostenbesparing" },
  { Icon: Map, titel: "Opportunity Map", tekst: "Visuele heatmap van AI-kansen per bedrijfsfunctie" },
  { Icon: FileText, titel: "Gratis Actieplan", tekst: "15-pagina gepersonaliseerd AI Actieplan via e-mail" },
];

export default function QuickscanPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
          {/* Subtle dot grid */}
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
              AI Impact Scan - gratis, zonder registratie
            </div>

            <h1
              className="text-[32px] font-normal leading-[1.15] tracking-tight text-[#1f1f1f] sm:text-[42px] lg:text-[52px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              Ontdek jouw AI-kansen
              <br />
              <span className="font-exposure">in 3 minuten.</span>
            </h1>

            <p className="text-base leading-relaxed text-[#575760] sm:text-lg mb-10 max-w-2xl mx-auto">
              De AI Impact Scan analyseert jouw bedrijfsprofiel en geeft je
              een gepersonaliseerde AI Readiness Score, ROI-schatting en concrete implementatieroadmap.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quickscan/scan"
                className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                Start gratis AI-scan
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-[#575760] text-sm self-center">Geen e-mail vereist voor resultaten</p>
            </div>
          </div>
        </section>

        {/* Wat je krijgt */}
        <section className="py-20 px-6 bg-white">
          <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent mb-20 -mt-20" />
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">Wat je krijgt</span>
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Alles in 3 minuten.
                <br />
                <span className="font-exposure">Geen registratie vereist.</span>
              </h2>
              <p className="max-w-xl text-[#575760]">
                Geen generiek rapport. Echte AI-analyse op maat van jouw bedrijf.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voordelen.map((v) => (
                <div key={v.titel} className="group bg-[#f2f3f5] p-8 transition-colors hover:bg-white">
                  <div className="mb-6 flex items-center gap-3">
                    <v.Icon className="h-5 w-5 shrink-0 text-[#1f1f1f]" strokeWidth={1.5} />
                    <h3 className="text-base font-bold text-[#1f1f1f]">{v.titel}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#575760]">{v.tekst}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-16 px-6 bg-[#f2f3f5]">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-8">
              Vertrouwd door MKB in Zuid-Limburg
            </p>
            <blockquote
              className="text-xl leading-relaxed text-[#1f1f1f] mb-6"
              style={{ letterSpacing: "-0.3px" }}
            >
              &quot;De quickscan maakte in één oogopslag duidelijk waar we het meeste tijd verspillen.
              Binnen 6 weken hadden we de eerste automatisering live.&quot;
            </blockquote>
            <p className="text-sm text-[#575760]">- Directeur, productiebedrijf Sittard</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-[#f2f3f5]">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 bg-white p-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold text-[#1f1f1f]">Klaar om jouw AI-kansen te ontdekken?</p>
              <p className="text-sm text-[#575760]">3 minuten. Gratis. Geen registratie vereist.</p>
            </div>
            <Link
              href="/quickscan/scan"
              className="shrink-0 rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#3a3a42] hover:shadow-md inline-flex items-center gap-2"
            >
              Start jouw gratis AI-scan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
