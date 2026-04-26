"use client";

/**
 * Voice control voor de Ambassador:
 *   - Klik mic: SpeechRecognition start (Web Speech API) → transcript → onSubmit
 *   - Terwijl Ambassador antwoordt: SpeechSynthesis reads het uit
 *   - AudioContext meet de real-time amplitude zodat de Presence
 *     ademt/trilt op het geluid van de spreker.
 *
 * Progressive enhancement: Als de browser geen Speech API heeft (Firefox,
 * Safari op desktop soms) verbergen we de knop. Op iOS Safari werkt het wel
 * achter user-gesture.
 *
 * Privacy: audio wordt NOOIT naar onze server gestuurd. Alles gebeurt in de
 * browser. We sturen alleen het uiteindelijke transcript als tekst naar
 * /api/brand-ambassador/chat.
 */

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Transcript wordt automatisch naar deze handler gepusht. */
  onSubmit: (text: string) => void;
  /** Laatste AI-antwoord om voor te lezen als voice-modus aan staat. */
  speakText?: string;
  /** Voice-modus actief? Wanneer false: geen TTS, geen mic. */
  enabled: boolean;
  /** Notifier voor audio-amplitude (0-1) tijdens listening/speaking. */
  onAudioLevel?: (level: number) => void;
  disabled?: boolean;
}

// Web Speech API types (browser-only, not in lib.dom tot voor kort)
interface SpeechRecognitionEventLike {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
  resultIndex: number;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
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

export default function AmbassadorVoice({
  onSubmit,
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

  useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
  }, []);

  // Audio-amplitude loop (voor visuele reactiviteit van de Presence).
  function startAudioMonitoring() {
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
        // Geen permissie — gewoon niet monitoren, speech API werkt wel.
      });
  }

  function stopAudioMonitoring() {
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
  }

  function toggleListening() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const SR = getSpeechRecognition();
    if (!SR) return;

    const rec = new SR();
    rec.lang = "nl-NL";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event: SpeechRecognitionEventLike) => {
      const last = event.results[event.results.length - 1];
      if (last?.isFinal) {
        const transcript = last[0].transcript.trim();
        if (transcript) onSubmit(transcript);
      }
    };
    rec.onerror = () => {
      setListening(false);
      stopAudioMonitoring();
    };
    rec.onend = () => {
      setListening(false);
      stopAudioMonitoring();
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
      startAudioMonitoring();
    } catch {
      setListening(false);
    }
  }

  // TTS van binnenkomende antwoorden (alleen als voice aan staat én tekst nieuw is).
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!speakText || speakText === lastSpokenRef.current) return;

    lastSpokenRef.current = speakText;
    // Cancel eerdere utterances om overlap te voorkomen.
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(speakText);
    utt.lang = "nl-NL";
    utt.rate = 1.02;
    utt.pitch = 1.0;

    // Kies een Nederlandse stem als beschikbaar.
    const voices = window.speechSynthesis.getVoices();
    const dutch =
      voices.find((v) => v.lang.toLowerCase().startsWith("nl")) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("en-gb"));
    if (dutch) utt.voice = dutch;

    window.speechSynthesis.speak(utt);
  }, [speakText, enabled]);

  // Cleanup bij unmount of bij disablen.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      aria-label={listening ? "Stop met luisteren" : "Spreek je vraag in"}
      aria-pressed={listening}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all ${
        listening
          ? "border-[#4af0c4] bg-[#4af0c4]/20 text-[#4af0c4]"
          : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {listening ? (
        <span
          aria-hidden="true"
          className="relative flex h-3 w-3"
        >
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
