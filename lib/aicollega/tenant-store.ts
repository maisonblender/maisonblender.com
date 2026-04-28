/**
 * Tenant store voor het AI Collega platform.
 *
 * MVP-aanpak: gecombineerde opslag van:
 *  1. Statische tenants (STATIC_TENANTS array — Karl voegt hier handmatig
 *     onboarded klanten toe na het onboarding-proces).
 *  2. Runtime-tenants (RUNTIME_MAP — in-memory, verdwijnt bij serverherstart,
 *     gebruikt voor de demo en voor tenants die via de onboarding API worden
 *     aangemaakt in de huidige serverinstantie).
 *
 * Voor productie (10+ klanten): vervang door Vercel KV of Supabase.
 *
 * Conventie: tenantId = UUID v4. accessToken = UUID v4.
 */

import type { AICollegaTenant } from "./types";

/**
 * Voeg hier handmatig onboarded klanten toe.
 * Formaat: zie AICollegaTenant in types.ts.
 */
const STATIC_TENANTS: AICollegaTenant[] = [
  {
    id: "demo-makelaar-01",
    branche: "makelaar",
    naam: "Makelaardij Van den Berg",
    stad: "Sittard",
    contactEmail: "info@vandenberg-makelaardij.nl",
    contactTelefoon: "046 123 4567",
    website: "https://vandenberg-makelaardij.nl",
    toon: "informeel",
    isDemo: true,
    createdAt: "2026-04-28T00:00:00Z",
    accessToken: "demo-access-token-vdb",
    objecten: [
      {
        adres: "Wilhelminastraat 14, Sittard",
        type: "Vrijstaande woning",
        prijs: 425000,
        kamers: 5,
        oppervlak: 148,
        kenmerken: ["tuin", "garage", "zonnepanelen", "vloerverwarming"],
        beschikbaar: true,
      },
      {
        adres: "Mgr. Buckxstraat 8, Geleen",
        type: "Appartement",
        prijs: 195000,
        kamers: 3,
        oppervlak: 82,
        kenmerken: ["balkon", "lift", "parkeerplaats"],
        beschikbaar: true,
      },
      {
        adres: "Parallelweg 33, Beek",
        type: "Rijtjeshuis",
        prijs: 310000,
        kamers: 4,
        oppervlak: 115,
        kenmerken: ["tuin", "berging", "energielabel A"],
        beschikbaar: false,
      },
    ],
    faq: [
      {
        vraag: "Hoe werkt het aanmeldproces voor een bezichtiging?",
        antwoord:
          "Je kunt via onze website of telefonisch een bezichtiging aanvragen. We plannen dit dan in, doorgaans binnen een week.",
      },
      {
        vraag: "Wat zijn de courtagekosten?",
        antwoord:
          "Onze courtage bedraagt 1,5% van de verkoopprijs, inclusief BTW. Dit is all-in: taxatie, presentatie, onderhandeling en overdracht.",
      },
      {
        vraag: "Hoe lang duurt een gemiddeld verkoopproces?",
        antwoord:
          "In de huidige markt gemiddeld 4-8 weken van aanmelding tot getekend koopcontract. De overdracht bij de notaris volgt daarna.",
      },
    ],
  },
];

/** Runtime-map voor tenants aangemaakt via de onboarding API. */
const RUNTIME_MAP = new Map<string, AICollegaTenant>();

/** Zoek een tenant op ID — eerst static, dan runtime. */
export function getTenant(id: string): AICollegaTenant | null {
  const staticTenant = STATIC_TENANTS.find((t) => t.id === id);
  if (staticTenant) return staticTenant;
  return RUNTIME_MAP.get(id) ?? null;
}

/** Sla een nieuwe runtime-tenant op (vanuit onboarding API). */
export function saveTenant(tenant: AICollegaTenant): void {
  RUNTIME_MAP.set(tenant.id, tenant);
}

/** Geef alle tenants terug (admin-only gebruik). */
export function getAllTenants(): AICollegaTenant[] {
  return [...STATIC_TENANTS, ...Array.from(RUNTIME_MAP.values())];
}

/** Valideer een accessToken voor een tenant. */
export function validateAccess(tenantId: string, token: string): boolean {
  const tenant = getTenant(tenantId);
  if (!tenant) return false;
  return tenant.accessToken === token;
}

/** Genereer een simpele UUID-achtige ID. */
export function generateId(): string {
  return crypto.randomUUID();
}
