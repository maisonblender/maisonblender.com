"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Wat kost een AI-agent bouwen?",
    answer:
      "Dat hangt af van de complexiteit en de koppelingen die nodig zijn. Een AI-chatbot voor klantenservice start vanaf €3.000; een volledig custom multi-agent systeem met CRM/ERP-integratie loopt op tot €25.000+. Wij beginnen altijd met een gratis quickscan zodat je een eerlijke indicatie krijgt vóór je ook maar één euro uitgeeft.",
  },
  {
    question: "Waar is MAISON BLNDR gevestigd en werken jullie door heel Nederland?",
    answer:
      "MAISON BLNDR is gevestigd in Sittard en actief door heel Nederland. Wij werken voor bedrijven in alle sectoren en regio's - zonder reiskosten of wisselende consultants. Je krijgt een vast team dat jouw systemen kent en jouw processen begrijpt.",
  },
  {
    question: "Wat is het verschil tussen een AI-agent en gewone automatisering?",
    answer:
      "Gewone automatisering volgt vaste regels: als X dan Y. Een AI-agent denkt mee. Hij leest een document, begrijpt de context, neemt een beslissing en voert een actie uit - zonder dat elke situatie vooraf is geprogrammeerd. Dat maakt AI-agents geschikt voor taken die te complex zijn voor traditionele automatisering, maar te tijdrovend voor mensen.",
  },
  {
    question: "Hoe lang duurt een AI-implementatie gemiddeld?",
    answer:
      "Een AI-chatbot of automatiseringsworkflow is doorgaans in 2-4 weken live. Complexe multi-agent systemen of maatwerk portalen nemen 6-12 weken in beslag. Na de quickscan krijg je een concreet projectplan met mijlpalen en een realistisch tijdpad - geen vage schattingen.",
  },
  {
    question: "Werken jullie met OpenAI of Claude (Anthropic)?",
    answer:
      "Wij kiezen de beste technologie voor jouw specifieke usecase. Dat betekent in de praktijk: OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini) en waar relevant open-source modellen zoals Llama. Wij zijn niet gebonden aan één leverancier. Je data blijft altijd van jou - wij configureren de juiste privacy- en compliance-instellingen per situatie.",
  },
  {
    question: "Kan AI mijn bestaande software koppelen?",
    answer:
      "Ja. Wij bouwen koppelingen met vrijwel alle gangbare bedrijfssoftware: Exact Online, SAP, Salesforce, HubSpot, Microsoft 365, Google Workspace en meer. Voor systemen zonder API gebruiken wij RPA. Je hoeft niets te vervangen - wij bouwen om wat je al hebt.",
  },
  {
    question: "Moet ik technische kennis hebben om met jullie te werken?",
    answer:
      "Nee. Jij beschrijft het probleem of het doel - wij zorgen voor de rest. Wij vertalen technische complexiteit naar oplossingen die je medewerkers daadwerkelijk gebruiken. Geen jargon, geen imponeergedrag. Gewoon resultaten.",
  },
  {
    question: "Wat is een gratis automatiseringsquickscan?",
    answer:
      "In een quickscan van een uur analyseren wij je processen en identificeren wij de drie tot vijf taken met het hoogste automatiseringspotentieel. Je ontvangt een concreet implementatieplan met verwachte tijdsbesparing en een ruwe ROI-berekening. Geen verplichtingen, geen kosten - puur inzicht.",
  },
  {
    question: "Blijven jullie betrokken na de lancering?",
    answer:
      "Dat is juist waar het werk begint. Wij bieden doorlopend beheer, monitoring en optimalisatie. AI-systemen verbeteren naarmate ze meer data verwerken - wij zorgen dat je oplossing actueel blijft en meegroeit met je organisatie.",
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
            className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[35px]"
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
