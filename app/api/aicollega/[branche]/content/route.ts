/**
 * POST /api/aicollega/[branche]/content
 *
 * Genereert content-varianten voor een tenant.
 * Huidig: woningomschrijving (3 varianten: Funda, Instagram, E-mail).
 * Uitbreidbaar naar: social posts, opvolgmails, etc.
 *
 * Request: { tenantId, type, input }
 * Response: { variants: { label, tekst }[] }
 */

import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { getTenant } from "@/lib/aicollega/tenant-store";
import type { ContentRequest } from "@/lib/aicollega/types";
import {
  buildWoningomschrijvingPrompt,
  parseWoningomschrijvingOutput,
  buildOpvolgmailPrompt,
  buildFeedbackRequestPrompt,
} from "@/lib/aicollega/makelaar/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ branche: string }> }
) {
  const { branche } = await params;

  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rate = checkRateLimit(`aicollega-content:${ip}`, 20, 10 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Limiet bereikt. Probeer over ${rate.retryAfterSeconds}s opnieuw.` },
      { status: 429 }
    );
  }

  const parsed = await readJsonBody<ContentRequest>(request, 32 * 1024);
  if (!parsed.ok) return parsed.response;

  const { tenantId, type, input } = parsed.data;

  if (!tenantId || typeof tenantId !== "string") {
    return Response.json({ error: "tenantId verplicht." }, { status: 400 });
  }

  const tenant = getTenant(tenantId);
  if (!tenant) {
    return Response.json({ error: "Tenant niet gevonden." }, { status: 404 });
  }

  if (tenant.branche !== branche) {
    return Response.json({ error: "Branche mismatch." }, { status: 400 });
  }

  if (!type || !input) {
    return Response.json({ error: "type en input zijn verplicht." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Service tijdelijk niet beschikbaar." }, { status: 503 });
  }

  let prompt: string;
  switch (type) {
    case "woningomschrijving":
      prompt = buildWoningomschrijvingPrompt(input);
      break;
    case "opvolgmail":
      prompt = buildOpvolgmailPrompt(input);
      break;
    case "feedback_request":
      prompt = buildFeedbackRequestPrompt(input);
      break;
    default:
      return Response.json({ error: `Content type '${type}' niet ondersteund.` }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    let variants: { label: string; tekst: string }[];
    switch (type) {
      case "woningomschrijving":
        variants = parseWoningomschrijvingOutput(rawText);
        break;
      case "opvolgmail":
        variants = [{ label: "Opvolgmail", tekst: rawText }];
        break;
      case "feedback_request":
        variants = [{ label: "Feedback-verzoek", tekst: rawText }];
        break;
      default:
        variants = [{ label: "Resultaat", tekst: rawText }];
    }

    return Response.json({ variants });
  } catch (err) {
    console.error(`[aicollega/${branche}/content] error:`, err);
    return Response.json({ error: "Generatie mislukt. Probeer opnieuw." }, { status: 500 });
  }
}
