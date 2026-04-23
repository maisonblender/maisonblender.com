/**
 * Twenty CRM integratie voor de toegankelijkheidsaudit.
 *
 * Patroon identiek aan lib/quickscan/crm.ts:
 *   - company hergebruiken op email-domain (geen free-mail providers)
 *   - person aanmaken / hergebruiken op email
 *   - note aanmaken met markdown samenvatting + koppelen aan person + company
 *
 * Setup:
 *   TWENTY_API_KEY     Twenty REST API key (JWT format eyJ…)
 *   TWENTY_BASE_URL    https://crm.maisonblender.com (zonder trailing slash)
 */

import type { AuditLead, AuditReport, Impact } from "./types";
import { loadTwentyConfig } from "@/lib/security/twenty-config";

const isDev = process.env.NODE_ENV !== "production";
function devLog(...args: unknown[]) {
  if (isDev) console.log(...args);
}

/**
 * Bron-attributie voor Twenty's `createdBy`-veld. Door dit expliciet mee te sturen
 * krijgt elke company/person/note in Twenty bovenaan "Created by: Toegankelijkheidsaudit
 * maisonblender.com" i.p.v. de algemene API-key-naam (die bv. "Quickscan
 * maisonblender.com" zou laten zien als beide integraties dezelfde key delen).
 *
 * Twenty accepteert dit op alle standaard objecten als onderdeel van de
 * composite "actor"-field (source/name/context).
 */
const CREATED_BY = {
  source: "API" as const,
  name: "Toegankelijkheidsaudit maisonblender.com",
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

const IMPACT_LABEL: Record<Impact, string> = {
  critical: "Kritiek",
  serious: "Hoog",
  moderate: "Middel",
  minor: "Laag",
};

const CONFORMANCE_LABEL: Record<AuditReport["conformance"], string> = {
  "non-conformant": "Niet-conformant",
  partial: "Gedeeltelijk conform",
  substantial: "Grotendeels conform",
  conformant: "Conform (indicatief)",
};

class TwentyDuplicateError extends Error {}

function normaliseerTelefoon(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return "+" + cleaned.slice(2);
  if (cleaned.startsWith("0")) return "+31" + cleaned.slice(1);
  return "+31" + cleaned;
}

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
  const r = response as Record<string, unknown>;
  const data = r.data;
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
  return item && typeof item.id === "string" ? item.id : null;
}

function extractId(response: unknown, path: string): string | null {
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
  console.warn(`[CRM/a11y] Onverwachte response shape voor ${path}:`, JSON.stringify(response).slice(0, 300));
  return null;
}

async function zoekPersonOpEmail(
  baseUrl: string,
  apiKey: string,
  email: string
): Promise<string | null> {
  const filterQuery = `filter=emails.primaryEmail[eq]:${encodeURIComponent(email)}`;
  try {
    const res = await twentyGET(baseUrl, apiKey, "people", filterQuery);
    const item = extractFirstItem(res);
    if (item) {
      const emails = item.emails as Record<string, unknown> | undefined;
      if (emails?.primaryEmail === email && !item.deletedAt && typeof item.id === "string") {
        return item.id;
      }
    }
  } catch (err) {
    console.warn(`[CRM/a11y] Filter-lookup faalde voor ${email}:`, err);
  }
  // Fallback: pagineer
  try {
    const res = await twentyGET(baseUrl, apiKey, "people", "limit=60");
    if (res && typeof res === "object") {
      const data = (res as Record<string, unknown>).data;
      if (data && typeof data === "object") {
        for (const value of Object.values(data as Record<string, unknown>)) {
          if (Array.isArray(value)) {
            for (const item of value) {
              if (!item || typeof item !== "object") continue;
              const it = item as Record<string, unknown>;
              const emails = it.emails as Record<string, unknown> | undefined;
              if (emails?.primaryEmail === email && !it.deletedAt && typeof it.id === "string") {
                return it.id;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[CRM/a11y] Fallback person scan mislukt:`, err);
  }
  return null;
}

function buildAuditNoteMarkdown(lead: AuditLead, report: AuditReport): string {
  const datum = new Date(report.fetchedAt).toLocaleString("nl-NL", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const failing = report.findings.filter((f) => f.result.status === "fail");

  const categoryLines = report.categoryScores
    .map((c) => {
      const applicable = c.passed + c.failed;
      return `- **${c.label}** — ${c.score}/100 (${c.failed} fail / ${applicable} regels van toepassing)`;
    })
    .join("\n");

  const findingsBlock = failing.length === 0
    ? "_Geen automatisch detecteerbare WCAG 2.1 AA-issues gevonden._"
    : failing
        .slice(0, 20)
        .map((f, i) => {
          const sample = f.result.examples?.[0]
            ? `\n  > \`${f.result.examples[0].slice(0, 200).replace(/`/g, "ʹ")}\``
            : "";
          return [
            `**${i + 1}. [${f.priority} · ${IMPACT_LABEL[f.result.impact]}] ${f.rule.title}**`,
            `WCAG ${f.rule.wcag.sc} ${f.rule.wcag.name} (${f.rule.wcag.level}) · EN 301 549 §${f.rule.en301549} · ${f.result.count}× gevonden`,
            `Fix: ${f.result.fixHint || f.rule.fix}${sample}`,
          ].join("\n  ");
        })
        .join("\n\n");

  const totalIssues = Object.values(report.stats.issuesByImpact).reduce((a, b) => a + b, 0);

  return `# Toegankelijkheidsaudit — ${datum}

## Resultaat
- **URL:** ${report.finalUrl}
- **Compliance-score:** ${report.score}/100 — ${CONFORMANCE_LABEL[report.conformance]}
- **Stats:** ${report.stats.passed} pass · ${report.stats.failed} fail · ${report.stats.notApplicable} n.v.t.
- **Issues totaal:** ${totalIssues}
- **Pagina-titel:** ${report.pageMeta.title || "—"}
- **lang-attribuut:** ${report.pageMeta.lang || "—"}
- **HTML grootte:** ${(report.pageMeta.htmlBytes / 1024).toFixed(1)} KB · ${report.durationMs} ms

## Categorieën (POUR)
${categoryLines}

## Issues per impact
- Kritiek: ${report.stats.issuesByImpact.critical}
- Hoog: ${report.stats.issuesByImpact.serious}
- Middel: ${report.stats.issuesByImpact.moderate}
- Laag: ${report.stats.issuesByImpact.minor}

## Prioriteitenlijst
${findingsBlock}

${failing.length > 20 ? `_+ nog ${failing.length - 20} bevindingen — zie online dashboard._\n\n` : ""}## Contact
- **Naam:** ${lead.voornaam} ${lead.achternaam}
- **Bedrijf:** ${lead.bedrijf}
- **E-mail:** ${lead.email}
- **Telefoon:** ${lead.telefoon || "niet opgegeven"}
- **Toestemming:** verleend op ${datum}

---
_Gegenereerd door MAISON BLNDR · automated static audit (WCAG 2.1 AA + EN 301 549 v3.2.1) — handmatige beoordeling blijft nodig voor formele toetsing._`;
}

interface NoteCoupleResult {
  noteId: string | null;
  /** true = noteTarget aangemaakt, false = POST mislukte, null = overgeslagen (bv. geen companyId). */
  personLinked: boolean | null;
  companyLinked: boolean | null;
}

async function maakNoteEnKoppel(
  baseUrl: string,
  apiKey: string,
  title: string,
  markdownBody: string,
  personId: string,
  companyId: string | null
): Promise<NoteCoupleResult> {
  let noteId: string | null = null;
  try {
    const noteRes = await twentyREST(baseUrl, apiKey, "notes", {
      title,
      bodyV2: { markdown: markdownBody },
      createdBy: CREATED_BY,
    });
    noteId = extractId(noteRes, "notes");
  } catch (err) {
    console.warn(`[CRM/a11y] Note aanmaken mislukt (${title}):`, err);
    return { noteId: null, personLinked: null, companyLinked: null };
  }
  if (!noteId) {
    console.warn(`[CRM/a11y] Note aangemaakt maar id niet gevonden (${title})`);
    return { noteId: null, personLinked: null, companyLinked: null };
  }

  // Twenty noteTarget velden (sinds v1.17 morph-migratie):
  //   noteId + targetPersonId / targetCompanyId / targetOpportunityId
  // Bron: github.com/twentyhq/twenty/issues/16910
  const koppel = async (
    relType: "person" | "company",
    relId: string
  ): Promise<boolean> => {
    const targetField = relType === "person" ? "targetPersonId" : "targetCompanyId";
    try {
      const res = await twentyREST(baseUrl, apiKey, "noteTargets", {
        noteId,
        [targetField]: relId,
      });
      const targetId = extractId(res, "noteTargets");
      console.log(
        `[CRM/a11y] ✓ noteTarget aangemaakt (note=${noteId} ${targetField}=${relId} → noteTargetId=${targetId ?? "?"})`
      );
      return true;
    } catch (err) {
      console.warn(
        `[CRM/a11y] ✗ noteTarget POST mislukt (${targetField}=${relId}):`,
        err instanceof Error ? err.message : String(err)
      );
      return false;
    }
  };

  const personLinked = await koppel("person", personId);
  let companyLinked: boolean | null = null;
  if (companyId) {
    companyLinked = await koppel("company", companyId);
  } else {
    console.warn(
      `[CRM/a11y] ⚠ Geen companyId — note "${title}" wordt niet aan een company gekoppeld. Controleer of de company-lookup/aanmaak slaagde.`
    );
  }

  console.log(
    `[CRM/a11y] Note "${title}" samenvatting: note=${noteId} person=${personLinked ? "✓" : "✗"} company=${
      companyLinked === null ? "skip" : companyLinked ? "✓" : "✗"
    }`
  );
  return { noteId, personLinked, companyLinked };
}

/**
 * Compacte status-uitkomst zodat de API-route direct in de response kan
 * laten zien of de Twenty-push geslaagd is — zonder Vercel-logs te openen.
 */
export type TwentyPushStatus =
  | "ok"
  | "missing-env"
  | "person-failed"
  | "note-failed"
  | "exception";

export interface TwentyPushResult {
  status: TwentyPushStatus;
  personId?: string;
  companyId?: string;
  noteId?: string;
  /** true=link aangemaakt, false=POST mislukte, null=skipped (bv. companyId ontbrak). */
  personLinked?: boolean | null;
  companyLinked?: boolean | null;
  error?: string;
}

export async function pushAuditLeadToTwenty(
  lead: AuditLead,
  report: AuditReport
): Promise<TwentyPushResult> {
  const cfg = loadTwentyConfig();
  if (!cfg.ok) {
    if (cfg.reason === "missing-env") {
      devLog(`[CRM/a11y] Twenty niet geconfigureerd — lead lokaal gelogd (score ${report.score})`);
      return { status: "missing-env" };
    }
    console.error(`[CRM/a11y] FATAL: Twenty config invalid (${cfg.reason}): ${cfg.message}`);
    throw new Error(`Twenty CRM misconfigured: ${cfg.message}`);
  }
  const { baseUrl, apiKey } = cfg.config;
  const rawDomain = lead.email.split("@")[1]?.toLowerCase() ?? "";
  const isBusinessDomain = rawDomain !== "" && !FREE_EMAIL_DOMAINS.has(rawDomain);
  const emailDomain = isBusinessDomain ? rawDomain : "";

  try {
    let companyId: string | null = null;

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
            console.log(
              `[CRM/a11y] Company gevonden via domain "${emailDomain}" → ${companyId} (${lead.bedrijf})`
            );
          }
        }
        if (!companyId) {
          console.log(
            `[CRM/a11y] Geen company met domain "${emailDomain}" gevonden — probeer aanmaken/lookup-op-naam`
          );
        }
      } catch (err) {
        console.warn(
          `[CRM/a11y] Company domain-lookup faalde voor "${emailDomain}":`,
          err instanceof Error ? err.message : String(err)
        );
      }
    } else {
      console.log(
        `[CRM/a11y] Free-mail / leeg domain — overslaan domain-lookup (companyId blijft leeg of via naam)`
      );
    }

    if (!companyId) {
      const companyBody: Record<string, unknown> = {
        name: lead.bedrijf,
        createdBy: CREATED_BY,
      };
      if (emailDomain) companyBody.domainName = { primaryLinkUrl: emailDomain };
      try {
        const companyRes = await twentyREST(baseUrl, apiKey, "companies", companyBody);
        companyId = extractId(companyRes, "companies");
        if (companyId) {
          console.log(
            `[CRM/a11y] Company aangemaakt: "${lead.bedrijf}" → ${companyId}`
          );
        }
      } catch (err) {
        if (err instanceof TwentyDuplicateError) {
          try {
            const existing = await twentyGET(
              baseUrl,
              apiKey,
              "companies",
              `filter=name[eq]:${encodeURIComponent(lead.bedrijf)}`
            );
            companyId = extractFirstId(existing);
            if (companyId) {
              console.log(
                `[CRM/a11y] Company hergebruikt op naam "${lead.bedrijf}" → ${companyId}`
              );
            } else {
              console.warn(
                `[CRM/a11y] Company duplicate maar naam-lookup leverde niets op (mogelijk soft-deleted ghost record).`
              );
            }
          } catch (lookupErr) {
            console.warn("[CRM/a11y] Company duplicate + lookup mislukt:", lookupErr);
          }
        } else {
          console.warn("[CRM/a11y] Company aanmaken mislukt:", err);
        }
      }
    }

    if (!companyId) {
      console.warn(
        `[CRM/a11y] ⚠ companyId blijft leeg na lookup + aanmaak — note wordt straks NIET aan een company gekoppeld.`
      );
    }

    const personBody: Record<string, unknown> = {
      name: { firstName: lead.voornaam, lastName: lead.achternaam },
      emails: { primaryEmail: lead.email },
      createdBy: CREATED_BY,
    };
    const tel = normaliseerTelefoon(lead.telefoon);
    if (tel) personBody.phones = { primaryPhoneNumber: tel };
    if (companyId) personBody.companyId = companyId;

    let personId: string | null = null;
    try {
      const personRes = await twentyREST(baseUrl, apiKey, "people", personBody);
      personId = extractId(personRes, "people");
    } catch (err) {
      if (err instanceof TwentyDuplicateError) {
        personId = await zoekPersonOpEmail(baseUrl, apiKey, lead.email);
      } else {
        console.warn("[CRM/a11y] Person aanmaken mislukt:", err);
      }
    }

    if (!personId) {
      console.warn(`[CRM/a11y] Geen personId voor ${lead.email} — note overgeslagen.`);
      return { status: "person-failed", companyId: companyId ?? undefined };
    }

    let host = "site";
    try { host = new URL(report.finalUrl).host; } catch { /* noop */ }
    const noteTitle = `Toegankelijkheidsaudit — ${host} — Score ${report.score}/100`;
    const noteRes = await maakNoteEnKoppel(
      baseUrl,
      apiKey,
      noteTitle,
      buildAuditNoteMarkdown(lead, report),
      personId,
      companyId
    );

    if (!noteRes.noteId) {
      return {
        status: "note-failed",
        personId,
        companyId: companyId ?? undefined,
        personLinked: noteRes.personLinked,
        companyLinked: noteRes.companyLinked,
      };
    }

    console.log(
      `[CRM/a11y] ✓ Lead verwerkt: ${lead.email} → person=${personId} company=${companyId ?? "—"} note=${noteRes.noteId} ` +
        `personLink=${noteRes.personLinked ? "✓" : "✗"} companyLink=${
          noteRes.companyLinked === null ? "skip" : noteRes.companyLinked ? "✓" : "✗"
        } score=${report.score} | createdBy="${CREATED_BY.name}"`
    );

    return {
      status: "ok",
      personId,
      companyId: companyId ?? undefined,
      noteId: noteRes.noteId,
      personLinked: noteRes.personLinked,
      companyLinked: noteRes.companyLinked,
    };
  } catch (err) {
    console.error("[CRM/a11y] Twenty push mislukt:", err);
    return {
      status: "exception",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
