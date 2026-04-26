import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Team | MAISON BLNDR",
  description:
    "Eén vaste contactpersoon. Een volledig geoutilleerd bureau. Karl Dreissen is je aanspreekpunt van eerste gesprek tot beheer.",
  alternates: { canonical: "https://maisonblender.com/team" },
  openGraph: {
    title: "Team | MAISON BLNDR",
    description:
      "Eén vaste contactpersoon. Een volledig geoutilleerd bureau. Karl Dreissen is je aanspreekpunt van eerste gesprek tot beheer.",
    url: "https://maisonblender.com/team",
  },
};

const capaciteiten = [
  {
    titel: "Brand strategy",
    beschrijving: "Merkpositionering, tone-of-voice, concurrentieanalyse en go-to-market strategie.",
  },
  {
    titel: "Copywriting",
    beschrijving: "Website-copy, diensten- en landingspagina's, e-mailcampagnes en advertentieteksten.",
  },
  {
    titel: "Grafisch ontwerp",
    beschrijving: "Visuele identiteit, ontwerpsystemen, marketing- en campagnemateriaal.",
  },
  {
    titel: "E-commerce development",
    beschrijving: "Shopify en headless commerce — bouw, optimalisatie en conversieverbeteringen.",
  },
  {
    titel: "SEO",
    beschrijving: "Technische SEO, contentstrategie op zoekintentie, structuur en indexering.",
  },
  {
    titel: "Performance marketing",
    beschrijving: "Google Ads, Meta en LinkedIn — campagnebeheer, testing en optimalisatie.",
  },
  {
    titel: "Social media",
    beschrijving: "Kanaalbeheer, contentstrategie en community management per platform.",
  },
  {
    titel: "AI visuele content",
    beschrijving: "Beeldgeneratie en videoproductie via AI-tools, aangestuurd vanuit creatief concept.",
  },
];

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
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
              Team
            </div>
            <h1
              className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[52px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              Eén vaste contactpersoon.
              <br />
              <span className="font-exposure">Een volledig geoutilleerd bureau.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg max-w-2xl mx-auto">
              MAISON BLNDR werkt anders dan een traditioneel bureau. Karl Dreissen is je vaste
              aanspreekpunt — van eerste gesprek tot beheer. Achter hem staan gespecialiseerde
              AI-agents en een netwerk van vakspecialisten die samen de volledige breedte van
              het werk afdekken.
            </p>
          </div>
        </section>

        {/* Karl profiel */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-8">Het team</p>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12 max-w-3xl">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-[#f2f3f5] text-xl font-semibold tracking-wide text-[#575760]">
                KD
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1f1f1f]">Karl Dreissen</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-[#575760]">
                    AI Engineer
                  </p>
                </div>
                <p className="text-[#575760] leading-relaxed">
                  Karl bouwt de AI-agents en automatiseringsarchitectuur die bij de meeste projecten de
                  kern vormen. Hij werkt o.a. met LangGraph, n8n en Anthropic Claude, en heeft meer dan
                  drie decennia ervaring in webdevelopment en marketingtechnologie.
                </p>
                <p className="text-[#575760] leading-relaxed">
                  Als iets technisch complex is maar simpel moet werken, is hij degene die dat oplost.
                  Hij is ook het gezicht van MAISON BLNDR in klantgesprekken — je weet altijd met wie
                  je praat, en die persoon is ook degene die bouwt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hoe we werken */}
        <section className="px-6 py-20 lg:py-28 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760]">Hoe we werken</p>
              <h2
                className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Gespecialiseerde AI-agents.
                <br />
                <span className="font-exposure">Menselijke specialisten waar het telt.</span>
              </h2>
              <p className="max-w-2xl text-[#575760] leading-relaxed">
                MAISON BLNDR werkt met een set van gespecialiseerde AI-agents die elk zijn getraind en
                ingericht voor een specifiek vakgebied. Karl stuurt ze aan, beoordeelt de output en is
                eindverantwoordelijk voor wat we opleveren. Voor projecten die specifiek menselijk vakwerk
                vragen — complexe merkstrategie, fotografie op locatie, campagneproductie — werken we
                samen met een vaste groep freelance specialisten.
              </p>
              <p className="max-w-2xl text-[#575760] leading-relaxed">
                Dat maakt ons sneller en kostenefficiënter dan een traditioneel bureau van vergelijkbare
                breedte. En het stelt ons in staat om voor MKB-tarieven te leveren wat grotere bureaus
                voor enterprise-budgetten doen.
              </p>
            </div>

            {/* Capaciteiten */}
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-6">
                Beschikbare capaciteiten
              </p>
            </div>
            <div className="grid gap-px bg-black/[0.06] sm:grid-cols-2 lg:grid-cols-4">
              {capaciteiten.map((cap) => (
                <div key={cap.titel} className="bg-white p-6 flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-[#1f1f1f]">{cap.titel}</h3>
                  <p className="text-sm leading-relaxed text-[#575760]">{cap.beschrijving}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparantie */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                    Hoe we dit zien
                  </p>
                  <h2
                    className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                    style={{ letterSpacing: "-0.95px" }}
                  >
                    We zijn transparant over hoe we werken.
                    <br />
                    <span className="font-exposure">Bewust.</span>
                  </h2>
                </div>
                <p className="text-[#575760] leading-relaxed">
                  We zijn een van de eerste bureaus in Nederland die AI-agents structureel inzet als
                  onderdeel van de dienstverlening — niet als experiment, maar als werkwijze. We vinden
                  dat klanten dat mogen weten.
                </p>
                <p className="text-[#575760] leading-relaxed">
                  Wat dat in de praktijk betekent: je krijgt snellere doorlooptijden, consistentere
                  output en lagere kosten dan bij een bureau dat voor elk vakgebied een fulltime
                  medewerker in dienst heeft. Wat je niet inlevert is kwaliteit of controle — Karl
                  beoordeelt en is verantwoordelijk voor elk resultaat dat de deur uit gaat.
                </p>
                <p className="text-[#575760] leading-relaxed">
                  Wil je precies weten hoe dat werkt voor jouw project? Dat leggen we graag uit in
                  een gesprek.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                    Menselijk vakwerk waar het telt
                  </p>
                  <h2
                    className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]"
                    style={{ letterSpacing: "-0.95px" }}
                  >
                    Een vast netwerk van
                    <br />
                    <span className="font-exposure">freelance specialisten.</span>
                  </h2>
                </div>
                <p className="text-[#575760] leading-relaxed">
                  Voor projecten waarbij menselijk vakwerk onvervangbaar is — live fotografie,
                  complexe merkstrategie, campagneproductie met fysieke componenten — werken we
                  samen met een vaste groep partners. Zij worden door Karl geselecteerd en
                  aangestuurd, en vallen onder dezelfde kwaliteitseisen als de rest van het werk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-[#1f1f1f] text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[26px] mb-4"
              style={{ letterSpacing: "-0.95px" }}
            >
              Benieuwd hoe we jouw project
              <br />
              <span className="font-exposure">aanpakken?</span>
            </h2>
            <p className="text-base leading-relaxed text-white/70 mb-8 max-w-xl mx-auto">
              Plan een gratis gesprek van 30 minuten. Je spreekt direct met Karl — niet een
              accountmanager, niet een AI.
            </p>
            <Link
              href="/strategiegesprek"
              className="inline-block rounded-full bg-[#22c55e] px-10 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg"
            >
              Plan een strategiegesprek →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
