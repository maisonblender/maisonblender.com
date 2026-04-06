import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gratis AI Quickscan | MAISON BLNDR - Ontdek jouw AI-kansen",
  description:
    "Doe in 3 minuten de gratis AI Quickscan van MAISON BLNDR. Ontdek jouw AI Readiness Score, ROI-potentieel en top AI-kansen. Direct resultaat, geen e-mail vereist.",
  alternates: { canonical: "https://maisonblender.com/quickscan" },
  openGraph: {
    title: "Gratis AI Quickscan | MAISON BLNDR",
    description: "3 minuten. Echte AI. Gepersonaliseerde resultaten.",
    url: "https://maisonblender.com/quickscan",
  },
};

const voordelen = [
  { icon: "⚡", titel: "3 minuten", tekst: "10 korte vragen over jouw bedrijf en uitdagingen" },
  { icon: "🧠", titel: "Echte AI-analyse", tekst: "Claude analyseert live jouw situatie - geen generiek rapport" },
  { icon: "📊", titel: "AI Readiness Score", tekst: "Jouw score 0-100 + benchmark vs. jouw sector" },
  { icon: "💶", titel: "ROI Berekening", tekst: "Concrete euro-indicaties voor tijds- en kostenbesparing" },
  { icon: "🗺️", titel: "Opportunity Map", tekst: "Visuele heatmap van AI-kansen per bedrijfsfunctie" },
  { icon: "📄", titel: "Gratis Actieplan", tekst: "15-pagina gepersonaliseerd AI Actieplan via e-mail" },
];

export default function QuickscanPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-black text-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live AI-analyse — gratis, zonder registratie</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ontdek jouw
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                AI-kansen in 3 min
              </span>
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              De gratis AI Quickscan analyseert jouw bedrijfsprofiel met echte AI (Claude) en geeft je
              een gepersonaliseerde AI Readiness Score, ROI-berekening en concrete aanbevelingen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quickscan/scan"
                className="bg-white text-black font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/90 transition-colors inline-flex items-center gap-2"
              >
                Start gratis AI-scan
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-white/50 text-sm self-center">Geen e-mail vereist voor resultaten</p>
            </div>
          </div>
        </section>

        {/* Wat je krijgt */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-black">Wat je in 3 minuten krijgt</h2>
            <p className="text-center text-gray-500 mb-12">
              Geen generiek rapport. Echte AI-analyse op maat van jouw bedrijf.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voordelen.map((v) => (
                <div key={v.titel} className="border border-gray-100 rounded-xl p-6 hover:border-gray-300 transition-colors">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-semibold text-lg mb-2 text-black">{v.titel}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.tekst}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-6">Vertrouwd door MKB in Zuid-Limburg</p>
            <blockquote className="text-xl text-gray-800 italic mb-6">
              &quot;De quickscan maakte in één oogopslag duidelijk waar we het meeste tijd verspillen.
              Binnen 6 weken hadden we de eerste automatisering live.&quot;
            </blockquote>
            <p className="text-gray-500 text-sm">— Directeur, productiebedrijf Sittard</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-black text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Klaar om jouw AI-kansen te ontdekken?</h2>
            <p className="text-white/70 mb-8">3 minuten. Gratis. Geen registratie vereist.</p>
            <Link
              href="/quickscan/scan"
              className="bg-white text-black font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/90 transition-colors inline-flex items-center gap-2"
            >
              Start jouw gratis AI-scan
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
