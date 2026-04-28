import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Mail,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Collega Makelaar — 24/7 klantvragen & woningomschrijvingen | MAISON BLNDR",
  description:
    "Een AI Collega speciaal voor makelaars in Limburg. Beantwoordt bezoekersvragen over objecten, plant bezichtigingen in en schrijft woningomschrijvingen. Vanaf €249/mnd. Live in 15 minuten.",
  keywords: [
    "AI makelaar Limburg",
    "AI collega makelaardij",
    "automatisering makelaar",
    "AI chatbot makelaar",
    "woningomschrijving generator",
    "makelaar AI software",
    "AI makelaar Maastricht",
    "AI makelaar Sittard",
    "AI makelaar Venlo",
    "digitale medewerker makelaar",
  ],
  alternates: { canonical: "https://maisonblender.com/aicollega/makelaar" },
  openGraph: {
    title: "AI Collega Makelaar — 24/7 klantvragen & woningomschrijvingen",
    description:
      "Speciaal voor makelaars in Limburg. Live in 15 minuten. Vanaf €249/mnd.",
    url: "https://maisonblender.com/aicollega/makelaar",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Collega Makelaar",
  applicationCategory: "BusinessApplication",
  description:
    "AI-aangedreven digitale medewerker voor makelaars. Beantwoordt klantvragen, plant bezichtigingen in en genereert woningomschrijvingen.",
  provider: {
    "@type": "Organization",
    name: "MAISON BLNDR",
    url: "https://maisonblender.com",
  },
  areaServed: [
    { "@type": "State", name: "Limburg" },
    { "@type": "Country", name: "Nederland" },
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Start",
      price: "249",
      priceCurrency: "EUR",
      priceSpecification: { "@type": "RecurringCharge", billingDuration: "P1M" },
    },
  ],
};

const useCases = [
  {
    Icon: MessageSquare,
    titel: "Leads opvangen buiten kantooruren",
    beschrijving:
      "Een nieuwe lead om 22:00? Jouw AI Collega reageert direct, stelt kwalificatievragen en scoort de lead als warm, lauw of koud. Jij ziet het de volgende ochtend in je dashboard.",
    tijdwinst: "3-5 uur/week",
  },
  {
    Icon: Mail,
    titel: "No-shows terugdringen",
    beschrijving:
      "Automatische bevestigingsmails en herinneringen op de dag van de bezichtiging. Na afloop vraagt de AI Collega gestructureerde feedback op — zodat jij weet of er interesse is.",
    tijdwinst: "1-2 uur/week",
  },
  {
    Icon: FileText,
    titel: "Objectomschrijvingen in seconden",
    beschrijving:
      "Vul de kenmerken in, kies je stijl — en krijg drie klaarstaande varianten: Funda, Instagram en opvolgmail. Geen leeg scherm meer.",
    tijdwinst: "2-4 uur/week",
  },
];

const prijzen = [
  {
    naam: "Start",
    prijs: "€ 249",
    periode: "/mnd",
    beschrijving: "Alles om te beginnen",
    features: [
      "AI Collega op jouw website",
      "Beantwoordt klantvragen 24/7",
      "Bezichtigingsaanvragen vastleggen",
      "10 woningomschrijvingen per maand",
      "Maandelijkse leadrapportage",
    ],
    cta: "Start gratis proefperiode",
    href: "/aicollega/makelaar/onboarding",
    primair: false,
  },
  {
    naam: "Plus",
    prijs: "€ 499",
    periode: "/mnd",
    beschrijving: "Voor groeiende kantoren",
    features: [
      "Alles uit Start",
      "Onbeperkt woningomschrijvingen",
      "Social media content (3 posts/week)",
      "Opvolgmails na bezichtiging",
      "WhatsApp-integratie",
      "Wekelijkse leadrapportage",
    ],
    cta: "Start gratis proefperiode",
    href: "/aicollega/makelaar/onboarding",
    primair: true,
  },
  {
    naam: "Kantoor",
    prijs: "€ 899",
    periode: "/mnd",
    beschrijving: "Voor meerdere makelaars",
    features: [
      "Alles uit Plus",
      "Meerdere makelaars onder één dak",
      "Eigen stem (voice-cloning)",
      "CRM-koppeling",
      "Dedicated support",
    ],
    cta: "Plan een gesprek",
    href: "/strategiegesprek",
    primair: false,
  },
];

const stats = [
  { getal: "9–16", eenheid: "uur/week", label: "teruggewonnen per makelaar" },
  { getal: "24/7", eenheid: "", label: "beschikbaar, ook buiten kantooruren" },
  { getal: "15", eenheid: "min", label: "gemiddelde onboarding-tijd" },
];

export default function MakelaarLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            Speciaal voor makelaars in Limburg — live in 15 minuten
          </div>

          <h1
            className="text-[32px] font-normal leading-[1.15] tracking-tight text-[#1f1f1f] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            Leads die buiten kantooruren
            <br />
            <span className="font-exposure">binnenkomen? Nooit meer missen.</span>
          </h1>

          <p className="text-base leading-relaxed text-[#575760] sm:text-lg mb-10 max-w-2xl mx-auto">
            Jouw AI Collega vangt leads op, kwalificeert ze direct (warm / lauw / koud),
            plant bezichtigingen in, stuurt reminders en schrijft je woningomschrijvingen — 24/7,
            in het Nederlands. Geen installatie. Geen technische kennis nodig.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/aicollega/makelaar/demo"
              className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              Probeer de live demo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/aicollega/makelaar/onboarding"
              className="rounded-full border border-[#1f1f1f]/20 bg-white px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:border-[#1f1f1f]/40 hover:shadow inline-flex items-center justify-center gap-2"
            >
              Mijn kantoor aanmelden
            </Link>
          </div>

          <p className="mt-4 text-xs text-[#575760]">
            Geen creditcard nodig · 30 dagen gratis proberen
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6 bg-[#1f1f1f]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#1f1f1f] p-8 text-center">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{s.getal}</span>
                {s.eenheid && <span className="text-lg text-white/60">{s.eenheid}</span>}
              </div>
              <p className="text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-6 bg-white">
        <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent mb-20 -mt-0" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
              Wat de AI Collega voor je doet
            </span>
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[32px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Geen fancy features.
              <br />
              <span className="font-exposure">Gewoon uren terugkrijgen.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {useCases.map((u) => (
              <div key={u.titel} className="bg-[#f2f3f5] p-8">
                <div className="flex items-start gap-4 mb-4">
                  <u.Icon className="h-5 w-5 shrink-0 text-[#1f1f1f] mt-0.5" strokeWidth={1.5} />
                  <h3 className="text-base font-bold text-[#1f1f1f]">{u.titel}</h3>
                </div>
                <p className="text-sm leading-relaxed text-[#575760] mb-6">{u.beschrijving}</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#575760]" strokeWidth={1.5} />
                  <span className="text-xs font-medium text-[#1f1f1f]">{u.tijdwinst} tijdwinst</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section className="py-20 px-6 bg-[#f2f3f5]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-3 block">
              Hoe het werkt
            </span>
            <h2
              className="text-[24px] font-normal leading-tight tracking-tight text-[#1f1f1f] sm:text-[32px]"
              style={{ letterSpacing: "-0.6px" }}
            >
              Van aanmelding tot live in 15 minuten.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/10">
            {[
              {
                nr: "01",
                titel: "Aanmelden",
                tekst: "Vul je kantoorgegevens in, kies je toon en voeg je objecten toe. Duurt 5 minuten.",
              },
              {
                nr: "02",
                titel: "Configureren",
                tekst: "Je AI Collega wordt geconfigureerd op jouw kantoor: naam, objecten, veelgestelde vragen.",
              },
              {
                nr: "03",
                titel: "Live gaan",
                tekst: "Kopieer één script-tag op je website. De AI Collega is direct actief voor je bezoekers.",
              },
            ].map((stap) => (
              <div key={stap.nr} className="bg-[#f2f3f5] p-8">
                <span className="text-xs font-mono text-[#575760]/50 mb-4 block">{stap.nr}</span>
                <h3 className="font-bold text-[#1f1f1f] mb-3">{stap.titel}</h3>
                <p className="text-sm text-[#575760] leading-relaxed">{stap.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-white" id="prijzen">
        <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent mb-20 -mt-0" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-3 block">
              Tarieven
            </span>
            <h2
              className="text-[24px] font-normal leading-tight tracking-tight text-[#1f1f1f] sm:text-[32px]"
              style={{ letterSpacing: "-0.6px" }}
            >
              Transparant geprijsd.
              <br />
              <span className="font-exposure">Geen verborgen kosten.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prijzen.map((p) => (
              <div
                key={p.naam}
                className={`flex flex-col p-8 ${
                  p.primair ? "bg-[#1f1f1f] text-white" : "bg-[#f2f3f5] text-[#1f1f1f]"
                }`}
              >
                <div className="mb-6">
                  <p className={`text-xs font-medium uppercase tracking-widest mb-2 ${p.primair ? "text-white/50" : "text-[#575760]"}`}>
                    {p.naam}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{p.prijs}</span>
                    <span className={`text-sm ${p.primair ? "text-white/50" : "text-[#575760]"}`}>{p.periode}</span>
                  </div>
                  <p className={`text-sm mt-1 ${p.primair ? "text-white/60" : "text-[#575760]"}`}>
                    {p.beschrijving}
                  </p>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle
                        className={`h-4 w-4 shrink-0 mt-0.5 ${p.primair ? "text-white/60" : "text-[#1f1f1f]"}`}
                        strokeWidth={1.5}
                      />
                      <span className={p.primair ? "text-white/80" : "text-[#575760]"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all ${
                    p.primair
                      ? "bg-white text-[#1f1f1f] hover:bg-white/90"
                      : "bg-[#1f1f1f] text-white hover:bg-[#3a3a42]"
                  }`}
                >
                  {p.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#575760] mt-6">
            Alle prijzen exclusief BTW. Na 30 dagen gratis proefperiode automatisch door naar gekozen abonnement.
          </p>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-20 px-6 bg-[#f2f3f5]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1f1f1f] p-10 flex flex-col items-center text-center gap-6">
            <TrendingUp className="h-8 w-8 text-white/40" strokeWidth={1.5} />
            <div>
              <p className="text-2xl font-bold text-white mb-2" style={{ letterSpacing: "-0.4px" }}>
                Overtuig jezelf in 60 seconden.
              </p>
              <p className="text-white/60 text-sm max-w-md">
                Stel de AI Collega een vraag over een woning. Zie hoe hij reageert. Geen registratie nodig.
              </p>
            </div>
            <Link
              href="/aicollega/makelaar/demo"
              className="rounded-full bg-white px-8 py-4 text-sm font-bold text-[#1f1f1f] transition-all hover:bg-white/90 hover:shadow-lg inline-flex items-center gap-2"
            >
              Open de demo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
