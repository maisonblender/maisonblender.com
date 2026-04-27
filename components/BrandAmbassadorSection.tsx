"use client";

/**
 * BrandAmbassadorSection — teaser op de homepage.
 *
 * Anders dan de oude statische chat-mockup:
 *   - Toont de Liquid Presence live (zelfs op de homepage)
 *   - Framing: "geen chatbox, een aanwezigheid"
 *   - CTA's naar /brand-ambassador voor de volledige demo
 *
 * We gebruiken next/dynamic voor de canvas-component zodat de homepage SSR
 * niet op canvas-init wacht.
 */

import Link from "next/link";
import dynamic from "next/dynamic";

const AmbassadorPresence = dynamic(() => import("./BrandAmbassador/AmbassadorPresence"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-[280px] rounded-full bg-white/5" aria-hidden="true" />
  ),
});

export default function BrandAmbassadorSection() {
  return (
    <section
      id="brand-ambassador"
      className="relative overflow-hidden bg-[#0b0b0d] px-6 py-20 text-white lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(74,240,196,0.15), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual — living presence */}
          <div className="order-2 flex items-center justify-center lg:order-1">
            <div className="relative flex flex-col items-center gap-5">
              <AmbassadorPresence state="idle" hue={160} size={300} />
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                <span className="rounded-full border border-white/15 px-3 py-1">Liquid presence</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Voice-ready</span>
                <span className="rounded-full border border-[#4af0c4]/40 bg-[#4af0c4]/10 px-3 py-1 text-[#4af0c4]">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <div className="inline-flex w-fit items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#4af0c4]" />
              Nieuw · anders dan elke chatbot
            </div>

            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-white sm:text-[29px] lg:text-[32px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Elke website heeft een chatbox.
              <br />
              <span className="font-exposure">Jouw merk verdient een Ambassador.</span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-white/65">
              Geen bolletje rechtsonder. Een Brand Presence die ademt, spreekt en luistert — met
              de stem van jouw merk. Voice-ready, met een &quot;imagine this is yours&quot;-modus
              die ter plekke transformeert naar jouw bedrijfsnaam. De Ambassador die als product
              aanvoelt, niet als widget.
            </p>

            <ul className="flex flex-col gap-3 text-sm text-white/65">
              {[
                "Geen chatbox-icoontje — een levende vorm die zichtbaar luistert, denkt en antwoordt",
                "Imagine-this-is-yours: transformeer UI live naar jouw merk",
                "Voice-mode via Web Speech API — audio blijft in de browser",
                "Conversationele leadcapture — geen formulieren, wel gekwalificeerde leads",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#4af0c4]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/brand-ambassador#demo"
                className="inline-flex items-center justify-center rounded-full bg-[#4af0c4] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#7cf5d3] hover:shadow-lg"
              >
                Praat met de Ambassador →
              </Link>
              <a
                href="/strategiegesprek"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
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
