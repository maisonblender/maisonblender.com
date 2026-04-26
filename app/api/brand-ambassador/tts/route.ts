/**
 * POST /api/brand-ambassador/tts
 *
 * ElevenLabs TTS proxy. Stream audio/mpeg terug naar de browser zodat de
 * Ambassador natuurlijk klinkt (multilingual v2) ipv de browser-SpeechSynthesis.
 *
 * Proxy-model gekozen omdat we:
 *  1. De API key niet naar de browser willen lekken
 *  2. Een server-side rate limit willen om kosten te controleren
 *  3. Origin/CSRF check willen (geen externe sites die onze quota gebruiken)
 *
 * Response = audio/mpeg (MP3 128kbps) stream. Browser kan direct afspelen.
 *
 * Fallback: als ELEVENLABS_API_KEY niet gezet is antwoorden we 503. De
 * frontend valt dan terug op SpeechSynthesis.
 */

import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import {
  ELEVENLABS_API_BASE,
  getElevenLabsConfig,
} from "@/lib/brand-ambassador/elevenlabs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT_CHARS = 1500;

interface TtsRequest {
  text: string;
}

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  // 40 TTS-calls per 10 min per IP. Elk AI-antwoord wordt max 1x voorgelezen,
  // dit is ruim genoeg voor normaal gebruik maar dempt abuse.
  const rate = checkRateLimit(`ba-tts:${ip}`, 40, 10 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel voice-requests. Probeer het opnieuw over ${rate.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const parsed = await readJsonBody<TtsRequest>(request, 16 * 1024);
  if (!parsed.ok) return parsed.response;

  const text = typeof parsed.data.text === "string" ? parsed.data.text.trim() : "";
  if (!text) {
    return Response.json({ error: "Geen tekst." }, { status: 400 });
  }
  if (text.length > MAX_TEXT_CHARS) {
    return Response.json(
      { error: `Tekst te lang (max ${MAX_TEXT_CHARS} karakters).` },
      { status: 400 }
    );
  }

  const config = getElevenLabsConfig();
  if (!config.ttsEnabled || !config.apiKey) {
    return Response.json(
      { error: "Voice tijdelijk niet beschikbaar.", fallback: true },
      { status: 503 }
    );
  }

  const url = `${ELEVENLABS_API_BASE}/text-to-speech/${config.voiceId}/stream?output_format=mp3_44100_128`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": config.apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: config.modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });
  } catch (err) {
    console.error("[BA-tts] upstream fetch failed:", err);
    return Response.json(
      { error: "Voice-service onbereikbaar.", fallback: true },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(`[BA-tts] upstream ${upstream.status}:`, detail.slice(0, 500));
    return Response.json(
      { error: "Voice-service gaf een fout.", fallback: true },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
