import { Scale, FileSearch, Gauge, ListChecks, ShieldCheck, Eye } from "lucide-react";

/**
 * Server-rendered introductiesectie. Uitleg over WCAG 2.1 AA, EN 301 549,
 * Toegankelijkheidsbesluit (NL) en de Europese Toegankelijkheidsrichtlijn (EAA),
 * plus een transparante uitleg van hoe de scanner werkt.
 */
export default function AuditIntro() {
  return (
    <section className="bg-white px-6 pt-28 pb-14 lg:pt-32 lg:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760] mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          WCAG 2.1 AA · EN 301 549 · Toegankelijkheidsbesluit · EAA 2025
        </div>

        <h1
          className="text-[34px] font-normal leading-[1.05] tracking-tight text-[#1f1f1f] sm:text-[44px] lg:text-[52px] mb-6"
          style={{ letterSpacing: "-1px" }}
        >
          Digitale toegankelijkheid
          <br />
          <span className="font-exposure">is geen optie meer.</span>
        </h1>

        <p className="max-w-3xl leading-relaxed text-[#575760]">
          Sinds <strong className="text-[#1f1f1f]">28 juni 2025</strong> verplicht
          de <strong className="text-[#1f1f1f]">Europese Toegankelijkheidsrichtlijn (EAA)</strong>
          {" "}een groot deel van de bedrijven met digitale producten en diensten in de EU
          om te voldoen aan <strong className="text-[#1f1f1f]">WCAG 2.1 niveau AA</strong>,
          via de geharmoniseerde Europese norm <strong className="text-[#1f1f1f]">EN 301 549 v3.2.1</strong>.
          Voor overheidsorganisaties geldt deze plicht via het Nederlandse{" "}
          <strong className="text-[#1f1f1f]">Toegankelijkheidsbesluit</strong> al sinds 2018.
        </p>

        {/* Wettelijk kader — 4 cards */}
        <div className="mt-10 grid gap-px bg-black/[0.06] border border-black/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          <LawCard
            Icon={Scale}
            badge="EU 2019/882"
            title="Europese Toegankelijkheidsrichtlijn (EAA)"
            body="Verplicht vanaf 28 juni 2025 voor o.a. webshops, banken, e-readers, e-tickets, OV-apps en consumentensoftware. Handhaving via nationale toezichthouders."
          />
          <LawCard
            Icon={Scale}
            badge="EN 301 549 v3.2.1"
            title="Geharmoniseerde EU-norm"
            body="De technische norm waarmee EAA-conformiteit wordt aangetoond. Hoofdstuk 9 (Web) verwijst integraal naar WCAG 2.1 niveau A en AA."
          />
          <LawCard
            Icon={Scale}
            badge="WCAG 2.1 AA"
            title="Web Content Accessibility Guidelines"
            body="Internationale standaard van W3C met 50 success criteria op niveau A en AA. De facto wereldwijde toegankelijkheidsbenchmark."
          />
          <LawCard
            Icon={Scale}
            badge="NL 2018"
            title="Toegankelijkheidsbesluit"
            body="Nederlandse implementatie van de Web Accessibility Directive (EU 2016/2102) voor overheidsorganisaties. Verwijst naar EN 301 549."
          />
        </div>

        {/* Hoe de scanner werkt */}
        <div className="mt-16">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be] mb-3">
            {"// Hoe de scanner werkt"}
          </p>
          <h2
            className="text-[24px] font-normal leading-tight tracking-tight text-[#1f1f1f] sm:text-[28px] mb-3 max-w-3xl"
            style={{ letterSpacing: "-0.5px" }}
          >
            Een transparante, deterministische check tegen WCAG 2.1 AA én EN 301 549.
          </h2>
          <p className="max-w-3xl leading-relaxed text-[#575760]">
            De scanner is een <strong className="text-[#1f1f1f]">automated static audit</strong>:
            we halen de HTML van je pagina server-side op, parseren de DOM en draaien dertien
            deterministische regels die de meest voorkomende AA-failures detecteren. Iedere
            bevinding wordt gemapt op het bijbehorende WCAG success criterion én de EN 301 549-clausule,
            inclusief impact-classificatie en een concrete fix-aanwijzing.
          </p>

          <div className="mt-8 grid gap-px bg-black/[0.06] border border-black/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              n="01"
              Icon={FileSearch}
              title="HTML ophalen & parsen"
              body="Server-side fetch (12s timeout, max 4 MB). Geen rendering van JavaScript — we toetsen wat de bot ontvangt."
            />
            <StepCard
              n="02"
              Icon={ListChecks}
              title="13 statische regels"
              body="Alt-tekst, formuliers, heading-volgorde, lang, titel, link/button-naam, iframe, viewport, skip-link, landmarks."
            />
            <StepCard
              n="03"
              Icon={Gauge}
              title="Score & prioriteit"
              body="Gewogen aftrek per impact (kritiek 12, hoog 8, middel 4, laag 2 punten) → 0-100 compliance-score + P1-P4 fixes."
            />
            <StepCard
              n="04"
              Icon={ShieldCheck}
              title="WCAG ↔ EN 301 549"
              body="Iedere bevinding gemapt op WCAG success criterion én EN 301 549 §-clausule, klaar voor je toegankelijkheidsverklaring."
            />
          </div>
        </div>

        {/* Eerlijke disclaimer */}
        <div className="mt-10 flex items-start gap-4 border-l-2 border-amber-400 bg-amber-50/50 px-5 py-4 text-[#3a3a42]">
          <Eye className="mt-1 h-5 w-5 shrink-0 text-amber-600" strokeWidth={1.5} />
          <p className="leading-relaxed">
            <strong className="text-[#1f1f1f]">Eerlijk over wat we niet kunnen.</strong>{" "}
            Geen automatische tool kan een toegankelijkheidsverklaring vervangen. Onderwerpen als
            de betekenisvolheid van alt-tekst, focusvolgorde, taalniveau en complexe ARIA-patronen
            vereisen menselijke en gebruikersgerichte beoordeling. De scanner is een sterke eerste
            scan — geen formele toets.
          </p>
        </div>
      </div>
    </section>
  );
}

function LawCard({
  Icon,
  badge,
  title,
  body,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white p-6 lg:p-7">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/[0.06] bg-[#f2f3f5]">
          <Icon className="h-4 w-4 text-[#1f1f1f]" strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#575760]">
          {badge}
        </span>
      </div>
      <p className="mb-2 text-base font-semibold leading-snug text-[#1f1f1f]">{title}</p>
      <p className="leading-relaxed text-[#575760]">{body}</p>
    </div>
  );
}

function StepCard({
  n,
  Icon,
  title,
  body,
}: {
  n: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white p-6 lg:p-7">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be]">{n}</span>
        <Icon className="h-4 w-4 text-[#1f1f1f]" strokeWidth={1.5} />
      </div>
      <p className="mb-2 text-base font-semibold leading-snug text-[#1f1f1f]">{title}</p>
      <p className="leading-relaxed text-[#575760]">{body}</p>
    </div>
  );
}
