"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Wat kost een AI-agent bouwen?",
    answer:
      "Hangt af van wat het moet doen en waarmee het moet koppelen. Een chatbot voor klantenservice begint rond €3.000. Een groter multi-agent systeem met CRM of ERP kan oplopen tot €25.000 of meer. Start met de gratis AI Readiness Intake: dan weet je waar je staat voordat je ergens aan vastzit.",
  },
  {
    question: "Waar is MAISON BLNDR gevestigd en werken jullie door heel Nederland?",
    answer:
      "Sittard is ons thuisadres. Klanten hebben we door heel Nederland. Je praat met hetzelfde team dat je systemen kent, niet met een wisselende consultant of een callcenter.",
  },
  {
    question: "Wat is het verschil tussen een AI-agent en gewone automatisering?",
    answer:
      "Klassieke automatisering: vaste regels. Als dit, dan dat. Een AI-agent kan een e-mail of document lezen, de context snappen en zelf kiezen wat de volgende stap is. Handig bij werk dat te wisselend is voor een simpel script, maar te veel is om handmatig te blijven doen.",
  },
  {
    question: "Hoe lang duurt een AI-implementatie gemiddeld?",
    answer:
      "Een chatbot of workflow: vaak 2 tot 4 weken live. Grotere portalen of multi-agent setups: 6 tot 12 weken. Na de intake krijg je een plan met mijlpalen en data, geen \"ergens tussen de 2 en 8 weken\".",
  },
  {
    question: "Werken jullie met OpenAI of Claude (Anthropic)?",
    answer:
      "Beide, en ook Gemini of open-source waar dat past. We verkopen geen enkel merk model. Je data blijft van jou; privacy en compliance stellen we per project in.",
  },
  {
    question: "Kan AI mijn bestaande software koppelen?",
    answer:
      "Meestal wel. Exact, SAP, Salesforce, HubSpot, Microsoft 365, Google Workspace en meer. Geen API? Dan kijken we naar RPA. Je hoeft je huidige stack niet weg te gooien.",
  },
  {
    question: "Moet ik technische kennis hebben om met jullie te werken?",
    answer:
      "Nee. Jij vertelt wat er misgaat of wat je wilt bereiken. Wij bouwen iets dat je team ook echt gebruikt. Geen jargon-show.",
  },
  {
    question: "Wat is een gratis AI Impact Scan?",
    answer:
      "De AI Readiness Intake op de site: ongeveer 10 minuten, 22 vragen. Je krijgt een score, sectorvergelijking en concrete quick wins. Gratis, geen verplichting. Voor een diepere sessie van een uur op locatie of online kun je ook een strategiegesprek plannen.",
  },
  {
    question: "Blijven jullie betrokken na de lancering?",
    answer:
      "Ja. Live zetten is het begin. We monitoren, passen aan als je processen veranderen en houden de koppelingen gezond. AI wordt beter met gebruik; wij zorgen dat dat ook bij jou gebeurt.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-white px-6 py-20 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
            Veelgestelde vragen
          </span>
          <h2
            className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
            style={{ letterSpacing: "-0.95px" }}
          >
            Geen vaagheid.
            <br />
            <span className="font-exposure">Concrete antwoorden.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-black/[0.08]">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
                aria-expanded={openIndex === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span className="text-base font-semibold text-[#1f1f1f] leading-snug">
                  {faq.question}
                </span>
                <span
                  className="mt-0.5 shrink-0 text-[#575760] transition-transform duration-200"
                  style={{ transform: openIndex === i ? "rotate(45deg)" : "none" }}
                >
                  +
                </span>
              </button>
              <div id={`faq-panel-${i}`} role="region" hidden={openIndex !== i}>
                {openIndex === i && (
                  <p className="pb-6 text-sm leading-relaxed text-[#575760] sm:text-base">{faq.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
