"use client";

/**
 * Voice control voor de Ambassador.
 *
 * Features:
 *  - Mic-knop start SpeechRecognition (Web Speech API).
 *  - Interim-transcript wordt LIVE aan parent doorgegeven via onInterim,
 *    zodat de gebruiker tijdens het spreken feedback ziet in de inputbox.
 *  - Final transcript gaat naar onSubmit → triggert de chat.
 *  - TTS wordt gedaan via SpeechSynthesis op AI-antwoorden, mits enabled.
 *  - AudioContext meet amplitude → onAudioLevel voor visuele reactiviteit.
 *  - Foutmeldingen gaan naar onError zodat de parent ze kan tonen.
 *
 * Browser support:
 *  - Chrome / Edge / Safari: OK (webkit-prefix in Safari).
 *  - Firefox: geen SpeechRecognition → knop wordt verborgen.
 *  - iOS Safari: vereist user-gesture (klikken is OK), stopt zelf na pauze.
 *
 * Privacy: audio wordt NOOIT naar onze server gestuurd. Alles in de browser.
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

/**
 * In Chrome is getVoices() async — de eerste call kan leeg zijn.
 * Cache de voices zodra ze beschikbaar zijn.
 */
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
      const voices = window.speechSynthesis.getVoices();
      resolve(voices);
      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.onvoiceschanged = handler;
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 1500);
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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastSpokenRef = useRef<string>("");
  const interimRef = useRef<string>("");

  useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      void loadVoices();
    }
  }, []);

  const stopAudioMonitoring = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    analyserRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => void 0);
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onAudioLevel?.(0);
  }, [onAudioLevel]);

  const startAudioMonitoring = useCallback(() => {
    if (!onAudioLevel) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          onAudioLevel?.(Math.min(1, rms * 3));
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      })
      .catch(() => {
        // Geen mic-permissie — ga door zonder visuele amplitude, SR kan alsnog werken.
      });
  }, [onAudioLevel]);

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

    rec.onstart = () => {
      setListening(true);
    };

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0]?.transcript ?? "";
        if (res.isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
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
      stopAudioMonitoring();
    };

    rec.onend = () => {
      setListening(false);
      stopAudioMonitoring();
      if (interimRef.current.trim()) {
        onSubmit(interimRef.current.trim());
        interimRef.current = "";
        onInterim?.("");
      }
    };

    recRef.current = rec;
    try {
      rec.start();
      startAudioMonitoring();
    } catch (err) {
      console.error("[ambassador-voice] rec.start failed:", err);
      onError?.("Kon spraakherkenning niet starten. Probeer opnieuw.");
      setListening(false);
      stopAudioMonitoring();
    }
  }, [onSubmit, onInterim, onError, startAudioMonitoring, stopAudioMonitoring]);

  function toggleListening() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    startRecognition();
  }

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!speakText || speakText === lastSpokenRef.current) return;

    lastSpokenRef.current = speakText;

    let cancelled = false;
    const speak = async () => {
      window.speechSynthesis.cancel();
      const voices = await loadVoices();
      if (cancelled) return;

      const utt = new SpeechSynthesisUtterance(speakText);
      utt.lang = "nl-NL";
      utt.rate = 1.02;
      utt.pitch = 1.0;

      const dutch =
        voices.find((v) => v.lang.toLowerCase().startsWith("nl")) ??
        voices.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ??
        voices.find((v) => v.lang.toLowerCase().startsWith("en"));
      if (dutch) utt.voice = dutch;

      window.speechSynthesis.speak(utt);
    };
    void speak();

    return () => {
      cancelled = true;
    };
  }, [speakText, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopAudioMonitoring();
    }
    return () => {
      stopAudioMonitoring();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [enabled, stopAudioMonitoring]);

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
