const sectoren = [
  {
    sector: "Retail & E-commerce",
    icon: "🛍",
    usecases: [
      "AI-chatbot voor 24/7 klantenservice",
      "Automatische orderverwerking",
      "Persoonlijke productaanbevelingen",
      "Retourverwerking zonder handmatig werk",
    ],
  },
  {
    sector: "Logistiek & Transport",
    icon: "🚛",
    usecases: [
      "Automatische routeplanning en planning",
      "Documentverwerking (CMR, vrachtbrieven)",
      "Klantcommunicatie over leveringstijden",
      "RPA voor exportdocumentatie",
    ],
  },
  {
    sector: "MKB & Zakelijke dienstverlening",
    icon: "💼",
    usecases: [
      "Automatische factuurverwerking",
      "AI-assistent voor offertes en contracten",
      "CRM-automatisering en lead opvolging",
      "Interne kennisbank met RAG-systeem",
    ],
  },
  {
    sector: "Horeca & Toerisme",
    icon: "🏨",
    usecases: [
      "Reserveringsbot via WhatsApp of web",
      "AI-menuadviseur en upsell assistent",
      "Automatische review-verwerking",
      "Personeelsplanning met AI-ondersteuning",
    ],
  },
  {
    sector: "Zorg & Welzijn",
    icon: "🏥",
    usecases: [
      "Afspraken plannen via AI-chatbot",
      "Automatische verwerking van verwijzingen",
      "Patiëntcommunicatie en nazorg",
      "Rapportages en administratie versnellen",
    ],
  },
  {
    sector: "Productie & Maakindustrie",
    icon: "⚙️",
    usecases: [
      "Orderverwerking en inkoopautomatisering",
      "Kwaliteitscontrole met AI-inspectie",
      "Voorraad- en inkooopbeheer",
      "ERP-koppeling en datarapportages",
    ],
  },
];

export default function Sectoren() {
  return (
    <section id="sectoren" className="relative bg-[#0a0e15] px-6 py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#4af0c4]/20 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#4af0c4]">
            Sectoren
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#f0f4ff] sm:text-5xl">
            Wij kennen uw branche.
            <br />
            <span className="text-[#8892a4]">En uw uitdagingen.</span>
          </h2>
          <p className="max-w-xl text-[#8892a4]">
            AI-automatisering is geen one-size-fits-all. Wij passen elke oplossing aan op de
            specifieke processen en kansen in uw sector.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectoren.map((item) => (
            <div
              key={item.sector}
              className="group rounded-2xl border border-white/5 bg-[#080b10] p-8 transition-all hover:border-[#4af0c4]/15 hover:bg-[#0d1219]"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <h3 className="text-lg font-bold text-[#f0f4ff]">{item.sector}</h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {item.usecases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2.5 text-sm text-[#8892a4]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#4af0c4]/60" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-[#4af0c4]/10 bg-[#4af0c4]/[0.04] p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-[#f0f4ff]">Staat uw branche er niet bij?</p>
            <p className="text-sm text-[#8892a4]">
              Wij werken voor elke sector. Plan een quickscan — gratis en vrijblijvend.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 rounded-full bg-[#4af0c4] px-8 py-3.5 text-sm font-bold text-[#080b10] transition-all hover:bg-[#6af5d4] hover:shadow-[0_0_40px_rgba(74,240,196,0.3)]"
          >
            Gratis quickscan aanvragen
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#4af0c4]/20 to-transparent" />
    </section>
  );
}
