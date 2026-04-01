const steps = [
  {
    step: "01",
    title: "Architectuur & Roadmap",
    description:
      "Wij beginnen met een diepgaand strategiegesprek om uw situatie te begrijpen. Vervolgens leveren wij een heldere technische architectuur en implementatie-roadmap.",
  },
  {
    step: "02",
    title: "Prototype & Validatie",
    description:
      "Snel bouwen, snel leren. Binnen weken draait een werkend prototype in uw omgeving, zodat u direct ziet wat AI voor uw organisatie kan betekenen.",
  },
  {
    step: "03",
    title: "Implementatie & Schaling",
    description:
      "Na validatie schalen wij de oplossing naar productie. Robuust, veilig en onderhoudbaar — gebouwd om jaren mee te gaan en mee te groeien.",
  },
];

export default function Process() {
  return (
    <section id="aanpak" className="relative bg-[#0a0e15] px-6 py-32">
      {/* Accent line */}
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#4af0c4]/20 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#4af0c4]">
            Aanpak
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#f0f4ff] sm:text-5xl">
            Van idee naar impact
            <br />
            <span className="text-[#8892a4]">in drie stappen.</span>
          </h2>
        </div>

        <div className="relative flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={step.step} className="group relative flex gap-8 pb-16 last:pb-0">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[19px] top-10 h-full w-px bg-gradient-to-b from-[#4af0c4]/30 to-transparent" />
              )}

              {/* Step number bubble */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4af0c4]/30 bg-[#0a0e15]">
                <span className="font-mono text-xs font-bold text-[#4af0c4]">{step.step}</span>
              </div>

              <div className="flex flex-col gap-3 pt-1.5">
                <h3 className="text-xl font-bold text-[#f0f4ff]">{step.title}</h3>
                <p className="max-w-xl text-[#8892a4] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#4af0c4]/20 to-transparent" />
    </section>
  );
}
