import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI-op-Maat Sessies | MAISON BLNDR - Eén dag. Direct resultaat.",
  description:
    "MAISON BLNDR komt naar jou toe en bouwt samen met jou een werkend AI-systeem op één dag. Geen advies op papier - gewoon bouwen en opleveren. Gestandaardiseerde connectors voor Exact, Microsoft 365 en WhatsApp.",
  alternates: { canonical: "https://maisonblender.com/sessies" },
  openGraph: {
    title: "AI-op-Maat Sessies | MAISON BLNDR",
    description: "Eén dag bij jou. Direct een werkend AI-systeem.",
    url: "https://maisonblender.com/sessies",
  },
};

const steps = [
  {
    number: "01",
    title: "Intake & voorbereiding",
    description:
      "Voorafgaand aan de sessie maken we een korte intake. We identificeren het concrete knelpunt in jouw workflow en bereiden de technische omgeving voor.",
  },
  {
    number: "02",
    title: "Bouwdag on-site",
    description:
      "Onze engineer komt naar jouw locatie. We bouwen de automatisering samen, in jouw systemen, zodat je direct ziet hoe het werkt en hoe je het beheert.",
  },
  {
    number: "03",
    title: "Oplevering & overdracht",
    description:
      "Aan het einde van de dag lever je een werkend systeem op. We doen een volledige overdracht zodat je team ermee aan de slag kan.",
  },
];

const usecases = [
  {
    sector: "Accountancy & Finance",
    example: "Automatisch verwerken van inkoopfacturen via Exact Online koppeling",
  },
  {
    sector: "Makelaar & Vastgoed",
    example: "AI-agent die bezichtigingsverzoeken kwalificeert en inplant via WhatsApp",
  },
  {
    sector: "Logistiek & Transport",
    example: "Geautomatiseerde statusupdates en klantnotificaties via Microsoft 365",
  },
  {
    sector: "Zorg & Welzijn",
    example: "Intakeformulieren verwerken en doorsturen naar het juiste team",
  },
  {
    sector: "Retail & E-commerce",
    example: "Retourverzoeken automatisch afhandelen en ERP bijwerken",
  },
  {
    sector: "Professionele dienstverlening",
    example: "Offerte-aanvragen parsen en direct een concept-voorstel genereren",
  },
];

export default function SessiesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative bg-[#1f1f1f] px-6 py-28 text-white overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 mb-8">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
              On-site AI automatisering
            </div>
            <h1
              className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[52px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              Eén dag bij jou.
              <br />
              <span className="font-exposure">Direct een werkend AI-systeem.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg mb-10 max-w-2xl mx-auto">
              We komen naar jou toe, analyseren een concreet knelpunt in jouw workflow en bouwen
              samen de automatisering op dezelfde dag. Geen pitch, geen advies op papier — gewoon bouwen en opleveren.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <a
                href="/strategiegesprek"
                className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg"
              >
                Boek een sessie →
              </a>
            </div>
          </div>
        </section>

        {/* Process steps */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Hoe een sessie
                <br />
                <span className="font-exposure">werkt.</span>
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col gap-4 border border-black/[0.06] bg-[#f2f3f5] p-8">
                  <span className="text-4xl font-exposure text-[#22c55e]">{step.number}</span>
                  <h3 className="text-base font-semibold text-[#1f1f1f]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#575760]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Wat bouwen we
                <br />
                <span className="font-exposure">in één dag?</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#575760] max-w-xl mx-auto">
                Voorbeelden uit de praktijk. Elke sessie is maatwerk — dit zijn de meest voorkomende toepassingen per sector.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {usecases.map((uc) => (
                <div key={uc.sector} className="bg-white border border-black/[0.06] p-6 flex flex-col gap-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">{uc.sector}</span>
                  <p className="text-sm leading-relaxed text-[#1f1f1f]">{uc.example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div>
                <h2
                  className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px] mb-6"
                  style={{ letterSpacing: "-0.95px" }}
                >
                  Gestandaardiseerde
                  <br />
                  <span className="font-exposure">connectors. Dag 1 live.</span>
                </h2>
                <p className="text-base leading-relaxed text-[#575760] mb-6">
                  We werken met bewezen connectors zodat de integratie betrouwbaar en snel is.
                  Geen maanden van custom development.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Exact Online",
                    "Microsoft 365 (Outlook, Teams, SharePoint)",
                    "WhatsApp Business API",
                    "Google Workspace",
                    "Eigen CRM of ERP via REST API",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#575760]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#1f1f1f] p-8 text-white">
                <p className="text-xs font-medium uppercase tracking-widest text-white/50 mb-4">Premium sessie</p>
                <p className="text-4xl font-exposure text-[#22c55e] mb-2">1 dag</p>
                <p className="text-sm text-white/70 mb-8">On-site bij jouw bedrijf. Gegarandeerde output.</p>
                <ul className="flex flex-col gap-3 text-sm text-white/70 mb-8">
                  {[
                    "Intake-call vooraf",
                    "Volledige bouwdag on-site",
                    "Werkend AI-systeem aan het einde van de dag",
                    "Technische overdracht aan jouw team",
                    "30 dagen support na oplevering",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/strategiegesprek"
                  className="inline-block w-full rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] text-center"
                >
                  Boek jouw sessie
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-[#f2f3f5]">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px] mb-4"
              style={{ letterSpacing: "-0.95px" }}
            >
              Klaar om te bouwen?
            </h2>
            <p className="text-base leading-relaxed text-[#575760] mb-8 max-w-xl mx-auto">
              Plan een gratis strategiegesprek. We kijken samen welk knelpunt de grootste impact heeft
              en plannen de sessie in.
            </p>
            <a
              href="/strategiegesprek"
              className="inline-block rounded-full bg-[#1f1f1f] px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
            >
              Plan een strategiegesprek →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
