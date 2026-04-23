import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Webinars over AI voor Limburgse ondernemers",
  description:
    "Gratis live webinars en terugkijkarchief over AI voor het MKB. Praktisch, zonder jargon, voor ondernemers in Zuid-Limburg. Aanmelden voor de volgende editie.",
  alternates: { canonical: "https://maisonblender.com/labs/webinar" },
};

const upcoming = {
  title: "AI in de praktijk: van quickscan tot live systeem",
  date: "22 mei 2026",
  time: "19:00 - 20:30",
  description:
    "In 90 minuten laten we zien hoe een Limburgse ondernemer van nul naar een werkend AI-systeem gaat. Live demo's, Q&A en praktische takeaways.",
  topics: [
    "Welke processen lenen zich het best voor AI-automatisering?",
    "Live demo: factuurverwerking in Exact Online automatiseren",
    "Kosten en tijdlijn: wat is realistisch voor MKB?",
    "Q&A met de engineers van MAISON BLNDR",
  ],
};

const archive = [
  {
    title: "AI in de zorg: wat mag, wat kan en waar begin je?",
    date: "12 maart 2026",
    attendees: "140 aanmeldingen",
    description: "Wat zijn de mogelijkheden van AI in een zorgcontext? Compliance, AVG en praktische toepassingen.",
  },
  {
    title: "ChatGPT voor je bedrijf: wat werkt en wat niet",
    date: "18 februari 2026",
    attendees: "98 aanmeldingen",
    description: "Een eerlijk overzicht van wat je met ChatGPT kunt bereiken als MKB-ondernemer, en wat de grenzen zijn.",
  },
];

export default function WebinarPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1f1f1f] px-6 py-24 text-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[44px] mb-4"
            style={{ letterSpacing: "-0.95px" }}
          >
            Gratis webinars over
            <br />
            <span className="font-exposure">AI voor het MKB.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-xl mx-auto">
            Praktisch, zonder jargon, voor ondernemers in Zuid-Limburg die AI willen begrijpen en toepassen.
          </p>
        </div>
      </section>

      {/* Upcoming webinar */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#22c55e] mb-4">Volgende editie</p>
          <div className="border border-[#22c55e]/30 bg-[#f2f3f5] p-8 lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-16 lg:items-start">
              <div className="flex-1">
                <h2
                  className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[24px] mb-3"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  <span className="font-exposure">{upcoming.title}</span>
                </h2>
                <div className="flex gap-4 text-sm text-[#575760] mb-4">
                  <span>{upcoming.date}</span>
                  <span>·</span>
                  <span>{upcoming.time}</span>
                </div>
                <p className="text-sm leading-relaxed text-[#575760] mb-6">{upcoming.description}</p>
                <ul className="flex flex-col gap-2">
                  {upcoming.topics.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-[#575760]">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#22c55e] shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0">
                <Link
                  href="/labs/nieuwsbrief"
                  className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg whitespace-nowrap"
                >
                  Meld je aan →
                </Link>
                <p className="mt-3 text-xs text-center text-[#b2b2be]">Gratis · Online · Max. 100 plekken</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archive */}
      <section className="px-6 py-20 bg-[#f2f3f5]">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-8">Archief</p>
          <div className="flex flex-col gap-4">
            {archive.map((webinar) => (
              <div key={webinar.title} className="bg-white border border-black/[0.06] p-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#b2b2be]">{webinar.date} · {webinar.attendees}</span>
                  <h3 className="text-sm font-semibold text-[#1f1f1f]">{webinar.title}</h3>
                  <p className="text-xs leading-relaxed text-[#575760]">{webinar.description}</p>
                </div>
                <span className="text-xs text-[#b2b2be] whitespace-nowrap shrink-0 mt-1">Opname beschikbaar</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-[#575760] mb-4">Mis geen enkele editie</p>
          <Link
            href="/labs/nieuwsbrief"
            className="inline-block rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42]"
          >
            Schrijf je in voor de nieuwsbrief →
          </Link>
        </div>
      </section>
    </>
  );
}
