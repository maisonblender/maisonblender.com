"use client";

/**
 * "Imagine This Is Yours" — live brand-transform.
 *
 * De bezoeker typt zijn bedrijfsnaam in. De hele UI (headerlabel, presence-
 * kleur, CTA-copy) shift naar die context. Een deterministische hash-to-hue
 * zorgt dat hetzelfde bedrijfsnaam altijd dezelfde kleur krijgt — zonder
 * dat de gebruiker iets hoeft te kiezen.
 */

import { useState } from "react";
import type { BrandContext } from "@/lib/brand-ambassador/types";

interface Props {
  current: BrandContext | null;
  onActivate: (brand: BrandContext) => void;
  onReset: () => void;
  disabled?: boolean;
}

/** Deterministische hue afleiden uit bedrijfsnaam (djb2-achtig). */
export function hueFromName(name: string): number {
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) + hash + name.charCodeAt(i)) | 0;
  }
  return ((hash % 360) + 360) % 360;
}

export default function BrandTransform({ current, onActivate, onReset, disabled = false }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = value.trim().slice(0, 60);
    if (!name) return;
    onActivate({ name, hue: hueFromName(name) });
    setValue("");
  }

  if (current) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-white/50">Demo-modus voor</span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-white"
          style={{
            borderColor: `hsla(${current.hue}, 90%, 60%, 0.5)`,
            background: `hsla(${current.hue}, 90%, 50%, 0.1)`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: `hsl(${current.hue}, 90%, 60%)` }}
          />
          {current.name}
        </span>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="text-white/50 underline-offset-2 transition-colors hover:text-white/80 hover:underline disabled:opacity-40"
        >
          terug naar MAISON BLNDR
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-xs">
      <label htmlFor="brand-name" className="text-white/60">
        Imagine this is yours →
      </label>
      <input
        id="brand-name"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="jouw bedrijfsnaam"
        maxLength={60}
        disabled={disabled}
        className="w-40 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4af0c4] disabled:opacity-40 sm:w-48"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-full bg-[#4af0c4] px-3 py-1 text-xs font-semibold text-[#1f1f1f] transition-colors hover:bg-[#7cf5d3] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        transformeer
      </button>
    </form>
  );
}
