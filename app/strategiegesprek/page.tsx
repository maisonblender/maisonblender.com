"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StrategiegesprekModal from "@/components/StrategiegesprekModal";

export default function StrategiegesprekPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-open the triage modal when the page loads
  useEffect(() => {
    const timer = setTimeout(() => setModalOpen(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Nav />
      <StrategiegesprekModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: "radial-gradient(circle, #b2b2be 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760] mb-8">
              Gratis - 30 minuten
            </div>
            <h1
              className="text-[28px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[36px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              Plan een gratis
              <br />
              <span className="font-exposure">strategiegesprek.</span>
            </h1>
            <p className="text-base leading-relaxed text-[#575760] mb-8">
              In 30 minuten bespreken we jouw AI-kansen, stellen we concrete eerste stappen voor
              en rekenen we de businesscase door - zonder verplichtingen.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
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
