import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Limburg AI Labs - AI kennis voor Zuid-Limburg",
  description:
    "Limburg AI Labs deelt praktische AI-kennis met Limburgse ondernemers. Gratis webinars, tools, cases en een kennisbank. Een initiatief van MAISON BLNDR.",
  alternates: { canonical: "https://labs.maisonblender.com" },
};

const tools = [
  {
    title: "AI Readiness Check",
    description: "5 vragen om te bepalen hoe klaar jouw bedrijf is voor AI-automatisering.",
    href: "https://maisonblender.com/quickscan",
    label: "Doe de check →",
  },
  {
    title: "Prompt Starter Kit",
    description: "10 direct inzetbare prompts voor MKB-ondernemers. Voor offertes, e-mails en analyses.",
    href: "#",
    label: "Download gratis →",
  },
  {
    title: "AI Tools Vergelijker",
    description: "Welke AI-tool past bij welk probleem? Overzicht voor niet-technische ondernemers.",
    href: "#",
    label: "Bekijk het overzicht →",
  },
];

const latestPosts = [
  {
    tag: "Case study",
    title: "Hoe een Sittardse accountant 8 uur per week bespaart met AI",
    excerpt: "Een praktisch inkijkje in hoe factuurverwerking volledig geautomatiseerd werd - inclusief de valkuilen.",
    href: "/labs/kennisbank/sittardse-accountant-8-uur-besparen-ai",
  },
  {
    tag: "Gids",
    title: "ChatGPT vs. Claude vs. Gemini: wat kies je als Limburgse ondernemer?",
    excerpt: "Geen tech-jargon. Gewoon: welke tool doet wat, en voor wie.",
    href: "/labs/kennisbank/chatgpt-vs-claude-vs-gemini",
  },
  {
    tag: "Webinar terugkijken",
    title: "AI in de zorg: wat mag, wat kan en waar begin je?",
    excerpt: "Terugblik op onze eerste webinar met 140 aanmeldingen. Nu gratis te bekijken.",
    href: "/labs/webinar",
  },
];

export default function LabsHomePage() {
  return (
    <>
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
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            Gratis AI-kennis voor Limburg
          </div>
          <h1
            className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[52px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            AI kennis voor
            <br />
            <span className="font-exposure">Zuid-Limburg.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 sm:text-lg mb-10 max-w-2xl mx-auto">
            Limburg AI Labs deelt praktische kennis over AI met Limburgse ondernemers.
            Geen hype, geen jargon - gewoon wat werkt en hoe je het toepast in jouw bedrijf.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Link
              href="/labs/webinar"
              className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg"
            >
              Bekijk de webinars →
            </Link>
            <Link
              href="/labs/nieuwsbrief"
              className="inline-block rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
            >
              Schrijf je in voor de nieuwsbrief
            </Link>
          </div>
        </div>
      </section>

      {/* Gratis tools */}
      <section className="px-6 py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-3">AI Gereedschapskist</p>
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Gratis tools voor
              <br />
              <span className="font-exposure">Limburgse ondernemers.</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.title} className="flex flex-col gap-4 border border-black/[0.06] bg-[#f2f3f5] p-6">
                <h3 className="text-sm font-semibold text-[#1f1f1f]">{tool.title}</h3>
                <p className="text-sm leading-relaxed text-[#575760] flex-1">{tool.description}</p>
                <Link
                  href={tool.href}
                  className="text-sm font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors"
                >
                  {tool.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from kennisbank */}
      <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-3">Kennisbank</p>
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Laatste
                <br />
                <span className="font-exposure">publicaties.</span>
              </h2>
            </div>
            <Link
              href="/labs/kennisbank"
              className="hidden sm:block text-sm text-[#575760] hover:text-[#1f1f1f] transition-colors"
            >
              Alles bekijken →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="group flex flex-col gap-3 bg-white border border-black/[0.06] p-6 hover:border-[#22c55e]/40 transition-colors"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">{post.tag}</span>
                <h3 className="text-sm font-semibold text-[#1f1f1f] leading-snug group-hover:text-[#22c55e] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#575760]">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px] mb-4"
            style={{ letterSpacing: "-0.95px" }}
          >
            Maandelijks een AI-update
            <br />
            <span className="font-exposure">die de moeite waard is.</span>
          </h2>
          <p className="text-base leading-relaxed text-[#575760] mb-8 max-w-xl mx-auto">
            Geen nieuwsbrief over de toekomst van AI. Wel: één concreet inzicht, één gratis tool en één voorbeeld uit de regio. Elke maand. Afmelden kan altijd.
          </p>
          <Link
            href="/labs/nieuwsbrief"
            className="inline-block rounded-full bg-[#1f1f1f] px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
          >
            Schrijf je in →
          </Link>
        </div>
      </section>
    </>
  );
}
