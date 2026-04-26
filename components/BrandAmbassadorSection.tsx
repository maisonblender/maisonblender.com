import Link from "next/link";

export default function BrandAmbassadorSection() {
  return (
    <section id="brand-ambassador" className="relative bg-[#1f1f1f] px-6 py-20 lg:py-32 overflow-hidden text-white">
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Visual column - left */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
              {/* Mock chat widget preview */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/[0.06]">
                <div className="h-9 w-9 rounded-full bg-[#1f1f1f] flex items-center justify-center">
                  <span className="text-white text-xs font-medium">MB</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f1f1f]">MAISON BLNDR Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                    <span className="text-xs text-[#575760]">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#f2f3f5] px-4 py-2.5">
                  <p className="text-sm text-[#1f1f1f]">Goedemorgen! Hoe kan ik je helpen?</p>
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#1f1f1f] px-4 py-2.5">
                  <p className="text-sm text-white">Wat kost een AI-agent voor mijn bedrijf?</p>
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#f2f3f5] px-4 py-2.5">
                  <p className="text-sm text-[#1f1f1f]">Dat hangt van je situatie af. Vertel me: hoeveel herhalende vragen handelt je team nu per dag af?</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f2f3f5] px-3 py-2.5">
                <span className="flex-1 text-sm text-[#b2b2be]">Stel een vraag...</span>
                <div className="h-6 w-6 rounded-full bg-[#22c55e] flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Text column - right */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <div className="inline-flex w-fit items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
              Nieuw · 24/7 beschikbaar
            </div>

            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-white sm:text-[29px] lg:text-[26px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Je merk heeft een stem.
              <br />
              <span className="font-exposure">Die mag 24/7 beschikbaar zijn.</span>
            </h2>

            <p className="text-base leading-relaxed text-white/60 max-w-lg">
              Een AI Brand Ambassador spreekt met de stem van jouw merk — productkennis,
              tone-of-voice en commerciële instelling inbegrepen. Via je website, WhatsApp of
              Teams. Dag en nacht, zonder dat je daarvoor extra personeel nodig hebt.
            </p>

            <ul className="flex flex-col gap-3 text-sm text-white/60">
              {[
                "Getraind op jouw producten, diensten en tone-of-voice",
                "Live demo: ervaar onze eigen Brand Ambassador",
                "Integratie via web, WhatsApp en Microsoft Teams",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/brand-ambassador"
                className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg text-center"
              >
                Bekijk AI Brand Ambassador →
              </Link>
              <a
                href="/strategiegesprek"
                className="inline-block rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-medium text-white/70 transition-all hover:border-white/40 hover:text-white text-center"
              >
                Vraag een demo aan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
