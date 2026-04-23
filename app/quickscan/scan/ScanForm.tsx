"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  sectorOpties,
  omvangOpties,
  rolOpties,
  techStackOpties,
  pijnpuntOpties,
  urenVerliesOpties,
  kernApplicatieOpties,
  dataKwaliteitOpties,
  systeemIntegratieOpties,
  itInfrastructuurOpties,
  gevoeligeDataOpties,
  aiMaturiteitOpties,
  teamSentimentOpties,
  managementBetrokkenheidOpties,
  trainingsbehoefteOpties,
  privacyBeleidOpties,
  euAiActBekendheidOpties,
  aiZorgOpties,
  budgetOpties,
  snelheidOpties,
  type OptionBadge,
} from "@/lib/quickscan/questions";
import type {
  ScanAntwoorden,
  LeadGegevens,
  Pijnpunt,
  KernApplicatie,
  GevoeligeData,
  AiZorg,
  Trainingsbehoefte,
  UrgentieScore,
  RisicoScore,
} from "@/lib/quickscan/types";

const STAP_TITELS = [
  "Vertel ons over je bedrijf",
  "Waar verlies je nu de meeste tijd?",
  "Data, systemen & infrastructuur",
  "Kennis, cultuur & governance",
  "AI-ambitie & jouw gegevens",
];

const STAP_SUBTITELS = [
  "Pijler 1 van 5 — Bedrijfsprofiel",
  "Pijler 2 van 5 — Pijnpunten & urgentie",
  "Pijler 3 van 5 — Technisch fundament",
  "Pijler 4 van 5 — Kennis, cultuur & risico",
  "Pijler 5 van 5 — Ambitie & contact",
];

type PartialAntwoorden = Partial<ScanAntwoorden>;

// Badge-tone → Tailwind classes. Yellow/lime = positive, amber = warning,
// rose = danger, slate = neutral.
const BADGE_CLASSES: Record<OptionBadge["tone"], { active: string; idle: string }> = {
  positive: {
    idle: "border-lime-400 text-lime-700 bg-lime-50",
    active: "border-lime-300 text-lime-100 bg-lime-500/20",
  },
  warning: {
    idle: "border-amber-400 text-amber-700 bg-amber-50",
    active: "border-amber-300 text-amber-100 bg-amber-500/20",
  },
  danger: {
    idle: "border-rose-400 text-rose-700 bg-rose-50",
    active: "border-rose-300 text-rose-100 bg-rose-500/20",
  },
  neutral: {
    idle: "border-gray-300 text-gray-600 bg-gray-50",
    active: "border-white/40 text-white bg-white/10",
  },
};

function Badge({ badge, selected }: { badge: OptionBadge; selected: boolean }) {
  const cls = BADGE_CLASSES[badge.tone];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[11px] font-mono uppercase tracking-wide whitespace-nowrap ${
        selected ? cls.active : cls.idle
      }`}
    >
      {badge.label}
    </span>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  multi,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  multi?: boolean;
  badge?: OptionBadge;
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
        <div className="flex-1 min-w-0">{children}</div>
        {badge && <Badge badge={badge} selected={selected} />}
      </div>
    </button>
  );
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h3 className="block text-lg font-bold leading-snug text-[#1f1f1f] md:text-xl">{children}</h3>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

// ─── 1-10 nummerschaal (urgentie / risico) ──────────────────────────────
function NumberScale({
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  value: number | undefined;
  onChange: (n: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all ${
                selected
                  ? "bg-lime-400 border-lime-500 text-black"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>1 — {lowLabel}</span>
        <span>10 — {highLabel}</span>
      </div>
    </div>
  );
}

export default function ScanForm() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [stap, setStap] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const naarStap = useCallback((nieuweStap: number) => {
    setStap(nieuweStap);
    topRef.current?.scrollIntoView({ behavior: "instant" });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  const [antwoorden, setAntwoorden] = useState<PartialAntwoorden>({
    pijnpunten: [],
    kernApplicaties: [],
    gevoeligeData: [],
    aiZorgen: [],
    trainingsbehoefte: [],
  });
  const [lead, setLead] = useState<Partial<LeadGegevens>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Velden waarbij één optie wederzijds exclusief is met de rest
  // (bijv. "geen specifieke zorgen" sluit alle andere zorgen uit en omgekeerd).
  const EXCLUSIVE_OPTIONS: Partial<Record<keyof PartialAntwoorden, string>> = {
    aiZorgen: "geen_zorgen",
    gevoeligeData: "geen",
    kernApplicaties: "geen",
    trainingsbehoefte: "geen_training_nodig",
  };

  function toggleMulti<T extends string>(
    field: keyof PartialAntwoorden,
    value: T
  ) {
    const huidig = (antwoorden[field] as T[]) ?? [];
    const exclusief = EXCLUSIVE_OPTIONS[field] as T | undefined;
    const isExclusief = exclusief && value === exclusief;
    const alGeselecteerd = huidig.includes(value);

    let nieuw: T[];
    if (alGeselecteerd) {
      nieuw = huidig.filter((v) => v !== value);
    } else if (isExclusief) {
      nieuw = [value];
    } else if (exclusief) {
      nieuw = [...huidig.filter((v) => v !== exclusief), value];
    } else {
      nieuw = [...huidig, value];
    }
    setAntwoorden((prev) => ({ ...prev, [field]: nieuw }));
  }

  function kanVolgende(): boolean {
    switch (stap) {
      case 1:
        return !!(antwoorden.sector && antwoorden.omvang && antwoorden.rol && antwoorden.techStack);
      case 2:
        return (
          (antwoorden.pijnpunten?.length ?? 0) >= 1 &&
          !!antwoorden.urenVerlies &&
          !!antwoorden.urgentie
        );
      case 3:
        return (
          (antwoorden.kernApplicaties?.length ?? 0) >= 1 &&
          !!antwoorden.dataKwaliteit &&
          !!antwoorden.systeemIntegratie &&
          !!antwoorden.itInfrastructuur &&
          (antwoorden.gevoeligeData?.length ?? 0) >= 1
        );
      case 4:
        return !!(
          antwoorden.aiMaturiteit &&
          antwoorden.teamSentiment &&
          antwoorden.managementBetrokkenheid &&
          (antwoorden.trainingsbehoefte?.length ?? 0) >= 1 &&
          antwoorden.privacyBeleid &&
          antwoorden.euAiActBekendheid &&
          antwoorden.risicoOngecontroleerdAi &&
          (antwoorden.aiZorgen?.length ?? 0) >= 1
        );
      case 5:
        return !!(
          antwoorden.budgetBereidheid &&
          antwoorden.implementatieSnelheid &&
          lead.voornaam?.trim() &&
          lead.achternaam?.trim() &&
          lead.bedrijf?.trim() &&
          lead.email?.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email ?? "") &&
          lead.toestemming
        );
      default:
        return false;
    }
  }

  async function verstuurScan() {
    if (!kanVolgende()) return;
    setLoading(true);
    setError(null);

    try {
      const volledigeAntwoorden = antwoorden as ScanAntwoorden;
      const volledigeLead = lead as LeadGegevens;

      try {
        await fetch("/api/quickscan/capture-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead: volledigeLead, antwoorden: volledigeAntwoorden }),
        });
      } catch (captureErr) {
        console.warn("[Quickscan] Lead capture mislukt, ga door naar resultaten:", captureErr);
      }

      sessionStorage.setItem("quickscan_antwoorden", JSON.stringify(volledigeAntwoorden));
      sessionStorage.setItem("quickscan_lead", JSON.stringify(volledigeLead));
      router.push("/quickscan/resultaten");
    } catch {
      setError("Er is iets misgegaan. Probeer het opnieuw.");
      setLoading(false);
    }
  }

  const progressPercentage = ((stap - 1) / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div ref={topRef} />
      {/* Header */}
      <header className="bg-black px-6 py-4 text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            MAISON BLNDR
          </Link>
          <span className="text-white/50 text-sm">AI Readiness Intake</span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Stap {stap} van 5</span>
            <span>{Math.round(progressPercentage)}% voltooid</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-black"
              animate={{ width: `${((stap - 1) / 5) * 100}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
                  s < stap
                    ? "bg-black text-white"
                    : s === stap
                      ? "bg-black text-white ring-2 ring-black ring-offset-2"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {s < stap ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main id="main" tabIndex={-1} className="flex-1 px-6 py-10 outline-none">
        <h1 className="sr-only">AI Readiness Intake</h1>
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={stap}
              aria-live="polite"
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              <div className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {STAP_SUBTITELS[stap - 1]}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{STAP_TITELS[stap - 1]}</h2>
              </div>

              {/* ── Stap 1: Bedrijfsprofiel ── */}
              {stap === 1 && (
                <div className="space-y-6">
                  <div>
                    <SectionLabel>In welke sector is jouw bedrijf actief?</SectionLabel>
                    <div className="space-y-3">
                      {sectorOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.sector === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, sector: opt.value }))}
                          badge={opt.badge}
                        >
                          <span className="font-medium">{opt.label}</span>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Hoeveel medewerkers heeft jouw bedrijf?</SectionLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {omvangOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.omvang === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, omvang: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Wat is jouw functie binnen de organisatie?</SectionLabel>
                    <div className="space-y-3">
                      {rolOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.rol === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, rol: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Hoe omschrijf je de digitale volwassenheid van jouw bedrijf?</SectionLabel>
                    <div className="space-y-3">
                      {techStackOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.techStack === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, techStack: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Stap 2: Pijnpunten & Urgentie ── */}
              {stap === 2 && (
                <div className="space-y-6">
                  <div>
                    <SectionLabel hint="Meerdere antwoorden mogelijk">
                      Welke activiteiten kosten jullie de meeste tijd?
                    </SectionLabel>
                    <div className="space-y-3">
                      {pijnpuntOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={(antwoorden.pijnpunten ?? []).includes(opt.value)}
                          onClick={() => toggleMulti<Pijnpunt>("pijnpunten", opt.value)}
                          multi
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                    {(antwoorden.pijnpunten?.length ?? 0) > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        {antwoorden.pijnpunten?.length} activiteit{(antwoorden.pijnpunten?.length ?? 0) !== 1 ? "en" : ""} geselecteerd
                      </p>
                    )}
                  </div>

                  <div>
                    <SectionLabel>Hoeveel uur per week gaat er gemiddeld verloren aan repetitieve taken (per medewerker)?</SectionLabel>
                    <div className="space-y-3">
                      {urenVerliesOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.urenVerlies === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, urenVerlies: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel hint="Hoe sterk is de wens om processen efficiënter te maken?">
                      Hoe urgent voelt de behoefte aan procesverbetering en automatisering?
                    </SectionLabel>
                    <NumberScale
                      value={antwoorden.urgentie}
                      onChange={(n) =>
                        setAntwoorden((p) => ({ ...p, urgentie: n as UrgentieScore }))
                      }
                      lowLabel="Geen urgentie"
                      highLabel="Zeer urgent"
                    />
                  </div>
                </div>
              )}

              {/* ── Stap 3: Data, Systemen & Infrastructuur ── */}
              {stap === 3 && (
                <div className="space-y-6">
                  <div>
                    <SectionLabel hint="Meerdere antwoorden mogelijk">
                      Welke software of systemen gebruiken jullie?
                    </SectionLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {kernApplicatieOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={(antwoorden.kernApplicaties ?? []).includes(opt.value)}
                          onClick={() => toggleMulti<KernApplicatie>("kernApplicaties", opt.value)}
                          multi
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Hoe zou je de kwaliteit en toegankelijkheid van jullie data omschrijven?</SectionLabel>
                    <div className="space-y-3">
                      {dataKwaliteitOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.dataKwaliteit === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, dataKwaliteit: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Hoe goed zijn jullie systemen met elkaar geïntegreerd?</SectionLabel>
                    <div className="space-y-3">
                      {systeemIntegratieOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.systeemIntegratie === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, systeemIntegratie: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Hoe is jullie IT-infrastructuur ingericht?</SectionLabel>
                    <div className="space-y-3">
                      {itInfrastructuurOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.itInfrastructuur === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, itInfrastructuur: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel hint="Dit bepaalt welke AI-tools veilig ingezet kunnen worden. Meerdere antwoorden mogelijk.">
                      Welke gevoelige data verwerkt jullie organisatie?
                    </SectionLabel>
                    <div className="space-y-3">
                      {gevoeligeDataOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={(antwoorden.gevoeligeData ?? []).includes(opt.value)}
                          onClick={() => toggleMulti<GevoeligeData>("gevoeligeData", opt.value)}
                          multi
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Stap 4: Kennis, Cultuur & Governance ── */}
              {stap === 4 && (
                <div className="space-y-6">
                  <div>
                    <SectionLabel>Wat is het huidige kennisniveau van AI binnen jullie organisatie?</SectionLabel>
                    <div className="space-y-3">
                      {aiMaturiteitOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.aiMaturiteit === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, aiMaturiteit: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Hoe staat het team tegenover AI en nieuwe technologie?</SectionLabel>
                    <div className="space-y-3">
                      {teamSentimentOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.teamSentiment === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, teamSentiment: opt.value }))}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Hoe betrokken is het management bij de AI-agenda?</SectionLabel>
                    <div className="space-y-3">
                      {managementBetrokkenheidOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.managementBetrokkenheid === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, managementBetrokkenheid: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel hint="Meerdere antwoorden mogelijk">
                      Welke trainingsbehoeften zie je voor jullie medewerkers?
                    </SectionLabel>
                    <div className="space-y-3">
                      {trainingsbehoefteOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={(antwoorden.trainingsbehoefte ?? []).includes(opt.value)}
                          onClick={() => toggleMulti<Trainingsbehoefte>("trainingsbehoefte", opt.value)}
                          multi
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Heeft jullie organisatie al richtlijnen voor het gebruik van AI-tools door medewerkers?</SectionLabel>
                    <div className="space-y-3">
                      {privacyBeleidOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.privacyBeleid === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, privacyBeleid: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel hint="De EU AI Act is per augustus 2024 van kracht en stelt eisen aan het gebruik van AI-systemen.">
                      Ben je bekend met de EU AI Act en de implicaties voor jullie organisatie?
                    </SectionLabel>
                    <div className="space-y-3">
                      {euAiActBekendheidOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={antwoorden.euAiActBekendheid === opt.value}
                          onClick={() => setAntwoorden((p) => ({ ...p, euAiActBekendheid: opt.value }))}
                          badge={opt.badge}
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel hint="Bijv. medewerkers die zelf gevoelige data in AI-tools plakken zonder beleid.">
                      Hoe groot schat je het risico in van ongecontroleerd AI-gebruik binnen jullie organisatie?
                    </SectionLabel>
                    <NumberScale
                      value={antwoorden.risicoOngecontroleerdAi}
                      onChange={(n) =>
                        setAntwoorden((p) => ({ ...p, risicoOngecontroleerdAi: n as RisicoScore }))
                      }
                      lowLabel="Geen risico"
                      highLabel="Zeer hoog risico"
                    />
                  </div>

                  <div>
                    <SectionLabel hint="Meerdere antwoorden mogelijk">
                      Wat zijn jullie grootste zorgen bij AI-implementatie?
                    </SectionLabel>
                    <div className="space-y-3">
                      {aiZorgOpties.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={(antwoorden.aiZorgen ?? []).includes(opt.value)}
                          onClick={() => toggleMulti<AiZorg>("aiZorgen", opt.value)}
                          multi
                        >
                          <div>
                            <span className="font-medium block">{opt.label}</span>
                            {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Stap 5: AI Ambitie + Lead Gate ── */}
              {stap === 5 && (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <SectionLabel>Wat is het jaarlijkse budget voor AI-implementatie?</SectionLabel>
                      <div className="space-y-3">
                        {budgetOpties.map((opt) => (
                          <OptionButton
                            key={opt.value}
                            selected={antwoorden.budgetBereidheid === opt.value}
                            onClick={() => setAntwoorden((p) => ({ ...p, budgetBereidheid: opt.value }))}
                          >
                            <div>
                              <span className="font-medium block">{opt.label}</span>
                              {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                            </div>
                          </OptionButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Hoe snel willen jullie aan de slag met AI?</SectionLabel>
                      <div className="space-y-3">
                        {snelheidOpties.map((opt) => (
                          <OptionButton
                            key={opt.value}
                            selected={antwoorden.implementatieSnelheid === opt.value}
                            onClick={() => setAntwoorden((p) => ({ ...p, implementatieSnelheid: opt.value }))}
                          >
                            <div>
                              <span className="font-medium block">{opt.label}</span>
                              {opt.beschrijving && <span className="text-xs opacity-70">{opt.beschrijving}</span>}
                            </div>
                          </OptionButton>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lead Gate */}
                  <div className="border-t-2 border-gray-100 pt-8">
                    <div className="mb-6">
                      <h2 className="mb-2 text-xl font-bold text-gray-900">Ontvang jouw AI Kansenkaart</h2>
                      <p className="text-sm text-gray-500">
                        Vul je gegevens in om de volledige analyse, AI Readiness Score en gepersonaliseerd actieplan te ontvangen.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="scan-lead-voornaam" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Voornaam <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="scan-lead-voornaam"
                            type="text"
                            value={lead.voornaam ?? ""}
                            onChange={(e) => setLead((p) => ({ ...p, voornaam: e.target.value }))}
                            placeholder="Jan"
                            autoComplete="given-name"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="scan-lead-achternaam" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Achternaam <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="scan-lead-achternaam"
                            type="text"
                            value={lead.achternaam ?? ""}
                            onChange={(e) => setLead((p) => ({ ...p, achternaam: e.target.value }))}
                            placeholder="de Vries"
                            autoComplete="family-name"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="scan-lead-bedrijf" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Bedrijfsnaam <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="scan-lead-bedrijf"
                          type="text"
                          value={lead.bedrijf ?? ""}
                          onChange={(e) => setLead((p) => ({ ...p, bedrijf: e.target.value }))}
                          placeholder="Bedrijf BV"
                          autoComplete="organization"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-black focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="scan-lead-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            E-mailadres <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="scan-lead-email"
                            type="email"
                            value={lead.email ?? ""}
                            onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                            placeholder="jij@bedrijf.nl"
                            autoComplete="email"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="scan-lead-telefoon" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Telefoon <span className="font-normal normal-case text-gray-400">(optioneel)</span>
                          </label>
                          <input
                            id="scan-lead-telefoon"
                            type="tel"
                            value={lead.telefoon ?? ""}
                            onChange={(e) => setLead((p) => ({ ...p, telefoon: e.target.value }))}
                            placeholder="+31 6 12345678"
                            autoComplete="tel"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 pt-2">
                        <input
                          id="quickscan-toestemming"
                          type="checkbox"
                          checked={Boolean(lead.toestemming)}
                          onChange={(e) => setLead((p) => ({ ...p, toestemming: e.target.checked }))}
                          className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-gray-300 accent-black"
                        />
                        <label htmlFor="quickscan-toestemming" className="text-xs leading-relaxed text-gray-500">
                          Ik geef toestemming aan MAISON BLNDR om mijn gegevens te verwerken voor het toezenden van de AI Kansenkaart en een eventuele opvolging. Gegevens worden niet gedeeld met derden. Zie onze{" "}
                          <a href="/privacybeleid" className="underline hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
                            privacyverklaring
                          </a>
                          . <span className="text-red-500">*</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {stap > 1 && (
              <button
                type="button"
                onClick={() => naarStap(stap - 1)}
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:border-gray-400 transition-colors"
              >
                Terug
              </button>
            )}
            {stap < 5 ? (
              <button
                type="button"
                onClick={() => naarStap(stap + 1)}
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
                    Bekijk mijn AI Kansenkaart
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
