import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nieuwsbrief - Wekelijkse AI-tips voor Limburgse ondernemers",
  description:
    "Schrijf je in voor de Limburg AI Labs nieuwsbrief. Elke week één bruikbare AI-tip, één Limburgse case en één gratis resource. Geen spam.",
  alternates: { canonical: "https://labs.maisonblender.com/nieuwsbrief" },
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
            Elke week één AI-tip
            <br />
            <span className="font-exposure">die je direct kunt gebruiken.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 mb-10 max-w-lg mx-auto">
            Geen spam. Geen hype. Elke week: één bruikbare AI-tip, één Limburgse case en één gratis resource.
            Afmelden kan altijd met één klik.
          </p>

          {/* Newsletter signup form */}
          <div className="bg-white rounded-2xl p-8 text-left">
            <p className="text-sm font-semibold text-[#1f1f1f] mb-1">Schrijf je in</p>
            <p className="text-xs text-[#575760] mb-6">Gratis · Wekelijks · Altijd afmeldbaar</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="jouw@email.nl"
                className="flex-1 rounded-xl border border-black/[0.1] bg-[#f2f3f5] px-4 py-3 text-sm text-[#1f1f1f] placeholder-[#b2b2be] focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#22c55e] px-8 py-3 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg whitespace-nowrap"
              >
                Schrijf me in →
              </button>
            </div>
            <p className="mt-3 text-xs text-[#b2b2be]">
              Door je in te schrijven ga je akkoord met onze privacyverklaring. Je ontvangt maximaal één e-mail per week.
            </p>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[24px] mb-10 text-center"
            style={{ letterSpacing: "-0.5px" }}
          >
            Wat je elke week krijgt
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "AI-tip", description: "Eén concrete tip die je deze week kunt toepassen in jouw bedrijf." },
              { label: "Limburgse case", description: "Hoe een Limburgs bedrijf AI heeft ingezet — en wat het opleverde." },
              { label: "Gratis resource", description: "Een template, prompt of tool die je direct kunt gebruiken." },
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
