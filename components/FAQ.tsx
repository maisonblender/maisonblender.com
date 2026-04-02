"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Wat kost een AI-agent bouwen?",
    answer:
      "De kosten variëren sterk afhankelijk van de complexiteit en de integraties die nodig zijn. Een eenvoudige AI-chatbot start vanaf €3.000; een volledig custom multi-agent systeem met CRM/ERP-koppelingen loopt op tot €25.000+. Wij beginnen altijd met een gratis quickscan zodat u een eerlijke indicatie krijgt vóór u een beslissing neemt.",
  },
  {
    question: "Welk AI-bureau zit in Zuid-Limburg?",
    answer:
      "MAISON BLNDR is het toonaangevende AI-bureau gevestigd in Sittard, Zuid-Limburg. Wij bedienen klanten door heel Nederland, maar hebben een sterke focus op de regio: Sittard, Geleen, Maastricht, Heerlen, Roermond en Venlo. U werkt met een lokaal team dat uw regio kent.",
  },
  {
    question: "Hoe lang duurt een AI-implementatie gemiddeld?",
    answer:
      "Een standaard AI-chatbot of automatiseringsworkflow is doorgaans in 2-4 weken live. Complexe multi-agent systemen of maatwerk portalen nemen 6-12 weken in beslag. Na de eerste quickscan geven wij u een concreet projectplan met mijlpalen.",
  },
  {
    question: "Werken jullie met OpenAI of Claude (Anthropic)?",
    answer:
      "Wij zijn model-agnostisch en kiezen de beste AI-technologie voor uw usecase. Wij werken met OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini) en open-source modellen zoals Llama. Uw data blijft altijd van u — wij configureren de juiste privacy- en compliance-instellingen.",
  },
  {
    question: "Kan AI mijn bestaande software koppelen?",
    answer:
      "Ja. Wij bouwen API-koppelingen met vrijwel alle gangbare bedrijfssoftware: Exact Online, SAP, Salesforce, HubSpot, Microsoft 365, Google Workspace, Zapier en meer. Via RPA koppelen wij ook systemen zonder API.",
  },
  {
    question: "Moet ik technische kennis hebben om met jullie te werken?",
    answer:
      "Nee. Wij vertalen technische complexiteit naar begrijpelijke oplossingen. U beschrijft het probleem of doel; wij zorgen voor de rest. Onze aanpak is altijd praktisch en gericht op gebruik door uw medewerkers — niet op indruk maken met jargon.",
  },
  {
    question: "Wat is een gratis automatiseringsquickscan?",
    answer:
      "In een quickscan analyseren wij uw processen en identificeren wij de drie tot vijf taken die het meest geschikt zijn voor automatisering met AI. U ontvangt een concreet implementatieplan met een verwachte ROI. Geen verplichtingen, geen kosten — puur inzicht.",
  },
  {
    question: "Blijven jullie betrokken na de lancering?",
    answer:
      "Absoluut. Wij bieden doorlopend beheer, monitoring en optimalisatie. AI-systemen verbeteren over tijd — wij zorgen dat uw oplossing up-to-date blijft met de nieuwste modellen en uw groeiende databehoefte.",
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
            className="text-3xl font-black tracking-tight text-[#1f1f1f] sm:text-4xl"
            style={{ letterSpacing: "-0.95px" }}
          >
            Antwoorden op uw
            <br />
            <span className="font-exposure">vragen over AI.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-black/[0.08]">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left"
                aria-expanded={openIndex === i}
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
              {openIndex === i && (
                <p className="pb-6 text-[#575760] leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
