/**
 * POST /api/aicollega/[branche]/chat
 *
 * Tenant-aware streaming chat endpoint voor de AI Collega.
 * Architectuur identiek aan de Brand Ambassador chat route, maar met
 * een dynamisch gegenereerde system-prompt vanuit de tenant-config.
 *
 * De client stuurt: { messages, tenantId, conversationId? }
 * De server zoekt de tenant op, bouwt de prompt en streamt de response.
 *
 * Tool-use: capture_lead — zelfde schema als Brand Ambassador.
 */

import type { NextRequest } from "next/server";
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
import { getTenant } from "@/lib/aicollega/tenant-store";
import { buildCollegaSystemPrompt } from "@/lib/aicollega/prompt-builder";
import type { CollegaChatRequest, ChatMessage } from "@/lib/aicollega/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 2000;
const MAX_TOTAL_CHARS = 40_000;
const MAX_TOOL_ITERATIONS = 3;

interface LeadData {
  naam?: string;
  email?: string;
  telefoon?: string;
  interesse?: string;
  urgentie?: string;
  toestemming_contact?: boolean;
  // Makelaar-specifieke kwalificatievelden
  budget?: string;
  locatie_voorkeur?: string;
  type_woning?: string;
  financiering?: string;
  al_in_bezit?: string;
  lead_score?: "warm" | "lauw" | "koud" | "onbekend";
}

const CAPTURE_LEAD_TOOL: Tool = {
  name: "capture_lead",
  description:
    "Leg lead-informatie vast over de bezoeker. Roep aan zodra je structuurbare info hoort. Stuur alleen de velden die daadwerkelijk zijn gemeld — verzin nooit.",
  input_schema: {
    type: "object" as const,
    properties: {
      naam: { type: "string", description: "Naam van de bezoeker" },
      email: { type: "string", description: "E-mailadres" },
      telefoon: { type: "string", description: "Telefoonnummer" },
      interesse: { type: "string", description: "Korte samenvatting van wat de bezoeker zoekt (1-2 zinnen)" },
      urgentie: { type: "string", description: "Tijdlijn of urgentie (bv. 'zo snel mogelijk', 'binnen 6 maanden')" },
      toestemming_contact: {
        type: "boolean",
        description: "true ALLEEN wanneer de bezoeker expliciet akkoord geeft voor contactopname",
      },
      budget: { type: "string", description: "Budget of prijsklasse (bv. 'tot €300.000', '€300k-€500k')" },
      locatie_voorkeur: { type: "string", description: "Gewenste locatie of buurt" },
      type_woning: { type: "string", description: "Type woning (appartement, vrijstaand, rijtjeshuis, etc.)" },
      financiering: {
        type: "string",
        description: "Status hypotheek/financiering (bv. 'al goedgekeurd', 'nog niet gestart')",
      },
      al_in_bezit: {
        type: "string",
        description: "Heeft de bezoeker al een woning die verkocht moet worden?",
      },
      lead_score: {
        type: "string",
        enum: ["warm", "lauw", "koud", "onbekend"],
        description:
          "warm = klaar om te handelen; lauw = serieus maar nog niet klaar; koud = oriënterend; onbekend = te weinig info",
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
    out.push({ role: e.role as "user" | "assistant", content });
  }
  if (out.length === 0) return null;
  if (out[out.length - 1].role !== "user") return null;
  return out;
}

function sanitizeLeadData(raw: unknown): Partial<LeadData> | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const patch: Partial<LeadData> = {};
  const strField = (key: keyof LeadData, max = 200) => {
    const v = r[key];
    if (typeof v === "string") {
      const t = v.trim().slice(0, max);
      if (t) (patch as Record<string, unknown>)[key] = t;
    }
  };
  strField("naam", 120);
  strField("email", 200);
  strField("telefoon", 40);
  strField("interesse", 500);
  strField("urgentie", 200);
  strField("budget", 100);
  strField("locatie_voorkeur", 200);
  strField("type_woning", 100);
  strField("financiering", 200);
  strField("al_in_bezit", 200);
  if (typeof r.toestemming_contact === "boolean") {
    patch.toestemming_contact = r.toestemming_contact;
  }
  const validScores = ["warm", "lauw", "koud", "onbekend"] as const;
  if (typeof r.lead_score === "string" && validScores.includes(r.lead_score as typeof validScores[number])) {
    patch.lead_score = r.lead_score as LeadData["lead_score"];
  }
  return Object.keys(patch).length > 0 ? patch : null;
}

function extractToolUseBlocks(blocks: ContentBlock[]): ToolUseBlock[] {
  return blocks.filter((b): b is ToolUseBlock => b.type === "tool_use");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ branche: string }> }
) {
  const { branche } = await params;

  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rate = checkRateLimit(`aicollega-chat:${ip}`, 30, 5 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel berichten. Probeer over ${rate.retryAfterSeconds}s opnieuw.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const parsed = await readJsonBody<CollegaChatRequest>(request, 64 * 1024);
  if (!parsed.ok) return parsed.response;

  const { tenantId, messages: rawMessages, conversationId } = parsed.data;

  if (!tenantId || typeof tenantId !== "string") {
    return Response.json({ error: "tenantId verplicht." }, { status: 400 });
  }

  const validBranches = ["makelaar", "accountant", "bouwbedrijf"];
  if (!validBranches.includes(branche)) {
    return Response.json({ error: "Onbekende branche." }, { status: 400 });
  }

  const tenant = getTenant(tenantId);
  if (!tenant) {
    return Response.json({ error: "Tenant niet gevonden." }, { status: 404 });
  }

  if (tenant.branche !== branche) {
    return Response.json({ error: "Branche mismatch." }, { status: 400 });
  }

  const messages = sanitizeMessages(rawMessages);
  if (!messages) {
    return Response.json({ error: "Ongeldige berichten." }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json(
      { error: `Gesprek te lang (max ${MAX_MESSAGES} berichten).` },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Service tijdelijk niet beschikbaar." }, { status: 503 });
  }

  const systemPrompt = buildCollegaSystemPrompt(tenant);
  const hasConvId = typeof conversationId === "string" && conversationId.length > 8;

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      const working: MessageParam[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let fullText = "";
      const capturedLeads: Partial<LeadData>[] = [];

      try {
        for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
          const anthropicStream = await client.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: systemPrompt,
            ...(hasConvId ? { tools: [CAPTURE_LEAD_TOOL] } : {}),
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

          if (final.stop_reason === "tool_use" && hasConvId) {
            const toolUses = extractToolUseBlocks(final.content);
            working.push({ role: "assistant", content: final.content });

            const toolResults = toolUses.map((tu) => {
              if (tu.name !== "capture_lead") {
                return {
                  type: "tool_result" as const,
                  tool_use_id: tu.id,
                  content: JSON.stringify({ ok: false, error: `Onbekende tool: ${tu.name}` }),
                  is_error: true,
                };
              }
              const patch = sanitizeLeadData(tu.input);
              if (patch) {
                capturedLeads.push(patch);
                // Log lead voor Karl — in productie: stuur naar CRM/e-mail
                console.info(
                  `[aicollega/${branche}/chat] Lead captured for tenant=${tenantId}:`,
                  JSON.stringify(patch)
                );
              }
              return {
                type: "tool_result" as const,
                tool_use_id: tu.id,
                content: JSON.stringify({ ok: true, captured: patch ?? {} }),
              };
            });

            working.push({ role: "user", content: toolResults });
            continue;
          }

          break;
        }

        send("done", { full: fullText, leads: capturedLeads });
      } catch (err) {
        console.error(`[aicollega/${branche}/chat] stream error:`, err);
        send("error", { error: "Er ging iets mis. Probeer het opnieuw." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}
