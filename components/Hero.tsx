export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #b2b2be 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft teal glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4af0c4]/10 blur-3xl" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0a7a5c]/20 bg-[#0a7a5c]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#0a7a5c]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4af0c4] animate-pulse" />
          AI-frontrunner · Zuid-Limburg
        </div>

        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-[#1f1f1f] sm:text-7xl" style={{ letterSpacing: "-0.95px" }}>
          Intelligente groei.
          <br />
          <span className="font-exposure text-[#4af0c4]">Gedreven door AI.</span>
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-[#575760]">
          Maison Blender bouwt custom AI-agents en intelligente automatisering voor ambitieuze
          bedrijven in Zuid-Limburg en daarbuiten. Bespaar 40+ uur per week en schaal zonder
          proportionele groei in headcount.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="#contact"
            className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
          >
            Plan een strategiegesprek
          </a>
          <a
            href="#diensten"
            className="rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-medium text-[#1f1f1f] transition-all hover:border-black/20 hover:bg-[#f2f3f5]"
          >
            Bekijk onze diensten
          </a>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-8 border-t border-black/[0.06] pt-8 text-center">
          {[
            { value: "40+", label: "uur bespaard per week" },
            { value: "100%", label: "maatwerk oplossingen" },
            { value: "#1", label: "AI-bureau in Z-Limburg" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-exposure text-3xl font-black text-[#0a7a5c]">{stat.value}</span>
              <span className="text-xs text-[#575760]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-[#b2b2be]">
        <span>Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-[#b2b2be] to-transparent" />
      </div>
    </section>
  );
}
