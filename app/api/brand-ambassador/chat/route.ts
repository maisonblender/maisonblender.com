/**
 * POST /api/brand-ambassador/chat
 *
 * Streaming chat endpoint voor de MAISON BLNDR Brand Ambassador.
 * Gebruikt Anthropic Messages API met stream=true en proxy't de stream
 * via Server-Sent Events (SSE) naar de client.
 *
 * Out-of-scope bescherming zit in de system prompt (zie
 * `lib/brand-ambassador/system-prompt.ts`). Rate limiting + body size limit
 * beschermen onze token-budget tegen scripted abuse.
 */

import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { buildSystemPrompt } from "@/lib/brand-ambassador/system-prompt";
import { filterUserMessage } from "@/lib/brand-ambassador/filter";
import type { ChatRequest, ChatMessage } from "@/lib/brand-ambassador/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 2000;
const MAX_TOTAL_CHARS = 40_000;

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}

/**
 * Lever een vast antwoord via SSE zonder Anthropic aan te roepen.
 * Gebruikt voor prompt-injection en off-topic hits — zelfde stream-shape
 * als een normale response, dus de UI merkt er niks van.
 */
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

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  // 30 messages per 5 minuten per IP. Ruim voor een echt gesprek, te krap
  // voor een scraper die onze tokens leeg wil trekken.
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
  // Blokkeert prompt-injection en off-topic requests voor we tokens uitgeven.
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

      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            send("delta", { text: event.delta.text });
          }
        }

        const final = await anthropicStream.finalMessage();
        const full = final.content
          .filter((b) => b.type === "text")
          .map((b) => (b as { type: "text"; text: string }).text)
          .join("");

        send("done", { full });
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
