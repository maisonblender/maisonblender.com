"use client";

import { useState } from "react";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";

type Step = 1 | 2 | 3;

interface FormData {
  naam: string;
  personaNaam: string;
  stad: string;
  contactEmail: string;
  contactTelefoon: string;
  website: string;
  toon: "formeel" | "informeel";
  objectenRaw: string;
  faqRaw: string;
}

interface OnboardingResult {
  tenantId: string;
  accessToken: string;
  dashboardUrl: string;
}

const initialData: FormData = {
  naam: "",
  personaNaam: "",
  stad: "",
  contactEmail: "",
  contactTelefoon: "",
  website: "",
  toon: "informeel",
  objectenRaw: "",
  faqRaw: "",
};

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#1f1f1f]">
        {label} {required && <span className="text-[#575760]">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#575760]">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-white border border-black/10 px-4 py-3 text-sm text-[#1f1f1f] placeholder-[#575760]/60 outline-none focus:border-[#1f1f1f] transition-colors";

export default function OnboardingForm() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [copied, setCopied] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 =
    data.naam.trim().length > 1 && data.contactEmail.trim().includes("@");

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/aicollega/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error || "Aanmelding mislukt.");
      }
      const json = (await res.json()) as OnboardingResult;
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    if (result?.dashboardUrl) {
      navigator.clipboard.writeText(result.dashboardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (result) {
    return (
      <div className="bg-white p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" strokeWidth={1.5} />
          <div>
            <p className="font-bold text-[#1f1f1f]">Jouw AI Collega is aangemaakt.</p>
            <p className="text-sm text-[#575760]">
              Bewaar de dashboard-link — je hebt hem nodig om in te loggen.
            </p>
          </div>
        </div>

        <div className="bg-[#f2f3f5] p-4">
          <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-2">
            Jouw dashboard-link
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-[#1f1f1f] break-all flex-1 font-mono">
              {result.dashboardUrl}
            </p>
            <button
              onClick={copyUrl}
              className="shrink-0 p-2 hover:bg-white transition-colors"
              title="Kopieer link"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-[#575760]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={result.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#1f1f1f] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#3a3a42] transition-colors"
          >
            Open dashboard
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="text-xs text-[#575760] text-center">
            Je krijgt ook een e-mail van MAISON BLNDR met je gegevens en de volgende stappen.
          </p>
        </div>

        <div className="border-t border-black/5 pt-4">
          <p className="text-xs font-medium text-[#1f1f1f] mb-2">Volgende stap: widget op je website</p>
          <p className="text-xs text-[#575760] mb-3">
            Kopieer de onderstaande code en plak hem net voor de sluit-tag van je website.
            Je AI Collega verschijnt direct als chat-knop.
          </p>
          <div className="bg-[#1f1f1f] p-4 font-mono text-xs text-green-400 overflow-x-auto">
            {`<script src="https://maisonblender.com/widget/aicollega.js" data-tenant="${result.tenantId}" defer></script>`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Stap-indicator */}
      <div className="flex border-b border-black/10">
        {([1, 2, 3] as Step[]).map((s) => (
          <div
            key={s}
            className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
              step === s
                ? "border-b-2 border-[#1f1f1f] text-[#1f1f1f]"
                : step > s
                ? "text-[#575760]"
                : "text-[#575760]/40"
            }`}
          >
            {s === 1 && "Kantoorgegevens"}
            {s === 2 && "Objecten & FAQ"}
            {s === 3 && "Bevestigen"}
          </div>
        ))}
      </div>

      <div className="p-8">
        {/* Stap 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <Field label="Naam van je kantoor" required>
              <input
                type="text"
                value={data.naam}
                onChange={(e) => update("naam", e.target.value)}
                placeholder="Makelaardij Van den Berg"
                className={inputClass}
              />
            </Field>

            <Field label="Vestigingsstad" hint="Wordt gebruikt in de intro van je AI Collega">
              <input
                type="text"
                value={data.stad}
                onChange={(e) => update("stad", e.target.value)}
                placeholder="Sittard"
                className={inputClass}
              />
            </Field>

            <Field
              label="Persona-naam (optioneel)"
              hint="Hoe je AI Collega zich aan bezoekers voorstelt. Bv. 'Sophie' of 'Tim'. Leeg laten? Dan heet ze 'Online assistent'."
            >
              <input
                type="text"
                value={data.personaNaam}
                onChange={(e) => update("personaNaam", e.target.value)}
                placeholder="Sophie"
                className={inputClass}
              />
            </Field>

            <Field label="E-mailadres" required hint="Hier komen leadmeldingen naartoe">
              <input
                type="email"
                value={data.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="info@jouwkantoor.nl"
                className={inputClass}
              />
            </Field>

            <Field label="Telefoonnummer" hint="Optioneel — voor klanten die willen bellen">
              <input
                type="tel"
                value={data.contactTelefoon}
                onChange={(e) => update("contactTelefoon", e.target.value)}
                placeholder="046 123 4567"
                className={inputClass}
              />
            </Field>

            <Field label="Website" hint="Optioneel">
              <input
                type="url"
                value={data.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://jouwkantoor.nl"
                className={inputClass}
              />
            </Field>

            <Field
              label="Toon van je AI Collega"
              hint="Formeel = 'u/uw', Informeel = 'je/jij'"
            >
              <div className="flex gap-3">
                {(["informeel", "formeel"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => update("toon", t)}
                    className={`flex-1 py-3 text-sm font-medium border transition-colors ${
                      data.toon === t
                        ? "border-[#1f1f1f] bg-[#1f1f1f] text-white"
                        : "border-black/10 bg-white text-[#575760] hover:border-[#1f1f1f]/40"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </Field>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="mt-2 bg-[#1f1f1f] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#3a3a42] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              Volgende stap
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}

        {/* Stap 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <Field
              label="Actieve objecten"
              hint="Plak een overzicht van je actieve woningen. Adres, type, prijs, kamers, m² — gewone tekst of kopiëren uit een mail is prima."
            >
              <textarea
                value={data.objectenRaw}
                onChange={(e) => update("objectenRaw", e.target.value)}
                placeholder={`Wilhelminastraat 14, Sittard — vrijstaand, €425.000, 5 kamers, 148 m²\nMgr. Buckxstraat 8, Geleen — appartement, €195.000, 3 kamers, 82 m²`}
                rows={6}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field
              label="Veelgestelde vragen"
              hint="Welke vragen krijg je vaak van klanten? Zet ze hier in (vraag + antwoord), dan geeft de AI Collega jouw eigen antwoord."
            >
              <textarea
                value={data.faqRaw}
                onChange={(e) => update("faqRaw", e.target.value)}
                placeholder={`Wat zijn de courtagekosten?\nOnze courtage is 1,5% van de verkoopprijs inclusief BTW.\n\nHoe lang duurt een verkooptraject?\nGemiddeld 4-8 weken in de huidige markt.`}
                rows={6}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <p className="text-xs text-[#575760]">
              Je kunt objecten en FAQ later ook aanpassen via je dashboard. Sla stap 2 gerust
              over als je nu nog geen content hebt.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-black/10 bg-white text-[#1f1f1f] px-6 py-3 text-sm font-medium hover:border-[#1f1f1f]/40 transition-colors"
              >
                Terug
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-[#1f1f1f] text-white px-6 py-3 text-sm font-semibold hover:bg-[#3a3a42] transition-colors"
              >
                Volgende stap
              </button>
            </div>
          </div>
        )}

        {/* Stap 3 — bevestigen */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-3">
                Samenvatting
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Kantoor", value: data.naam },
                  { label: "Stad", value: data.stad || "—" },
                  { label: "Persona-naam", value: data.personaNaam || "Online assistent (default)" },
                  { label: "E-mail", value: data.contactEmail },
                  { label: "Telefoon", value: data.contactTelefoon || "—" },
                  { label: "Toon", value: data.toon === "formeel" ? "Formeel (u/uw)" : "Informeel (je/jij)" },
                  { label: "Objecten", value: data.objectenRaw ? "Ingevuld" : "Overgeslagen" },
                  { label: "FAQ", value: data.faqRaw ? "Ingevuld" : "Overgeslagen" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-black/5">
                    <span className="text-[#575760]">{row.label}</span>
                    <span className="font-medium text-[#1f1f1f]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#575760]">
              Door op &apos;Aanmelden&apos; te klikken ga je akkoord met onze{" "}
              <a href="/privacybeleid" className="underline" target="_blank" rel="noopener noreferrer">
                privacyverklaring
              </a>
              . Je start een gratis proefperiode van 30 dagen. Daarna kun je een abonnement kiezen.
            </p>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-black/10 bg-white text-[#1f1f1f] px-6 py-3 text-sm font-medium hover:border-[#1f1f1f]/40 transition-colors"
              >
                Terug
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 bg-[#1f1f1f] text-white px-6 py-3.5 text-sm font-bold hover:bg-[#3a3a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Aanmaken..." : "Aanmelden — gratis proberen"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
