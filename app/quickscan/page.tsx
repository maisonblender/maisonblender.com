import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Zap, Brain, BarChart3, TrendingUp, Map, FileText, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Readiness Intake | MAISON BLNDR - Ontdek jouw AI-kansen",
  description:
    "Gratis AI Readiness Intake van MAISON BLNDR. Ongeveer 10 minuten, 22 vragen over vijf thema's. Je krijgt een score, quick wins met ROI en een kansenkaart per e-mail.",
  alternates: { canonical: "https://maisonblender.com/quickscan" },
  openGraph: {
    title: "AI Readiness Intake | MAISON BLNDR",
    description: "10 minuten. 5 pijlers, 22 gerichte vragen. Directe AI Kansenkaart op maat.",
    url: "https://maisonblender.com/quickscan",
  },
};

const voordelen = [
  { Icon: BarChart3, titel: "Score 0–100", tekst: "Jouw score naast vergelijkbare bedrijven in je sector" },
  { Icon: TrendingUp, titel: "Drie quick wins", tekst: "Met ruwe ROI in euro's op basis van jouw antwoorden" },
  { Icon: Shield, titel: "Privacy & EU AI Act", tekst: "Waar je nu risico loopt en wat je moet regelen" },
  { Icon: Users, titel: "Team & adoptie", tekst: "Of je organisatie klaar is om AI echt te gebruiken" },
  { Icon: Map, titel: "90-dagen plan", tekst: "Concrete vervolgstappen in je inbox" },
  { Icon: Zap, titel: "22 vragen", tekst: "Over jouw bedrijf, niet een generieke enquête" },
  { Icon: Brain, titel: "Live analyse", tekst: "Terwijl je invult, geen standaard PDF" },
  { Icon: FileText, titel: "Kansenkaart", tekst: "Samenvatting per e-mail, met benchmark" },
];

export default function QuickscanPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
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
              Gratis AI Readiness Intake — 5 pijlers, 22 vragen
            </div>

            <h1
              className="text-[32px] font-normal leading-[1.15] tracking-tight text-[#1f1f1f] sm:text-[42px] lg:text-[52px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              Wat levert AI jou
              <br />
              <span className="font-exposure">concreet op?</span>
            </h1>

            <p className="text-base leading-relaxed text-[#575760] sm:text-lg mb-10 max-w-2xl mx-auto">
              22 vragen over vijf thema&apos;s: waar win je tijd, wat kost automatisering, en waar moet je
              op letten qua data, IT en de EU AI Act. Ongeveer tien minuten. Daarna krijg je een
              kansenkaart per e-mail.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quickscan/scan"
                className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                Start de AI Readiness Intake
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-[#575760] self-center">Gratis · Resultaten direct zichtbaar</p>
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
                Geen generieke vragenlijst.
                <br />
                <span className="font-exposure">Een intake die ergens op uitkomt.</span>
              </h2>
              <p className="max-w-xl text-[#575760]">
                Geen rapport met vage aanbevelingen. Je antwoorden worden live verwerkt tot een
                kansenkaart: score, sectorvergelijking, drie quick wins met ROI en een plan voor
                de komende 90 dagen.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {voordelen.map((v) => (
                <div key={v.titel} className="group bg-[#f2f3f5] p-8 transition-colors hover:bg-white">
                  <div className="mb-6 flex items-center gap-3">
                    <v.Icon className="h-5 w-5 shrink-0 text-[#1f1f1f]" strokeWidth={1.5} />
                    <h3 className="text-base font-bold text-[#1f1f1f]">{v.titel}</h3>
                  </div>
                  <p className="leading-relaxed text-[#575760]">{v.tekst}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* De 5 pijlers */}
        <section className="py-20 px-6 bg-[#1f1f1f] text-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-white/50 mb-3 block">De methodiek</span>
              <h2 className="text-[26px] font-normal leading-tight tracking-tight sm:text-[32px]" style={{ letterSpacing: "-0.6px" }}>
                5 pijlers. Integraal beeld.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-px bg-white/10">
              {[
                { nr: "01", titel: "Bedrijfsprofiel", sub: "Sector, omvang, functie & digitale volwassenheid" },
                { nr: "02", titel: "Pijnpunten & urgentie", sub: "Activiteiten, tijdverlies per medewerker, urgentiemeter 1-10" },
                { nr: "03", titel: "Data, systemen & infrastructuur", sub: "Applicaties, datakwaliteit, integratie, IT-infra & gevoelige data" },
                { nr: "04", titel: "Kennis, cultuur & governance", sub: "AI-maturiteit, sentiment, management, training, beleid, EU AI Act, risico" },
                { nr: "05", titel: "AI Ambitie", sub: "Budget en gewenste implementatiesnelheid" },
              ].map((p) => (
                <div key={p.nr} className="bg-[#1f1f1f] p-6 flex flex-col gap-2">
                  <span className="text-xs font-mono text-white/30">{p.nr}</span>
                  <span className="font-semibold text-white">{p.titel}</span>
                  <span className="text-xs text-white/50 leading-relaxed">{p.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-16 px-6 bg-[#f2f3f5]">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-8">
              Vertrouwd door MKB in Limburg
            </p>
            <blockquote
              className="text-xl leading-relaxed text-[#1f1f1f] mb-6"
              style={{ letterSpacing: "-0.3px" }}
            >
              &quot;In één gesprek werd duidelijk waar we tijd verspillen en waar de risico&apos;s zitten.
              Zes weken later stond de eerste automatisering live.&quot;
            </blockquote>
            <p className="text-sm text-[#575760]">— Directeur, productiebedrijf Sittard</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-[#f2f3f5]">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 bg-white p-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold text-[#1f1f1f]">Wil je weten waar de kansen liggen?</p>
              <p className="text-[#575760]">Tien minuten. Gratis. Resultaten direct zichtbaar.</p>
            </div>
            <Link
              href="/quickscan/scan"
              className="shrink-0 rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#3a3a42] hover:shadow-md inline-flex items-center gap-2"
            >
              Start de AI Readiness Intake
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
