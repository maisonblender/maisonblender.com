"use client";

/**
 * Klikbare vervolgvraag-chips onder elk Ambassador-antwoord.
 *
 * De vragen worden door de AI zelf gegenereerd (in de <suggestions> block aan
 * het eind van het gewone antwoord) en door AmbassadorChat uit de stream
 * geparsed. Deze component rendert ze alleen.
 */

interface Props {
  suggestions: string[];
  onPick: (q: string) => void;
  disabled?: boolean;
  accentHue?: number;
  /**
   * Visueel thema. "dark" = wit-op-zwart chips (MAISON BLNDR Brand Presence).
   * "light" = donker-op-wit chips voor AI Collega tenants op lichte pagina's.
   */
  theme?: "dark" | "light";
}

export default function SuggestedQuestions({
  suggestions,
  onPick,
  disabled = false,
  accentHue = 160,
  theme = "dark",
}: Props) {
  if (!suggestions.length) return null;

  const isLight = theme === "light";
  const chipCls = isLight
    ? "border-black/15 bg-white text-[#1f1f1f] hover:border-black/30 hover:bg-black/[0.04]"
    : "border-white/15 bg-white/5 text-white/75 hover:border-white/30 hover:bg-white/10 hover:text-white";

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {suggestions.map((q, i) => (
        <button
          key={`${i}-${q}`}
          type="button"
          onClick={() => onPick(q)}
          disabled={disabled}
          className={`group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${chipCls}`}
          style={{
            ["--chip-accent" as string]: `hsl(${accentHue}, 90%, 60%)`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125"
            style={{ background: `hsl(${accentHue}, ${isLight ? "70%, 50%" : "90%, 60%"})` }}
          />
          {q}
        </button>
      ))}
    </div>
  );
}
