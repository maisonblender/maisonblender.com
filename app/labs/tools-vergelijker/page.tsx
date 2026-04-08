"use client";

import { useState } from "react";
import { LayoutGrid, List, Check, X, AlertCircle } from "lucide-react";

type Categorie = "Alle" | "Tekst" | "Afbeelding" | "Automatisering";
type PrijsType = "Alle" | "Gratis" | "Betaald";
type GdprStatus = "Compliant" | "Beperkt" | "Onbekend";

interface Tool {
  naam: string;
  logo: string;
  categorie: Exclude<Categorie, "Alle">;
  prijs: Exclude<PrijsType, "Alle">;
  prijsDetails: string;
  sterkte: string;
  geschiktVoor: string;
  nederlandsTaal: boolean;
  gdpr: GdprStatus;
  website: string;
}

const TOOLS: Tool[] = [
  {
    naam: "ChatGPT",
    logo: "🤖",
    categorie: "Tekst",
    prijs: "Betaald",
    prijsDetails: "Gratis tier + €20/maand (Plus) + €25/gebruiker (Team)",
    sterkte: "Veelzijdig tekstgeneratie, brainstormen, conversatie",
    geschiktVoor: "Algemene teksttaken, klantenservice, contentcreatie",
    nederlandsTaal: true,
    gdpr: "Beperkt",
    website: "https://chat.openai.com",
  },
  {
    naam: "Claude",
    logo: "🧠",
    categorie: "Tekst",
    prijs: "Betaald",
    prijsDetails: "Gratis tier + €20/maand (Pro) + €25/gebruiker (Team)",
    sterkte: "Lange teksten, complexe analyse, veilige AI",
    geschiktVoor: "Juridisch, strategisch advies, technische documentatie",
    nederlandsTaal: true,
    gdpr: "Compliant",
    website: "https://claude.ai",
  },
  {
    naam: "Gemini",
    logo: "💎",
    categorie: "Tekst",
    prijs: "Betaald",
    prijsDetails: "Gratis tier + €19,99/maand (Advanced)",
    sterkte: "Google-integratie, multimodale input, real-time info",
    geschiktVoor: "Research, data-analyse, Google Workspace integratie",
    nederlandsTaal: true,
    gdpr: "Beperkt",
    website: "https://gemini.google.com",
  },
  {
    naam: "Microsoft Copilot",
    logo: "🪟",
    categorie: "Tekst",
    prijs: "Betaald",
    prijsDetails: "Gratis tier + €22/maand (Pro) + €30/gebruiker (Microsoft 365)",
    sterkte: "Diep geïntegreerd in Microsoft 365",
    geschiktVoor: "Teams die al Microsoft 365 gebruiken",
    nederlandsTaal: true,
    gdpr: "Compliant",
    website: "https://copilot.microsoft.com",
  },
  {
    naam: "Perplexity",
    logo: "🔍",
    categorie: "Tekst",
    prijs: "Betaald",
    prijsDetails: "Gratis tier + €20/maand (Pro)",
    sterkte: "AI-zoekassistent met bronvermelding",
    geschiktVoor: "Research, fact-checking, marktonderzoek",
    nederlandsTaal: true,
    gdpr: "Onbekend",
    website: "https://perplexity.ai",
  },
  {
    naam: "Notion AI",
    logo: "📝",
    categorie: "Tekst",
    prijs: "Betaald",
    prijsDetails: "€10/maand per gebruiker (add-on op Notion)",
    sterkte: "AI direct in je notities en projecten",
    geschiktVoor: "Teams die Notion al gebruiken, notities, samenvattingen",
    nederlandsTaal: true,
    gdpr: "Compliant",
    website: "https://notion.so",
  },
  {
    naam: "Midjourney",
    logo: "🎨",
    categorie: "Afbeelding",
    prijs: "Betaald",
    prijsDetails: "Vanaf $10/maand",
    sterkte: "Hoogwaardige AI-beelden, artistieke stijl",
    geschiktVoor: "Marketing visuals, conceptontwerp, social media",
    nederlandsTaal: false,
    gdpr: "Onbekend",
    website: "https://midjourney.com",
  },
  {
    naam: "Zapier",
    logo: "⚡",
    categorie: "Automatisering",
    prijs: "Betaald",
    prijsDetails: "Gratis tier + vanaf €19,99/maand",
    sterkte: "Grootste app-catalogus (7000+), drag-and-drop",
    geschiktVoor: "Niet-technische teams, snelle integraties",
    nederlandsTaal: false,
    gdpr: "Compliant",
    website: "https://zapier.com",
  },
  {
    naam: "Make",
    logo: "🔧",
    categorie: "Automatisering",
    prijs: "Betaald",
    prijsDetails: "Gratis tier + vanaf €9/maand",
    sterkte: "Visuele workflows, krachtige logica, API-integraties",
    geschiktVoor: "Complexe workflows, data-transformatie",
    nederlandsTaal: false,
    gdpr: "Compliant",
    website: "https://make.com",
  },
  {
    naam: "n8n",
    logo: "🔗",
    categorie: "Automatisering",
    prijs: "Gratis",
    prijsDetails: "Open-source + vanaf €20/maand (cloud)",
    sterkte: "Self-hosted, volledige controle, open source",
    geschiktVoor: "Technische teams, gevoelige data, custom integraties",
    nederlandsTaal: false,
    gdpr: "Compliant",
    website: "https://n8n.io",
  },
  {
    naam: "DALL-E 3",
    logo: "🖼️",
    categorie: "Afbeelding",
    prijs: "Betaald",
    prijsDetails: "Inbegrepen in ChatGPT Plus (€20/maand)",
    sterkte: "Tekstbegrip, veilige content, nauwkeurige prompts",
    geschiktVoor: "Productvisualisaties, illustraties, snelle concepten",
    nederlandsTaal: true,
    gdpr: "Beperkt",
    website: "https://openai.com/dall-e-3",
  },
];

const GDPR_ICONS = {
  Compliant: { icon: Check, color: "text-[#22c55e]", bg: "bg-[#22c55e]/10", label: "GDPR-compliant" },
  Beperkt: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10", label: "Beperkt GDPR" },
  Onbekend: { icon: X, color: "text-[#b2b2be]", bg: "bg-[#f2f3f5]", label: "Onbekend" },
};

export default function ToolsVergelijkerPage() {
  const [weergave, setWeergave] = useState<"kaarten" | "tabel">("kaarten");
  const [categorie, setCategorie] = useState<Categorie>("Alle");
  const [prijsFilter, setPrijsFilter] = useState<PrijsType>("Alle");
  const [gdprFilter, setGdprFilter] = useState<boolean>(false);

  const gefilterd = TOOLS.filter((t) => {
    if (categorie !== "Alle" && t.categorie !== categorie) return false;
    if (prijsFilter !== "Alle" && t.prijs !== prijsFilter) return false;
    if (gdprFilter && t.gdpr !== "Compliant") return false;
    return true;
  });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1f1f1f] px-6 py-20 text-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 mb-8">
            <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
            {TOOLS.length} tools vergeleken
          </div>
          <h1
            className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[48px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            AI Tools Vergelijker
            <br />
            <span className="font-exposure">voor Limburg MKB.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 sm:text-lg max-w-2xl mx-auto">
            Welke AI-tool past bij jouw bedrijf? Vergelijk prijs, GDPR-status, Nederlandse taal en gebruiksgemak
            van de meest gebruikte AI-tools.
          </p>
        </div>
      </section>

      {/* Filters + weergave toggle */}
      <section className="px-6 py-8 bg-white border-b border-black/[0.06]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-widest text-[#b2b2be]">Categorie</label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value as Categorie)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#22c55e] focus:outline-none"
                >
                  <option>Alle</option>
                  <option>Tekst</option>
                  <option>Afbeelding</option>
                  <option>Automatisering</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-widest text-[#b2b2be]">Prijs</label>
                <select
                  value={prijsFilter}
                  onChange={(e) => setPrijsFilter(e.target.value as PrijsType)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#22c55e] focus:outline-none"
                >
                  <option>Alle</option>
                  <option>Gratis</option>
                  <option>Betaald</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-widest text-[#b2b2be]">GDPR</label>
                <label className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] cursor-pointer hover:border-[#22c55e]/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={gdprFilter}
                    onChange={(e) => setGdprFilter(e.target.checked)}
                    className="accent-[#22c55e]"
                  />
                  Alleen compliant
                </label>
              </div>
            </div>

            {/* Weergave toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setWeergave("kaarten")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  weergave === "kaarten"
                    ? "bg-[#1f1f1f] text-white"
                    : "border border-black/10 text-[#575760] hover:border-[#1f1f1f]/20"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Kaarten
              </button>
              <button
                onClick={() => setWeergave("tabel")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  weergave === "tabel"
                    ? "bg-[#1f1f1f] text-white"
                    : "border border-black/10 text-[#575760] hover:border-[#1f1f1f]/20"
                }`}
              >
                <List className="h-4 w-4" />
                Tabel
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#575760]">
            {gefilterd.length} {gefilterd.length === 1 ? "tool" : "tools"} gevonden
          </p>
        </div>
      </section>

      {/* Weergave: Kaarten */}
      {weergave === "kaarten" && (
        <section className="px-6 py-16 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gefilterd.map((tool) => {
                const gdprInfo = GDPR_ICONS[tool.gdpr];
                return (
                  <div key={tool.naam} className="flex flex-col gap-4 bg-white border border-black/[0.06] p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{tool.logo}</span>
                        <div className="flex flex-col gap-0.5">
                          <h3 className="text-base font-semibold text-[#1f1f1f]">{tool.naam}</h3>
                          <span className="text-xs text-[#b2b2be]">{tool.categorie}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${gdprInfo.bg}`}>
                        <gdprInfo.icon className={`h-3 w-3 ${gdprInfo.color}`} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-[#b2b2be] mb-1">Sterkte</p>
                        <p className="text-xs text-[#1f1f1f] leading-relaxed">{tool.sterkte}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-[#b2b2be] mb-1">Geschikt voor</p>
                        <p className="text-xs text-[#1f1f1f] leading-relaxed">{tool.geschiktVoor}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-black/[0.06]">
                      <span className="rounded-full border border-black/10 px-2.5 py-1 text-xs text-[#575760]">
                        {tool.prijsDetails}
                      </span>
                      {tool.nederlandsTaal && (
                        <span className="rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10 px-2.5 py-1 text-xs text-[#16a34a]">
                          🇳🇱 NL
                        </span>
                      )}
                    </div>

                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors"
                    >
                      Bezoek website →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Weergave: Tabel */}
      {weergave === "tabel" && (
        <section className="px-6 py-16 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl overflow-x-auto">
            <table className="w-full bg-white border border-black/[0.06]">
              <thead className="bg-[#f2f3f5] border-b border-black/[0.06]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#575760]">Tool</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#575760]">Categorie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#575760]">Prijs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#575760]">NL Taal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#575760]">GDPR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#575760]">Sterkte</th>
                </tr>
              </thead>
              <tbody>
                {gefilterd.map((tool, idx) => {
                  const gdprInfo = GDPR_ICONS[tool.gdpr];
                  return (
                    <tr key={tool.naam} className={idx % 2 === 0 ? "bg-white" : "bg-[#f2f3f5]/50"}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tool.logo}</span>
                          <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-[#1f1f1f] hover:text-[#22c55e] transition-colors"
                          >
                            {tool.naam}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#575760]">{tool.categorie}</td>
                      <td className="px-4 py-3 text-xs text-[#575760]">{tool.prijsDetails}</td>
                      <td className="px-4 py-3">
                        {tool.nederlandsTaal ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#22c55e]">
                            <Check className="h-3 w-3" />
                            Ja
                          </span>
                        ) : (
                          <span className="text-xs text-[#b2b2be]">Nee</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${gdprInfo.bg}`}>
                          <gdprInfo.icon className={`h-3 w-3 ${gdprInfo.color}`} />
                          <span className={`text-xs ${gdprInfo.color}`}>{gdprInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#575760] max-w-xs">{tool.sterkte}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="px-6 py-12 bg-white border-t border-black/[0.06]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs leading-relaxed text-[#b2b2be]">
            Deze vergelijking is bedoeld als startpunt en is geen juridisch of technisch advies. Prijzen en features kunnen wijzigen.
            GDPR-status is gebaseerd op publieke informatie per februari 2026. Raadpleeg altijd de officiële documentatie van de tool voor actuele informatie.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#f2f3f5]">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[26px] mb-4"
            style={{ letterSpacing: "-0.6px" }}
          >
            Wil je weten hoe je
            <br />
            <span className="font-exposure">deze tools inzet in jouw bedrijf?</span>
          </h2>
          <p className="text-sm leading-relaxed text-[#575760] mb-8 max-w-xl mx-auto">
            Download het Prompt Starter Kit met 15+ kant-en-klare prompts voor klantenservice, marketing, financien en meer.
          </p>
          <a
            href="/labs/prompt-starter-kit"
            className="inline-block rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
          >
            Download Prompt Starter Kit →
          </a>
        </div>
      </section>
    </>
  );
}
