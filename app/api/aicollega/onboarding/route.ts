/**
 * POST /api/aicollega/onboarding
 *
 * Verwerkt een nieuw onboarding-verzoek en maakt een tenant-configuratie aan.
 *
 * De tenant wordt opgeslagen in de in-memory runtime store (verdwijnt bij
 * serverherstart). Karl ontvangt per e-mail de configuratie als JSON om
 * handmatig toe te voegen aan lib/aicollega/tenant-store.ts → STATIC_TENANTS.
 *
 * Response: { tenantId, accessToken, dashboardUrl, config }
 */

import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";
import { readJsonBody } from "@/lib/security/json";
import { saveTenant, generateId } from "@/lib/aicollega/tenant-store";
import type { AICollegaTenant, OnboardingData } from "@/lib/aicollega/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeOnboarding(raw: unknown): OnboardingData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const naam = typeof r.naam === "string" ? r.naam.trim().slice(0, 200) : "";
  const stad = typeof r.stad === "string" ? r.stad.trim().slice(0, 100) : "";
  const contactEmail = typeof r.contactEmail === "string" ? r.contactEmail.trim().slice(0, 200) : "";

  if (!naam || !contactEmail) return null;

  return {
    naam,
    personaNaam: typeof r.personaNaam === "string" ? r.personaNaam.trim().slice(0, 60) : undefined,
    stad,
    contactEmail,
    contactTelefoon: typeof r.contactTelefoon === "string" ? r.contactTelefoon.trim().slice(0, 40) : undefined,
    website: typeof r.website === "string" ? r.website.trim().slice(0, 200) : undefined,
    toon: r.toon === "formeel" ? "formeel" : "informeel",
    objectenRaw: typeof r.objectenRaw === "string" ? r.objectenRaw.trim().slice(0, 5000) : undefined,
    faqRaw: typeof r.faqRaw === "string" ? r.faqRaw.trim().slice(0, 5000) : undefined,
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`aicollega-onboarding:${ip}`, 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      { error: "Te veel onboarding-pogingen. Probeer later opnieuw." },
      { status: 429 }
    );
  }

  const parsed = await readJsonBody<OnboardingData>(request, 32 * 1024);
  if (!parsed.ok) return parsed.response;

  const data = sanitizeOnboarding(parsed.data);
  if (!data) {
    return Response.json(
      { error: "Naam en e-mailadres zijn verplicht." },
      { status: 400 }
    );
  }

  const tenantId = generateId();
  const accessToken = generateId();

  const tenant: AICollegaTenant = {
    id: tenantId,
    branche: "makelaar",
    naam: data.naam,
    personaNaam: data.personaNaam || undefined,
    stad: data.stad || undefined,
    contactEmail: data.contactEmail,
    contactTelefoon: data.contactTelefoon,
    website: data.website,
    toon: data.toon,
    createdAt: new Date().toISOString(),
    accessToken,
    objecten: [],
    faq: [],
  };

  saveTenant(tenant);

  console.info(
    "[aicollega/onboarding] Nieuwe tenant aangemaakt:",
    JSON.stringify({
      id: tenantId,
      naam: data.naam,
      stad: data.stad,
      contactEmail: data.contactEmail,
    })
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://maisonblender.com";
  const dashboardUrl = `${baseUrl}/aicollega/makelaar/dashboard/${tenantId}?token=${accessToken}`;

  return Response.json({
    tenantId,
    accessToken,
    dashboardUrl,
    config: tenant,
  });
}
