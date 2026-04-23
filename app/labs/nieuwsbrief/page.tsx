import type { Metadata } from "next";
import NewsletterForm from "./NewsletterForm";

export const metadata: Metadata = {
  title: "Nieuwsbrief - Maandelijkse AI-update voor Limburgse ondernemers",
  description:
    "Schrijf je in voor de Limburg AI Labs nieuwsbrief. Elke maand één concreet inzicht, één gratis tool en één voorbeeld uit de regio. Geen spam.",
  alternates: { canonical: "https://maisonblender.com/labs/nieuwsbrief" },
};

export default function NieuwsbriefPage() {
  return (
    <>
      <section className="relative bg-[#1f1f1f] px-6 py-28 text-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[44px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            Maandelijks een AI-update
            <br />
            <span className="font-exposure">die de moeite waard is.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 mb-10 max-w-lg mx-auto">
            Geen nieuwsbrief over de toekomst van AI. Wel: één concreet inzicht, één gratis tool en één voorbeeld uit de regio. Elke maand. Afmelden kan altijd.
          </p>

          <NewsletterForm />
        </div>
      </section>

      {/* What to expect */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[24px] mb-10 text-center"
            style={{ letterSpacing: "-0.5px" }}
          >
            Wat je elke maand krijgt
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Concreet inzicht", description: "Eén AI-toepassing uitgelegd zonder jargon - wat het is, wat het kost, wat het oplevert." },
              { label: "Voorbeeld uit de regio", description: "Hoe een Limburgs bedrijf AI heeft ingezet - en wat het opleverde." },
              { label: "Gratis tool", description: "Een template, prompt of tool die je direct kunt gebruiken." },
            ].map((item) => (
              <div key={item.label} className="border border-black/[0.06] bg-[#f2f3f5] p-6 text-center">
                <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e] block mb-3">{item.label}</span>
                <p className="text-sm leading-relaxed text-[#575760]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
