/**
 * GET /api/brand-ambassador/config
 *
 * Publiek, lightweight endpoint dat alleen zegt WELKE voice-features
 * server-side geconfigureerd zijn. De frontend gebruikt dit om de
 * "Praat live"-knop al dan niet te tonen zonder echt een sessie te starten
 * (die kost geld + rate limit).
 *
 * Bevat geen secrets — alleen booleans.
 */

import { getElevenLabsConfig } from "@/lib/brand-ambassador/elevenlabs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = getElevenLabsConfig();
  return Response.json(
    {
      tts: config.ttsEnabled,
      live: config.convaiEnabled,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    }
  );
}
