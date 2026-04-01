export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#4af0c4 1px, transparent 1px), linear-gradient(to right, #4af0c4 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4af0c4]/5 blur-3xl" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#4af0c4]/20 bg-[#4af0c4]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#4af0c4]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4af0c4] animate-pulse" />
          AI-frontrunner · Zuid-Limburg
        </div>

        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-[#f0f4ff] sm:text-7xl">
          Intelligente groei.
          <br />
          <span className="text-[#4af0c4]">Gedreven door AI.</span>
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-[#8892a4]">
          Maison Blender bouwt custom AI-agents en intelligente automatisering voor ambitieuze
          bedrijven in Zuid-Limburg en daarbuiten. Bespaar 40+ uur per week en schaal zonder
          proportionele groei in headcount.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="#contact"
            className="rounded-full bg-[#4af0c4] px-8 py-4 text-sm font-semibold text-[#080b10] transition-all hover:bg-[#6af5d4] hover:shadow-[0_0_40px_rgba(74,240,196,0.3)]"
          >
            Plan een strategiegesprek
          </a>
          <a
            href="#diensten"
            className="rounded-full border border-white/10 px-8 py-4 text-sm font-medium text-[#f0f4ff] transition-all hover:border-white/20 hover:bg-white/5"
          >
            Bekijk onze diensten
          </a>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-8 border-t border-white/5 pt-8 text-center">
          {[
            { value: "40+", label: "uur bespaard per week" },
            { value: "100%", label: "maatwerk oplossingen" },
            { value: "#1", label: "AI-bureau in Z-Limburg" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-3xl font-black text-[#4af0c4]">{stat.value}</span>
              <span className="text-xs text-[#8892a4]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-[#8892a4]">
        <span>Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-[#8892a4] to-transparent" />
      </div>
    </section>
  );
}
