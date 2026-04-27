/**
 * GET /api/brand-ambassador/voice-session/debug?token=xxx
 *
 * Admin-only diagnostische endpoint. Doet drie checks tegen ElevenLabs:
 *   1. Config-sanity (env vars aanwezig? geen whitespace?)
 *   2. Agent fetch — GET /v1/convai/agents/{agent_id}
 *      → 200 = agent bestaat; toont voice/llm/name
 *      → 404 = agent_id klopt niet of is verwijderd
 *      → 401/403 = API-key heeft geen ConvAI-permissions
 *   3. Signed-url fetch — GET /v1/convai/conversation/get-signed-url
 *      → 200 = alles werkt
 *      → anders = exact wat de productie-route ook zou krijgen
 *
 * Authenticatie: `?token=xxx` moet matchen met `BA_DEBUG_TOKEN` env var.
 * Als `BA_DEBUG_TOKEN` niet gezet is, retourneert deze endpoint 404
 * zodat hij niet bestaat vanuit het perspectief van een aanvaller.
 *
 * Output is bewust rauw (inclusief upstream response-bodies) zodat je
 * zonder naar Vercel logs te gaan direct de root-cause ziet. Alleen
 * zichtbaar voor wie het admin-token bezit.
 *
 * Verwijder dit endpoint of rotate het token na debug — het lekt wel
 * agent-details (voice, llm, prompt preview) en sommige API-response
 * shapes van ElevenLabs.
 */

import { timingSafeEqual } from "node:crypto";
import {
  ELEVENLABS_API_BASE,
  getElevenLabsConfig,
} from "@/lib/brand-ambassador/elevenlabs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckResult {
  ok: boolean;
  status: number;
  statusText: string;
  bodyPreview: string;
  parsed?: unknown;
}

async function runCheck(url: string, apiKey: string): Promise<CheckResult> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "xi-api-key": apiKey },
    });
    const raw = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // non-JSON respons — leave undefined
    }
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      bodyPreview: raw.slice(0, 2000),
      parsed,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      statusText: err instanceof Error ? err.message : "network error",
      bodyPreview: "",
    };
  }
}

function constantTimeEquals(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function GET(request: Request) {
  const debugToken = process.env.BA_DEBUG_TOKEN;
  if (!debugToken) {
    // Pretend this endpoint doesn't exist if no token is configured.
    return new Response("Not Found", { status: 404 });
  }

  const url = new URL(request.url);
  const providedToken = url.searchParams.get("token") || "";
  if (!providedToken || !constantTimeEquals(providedToken, debugToken)) {
    return new Response("Not Found", { status: 404 });
  }

  const config = getElevenLabsConfig();

  const diagnose = {
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: Boolean(config.apiKey),
      apiKeyLength: config.apiKey?.length ?? 0,
      apiKeyPrefix: config.apiKey ? config.apiKey.slice(0, 5) + "…" : null,
      hasAgentId: Boolean(config.agentId),
      agentIdLength: config.agentId?.length ?? 0,
      agentIdPreview: config.agentId
        ? `${config.agentId.slice(0, 8)}…${config.agentId.slice(-4)}`
        : null,
      agentIdHasWhitespace: config.agentId
        ? /\s/.test(config.agentId)
        : false,
      voiceId: config.voiceId,
      modelId: config.modelId,
    },
    checks: {
      agentFetch: null as CheckResult | null,
      signedUrlFetch: null as CheckResult | null,
    },
    hints: [] as string[],
  };

  if (!config.apiKey || !config.agentId) {
    diagnose.hints.push(
      "Env vars ontbreken — zet ELEVENLABS_API_KEY + ELEVENLABS_AGENT_ID in Vercel."
    );
    return Response.json(diagnose, { status: 200 });
  }

  // Check 1: agent bestaat?
  diagnose.checks.agentFetch = await runCheck(
    `${ELEVENLABS_API_BASE}/convai/agents/${encodeURIComponent(config.agentId)}`,
    config.apiKey
  );

  // Check 2: signed URL — wat productie-route OOK doet.
  diagnose.checks.signedUrlFetch = await runCheck(
    `${ELEVENLABS_API_BASE}/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(
      config.agentId
    )}`,
    config.apiKey
  );

  // Interpretatie-hints voor snelle diagnose.
  const a = diagnose.checks.agentFetch;
  const s = diagnose.checks.signedUrlFetch;

  if (a?.status === 401 || s?.status === 401) {
    diagnose.hints.push(
      "401 — API-key is ongeldig of heeft geen ConvAI-rechten. Check permissions op https://elevenlabs.io/app/settings/api-keys"
    );
  }
  if (a?.status === 403 || s?.status === 403) {
    diagnose.hints.push(
      "403 — API-key heeft geen toegang tot ConvAI. Voeg Conversational AI Read + Write permissions toe aan de key."
    );
  }
  if (a?.status === 404) {
    diagnose.hints.push(
      `404 op /agents/${config.agentId} — agent bestaat niet in deze workspace. Check of ELEVENLABS_AGENT_ID klopt en of de key van dezelfde workspace is als de agent.`
    );
  }
  if (s?.status === 404 && a?.status === 200) {
    diagnose.hints.push(
      "Agent bestaat wel maar get-signed-url geeft 404 — mogelijk is ConvAI voor deze agent niet geactiveerd. Open de agent in https://elevenlabs.io/app/conversational-ai en controleer dat voice + LLM zijn geconfigureerd."
    );
  }
  if (a?.status === 200 && s?.ok) {
    diagnose.hints.push(
      "✓ Alle checks slagen — live-sessie zou moeten werken. Controleer de client-side: mic-toegang, WebSocket geblokkeerd, of agent-setup-probleem dat zich pas bij daadwerkelijke sessie manifesteert."
    );
  }
  if (diagnose.env.agentIdHasWhitespace) {
    diagnose.hints.push(
      "⚠ ELEVENLABS_AGENT_ID bevat whitespace. Check de env-var op trailing spaces of newlines."
    );
  }

  return Response.json(diagnose, { status: 200 });
}
