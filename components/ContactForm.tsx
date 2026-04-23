"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      naam: (form.elements.namedItem("naam") as HTMLInputElement).value,
      bedrijf: (form.elements.namedItem("bedrijf") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      bericht: (form.elements.namedItem("bericht") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Verzenden mislukt");
      }

      setFormState("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Er is een fout opgetreden.");
      setFormState("error");
    }
  }

  const inputClass =
    "w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/55 outline-none focus:border-white/30 transition-colors";
  const invalid = formState === "error";

  if (formState === "success") {
    return (
      <div
        className="flex flex-col items-center gap-4 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-3xl" aria-hidden="true">
          ✓
        </div>
        <p className="text-lg font-semibold text-white">Bedankt voor je bericht!</p>
        <p className="text-sm text-white/70">Wij nemen binnen één werkdag contact met je op.</p>
        <button
          type="button"
          onClick={() => setFormState("idle")}
          className="mt-4 text-sm text-white/70 underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2c3e50]"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="naam" className="text-xs font-medium uppercase tracking-widest text-white/70">
            Naam <span className="text-white/55">*</span>
          </label>
          <input
            id="naam"
            name="naam"
            type="text"
            required
            placeholder="Jan de Vries"
            className={inputClass}
            aria-invalid={invalid}
            aria-describedby={invalid ? "contact-form-error" : undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bedrijf" className="text-xs font-medium uppercase tracking-widest text-white/70">
            Bedrijf
          </label>
          <input
            id="bedrijf"
            name="bedrijf"
            type="text"
            placeholder="Je bedrijfsnaam"
            className={inputClass}
            aria-invalid={invalid}
            aria-describedby={invalid ? "contact-form-error" : undefined}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-widest text-white/70">
          E-mail <span className="text-white/55">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jan@bedrijf.nl"
          className={inputClass}
          aria-invalid={invalid}
          aria-describedby={invalid ? "contact-form-error" : undefined}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bericht" className="text-xs font-medium uppercase tracking-widest text-white/70">
          Bericht <span className="text-white/55">*</span>
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          rows={5}
          placeholder="Beschrijf je vraag of situatie..."
          className={inputClass + " resize-none"}
          aria-invalid={invalid}
          aria-describedby={invalid ? "contact-form-error" : undefined}
        />
      </div>

      {formState === "error" && (
        <p id="contact-form-error" role="alert" className="text-sm text-red-400">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "loading"}
        className="group relative mt-2 self-start rounded-full bg-white px-10 py-5 text-base font-bold text-[#1f1f1f] transition-all hover:bg-[#f2f3f5] hover:shadow-lg disabled:opacity-60"
      >
        {formState === "loading" ? "Versturen..." : "Verstuur bericht"}
        {formState !== "loading" && (
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </button>
    </form>
  );
}
