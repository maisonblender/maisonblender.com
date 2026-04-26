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
    intro: "Meer bestellingen, minder handmatig werk eromheen.",
    usecases: [
      "AI-chatbot beantwoordt klantvragen — ook buiten kantoortijden",
      "Orders automatisch verwerkt en doorgezet naar fulfillment",
      "Productaanbevelingen op basis van bestelhistorie en gedrag",
      "Retouren automatisch verwerkt, klant direct geïnformeerd",
    ],
  },
  {
    sector: "Logistiek & Transport",
    Icon: Truck,
    intro: "Minder papierwerk. Minder bellen. Meer ritten per dag.",
    usecases: [
      "Routeplanning en dispatching automatisch gegenereerd",
      "CMR's en vrachtbrieven automatisch verwerkt en gearchiveerd",
      "Klanten proactief geïnformeerd over leveringstijden — zonder dat iemand belt",
      "Exportdocumentatie automatisch aangemaakt en ingediend",
    ],
  },
  {
    sector: "MKB & Zakelijke dienstverlening",
    Icon: Briefcase,
    intro: "Minder administratie. Meer tijd voor de klant.",
    usecases: [
      "Inkomende facturen automatisch verwerkt en geboekt",
      "Offertes en contracten opgesteld op basis van jouw templates en klantdata",
      "Leads automatisch opgevolgd — geen enkele meer vergeten",
      "Interne kennisbank doorzoekbaar via een vraag in gewone taal",
    ],
  },
  {
    sector: "Horeca & Toerisme",
    Icon: UtensilsCrossed,
    intro: "Gasten geholpen. Personeel ontlast. Ook als het druk is.",
    usecases: [
      "Reserveringen aangenomen via WhatsApp of website — dag en nacht",
      "Gasten krijgen persoonlijk advies over menu, allergieën en aanbevelingen",
      "Nieuwe reviews automatisch gesignaleerd en samengevat voor de manager",
      "Personeelsplanning automatisch gegenereerd op basis van bezetting en voorkeuren",
    ],
  },
  {
    sector: "Zorg & Welzijn",
    Icon: HeartPulse,
    intro: "Minder administratie voor zorgverleners. Meer aandacht voor de cliënt.",
    usecases: [
      "Afspraken ingepland via chatbot — patiënt kiest zelf tijd, zonder telefonisch wachten",
      "Inkomende verwijzingen automatisch verwerkt en gekoppeld aan het juiste dossier",
      "Nazorg en herinneringen automatisch verstuurd op het juiste moment",
      "Rapportages automatisch gegenereerd — zorgverleners schrijven minder, doen meer",
    ],
  },
  {
    sector: "Productie & Maakindustrie",
    Icon: Factory,
    intro: "Minder handmatig invoerwerk. Sneller signaleren als er iets afwijkt.",
    usecases: [
      "Orders en inkoopverzoeken automatisch verwerkt en doorgezet in het ERP",
      "AI signaleert kwaliteitsafwijkingen voordat ze de lijn verlaten",
      "Voorraadniveaus automatisch bewaakt — inkooporders getriggerd bij onderschrijding",
      "ERP-data automatisch omgezet naar managementrapportages",
    ],
  },
];

export default function Sectoren() {
  return (
    <section id="sectoren" className="relative bg-white px-6 py-20 lg:py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
            Sectoren
          </span>
          <h2 className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]" style={{ letterSpacing: "-0.95px" }}>
            AI werkt in elke sector.
            <br />
            <span className="font-exposure">Het proces bepaalt de aanpak.</span>
          </h2>
          <p className="max-w-xl text-[#575760]">
            Een logistiek bedrijf en een accountantskantoor hebben andere problemen en andere kansen.
            Wij bouwen voor die verschillen — niet voor de gemiddelde klant.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectoren.map((item) => (
            <div
              key={item.sector}
              className="group bg-[#f2f3f5] p-8 transition-colors hover:bg-white"
            >
              <div className="mb-4 flex items-center gap-3">
                <item.Icon className="h-5 w-5 shrink-0 text-[#1f1f1f]" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-[#1f1f1f]">{item.sector}</h3>
              </div>
              <p className="mb-4 text-sm text-[#1f1f1f] font-medium">{item.intro}</p>
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
          <div className="mt-8 flex flex-col items-center gap-4 bg-[#f2f3f5] p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-[#1f1f1f]">Staat jouw sector er niet bij?</p>
            <p className="text-sm text-[#575760]">
              AI-automatisering is niet sectorgebonden — het is procesgebonden. Als er taken zijn
              die herhaald worden, tijd kosten of gevoelig zijn voor fouten, is er waarschijnlijk
              iets te doen. We kijken het graag met je mee.
            </p>
          </div>
          <a
            href="/quickscan"
            className="shrink-0 rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#3a3a42] hover:shadow-md"
          >
            Start gratis AI-scan
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
    </section>
  );
}
