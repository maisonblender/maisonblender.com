"use client";

/**
 * LiveConversation — full-screen modal voor ElevenLabs Conversational AI.
 *
 * Flow:
 *   1. User klikt "Praat live" in de widget → deze modal opent
 *   2. Click "Start gesprek" → /api/brand-ambassador/voice-session
 *      → signedUrl → Conversation.startSession()
 *   3. Live bidirectional voice gesprek via WebSocket
 *   4. Presence-orb ademt op basis van input/output frequency data
 *   5. Click "Stop" of ESC → conversation.endSession()
 *
 * Een aparte modus naast de normale chat omdat:
 *   - De conversatie-logic leeft in ElevenLabs (agent config + prompt)
 *   - Het kost meer (~€0.10-0.30/min) dus moet opt-in zijn
 *   - De UX is fundamenteel anders: geen chat-bubbels, alleen stem
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation } from "@elevenlabs/client";
import AmbassadorPresence, { type PresenceState } from "./AmbassadorPresence";
import type { BrandContext } from "@/lib/brand-ambassador/types";

/**
 * NB: tijd-aware first-message override is uitgeschakeld.
 *
 * ElevenLabs agent-config heeft `first_message: false` in de allowed
 * overrides — een poging tot client-side override geeft close code 1008
 * (Policy Violation) en de sessie valt binnen ~2s weg. Om dit te
 * activeren moet de "First message override" toggle aan in de ElevenLabs
 * dashboard (Agent → Security → Allowed overrides). Daarna kan de
 * helper terugkomen en de override-block re-enabled worden in
 * startSession() hieronder.
 *
 * Tot die tijd gebruikt ElevenLabs z'n eigen statische first_message
 * (zegt "Goedemiddag" ongeacht tijdstip).
 */

interface Props {
  open: boolean;
  onClose: () => void;
  brand?: BrandContext | null;
  hue: number;
  /**
   * Callback bij een permanente config-fout aan onze kant
   * (401/403/404/503). De parent kan dan de "Praat live"-knop verbergen
   * voor de rest van de sessie zodat de gebruiker niet steeds tegen
   * dezelfde fout aanloopt. Tijdelijke fouten (429/5xx van ElevenLabs,
   * mic-permissie geweigerd) triggeren dit NIET — dan heeft retry zin.
   */
  onConfigError?: () => void;
}

type LiveStatus =
  | "idle"
  | "requesting-mic"
  | "connecting"
  | "connected"
  | "disconnecting"
  | "error";

interface TranscriptEntry {
  role: "user" | "agent";
  text: string;
  id: string;
}

export default function LiveConversation({ open, onClose, brand, hue, onConfigError }: Props) {
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [presenceState, setPresenceState] = useState<PresenceState>("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  // Aparte technische error voor diagnose. Tonen we als kleine collapse
  // onder de user-vriendelijke errorMessage zodat we (als developer)
  // zonder browser-console kunnen zien wat er werkelijk fout ging
  // tijdens een live-sessie. Eindgebruikers kunnen het simpelweg
  // negeren — staat in een lager-contrast, kleinere font.
  const [errorDetail, setErrorDetail] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  // Mobile detect — orb-size en padding verschillen significant tussen
  // viewports. Niet via Tailwind want canvas size is een prop, geen CSS.
  const [isMobile, setIsMobile] = useState(false);

  const conversationRef = useRef<Conversation | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const stopAmplitudeLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startAmplitudeLoop = useCallback(() => {
    if (rafRef.current !== null) return;
    const tick = () => {
      const conv = conversationRef.current;
      if (!conv) {
        stopAmplitudeLoop();
        return;
      }
      try {
        const inputData = conv.getInputByteFrequencyData();
        const outputData = conv.getOutputByteFrequencyData();

        let sum = 0;
        for (let i = 0; i < inputData.length; i++) sum += inputData[i];
        const inputAvg = sum / inputData.length / 255;

        let outSum = 0;
        for (let i = 0; i < outputData.length; i++) outSum += outputData[i];
        const outputAvg = outSum / outputData.length / 255;

        setAudioLevel(Math.min(1, Math.max(inputAvg, outputAvg) * 1.5));
      } catch {
        // Conversation might be disconnecting — just skip this frame.
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAmplitudeLoop]);

  const teardown = useCallback(async () => {
    stopAmplitudeLoop();
    const conv = conversationRef.current;
    conversationRef.current = null;
    if (conv) {
      try {
        await conv.endSession();
      } catch {
        // Ignore — we're tearing down anyway.
      }
    }
    setPresenceState("idle");
    setAudioLevel(0);
    startedRef.current = false;
  }, [stopAmplitudeLoop]);

  const startSession = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setErrorMessage("");
    setErrorDetail("");
    setTranscript([]);
    setStatus("requesting-mic");

    // 1. Verzoek expliciet mic-permissie vóór we ElevenLabs contacteren —
    //    zo krijgen we een nette eigen foutmelding ipv de ElevenLabs-error.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      setErrorMessage(
        "Microfoontoegang is nodig voor een live gesprek. Sta toegang toe en probeer opnieuw."
      );
      setErrorDetail(err instanceof Error ? `${err.name}: ${err.message}` : "getUserMedia geweigerd");
      setStatus("error");
      startedRef.current = false;
      return;
    }

    // 2. Haal een signed URL op via onze backend.
    setStatus("connecting");
    let signedUrl: string;
    try {
      const res = await fetch("/api/brand-ambassador/voice-session", {
        method: "GET",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMessage(body.error || "Kon live-sessie niet starten.");
        setErrorDetail(`HTTP ${res.status} ${res.statusText} — voice-session`);
        setStatus("error");
        startedRef.current = false;
        // Permanente config-fouten = geen zin om opnieuw te proberen.
        // 503 (server: convaiEnabled=false) en 502 (upstream 401/403/404
        // doorvertaald naar 502) zijn allebei "live werkt nu niet — gebruik
        // tekst". We notificeren de parent zodat de knop verdwijnt.
        if (res.status === 503 || res.status === 502) {
          onConfigError?.();
        }
        return;
      }
      const body = (await res.json()) as { signedUrl: string };
      signedUrl = body.signedUrl;
    } catch (err) {
      setErrorMessage("Kon geen verbinding maken met de voice-service.");
      setErrorDetail(err instanceof Error ? `${err.name}: ${err.message}` : "fetch failed");
      setStatus("error");
      startedRef.current = false;
      return;
    }

    // 3. Dynamische import — @elevenlabs/client pullt livekit-client mee,
    //    dat willen we niet in de main bundle.
    try {
      const { Conversation } = await import("@elevenlabs/client");

      // Tijdstempel voor diagnose: is "stopt na paar woorden" een echte
      // disconnect kort na connect, of een natural turn-end?
      const sessionStart = Date.now();

      // NB: tijd-aware first_message override is uitgeschakeld omdat de
      // ElevenLabs agent-config `first_message: false` in allowed
      // overrides heeft — een poging tot override geeft close code 1008
      // (Policy Violation) en de sessie valt direct weg na ~2s.
      //
      // Om dit te activeren: ga in ElevenLabs dashboard naar
      //   Agent → Security/Auth → Allowed overrides → vink
      //   "First message" aan. Daarna kan deze override-blok terug.

      const conv = await Conversation.startSession({
        signedUrl,
        onConnect: (info) => {
          console.log("[live-convai] onConnect", info);
          setStatus("connected");
          setPresenceState("listening");
          startAmplitudeLoop();
        },
        onDisconnect: (info) => {
          // KRITIEK voor diagnose van "stopt na paar woorden": als dit
          // binnen <10s na connect afgaat is er iets mis (vroege server-
          // disconnect, of self-interruption door eigen audio-loopback).
          const elapsedMs = Date.now() - sessionStart;
          console.log("[live-convai] onDisconnect", { elapsedMs, info });

          // Als de disconnect verdacht vroeg is, surface dat in de UI
          // zodat we (Karl) direct zien wat er gebeurt zonder devtools.
          if (elapsedMs < 10_000) {
            setErrorMessage(
              "De verbinding viel weg vlak na het starten. Probeer opnieuw of ga verder in tekst-chat."
            );
            let infoStr = "geen detail";
            try {
              infoStr =
                typeof info === "string"
                  ? info
                  : JSON.stringify(info ?? {}).slice(0, 240);
            } catch {
              infoStr = String(info);
            }
            setErrorDetail(
              `onDisconnect na ${elapsedMs}ms — ${infoStr}`
            );
            setStatus("error");
          } else {
            setStatus("idle");
          }
          setPresenceState("idle");
          stopAmplitudeLoop();
          startedRef.current = false;
        },
        onError: (msg) => {
          const elapsedMs = Date.now() - sessionStart;
          console.error("[live-convai] onError", { elapsedMs, msg });
          setErrorMessage(
            "Er ging iets mis tijdens het gesprek. Probeer opnieuw of ga verder in tekst-chat."
          );
          let detail = "onError (geen detail)";
          if (typeof msg === "string") {
            detail = msg;
          } else if (msg && typeof msg === "object") {
            try {
              detail = JSON.stringify(msg).slice(0, 240);
            } catch {
              detail = String(msg);
            }
          }
          setErrorDetail(`onError na ${elapsedMs}ms — ${detail}`);
          setStatus("error");
          // Cleanup: websocket kan in broken state blijven; teardown zorgt
          // dat een retry een verse sessie krijgt.
          void teardown();
        },
        onModeChange: ({ mode }) => {
          console.log("[live-convai] onModeChange", { mode, elapsedMs: Date.now() - sessionStart });
          setPresenceState(mode === "speaking" ? "responding" : "listening");
        },
        onMessage: ({ message, source }) => {
          console.log("[live-convai] onMessage", {
            source,
            len: typeof message === "string" ? message.length : -1,
            elapsedMs: Date.now() - sessionStart,
          });
          if (typeof message !== "string" || !message.trim()) return;
          // source is "user" | "ai" in the ElevenLabs SDK; map "ai" → "agent"
          // voor de lokale UI-label.
          setTranscript((prev) => [
            ...prev,
            {
              role: source === "user" ? "user" : "agent",
              text: message,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            },
          ]);
        },
      });
      conversationRef.current = conv;
    } catch (err) {
      console.error("[live-convai] startSession failed:", err);
      setErrorMessage("Kon live gesprek niet starten. Probeer het opnieuw.");
      setErrorDetail(
        err instanceof Error
          ? `${err.name}: ${err.message}`
          : `startSession failed: ${String(err)}`
      );
      setStatus("error");
      startedRef.current = false;
    }
  }, [brand, startAmplitudeLoop, stopAmplitudeLoop, teardown]);

  const handleStop = useCallback(async () => {
    setStatus("disconnecting");
    await teardown();
    setStatus("idle");
  }, [teardown]);

  // ESC to close.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (conversationRef.current) void handleStop();
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, handleStop]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Viewport detect: < 768px = mobile (kleinere orb + andere padding).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => {
      mq.removeEventListener?.("change", update);
    };
  }, []);

  // Cleanup on unmount or when closing.
  useEffect(() => {
    if (!open) {
      void teardown();
    }
    return () => {
      void teardown();
    };
  }, [open, teardown]);

  if (!open) return null;

  const statusLabel: Record<LiveStatus, string> = {
    idle: "Klaar om te starten",
    "requesting-mic": "Microfoontoegang aanvragen…",
    connecting: "Verbinden…",
    connected: presenceState === "responding" ? "Ambassador spreekt" : "Luistert…",
    disconnecting: "Verbinding verbreken…",
    error: "Er ging iets mis",
  };

  const active = status === "connected";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#0b0b0d]"
      style={{ touchAction: "pan-y" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(closest-side, hsla(${hue}, 70%, 55%, 0.12), transparent 70%)`,
        }}
      />

      {/* Close button — fixed (niet absolute) zodat hij ALTIJD top-right
          zichtbaar blijft, ook tijdens scrollen door tech-details. z-30
          om boven alle content te staan. */}
      <button
        type="button"
        onClick={() => {
          if (conversationRef.current) void handleStop();
          onClose();
        }}
        aria-label="Sluiten"
        className="fixed right-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)] sm:right-5 sm:top-5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Centered content via min-h-full + flex. Wanneer de content (orb +
          tech-details + transcript) groter wordt dan de viewport scrollt
          de outer container natuurlijk — zonder scroll zou de tech-details
          collapse onbereikbaar zijn op kleine schermen of in error-state.
          gap-8 ipv justify-between zodat content netjes meegroeit en niet
          uit het venster valt. */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center gap-6 px-6 py-12 sm:gap-10 sm:py-16">
        {/* Status badge */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
            MAISON BLNDR · Live Encounter
          </span>
          <h2
            className="mt-2 text-center text-[20px] font-normal leading-tight text-white sm:mt-3 sm:text-[28px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            {brand ? (
              <>
                Praat live met de <span className="font-exposure">{brand.name}</span> Ambassador
              </>
            ) : (
              <>
                Praat live met onze <span className="font-exposure">Ambassador</span>
              </>
            )}
          </h2>
          <p className="max-w-md text-center text-sm text-white/50">
            Spreek gewoon — onderbreken mag, net als in een echt gesprek.
          </p>
        </div>

        {/* Presence orb — kleiner op mobile, ruimer op desktop. */}
        <div className="flex flex-col items-center gap-6">
          <AmbassadorPresence
            state={presenceState}
            hue={hue}
            audioLevel={audioLevel}
            size={isMobile ? 200 : 340}
          />
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: active ? `hsl(${hue}, 70%, 65%)` : "rgba(255,255,255,0.4)" }}
            >
              {status === "connected" && presenceState === "listening" && "Liquid Presence · Luistert"}
              {status === "connected" && presenceState === "responding" && "Liquid Presence · Antwoordt"}
              {status === "connecting" && "Liquid Presence · Verbindt"}
              {status === "requesting-mic" && "Liquid Presence · Wacht op microfoon"}
              {status === "disconnecting" && "Liquid Presence · Ontkoppelt"}
              {status === "idle" && "Liquid Presence · Gereed"}
              {status === "error" && "Liquid Presence · Fout"}
            </span>
            <span className="text-sm text-white/80">{statusLabel[status]}</span>
          </div>

          {(errorMessage || (status === "error" && errorDetail)) && (
            <div className="flex w-full max-w-md flex-col items-center gap-3">
              {errorMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className="text-center text-xs text-[#ff9a9a]"
                >
                  {errorMessage}
                </p>
              )}
              {errorDetail && (
                /* open by default zodat de developer/Karl de raw error
                   direct ziet zonder extra klik — zonder dit blokje
                   moet je elke keer browser-console openen. */
                <details open className="w-full max-w-sm">
                  <summary className="cursor-pointer text-center text-[10px] font-medium uppercase tracking-widest text-white/40 hover:text-white/60">
                    Technische details
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all rounded-lg border border-white/5 bg-black/30 px-3 py-2 text-[10px] leading-relaxed text-white/55">
                    {errorDetail}
                  </pre>
                </details>
              )}
              {status === "error" && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-white/60 underline underline-offset-4 transition-colors hover:text-white"
                >
                  Ga verder in tekst-chat
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Transcript preview — laatste 2 messages */}
          {transcript.length > 0 && (
            <div className="w-full max-w-lg space-y-2 text-center">
              {transcript.slice(-2).map((t) => (
                <p
                  key={t.id}
                  className={`text-xs ${
                    t.role === "user" ? "text-white/40" : "text-white/75"
                  }`}
                >
                  <span className="opacity-50">{t.role === "user" ? "Jij: " : "Ambassador: "}</span>
                  {t.text}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex flex-col items-center gap-3">
          {active || status === "connecting" || status === "requesting-mic" ? (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              Gesprek beëindigen
            </button>
          ) : (
            <button
              type="button"
              onClick={startSession}
              disabled={status === "disconnecting"}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-[#0b0b0d] transition-all hover:shadow-2xl disabled:opacity-40"
              style={{
                backgroundColor: `hsl(${hue}, 75%, 60%)`,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <path d="M12 19v3" />
              </svg>
              {status === "error" ? "Probeer opnieuw" : "Start live gesprek"}
            </button>
          )}
          <p className="text-[10px] uppercase tracking-widest text-white/30">
            Druk op ESC om te stoppen
          </p>
        </div>
      </div>
    </div>
  );
}
