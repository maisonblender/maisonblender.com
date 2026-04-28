import type { Metadata } from "next";
import Link from "next/link";
import DemoChat from "./DemoChat";

export const metadata: Metadata = {
  title: "Live demo — AI Collega Makelaar | MAISON BLNDR",
  description:
    "Stel de AI Collega een vraag over een woning en zie hoe hij reageert. Geen registratie nodig.",
  alternates: { canonical: "https://maisonblender.com/aicollega/makelaar/demo" },
  robots: { index: false, follow: true },
};

export default function DemoPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f2f3f5]">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/aicollega/makelaar"
            className="inline-flex items-center gap-2 text-sm text-[#575760] hover:text-[#1f1f1f] transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Terug
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 border border-black/10 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760]">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live demo — Makelaardij Van den Berg, Sittard
            </div>
          </div>

          <h1
            className="text-[28px] font-normal leading-tight text-[#1f1f1f] mb-3"
            style={{ letterSpacing: "-0.6px" }}
          >
            Gesprek met de AI Collega
          </h1>
          <p className="text-[#575760] text-sm max-w-xl">
            Dit is een echte AI Collega geconfigureerd voor een demo-makelaarskantoor in Sittard.
            Stel een vraag over een van de objecten, het biedproces of een bezichtiging.
          </p>
        </div>

        {/* Chat + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <DemoChat
              tenantId="demo-makelaar-01"
              branche="makelaar"
            />
          </div>

          {/* Sidebar: demo objecten */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-4">
                Objecten in demo
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    adres: "Wilhelminastraat 14",
                    stad: "Sittard",
                    type: "Vrijstaand",
                    prijs: "€ 425.000",
                    status: "beschikbaar",
                  },
                  {
                    adres: "Mgr. Buckxstraat 8",
                    stad: "Geleen",
                    type: "Appartement",
                    prijs: "€ 195.000",
                    status: "beschikbaar",
                  },
                  {
                    adres: "Parallelweg 33",
                    stad: "Beek",
                    type: "Rijtjeshuis",
                    prijs: "€ 310.000",
                    status: "verkocht",
                  },
                ].map((obj) => (
                  <div key={obj.adres} className="border-b border-black/5 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-[#1f1f1f]">{obj.adres}</p>
                    <p className="text-xs text-[#575760]">{obj.stad} · {obj.type}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-[#1f1f1f]">{obj.prijs}</span>
                      <span className={`text-xs ${obj.status === "beschikbaar" ? "text-green-600" : "text-[#575760]"}`}>
                        {obj.status === "beschikbaar" ? "Beschikbaar" : "Verkocht"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1f1f1f] p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-white/50 mb-3">
                Dit werkt voor jouw kantoor
              </p>
              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                Geconfigureerd met jouw objecten, FAQ en tone of voice. Live in 15 minuten.
              </p>
              <Link
                href="/aicollega/makelaar/onboarding"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80 transition-colors"
              >
                Mijn kantoor aanmelden
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
