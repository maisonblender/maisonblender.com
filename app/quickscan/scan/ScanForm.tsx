"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  sectorOpties,
  omvangOpties,
  techStackOpties,
  pijnpuntOpties,
  aiMaturiteitOpties,
  budgetOpties,
  snelheidOpties,
} from "@/lib/quickscan/questions";
import type { ScanAntwoorden } from "@/lib/quickscan/types";

const STAP_TITELS = [
  "Vertel ons over je bedrijf",
  "Waar verlies je nu de meeste tijd?",
  "Hoe ver is jullie AI-reis al?",
];

const STAP_SUBTITELS = [
  "3 snelle vragen over je sector en digitale volwassenheid",
  "Selecteer je grootste uitdagingen (meerdere mogelijk)",
  "Laatste 3 vragen - daarna zie je je score",
];

type PartialAntwoorden = Partial<ScanAntwoorden>;

function OptionButton({
  selected,
  onClick,
  children,
  multi,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-${multi ? "md" : "full"} border-2 flex items-center justify-center flex-shrink-0 ${
            selected ? "border-white" : "border-gray-300"
          }`}
        >
          {selected && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        {children}
      </div>
    </button>
  );
}

export default function ScanForm() {
  const router = useRouter();
  const [stap, setStap] = useState(1);
  const [antwoorden, setAntwoorden] = useState<PartialAntwoorden>({
    pijnpunten: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePijnpunt(pijnpunt: ScanAntwoorden["pijnpunten"][0]) {
    const huidig = antwoorden.pijnpunten ?? [];
    const nieuw = huidig.includes(pijnpunt)
      ? huidig.filter((p) => p !== pijnpunt)
      : [...huidig, pijnpunt];
    setAntwoorden((prev) => ({ ...prev, pijnpunten: nieuw }));
  }

  function kanVolgende(): boolean {
    if (stap === 1) {
      return !!(antwoorden.sector && antwoorden.omvang && antwoorden.techStack);
    }
    if (stap === 2) {
      return (antwoorden.pijnpunten?.length ?? 0) >= 1;
    }
    if (stap === 3) {
      return !!(antwoorden.aiMaturiteit && antwoorden.budgetBereidheid && antwoorden.implementatieSnelheid);
    }
    return false;
  }

  async function verstuurScan() {
    if (!kanVolgende()) return;
    setLoading(true);
    setError(null);

    try {
      const volledigeAntwoorden = antwoorden as ScanAntwoorden;
      // Sla antwoorden op in sessionStorage en navigeer naar resultaten
      sessionStorage.setItem("quickscan_antwoorden", JSON.stringify(volledigeAntwoorden));
      router.push("/quickscan/resultaten");
    } catch {
      setError("Er is iets misgegaan. Probeer het opnieuw.");
      setLoading(false);
    }
  }

  const progressPercentage = ((stap - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-lg">MAISON BLNDR</a>
          <span className="text-white/50 text-sm">Gratis AI Quickscan</span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Stap {stap} van 3</span>
            <span>{Math.round(progressPercentage)}% voltooid</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ width: `${progressPercentage}%` }}
              animate={{ width: `${((stap - 1) / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={stap}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {STAP_SUBTITELS[stap - 1]}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{STAP_TITELS[stap - 1]}</h1>
              </div>

              {/* Stap 1: Bedrijfsprofiel */}
              {stap === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      In welke sector is jouw bedrijf actief?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sectorOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.sector === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, sector: opt.value }))}
                        >
                          <span className="font-medium">{opt.label}</span>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hoeveel medewerkers heeft jouw bedrijf?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {omvangOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.omvang === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, omvang: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && (
                              <span className="text-xs opacity-70">{opt.beschrijving}</span>
                            )}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hoe zou je de digitale volwassenheid van jouw bedrijf omschrijven?
                    </label>
                    <div className="space-y-3">
                      {techStackOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.techStack === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, techStack: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && (
                              <span className="text-xs opacity-70">{opt.beschrijving}</span>
                            )}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stap 2: Pijnpunten */}
              {stap === 2 && (
                <div className="space-y-3">
                  {pijnpuntOpties.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      selected={(antwoorden.pijnpunten ?? []).includes(opt.value)}
                      onClick={() => togglePijnpunt(opt.value)}
                      multi
                    >
                      <div>
                        <span className="font-medium block">{opt.label}</span>
                        {opt.beschrijving && (
                          <span className="text-xs opacity-70">{opt.beschrijving}</span>
                        )}
                      </div>
                    </OptionButton>
                  ))}
                  {(antwoorden.pijnpunten?.length ?? 0) > 0 && (
                    <p className="text-sm text-gray-500">
                      {antwoorden.pijnpunten?.length} uitdaging
                      {(antwoorden.pijnpunten?.length ?? 0) !== 1 ? "en" : ""} geselecteerd
                    </p>
                  )}
                </div>
              )}

              {/* Stap 3: AI Volwassenheid */}
              {stap === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hoe staat het bedrijf momenteel met AI?
                    </label>
                    <div className="space-y-3">
                      {aiMaturiteitOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.aiMaturiteit === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, aiMaturiteit: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && (
                              <span className="text-xs opacity-70">{opt.beschrijving}</span>
                            )}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Wat is het beschikbare budget voor AI-implementatie?
                    </label>
                    <div className="space-y-3">
                      {budgetOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.budgetBereidheid === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, budgetBereidheid: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && (
                              <span className="text-xs opacity-70">{opt.beschrijving}</span>
                            )}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hoe snel wil je aan de slag met AI?
                    </label>
                    <div className="space-y-3">
                      {snelheidOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.implementatieSnelheid === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, implementatieSnelheid: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && (
                              <span className="text-xs opacity-70">{opt.beschrijving}</span>
                            )}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {stap > 1 && (
              <button
                type="button"
                onClick={() => setStap((s) => s - 1)}
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:border-gray-400 transition-colors"
              >
                Terug
              </button>
            )}
            {stap < 3 ? (
              <button
                type="button"
                onClick={() => setStap((s) => s + 1)}
                disabled={!kanVolgende()}
                className="flex-1 bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Volgende stap
              </button>
            ) : (
              <button
                type="button"
                onClick={verstuurScan}
                disabled={!kanVolgende() || loading}
                className="flex-1 bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyse starten...
                  </>
                ) : (
                  <>
                    Bekijk mijn AI-score
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
