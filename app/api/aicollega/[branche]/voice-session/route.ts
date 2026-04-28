/**
 * GET /api/aicollega/[branche]/voice-session?tenantId=<id>
 *
 * Tenant-aware variant van /api/brand-ambassador/voice-session.
 *
 * Architectuur (Optie B uit Karl's Voice-strategie):
 *   - Eén gedeelde ElevenLabs ConvAI-agent (zelfde ELEVENLABS_AGENT_ID env-var)
 *     bedient ALLE AI Collega-tenants.
 *   - Per sessie injecteren we tenant-specifieke instructies via session
 *     overrides: `agent.prompt.prompt` (volledige systeem-prompt) en
 *     `agent.firstMessage` (begroeting met persona + bedrijfsnaam).
 *   - Voordeel: geen per-tenant agent-onderhoud, geen verdubbeling van
 *     prompt-logic — text-chat én voice-chat draaien op exact dezelfde
 *     buildCollegaSystemPrompt() output.
 *
 * Vereiste configuratie in ElevenLabs dashboard (eenmalig):
 *   - Agent → Security → Allowed overrides → enable "Prompt", "First message",
 *     en "Language" (NL).
 *   - Zonder deze toggles negeert ElevenLabs onze overrides en valt de agent
 *     terug op zijn eigen statische prompt — dan klinkt iedere tenant gelijk.
 *
 * Returns naar de client:
 *   {
 *     signedUrl,                 // korte-leefduur WebSocket URL
 *     agentId,                   // info-only
 *     overrides: {
 *       systemPrompt: string,    // tenant-prompt voor agent.prompt.prompt
 *       firstMessage: string     // tenant-begroeting voor agent.firstMessage
 *     },
 *     branding: { brandName, personaLabel }
 *   }
 *
 * Failure modes:
 *   - 400  tenantId ontbreekt of branche-mismatch
 *   - 404  tenant onbekend (verkeerde id of tenant gewist na server-restart)
 *   - 429  rate-limit (per tenant + IP) overschreden
 *   - 502  ElevenLabs upstream gaf geen geldige signed_url
 *   - 503  ConvAI niet geconfigureerd op de server
 */

import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import {
  ELEVENLABS_API_BASE,
  getElevenLabsConfig,
} from "@/lib/brand-ambassador/elevenlabs";
import { getTenant } from "@/lib/aicollega/tenant-store";
import { buildCollegaSystemPrompt } from "@/lib/aicollega/prompt-builder";
import { DEFAULT_PERSONA_LABEL, type Branche } from "@/lib/aicollega/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_BRANCHES: ReadonlySet<Branche> = new Set([
  "makelaar",
  "accountant",
  "bouwbedrijf",
]);

/** Lokale, NL-tijd-aware begroeting. ElevenLabs server-side first_message is
 *  statisch ("Goedemiddag…"), dus we overriden 'm hier zodat 's morgens en
 *  's avonds de eerste indruk klopt. */
function getDutchGreeting(): string {
  const hour = new Date().toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    hour12: false,
  });
  const h = parseInt(hour, 10);
  if (Number.isNaN(h)) return "Hallo";
  if (h < 6) return "Goedenacht";
  if (h < 12) return "Goedemorgen";
  if (h < 18) return "Goedemiddag";
  return "Goedenavond";
}

function buildTenantFirstMessage(
  persona: string,
  naam: string,
  stad: string | undefined,
  toon: "formeel" | "informeel"
): string {
  const greeting = getDutchGreeting();
  const aanspreek = toon === "formeel" ? "u" : "je";
  const locatie = stad ? ` in ${stad}` : "";
  const heeftEigenNaam = persona !== DEFAULT_PERSONA_LABEL;

  if (heeftEigenNaam) {
    return toon === "formeel"
      ? `${greeting}. U spreekt met ${persona}, de online assistent van ${naam}${locatie}. Waarmee kan ik u helpen?`
      : `${greeting}, je spreekt met ${persona}, de online assistent van ${naam}${locatie}. Waar kan ik je mee helpen?`;
  }

  return toon === "formeel"
    ? `${greeting}. U spreekt met de online assistent van ${naam}${locatie}. Waarmee kan ik u helpen?`
    : `${greeting}. Je spreekt met de online assistent van ${naam}${locatie}. Waar kan ik ${aanspreek} mee helpen?`;
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ branche: string }> }
) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const { branche } = await ctx.params;
  if (!ALLOWED_BRANCHES.has(branche as Branche)) {
    return Response.json(
      { error: `Onbekende branche: ${branche}` },
      { status: 404 }
    );
  }

  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId");
  if (!tenantId || !tenantId.trim()) {
    return Response.json(
      { error: "tenantId ontbreekt in de query." },
      { status: 400 }
    );
  }

  const tenant = getTenant(tenantId);
  if (!tenant) {
    return Response.json(
      {
        error:
          "Tenant niet gevonden. Mogelijk is de demo-sessie verlopen — herlaad de pagina.",
      },
      { status: 404 }
    );
  }
  if (tenant.branche !== branche) {
    return Response.json(
      {
        error: `Tenant hoort bij branche '${tenant.branche}', niet bij '${branche}'.`,
      },
      { status: 400 }
    );
  }

  // Rate limit op tenant + IP. Live-sessie kost ~€0.10-0.30/min, dus
  // dezelfde grens als de MAISON BLNDR-route (6 sessies per uur per IP),
  // maar gescoped per tenant zodat verschillende kantoren elkaar niet hinderen.
  const ip = getClientIp(request);
  const rate = checkRateLimit(
    `aicollega-voice-session:${tenantId}:${ip}`,
    6,
    60 * 60 * 1000
  );
  if (!rate.allowed) {
    return Response.json(
      {
        error: `Te veel live-sessies gestart. Probeer het opnieuw over ${Math.ceil(
          rate.retryAfterSeconds / 60
        )} minuten.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  const config = getElevenLabsConfig();
  if (!config.convaiEnabled || !config.apiKey || !config.agentId) {
    console.warn(
      "[collega-voice-session] ConvAI niet geconfigureerd — hasKey=%s hasAgentId=%s",
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

  const upstreamUrl = `${ELEVENLABS_API_BASE}/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(
    config.agentId
  )}`;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: { "xi-api-key": config.apiKey },
    });
  } catch (err) {
    console.error("[collega-voice-session] upstream fetch failed:", err);
    return Response.json(
      { error: "Voice-service onbereikbaar." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error(
      `[collega-voice-session] upstream ${upstream.status} for tenant=${tenantId}:`,
      detail.slice(0, 500)
    );
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
      clientError =
        "Kon live-sessie niet opstarten. Gebruik de tekst-chat of probeer het later opnieuw.";
    }
    return Response.json({ error: clientError }, { status: 502 });
  }

  const data = (await upstream.json()) as { signed_url?: string };
  const signedUrl = data.signed_url;
  if (!signedUrl) {
    console.error("[collega-voice-session] missing signed_url in response");
    return Response.json(
      {
        error:
          "Live-modus gaf geen geldige sessie terug. Gebruik de tekst-chat of probeer het later opnieuw.",
      },
      { status: 502 }
    );
  }

  const persona = tenant.personaNaam?.trim() || DEFAULT_PERSONA_LABEL;
  const systemPrompt = buildCollegaSystemPrompt(tenant);
  const firstMessage = buildTenantFirstMessage(
    persona,
    tenant.naam,
    tenant.stad,
    tenant.toon
  );

  return Response.json({
    signedUrl,
    agentId: config.agentId,
    overrides: {
      systemPrompt,
      firstMessage,
    },
    branding: {
      brandName: tenant.naam,
      personaLabel: persona,
    },
  });
}
