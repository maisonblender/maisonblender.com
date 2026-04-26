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

/**
 * Streaming TTS queue:
 *  - `id` incrementeert per user-turn. Als de id wijzigt droppen we elke
 *    nog-draaiende audio en starten fris: de vorige response is obsolete.
 *  - `sentences` is een cumulatieve array — tijdens SSE-streaming worden
 *    er zinnen aan het eind toegevoegd. We houden intern bij tot welke
 *    index we gespeeld hebben en pakken de volgende zodra we vrij zijn.
 */
export interface SpeakSession {
  id: number;
  sentences: string[];
}

interface Props {
  onSubmit: (text: string) => void;
  onInterim?: (text: string) => void;
  onError?: (message: string) => void;
  speakSession?: SpeakSession;
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
  speakSession,
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
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAbortRef = useRef<AbortController | null>(null);

  // VAD + continuous-recognition state:
  //  - finalBufferRef: accumuleert alle final transcripts van de huidige
  //    recognition-sessie. In continuous-mode krijgen we per ingesproken
  //    zin een final — we submitten pas wanneer rec.stop() gecalled wordt
  //    (door VAD of door user klik).
  //  - listeningRef: mirror van `listening` state zodat de amplitudeLoop
  //    zonder re-render toegang heeft tot de huidige status.
  //  - lastSpeechAtRef: timestamp (ms) van laatste mic-amplitude boven
  //    threshold. Gebruikt voor silence-based auto-stop.
  //  - startedAtRef: timestamp van recognition-start, voor no-speech
  //    fallback timeout.
  const finalBufferRef = useRef<string>("");
  const listeningRef = useRef<boolean>(false);
  const lastSpeechAtRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);

  // Queue-state voor streaming TTS. `playedIdx` = index van de volgende zin
  // die we gaan uitspreken. `lastSessionId` detecteert nieuwe turns zodat
  // we de queue kunnen resetten. `playing` voorkomt overlappende fetches.
  const playedIdxRef = useRef<number>(0);
  const lastSessionIdRef = useRef<number>(-1);
  const playingRef = useRef<boolean>(false);
  // Live-reference naar de huidige session zodat de play-loop altijd de
  // laatste state ziet zonder dat we hem in callback-deps hoeven te zetten.
  const sessionRef = useRef<SpeakSession | undefined>(speakSession);
  sessionRef.current = speakSession;

  useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      void loadVoices();
    }
  }, []);

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (audioCtxRef.current) {
      // Kan suspended zijn na tab-wissel of op iOS. Resume is een no-op
      // als hij al loopt. We fire-and-forgetten — de caller gebruikt de
      // context binnen een user-gesture dus autoplay policies triggeren
      // vanzelf.
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => void 0);
      }
      return audioCtxRef.current;
    }
    if (typeof window === "undefined") return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    audioCtxRef.current = new AudioCtx();
    return audioCtxRef.current;
  }, []);

  // VAD-parameters. Getuned voor natuurlijke Nederlandse spraak met
  // denkpauzes tussen zinnen.
  const SPEECH_THRESHOLD = 0.08; // amplitude waarboven we spraak aannemen
  const VAD_SILENCE_MS = 1800; // stilte-duur na spraak → auto-stop
  const NO_SPEECH_TIMEOUT_MS = 15000; // absolute cap bij stuck mic

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
      let micLevel = 0;
      if (mic) {
        const data = new Uint8Array(mic.frequencyBinCount);
        mic.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        micLevel = Math.sqrt(sum / data.length) * 3;
        level = Math.max(level, micLevel);
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

      // VAD auto-stop logic: alleen actief terwijl we luisteren en mic
      // actief is. We onderscheiden drie gevallen:
      //  a) spraak gedetecteerd → update lastSpeechAt
      //  b) stilte na spraak >= VAD_SILENCE_MS én er is transcript →
      //     rec.stop() triggert onend → submit
      //  c) geen enkele spraak binnen NO_SPEECH_TIMEOUT_MS → rec.stop()
      if (listeningRef.current && mic) {
        const now = Date.now();
        if (micLevel > SPEECH_THRESHOLD) {
          lastSpeechAtRef.current = now;
        } else if (
          lastSpeechAtRef.current > 0 &&
          now - lastSpeechAtRef.current > VAD_SILENCE_MS &&
          (finalBufferRef.current || interimRef.current).trim().length > 0
        ) {
          lastSpeechAtRef.current = 0;
          try {
            recRef.current?.stop();
          } catch {
            // ignore — onend handelt de rest af
          }
        } else if (
          lastSpeechAtRef.current === 0 &&
          startedAtRef.current > 0 &&
          now - startedAtRef.current > NO_SPEECH_TIMEOUT_MS
        ) {
          startedAtRef.current = 0;
          try {
            recRef.current?.stop();
          } catch {
            // ignore
          }
        }
      }

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
      .getUserMedia({
        // Echo cancellation is essentieel voor barge-in: zonder deze pakt
        // de mic de TTS-output uit de speakers op en "hoort" de Ambassador
        // zichzelf. Noise suppression + auto gain maken de herkenning
        // betrouwbaarder bij gematigde achtergrondruis.
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
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
    // continuous=true: browser-level silence detection uit, wij handelen
    // stop-logic zelf via VAD in de amplitudeLoop. Zonder dit capt Chrome
    // de input na ~0.8s stilte midden in een zin af.
    rec.continuous = true;
    rec.maxAlternatives = 1;

    // Reset alle buffers voor deze verse recognition-run.
    interimRef.current = "";
    finalBufferRef.current = "";
    lastSpeechAtRef.current = 0;
    startedAtRef.current = Date.now();

    rec.onstart = () => {
      setListening(true);
      listeningRef.current = true;
    };

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = "";
      let newFinal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0]?.transcript ?? "";
        if (res.isFinal) newFinal += transcript;
        else interim += transcript;
      }
      if (newFinal) {
        // Accumuleer final-chunks tot één coherente transcript; in
        // continuous-mode krijgen we meerdere finals (één per zin).
        finalBufferRef.current = (
          finalBufferRef.current +
          " " +
          newFinal
        ).trim();
      }
      interimRef.current = interim;
      const display = (finalBufferRef.current + " " + interim).trim();
      onInterim?.(display);
    };

    rec.onerror = (event: SpeechRecognitionErrorLike) => {
      const msg = friendlyError(event.error);
      if (msg) onError?.(msg);
      setListening(false);
      listeningRef.current = false;
      stopMicMonitoring();
    };

    rec.onend = () => {
      setListening(false);
      listeningRef.current = false;
      stopMicMonitoring();
      // Submit het volledige transcript (final + eventuele interim die
      // nog niet was gepromote naar final).
      const complete = (
        finalBufferRef.current +
        " " +
        interimRef.current
      ).trim();
      finalBufferRef.current = "";
      interimRef.current = "";
      onInterim?.("");
      lastSpeechAtRef.current = 0;
      startedAtRef.current = 0;
      if (complete) {
        onSubmit(complete);
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
      listeningRef.current = false;
      stopMicMonitoring();
    }
  }, [onSubmit, onInterim, onError, startMicMonitoring, stopMicMonitoring]);

  function toggleListening() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    // Barge-in: user onderbreekt de Ambassador. We doen drie dingen:
    //  1. stopPlayback → abort huidige TTS fetch + pauze audio
    //  2. playedIdx = MAX → tryPlayNext returnt early, dus queue-resumption
    //     is geblokt (zelfs als stream nog meer zinnen aanlevert). Nieuwe
    //     user-turn bumpt session.id → reset playedIdx naar 0.
    //  3. playing=false → staat klaar voor volgende session
    stopPlayback();
    playedIdxRef.current = Number.MAX_SAFE_INTEGER;
    playingRef.current = false;
    startRecognition();
  }

  /**
   * Probeer de volgende zin uit de queue af te spelen. Idempotent: als we
   * al bezig zijn, of de queue leeg is, doet deze niks. Na het afspelen
   * recurst hij zelf om de volgende zin te pakken — zo houden we playback
   * gapless terwijl de chat-stream nieuwe zinnen blijft aanvoeren.
   */
  const tryPlayNext = useCallback(async () => {
    if (playingRef.current) return;
    const session = sessionRef.current;
    if (!session) return;
    if (playedIdxRef.current >= session.sentences.length) return;

    const sentence = session.sentences[playedIdxRef.current];
    const expectedSessionId = session.id;
    playingRef.current = true;

    const abort = new AbortController();
    activeAbortRef.current = abort;

    try {
      const ok = await speakViaElevenLabs(sentence, abort);
      if (!ok && !abort.signal.aborted) {
        await speakNative(sentence, abort.signal);
      }
    } catch {
      // Best-effort — ga door naar volgende zin.
    }

    playingRef.current = false;

    // Als de session is gewisseld tijdens afspelen (user stelde nieuwe
    // vraag): stop met spelen, de session-effect handelt reset af.
    if (sessionRef.current?.id !== expectedSessionId) return;

    playedIdxRef.current += 1;

    // Recursief volgende zin proberen. Zo lopen we de queue leeg zonder
    // dat we afhankelijk zijn van re-renders.
    void tryPlayNext();
  }, [speakViaElevenLabs]);

  // Reageer op wijzigingen in de queue: nieuwe zin toegevoegd → probeer
  // te spelen. Nieuwe session id → reset cursor en abort lopende audio.
  useEffect(() => {
    if (!enabled) return;
    const session = speakSession;
    if (!session) return;

    if (session.id !== lastSessionIdRef.current) {
      lastSessionIdRef.current = session.id;
      playedIdxRef.current = 0;
      // Abort lopende audio van vorige turn. playingRef wordt op false
      // gezet door stopPlayback → abort → promise resolves.
      stopPlayback();
      playingRef.current = false;
    }

    void tryPlayNext();
  }, [speakSession, enabled, tryPlayNext, stopPlayback]);

  // Voice disable: stop alle lopende activiteit maar HOUD de AudioContext
  // in leven. Die mag pas dicht bij unmount — anders werkt re-enable niet
  // meer (Safari weigert createMediaStreamSource op een gesloten context).
  useEffect(() => {
    if (enabled) return;
    stopPlayback();
    playingRef.current = false;
    // Abort een eventueel nog draaiende SpeechRecognition — zonder dit
    // blijft er een stale instance hangen die een volgende start blokkeert.
    if (recRef.current) {
      try {
        recRef.current.abort();
      } catch {
        // ignore
      }
      recRef.current = null;
    }
    setListening(false);
    listeningRef.current = false;
    stopMicMonitoring();
    // Reset alle recognition + VAD buffers zodat volgende session fris
    // begint.
    finalBufferRef.current = "";
    interimRef.current = "";
    lastSpeechAtRef.current = 0;
    startedAtRef.current = 0;
    playedIdxRef.current = 0;
  }, [enabled, stopPlayback, stopMicMonitoring]);

  // Unmount teardown: alle audio-infra vrijgeven.
  useEffect(() => {
    return () => {
      stopPlayback();
      if (recRef.current) {
        try {
          recRef.current.abort();
        } catch {
          // ignore
        }
        recRef.current = null;
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
