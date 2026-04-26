"use client";

/**
 * AmbassadorWidget — root component van de AI Brand Ambassador experience.
 *
 * Architectuur:
 *   [Links]  AmbassadorPresence (de liquid entity) + brand-context strip
 *   [Rechts] Conversation thread met streaming + SuggestedQuestions chips + input
 *
 * Hybrid layout:
 *   - Default: embedded in de pagina-layout (geen nav verdwijnt, rustig)
 *   - Knop "volledig scherm": CSS transition naar fullscreen overlay
 *   - Mobile: forceert fullscreen-modus zodra chat aan staat
 *
 * State-management: alles client-side. We sturen elke turn het volledige
 * conversatie-history naar /api/brand-ambassador/chat en streamen SSE deltas
 * terug.
 *
 * Lead-capture: twee knoppen aan het eind van de conversatie:
 *   - "Stuur mij een samenvatting"  → vraagt e-mail + roept /briefing aan
 *   - Impliciet: bij interesse-signalen vult de AI zelf het leadprofiel via
 *     het gesprek. Karl krijgt altijd notificatie-email bij briefing-submit.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AmbassadorPresence, { type PresenceState } from "./AmbassadorPresence";
import AmbassadorVoice from "./AmbassadorVoice";
import BrandTransform from "./BrandTransform";
import SuggestedQuestions from "./SuggestedQuestions";
import { safeInlineMarkdown } from "@/lib/security/escape";
import type {
  BrandContext,
  ChatMessage,
  AmbassadorLead,
} from "@/lib/brand-ambassador/types";

const MAISON_HUE = 160; // MAISON BLNDR mint accent

interface AssistantBubble {
  role: "assistant";
  content: string;
  suggestions: string[];
  streaming: boolean;
}
interface UserBubble {
  role: "user";
  content: string;
}
type Bubble = AssistantBubble | UserBubble;

/** Pak <suggestions>-XML uit het einde van het antwoord, return schone text + chips. */
function extractSuggestions(raw: string): { clean: string; suggestions: string[] } {
  const match = raw.match(/<suggestions>([\s\S]*?)<\/suggestions>/i);
  if (!match) return { clean: raw, suggestions: [] };
  const inner = match[1];
  const qMatches = [...inner.matchAll(/<q>([\s\S]*?)<\/q>/gi)]
    .map((m) => m[1].trim())
    .filter((q) => q.length > 0 && q.length <= 120)
    .slice(0, 4);
  const clean = raw.replace(match[0], "").trim();
  return { clean, suggestions: qMatches };
}

function openingMessage(brand: BrandContext | null): AssistantBubble {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedenavond";

  if (brand) {
    return {
      role: "assistant",
      content: `${greet} — dit is een demo van hoe een Brand Ambassador voor "${brand.name}" zou kunnen klinken. Voor een echte implementatie zou ik getraind zijn op jullie producten en tone-of-voice. Waar wil je als eerste over praten: aanpak, tijdlijn, of wat het concreet kost?`,
      suggestions: [
        "Wat kost dit voor ons?",
        "Hoe snel kan dit live?",
        "Waar trainen jullie de Ambassador op?",
      ],
      streaming: false,
    };
  }

  return {
    role: "assistant",
    content: `${greet}. Ik ben de Brand Ambassador van MAISON BLNDR — geen chatbot, geen FAQ-zoekmachine. Waar wil je het over hebben: onze aanpak, een specifiek proces in jouw bedrijf, of wat deze Ambassador concreet kost?`,
    suggestions: [
      "Wat maakt jullie anders dan andere AI-bureaus?",
      "Wat kost een Brand Ambassador?",
      "Hoe snel staat iets live?",
    ],
    streaming: false,
  };
}

interface Props {
  /** Start in fullscreen? Default false. */
  defaultFullscreen?: boolean;
}

export default function AmbassadorWidget({ defaultFullscreen = false }: Props) {
  const [brand, setBrand] = useState<BrandContext | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>(() => [openingMessage(null)]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [fullscreen, setFullscreen] = useState(defaultFullscreen);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [presenceState, setPresenceState] = useState<PresenceState>("idle");
  const [lastAssistantText, setLastAssistantText] = useState("");
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefingStatus, setBriefingStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [briefingError, setBriefingError] = useState<string>("");

  const threadRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hue = brand?.hue ?? MAISON_HUE;

  // Conversie van bubbles naar API messages (strip suggestions/streaming fields).
  const apiMessages: ChatMessage[] = useMemo(
    () =>
      bubbles.map((b) => ({
        role: b.role,
        content: b.role === "assistant" ? b.content : b.content,
      })),
    [bubbles]
  );

  // Auto-scroll naar onder bij nieuwe bubbles.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [bubbles]);

  // Open bij brand-change opnieuw (nieuw openings-antwoord).
  useEffect(() => {
    setBubbles([openingMessage(brand)]);
    setLastAssistantText("");
  }, [brand]);

  // Lock scroll wanneer fullscreen open is (mobile UX).
  useEffect(() => {
    if (fullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [fullscreen]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      // Direct user bubble + placeholder assistant bubble.
      setBubbles((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "", suggestions: [], streaming: true },
      ]);
      setInput("");
      setSending(true);
      setPresenceState("thinking");

      const historyForApi: ChatMessage[] = [
        ...apiMessages,
        { role: "user", content: trimmed },
      ];

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/brand-ambassador/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyForApi, brand }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          let err = "Er ging iets mis.";
          try {
            const j = await res.json();
            if (typeof j.error === "string") err = j.error;
          } catch {
            // ignore
          }
          throw new Error(err);
        }

        setPresenceState("responding");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";

        // Parser: SSE event-stream.
        // Elke event: "event: X\ndata: {...}\n\n"
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const block = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            let eventName = "message";
            let dataStr = "";
            for (const line of block.split("\n")) {
              if (line.startsWith("event: ")) eventName = line.slice(7).trim();
              else if (line.startsWith("data: ")) dataStr += line.slice(6);
            }
            if (!dataStr) continue;
            let data: unknown;
            try {
              data = JSON.parse(dataStr);
            } catch {
              continue;
            }

            if (eventName === "delta" && data && typeof data === "object") {
              const delta = (data as { text?: string }).text ?? "";
              full += delta;
              const { clean, suggestions } = extractSuggestions(full);
              setBubbles((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: clean,
                    suggestions,
                    streaming: true,
                  };
                }
                return next;
              });
            } else if (eventName === "done") {
              const { clean, suggestions } = extractSuggestions(full);
              setBubbles((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: clean,
                    suggestions,
                    streaming: false,
                  };
                }
                return next;
              });
              setLastAssistantText(clean);
            } else if (eventName === "error") {
              const msg =
                data && typeof data === "object" && typeof (data as { error?: string }).error === "string"
                  ? (data as { error: string }).error
                  : "Antwoord genereren mislukt.";
              throw new Error(msg);
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Er ging iets mis.";
        setBubbles((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant" && last.streaming) {
            next[next.length - 1] = {
              role: "assistant",
              content:
                last.content ||
                `Sorry — ${msg}. Probeer het nog eens of plan een strategiegesprek.`,
              suggestions: [],
              streaming: false,
            };
          }
          return next;
        });
      } finally {
        setSending(false);
        setPresenceState("idle");
      }
    },
    [apiMessages, brand, sending]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleSuggestion(q: string) {
    send(q);
  }

  function handleVoiceTranscript(text: string) {
    send(text);
  }

  function handleAudioLevel(level: number) {
    setAudioLevel(level);
    if (level > 0.05) {
      setPresenceState("listening");
    } else if (!sending) {
      setPresenceState("idle");
    }
  }

  async function submitBriefing(email: string, naam: string, bedrijf: string, sector: string) {
    setBriefingStatus("sending");
    setBriefingError("");

    // Extract interesse-samenvatting uit laatste user messages (eenvoudige heuristiek).
    const userTurns = bubbles.filter((b): b is UserBubble => b.role === "user");
    const interesse = userTurns
      .slice(-3)
      .map((b) => b.content)
      .join(" · ")
      .slice(0, 400);

    const lead: AmbassadorLead = {
      email: email.trim(),
      naam: naam.trim() || undefined,
      bedrijf: bedrijf.trim() || undefined,
      sector: sector.trim() || undefined,
      interesse,
    };

    try {
      const res = await fetch("/api/brand-ambassador/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead,
          messages: apiMessages,
          brand,
          toestemming: true,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Kon briefing niet versturen.");
      }
      setBriefingStatus("sent");
    } catch (err) {
      setBriefingStatus("error");
      setBriefingError(err instanceof Error ? err.message : "Onbekende fout.");
    }
  }

  const brandName = brand?.name ?? "MAISON BLNDR";

  const containerClass = fullscreen
    ? "fixed inset-0 z-[60] flex flex-col bg-[#0b0b0d]"
    : "relative flex flex-col rounded-2xl border border-white/10 bg-[#0b0b0d] overflow-hidden";

  return (
    <div
      className={containerClass}
      style={{
        ["--ambassador-hue" as string]: String(hue),
        minHeight: fullscreen ? "100svh" : "640px",
      }}
    >
      {/* Subtle background dot grid + radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px 500px at 20% 30%, hsla(${hue}, 80%, 50%, 0.12), transparent 60%)`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: `hsl(${hue}, 90%, 60%)` }}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-white">{brandName} · Ambassador</p>
            <p className="text-[11px] uppercase tracking-widest text-white/50">
              {sending ? "antwoordt…" : voiceEnabled ? "voice · live" : "live · 24/7"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BrandTransform
            current={brand}
            onActivate={setBrand}
            onReset={() => setBrand(null)}
            disabled={sending}
          />
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            aria-label={fullscreen ? "Verlaat volledig scherm" : "Volledig scherm"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            {fullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H5a2 2 0 0 0-2 2v4" />
                <path d="M15 3h4a2 2 0 0 1 2 2v4" />
                <path d="M9 21H5a2 2 0 0 1-2-2v-4" />
                <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9V5a2 2 0 0 1 2-2h4" />
                <path d="M21 9V5a2 2 0 0 0-2-2h-4" />
                <path d="M3 15v4a2 2 0 0 0 2 2h4" />
                <path d="M21 15v4a2 2 0 0 1-2 2h-4" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main: presence + thread */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-[minmax(260px,_38%)_1fr] lg:gap-0">
        {/* Presence column */}
        <aside className="flex flex-col items-center justify-center gap-4 border-b border-white/5 px-6 py-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <AmbassadorPresence
            state={presenceState}
            hue={hue}
            audioLevel={audioLevel}
            size={fullscreen ? 320 : 240}
          />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-widest text-white/40">
              Liquid presence
            </p>
            <p className="mt-1 text-xs text-white/60">
              {presenceState === "thinking"
                ? "Analyseert je vraag…"
                : presenceState === "responding"
                ? "Formuleert een antwoord…"
                : presenceState === "listening"
                ? "Luistert naar je stem…"
                : voiceEnabled
                ? "Klaar voor je vraag — in tekst of spraak."
                : "Klaar voor je vraag."}
            </p>
          </div>
        </aside>

        {/* Conversation column */}
        <section className="flex min-h-0 flex-1 flex-col">
          <div
            ref={threadRef}
            className="flex-1 overflow-y-auto px-5 py-6 sm:px-8"
            aria-live="polite"
          >
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              {bubbles.map((b, i) =>
                b.role === "assistant" ? (
                  <div key={i} className="flex flex-col gap-3">
                    <div
                      className="rounded-2xl rounded-tl-sm border border-white/5 bg-white/[0.04] px-5 py-4 text-[15px] leading-relaxed text-white/90"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {b.content ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: safeInlineMarkdown(b.content),
                          }}
                        />
                      ) : (
                        <span className="inline-flex gap-1">
                          <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full"
                            style={{ background: `hsl(${hue}, 90%, 60%)`, animationDelay: "0ms" }}
                          />
                          <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full"
                            style={{ background: `hsl(${hue}, 90%, 60%)`, animationDelay: "150ms" }}
                          />
                          <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full"
                            style={{ background: `hsl(${hue}, 90%, 60%)`, animationDelay: "300ms" }}
                          />
                        </span>
                      )}
                    </div>
                    {!b.streaming && b.suggestions.length > 0 && (
                      <SuggestedQuestions
                        suggestions={b.suggestions}
                        onPick={handleSuggestion}
                        disabled={sending}
                        accentHue={hue}
                      />
                    )}
                  </div>
                ) : (
                  <div key={i} className="ml-auto max-w-[85%]">
                    <div
                      className="rounded-2xl rounded-tr-sm px-5 py-3 text-[15px] leading-relaxed text-[#1f1f1f]"
                      style={{ background: `hsl(${hue}, 85%, 70%)` }}
                    >
                      {b.content}
                    </div>
                  </div>
                )
              )}

              {/* Briefing CTA + form */}
              {bubbles.length > 3 && briefingStatus !== "sent" && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  {!briefingOpen ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Wil je een AI-samenvatting van dit gesprek?
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          Gepersonaliseerd. Eén mail. Jij bepaalt wat je ermee doet.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBriefingOpen(true)}
                        className="shrink-0 rounded-full bg-[#4af0c4] px-5 py-2.5 text-xs font-semibold text-[#1f1f1f] transition-colors hover:bg-[#7cf5d3]"
                      >
                        Stuur mij een briefing →
                      </button>
                    </div>
                  ) : (
                    <BriefingForm
                      initialBrand={brand?.name ?? ""}
                      onSubmit={submitBriefing}
                      onCancel={() => setBriefingOpen(false)}
                      status={briefingStatus}
                      error={briefingError}
                    />
                  )}
                </div>
              )}

              {briefingStatus === "sent" && (
                <div className="mt-4 rounded-2xl border border-[#4af0c4]/30 bg-[#4af0c4]/10 px-5 py-4 text-sm text-white/90">
                  ✓ Verstuurd. Check je inbox binnen een paar minuten. Geen mail? Check je
                  spamfolder of mail direct karl@maisonblender.com.
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 border-t border-white/5 px-5 py-4 sm:px-8"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 pl-4 focus-within:border-white/25">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  sending
                    ? "Wacht tot Ambassador klaar is…"
                    : brand
                    ? `Stel een vraag aan de ${brand.name} Ambassador…`
                    : "Stel een vraag aan de Ambassador…"
                }
                disabled={sending}
                maxLength={2000}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none disabled:opacity-40"
              />
              <button
                type="button"
                onClick={() => setVoiceEnabled((v) => !v)}
                aria-pressed={voiceEnabled}
                aria-label="Schakel voice-modus om"
                className={`hidden h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold uppercase tracking-widest transition-colors sm:inline-flex ${
                  voiceEnabled
                    ? "border-[#4af0c4] bg-[#4af0c4]/15 text-[#4af0c4]"
                    : "border-white/15 text-white/50 hover:text-white/80"
                }`}
              >
                Voice {voiceEnabled ? "on" : "off"}
              </button>
              <AmbassadorVoice
                onSubmit={handleVoiceTranscript}
                speakText={voiceEnabled ? lastAssistantText : undefined}
                enabled={voiceEnabled}
                onAudioLevel={handleAudioLevel}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Verstuur"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1f1f1f] transition-all hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l14 -7l-7 14l-2 -5l-5 -2" />
                </svg>
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-white/35">
              Powered by Claude · Alles wat je typt wordt verwerkt om te antwoorden. Transcripten
              blijven bij MAISON BLNDR.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

// --- Briefing form (inline omdat het alleen hier gebruikt wordt) ---

interface BriefingFormProps {
  initialBrand: string;
  onSubmit: (email: string, naam: string, bedrijf: string, sector: string) => void;
  onCancel: () => void;
  status: "idle" | "sending" | "sent" | "error";
  error: string;
}

function BriefingForm({ initialBrand, onSubmit, onCancel, status, error }: BriefingFormProps) {
  const [email, setEmail] = useState("");
  const [naam, setNaam] = useState("");
  const [bedrijf, setBedrijf] = useState(initialBrand);
  const [sector, setSector] = useState("");
  const [toestemming, setToestemming] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !toestemming) return;
    onSubmit(email, naam, bedrijf, sector);
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">AI-samenvatting ontvangen</p>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] text-white/50 hover:text-white/80"
        >
          Annuleer
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="email"
          required
          placeholder="E-mailadres *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={sending}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none disabled:opacity-40"
        />
        <input
          type="text"
          placeholder="Naam"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          disabled={sending}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none disabled:opacity-40"
        />
        <input
          type="text"
          placeholder="Bedrijf"
          value={bedrijf}
          onChange={(e) => setBedrijf(e.target.value)}
          disabled={sending}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none disabled:opacity-40"
        />
        <input
          type="text"
          placeholder="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          disabled={sending}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none disabled:opacity-40"
        />
      </div>
      <label className="flex items-start gap-2 text-xs text-white/60">
        <input
          type="checkbox"
          checked={toestemming}
          onChange={(e) => setToestemming(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#4af0c4]"
        />
        <span>
          Ik geef MAISON BLNDR toestemming om mijn gegevens en dit gesprek op te slaan voor
          contactopname en verbetering van de Ambassador. Zie{" "}
          <a href="/privacybeleid" className="underline hover:text-white" target="_blank" rel="noreferrer">
            privacybeleid
          </a>
          .
        </span>
      </label>
      {status === "error" && (
        <p className="text-xs text-red-400">{error || "Er ging iets mis."}</p>
      )}
      <button
        type="submit"
        disabled={sending || !email.trim() || !toestemming}
        className="inline-flex items-center justify-center rounded-full bg-[#4af0c4] px-5 py-2.5 text-xs font-semibold text-[#1f1f1f] transition-colors hover:bg-[#7cf5d3] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {sending ? "Versturen…" : "Verstuur briefing →"}
      </button>
    </form>
  );
}
