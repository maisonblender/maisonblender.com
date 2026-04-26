"use client";

import { useState } from "react";
import SiteImage from "@/components/SiteImage";
import StrategiegesprekModal from "@/components/StrategiegesprekModal";

export default function HeroWithTriage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-center lg:pt-28">
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle, #b2b2be 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 md:text-left lg:gap-16">
          {/* Text column */}
          <div className="flex flex-1 flex-col items-center gap-6 md:items-start">
            <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760]">
              Van strategie naar productie · Custom AI
            </div>

            <h1 className="text-[28px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[35px] lg:text-[32px]" style={{ letterSpacing: "-0.95px" }}>
              Geen pilots. Geen proof-of-concepts.
              <br />
              <span className="font-exposure">Jouw processen geautomatiseerd — live binnen vier weken.</span>
            </h1>

            <p id="hero-description" className="max-w-xl text-base leading-relaxed text-[#575760] sm:text-lg">
              Facturen verwerken, klantvragen beantwoorden, leads opvolgen: wij bouwen de AI-agents
              die dat overnemen. We beginnen bij jouw workflows, niet bij een template. Binnen vier
              weken staat er iets wat echt werkt.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              >
                Plan een strategiegesprek
              </button>
              <a
                href="/quickscan"
                className="rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-medium text-[#1f1f1f] transition-all hover:border-black/20 hover:bg-[#f2f3f5]"
              >
                Start AI Impact Scan →
              </a>
            </div>

            <div className="border-t border-black/[0.06] pt-6">
              <p className="text-xs leading-relaxed text-[#575760]">
                <span className="font-semibold text-[#1f1f1f]">Bekend van Applemooz?</span>{" "}
                Applemooz.nl is gerebrand naar MAISON BLNDR. We bouwen nog steeds websites en
                e-commerce platforms — aangevuld met AI-automatisering en agents.{" "}
                <a href="/studio" className="underline underline-offset-2 hover:text-[#1f1f1f] transition-colors">
                  Lees meer over ons →
                </a>
              </p>
            </div>

          </div>

          {/* Visual column */}
          <div className="w-full max-w-sm md:max-w-none md:w-[280px] md:shrink-0 lg:w-[420px]">
            <SiteImage
              src="/images/hero-visual.png"
              alt="AI agent netwerk illustratie"
              className="object-cover w-full"
            />
          </div>
        </div>
      </section>

      <StrategiegesprekModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
