/**
 * Twenty CRM integratie voor Brand Ambassador leads.
 *
 * Aparte source tag ("Brand Ambassador maisonblender.com") zodat deze leads
 * in de Twenty-UI meteen te onderscheiden zijn van Quickscan / Toegankelijk-
 * heidsaudit-leads. Verder leunt deze module op dezelfde REST-endpoints en
 * dezelfde deduplicatie-logica als `lib/quickscan/crm.ts`.
 *
 * Silent-fail pattern: CRM-pushes falen nooit hard op de API-flow — als
 * Twenty down is moet de user-facing response nog steeds slagen.
 */

import { loadTwentyConfig } from "@/lib/security/twenty-config";
import type { AmbassadorLead, ChatMessage, BrandContext } from "./types";

const isDev = process.env.NODE_ENV !== "production";
const devLog = (...args: unknown[]) => {
  if (isDev) console.log(...args);
};

const CREATED_BY = {
  source: "API" as const,
  name: "Brand Ambassador maisonblender.com",
} as const;

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

function extractFirstItem(response: unknown): Record<string, unknown> | null {
  if (!response || typeof response !== "object") return null;
  const data = (response as Record<string, unknown>).data;
  if (!data || typeof data !== "object") return null;
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (Array.isArray(value) && value.length > 0) {
      const first = value[0];
      if (first && typeof first === "object") return first as Record<string, unknown>;
    }
  }
  return null;
}

function extractFirstId(response: unknown): string | null {
  const item = extractFirstItem(response);
  if (item && typeof item.id === "string") return item.id;
  return null;
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

function splitNaam(naam: string | undefined): { firstName: string; lastName: string } {
  const trimmed = (naam ?? "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function transcriptAlsMarkdown(messages: ChatMessage[]): string {
  return messages
    .map((m) => {
      const speaker = m.role === "user" ? "**Bezoeker**" : "**Ambassador**";
      return `${speaker}:\n${m.content.trim()}`;
    })
    .join("\n\n---\n\n");
}

function bouwLeadNote(
  lead: AmbassadorLead,
  messages: ChatMessage[],
  brand: BrandContext | null | undefined
): string {
  const datum = new Date().toLocaleString("nl-NL", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const regels: string[] = [
    `# Brand Ambassador Lead — ${datum}`,
    "",
    "## Leadprofiel",
    `- **Naam:** ${lead.naam ?? "niet opgegeven"}`,
    `- **Email:** ${lead.email ?? "niet opgegeven"}`,
    `- **Bedrijf:** ${lead.bedrijf ?? "niet opgegeven"}`,
    `- **Sector:** ${lead.sector ?? "niet opgegeven"}`,
    `- **Teamgrootte:** ${lead.teamgrootte ?? "niet opgegeven"}`,
    `- **Urgentie:** ${lead.urgentie ?? "niet opgegeven"}`,
    `- **Interesse (samenvatting):** ${lead.interesse ?? "niet opgegeven"}`,
  ];

  if (brand) {
    regels.push("");
    regels.push(`*Imagine-This-Is-Yours was actief voor "${brand.name}".*`);
  }

  regels.push("");
  regels.push("## Volledig gesprek");
  regels.push("");
  regels.push(transcriptAlsMarkdown(messages));

  return regels.join("\n");
}

async function koppelNoteTarget(
  baseUrl: string,
  apiKey: string,
  noteId: string,
  relType: "person" | "company",
  relId: string,
  context: string
): Promise<void> {
  const targetField = relType === "person" ? "targetPersonId" : "targetCompanyId";
  try {
    await twentyREST(baseUrl, apiKey, "noteTargets", { noteId, [targetField]: relId });
  } catch (err) {
    console.warn(`[BA-CRM] Note→${relType} koppeling mislukt (${context}):`, err);
  }
}

async function maakNoteEnKoppel(
  baseUrl: string,
  apiKey: string,
  title: string,
  markdownBody: string,
  personId: string,
  companyId: string | null
): Promise<void> {
  let noteId: string | null = null;
  try {
    const noteRes = await twentyREST(baseUrl, apiKey, "notes", {
      title,
      bodyV2: { markdown: markdownBody },
      createdBy: CREATED_BY,
    });
    noteId = extractId(noteRes);
  } catch (err) {
    console.warn(`[BA-CRM] Note aanmaken mislukt (${title}):`, err);
    return;
  }
  if (!noteId) return;

  await koppelNoteTarget(baseUrl, apiKey, noteId, "person", personId, title);
  if (companyId) {
    await koppelNoteTarget(baseUrl, apiKey, noteId, "company", companyId, title);
  }
  devLog(`[BA-CRM] ✓ Note "${title}" gekoppeld (note=${noteId}, person=${personId}, company=${companyId ?? "geen"})`);
}

/**
 * Push een Brand Ambassador lead naar Twenty. Maakt (indien nieuw) company +
 * person + note aan, alles getagd met source "Brand Ambassador
 * maisonblender.com" zodat ze in de CRM-UI te onderscheiden zijn.
 */
export async function pushAmbassadorLead(
  lead: AmbassadorLead,
  messages: ChatMessage[],
  brand: BrandContext | null | undefined
): Promise<void> {
  const cfg = loadTwentyConfig();
  if (!cfg.ok) {
    if (cfg.reason === "missing-env") {
      devLog("[BA-CRM] Twenty niet geconfigureerd — lead lokaal gelogd");
      return;
    }
    console.error(`[BA-CRM] FATAL: Twenty config invalid (${cfg.reason}): ${cfg.message}`);
    return;
  }
  const { baseUrl, apiKey } = cfg.config;

  if (!lead.email) {
    devLog("[BA-CRM] Lead zonder email — alleen note aanmaken niet mogelijk; overgeslagen");
    return;
  }

  const rawDomain = lead.email.split("@")[1]?.toLowerCase() ?? "";
  const isBusinessDomain = rawDomain !== "" && !FREE_EMAIL_DOMAINS.has(rawDomain);
  const emailDomain = isBusinessDomain ? rawDomain : "";

  try {
    let companyId: string | null = null;
    const bedrijfNaam = lead.bedrijf || (emailDomain ? emailDomain : "Onbekend bedrijf");

    if (emailDomain) {
      try {
        const existing = await twentyGET(
          baseUrl,
          apiKey,
          "companies",
          `filter=domainName.primaryLinkUrl[eq]:${encodeURIComponent(emailDomain)}`
        );
        const item = extractFirstItem(existing);
        if (item) {
          const dom = item.domainName as Record<string, unknown> | undefined;
          if (dom?.primaryLinkUrl === emailDomain && !item.deletedAt && typeof item.id === "string") {
            companyId = item.id;
          }
        }
      } catch {
        // niet fataal
      }
    }

    if (!companyId) {
      const companyBody: Record<string, unknown> = {
        name: bedrijfNaam,
        createdBy: CREATED_BY,
      };
      if (emailDomain) companyBody.domainName = { primaryLinkUrl: emailDomain };
      try {
        const res = await twentyREST(baseUrl, apiKey, "companies", companyBody);
        companyId = extractId(res);
      } catch (err) {
        if (err instanceof TwentyDuplicateError) {
          try {
            const existing = await twentyGET(
              baseUrl,
              apiKey,
              "companies",
              `filter=name[eq]:${encodeURIComponent(bedrijfNaam)}`
            );
            companyId = extractFirstId(existing);
          } catch {
            // geef op
          }
        } else {
          console.warn("[BA-CRM] Company aanmaken mislukt:", err);
        }
      }
    }

    const { firstName, lastName } = splitNaam(lead.naam);
    const personBody: Record<string, unknown> = {
      name: { firstName: firstName || lead.email.split("@")[0], lastName },
      emails: { primaryEmail: lead.email },
      createdBy: CREATED_BY,
    };
    if (companyId) personBody.companyId = companyId;

    let personId: string | null = null;
    try {
      const res = await twentyREST(baseUrl, apiKey, "people", personBody);
      personId = extractId(res);
    } catch (err) {
      if (err instanceof TwentyDuplicateError) {
        try {
          const existing = await twentyGET(
            baseUrl,
            apiKey,
            "people",
            `filter=emails.primaryEmail[eq]:${encodeURIComponent(lead.email)}`
          );
          personId = extractFirstId(existing);
        } catch {
          // geef op
        }
      } else {
        console.warn("[BA-CRM] Person aanmaken mislukt:", err);
      }
    }

    if (!personId) {
      console.warn(`[BA-CRM] Person voor ${lead.email} niet aangemaakt/gevonden — note overgeslagen`);
      return;
    }

    const datum = new Date().toLocaleString("nl-NL", { dateStyle: "short" });
    await maakNoteEnKoppel(
      baseUrl,
      apiKey,
      `Brand Ambassador gesprek — ${bedrijfNaam} — ${datum}`,
      bouwLeadNote(lead, messages, brand),
      personId,
      companyId
    );

    devLog(`[BA-CRM] Lead verwerkt: ${lead.email} (person=${personId}, company=${companyId ?? "geen"})`);
  } catch (err) {
    console.error("[BA-CRM] Twenty push mislukt:", err);
  }
}
