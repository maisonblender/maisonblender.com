"use client";

import { useState } from "react";
import { Copy, CheckCircle, Loader2 } from "lucide-react";

type ContentType = "woningomschrijving" | "opvolgmail" | "feedback_request";

interface Variant {
  label: string;
  tekst: string;
}

interface Props {
  tenantId: string;
  branche: string;
}

const inputClass =
  "w-full bg-[#f2f3f5] border border-black/10 px-4 py-3 text-sm text-[#1f1f1f] placeholder-[#575760]/60 outline-none focus:border-[#1f1f1f] transition-colors";

function CopyButton({ tekst }: { tekst: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(tekst);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs text-[#575760] hover:text-[#1f1f1f] transition-colors"
    >
      {copied ? (
        <>
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          Gekopieerd
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Kopieer
        </>
      )}
    </button>
  );
}

export default function ContentGenerator({ tenantId, branche }: Props) {
  const [activeType, setActiveType] = useState<ContentType>("woningomschrijving");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);

  // Woningomschrijving velden
  const [adres, setAdres] = useState("");
  const [type, setType] = useState("");
  const [prijs, setPrijs] = useState("");
  const [kamers, setKamers] = useState("");
  const [oppervlak, setOppervlak] = useState("");
  const [kenmerken, setKenmerken] = useState("");
  const [sfeer, setSfeer] = useState("neutraal, professioneel");
  const [extraInfo, setExtraInfo] = useState("");

  // Opvolgmail / feedback velden
  const [bezoekerNaam, setBezoekerNaam] = useState("");
  const [objectNaam, setObjectNaam] = useState("");
  const [datum, setDatum] = useState("");

  const generate = async () => {
    setLoading(true);
    setError(null);
    setVariants([]);

    let input: Record<string, string | number | boolean | string[]> = {};
    switch (activeType) {
      case "woningomschrijving":
        input = {
          adres,
          type,
          prijs,
          kamers,
          oppervlak,
          kenmerken: kenmerken.split(",").map((k) => k.trim()).filter(Boolean),
          sfeer,
          extraInfo,
        };
        break;
      case "opvolgmail":
      case "feedback_request":
        input = {
          bezoekerNaam,
          object: objectNaam,
          datum,
          toon: "informeel",
        };
        break;
    }

    try {
      const res = await fetch(`/api/aicollega/${branche}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, type: activeType, input }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error || "Generatie mislukt.");
      }
      const json = (await res.json()) as { variants: Variant[] };
      setVariants(json.variants);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: ContentType; label: string }[] = [
    { id: "woningomschrijving", label: "Woningomschrijving" },
    { id: "opvolgmail", label: "Opvolgmail" },
    { id: "feedback_request", label: "Feedback-verzoek" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Type selectie */}
      <div className="flex border-b border-black/10 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveType(tab.id);
              setVariants([]);
              setError(null);
            }}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeType === tab.id
                ? "border-[#1f1f1f] text-[#1f1f1f]"
                : "border-transparent text-[#575760] hover:text-[#1f1f1f]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Formulier */}
      <div className="bg-white p-6 flex flex-col gap-4">
        {activeType === "woningomschrijving" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Adres</label>
                <input
                  value={adres}
                  onChange={(e) => setAdres(e.target.value)}
                  placeholder="Wilhelminastraat 14, Sittard"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Type woning</label>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Vrijstaand / Appartement / Rijtjeshuis"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Vraagprijs (€)</label>
                <input
                  type="number"
                  value={prijs}
                  onChange={(e) => setPrijs(e.target.value)}
                  placeholder="425000"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Kamers</label>
                <input
                  type="number"
                  value={kamers}
                  onChange={(e) => setKamers(e.target.value)}
                  placeholder="5"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Oppervlak (m²)</label>
                <input
                  type="number"
                  value={oppervlak}
                  onChange={(e) => setOppervlak(e.target.value)}
                  placeholder="148"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Sfeer / toon</label>
                <input
                  value={sfeer}
                  onChange={(e) => setSfeer(e.target.value)}
                  placeholder="Neutraal / Luxe / Gezinsgericht"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">
                Kenmerken (komma-gescheiden)
              </label>
              <input
                value={kenmerken}
                onChange={(e) => setKenmerken(e.target.value)}
                placeholder="tuin, garage, zonnepanelen, vloerverwarming"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">
                Extra info (optioneel)
              </label>
              <textarea
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                placeholder="Recent gerenoveerde keuken, rustige ligging nabij centrum..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </>
        )}

        {(activeType === "opvolgmail" || activeType === "feedback_request") && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Naam bezoeker</label>
              <input
                value={bezoekerNaam}
                onChange={(e) => setBezoekerNaam(e.target.value)}
                placeholder="Jan de Vries"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">Object / adres</label>
              <input
                value={objectNaam}
                onChange={(e) => setObjectNaam(e.target.value)}
                placeholder="Wilhelminastraat 14, Sittard"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#575760] uppercase tracking-wide">
                Datum bezichtiging
              </label>
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3">{error}</p>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="bg-[#1f1f1f] text-white px-6 py-3.5 text-sm font-bold hover:bg-[#3a3a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Genereren...
            </>
          ) : (
            <>
              Genereer tekst
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Output */}
      {variants.length > 0 && (
        <div className="flex flex-col gap-4">
          {variants.map((v) => (
            <div key={v.label} className="bg-white">
              <div className="px-6 py-3 border-b border-black/5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#575760]">
                  {v.label}
                </p>
                <CopyButton tekst={v.tekst} />
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-[#1f1f1f] leading-relaxed whitespace-pre-wrap">{v.tekst}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
