"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  XCircle,
  CircleDashed,
  ArrowRight,
  ArrowLeft,
  Filter,
  Loader2,
  ExternalLink,
  Code2,
  ClipboardCopy,
  Check,
  Eye,
  MousePointerClick,
  BookOpen,
  Wrench,
  Lock,
  Mail,
} from "lucide-react";
import type {
  AuditFinding,
  AuditLead,
  AuditReport,
  CategoryScore,
  Impact,
  Priority,
} from "@/lib/a11y/types";

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const IMPACT_LABEL: Record<Impact, string> = {
  critical: "Kritiek",
  serious: "Hoog",
  moderate: "Middel",
  minor: "Laag",
};

const CATEGORY_ICON = {
  perceivable: Eye,
  operable: MousePointerClick,
  understandable: BookOpen,
  robust: Wrench,
} as const;

const IMPACT_ICON: Record<Impact, typeof AlertOctagon> = {
  critical: AlertOctagon,
  serious: AlertTriangle,
  moderate: Info,
  minor: Info,
};

const CONFORMANCE_LABEL: Record<AuditReport["conformance"], { label: string; tone: string }> = {
  "non-conformant": { label: "Niet-conformant", tone: "bg-rose-50 text-rose-700 border-rose-200" },
  partial: { label: "Gedeeltelijk conform", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  substantial: { label: "Grotendeels conform", tone: "bg-lime-50 text-lime-700 border-lime-200" },
  conformant: { label: "Conform (indicatief)", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function impactBadge(impact: Impact): string {
  switch (impact) {
    case "critical":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "serious":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "moderate":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "minor":
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function priorityBadge(priority: Priority): string {
  switch (priority) {
    case "P1":
      return "bg-[#1f1f1f] text-white";
    case "P2":
      return "bg-[#3a3a42] text-white";
    case "P3":
      return "bg-[#b2b2be]/20 text-[#1f1f1f]";
    case "P4":
      return "bg-[#f2f3f5] text-[#575760] border border-black/[0.06]";
  }
}

function scoreColor(score: number): { text: string; bar: string; ring: string } {
  if (score >= 90) return { text: "text-emerald-600", bar: "bg-emerald-500", ring: "ring-emerald-200" };
  if (score >= 75) return { text: "text-lime-600", bar: "bg-lime-500", ring: "ring-lime-200" };
  if (score >= 55) return { text: "text-amber-600", bar: "bg-amber-500", ring: "ring-amber-200" };
  if (score >= 35) return { text: "text-orange-600", bar: "bg-orange-500", ring: "ring-orange-200" };
  return { text: "text-rose-600", bar: "bg-rose-500", ring: "ring-rose-200" };
}

// ---------------------------------------------------------------------------
// Component — 3-fase funnel: url → lead → report
// ---------------------------------------------------------------------------

type Phase = "url" | "lead" | "loading" | "report";
type FilterImpact = "all" | Impact;

export default function AuditDashboard() {
  const [phase, setPhase] = useState<Phase>("url");
  const [url, setUrl] = useState("");
  const [lead, setLead] = useState<Partial<AuditLead>>({});
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingLabel, setLoadingLabel] = useState("Audit voorbereiden…");
  const [filter, setFilter] = useState<FilterImpact>("all");

  const reportRef = useRef<HTMLDivElement | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  const goToLeadStep = useCallback(() => {
    if (!url.trim()) {
      setError("Voer een URL in om te beginnen.");
      return;
    }
    setError(null);
    setPhase("lead");
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, [url]);

  const submitLead = useCallback(async () => {
    const v = (lead.voornaam ?? "").trim();
    const a = (lead.achternaam ?? "").trim();
    const b = (lead.bedrijf ?? "").trim();
    const e = (lead.email ?? "").trim();
    if (!v || !a || !b || !e || !EMAIL_RE.test(e)) {
      setError("Vul je naam, bedrijf en een geldig e-mailadres in.");
      return;
    }
    if (!lead.toestemming) {
      setError("Bevestig de toestemming voor gegevensverwerking.");
      return;
    }

    setError(null);
    setPhase("loading");

    const phases = [
      "URL valideren…",
      "HTML ophalen…",
      "DOM-structuur parsen…",
      "WCAG 2.1 AA-regels uitvoeren…",
      "Mappen op EN 301 549…",
      "Score berekenen & rapport opbouwen…",
      "Rapport verzenden naar je inbox…",
    ];
    let i = 0;
    setLoadingLabel(phases[0]);
    const interval = setInterval(() => {
      i = Math.min(i + 1, phases.length - 1);
      setLoadingLabel(phases[i]);
    }, 850);

    try {
      const res = await fetch("/api/toegankelijkheidsaudit/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          lead: {
            voornaam: v,
            achternaam: a,
            bedrijf: b,
            email: e,
            telefoon: (lead.telefoon ?? "").trim() || undefined,
            toestemming: lead.toestemming === true,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Audit mislukt.");
      }
      setReport(data.report as AuditReport);
      setPhase("report");
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      setError((err as Error).message);
      setPhase("lead");
    } finally {
      clearInterval(interval);
    }
  }, [url, lead]);

  const filteredFindings = useMemo(() => {
    if (!report) return [];
    return report.findings.filter((f) => {
      if (filter === "all") return true;
      return f.result.status === "fail" && f.result.impact === filter;
    });
  }, [report, filter]);

  const failedFindings = useMemo(
    () => (report ? report.findings.filter((f) => f.result.status === "fail") : []),
    [report]
  );

  return (
    <div className="bg-[#f2f3f5]">
      {/* ---------- Funnel ---------- */}
      <section
        ref={dashboardRef}
        className="relative overflow-hidden bg-[#f2f3f5] px-6 py-14 lg:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, #b2b2be 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
            {/* Funnel card */}
            <div className="border border-black/[0.06] bg-white p-6 sm:p-8 lg:p-10">
              <FunnelStepper phase={phase} report={report} />

              <AnimatePresence mode="wait">
                {phase === "url" && (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be]">
                      {"// Stap 1 — URL"}
                    </p>
                    <h2
                      className="mt-2 text-[24px] font-normal leading-tight tracking-tight text-[#1f1f1f] sm:text-[28px]"
                      style={{ letterSpacing: "-0.5px" }}
                    >
                      Welke pagina wil je toetsen?
                    </h2>
                    <p className="mt-3 max-w-lg leading-relaxed text-[#575760]">
                      Plak een publiek bereikbare URL — bijvoorbeeld de homepage of een
                      kritiek conversiepad.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        goToLeadStep();
                      }}
                      className="mt-6 flex flex-col gap-3 sm:flex-row"
                    >
                      <div className="relative flex-1">
                        <Globe
                          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b2b2be]"
                          strokeWidth={1.5}
                        />
                        <input
                          type="text"
                          inputMode="url"
                          autoComplete="url"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="w-full rounded-full border border-black/10 bg-white py-4 pl-11 pr-4 text-sm text-[#1f1f1f] placeholder:text-[#b2b2be] focus:border-[#1f1f1f] focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
                      >
                        Start audit <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {phase === "lead" && (
                  <motion.div
                    key="lead"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mt-6 flex items-center justify-between gap-3 border border-black/[0.06] bg-[#f2f3f5] px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Globe className="h-4 w-4 shrink-0 text-[#575760]" strokeWidth={1.5} />
                        <span className="truncate font-mono text-xs text-[#1f1f1f]">{url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPhase("url")}
                        className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-[#575760] hover:text-[#1f1f1f]"
                      >
                        <ArrowLeft className="h-3 w-3" /> Wijzig
                      </button>
                    </div>

                    <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be]">
                      {"// Stap 2 — Bezorging"}
                    </p>
                    <h2
                      className="mt-2 text-[24px] font-normal leading-tight tracking-tight text-[#1f1f1f] sm:text-[28px]"
                      style={{ letterSpacing: "-0.5px" }}
                    >
                      Naar welk e-mailadres mogen we je rapport sturen?
                    </h2>
                    <p className="mt-3 max-w-lg leading-relaxed text-[#575760]">
                      Je ontvangt direct het volledige auditrapport — én een PDF-vriendelijke
                      e-mailversie met de prioriteitenlijst, klaar om met je team te delen.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        submitLead();
                      }}
                      className="mt-6 space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldInput
                          label="Voornaam"
                          required
                          value={lead.voornaam ?? ""}
                          onChange={(v) => setLead((p) => ({ ...p, voornaam: v }))}
                          placeholder="Jan"
                        />
                        <FieldInput
                          label="Achternaam"
                          required
                          value={lead.achternaam ?? ""}
                          onChange={(v) => setLead((p) => ({ ...p, achternaam: v }))}
                          placeholder="de Vries"
                        />
                      </div>
                      <FieldInput
                        label="Bedrijfsnaam"
                        required
                        value={lead.bedrijf ?? ""}
                        onChange={(v) => setLead((p) => ({ ...p, bedrijf: v }))}
                        placeholder="Bedrijf B.V."
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldInput
                          label="Zakelijk e-mailadres"
                          required
                          type="email"
                          value={lead.email ?? ""}
                          onChange={(v) => setLead((p) => ({ ...p, email: v }))}
                          placeholder="jij@bedrijf.nl"
                        />
                        <FieldInput
                          label="Telefoon (optioneel)"
                          value={lead.telefoon ?? ""}
                          onChange={(v) => setLead((p) => ({ ...p, telefoon: v }))}
                          placeholder="+31 6 12 34 56 78"
                        />
                      </div>

                      <ConsentRow
                        checked={lead.toestemming === true}
                        onChange={(v) => setLead((p) => ({ ...p, toestemming: v }))}
                      />

                      {error && (
                        <div className="flex items-start gap-2 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-sm text-sm leading-relaxed text-[#b2b2be]">
                          We delen je gegevens met niemand. Lees ons{" "}
                          <Link href="/privacybeleid" className="underline hover:text-[#1f1f1f]">
                            privacybeleid
                          </Link>
                          .
                        </p>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
                        >
                          Toon mijn rapport <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {phase === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-10 flex flex-col items-center justify-center gap-5 py-10"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                      <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-black/[0.06] bg-white">
                        <Loader2 className="h-7 w-7 animate-spin text-[#1f1f1f]" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#b2b2be]">
                        {"// Audit loopt"}
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingLabel}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 text-base font-medium text-[#1f1f1f]"
                        >
                          {loadingLabel}
                        </motion.p>
                      </AnimatePresence>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#575760]">
                        We sturen je rapport tegelijk naar {lead.email}.
                      </p>
                    </div>
                  </motion.div>
                )}

                {phase === "report" && report && (
                  <motion.div
                    key="report-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="mt-6 flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold leading-relaxed">Rapport verzonden naar {lead.email}.</p>
                      <p className="mt-1 leading-relaxed text-emerald-700/80">
                        Het volledige interactieve dashboard staat hieronder.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && phase === "url" && (
                <div className="mt-4 flex items-start gap-3 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertOctagon className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Audit specs card */}
            <div className="lg:pl-2">
              <div className="border border-black/[0.06] bg-[#1f1f1f] text-white p-7 lg:p-8">
                <p className="mb-5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                  {"// Audit-engine"}
                </p>
                <div className="grid grid-cols-2 gap-5">
                  <SpecRow value="13" label="Statische regels" />
                  <SpecRow value="22+" label="WCAG SC's" />
                  <SpecRow value="9.x" label="EN 301 549 v3.2.1" />
                  <SpecRow value="< 12s" label="Doorlooptijd" />
                </div>
                <div className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/70">
                  Server-side fetch · regex-gebaseerde parsing · gewogen scoring per impact.
                  De audit is deterministisch — dezelfde URL geeft altijd hetzelfde rapport.
                </div>
                <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50">
                  <Lock className="h-3 w-3" /> SSRF-bescherming · rate-limited
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Report ---------- */}
      <div ref={reportRef} />
      <AnimatePresence>
        {report && phase === "report" && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="px-6 py-16 lg:py-20"
          >
            <div className="mx-auto max-w-6xl space-y-8">
              <ReportHeader report={report} />
              <Scorecard report={report} />
              <CategoryGrid scores={report.categoryScores} />
              <ImpactBreakdown report={report} />
              <RuleMatrix report={report} />
              <PrioritiesList
                findings={filteredFindings}
                totalFailed={failedFindings.length}
                filter={filter}
                onFilterChange={setFilter}
              />
              <Disclaimer report={report} />
              <ContactCta />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {!report && <CoverageStrip />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Funnel UI
// ---------------------------------------------------------------------------

function FunnelStepper({ phase, report }: { phase: Phase; report: AuditReport | null }) {
  const steps = [
    { id: "url", label: "URL" },
    { id: "lead", label: "Gegevens" },
    { id: "report", label: "Rapport" },
  ] as const;

  const isActive = (id: typeof steps[number]["id"]) => {
    if (id === "url") return phase === "url";
    if (id === "lead") return phase === "lead" || phase === "loading";
    return phase === "report";
  };
  const isDone = (id: typeof steps[number]["id"]) => {
    if (id === "url") return phase !== "url";
    if (id === "lead") return phase === "report" || (phase === "loading" && !!report);
    return false;
  };

  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const active = isActive(s.id);
        const done = isDone(s.id);
        return (
          <div key={s.id} className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-[#1f1f1f] text-white"
                      : "bg-[#f2f3f5] text-[#b2b2be] border border-black/[0.06]"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span
                className={`text-[11px] uppercase tracking-widest ${
                  active || done ? "text-[#1f1f1f]" : "text-[#b2b2be]"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`h-px flex-1 ${
                  done || (active && i === 1) ? "bg-[#1f1f1f]/20" : "bg-black/[0.06]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-mono uppercase tracking-[0.18em] text-[#575760]">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-[#1f1f1f] placeholder:text-[#b2b2be] focus:border-[#1f1f1f] focus:outline-none"
      />
    </div>
  );
}

function ConsentRow({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 border border-black/[0.06] bg-[#f8f8fa] px-4 py-3 text-left transition-colors hover:bg-[#f2f3f5]"
    >
      <span
        className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked ? "border-[#1f1f1f] bg-[#1f1f1f]" : "border-[#b2b2be] bg-white"
        }`}
      >
        {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      </span>
      <span className="text-sm leading-relaxed text-[#575760]">
        Ik geef MAISON BLNDR toestemming om mijn gegevens te verwerken voor het toezenden
        van dit auditrapport en eventuele opvolging. Geen verkoop aan derden.
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Sub-components — verslag
// ---------------------------------------------------------------------------

function SpecRow({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-medium tracking-tight text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">{label}</p>
    </div>
  );
}

function ReportHeader({ report }: { report: AuditReport }) {
  const conf = CONFORMANCE_LABEL[report.conformance];
  return (
    <div className="border border-black/[0.06] bg-white p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be] mb-2">
            {"// Auditrapport"}
          </p>
          <a
            href={report.finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-2 truncate text-base font-semibold text-[#1f1f1f] hover:underline"
          >
            <span className="truncate">{report.finalUrl}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#b2b2be]" />
          </a>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#575760]">
            <span>
              <span className="text-[#b2b2be]">Uitgevoerd:</span>{" "}
              {new Date(report.fetchedAt).toLocaleString("nl-NL")}
            </span>
            <span>
              <span className="text-[#b2b2be]">Doorlooptijd:</span> {(report.durationMs / 1000).toFixed(2)}s
            </span>
            <span>
              <span className="text-[#b2b2be]">HTML:</span>{" "}
              {(report.pageMeta.htmlBytes / 1024).toFixed(1)} KB
            </span>
            {report.pageMeta.lang && (
              <span>
                <span className="text-[#b2b2be]">Lang:</span> {report.pageMeta.lang}
              </span>
            )}
          </div>
        </div>
        <div className={`shrink-0 inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${conf.tone}`}>
          <ShieldCheck className="h-3.5 w-3.5" />
          {conf.label}
        </div>
      </div>
    </div>
  );
}

function Scorecard({ report }: { report: AuditReport }) {
  const c = scoreColor(report.score);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
      <div className="border border-black/[0.06] bg-white p-6 lg:p-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be] mb-4">
          {"// Compliance-score"}
        </p>
        <div className="flex items-end gap-3">
          <span className={`text-[72px] font-normal leading-none tracking-tight ${c.text}`} style={{ letterSpacing: "-2px" }}>
            {report.score}
          </span>
          <span className="pb-2 text-sm text-[#b2b2be]">/ 100</span>
        </div>
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#f2f3f5]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${report.score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${c.bar}`}
          />
        </div>
        <p className="mt-5 leading-relaxed text-[#575760]">
          Gewogen score op basis van geslaagde regels en gewogen impact-aftrek
          (kritiek 12, hoog 8, middel 4, laag 2 punten per voorkomen, max 5 per regel).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Geslaagd" value={report.stats.passed} accent="text-emerald-600" Icon={CheckCircle2} />
        <StatTile label="Gefaald" value={report.stats.failed} accent="text-rose-600" Icon={XCircle} />
        <StatTile label="N.v.t." value={report.stats.notApplicable} accent="text-[#575760]" Icon={CircleDashed} />
        <StatTile
          label="Issues"
          value={Object.values(report.stats.issuesByImpact).reduce((a, b) => a + b, 0)}
          accent="text-[#1f1f1f]"
          Icon={AlertTriangle}
        />
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
  Icon,
}: {
  label: string;
  value: number;
  accent: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="border border-black/[0.06] bg-white p-5">
      <Icon className={`h-4 w-4 ${accent}`} strokeWidth={1.5} />
      <p className={`mt-3 text-3xl font-normal tracking-tight ${accent}`}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-[#575760]">{label}</p>
    </div>
  );
}

function CategoryGrid({ scores }: { scores: CategoryScore[] }) {
  return (
    <div>
      <SectionHeader
        eyebrow="POUR-principes"
        title="Score per categorie"
        subtitle="WCAG 2.1 groepeert succescriteria in vier principes: Perceivable, Operable, Understandable, Robust."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scores.map((cat) => {
          const Icon = CATEGORY_ICON[cat.category];
          const c = scoreColor(cat.score);
          return (
            <div key={cat.category} className="border border-black/[0.06] bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-4 w-4 text-[#1f1f1f]" strokeWidth={1.5} />
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1f1f1f]">{cat.label}</p>
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-normal tracking-tight ${c.text}`}>{cat.score}</span>
                <span className="pb-1 text-xs text-[#b2b2be]">/ 100</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#f2f3f5]">
                <div className={`h-full ${c.bar}`} style={{ width: `${cat.score}%` }} />
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-[#575760]">
                <span className="text-emerald-600">{cat.passed} pass</span>
                <span className="text-rose-600">{cat.failed} fail</span>
                <span className="text-[#b2b2be]">{cat.notApplicable} n.v.t.</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImpactBreakdown({ report }: { report: AuditReport }) {
  const total = Object.values(report.stats.issuesByImpact).reduce((a, b) => a + b, 0);
  const items: { impact: Impact; count: number }[] = (
    ["critical", "serious", "moderate", "minor"] as Impact[]
  ).map((impact) => ({ impact, count: report.stats.issuesByImpact[impact] }));

  return (
    <div>
      <SectionHeader
        eyebrow="Impact-distributie"
        title="Verdeling van issues naar zwaarte"
        subtitle="Een hoge concentratie kritieke en hoog-impact issues betekent dat veel gebruikers nu al worden uitgesloten."
      />
      <div className="mt-6 border border-black/[0.06] bg-white p-6">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#f2f3f5]">
          {items.map((it) => {
            if (total === 0 || it.count === 0) return null;
            const w = (it.count / total) * 100;
            const bar =
              it.impact === "critical"
                ? "bg-rose-500"
                : it.impact === "serious"
                  ? "bg-orange-500"
                  : it.impact === "moderate"
                    ? "bg-amber-400"
                    : "bg-slate-400";
            return <div key={it.impact} className={bar} style={{ width: `${w}%` }} title={`${IMPACT_LABEL[it.impact]}: ${it.count}`} />;
          })}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((it) => {
            const Icon = IMPACT_ICON[it.impact];
            return (
              <div key={it.impact} className="flex items-start gap-3">
                <div className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md border ${impactBadge(it.impact)}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-lg font-medium text-[#1f1f1f]">{it.count}</p>
                  <p className="text-[11px] uppercase tracking-wider text-[#575760]">{IMPACT_LABEL[it.impact]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RuleMatrix({ report }: { report: AuditReport }) {
  return (
    <div>
      <SectionHeader
        eyebrow="WCAG ↔ EN 301 549 mapping"
        title="Regelmatrix"
        subtitle="Per regel zie je status, success criterion (WCAG 2.1) en bijbehorende EN 301 549-clausule."
      />
      <div className="mt-6 overflow-x-auto border border-black/[0.06] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1f1f1f] text-white">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest">Regel</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest border-l border-white/10">WCAG 2.1</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest border-l border-white/10">EN 301 549</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest border-l border-white/10">Issues</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest border-l border-white/10">Impact</th>
            </tr>
          </thead>
          <tbody>
            {report.findings.map((f, idx) => (
              <tr
                key={f.rule.id}
                className={idx % 2 === 1 ? "bg-[#f8f8fa]" : "bg-white"}
              >
                <td className="px-4 py-3 align-top">
                  <StatusBadge status={f.result.status} />
                </td>
                <td className="px-4 py-3 align-top text-[#1f1f1f]">
                  <p className="font-medium">{f.rule.title}</p>
                  <p className="mt-0.5 text-xs text-[#575760]">
                    {categoryLabel(f.rule.category)}
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-xs text-[#575760] border-l border-black/[0.05]">
                  <p className="font-mono text-[#1f1f1f]">{f.rule.wcag.sc}</p>
                  <p className="mt-0.5">
                    {f.rule.wcag.name} <span className="text-[#b2b2be]">({f.rule.wcag.level})</span>
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-xs text-[#575760] border-l border-black/[0.05]">
                  <p className="font-mono text-[#1f1f1f]">§ {f.rule.en301549}</p>
                </td>
                <td className="px-4 py-3 align-top text-right border-l border-black/[0.05]">
                  {f.result.status === "fail" ? (
                    <span className="font-mono text-sm text-[#1f1f1f]">{f.result.count}</span>
                  ) : (
                    <span className="text-[#b2b2be]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 align-top border-l border-black/[0.05]">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${impactBadge(
                      f.result.impact
                    )}`}
                  >
                    {IMPACT_LABEL[f.result.impact]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function categoryLabel(cat: keyof typeof CATEGORY_ICON): string {
  switch (cat) {
    case "perceivable":
      return "Waarneembaar";
    case "operable":
      return "Bedienbaar";
    case "understandable":
      return "Begrijpelijk";
    case "robust":
      return "Robuust";
  }
}

function StatusBadge({ status }: { status: AuditFinding["result"]["status"] }) {
  if (status === "pass")
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Pass
      </span>
    );
  if (status === "fail")
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-rose-700">
        <XCircle className="h-3 w-3" /> Fail
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-600">
      <CircleDashed className="h-3 w-3" /> N.v.t.
    </span>
  );
}

function PrioritiesList({
  findings,
  totalFailed,
  filter,
  onFilterChange,
}: {
  findings: AuditFinding[];
  totalFailed: number;
  filter: FilterImpact;
  onFilterChange: (f: FilterImpact) => void;
}) {
  const options: { id: FilterImpact; label: string }[] = [
    { id: "all", label: `Alles (${totalFailed})` },
    { id: "critical", label: "Kritiek" },
    { id: "serious", label: "Hoog" },
    { id: "moderate", label: "Middel" },
    { id: "minor", label: "Laag" },
  ];
  const failingOnly = findings.filter((f) => f.result.status === "fail");

  return (
    <div>
      <SectionHeader
        eyebrow="Prioriteitenlijst"
        title="Concrete fixes, gerangschikt op prioriteit"
        subtitle="Iedere bevinding is gemapt op WCAG en EN 301 549, voorzien van impact-classificatie en een concrete fix-aanwijzing."
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-black/[0.06] bg-white p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#575760]" strokeWidth={1.5} />
          <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">Filter op impact</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFilterChange(opt.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === opt.id
                  ? "bg-[#1f1f1f] text-white"
                  : "bg-[#f2f3f5] text-[#575760] hover:bg-black/[0.06]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {failingOnly.length === 0 ? (
        <div className="mt-4 flex items-center gap-3 border border-emerald-200 bg-emerald-50 px-5 py-6 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="leading-relaxed">
            Geen geautomatiseerd detecteerbare WCAG 2.1 AA-issues binnen dit filter.
            Voer aanvullend handmatig toetswerk uit voor een volledig oordeel.
          </p>
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {failingOnly.map((f, i) => (
            <FindingCard key={f.rule.id} finding={f} index={i + 1} />
          ))}
        </ol>
      )}
    </div>
  );
}

function FindingCard({ finding, index }: { finding: AuditFinding; index: number }) {
  const [open, setOpen] = useState(index === 1);
  const [copied, setCopied] = useState(false);
  const Icon = IMPACT_ICON[finding.result.impact];
  const guide = finding.rule.guide;

  const copyFix = useCallback(() => {
    const lines = [
      `[${finding.priority}] ${finding.rule.title}`,
      `WCAG ${finding.rule.wcag.sc} ${finding.rule.wcag.name} (${finding.rule.wcag.level}) · EN 301 549 § ${finding.rule.en301549}`,
      `${finding.result.count}× gevonden · impact: ${IMPACT_LABEL[finding.result.impact]}`,
      "",
      "WAT IS ER MIS",
      guide.problem,
      "",
      "WAAROM HET ERTOE DOET",
      guide.impactExplanation,
      "",
      "HOE LOS JE HET OP",
      ...guide.steps.map((s, i) => `${i + 1}. ${s}`),
      "",
      "VOORBEELD — FOUT",
      guide.example.bad,
      "",
      "VOORBEELD — GOED",
      guide.example.good,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [finding, guide]);

  return (
    <li className="border border-black/[0.06] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 px-5 py-5 text-left"
      >
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-mono font-semibold ${priorityBadge(finding.priority)}`}>
            {finding.priority}
          </span>
          <span className="text-[11px] font-mono text-[#b2b2be]">#{String(index).padStart(2, "0")}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider ${impactBadge(
                finding.result.impact
              )}`}
            >
              <Icon className="h-3 w-3" /> {IMPACT_LABEL[finding.result.impact]}
            </span>
            <span className="rounded-md border border-black/[0.06] bg-[#f2f3f5] px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#575760]">
              WCAG {finding.rule.wcag.sc}
            </span>
            <span className="rounded-md border border-black/[0.06] bg-[#f2f3f5] px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#575760]">
              EN § {finding.rule.en301549}
            </span>
            <span className="rounded-md border border-black/[0.06] bg-[#f2f3f5] px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#575760]">
              {finding.result.count}× gevonden
            </span>
          </div>
          <p className="mt-3 text-base font-semibold text-[#1f1f1f]">{finding.rule.title}</p>
          <p className="mt-1 leading-relaxed text-[#575760]">{finding.rule.description}</p>
        </div>
        <span className={`shrink-0 self-center text-[#b2b2be] transition-transform ${open ? "rotate-180" : ""}`}>
          <svg className="h-5 w-5" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-black/[0.06]"
          >
            <div className="space-y-7 px-5 py-6 lg:px-7 lg:py-7">

              {/* 1. Wat is er mis */}
              <FixSection
                eyebrow="Wat is er mis"
                Icon={AlertOctagon}
                tone="rose"
              >
                <p className="leading-relaxed text-[#1f1f1f]">{guide.problem}</p>
                <p className="mt-2 leading-relaxed text-[#575760]">{guide.impactExplanation}</p>
              </FixSection>

              {/* 2. Voorbeelden uit je pagina */}
              {finding.result.examples.length > 0 && (
                <FixSection
                  eyebrow={`Aangetroffen op je pagina (${finding.result.count}× totaal)`}
                  Icon={Code2}
                  tone="slate"
                >
                  <div className="space-y-2">
                    {finding.result.examples.map((ex, i) => (
                      <pre
                        key={i}
                        className="overflow-x-auto whitespace-pre-wrap break-all rounded-md border border-black/[0.06] bg-[#1f1f1f] px-4 py-3 font-mono text-[13px] leading-relaxed text-rose-300"
                      >
                        {ex}
                      </pre>
                    ))}
                  </div>
                </FixSection>
              )}

              {/* 3. Hoe los je het op */}
              <FixSection
                eyebrow="Hoe los je het op"
                Icon={Wrench}
                tone="emerald"
              >
                <ol className="space-y-3">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed text-[#1f1f1f]">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </FixSection>

              {/* 4. Code-voorbeeld bad → good */}
              <FixSection
                eyebrow="Code-voorbeeld"
                Icon={Code2}
                tone="slate"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-600">
                      <XCircle className="h-3.5 w-3.5" /> Fout
                    </p>
                    <pre className="overflow-x-auto whitespace-pre rounded-md border border-rose-200 bg-rose-50/60 px-4 py-3 font-mono text-[13px] leading-relaxed text-[#1f1f1f]">
                      {guide.example.bad}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Goed
                    </p>
                    <pre className="overflow-x-auto whitespace-pre rounded-md border border-emerald-200 bg-emerald-50/60 px-4 py-3 font-mono text-[13px] leading-relaxed text-[#1f1f1f]">
                      {guide.example.good}
                    </pre>
                  </div>
                </div>
              </FixSection>

              {/* 5. Mapping op standaarden */}
              <div className="grid gap-3 sm:grid-cols-2">
                <MappingCell
                  label="WCAG 2.1"
                  primary={`${finding.rule.wcag.sc} ${finding.rule.wcag.name}`}
                  secondary={`Level ${finding.rule.wcag.level}`}
                />
                <MappingCell
                  label="EN 301 549 v3.2.1"
                  primary={`§ ${finding.rule.en301549}`}
                  secondary={`Geharmoniseerde Europese norm voor digitale toegankelijkheid`}
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={copyFix}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#575760] hover:border-[#1f1f1f] hover:text-[#1f1f1f]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" /> Gekopieerd
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-4 w-4" /> Kopieer als ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function FixSection({
  eyebrow,
  Icon,
  tone,
  children,
}: {
  eyebrow: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: "rose" | "emerald" | "slate";
  children: React.ReactNode;
}) {
  const colors = {
    rose: "text-rose-700",
    emerald: "text-emerald-700",
    slate: "text-[#575760]",
  }[tone];
  return (
    <div>
      <p className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${colors}`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={2} /> {eyebrow}
      </p>
      {children}
    </div>
  );
}

function MappingCell({ label, primary, secondary }: { label: string; primary: string; secondary?: string }) {
  return (
    <div className="border border-black/[0.06] bg-[#f2f3f5] p-4">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be]">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-[#1f1f1f]">{primary}</p>
      {secondary && <p className="mt-1 text-xs text-[#575760]">{secondary}</p>}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b2b2be]">{`// ${eyebrow}`}</span>
      <h2
        className="text-[22px] font-normal leading-tight tracking-tight text-[#1f1f1f] sm:text-[26px]"
        style={{ letterSpacing: "-0.5px" }}
      >
        {title}
      </h2>
      {subtitle && <p className="leading-relaxed text-[#575760]">{subtitle}</p>}
    </div>
  );
}

function Disclaimer({ report }: { report: AuditReport }) {
  const items = [
    <>Of alt-tekst <strong className="text-[#1f1f1f]">betekenisvol</strong> is voor het beeld in context.</>,
    <>Of de <strong className="text-[#1f1f1f]">focusvolgorde</strong> logisch is bij toetsenbordnavigatie.</>,
    <>Kleurcontrast in <strong className="text-[#1f1f1f]">dynamische states</strong> (hover, focus, error).</>,
    <>Of foutmeldingen, transcripten en ondertitels <strong className="text-[#1f1f1f]">inhoudelijk correct</strong> zijn.</>,
  ];
  return (
    <div className="border border-amber-200 bg-amber-50/60 p-5 lg:p-6">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700">
        <AlertTriangle className="h-3.5 w-3.5" /> Wat deze audit niet kan zien
      </p>
      <p className="leading-relaxed text-[#3a3a42]">{report.disclaimer}</p>
      <ul className="mt-4 space-y-2 text-[#575760]">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 leading-relaxed">
            <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCta() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border border-black/[0.06] bg-[#1f1f1f] p-6 text-white sm:flex-row sm:items-center lg:p-8">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
          {"// Volledige WCAG/EN 301 549-audit nodig?"}
        </p>
        <p className="text-lg font-semibold leading-snug">
          Wij combineren deze automatische scan met handmatig en gebruikersonderzoek
          tot een formele toegankelijkheidsverklaring.
        </p>
        <p className="mt-2 leading-relaxed text-white/60">
          Inclusief remediatieroadmap, ontwikkelaar-tickets en een herhaaltest na fixes.
        </p>
      </div>
      <Link
        href="/strategiegesprek"
        className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-white/90"
      >
        Plan een gesprek →
      </Link>
    </div>
  );
}

function CoverageStrip() {
  return (
    <section className="bg-white px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Dekking van de scanner"
          title="Wat we wel en niet automatisch toetsen"
          subtitle="Alles dat structureel detecteerbaar is in de DOM zit in de scanner. De rest vereist menselijke beoordeling."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CoverageCard
            title="Wat we wel detecteren"
            tone="positive"
            items={[
              "Ontbrekende alt-attributen op afbeeldingen",
              "Formuliervelden zonder label/aria-label",
              "Links en buttons zonder toegankelijke naam",
              "Iframes zonder title",
              "Heading-structuur en niveau-sprongen",
              "Lang-attribuut, documenttitel, doctype",
              "Viewport meta die zoomen blokkeert",
              "<main>-landmark en skip-link",
              "Dubbele id-attributen",
            ]}
          />
          <CoverageCard
            title="Wat menselijke review vereist"
            tone="warning"
            items={[
              "Betekenisvolheid van alt-tekst in context",
              "Logische focusvolgorde (toetsenbord)",
              "Kleurcontrast in dynamische states",
              "Begrijpelijkheid en taalniveau van content",
              "Correctheid van transcripten en captions",
              "Werking van complexe widgets (ARIA-patronen)",
            ]}
          />
          <CoverageCard
            title="Mapping op normen"
            tone="neutral"
            items={[
              "WCAG 2.1 — A en AA success criteria",
              "EN 301 549 v3.2.1 hoofdstuk 9 (Web)",
              "Toegankelijkheidsbesluit (NL) verwijst naar EN 301 549",
              "Europese Toegankelijkheidsrichtlijn (EAA) — vanaf 28-06-2025",
              "Web Accessibility Directive (overheden)",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function CoverageCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "warning" | "neutral";
}) {
  const accent =
    tone === "positive"
      ? "border-l-emerald-500"
      : tone === "warning"
        ? "border-l-amber-500"
        : "border-l-[#1f1f1f]";
  const dot =
    tone === "positive"
      ? "bg-emerald-500"
      : tone === "warning"
        ? "bg-amber-500"
        : "bg-[#1f1f1f]";
  return (
    <div className={`border border-black/[0.06] bg-white p-6 border-l-2 ${accent}`}>
      <p className="mb-4 text-base font-semibold text-[#1f1f1f]">{title}</p>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3 leading-relaxed text-[#575760]">
            <span className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
