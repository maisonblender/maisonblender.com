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

function normaliseerBaseUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, "");
  if (url.includes("://")) {
    const scheme = url.split("://")[0].toLowerCase();
    if (scheme !== "http" && scheme !== "https") {
      url = "https://" + url.split("://").slice(1).join("://");
    }
  } else {
    url = `https://${url}`;
  }
  return url;
}

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

async function maakNoteEnKoppel(
  baseUrl: string,
  apiKey: string,
  title: string,
  markdownBody: string,
  personId: string,
  companyId: string | null
): Promise<string | null> {
  let noteId: string | null = null;
  try {
    const noteRes = await twentyREST(baseUrl, apiKey, "notes", {
      title,
      bodyV2: { markdown: markdownBody },
    });
    noteId = extractId(noteRes, "notes");
  } catch (err) {
    console.warn(`[CRM/a11y] Note aanmaken mislukt (${title}):`, err);
    return null;
  }
  if (!noteId) {
    console.warn(`[CRM/a11y] Note aangemaakt maar id niet gevonden (${title})`);
    return null;
  }

  const koppel = async (relType: "person" | "company", relId: string) => {
    const targetField = relType === "person" ? "targetPersonId" : "targetCompanyId";
    try {
      await twentyREST(baseUrl, apiKey, "noteTargets", { noteId, [targetField]: relId });
    } catch (err) {
      console.warn(`[CRM/a11y] Note→${relType} koppeling mislukt:`, err);
    }
  };
  await koppel("person", personId);
  if (companyId) await koppel("company", companyId);
  console.log(`[CRM/a11y] ✓ Note "${title}" gekoppeld (note=${noteId}, person=${personId}, company=${companyId ?? "—"})`);
  return noteId;
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
  error?: string;
}

export async function pushAuditLeadToTwenty(
  lead: AuditLead,
  report: AuditReport
): Promise<TwentyPushResult> {
  const rawBaseUrl = process.env.TWENTY_BASE_URL;
  const apiKey = process.env.TWENTY_API_KEY;

  if (!rawBaseUrl || !apiKey) {
    console.log("[CRM/a11y] Twenty niet geconfigureerd — lead lokaal gelogd:", {
      naam: `${lead.voornaam} ${lead.achternaam}`,
      bedrijf: lead.bedrijf,
      email: lead.email,
      url: report.finalUrl,
      score: report.score,
    });
    return { status: "missing-env" };
  }

  const looksLikeJwt = apiKey.startsWith("eyJ") && apiKey.length > 100;
  console.log(
    `[CRM/a11y] → Twenty: ${rawBaseUrl.slice(0, 60)} | API key ${apiKey.length} chars` +
      (looksLikeJwt ? " (JWT ✓)" : " ⚠️ geen JWT-format (verwacht 'eyJ...' van 200+ chars)")
  );

  const baseUrl = normaliseerBaseUrl(rawBaseUrl);
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
          }
        }
      } catch {
        // niet fataal
      }
    }

    if (!companyId) {
      const companyBody: Record<string, unknown> = { name: lead.bedrijf };
      if (emailDomain) companyBody.domainName = { primaryLinkUrl: emailDomain };
      try {
        const companyRes = await twentyREST(baseUrl, apiKey, "companies", companyBody);
        companyId = extractId(companyRes, "companies");
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
          } catch (lookupErr) {
            console.warn("[CRM/a11y] Company duplicate + lookup mislukt:", lookupErr);
          }
        } else {
          console.warn("[CRM/a11y] Company aanmaken mislukt:", err);
        }
      }
    }

    const personBody: Record<string, unknown> = {
      name: { firstName: lead.voornaam, lastName: lead.achternaam },
      emails: { primaryEmail: lead.email },
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
    const noteId = await maakNoteEnKoppel(
      baseUrl,
      apiKey,
      noteTitle,
      buildAuditNoteMarkdown(lead, report),
      personId,
      companyId
    );

    if (!noteId) {
      return {
        status: "note-failed",
        personId,
        companyId: companyId ?? undefined,
      };
    }

    console.log(
      `[CRM/a11y] ✓ Lead verwerkt: ${lead.email} → person=${personId} company=${companyId ?? "—"} note=${noteId} score=${report.score}`
    );

    return {
      status: "ok",
      personId,
      companyId: companyId ?? undefined,
      noteId,
    };
  } catch (err) {
    console.error("[CRM/a11y] Twenty push mislukt:", err);
    return {
      status: "exception",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
