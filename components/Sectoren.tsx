import {
  ShoppingCart,
  Truck,
  Briefcase,
  UtensilsCrossed,
  HeartPulse,
  Factory,
} from "lucide-react";

const sectoren = [
  {
    sector: "Retail & E-commerce",
    Icon: ShoppingCart,
    usecases: [
      "AI-chatbot voor 24/7 klantenservice",
      "Automatische orderverwerking",
      "Persoonlijke productaanbevelingen",
      "Retourverwerking zonder handmatig werk",
    ],
  },
  {
    sector: "Logistiek & Transport",
    Icon: Truck,
    usecases: [
      "Automatische routeplanning en dispatching",
      "Documentverwerking (CMR, vrachtbrieven)",
      "Klantcommunicatie over leveringstijden",
      "RPA voor exportdocumentatie",
    ],
  },
  {
    sector: "MKB & Zakelijke dienstverlening",
    Icon: Briefcase,
    usecases: [
      "Automatische factuurverwerking",
      "AI-assistent voor offertes en contracten",
      "CRM-automatisering en lead opvolging",
      "Interne kennisbank met RAG-systeem",
    ],
  },
  {
    sector: "Horeca & Toerisme",
    Icon: UtensilsCrossed,
    usecases: [
      "Reserveringsbot via WhatsApp of web",
      "AI-menuadviseur en upsell assistent",
      "Automatische review-verwerking",
      "Personeelsplanning met AI-ondersteuning",
    ],
  },
  {
    sector: "Zorg & Welzijn",
    Icon: HeartPulse,
    usecases: [
      "Afspraken plannen via AI-chatbot",
      "Automatische verwerking van verwijzingen",
      "Patiëntcommunicatie en nazorg",
      "Rapportages en administratie versnellen",
    ],
  },
  {
    sector: "Productie & Maakindustrie",
    Icon: Factory,
    usecases: [
      "Orderverwerking en inkoopautomatisering",
      "Kwaliteitscontrole met AI-inspectie",
      "Voorraad- en inkoopbeheer",
      "ERP-koppeling en datarapportages",
    ],
  },
];

export default function Sectoren() {
  return (
    <section id="sectoren" className="relative bg-[#1f1f1f] px-6 py-20 lg:py-32 text-white overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-white/50">
            Sectoren
          </span>
          <h2 className="text-[24px] font-normal leading-[1.2] tracking-tight text-white sm:text-[29px] lg:text-[26px]" style={{ letterSpacing: "-0.95px" }}>
            AI werkt in elke sector.
            <br />
            <span className="font-exposure">Mits het goed is gebouwd.</span>
          </h2>
          <p className="max-w-xl text-white/60">
            Een logistiek bedrijf en een accountantskantoor hebben andere processen. Andere problemen.
            Andere kansen. Wij bouwen voor het verschil.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectoren.map((item) => (
            <div
              key={item.sector}
              className="group bg-white/[0.06] p-8 transition-colors hover:bg-white/[0.10]"
            >
              <div className="mb-6 flex items-center gap-3">
                <item.Icon className="h-5 w-5 shrink-0 text-white/80" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-white">{item.sector}</h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {item.usecases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2.5 text-sm text-white/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-white/30" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-8 flex flex-col items-center gap-4 bg-white/[0.06] p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-white">Jouw sector staat er niet bij?</p>
            <p className="text-sm text-white/60">
              AI-automatisering is niet gebonden aan een branche - het is gebonden aan processen.
              Elk bedrijf heeft processen die beter kunnen.
            </p>
          </div>
          <a
            href="/quickscan"
            className="shrink-0 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1f1f1f] transition-all hover:bg-white/90 hover:shadow-md"
          >
            Start gratis AI-scan
          </a>
        </div>
      </div>
    </section>
  );
}
