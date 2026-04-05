"use client";

import { useState, useEffect } from "react";

const CALENDAR_BOOKING_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2r1GurynCuZKWNZ2LANHLHlc7cbHzbeI3NRwVZJNCj5hrzqsuhRr-SLBbidFplYf1lb_8lHOw5";

type Step =
  | "uitdaging"
  | "bedrijfsgrootte"
  | "budget"
  | "budget-laag"
  | "timeline"
  | "vergadertype"
  | "contact"
  | "boek";

interface Answers {
  uitdaging?: string;
  bedrijfsgrootte?: string;
  budget?: string;
  timeline?: string;
  vergadertype?: string;
  naam?: string;
  email?: string;
  bedrijf?: string;
}

// Steps that count toward progress (excludes branches and final booking screen)
const FLOW: Step[] = ["uitdaging", "bedrijfsgrootte", "budget", "timeline", "vergadertype", "contact", "boek"];
const NUMBERED_STEPS = FLOW.filter((s) => s !== "boek");

function stepNumber(step: Step): number {
  return NUMBERED_STEPS.indexOf(step as typeof NUMBERED_STEPS[number]) + 1;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StrategiegesprekModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("uitdaging");
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    if (open) {
      setStep("uitdaging");
      setAnswers({});
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const isLowBudget = step === "budget-laag";
  const currentStep = isLowBudget ? 3 : stepNumber(step);
  const totalSteps = NUMBERED_STEPS.length;

  function pick(key: keyof Answers, value: string) {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (key === "budget" && value === "< €1.000") {
      setStep("budget-laag");
      return;
    }

    const idx = FLOW.indexOf(step);
    if (idx !== -1 && idx < FLOW.length - 1) {
      setStep(FLOW[idx + 1]);
    }
  }

  function back() {
    if (step === "budget-laag") { setStep("budget"); return; }
    const idx = FLOW.indexOf(step);
    if (idx > 0) setStep(FLOW[idx - 1]);
  }

  const optionClass =
    "group w-full flex items-center justify-between gap-3 border border-black/10 bg-white px-5 py-4 text-sm font-medium text-[#1f1f1f] transition-all hover:border-[#1f1f1f] hover:shadow-sm cursor-pointer text-left";
  const selectedClass = "border-[#1f1f1f] bg-[#f7f7f8] shadow-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Start strategiegesprek"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg bg-[#f2f3f5] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#575760]">
              Strategiegesprek
            </span>
            {!isLowBudget && step !== "boek" && (
              <div className="flex items-center gap-1">
                {NUMBERED_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i < currentStep ? "bg-[#1f1f1f] w-5" : "bg-black/15 w-3"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-[#575760] hover:text-[#1f1f1f] transition-colors"
            aria-label="Sluiten"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {step === "uitdaging" && (
            <StepCard
              eyebrow={`Stap 1 van ${totalSteps}`}
              title="Waar wil je mee beginnen?"
              subtitle="Kies het thema dat het beste past bij je vraag."
            >
              {[
                { label: "AI chatbots & klantenservice", icon: "💬" },
                { label: "AI-agents & procesautomatisering", icon: "⚙️" },
                { label: "Custom AI software", icon: "🛠️" },
                { label: "AI-strategie & quickscan", icon: "🧭" },
                { label: "Ik weet het nog niet", icon: "🤔" },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  className={`${optionClass} ${answers.uitdaging === label ? selectedClass : ""}`}
                  onClick={() => pick("uitdaging", label)}
                >
                  <span className="flex items-center gap-3"><span>{icon}</span>{label}</span>
                  <span className="text-black/30 group-hover:text-black/60 transition-colors">→</span>
                </button>
              ))}
            </StepCard>
          )}

          {step === "bedrijfsgrootte" && (
            <StepCard
              eyebrow={`Stap 2 van ${totalSteps}`}
              title="Hoe groot is je bedrijf?"
              subtitle="Dit helpt ons inschatten welke aanpak het beste past."
            >
              {["1 - 10 medewerkers", "11 - 50 medewerkers", "51 - 200 medewerkers", "200+ medewerkers"].map((label) => (
                <button
                  key={label}
                  className={`${optionClass} ${answers.bedrijfsgrootte === label ? selectedClass : ""}`}
                  onClick={() => pick("bedrijfsgrootte", label)}
                >
                  <span>{label}</span>
                  <span className="text-black/30 group-hover:text-black/60 transition-colors">→</span>
                </button>
              ))}
            </StepCard>
          )}

          {step === "budget" && (
            <StepCard
              eyebrow={`Stap 3 van ${totalSteps}`}
              title="Wat is je beschikbare budget?"
              subtitle="Wees gerust eerlijk - zo kunnen we de juiste verwachtingen scheppen."
            >
              {["< €1.000", "€1.000 - €5.000", "€5.000 - €25.000", "> €25.000"].map((label) => (
                <button
                  key={label}
                  className={`${optionClass} ${answers.budget === label ? selectedClass : ""}`}
                  onClick={() => pick("budget", label)}
                >
                  <span>{label}</span>
                  <span className="text-black/30 group-hover:text-black/60 transition-colors">→</span>
                </button>
              ))}
            </StepCard>
          )}

          {step === "budget-laag" && (
            <StepCard
              eyebrow="Eerlijk antwoord"
              title="Je budget past niet bij onze dienstverlening"
              subtitle="Ons minimum projectbudget start bij €2.500. Dat is geen afwijzing - het is eerlijkheid."
            >
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-sm text-[#575760] leading-relaxed">Wat je wél kunt doen:</p>
                <a
                  href="https://www.linkedin.com/company/maisonblndr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={optionClass}
                >
                  <span className="flex items-center gap-3"><span>💼</span>Volg ons op LinkedIn voor gratis AI-tips</span>
                  <span className="text-black/30">→</span>
                </a>
                <a href="mailto:info@maisonblender.com" className={optionClass}>
                  <span className="flex items-center gap-3"><span>✉️</span>Stuur een e-mail - misschien kunnen we verwijzen</span>
                  <span className="text-black/30">→</span>
                </a>
                <button className="mt-2 text-xs text-[#575760] underline hover:text-[#1f1f1f] transition-colors text-left" onClick={back}>
                  ← Budget aanpassen
                </button>
              </div>
            </StepCard>
          )}

          {step === "timeline" && (
            <StepCard eyebrow={`Stap 4 van ${totalSteps}`} title="Wanneer wil je starten?">
              {[
                { label: "Zo snel mogelijk", sub: "Binnen 1 maand" },
                { label: "Binnenkort", sub: "1 - 3 maanden" },
                { label: "Nog aan het verkennen", sub: "Geen harde deadline" },
              ].map(({ label, sub }) => (
                <button
                  key={label}
                  className={`${optionClass} ${answers.timeline === label ? selectedClass : ""}`}
                  onClick={() => pick("timeline", label)}
                >
                  <span className="flex flex-col">
                    <span>{label}</span>
                    <span className="text-xs text-[#575760] mt-0.5">{sub}</span>
                  </span>
                  <span className="text-black/30 group-hover:text-black/60 transition-colors">→</span>
                </button>
              ))}
            </StepCard>
          )}

          {step === "vergadertype" && (
            <StepCard
              eyebrow={`Stap 5 van ${totalSteps}`}
              title="Hoe wil je afspreken?"
              subtitle="Wij komen graag naar jou toe, of plannen een video-call - wat past het beste?"
            >
              <button
                className={`${optionClass} ${answers.vergadertype === "Op locatie" ? selectedClass : ""}`}
                onClick={() => pick("vergadertype", "Op locatie")}
              >
                <span className="flex flex-col">
                  <span className="flex items-center gap-2"><span>📍</span> Op locatie bij jullie</span>
                  <span className="text-xs text-[#575760] mt-0.5 ml-6">Wij komen naar jou toe</span>
                </span>
                <span className="text-black/30 group-hover:text-black/60 transition-colors">→</span>
              </button>
              <button
                className={`${optionClass} ${answers.vergadertype === "Online via Google Meet" ? selectedClass : ""}`}
                onClick={() => pick("vergadertype", "Online via Google Meet")}
              >
                <span className="flex flex-col">
                  <span className="flex items-center gap-2"><span>💻</span> Online via Google Meet</span>
                  <span className="text-xs text-[#575760] mt-0.5 ml-6">Je ontvangt de Meet-link in de agenda-uitnodiging</span>
                </span>
                <span className="text-black/30 group-hover:text-black/60 transition-colors">→</span>
              </button>
            </StepCard>
          )}

          {step === "contact" && (
            <ContactStep answers={answers} setAnswers={setAnswers} totalSteps={totalSteps} onNext={() => setStep("boek")} />
          )}

          {step === "boek" && (
            <BoekStep answers={answers} onClose={onClose} />
          )}
        </div>

        {/* Back navigation */}
        {step !== "uitdaging" && step !== "budget-laag" && step !== "boek" && (
          <div className="border-t border-black/8 px-6 py-4">
            <button onClick={back} className="text-xs text-[#575760] hover:text-[#1f1f1f] transition-colors">
              ← Vorige stap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepCard({ eyebrow, title, subtitle, children }: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#575760]">{eyebrow}</span>
        <h2 className="text-xl font-black tracking-tight text-[#1f1f1f]" style={{ letterSpacing: "-0.5px" }}>{title}</h2>
        {subtitle && <p className="text-sm text-[#575760] leading-relaxed">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function ContactStep({ answers, setAnswers, totalSteps, onNext }: {
  answers: Answers;
  setAnswers: (a: Answers) => void;
  totalSteps: number;
  onNext: () => void;
}) {
  const [naam, setNaam] = useState(answers.naam ?? "");
  const [email, setEmail] = useState(answers.email ?? "");
  const [bedrijf, setBedrijf] = useState(answers.bedrijf ?? "");
  const [error, setError] = useState("");

  function handleNext() {
    if (!naam.trim() || !email.trim()) { setError("Vul je naam en e-mailadres in."); return; }
    if (!email.includes("@")) { setError("Vul een geldig e-mailadres in."); return; }
    setAnswers({ ...answers, naam, email, bedrijf });
    onNext();
  }

  const inputClass =
    "w-full border border-black/10 bg-white px-4 py-3 text-sm text-[#1f1f1f] placeholder-[#b2b2be] outline-none focus:border-[#1f1f1f] transition-colors";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#575760]">
          Stap {totalSteps} van {totalSteps}
        </span>
        <h2 className="text-xl font-black tracking-tight text-[#1f1f1f]" style={{ letterSpacing: "-0.5px" }}>
          Wie mogen wij verwachten?
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium uppercase tracking-widest text-[#575760]">
              Naam <span className="text-[#b2b2be]">*</span>
            </label>
            <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Jan de Vries" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium uppercase tracking-widest text-[#575760]">Bedrijf</label>
            <input type="text" value={bedrijf} onChange={(e) => setBedrijf(e.target.value)} placeholder="Bedrijfsnaam" className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-medium uppercase tracking-widest text-[#575760]">
            E-mail <span className="text-[#b2b2be]">*</span>
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jan@bedrijf.nl" className={inputClass} />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          onClick={handleNext}
          className="mt-1 w-full rounded-full bg-[#1f1f1f] px-6 py-4 text-sm font-bold text-white transition-all hover:bg-[#3a3a42] hover:shadow-md"
        >
          Doorgaan →
        </button>
      </div>
    </div>
  );
}

function BoekStep({ answers, onClose }: { answers: Answers; onClose: () => void }) {
  const isOnline = answers.vergadertype === "Online via Google Meet";

  const emailBody = [
    `Naam: ${answers.naam ?? ""}`,
    `Bedrijf: ${answers.bedrijf ?? ""}`,
    `Uitdaging: ${answers.uitdaging ?? ""}`,
    `Bedrijfsgrootte: ${answers.bedrijfsgrootte ?? ""}`,
    `Budget: ${answers.budget ?? ""}`,
    `Timeline: ${answers.timeline ?? ""}`,
    `Vergadervoorkeur: ${answers.vergadertype ?? ""}`,
  ].join("%0A");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#575760]">Klaar</span>
        <h2 className="text-xl font-black tracking-tight text-[#1f1f1f]" style={{ letterSpacing: "-0.5px" }}>
          Plan je gratis strategiegesprek
        </h2>
        <p className="text-sm text-[#575760] leading-relaxed">
          Één uur. Wij analyseren je drie grootste tijdvreters en vertellen je welke AI-klaar zijn -
          inclusief een ruwe business case.
          {isOnline && " Je ontvangt de Google Meet-link automatisch in de agenda-uitnodiging."}
        </p>
      </div>

      {answers.vergadertype && (
        <div className="flex items-center gap-2 rounded bg-white border border-black/8 px-4 py-2.5 text-xs text-[#575760]">
          <span>{isOnline ? "💻" : "📍"}</span>
          <span>{isOnline ? "Online via Google Meet" : "Op locatie bij jullie"}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <a
          href={CALENDAR_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-between rounded-full bg-[#1f1f1f] px-8 py-5 text-sm font-bold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg"
        >
          <span>Kies een datum in de agenda</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs text-[#575760]">of</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <a
          href={`mailto:info@maisonblender.com?subject=Strategiegesprek aanvraag${answers.bedrijf ? ` - ${answers.bedrijf}` : ""}&body=${emailBody}`}
          className="group flex w-full items-center justify-between border border-black/10 bg-white px-8 py-4 text-sm font-medium text-[#1f1f1f] transition-all hover:border-black/20 hover:shadow-sm"
        >
          <span>Stuur een e-mail</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>

        <a
          href="tel:+31462004035"
          className="group flex w-full items-center justify-between border border-black/10 bg-white px-8 py-4 text-sm font-medium text-[#1f1f1f] transition-all hover:border-black/20 hover:shadow-sm"
        >
          <span>Bel ons: +31 (0)46 200 4035</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <p className="text-xs text-[#b2b2be]">Geen verplichtingen. Geen pitch. Gewoon eerlijk advies.</p>
    </div>
  );
}
