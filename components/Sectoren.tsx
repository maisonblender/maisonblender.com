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
      "Voorraad- en inkoopbeheer",
      "ERP-koppeling en datarapportages",
    ],
  },
];

export default function Sectoren() {
  return (
    <section id="sectoren" className="relative bg-white px-6 py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
            Sectoren
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#1f1f1f] sm:text-5xl" style={{ letterSpacing: "-0.95px" }}>
            Wij kennen uw branche.
            <br />
            <span className="font-exposure">En uw uitdagingen.</span>
          </h2>
          <p className="max-w-xl text-[#575760]">
            AI-automatisering is geen one-size-fits-all. Wij passen elke oplossing aan op de
            specifieke processen en kansen in uw sector.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectoren.map((item) => (
            <div
              key={item.sector}
              className="group bg-[#f2f3f5] p-8 transition-all hover:bg-white"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <h3 className="text-lg font-bold text-[#1f1f1f]">{item.sector}</h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {item.usecases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2.5 text-sm text-[#575760]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-black/30" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 flex flex-col items-center gap-4 bg-[#f2f3f5] p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-[#1f1f1f]">Staat uw branche er niet bij?</p>
            <p className="text-sm text-[#575760]">
              Wij werken voor elke sector. Plan een quickscan — gratis en vrijblijvend.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#3a3a42] hover:shadow-md"
          >
            Gratis quickscan aanvragen
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
    </section>
  );
}
