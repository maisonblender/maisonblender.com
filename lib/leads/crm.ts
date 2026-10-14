/**
 * Twenty CRM integratie voor website-aanvragen (Strategiegesprek-wizard en
 * contactformulier).
 *
 * Zelfde patroon als lib/quickscan/crm.ts en lib/a11y/crm.ts:
 *   - company hergebruiken op email-domain (geen free-mail providers), anders
 *     aanmaken op bedrijfsnaam
 *   - person aanmaken / hergebruiken op email
 *   - note met de aanvraag aanmaken en koppelen aan person + company
 *
 * In tegenstelling tot de andere modules geeft deze een status terug: de
 * API-route moet weten of de lead ergens is opgeslagen, zodat de bezoeker
 * nooit "verzonden" ziet terwijl de aanvraag nergens terechtkwam.
 */

import { loadTwentyConfig } from "@/lib/security/twenty-config";

const isDev = process.env.NODE_ENV !== "production";
function devLog(...args: unknown[]) {
  if (isDev) console.log(...args);
}

export type LeadBron = "Strategiegesprek" | "Contactformulier";

export interface WebsiteLead {
  bron: LeadBron;
  naam: string;
  email: string;
  bedrijf?: string;
  noteTitel: string;
  noteMarkdown: string;
}

export type LeadPushStatus = "ok" | "missing-env" | "failed";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "outlook.com", "outlook.nl", "hotmail.com", "hotmail.nl", "live.com", "live.nl", "msn.com",
  "yahoo.com", "yahoo.nl", "ymail.com",
  "icloud.com", "me.com", "mac.com",
  "ziggo.nl", "kpnmail.nl", "planet.nl", "xs4all.nl", "telfort.nl", "home.nl", "online.nl",
  "proton.me", "protonmail.com", "tutanota.com",
  "aol.com", "gmx.com", "gmx.nl", "mail.com",
]);

class TwentyDuplicateError extends Error {}

async function twentyREST(
  baseUrl: string,
  apiKey: string,
  path: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${baseUrl}/rest/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    if (res.status === 409 || (res.status === 400 && /duplicate/i.test(text))) {
      throw new TwentyDuplicateError(`duplicate op /${path}: ${text}`);
    }
    throw new Error(`Twenty REST ${res.status} op /${path}: ${text}`);
  }
  return JSON.parse(text);
}

async function twentyGET(
  baseUrl: string,
  apiKey: string,
  path: string,
  query: string
): Promise<unknown> {
  const res = await fetch(`${baseUrl}/rest/${path}?${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`Twenty REST GET ${res.status} op /${path}: ${text}`);
  }
  return JSON.parse(text);
}

function extractItems(response: unknown): Record<string, unknown>[] {
  if (!response || typeof response !== "object") return [];
  const data = (response as Record<string, unknown>).data;
  if (!data || typeof data !== "object") return [];
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      return value.filter((v): v is Record<string, unknown> => !!v && typeof v === "object");
    }
  }
  return [];
}

function extractId(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown>;
  if (typeof r.id === "string") return r.id;
  const data = r.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.id === "string") return d.id;
    for (const value of Object.values(d)) {
      if (value && typeof value === "object" && typeof (value as Record<string, unknown>).id === "string") {
        return (value as Record<string, string>).id;
      }
    }
  }
  return null;
}

function splitNaam(naam: string): { firstName: string; lastName: string } {
  const parts = naam.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function zoekPersonOpEmail(baseUrl: string, apiKey: string, email: string): Promise<string | null> {
  // Twenty negeert de filter[a][b][op]=value syntax; alleen field.sub[op]:value werkt.
  const queries = [
    `filter=emails.primaryEmail[eq]:${encodeURIComponent(email)}`,
    "limit=60",
  ];
  for (const query of queries) {
    try {
      const items = extractItems(await twentyGET(baseUrl, apiKey, "people", query));
      const match = items.find((it) => {
        const emails = it.emails as Record<string, unknown> | undefined;
        return emails?.primaryEmail === email && !it.deletedAt && typeof it.id === "string";
      });
      if (match) return match.id as string;
    } catch (err) {
      console.warn(`[CRM/leads] Person lookup (${query.slice(0, 20)}…) faalde:`, err);
    }
  }
  return null;
}

async function vindOfMaakCompany(
  baseUrl: string,
  apiKey: string,
  lead: WebsiteLead,
  createdBy: Record<string, unknown>
): Promise<string | null> {
  const rawDomain = lead.email.split("@")[1]?.toLowerCase() ?? "";
  const emailDomain = rawDomain && !FREE_EMAIL_DOMAINS.has(rawDomain) ? rawDomain : "";

  if (emailDomain) {
    try {
      const items = extractItems(
        await twentyGET(
          baseUrl,
          apiKey,
          "companies",
          `filter=domainName.primaryLinkUrl[eq]:${encodeURIComponent(emailDomain)}`
        )
      );
      const match = items.find((it) => {
        const dom = it.domainName as Record<string, unknown> | undefined;
        return dom?.primaryLinkUrl === emailDomain && !it.deletedAt && typeof it.id === "string";
      });
      if (match) return match.id as string;
    } catch (err) {
      console.warn(`[CRM/leads] Company domain-lookup faalde voor ${emailDomain}:`, err);
    }
  }

  if (!lead.bedrijf) return null;

  const companyBody: Record<string, unknown> = { name: lead.bedrijf, createdBy };
  if (emailDomain) companyBody.domainName = { primaryLinkUrl: emailDomain };
  try {
    return extractId(await twentyREST(baseUrl, apiKey, "companies", companyBody));
  } catch (err) {
    if (!(err instanceof TwentyDuplicateError)) {
      console.warn("[CRM/leads] Company aanmaken mislukt:", err);
      return null;
    }
    try {
      const items = extractItems(
        await twentyGET(baseUrl, apiKey, "companies", `filter=name[eq]:${encodeURIComponent(lead.bedrijf)}`)
      );
      return typeof items[0]?.id === "string" ? items[0].id : null;
    } catch (lookupErr) {
      console.warn("[CRM/leads] Company duplicate + lookup mislukt:", lookupErr);
      return null;
    }
  }
}

/**
 * Zet een website-aanvraag als lead in Twenty. `ok` betekent dat in elk geval
 * person + note zijn aangemaakt; een mislukte note-koppeling aan de company
 * telt niet als fout.
 */
export async function pushWebsiteLead(lead: WebsiteLead): Promise<LeadPushStatus> {
  const cfg = loadTwentyConfig();
  if (!cfg.ok) {
    if (cfg.reason === "missing-env") {
      devLog(`[CRM/leads] Twenty niet geconfigureerd — ${lead.bron}-lead niet in CRM gezet`);
      return "missing-env";
    }
    console.error(`[CRM/leads] Twenty config invalid (${cfg.reason}): ${cfg.message}`);
    return "failed";
  }
  const { baseUrl, apiKey } = cfg.config;
  const createdBy = { source: "API", name: `${lead.bron} maisonblender.com` };

  try {
    const companyId = await vindOfMaakCompany(baseUrl, apiKey, lead, createdBy);

    const personBody: Record<string, unknown> = {
      name: splitNaam(lead.naam),
      emails: { primaryEmail: lead.email },
      createdBy,
    };
    if (companyId) personBody.companyId = companyId;

    let personId: string | null = null;
    try {
      personId = extractId(await twentyREST(baseUrl, apiKey, "people", personBody));
    } catch (err) {
      if (!(err instanceof TwentyDuplicateError)) throw err;
      personId = await zoekPersonOpEmail(baseUrl, apiKey, lead.email);
    }
    if (!personId) {
      console.warn(`[CRM/leads] Geen personId voor ${lead.email} (${lead.bron})`);
      return "failed";
    }

    const noteId = extractId(
      await twentyREST(baseUrl, apiKey, "notes", {
        title: lead.noteTitel,
        bodyV2: { markdown: lead.noteMarkdown },
        createdBy,
      })
    );
    if (!noteId) {
      console.warn(`[CRM/leads] Note zonder id voor ${lead.email} (${lead.bron})`);
      return "failed";
    }

    await twentyREST(baseUrl, apiKey, "noteTargets", { noteId, targetPersonId: personId });
    if (companyId) {
      try {
        await twentyREST(baseUrl, apiKey, "noteTargets", { noteId, targetCompanyId: companyId });
      } catch (err) {
        console.warn(`[CRM/leads] Note→company koppeling mislukt (${lead.bron}):`, err);
      }
    }

    console.log(
      `[CRM/leads] ✓ ${lead.bron}-lead verwerkt: person=${personId} company=${companyId ?? "—"} note=${noteId}`
    );
    return "ok";
  } catch (err) {
    console.error(`[CRM/leads] Twenty push mislukt (${lead.bron}):`, err);
    return "failed";
  }
}
