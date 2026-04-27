/**
 * GET /api/brand-ambassador/voice-session
 *
 * Genereert een signed WebSocket URL voor een ElevenLabs Conversational AI
 * sessie. De browser krijgt een short-lived signed URL terug waarmee hij
 * rechtstreeks naar ElevenLabs kan verbinden voor een live voice-gesprek.
 *
 * Waarom signed URLs ipv direct agent_id sharen?
 *  - API key blijft server-side
 *  - We kunnen per-request rate limiten
 *  - We kunnen later context meegeven (brand, session_id, etc.)
 *
 * Fallback: als ELEVENLABS_AGENT_ID niet gezet is, geven we 503 terug.
 * De frontend verbergt dan de "Praat live"-knop.
 */

import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import {
  ELEVENLABS_API_BASE,
  getElevenLabsConfig,
} from "@/lib/brand-ambassador/elevenlabs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  // 6 live-sessies per uur per IP. Een live gesprek is duur (~€0.10-0.30/min),
  // we willen geen abuse via auto-triggered sessies.
  const rate = checkRateLimit(`ba-voice-session:${ip}`, 6, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      {
        error: `Te veel live-sessies gestart. Probeer het opnieuw over ${Math.ceil(
          rate.retryAfterSeconds / 60
        )} minuten.`,
      },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const config = getElevenLabsConfig();
  if (!config.convaiEnabled || !config.apiKey || !config.agentId) {
    console.warn(
      "[BA-voice-session] ConvAI niet geconfigureerd — hasKey=%s hasAgentId=%s",
      Boolean(config.apiKey),
      Boolean(config.agentId)
    );
    return Response.json(
      {
        error:
          "Live-modus is momenteel uitgeschakeld. Gebruik de tekst-chat — daar krijg je hetzelfde antwoord.",
      },
      { status: 503 }
    );
  }

  const url = `${ELEVENLABS_API_BASE}/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(
    config.agentId
  )}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "GET",
      headers: {
        "xi-api-key": config.apiKey,
      },
    });
  } catch (err) {
    console.error("[BA-voice-session] upstream fetch failed:", err);
    return Response.json(
      { error: "Voice-service onbereikbaar." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error(
      `[BA-voice-session] upstream ${upstream.status} for agent=${config.agentId}:`,
      detail.slice(0, 500)
    );
    // Map upstream-status naar een behulpzame client-message zonder
    // config-details te lekken. Gebruikers moeten hieruit kunnen begrijpen
    // of het ligt aan (a) tijdelijk probleem bij ElevenLabs of (b)
    // permanente misconfig aan onze kant.
    let clientError: string;
    if (upstream.status === 401 || upstream.status === 403) {
      clientError =
        "Live-modus is momenteel niet correct geconfigureerd. Gebruik de tekst-chat — die werkt wél.";
    } else if (upstream.status === 404) {
      clientError =
        "Live-modus is tijdelijk niet beschikbaar (agent niet gevonden). Gebruik de tekst-chat.";
    } else if (upstream.status === 429) {
      clientError =
        "Te veel live-sessies bij de voice-provider. Probeer het over een paar minuten opnieuw.";
    } else if (upstream.status >= 500) {
      clientError =
        "De voice-service heeft een hik. Probeer het over een minuut opnieuw, of ga verder in tekst-chat.";
    } else {
      clientError = "Kon live-sessie niet opstarten. Gebruik de tekst-chat of probeer het later opnieuw.";
    }
    return Response.json({ error: clientError }, { status: 502 });
  }

  const data = (await upstream.json()) as { signed_url?: string };
  const signedUrl = data.signed_url;
  if (!signedUrl) {
    console.error("[BA-voice-session] missing signed_url in response");
    return Response.json(
      {
        error:
          "Live-modus gaf geen geldige sessie terug. Gebruik de tekst-chat of probeer het later opnieuw.",
      },
      { status: 502 }
    );
  }

  return Response.json({ signedUrl, agentId: config.agentId });
}
