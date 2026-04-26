"use client";

/**
 * Voice control voor de Ambassador.
 *
 * Features:
 *  - Mic-knop start SpeechRecognition (Web Speech API) voor input.
 *  - Interim-transcript wordt LIVE aan parent doorgegeven (visuele feedback).
 *  - Final transcript → onSubmit → triggert de chat.
 *  - TTS van AI-antwoorden:
 *      1. Eerst via /api/brand-ambassador/tts (ElevenLabs, natuurlijk)
 *      2. Fallback: SpeechSynthesis als ElevenLabs niet beschikbaar is
 *  - AudioContext meet amplitude tijdens luisteren ÉN spreken →
 *    de Liquid Presence orb ademt op zowel mic als Ambassador-stem.
 *
 * Privacy: mic-audio wordt NOOIT naar onze server gestuurd. Alleen het
 * uiteindelijke transcript (tekst) gaat naar /api/brand-ambassador/chat.
 * TTS-tekst gaat wel naar onze TTS-proxy (en dan naar ElevenLabs).
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onSubmit: (text: string) => void;
  onInterim?: (text: string) => void;
  onError?: (message: string) => void;
  speakText?: string;
  enabled: boolean;
  onAudioLevel?: (level: number) => void;
  disabled?: boolean;
}

interface SpeechRecognitionResult {
  readonly length: number;
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResult>;
  resultIndex: number;
}
interface SpeechRecognitionErrorLike {
  error?: string;
  message?: string;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives?: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SRCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const initial = window.speechSynthesis.getVoices();
    if (initial.length > 0) {
      resolve(initial);
      return;
    }
    const handler = () => {
      resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.onvoiceschanged = handler;
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
  });
}

function friendlyError(err: string | undefined): string {
  switch (err) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microfoontoegang geweigerd. Sta toegang toe in je browserinstellingen.";
    case "no-speech":
      return "Ik heb niks gehoord — probeer opnieuw en spreek duidelijk.";
    case "audio-capture":
      return "Geen microfoon gevonden. Check of er een mic is aangesloten.";
    case "network":
      return "Netwerkfout bij spraakherkenning. Probeer opnieuw.";
    case "aborted":
      return "";
    default:
      return "Spraakherkenning werkte niet. Typ je vraag anders in.";
  }
}

/**
 * SpeechSynthesis fallback — gebruikt alleen als ElevenLabs TTS faalt.
 */
async function speakNative(text: string, cancelSignal: AbortSignal) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voices = await loadVoices();
  if (cancelSignal.aborted) return;

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "nl-NL";
  utt.rate = 1.02;
  utt.pitch = 1.0;

  const dutch =
    voices.find((v) => v.lang.toLowerCase().startsWith("nl")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (dutch) utt.voice = dutch;

  window.speechSynthesis.speak(utt);
}

export default function AmbassadorVoice({
  onSubmit,
  onInterim,
  onError,
  speakText,
  enabled,
  onAudioLevel,
  disabled = false,
}: Props) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  // Audio-amplitude tracking (mic + Ambassador-audio-playback).
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const playbackAnalyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const interimRef = useRef<string>("");
  const lastSpokenRef = useRef<string>("");
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      void loadVoices();
    }
  }, []);

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (audioCtxRef.current) return audioCtxRef.current;
    if (typeof window === "undefined") return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    audioCtxRef.current = new AudioCtx();
    return audioCtxRef.current;
  }, []);

  const amplitudeLoopRunning = useRef(false);
  const startAmplitudeLoop = useCallback(() => {
    if (amplitudeLoopRunning.current) return;
    amplitudeLoopRunning.current = true;

    const tick = () => {
      const mic = micAnalyserRef.current;
      const play = playbackAnalyserRef.current;
      if (!mic && !play) {
        amplitudeLoopRunning.current = false;
        rafRef.current = null;
        onAudioLevel?.(0);
        return;
      }
      let level = 0;
      if (mic) {
        const data = new Uint8Array(mic.frequencyBinCount);
        mic.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        level = Math.max(level, Math.sqrt(sum / data.length) * 3);
      }
      if (play) {
        const data = new Uint8Array(play.frequencyBinCount);
        play.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        level = Math.max(level, Math.sqrt(sum / data.length) * 3);
      }
      onAudioLevel?.(Math.min(1, level));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [onAudioLevel]);

  const stopMicMonitoring = useCallback(() => {
    micAnalyserRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (!playbackAnalyserRef.current) {
      onAudioLevel?.(0);
    }
  }, [onAudioLevel]);

  const startMicMonitoring = useCallback(() => {
    if (!onAudioLevel) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        micAnalyserRef.current = analyser;
        startAmplitudeLoop();
      })
      .catch(() => {
        // Permissie geweigerd — SR zou nog via onerror een nette melding geven.
      });
  }, [ensureAudioContext, onAudioLevel, startAmplitudeLoop]);

  const stopPlayback = useCallback(() => {
    activeAbortRef.current?.abort();
    activeAbortRef.current = null;
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.src = "";
      activeAudioRef.current = null;
    }
    playbackAnalyserRef.current = null;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (!micAnalyserRef.current) {
      onAudioLevel?.(0);
    }
  }, [onAudioLevel]);

  /**
   * Speel tekst af via ElevenLabs TTS. Bij fout: fallback naar SpeechSynthesis.
   * Returns een AbortController waarmee caller kan onderbreken.
   */
  const speakViaElevenLabs = useCallback(
    async (text: string, abort: AbortController): Promise<boolean> => {
      let response: Response;
      try {
        response = await fetch("/api/brand-ambassador/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: abort.signal,
        });
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return true;
        return false;
      }

      if (!response.ok || !response.body) {
        // Log de server-side detail zodat we in de browser console direct
        // kunnen zien waarom ElevenLabs faalt (bijv. invalid voice_id,
        // quota exceeded, auth issue).
        try {
          const body = await response.json();
          console.warn(
            `[BA-voice] TTS failed (${response.status}):`,
            body,
            body?.upstreamStatus ? `· ElevenLabs→${body.upstreamStatus}` : ""
          );
        } catch {
          console.warn(`[BA-voice] TTS failed (${response.status}) · no body`);
        }
        return false;
      }

      let blob: Blob;
      try {
        blob = await response.blob();
      } catch {
        return false;
      }
      if (abort.signal.aborted) return true;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      activeAudioRef.current = audio;

      // Route audio door AudioContext → analyser → speakers, zodat we de
      // amplitude kunnen meten voor de Presence-orb.
      const ctx = ensureAudioContext();
      if (ctx) {
        try {
          const source = ctx.createMediaElementSource(audio);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyser.connect(ctx.destination);
          playbackAnalyserRef.current = analyser;
          startAmplitudeLoop();
        } catch {
          // createMediaElementSource faalt bij herbruikte audio-elements.
          // Afspelen werkt nog gewoon.
        }
      }

      return new Promise<boolean>((resolve) => {
        const cleanup = () => {
          URL.revokeObjectURL(url);
          playbackAnalyserRef.current = null;
          if (activeAudioRef.current === audio) {
            activeAudioRef.current = null;
          }
          if (!micAnalyserRef.current) {
            onAudioLevel?.(0);
          }
        };
        audio.onended = () => {
          cleanup();
          resolve(true);
        };
        audio.onerror = () => {
          cleanup();
          resolve(false);
        };
        abort.signal.addEventListener("abort", () => {
          audio.pause();
          cleanup();
          resolve(true);
        });
        audio.play().catch(() => {
          cleanup();
          resolve(false);
        });
      });
    },
    [ensureAudioContext, onAudioLevel, startAmplitudeLoop]
  );

  const startRecognition = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      onError?.("Deze browser ondersteunt geen spraakherkenning. Probeer Chrome of Safari.");
      return;
    }

    const rec = new SR();
    rec.lang = "nl-NL";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    interimRef.current = "";

    rec.onstart = () => setListening(true);

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0]?.transcript ?? "";
        if (res.isFinal) finalText += transcript;
        else interim += transcript;
      }
      if (interim) {
        interimRef.current = interim;
        onInterim?.(interim);
      }
      if (finalText.trim()) {
        interimRef.current = "";
        onInterim?.("");
        onSubmit(finalText.trim());
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorLike) => {
      const msg = friendlyError(event.error);
      if (msg) onError?.(msg);
      setListening(false);
      stopMicMonitoring();
    };

    rec.onend = () => {
      setListening(false);
      stopMicMonitoring();
      if (interimRef.current.trim()) {
        onSubmit(interimRef.current.trim());
        interimRef.current = "";
        onInterim?.("");
      }
    };

    recRef.current = rec;
    try {
      rec.start();
      startMicMonitoring();
    } catch (err) {
      console.error("[ambassador-voice] rec.start failed:", err);
      onError?.("Kon spraakherkenning niet starten. Probeer opnieuw.");
      setListening(false);
      stopMicMonitoring();
    }
  }, [onSubmit, onInterim, onError, startMicMonitoring, stopMicMonitoring]);

  function toggleListening() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    startRecognition();
  }

  // TTS van binnenkomende antwoorden: ElevenLabs first, SpeechSynthesis fallback.
  useEffect(() => {
    if (!enabled) return;
    if (!speakText || speakText === lastSpokenRef.current) return;

    lastSpokenRef.current = speakText;

    // Cancel eventuele vorige playback.
    stopPlayback();

    const abort = new AbortController();
    activeAbortRef.current = abort;

    (async () => {
      const ok = await speakViaElevenLabs(speakText, abort);
      if (!ok && !abort.signal.aborted) {
        await speakNative(speakText, abort.signal);
      }
    })().catch(() => {
      // Ignore — best-effort.
    });

    return () => {
      abort.abort();
    };
  }, [speakText, enabled, speakViaElevenLabs, stopPlayback]);

  useEffect(() => {
    if (!enabled) stopPlayback();
    return () => {
      stopPlayback();
      stopMicMonitoring();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      amplitudeLoopRunning.current = false;
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => void 0);
        audioCtxRef.current = null;
      }
    };
  }, [enabled, stopPlayback, stopMicMonitoring]);

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        aria-label="Voice niet ondersteund in deze browser"
        title="Voice werkt in Chrome, Edge en Safari. Firefox ondersteunt dit nog niet."
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/25 cursor-not-allowed"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 10.71 6" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      aria-label={listening ? "Stop met luisteren" : "Spreek je vraag in"}
      aria-pressed={listening}
      title={listening ? "Klik om te stoppen" : "Klik en spreek je vraag in"}
      className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all ${
        listening
          ? "border-[#4af0c4] bg-[#4af0c4]/20 text-[#4af0c4]"
          : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {listening && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-[#4af0c4]/40 animate-ping"
        />
      )}
      {listening ? (
        <span aria-hidden="true" className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4af0c4] opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#4af0c4]" />
        </span>
      ) : (
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <path d="M12 19v3" />
        </svg>
      )}
    </button>
  );
}
