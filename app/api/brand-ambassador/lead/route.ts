/**
 * POST /api/brand-ambassador/lead
 *
 * Eindpunt voor de expliciete briefing-submit vanuit het Ambassador-
 * formulier. Client stuurt het ingevulde leadprofiel + transcript.
 *
 * Dit endpoint:
 *  1. Valideert input (email verplicht, toestemming verplicht)
 *  2. Delegeert aan `notifyLead` — die doet CRM push + email naar Karl
 *
 * Conversationele capture zit in de chat-route zelf (tool-use met de
 * `capture_lead` tool). Zie `app/api/brand-ambassador/chat/route.ts`.
 */

import type { NextRequest } from "next/server";
import { after } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { checkOrigin } from "@/lib/security/origin";
import { readJsonBody } from "@/lib/security/json";
import { notifyLead } from "@/lib/brand-ambassador/notify";
import type {
  LeadRequest,
  ChatMessage,
  AmbassadorLead,
  BrandContext,
} from "@/lib/brand-ambassador/types";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeLead(raw: unknown): AmbassadorLead | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max = 200): string | undefined => {
    if (typeof v !== "string") return undefined;
    const t = v.trim().slice(0, max);
    return t || undefined;
  };
  return {
    naam: str(r.naam, 120),
    email: str(r.email, 200),
    telefoon: str(r.telefoon, 40),
    bedrijf: str(r.bedrijf, 200),
    rol: str(r.rol, 120),
    sector: str(r.sector, 120),
    teamgrootte: str(r.teamgrootte, 60),
    urgentie: str(r.urgentie, 200),
    interesse: str(r.interesse, 500),
  };
}

function sanitizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ChatMessage[] = [];
  for (const e of raw) {
    if (!e || typeof e !== "object") return null;
    const obj = e as Record<string, unknown>;
    if (obj.role !== "user" && obj.role !== "assistant") return null;
    if (typeof obj.content !== "string") return null;
    out.push({ role: obj.role, content: obj.content.slice(0, 4000) });
  }
  return out;
}

function sanitizeBrand(raw: unknown): BrandContext | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.name !== "string" || typeof r.hue !== "number") return null;
  const name = r.name.trim().slice(0, 60);
  if (!name) return null;
  return { name, hue: Math.max(0, Math.min(360, Math.round(r.hue))) };
}

export async function POST(request: NextRequest) {
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rate = checkRateLimit(`ba-lead:${ip}`, 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: `Te veel verzoeken. Probeer opnieuw over ${rate.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const parsed = await readJsonBody<LeadRequest>(request, 128 * 1024);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const lead = sanitizeLead(body.lead);
  const messages = sanitizeMessages(body.messages);
  const brand = sanitizeBrand(body.brand);

  if (!lead || !messages) {
    return Response.json({ error: "Ongeldige invoer." }, { status: 400 });
  }
  if (!lead.email || !EMAIL_REGEX.test(lead.email)) {
    return Response.json({ error: "Geldig e-mailadres verplicht." }, { status: 400 });
  }
  if (body.toestemming !== true) {
    return Response.json({ error: "Toestemming verplicht." }, { status: 400 });
  }

  // Briefing-pad = expliciete toestemming, dus we mogen direct notify'en.
  const withConsent: AmbassadorLead = { ...lead, toestemming_contact: true };

  after(async () => {
    try {
      await notifyLead(withConsent, messages, brand, "briefing");
    } catch (err) {
      console.error("[BA-lead] notifyLead faalde:", err);
    }
  });

  return Response.json({ ok: true });
}
