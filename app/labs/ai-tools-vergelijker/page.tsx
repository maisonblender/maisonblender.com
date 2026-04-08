"use client";

import { useState } from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

type Categorie = "Tekst" | "Afbeelding" | "Automatisering" | "Productiviteit";
type Prijsmodel = "Gratis" | "Betaald" | "Freemium";

interface AITool {
  naam: string;
  categorie: Categorie;
  prijs: Prijsmodel;
  prijsDetail: string;
  sterkte: string;
  geschiktVoor: string;
  nederlandseTaal: boolean;
  gdprCompliant: boolean;
  website: string;
}

const TOOLS: AITool[] = [
  {
    naam: "ChatGPT",
    categorie: "Tekst",
    prijs: "Freemium",
    prijsDetail: "Gratis / $20/maand (Plus)",
    sterkte: "Veelzijdig, breed inzetbaar, sterk in code en tekst",
    geschiktVoor: "Contentcreatie, klantenservice, research, brainstormen",
    nederlandseTaal: true,
    gdprCompliant: false,
    website: "https://chat.openai.com",
  },
  {
    naam: "Claude",
    categorie: "Tekst",
    prijs: "Freemium",
    prijsDetail: "Gratis / $20/maand (Pro)",
    sterkte: "Uitstekend in lange teksten, nuance, veiligheid",
    geschiktVoor: "Documenten analyseren, contracten, copywriting, onderzoek",
    nederlandseTaal: true,
    gdprCompliant: true,
    website: "https://claude.ai",
  },
  {
    naam: "Gemini",
    categorie: "Tekst",
    prijs: "Freemium",
    prijsDetail: "Gratis / Vanaf €19,99/maand",
    sterkte: "Google-integratie, real-time data, multimodaal",
    geschiktVoor: "Zoekgericht werk, data-analyse, integratie met Google Workspace",
    nederlandseTaal: true,
    gdprCompliant: false,
    website: "https://gemini.google.com",
  },
  {
    naam: "Microsoft Copilot",
    categorie: "Productiviteit",
    prijs: "Betaald",
    prijsDetail: "$30/maand per gebruiker",
    sterkte: "Naadloze Office 365-integratie, enterprise-ready",
    geschiktVoor: "Word, Excel, PowerPoint automatiseren, e-mailbeheer, meetings",
    nederlandseTaal: true,
    gdprCompliant: true,
    website: "https://www.microsoft.com/microsoft-365/copilot",
  },
  {
    naam: "Perplexity",
    categorie: "Tekst",
    prijs: "Freemium",
    prijsDetail: "Gratis / $20/maand (Pro)",
    sterkte: "Bronvermelding, actuele info, helder antwoord",
    geschiktVoor: "Research, marktonderzoek, nieuwsmonitoring",
    nederlandseTaal: true,
    gdprCompliant: false,
    website: "https://www.perplexity.ai",
  },
  {
    naam: "Notion AI",
    categorie: "Productiviteit",
    prijs: "Betaald",
    prijsDetail: "$10/maand per gebruiker",
    sterkte: "Geïntegreerd in Notion, kennisbeheer, templates",
    geschiktVoor: "Notities samenvatten, content genereren in Notion, wiki's",
    nederlandseTaal: true,
    gdprCompliant: true,
    website: "https://www.notion.so/product/ai",
  },
  {
    naam: "Zapier",
    categorie: "Automatisering",
    prijs: "Freemium",
    prijsDetail: "Gratis (100 tasks) / Vanaf $19,99/maand",
    sterkte: "6000+ integraties, no-code, triggers en acties",
    geschiktVoor: "App-koppelingen, CRM-automatisering, workflow-automatisering",
    nederlandseTaal: false,
    gdprCompliant: true,
    website: "https://zapier.com",
  },
  {
    naam: "Make (Integromat)",
    categorie: "Automatisering",
    prijs: "Freemium",
    prijsDetail: "Gratis (1000 operaties) / Vanaf $9/maand",
    sterkte: "Visuele workflow-editor, complexe logica mogelijk",
    geschiktVoor: "Complexe multi-step automatiseringen, data-transformatie",
    nederlandseTaal: false,
    gdprCompliant: true,
    website: "https://www.make.com",
  },
  {
    naam: "n8n",
    categorie: "Automatisering",
    prijs: "Freemium",
    prijsDetail: "Self-hosted gratis / Cloud vanaf $20/maand",
    sterkte: "Open source, zelf hosten, volledige controle",
    geschiktVoor: "Privacy-gevoelige automatisering, custom integraties",
    nederlandseTaal: false,
    gdprCompliant: true,
    website: "https://n8n.io",
  },
  {
    naam: "Midjourney",
    categorie: "Afbeelding",
    prijs: "Betaald",
    prijsDetail: "Vanaf $10/maand (Basic)",
    sterkte: "Hoogwaardige beelden, artistieke stijl, commercieel gebruik",
    geschiktVoor: "Marketing visuals, mockups, concept art, social media",
    nederlandseTaal: false,
    gdprCompliant: false,
    website: "https://www.midjourney.com",
  },
  {
    naam: "DALL-E 3",
    categorie: "Afbeelding",
    prijs: "Betaald",
    prijsDetail: "Via ChatGPT Plus ($20/maand) of API",
    sterkte: "Tekst-in-beeld, nauwkeurige promptinterpretatie",
    geschiktVoor: "Illustraties, infographics, marketingmateriaal",
    nederlandseTaal: true,
    gdprCompliant: false,
    website: "https://openai.com/dall-e-3",
  },
];

const ALLE_CATEGORIEEN: Categorie[] = ["Tekst", "Afbeelding", "Automatisering", "Productiviteit"];
const ALLE_PRIJZEN: Prijsmodel[] = ["Gratis", "Freemium", "Betaald"];

export default function AIToolsVergelijkerPage() {
  const [weergave, setWeergave] = useState<"kaart" | "tabel">("kaart");
  const [categorieFilter, setCategorieFilter] = useState<Categorie | "Alle">("Alle");
  const [prijsFilter, setPrijsFilter] = useState<Prijsmodel | "Alle">("Alle");
  const [gdprFilter, setGdprFilter] = useState<boolean | "Alle">("Alle");

  const gefilterd = TOOLS.filter((tool) => {
    if (categorieFilter !== "Alle" && tool.categorie !== categorieFilter) return false;
    if (prijsFilter !== "Alle" && tool.prijs !== prijsFilter) return false;
    if (gdprFilter !== "Alle" && tool.gdprCompliant !== gdprFilter) return false;
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
            {TOOLS.length} AI-tools vergeleken
          </div>
          <h1
            className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[48px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            AI Tools Vergelijker
            <br />
            <span className="font-exposure">voor Limburgse MKB.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 sm:text-lg max-w-2xl mx-auto">
            Helder overzicht van de meest gebruikte AI-tools: functie, prijs, Nederlandse taalondersteuning en GDPR-status.
          </p>
        </div>
      </section>

      {/* Filters + Weergave toggle */}
      <section className="bg-white px-6 py-10 border-b border-black/[0.06]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Categorie */}
            <div>
              <label className="block text-xs font-medium text-[#575760] mb-2 uppercase tracking-wide">
                Categorie
              </label>
              <select
                value={categorieFilter}
                onChange={(e) => setCategorieFilter(e.target.value as Categorie | "Alle")}
                className="rounded-lg border border-black/10 bg-[#f2f3f5] px-4 py-2 text-sm text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              >
                <option value="Alle">Alle categorieën</option>
                {ALLE_CATEGORIEEN.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Prijs */}
            <div>
              <label className="block text-xs font-medium text-[#575760] mb-2 uppercase tracking-wide">
                Prijs
              </label>
              <select
                value={prijsFilter}
                onChange={(e) => setPrijsFilter(e.target.value as Prijsmodel | "Alle")}
                className="rounded-lg border border-black/10 bg-[#f2f3f5] px-4 py-2 text-sm text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              >
                <option value="Alle">Alle prijzen</option>
                {ALLE_PRIJZEN.map((prijs) => (
                  <option key={prijs} value={prijs}>
                    {prijs}
                  </option>
                ))}
              </select>
            </div>

            {/* GDPR */}
            <div>
              <label className="block text-xs font-medium text-[#575760] mb-2 uppercase tracking-wide">
                GDPR
              </label>
              <select
                value={gdprFilter === "Alle" ? "Alle" : gdprFilter ? "Ja" : "Nee"}
                onChange={(e) =>
                  setGdprFilter(e.target.value === "Alle" ? "Alle" : e.target.value === "Ja")
                }
                className="rounded-lg border border-black/10 bg-[#f2f3f5] px-4 py-2 text-sm text-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              >
                <option value="Alle">Alle</option>
                <option value="Ja">GDPR-compliant</option>
                <option value="Nee">Niet GDPR-compliant</option>
              </select>
            </div>

            {/* Weergave toggle */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setWeergave("kaart")}
                className={`rounded-lg p-2 transition-all ${
                  weergave === "kaart"
                    ? "bg-[#22c55e] text-white"
                    : "bg-[#f2f3f5] text-[#575760] hover:bg-[#e5e7eb]"
                }`}
                aria-label="Kaartweergave"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setWeergave("tabel")}
                className={`rounded-lg p-2 transition-all ${
                  weergave === "tabel"
                    ? "bg-[#22c55e] text-white"
                    : "bg-[#f2f3f5] text-[#575760] hover:bg-[#e5e7eb]"
                }`}
                aria-label="Tabelweergave"
              >
                <TableIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-[#575760]">
            {gefilterd.length} {gefilterd.length === 1 ? "tool" : "tools"} gevonden
          </p>
        </div>
      </section>

      {/* Resultaten */}
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {weergave === "kaart" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gefilterd.map((tool) => (
                <div
                  key={tool.naam}
                  className="border border-black/[0.08] rounded-xl bg-[#f2f3f5] p-6 transition-all hover:border-[#22c55e]/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1f1f1f] mb-1">{tool.naam}</h3>
                      <span className="inline-block text-xs font-medium uppercase tracking-wide text-[#22c55e]">
                        {tool.categorie}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {tool.gdprCompliant && (
                        <span className="inline-block rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-xs font-medium text-[#16a34a]">
                          GDPR
                        </span>
                      )}
                      {tool.nederlandseTaal && (
                        <span className="inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700">
                          NL
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[#575760] mb-3">{tool.sterkte}</p>

                  <div className="space-y-2 text-xs text-[#575760]">
                    <div>
                      <span className="font-medium text-[#1f1f1f]">Prijs:</span> {tool.prijsDetail}
                    </div>
                    <div>
                      <span className="font-medium text-[#1f1f1f]">Geschikt voor:</span>{" "}
                      {tool.geschiktVoor}
                    </div>
                  </div>

                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-full bg-[#22c55e] px-4 py-2 text-xs font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-md"
                  >
                    Bekijk tool →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-black/10 bg-[#f2f3f5]">
                    <th className="px-4 py-3 font-semibold text-[#1f1f1f]">Tool</th>
                    <th className="px-4 py-3 font-semibold text-[#1f1f1f]">Categorie</th>
                    <th className="px-4 py-3 font-semibold text-[#1f1f1f]">Prijs</th>
                    <th className="px-4 py-3 font-semibold text-[#1f1f1f]">Sterkte</th>
                    <th className="px-4 py-3 font-semibold text-[#1f1f1f]">NL</th>
                    <th className="px-4 py-3 font-semibold text-[#1f1f1f]">GDPR</th>
                    <th className="px-4 py-3 font-semibold text-[#1f1f1f]"></th>
                  </tr>
                </thead>
                <tbody>
                  {gefilterd.map((tool, idx) => (
                    <tr
                      key={tool.naam}
                      className={`border-b border-black/[0.06] ${
                        idx % 2 === 0 ? "bg-white" : "bg-[#f2f3f5]/50"
                      } hover:bg-[#22c55e]/5 transition-colors`}
                    >
                      <td className="px-4 py-4 font-medium text-[#1f1f1f]">{tool.naam}</td>
                      <td className="px-4 py-4 text-[#575760]">{tool.categorie}</td>
                      <td className="px-4 py-4 text-[#575760]">{tool.prijsDetail}</td>
                      <td className="px-4 py-4 text-[#575760] max-w-xs truncate">{tool.sterkte}</td>
                      <td className="px-4 py-4">
                        {tool.nederlandseTaal ? (
                          <span className="inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700">
                            Ja
                          </span>
                        ) : (
                          <span className="text-[#b2b2be]">Nee</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {tool.gdprCompliant ? (
                          <span className="inline-block rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-xs font-medium text-[#16a34a]">
                            Ja
                          </span>
                        ) : (
                          <span className="text-[#b2b2be]">Nee</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#22c55e] hover:text-[#16a34a] font-medium transition-colors"
                        >
                          Bekijk →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {gefilterd.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#575760]">
                Geen tools gevonden met deze filters. Probeer een ander filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
