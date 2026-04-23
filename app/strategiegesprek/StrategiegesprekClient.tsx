"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StrategiegesprekModal from "@/components/StrategiegesprekModal";

export default function StrategiegesprekClient() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Nav />
      <StrategiegesprekModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: "radial-gradient(circle, var(--decoration) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760]">
              Gratis - 30 minuten
            </div>
            <h1
              className="mb-6 text-[28px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[36px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Plan een gratis
              <br />
              <span className="font-exposure">strategiegesprek.</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-[#575760]">
              In 30 minuten bespreken we jouw AI-kansen, stellen we concrete eerste stappen voor en rekenen we de businesscase
              door - zonder verplichtingen.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
            >
              Start het gesprek
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
