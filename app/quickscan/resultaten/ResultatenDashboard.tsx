"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ScanAntwoorden, ScanResultaat, LeadGegevens } from "@/lib/quickscan/types";
import StrategiegesprekModal from "@/components/StrategiegesprekModal";

const SCORE_LABELS = {
  beginner: { kleur: "text-gray-600", bg: "bg-gray-100", label: "Beginner" },
  bewust: { kleur: "text-blue-600", bg: "bg-blue-50", label: "Bewust" },
  actief: { kleur: "text-green-600", bg: "bg-green-50", label: "Actief" },
  voorloper: { kleur: "text-purple-600", bg: "bg-purple-50", label: "Voorloper" },
  koploper: { kleur: "text-orange-600", bg: "bg-orange-50", label: "Koploper" },
};

// Render markdown-like text as styled HTML elements with color indicators.
// Sections whose heading matches warning keywords get orange; positive keywords get green.
function renderAnalyse(text: string): React.ReactNode[] {
  // Normalise em-dashes to hyphens
  const normalised = text.replace(/—/g, "-");
  const lines = normalised.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  function sectionColor(heading: string): { border: string; dot: string } {
    const lc = heading.toLowerCase();
    if (/waarschuw|risico|let op|opgelet/.test(lc))
      return { border: "border-l-orange-400", dot: "bg-orange-400" };
    if (/kans|winst|aanbevel|eerste stap|opport|positief|start/.test(lc))
      return { border: "border-l-green-500", dot: "bg-green-500" };
    return { border: "border-l-[#b2b2be]", dot: "bg-[#b2b2be]" };
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Bold headings: **Heading** or ## Heading or ### Heading
    const boldHeadingMatch = line.match(/^\*\*(.+?)\*\*:?\s*$/) || line.match(/^#{1,3}\s+(.+)$/);
    if (boldHeadingMatch) {
      const heading = boldHeadingMatch[1].replace(/\*\*/g, "");
      const { border, dot } = sectionColor(heading);
      nodes.push(
        <div key={key++} className={`flex items-center gap-2 mt-6 mb-2`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
          <h3 className="font-semibold text-sm text-[#1f1f1f] uppercase tracking-wide">{heading}</h3>
        </div>
      );
      i++;
      continue;
    }

    // Bullet list items: - item or * item
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      nodes.push(
        <ul key={key++} className="space-y-1 mb-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-[#575760]">
              <span className="mt-2 w-1 h-1 rounded-full bg-black/30 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraph (non-empty line)
    if (line.trim()) {
      nodes.push(
        <p
          key={key++}
          className="text-sm leading-relaxed text-[#575760] mb-3"
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
        />
      );
    }

    i++;
  }

  return nodes;
}

// Convert inline **bold** to <strong> and remove stray markdown chars
function inlineFormat(text: string): string {
  return text
    .replace(/—/g, "-")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function OpportunityHeatmap({ data }: { data: ScanResultaat["opportunityMapData"] }) {
  function heatmapColors(potentieel: number): { bg: string; border: string; text: string } {
    if (potentieel >= 70) return { bg: "rgba(22, 163, 74, 0.12)", border: "rgba(22, 163, 74, 0.3)", text: "#15803d" };
    if (potentieel >= 40) return { bg: "rgba(234, 88, 12, 0.10)", border: "rgba(234, 88, 12, 0.25)", text: "#c2410c" };
    return { bg: "rgba(220, 38, 38, 0.10)", border: "rgba(220, 38, 38, 0.25)", text: "#b91c1c" };
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {data.map((item) => {
        const { bg, border, text } = heatmapColors(item.potentieel);
        return (
          <div
            key={item.gebied}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: bg, border: `1px solid ${border}` }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: text }}>
              {item.potentieel}%
            </div>
            <div className="text-xs font-medium" style={{ color: text }}>{item.gebied}</div>
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

function ActieplanVerzender({
  antwoorden,
  resultaat,
  lead,
}: {
  antwoorden: ScanAntwoorden;
  resultaat: ScanResultaat;
  lead: LeadGegevens;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verstuur() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quickscan/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, antwoorden, resultaat }),
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
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2 text-[#1f1f1f]">AI Kansenkaart onderweg!</h3>
        <p className="text-[#575760] text-sm">
          Controleer je inbox op <strong>{lead.email}</strong>. Je ontvangt het gepersonaliseerde actieplan binnen enkele minuten.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#f2f3f5] rounded-xl p-4 text-sm text-[#575760]">
        <p className="font-semibold text-[#1f1f1f] mb-1">{lead.naam} — {lead.bedrijf}</p>
        <p>{lead.email}{lead.telefoon ? ` · ${lead.telefoon}` : ""}</p>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="button"
        onClick={verstuur}
        disabled={loading}
        className="w-full rounded-full bg-[#1f1f1f] text-white font-semibold py-3 hover:bg-[#3a3a42] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Actieplan genereren...
          </>
        ) : (
          "Stuur mij de AI Kansenkaart"
        )}
      </button>
      <p className="text-xs text-[#b2b2be] text-center">
        Geen spam. Je ontvangt alleen de kansenkaart en een eventuele follow-up van MAISON BLNDR.
      </p>
    </div>
  );
}

export default function ResultatenDashboard() {
  const router = useRouter();
  const [antwoorden, setAntwoorden] = useState<ScanAntwoorden | null>(null);
  const [resultaat, setResultaat] = useState<ScanResultaat | null>(null);
  const [lead, setLead] = useState<LeadGegevens | null>(null);
  const [analysetekst, setAnalysetekst] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [analyseKlaar, setAnalyseKlaar] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

    // Laad lead gegevens (opgeslagen in stap 5 van de scan)
    const opgeslagenLead = sessionStorage.getItem("quickscan_lead");
    if (opgeslagenLead) {
      try {
        setLead(JSON.parse(opgeslagenLead) as LeadGegevens);
      } catch {
        // lead ontbreekt, resultatenpagina toont zonder actieplan-verzendknop
      }
    }

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
          <p className="text-[#575760] text-sm">AI analyseert jouw bedrijfsprofiel...</p>
        </div>
      </div>
    );
  }

  const scoreMeta = SCORE_LABELS[resultaat.scoreLabel];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <StrategiegesprekModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Header */}
      <header className="bg-white border-b border-black/[0.06] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-lg text-[#1f1f1f]">MAISON BLNDR</a>
          <span className="text-[#575760] text-sm">AI Quickscan Resultaten</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-black/[0.06]"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <ScoreGauge score={resultaat.aiReadinessScore} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className={`inline-flex items-center gap-2 ${scoreMeta.bg} ${scoreMeta.kleur} px-3 py-1 rounded-full text-sm font-semibold mb-3`}>
                <span>{scoreMeta.label}</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1f1f1f] mb-2">Jouw AI Readiness Score</h1>
              <p className="text-[#575760] mb-4">{resultaat.scoreBeschrijving}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1f1f1f]">{resultaat.benchmarkPercentiel}%</div>
                  <div className="text-xs text-[#575760]">beter dan jouw sector</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1f1f1f]">
                    €{(resultaat.roiTotaal / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-[#575760]">ROI potentieel/jaar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1f1f1f]">{resultaat.tijdsbesparingTotaal}u</div>
                  <div className="text-xs text-[#575760]">besparing/week</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4 pt-4 border-t border-black/[0.06]">
                <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  resultaat.governanceRisico === "laag"
                    ? "bg-green-50 text-green-700"
                    : resultaat.governanceRisico === "midden"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                }`}>
                  Governance risico: {resultaat.governanceRisico}
                </div>
                <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  resultaat.cultuurReadiness === "hoog"
                    ? "bg-green-50 text-green-700"
                    : resultaat.cultuurReadiness === "midden"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                }`}>
                  Cultuur readiness: {resultaat.cultuurReadiness}
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
          className="bg-white rounded-2xl p-8 shadow-sm border border-black/[0.06]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#1f1f1f] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="font-bold text-lg text-[#1f1f1f]">AI Analyse</h2>
            {analysing && (
              <div className="flex items-center gap-2 text-sm text-[#575760]">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Analyseert...
              </div>
            )}
          </div>
          <div ref={analyseRef} className="min-h-[100px]">
            {analysetekst ? (
              <div>
                {renderAnalyse(analysetekst)}
                {analysing && (
                  <span className="inline-block w-1 h-4 bg-[#1f1f1f] animate-pulse ml-1" />
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-4 bg-[#f2f3f5] rounded animate-pulse ${i === 3 ? "w-2/3" : "w-full"}`} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Kansen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-black/[0.06]"
        >
          <h2 className="font-bold text-lg mb-6 text-[#1f1f1f]">Top AI-kansen voor jouw bedrijf</h2>
          <div className="space-y-4">
            {resultaat.topKansen.map((kans, i) => (
              <div key={kans.functie} className="flex items-start gap-4 p-4 bg-[#f2f3f5] rounded-xl">
                <div className="w-8 h-8 bg-[#1f1f1f] text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#1f1f1f]">{kans.functie}</h3>
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
                  <p className="text-sm text-[#575760] mb-3">{kans.beschrijving}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-700 font-semibold">
                      €{kans.roiEurosPerJaar.toLocaleString("nl-NL")}/jaar
                    </span>
                    <span className="text-[#575760]">{kans.tijdsbesparing}u/week besparing</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-[#1f1f1f]">{kans.potentieel}%</div>
                  <div className="text-xs text-[#575760]">potentieel</div>
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
          className="bg-white rounded-2xl p-8 shadow-sm border border-black/[0.06]"
        >
          <h2 className="font-bold text-lg mb-2 text-[#1f1f1f]">AI Opportunity Map</h2>
          <p className="text-sm text-[#575760] mb-6">
            Heatmap van AI-potentieel per bedrijfsfunctie - donkerder = hoger potentieel
          </p>
          <OpportunityHeatmap data={resultaat.opportunityMapData} />
        </motion.div>

        {/* Actieplan verzenden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1f1f1f] rounded-2xl p-8 shadow-sm"
        >
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2 text-white">
                Ontvang jouw AI Kansenkaart per e-mail
              </h2>
              <p className="text-white/60 text-sm">
                Een volledig gepersonaliseerd actieplan met 90-dagen roadmap, ROI-berekening,
                governance advies en concrete eerste stappen — gegenereerd door AI op basis van jouw intake.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-[#1f1f1f]">
              {lead ? (
                <ActieplanVerzender antwoorden={antwoorden} resultaat={resultaat} lead={lead} />
              ) : (
                <div className="text-center text-sm text-[#575760] py-4">
                  <p>Gegevens niet gevonden.</p>
                  <a href="/quickscan/scan" className="underline mt-2 inline-block">Vul de scan opnieuw in</a>
                </div>
              )}
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
          <p className="text-[#575760] text-sm mb-4">
            Wil je direct sparren met een AI-expert?
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] text-white font-semibold px-6 py-3 hover:bg-[#3a3a42] transition-colors"
          >
            Plan gratis strategiegesprek
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
