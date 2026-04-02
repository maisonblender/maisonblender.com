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
    "w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors";

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="text-3xl">✓</div>
        <p className="text-lg font-semibold text-white">Bedankt voor uw bericht!</p>
        <p className="text-sm text-white/60">
          Wij nemen binnen één werkdag contact met u op.
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="mt-4 text-sm text-white/50 underline hover:text-white transition-colors"
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
          <label htmlFor="naam" className="text-xs font-medium uppercase tracking-widest text-white/50">
            Naam <span className="text-white/30">*</span>
          </label>
          <input
            id="naam"
            name="naam"
            type="text"
            required
            placeholder="Jan de Vries"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bedrijf" className="text-xs font-medium uppercase tracking-widest text-white/50">
            Bedrijf
          </label>
          <input
            id="bedrijf"
            name="bedrijf"
            type="text"
            placeholder="Uw bedrijfsnaam"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-widest text-white/50">
          E-mail <span className="text-white/30">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jan@bedrijf.nl"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bericht" className="text-xs font-medium uppercase tracking-widest text-white/50">
          Bericht <span className="text-white/30">*</span>
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          rows={5}
          placeholder="Beschrijf uw vraag of situatie..."
          className={inputClass + " resize-none"}
        />
      </div>

      {formState === "error" && (
        <p className="text-sm text-red-400">{errorMsg}</p>
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
