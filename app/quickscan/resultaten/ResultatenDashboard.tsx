"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ScanAntwoorden, ScanResultaat } from "@/lib/quickscan/types";

const SCORE_LABELS = {
  beginner: { kleur: "text-gray-600", bg: "bg-gray-100", label: "Beginner" },
  bewust: { kleur: "text-blue-600", bg: "bg-blue-50", label: "Bewust" },
  actief: { kleur: "text-green-600", bg: "bg-green-50", label: "Actief" },
  voorloper: { kleur: "text-purple-600", bg: "bg-purple-50", label: "Voorloper" },
  koploper: { kleur: "text-orange-600", bg: "bg-orange-50", label: "Koploper" },
};

function OpportunityHeatmap({ data }: { data: ScanResultaat["opportunityMapData"] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {data.map((item) => {
        const intensity = item.potentieel / 100;
        const bgOpacity = Math.round(intensity * 9) + 1; // 1-10
        return (
          <div
            key={item.gebied}
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${intensity * 0.15 + 0.03})`,
              border: `1px solid rgba(0,0,0,${intensity * 0.2 + 0.05})`,
            }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: `hsl(${220 + intensity * -100}, 70%, ${50 - intensity * 20}%)` }}
            >
              {item.potentieel}%
            </div>
            <div className="text-xs text-gray-600 font-medium">{item.gebied}</div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" stroke="#f0f0f0" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#0a0a0a"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.05s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-bold text-black">{displayScore}</div>
        <div className="text-xs text-gray-500">van 100</div>
      </div>
    </div>
  );
}

function LeadCaptureForm({
  antwoorden,
  resultaat,
}: {
  antwoorden: ScanAntwoorden;
  resultaat: ScanResultaat;
}) {
  const [email, setEmail] = useState("");
  const [naam, setNaam] = useState("");
  const [bedrijf, setBedrijf] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quickscan/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, naam, bedrijf, antwoorden, resultaat }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Verzenden mislukt. Probeer het opnieuw.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Verbindingsfout. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center p-6">
        <div className="text-4xl mb-3">📨</div>
        <h3 className="font-bold text-lg mb-2">Actieplan onderweg!</h3>
        <p className="text-gray-600 text-sm">
          Controleer je inbox. Je ontvangt het gepersonaliseerde AI Actieplan binnen enkele minuten.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jij@bedrijf.nl"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
          <input
            type="text"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            placeholder="Jan de Vries"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijf</label>
          <input
            type="text"
            value={bedrijf}
            onChange={(e) => setBedrijf(e.target.value)}
            placeholder="Bedrijfsnaam BV"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Actieplan genereren...
          </>
        ) : (
          "Stuur mij het gratis AI Actieplan"
        )}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Geen spam. Je ontvangt alleen het actieplan en eventueel een follow-up van MAISON BLNDR.
      </p>
    </form>
  );
}

export default function ResultatenDashboard() {
  const router = useRouter();
  const [antwoorden, setAntwoorden] = useState<ScanAntwoorden | null>(null);
  const [resultaat, setResultaat] = useState<ScanResultaat | null>(null);
  const [analysetekst, setAnalysetekst] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [analyseKlaar, setAnalyseKlaar] = useState(false);
  const analyseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opgeslagen = sessionStorage.getItem("quickscan_antwoorden");
    if (!opgeslagen) {
      router.replace("/quickscan/scan");
      return;
    }

    let parsedAntwoorden: ScanAntwoorden;
    try {
      parsedAntwoorden = JSON.parse(opgeslagen);
    } catch {
      router.replace("/quickscan/scan");
      return;
    }

    setAntwoorden(parsedAntwoorden);
    setAnalysing(true);

    // Start streaming analyse
    fetch("/api/quickscan/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedAntwoorden),
    }).then(async (res) => {
      if (!res.ok || !res.body) {
        setAnalysing(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "meta") {
              setResultaat(event.resultaat);
            } else if (event.type === "text") {
              setAnalysetekst((prev) => prev + event.delta);
            } else if (event.type === "done") {
              setAnalysing(false);
              setAnalyseKlaar(true);
            } else if (event.type === "error") {
              setAnalysing(false);
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      setAnalysing(false);
      setAnalyseKlaar(true);
    }).catch(() => setAnalysing(false));
  }, [router]);

  if (!antwoorden || !resultaat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="w-16 h-16 border-4 border-black/10 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">AI analyseert jouw bedrijfsprofiel...</p>
        </div>
      </div>
    );
  }

  const scoreMeta = SCORE_LABELS[resultaat.scoreLabel];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-lg">MAISON BLNDR</a>
          <span className="text-white/50 text-sm">AI Quickscan Resultaten</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <ScoreGauge score={resultaat.aiReadinessScore} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className={`inline-flex items-center gap-2 ${scoreMeta.bg} ${scoreMeta.kleur} px-3 py-1 rounded-full text-sm font-semibold mb-3`}>
                <span>{scoreMeta.label}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Jouw AI Readiness Score</h1>
              <p className="text-gray-600 mb-4">{resultaat.scoreBeschrijving}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{resultaat.benchmarkPercentiel}%</div>
                  <div className="text-xs text-gray-500">beter dan jouw sector</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">
                    €{(resultaat.roiTotaal / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-500">ROI potentieel/jaar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{resultaat.tijdsbesparingTotaal}u</div>
                  <div className="text-xs text-gray-500">besparing/week</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Analyse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="font-bold text-lg">AI Analyse</h2>
            {analysing && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Analyseert...
              </div>
            )}
          </div>
          <div ref={analyseRef} className="prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[100px]">
            {analysetekst ? (
              <p className="whitespace-pre-wrap">{analysetekst}</p>
            ) : (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-4 bg-gray-100 rounded animate-pulse ${i === 3 ? "w-2/3" : "w-full"}`} />
                ))}
              </div>
            )}
            {analysing && analysetekst && (
              <span className="inline-block w-1 h-4 bg-black animate-pulse ml-1" />
            )}
          </div>
        </motion.div>

        {/* Top Kansen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h2 className="font-bold text-lg mb-6">Top AI-kansen voor jouw bedrijf</h2>
          <div className="space-y-4">
            {resultaat.topKansen.map((kans, i) => (
              <div key={kans.functie} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{kans.functie}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        kans.prioriteit === "hoog"
                          ? "bg-green-100 text-green-700"
                          : kans.prioriteit === "midden"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {kans.prioriteit} prioriteit
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{kans.beschrijving}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-700 font-semibold">
                      €{kans.roiEurosPerJaar.toLocaleString("nl-NL")}/jaar
                    </span>
                    <span className="text-gray-500">{kans.tijdsbesparing}u/week besparing</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-black">{kans.potentieel}%</div>
                  <div className="text-xs text-gray-400">potentieel</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Opportunity Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h2 className="font-bold text-lg mb-2">AI Opportunity Map</h2>
          <p className="text-sm text-gray-500 mb-6">
            Heatmap van AI-potentieel per bedrijfsfunctie — donkerder = hoger potentieel
          </p>
          <OpportunityHeatmap data={resultaat.opportunityMapData} />
        </motion.div>

        {/* Lead Capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black text-white rounded-2xl p-8 shadow-sm"
        >
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">
                Ontvang jouw gepersonaliseerd AI Actieplan
              </h2>
              <p className="text-white/70 text-sm">
                Een volledig uitgewerkt 15-pagina actieplan met 90-dagen roadmap, ROI-berekening en
                concrete eerste stappen — gegenereerd door AI op basis van jouw scan.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <LeadCaptureForm antwoorden={antwoorden} resultaat={resultaat} />
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 text-sm mb-4">
            Wil je direct sparren met een AI-expert?
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 border-2 border-black text-black font-semibold px-6 py-3 rounded-xl hover:bg-black hover:text-white transition-colors"
          >
            Plan gratis strategiegesprek
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </main>
    </div>
  );
}
