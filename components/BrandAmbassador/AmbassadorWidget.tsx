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
import AmbassadorVoice, { type SpeakSession } from "./AmbassadorVoice";
import BrandTransform from "./BrandTransform";
import SuggestedQuestions from "./SuggestedQuestions";
import LiveConversation from "./LiveConversation";
import { safeInlineMarkdown } from "@/lib/security/escape";
import {
  extractCompleteSentences,
  flushRemainder,
} from "@/lib/brand-ambassador/sentence-stream";
import type {
  BrandContext,
  ChatMessage,
  AmbassadorLead,
} from "@/lib/brand-ambassador/types";

const MAISON_HUE = 160; // MAISON BLNDR mint accent

/**
 * STATE_META — de Liquid Presence heeft vier zichtbare gedragsmodi. We
 * visualiseren die op drie plaatsen tegelijk zodat de bezoeker het zeker
 * merkt: (1) de canvas-vorm zelf, (2) een gekleurde pulse-dot naast het
 * label, (3) het label mee-muteert (ipv statisch "Liquid Presence").
 *
 * Kleuren zijn bewust niet-merkgekoppeld: ze moeten werken onder elke hue
 * die de Imagine-This-Is-Yours-modus aanzet. Daarom gebruiken we warme/koele
 * accenten die semantisch aansluiten bij de activiteit (amber = input,
 * sky = processing, mint = output).
 */
const STATE_META: Record<PresenceState, {
  label: string;
  description: string;
  shortDescription: string;
  dotClass: string;
  animate: boolean;
}> = {
  idle: {
    label: "Gereed",
    description: "Klaar voor je vraag — in tekst of spraak.",
    shortDescription: "zachte ademhaling, wacht op input",
    dotClass: "bg-white/55",
    animate: false,
  },
  listening: {
    label: "Luistert",
    description: "Luistert naar je stem…",
    shortDescription: "beweegt mee met audio-amplitude",
    dotClass: "bg-amber-300",
    animate: true,
  },
  thinking: {
    label: "Denkt",
    description: "Analyseert je vraag…",
    shortDescription: "snellere, complexere morfologie",
    dotClass: "bg-sky-300",
    animate: true,
  },
  responding: {
    label: "Antwoordt",
    description: "Formuleert een antwoord…",
    shortDescription: "uitdijende beweging terwijl tekst streamt",
    dotClass: "bg-[#4af0c4]",
    animate: true,
  },
};

const ONBOARDING_STORAGE_KEY = "mb_ambassador_presence_hint_seen_v1";
const ONBOARDING_DURATION_MS = 10_000;

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
      content: `${greet} — dit is een demo van hoe een Brand Presence voor "${brand.name}" zou kunnen klinken. Voor een echte implementatie zou ik getraind zijn op jullie producten en tone-of-voice. Waar wil je als eerste over praten: aanpak, tijdlijn, of wat het concreet kost?`,
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
    content: `${greet}. Ik ben de Ambassador — de Brand Presence van MAISON BLNDR. Geen chatbot, geen FAQ-zoekmachine. Waar wil je het over hebben: onze aanpak, een specifiek proces in jouw bedrijf, of wat een Brand Presence concreet kost?`,
    suggestions: [
      "Wat maakt jullie anders dan andere AI-bureaus?",
      "Wat kost een Brand Presence?",
      "Hoe snel staat iets live?",
    ],
    streaming: false,
  };
}

interface Props {
  /** Start in fullscreen? Default false. */
  defaultFullscreen?: boolean;
  /**
   * Optionele tekst die bij mount in het input-veld wordt voorgevuld.
   * Gebruikt door site-wide triggers (text-selection nudge, Cmd+K met
   * query) om de conversatie met context te starten. De gebruiker
   * moet zelf nog op Enter / Verstuur klikken — we versturen niet
   * automatisch om misverstanden te voorkomen.
   */
  initialPrompt?: string;
  /**
   * Wanneer de widget in een "modal/overlay"-context draait (bv. de
   * site-wide PersistentPresence modal) en er dus géén embedded-state
   * is om naar terug te vallen: geef een onClose handler mee. De
   * header-knop rechtsboven wordt dan een X (sluit) i.p.v. het
   * expand/collapse-icoon. Zo is er maar één knop nodig.
   */
  onClose?: () => void;
}

/**
 * Maak een url-veilige conversationId. Gebruikt crypto.randomUUID wanneer
 * beschikbaar, anders Math.random fallback. Stabiel over de duur van één
 * gesprek — reset alleen wanneer de user een nieuwe brand activeert.
 */
function newConversationId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID().replace(/-/g, "");
    }
  } catch {
    // fallthrough
  }
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

export default function AmbassadorWidget({
  defaultFullscreen = false,
  initialPrompt,
  onClose,
}: Props) {
  const [brand, setBrand] = useState<BrandContext | null>(null);
  const [conversationId, setConversationId] = useState<string>(() =>
    newConversationId()
  );
  const [bubbles, setBubbles] = useState<Bubble[]>(() => [openingMessage(null)]);
  const [input, setInput] = useState(initialPrompt ?? "");
  const [sending, setSending] = useState(false);
  const [fullscreen, setFullscreen] = useState(defaultFullscreen);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [presenceState, setPresenceState] = useState<PresenceState>("idle");
  // Streaming TTS queue: zinnen worden per stuk gequeued zodra ze compleet
  // zijn (tijdens SSE-stream) zodat de voice direct kan beginnen praten ipv
  // te wachten op het volledige antwoord. De `id` incrementeert per user-turn
  // zodat AmbassadorVoice kan detecteren dat het een nieuwe response is en
  // oude queue moet droppen.
  const [speakSession, setSpeakSession] = useState<SpeakSession>({
    id: 0,
    sentences: [],
  });
  // Trackt hoeveel chars van de huidige response al naar TTS-queue zijn
  // gestuurd. Reset bij elke nieuwe turn.
  const speakCursorRef = useRef<number>(0);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefingStatus, setBriefingStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [briefingError, setBriefingError] = useState<string>("");
  const [voiceInterim, setVoiceInterim] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [liveOpen, setLiveOpen] = useState(false);
  const [liveAvailable, setLiveAvailable] = useState(false);
  // Presence-UI: tooltip met 4-states-uitleg + onboarding-hint voor nieuwe bezoekers
  const [statesTooltipOpen, setStatesTooltipOpen] = useState(false);
  const [showOnboardingHint, setShowOnboardingHint] = useState(false);

  const threadRef = useRef<HTMLDivElement | null>(null);
  const briefingRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipTriggerRef = useRef<HTMLButtonElement | null>(null);

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

  // Index van de LAATSTE assistant-bubble. Alleen daar tonen we suggestion-chips
  // zodat oude (niet-contextuele) chips boven in de thread niet blijven hangen.
  // Zo schuiven de voorgeprogrammeerde openings-chips automatisch weg zodra
  // de AI een contextueel antwoord heeft geformuleerd.
  const lastAssistantIdx = useMemo(() => {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      if (bubbles[i].role === "assistant") return i;
    }
    return -1;
  }, [bubbles]);

  // Auto-scroll naar onder bij nieuwe bubbles.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [bubbles]);

  // Scroll de briefing-sectie in beeld zodra:
  //   - de user het form opent (anders zie je op mobile alleen de inputbalk
  //     en blijft het form onder de viewport hangen)
  //   - de bevestiging verschijnt na succesvolle verzending
  // Gebruikt window-scroll omdat de briefing buiten de thread-scroll-container
  // leeft (direct onder de input als deel van de section).
  useEffect(() => {
    if (!briefingOpen && briefingStatus !== "sent") return;
    const el = briefingRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [briefingOpen, briefingStatus]);

  // Open bij brand-change opnieuw (nieuw openings-antwoord).
  // Ook conversationId resetten: nieuwe brand = nieuwe context = server
  // moet een fris leadprofiel opbouwen ipv de oude info door te rommelen.
  useEffect(() => {
    setBubbles([openingMessage(brand)]);
    setSpeakSession((s) => ({ id: s.id + 1, sentences: [] }));
    speakCursorRef.current = 0;
    setConversationId(newConversationId());
  }, [brand]);

  // Feature-detect of ElevenLabs ConvAI server-side geconfigureerd is.
  // Uitkomst cachen via HTTP-cache (public 60s). Zo geen flash van de knop.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/brand-ambassador/config", { method: "GET" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.live) setLiveAvailable(true);
      })
      .catch(() => {
        // Stil falen — knop blijft gewoon verborgen.
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  // Onboarding-hint: toon de eerste keer een subtiele instructie ("let op de
  // vorm — hij reageert mee") zodat de 4-states-belofte niet ongemerkt blijft.
  // Slaat op in localStorage zodat terugkerende bezoekers niet gestoord worden.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (seen === "1") return;
    } catch {
      // localStorage kan geblokkeerd zijn (privacy-mode etc.) — dan is de
      // hint gewoon niet persistent. Zachte degradatie: wél tonen, niet
      // eindeloos herhalen want hij verdwijnt sowieso na ONBOARDING_DURATION.
    }
    setShowOnboardingHint(true);
    const timer = window.setTimeout(() => {
      setShowOnboardingHint(false);
      try {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
      } catch {
        // noop — zie boven
      }
    }, ONBOARDING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Hide de onboarding-hint zodra er daadwerkelijk iets gebeurt in het
  // gesprek — dan is de demonstratie al vanzelf begonnen.
  useEffect(() => {
    if (bubbles.length > 1 || presenceState !== "idle") {
      setShowOnboardingHint(false);
      try {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
      } catch {
        // noop
      }
    }
  }, [bubbles.length, presenceState]);

  // States-tooltip: sluit bij klik buiten of Escape — standaard popover-UX.
  useEffect(() => {
    if (!statesTooltipOpen) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (tooltipRef.current?.contains(target)) return;
      if (tooltipTriggerRef.current?.contains(target)) return;
      setStatesTooltipOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStatesTooltipOpen(false);
        tooltipTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [statesTooltipOpen]);

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

      // Nieuwe user-turn: reset TTS queue. AmbassadorVoice detecteert
      // session id verandering en aborteert eventuele nog draaiende audio
      // van een vorig antwoord.
      setSpeakSession((s) => ({ id: s.id + 1, sentences: [] }));
      speakCursorRef.current = 0;

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
          body: JSON.stringify({
            messages: historyForApi,
            brand,
            conversationId,
          }),
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

              // Streaming TTS: extract complete zinnen uit `clean` sinds de
              // laatste cursor en append ze aan de speak-queue. Voice kan
              // zo direct beginnen praten zonder te wachten op "done".
              const { sentences, nextIdx } = extractCompleteSentences(
                clean,
                speakCursorRef.current
              );
              if (sentences.length > 0) {
                speakCursorRef.current = nextIdx;
                setSpeakSession((s) => ({
                  id: s.id,
                  sentences: [...s.sentences, ...sentences],
                }));
              }
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

              // Flush eventuele resterende tekst (korte antwoorden zonder
              // eindteken, of laatste zin zonder trailing whitespace).
              const remainder = flushRemainder(clean, speakCursorRef.current);
              if (remainder) {
                speakCursorRef.current = clean.length;
                setSpeakSession((s) => ({
                  id: s.id,
                  sentences: [...s.sentences, remainder],
                }));
              }
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
    [apiMessages, brand, sending, conversationId]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleSuggestion(q: string) {
    send(q);
  }

  // Deze handlers worden als props naar AmbassadorVoice doorgegeven. Ze
  // MOETEN stable references zijn: anders veroorzaken ze in AmbassadorVoice
  // een useEffect-loop die de TTS-fetch telkens abort en opnieuw start.
  // (De amplitudeLoop triggert setAudioLevel → re-render → nieuwe callback
  // ref → nieuwe speakViaElevenLabs ref → TTS-useEffect cleanup → abort.)
  const handleVoiceTranscript = useCallback(
    (text: string) => {
      setVoiceInterim("");
      setVoiceError("");
      send(text);
    },
    [send]
  );

  const handleVoiceInterim = useCallback((text: string) => {
    setVoiceInterim(text);
  }, []);

  const handleVoiceError = useCallback((message: string) => {
    setVoiceError(message);
    setVoiceInterim("");
    window.setTimeout(() => setVoiceError(""), 5000);
  }, []);

  function toggleVoiceMode() {
    setVoiceEnabled((v) => {
      const next = !v;
      if (!next && typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }

  // handleAudioLevel wordt per animation frame gecalled tijdens TTS-playback.
  // Afhankelijk maken van `sending` zou de callback-ref doen wisselen zodra
  // `sending` van true→false flipt (precies op het moment dat TTS start) en
  // dan is het feest: abort-restart loop. We gebruiken functional setState
  // zodat de callback zelf geen deps nodig heeft.
  const handleAudioLevel = useCallback((level: number) => {
    setAudioLevel(level);
    if (level > 0.05) {
      setPresenceState((prev) => (prev === "idle" ? "listening" : prev));
    }
  }, []);

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
    <>
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
          {liveAvailable && (
            <button
              type="button"
              onClick={() => setLiveOpen(true)}
              aria-label="Start een live voice-gesprek met de Ambassador"
              className="group inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold uppercase tracking-widest transition-all"
              style={{
                borderColor: `hsl(${hue}, 80%, 55%)`,
                color: `hsl(${hue}, 85%, 70%)`,
                background: `hsla(${hue}, 80%, 50%, 0.08)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `hsla(${hue}, 80%, 50%, 0.18)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `hsla(${hue}, 80%, 50%, 0.08)`;
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ background: `hsl(${hue}, 85%, 60%)` }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: `hsl(${hue}, 85%, 60%)` }}
                />
              </span>
              <span className="hidden sm:inline">Praat live</span>
              <span className="sm:hidden">Live</span>
            </button>
          )}
          {onClose ? (
            // Modal-context: één knop, altijd een close. Geen expand-toggle
            // want er is niets om naar terug te vallen buiten de overlay.
            <button
              type="button"
              onClick={onClose}
              aria-label="Sluit gesprek"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
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
          )}
        </div>
      </header>

      {/* Main: presence + thread */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-[minmax(260px,_38%)_1fr] lg:gap-0">
        {/* Presence column */}
        <aside className="relative flex flex-col items-center justify-center gap-4 border-b border-white/5 px-6 py-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <div className="relative">
            <AmbassadorPresence
              state={presenceState}
              hue={hue}
              audioLevel={audioLevel}
              size={fullscreen ? 320 : 240}
            />
            {/* Onboarding hint — verschijnt alleen bij eerste bezoek, 10s */}
            {showOnboardingHint && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 top-6 hidden translate-x-full items-center gap-2 whitespace-nowrap rounded-full border border-[#4af0c4]/50 bg-[#4af0c4]/10 px-3 py-1.5 text-[11px] font-medium text-[#4af0c4] backdrop-blur-sm animate-[fadeIn_400ms_ease-out] sm:inline-flex"
                style={{
                  animation: "mbAmbassadorHintPulse 2.5s ease-in-out infinite",
                }}
              >
                <span aria-hidden="true">←</span>
                <span>Kijk wat de vorm doet tijdens het gesprek</span>
              </div>
            )}
          </div>

          {/* Status-blok: label mee-muteert + pulse-dot + tooltip-trigger */}
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${STATE_META[presenceState].dotClass} ${
                  STATE_META[presenceState].animate ? "animate-pulse" : ""
                }`}
              />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/75">
                Liquid Presence{" "}
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>{" "}
                <span className="text-white transition-colors duration-300">
                  {STATE_META[presenceState].label}
                </span>
              </p>
              <button
                ref={tooltipTriggerRef}
                type="button"
                onClick={() => setStatesTooltipOpen((o) => !o)}
                aria-label="Wat betekenen de vier states?"
                aria-expanded={statesTooltipOpen}
                aria-haspopup="dialog"
                className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/30 text-[9px] font-semibold text-white/70 transition-colors hover:border-white/60 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4af0c4]"
              >
                ?
              </button>
            </div>

            <p
              className="mt-1.5 text-xs text-white/85 transition-opacity duration-200"
              aria-live="polite"
            >
              {presenceState === "idle" && voiceEnabled
                ? "Klaar voor je vraag — in tekst of spraak."
                : STATE_META[presenceState].description}
            </p>

            {/* Mobile onboarding hint — onder de status ipv naast de orb */}
            {showOnboardingHint && (
              <div
                aria-hidden="true"
                className="pointer-events-none mx-auto mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#4af0c4]/50 bg-[#4af0c4]/10 px-3 py-1.5 text-[11px] font-medium text-[#4af0c4] backdrop-blur-sm sm:hidden"
                style={{
                  animation: "mbAmbassadorHintPulse 2.5s ease-in-out infinite",
                }}
              >
                <span aria-hidden="true">↑</span>
                <span>De vorm reageert mee op het gesprek</span>
              </div>
            )}

            {/* States-tooltip: compacte legenda met alle 4 modi */}
            {statesTooltipOpen && (
              <div
                ref={tooltipRef}
                role="dialog"
                aria-label="Uitleg van de vier states"
                className="absolute left-1/2 top-full z-30 mt-3 w-[280px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#141416] p-4 text-left shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
                    Vier zichtbare modi
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setStatesTooltipOpen(false);
                      tooltipTriggerRef.current?.focus();
                    }}
                    aria-label="Sluit uitleg"
                    className="-mr-1 -mt-1 flex h-5 w-5 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white/90"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-white/65">
                  De Liquid Presence verandert zichtbaar van gedrag per
                  gespreksfase. Let op vorm én kleur tijdens het praten.
                </p>
                <ul className="mt-3 flex flex-col gap-2.5 text-[11px]">
                  {(Object.keys(STATE_META) as PresenceState[]).map((s) => (
                    <li
                      key={s}
                      className={`flex items-start gap-2.5 rounded-md px-2 py-1.5 transition-colors ${
                        presenceState === s
                          ? "bg-white/5"
                          : "bg-transparent"
                      }`}
                    >
                      <span
                        className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${STATE_META[s].dotClass} ${
                          presenceState === s && STATE_META[s].animate
                            ? "animate-pulse"
                            : ""
                        }`}
                        aria-hidden="true"
                      />
                      <span className="flex-1">
                        <span className="font-semibold text-white/95">
                          {STATE_META[s].label}
                        </span>
                        <span className="text-white/55">
                          {" — "}
                          {STATE_META[s].shortDescription}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Conversation column */}
        <section className="flex min-h-0 flex-1 flex-col">
          <div
            ref={threadRef}
            className="mb-prose-on-dark flex-1 overflow-y-auto px-5 py-6 sm:px-8"
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
                    {i === lastAssistantIdx && !b.streaming && b.suggestions.length > 0 && (
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

            </div>
          </div>

          {/* Input
           *
           * Mobile-specifics:
           *   - text-base (16px) om iOS auto-zoom op focus te voorkomen.
           *   - min-w-0 op de input zodat flex-shrink werkt binnen de rounded
           *     container — anders duwt een lange placeholder de submit-knop
           *     buiten beeld.
           *   - Voice-toggle hidden op mobile: op telefoon is de mic-knop
           *     voldoende, de on/off-toggle is een desktop-luxe. Zo houden we
           *     input + mic + submit binnen viewport.
           */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 border-t border-white/5 px-3 py-3 sm:px-8 sm:py-4"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-4 pr-1.5 focus-within:border-white/25 sm:gap-3 sm:pr-2">
              <input
                type="text"
                value={voiceInterim || input}
                onChange={(e) => {
                  setVoiceInterim("");
                  setInput(e.target.value);
                }}
                placeholder={
                  sending
                    ? "Ambassador is bezig…"
                    : voiceInterim
                    ? ""
                    : brand
                    ? `Vraag ${brand.name} Ambassador…`
                    : "Stel je vraag…"
                }
                disabled={sending}
                maxLength={2000}
                className={`min-w-0 flex-1 bg-transparent text-base focus:outline-none disabled:opacity-40 placeholder:text-white/55 sm:text-sm ${
                  voiceInterim ? "italic text-[#4af0c4]/90" : "text-white"
                }`}
              />
              <button
                type="button"
                onClick={toggleVoiceMode}
                aria-pressed={voiceEnabled}
                aria-label="Zet voorleesmodus aan of uit"
                title={
                  voiceEnabled
                    ? "Voorleesmodus aan — antwoorden worden uitgesproken"
                    : "Voorleesmodus uit — klik om antwoorden te laten voorlezen"
                }
                className={`hidden h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold uppercase tracking-widest transition-colors sm:inline-flex ${
                  voiceEnabled
                    ? "border-[#4af0c4] bg-[#4af0c4]/15 text-[#4af0c4]"
                    : "border-white/15 text-white/50 hover:text-white/80"
                }`}
              >
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  {voiceEnabled && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
                  {voiceEnabled && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                </svg>
                <span>{voiceEnabled ? "on" : "off"}</span>
              </button>
              <AmbassadorVoice
                onSubmit={handleVoiceTranscript}
                onInterim={handleVoiceInterim}
                onError={handleVoiceError}
                speakSession={speakSession}
                enabled={voiceEnabled}
                onAudioLevel={handleAudioLevel}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Verstuur"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1f1f1f] transition-all hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed sm:h-11 sm:w-11"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l14 -7l-7 14l-2 -5l-5 -2" />
                </svg>
              </button>
            </div>
            {voiceError && (
              <p
                role="status"
                aria-live="polite"
                className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-[#ff9a9a]"
              >
                {voiceError}
              </p>
            )}
          </form>

          {/* Briefing CTA + form — onder de input zodat het gesprek niet
           *  onderbroken wordt. Verschijnt zodra er één volledige exchange
           *  is geweest (opening + user + assistant response = 3 bubbles),
           *  zodat de bezoeker meteen na de eerste AI-reactie de optie ziet
           *  om een samenvatting aan te vragen. */}
          {bubbles.length >= 3 && briefingStatus !== "sent" && (
            <div ref={briefingRef} className="px-3 pb-4 sm:px-8">
              <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
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
            </div>
          )}

          {briefingStatus === "sent" && (
            <div ref={briefingRef} className="px-3 pb-4 sm:px-8">
              <div className="mx-auto max-w-2xl rounded-2xl border border-[#4af0c4]/30 bg-[#4af0c4]/10 px-5 py-4 text-sm text-white/90">
                ✓ E-mail is verzonden. Geen e-mail? Check je spambox.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
    {liveAvailable && (
      <LiveConversation
        open={liveOpen}
        onClose={() => setLiveOpen(false)}
        brand={brand}
        hue={hue}
      />
    )}
    </>
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
