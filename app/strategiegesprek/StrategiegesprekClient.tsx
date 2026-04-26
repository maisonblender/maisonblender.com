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
              Gratis · 30 minuten · Geen verplichtingen
            </div>
            <h1
              className="mb-6 text-[28px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[36px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Bespreek wat er speelt.
              <br />
              <span className="font-exposure">30 minuten. Geen verplichtingen.</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-[#575760]">
              We gaan in op jouw processen, bespreken concrete eerste stappen en rekenen de businesscase door.
              Geen verkooppraatje — gewoon een goed gesprek.
            </p>
            <ul className="mb-8 flex flex-col gap-2 text-sm text-[#575760] text-left">
              {[
                "We nemen 2–3 concrete processen met je door die kansen bieden voor automatisering",
                "Je krijgt een eerlijk beeld van wat realistisch is — ook wat niet",
                "We rekenen de verwachte tijdsbesparing en ROI globaal door",
                "Je vertrekt met een concreet eerste-stap advies, ongeacht of je verder gaat",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 bg-black/30" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#1f1f1f] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
            >
              Plan een gesprek
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
