import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kennisbank - AI-gidsen en cases voor Limburgse ondernemers",
  description:
    "Praktische AI-gidsen, cases uit Limburgse bedrijven en how-to's zonder jargon. Gratis toegankelijk via Limburg AI Labs.",
  alternates: { canonical: "https://labs.maisonblender.com/kennisbank" },
};

const posts = [
  {
    tag: "Case study",
    title: "Hoe een Sittardse accountant 8 uur per week bespaart met AI",
    excerpt:
      "Een praktisch inkijkje in hoe factuurverwerking volledig geautomatiseerd werd - inclusief de valkuilen en wat het werkelijk kostte.",
    readTime: "6 min",
    href: "/labs/kennisbank/sittardse-accountant-8-uur-besparen-ai",
  },
  {
    tag: "Gids",
    title: "ChatGPT vs. Claude vs. Gemini: wat kies je als Limburgse ondernemer?",
    excerpt:
      "Geen tech-jargon. Gewoon: welke tool doet wat, voor wie is welke tool geschikt, en wat zijn de echte kosten?",
    readTime: "8 min",
    href: "/labs/kennisbank/chatgpt-vs-claude-vs-gemini",
  },
  {
    tag: "How-to",
    title: "Je eerste AI-prompt schrijven: een stappenplan voor niet-techneuten",
    excerpt:
      "Van blanco pagina naar een prompt die echt werkt. Met voorbeelden voor offertes, e-mails en analyses.",
    readTime: "5 min",
    href: "/labs/kennisbank/eerste-ai-prompt-schrijven",
  },
  {
    tag: "Case study",
    title: "AI in een Maastrichtse zorginstelling: wat werkt en wat (nog) niet",
    excerpt:
      "Een eerlijk verslag van een pilot met AI-ondersteunde intake - de successen, de compliance-uitdagingen en de lessen.",
    readTime: "7 min",
    href: "/labs/kennisbank/ai-maastrichtse-zorginstelling",
  },
  {
    tag: "Achtergrond",
    title: "Wat kost AI automatisering voor een MKB-bedrijf in 2026?",
    excerpt:
      "Een realistische kijk op investering, terugverdientijd en total cost of ownership - op basis van Limburgse praktijkdata.",
    readTime: "6 min",
    href: "/labs/kennisbank/kosten-ai-automatisering-mkb-2026",
  },
  {
    tag: "Gids",
    title: "AVG en AI: wat mag je automatiseren en wat niet?",
    excerpt:
      "De belangrijkste vragen over privacy, dataverwerking en AI - beantwoord voor MKB-ondernemers zonder juridisch jargon.",
    readTime: "9 min",
    href: "/labs/kennisbank/avg-en-ai-automatiseren",
  },
];

export default function KennisbankPage() {
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
            AI-kennis zonder
            <br />
            <span className="font-exposure">jargon.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-xl mx-auto">
            Gidsen, cases en how-to&#39;s voor Limburgse ondernemers die AI willen begrijpen en toepassen.
            Geen technische voorkennis vereist.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="group flex flex-col gap-3 bg-white border border-black/[0.06] p-6 hover:border-[#22c55e]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">{post.tag}</span>
                  <span className="text-xs text-[#b2b2be]">{post.readTime}</span>
                </div>
                <h2 className="text-sm font-semibold text-[#1f1f1f] leading-snug group-hover:text-[#22c55e] transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs leading-relaxed text-[#575760] flex-1">{post.excerpt}</p>
                <span className="text-xs font-medium text-[#22c55e]">Lees verder →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[24px] mb-4"
            style={{ letterSpacing: "-0.5px" }}
          >
            Nieuwe publicaties direct in je inbox?
          </h2>
          <p className="text-sm text-[#575760] mb-6">
            Schrijf je in voor de wekelijkse nieuwsbrief.
          </p>
          <Link
            href="/labs/nieuwsbrief"
            className="inline-block rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42]"
          >
            Schrijf je in →
          </Link>
        </div>
      </section>
    </>
  );
}
