/**
 * POST /api/brand-ambassador/chat
 *
 * Streaming chat endpoint voor de MAISON BLNDR Brand Ambassador.
 * Gebruikt Anthropic Messages API met tool-use: Claude heeft een
 * `capture_lead` tool die server-side state bijwerkt tijdens het gesprek.
 * Zodra het leadprofiel volledig genoeg is (contact-kanaal + toestemming),
 * wordt automatisch een notificatie naar Karl gestuurd + Twenty CRM gepusht.
 *
 * Streaming-architectuur:
 *  - Client doet één fetch met SSE response
 *  - Server draait een tool-use loop: stream tekst deltas → als Claude
 *    een tool roept, execute server-side → append resultaat → loop opnieuw
 *  - Max 3 iteraties (safety guard tegen infinite loops)
 *
 * Out-of-scope bescherming zit in de pre-LLM filter (prompt-injection, off-
 * topic) en de system prompt zelf.
 */

import type { NextRequest } from "next/server";
import { after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  MessageStreamEvent,
  ContentBlock,
  ToolUseBlock,
  Tool,
} from "@anthropic-ai/sdk/resources/messages";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { buildSystemPrompt } from "@/lib/brand-ambassador/system-prompt";
import { filterUserMessage } from "@/lib/brand-ambassador/filter";
import {
  isValidConversationId,
  upsertSession,
  shouldNotify,
  markNotified,
  getSession,
} from "@/lib/brand-ambassador/session-store";
import { notifyLead } from "@/lib/brand-ambassador/notify";
import type {
  AmbassadorLead,
  ChatMessage,
  ChatRequest,
} from "@/lib/brand-ambassador/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 2000;
const MAX_TOTAL_CHARS = 40_000;
const MAX_TOOL_ITERATIONS = 3;

const CAPTURE_LEAD_TOOL: Tool = {
  name: "capture_lead",
  description:
    "Leg nieuwe of bijgewerkte lead-informatie vast over de huidige bezoeker. Roep deze tool aan zodra je in het gesprek een naam, email, telefoonnummer, bedrijf, rol, sector, teamgrootte of urgentie hoort. Stuur alleen de velden door die je daadwerkelijk hebt gehoord — laat onbekende velden weg. Zet toestemming_contact alleen op true wanneer de bezoeker expliciet akkoord gaat met contactopname (bv. 'ja, bel me maar terug').",
  input_schema: {
    type: "object" as const,
    properties: {
      naam: { type: "string", description: "Voor- + achternaam van de bezoeker" },
      email: { type: "string", description: "E-mailadres" },
      telefoon: {
        type: "string",
        description: "Telefoonnummer zoals opgegeven (we normaliseren server-side)",
      },
      bedrijf: { type: "string" },
      rol: { type: "string", description: "Functie / rol binnen het bedrijf" },
      sector: { type: "string" },
      teamgrootte: {
        type: "string",
        description: "ZZP / <10 / 10-50 / 50-250 / 250+",
      },
      urgentie: {
        type: "string",
        description: "Tijdlijn of hoe urgent dit is",
      },
      interesse: {
        type: "string",
        description:
          "Korte eigen samenvatting (1-2 zinnen) van wat deze bezoeker zoekt",
      },
      toestemming_contact: {
        type: "boolean",
        description:
          "ALLEEN true wanneer de bezoeker expliciet toestemming heeft gegeven om gecontacteerd te worden",
      },
    },
  },
};

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}

function deterministicStream(reply: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };
      send("delta", { text: reply });
      send("done", { full: reply });
      controller.close();
    },
  });
}

function sanitizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ChatMessage[] = [];
  let total = 0;
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") return null;
    const e = entry as Record<string, unknown>;
    if (e.role !== "user" && e.role !== "assistant") return null;
    if (typeof e.content !== "string") return null;
    const content = e.content.slice(0, MAX_MESSAGE_CHARS);
    total += content.length;
    if (total > MAX_TOTAL_CHARS) return null;
    out.push({ role: e.role, content });
  }
  if (out.length === 0) return null;
  if (out[out.length - 1].role !== "user") return null;
  return out;
}

function sanitizeBrand(raw: unknown): { name: string; hue: number } | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.name !== "string" || typeof r.hue !== "number") return null;
  const name = r.name.trim().slice(0, 60);
  if (!name) return null;
  const hue = Math.max(0, Math.min(360, Math.round(r.hue)));
  return { name, hue };
}

/**
 * Valideer + trim een tool-input naar AmbassadorLead-fields. Retourneert
 * null als input niet workable is. Extra velden die Claude verzint worden
 * gewoon gedropt (niet als error gezien — soms halluciteert een model iets
 * en willen we gewoon doorgaan met wat wél valide is).
 */
function sanitizeLeadPatch(raw: unknown): Partial<AmbassadorLead> | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const patch: Partial<AmbassadorLead> = {};
  const strField = (key: keyof AmbassadorLead, max = 200) => {
    const v = r[key];
    if (typeof v === "string") {
      const t = v.trim().slice(0, max);
      if (t) (patch as Record<string, unknown>)[key] = t;
    }
  };
  strField("naam", 120);
  strField("email", 200);
  strField("telefoon", 40);
  strField("bedrijf", 200);
  strField("rol", 120);
  strField("sector", 120);
  strField("teamgrootte", 60);
  strField("urgentie", 200);
  strField("interesse", 500);
  if (typeof r.toestemming_contact === "boolean") {
    patch.toestemming_contact = r.toestemming_contact;
  }
  return Object.keys(patch).length > 0 ? patch : null;
}

/**
 * Voer één capture_lead tool-call uit. Merge de patch in het session-
 * profiel en kickt (async, non-blocking) een notify af zodra de drempel
 * bereikt is.
 *
 * Returnt een compact result-object dat we als tool_result aan Claude
 * geven zodat het model weet wat er al bekend is.
 */
function executeCaptureLead(
  conversationId: string,
  input: unknown,
  messages: ChatMessage[],
  brand: ReturnType<typeof sanitizeBrand>
): { ok: boolean; captured: AmbassadorLead; notify_sent: boolean; error?: string } {
  const patch = sanitizeLeadPatch(input);
  if (!patch) {
    const existing = getSession(conversationId)?.profile ?? {};
    return {
      ok: false,
      captured: existing,
      notify_sent: false,
      error: "Geen bruikbare velden in input. Stuur alleen strings/booleans uit het schema.",
    };
  }

  const session = upsertSession(conversationId, patch);
  const needNotify = shouldNotify(session);

  if (needNotify) {
    // Zet alvast op notified zodat een tweede tool-call in dezelfde turn
    // niet nog een mail triggert. Bij falen van de daadwerkelijke send
    // zien we dat in de logs, maar we spamemen Karl liever niet dubbel.
    markNotified(conversationId);
    after(async () => {
      try {
        await notifyLead(session.profile, messages, brand, "conversational");
      } catch (err) {
        console.error("[BA-chat] notifyLead faalde:", err);
      }
    });
  }

  return { ok: true, captured: session.profile, notify_sent: needNotify };
}

/**
 * Verzamel alle content-blocks uit de finalMessage van een iteratie.
 * We hebben ze nodig om in de volgende iteratie de assistant-message
 * correct op te bouwen (met óf text blocks, óf tool_use blocks).
 */
function extractToolUseBlocks(blocks: ContentBlock[]): ToolUseBlock[] {
  return blocks.filter((b): b is ToolUseBlock => b.type === "tool_use");
}

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rate = checkRateLimit(`ba-chat:${ip}`, 30, 5 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel berichten. Probeer het opnieuw over ${rate.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const parsed = await readJsonBody<ChatRequest>(request, 64 * 1024);
  if (!parsed.ok) return parsed.response;

  const messages = sanitizeMessages(parsed.data.messages);
  if (!messages) {
    return Response.json({ error: "Ongeldige berichten." }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json(
      { error: `Gesprek is te lang (max ${MAX_MESSAGES} berichten).` },
      { status: 400 }
    );
  }

  // Pre-LLM filter: pattern-match op het laatste user-bericht.
  const lastUserMessage = messages[messages.length - 1];
  const filter = filterUserMessage(lastUserMessage.content);
  if (!filter.allowed) {
    console.info(
      `[brand-ambassador/chat] filter blocked: reason=${filter.reason} ip=${ip}`
    );
    return new Response(deterministicStream(filter.reply), { headers: sseHeaders() });
  }

  const brand = sanitizeBrand(parsed.data.brand);
  const systemPrompt = buildSystemPrompt(brand);

  // ConversationId: client-generated. Zonder id kunnen we geen session
  // opbouwen — dan doen we gewoon "dumb chat mode" zonder tool-use.
  const convId = isValidConversationId(parsed.data.conversationId)
    ? parsed.data.conversationId
    : null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Ambassador tijdelijk niet beschikbaar (config)." },
      { status: 503 }
    );
  }

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Werkende message-list die groeit per tool-iteratie. We starten met
      // de sanitized user-history; assistant en tool_result blocks worden
      // append'd.
      const working: MessageParam[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let fullText = "";

      try {
        for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
          const anthropicStream = await client.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: systemPrompt,
            // Tools alleen meegeven wanneer we een conversationId hebben —
            // anders kunnen we de tool-resultaten toch nergens opslaan.
            ...(convId ? { tools: [CAPTURE_LEAD_TOOL] } : {}),
            messages: working,
          });

          for await (const event of anthropicStream as AsyncIterable<MessageStreamEvent>) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              fullText += event.delta.text;
              send("delta", { text: event.delta.text });
            }
          }

          const final = await anthropicStream.finalMessage();

          // Tool-use afhandeling. Append assistant-message met de RAW
          // content blocks (inclusief tool_use) zodat Anthropic de
          // vervolg-call accepteert.
          if (final.stop_reason === "tool_use" && convId) {
            const toolUses = extractToolUseBlocks(final.content);
            working.push({ role: "assistant", content: final.content });

            const toolResults = toolUses.map((tu) => {
              if (tu.name !== "capture_lead") {
                return {
                  type: "tool_result" as const,
                  tool_use_id: tu.id,
                  content: JSON.stringify({
                    ok: false,
                    error: `Onbekende tool: ${tu.name}`,
                  }),
                  is_error: true,
                };
              }
              const result = executeCaptureLead(convId, tu.input, messages, brand);
              return {
                type: "tool_result" as const,
                tool_use_id: tu.id,
                content: JSON.stringify(result),
              };
            });

            working.push({ role: "user", content: toolResults });
            continue;
          }

          // Normaal einde — we zijn klaar.
          break;
        }

        send("done", { full: fullText });
      } catch (err) {
        console.error("[brand-ambassador/chat] stream error:", err);
        send("error", { error: "Er ging iets mis bij het genereren van een antwoord." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}
