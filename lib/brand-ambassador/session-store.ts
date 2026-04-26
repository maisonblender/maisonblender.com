/**
 * In-memory session store voor Brand Ambassador leadprofielen.
 *
 * Elke conversatie heeft een client-generated `conversationId` (UUID). Voor
 * elke id bouwen we gaandeweg een LeadProfile op terwijl Claude de
 * `capture_lead` tool aanroept tijdens het gesprek.
 *
 * Tradeoffs:
 *  - Process-local Map: state overleeft tussen requests op dezelfde Vercel
 *    serverless instance, maar NIET over cold-starts of tussen instances.
 *    Acceptabel voor typische gespreksduur (<30 min). Bij cold-start beginnen
 *    we opnieuw met een leeg profiel — de AI krijgt dit mee in de tool-result
 *    en kan haar vragen aanpassen.
 *  - Om ver te gaan naar Redis/Vercel KV: vervang alleen deze module.
 *  - Globalthis-patroon voor HMR-stability in dev.
 *
 * TTL: 2 uur. Na elke write is de entry weer 2 uur geldig. Een janitor
 * verwijdert verlopen entries elke 5 min.
 */

import type { AmbassadorLead } from "./types";

export interface LeadSession {
  profile: AmbassadorLead;
  /** True zodra we de Karl-notificatie + CRM push hebben gedaan. */
  notified: boolean;
  /** Unix-ms timestamp van laatste wijziging. */
  updatedAt: number;
  /** Unix-ms timestamp van creatie. */
  createdAt: number;
}

const TTL_MS = 2 * 60 * 60 * 1000;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

interface StoreGlobal {
  __baLeadStore?: Map<string, LeadSession>;
  __baLeadStoreSweep?: ReturnType<typeof setInterval>;
}

const g = globalThis as unknown as StoreGlobal;
const store = (g.__baLeadStore ??= new Map<string, LeadSession>());

// Janitor maar één keer starten per process, ook over HMR heen.
if (!g.__baLeadStoreSweep) {
  g.__baLeadStoreSweep = setInterval(() => {
    const cutoff = Date.now() - TTL_MS;
    for (const [k, v] of store.entries()) {
      if (v.updatedAt < cutoff) store.delete(k);
    }
  }, SWEEP_INTERVAL_MS);
  // Niet het event-loop vasthouden in dev-restart / shutdown.
  if (typeof g.__baLeadStoreSweep.unref === "function") {
    g.__baLeadStoreSweep.unref();
  }
}

/**
 * Basic validatie: conversationId moet 12-64 chars zijn en alleen
 * url-veilige karakters. Voorkomt prototype-pollution via weird keys
 * en memory-abuse via oneindig lange sleutels.
 */
export function isValidConversationId(raw: unknown): raw is string {
  return (
    typeof raw === "string" &&
    raw.length >= 12 &&
    raw.length <= 64 &&
    /^[A-Za-z0-9_-]+$/.test(raw)
  );
}

/** Haal de huidige sessie op (of `undefined` als onbekend). */
export function getSession(id: string): LeadSession | undefined {
  return store.get(id);
}

/**
 * Merge een patch in het leadprofiel. Ondefined-velden worden genegeerd zodat
 * de AI niet per ongeluk eerder verzamelde data wipet met een partial update.
 * Lege strings worden ook als "niet-verstrekt" behandeld.
 */
export function upsertSession(
  id: string,
  patch: Partial<AmbassadorLead>
): LeadSession {
  const now = Date.now();
  const existing = store.get(id);

  const merged: AmbassadorLead = { ...(existing?.profile ?? {}) };
  for (const [k, v] of Object.entries(patch) as [
    keyof AmbassadorLead,
    AmbassadorLead[keyof AmbassadorLead]
  ][]) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (!trimmed) continue;
      (merged[k] as string) = trimmed.slice(0, 500);
    } else {
      (merged[k] as boolean) = v as boolean;
    }
  }

  const session: LeadSession = {
    profile: merged,
    notified: existing?.notified ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  store.set(id, session);
  return session;
}

/** Markeer sessie als "al genotificeerd" zodat we niet dubbel mailen. */
export function markNotified(id: string): void {
  const s = store.get(id);
  if (s) {
    s.notified = true;
    s.updatedAt = Date.now();
  }
}

/**
 * Bepaalt of we op basis van het huidige profiel Karl moeten notificeren.
 *
 * Drempel: minimaal één contactkanaal (email of telefoon) + expliciete
 * toestemming. Naam is nice-to-have maar niet verplicht — een anonymous
 * lead die zegt "bel me op dit nummer" heeft nog steeds waarde.
 */
export function shouldNotify(session: LeadSession): boolean {
  if (session.notified) return false;
  const p = session.profile;
  if (!p.toestemming_contact) return false;
  const hasEmail = !!p.email && p.email.includes("@");
  const hasPhone = !!p.telefoon && p.telefoon.replace(/\D/g, "").length >= 8;
  return hasEmail || hasPhone;
}

// Dev-only helper — handig in tests of debug-endpoints.
export function _debugClear(): void {
  store.clear();
}
