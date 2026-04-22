/**
 * Twenty CRM integratie via GraphQL API.
 *
 * Setup:
 * 1. Deploy Twenty (Railway / Contabo)
 * 2. Genereer API key: Settings → API & Webhooks → API Keys → Create
 * 3. Voeg toe aan .env.local en Vercel environment variables:
 *    TWENTY_API_KEY=your_api_key_here
 *    TWENTY_BASE_URL=https://crm.maisonblender.com  (geen trailing slash)
 */

import type { ScanAntwoorden, ScanResultaat, LeadGegevens } from "./types";

const SECTOR_LABELS: Record<string, string> = {
  productie: "Productie & Industrie",
  logistiek: "Logistiek & Transport",
  zorg: "Zorg & Welzijn",
  retail: "Retail & E-commerce",
  zakelijk_dienstverlening: "Zakelijke Dienstverlening",
  bouw: "Bouw & Installatietechniek",
  horeca: "Horeca & Recreatie",
  overig: "Overig",
};

const SCORE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  bewust: "Bewust",
  actief: "Actief",
  voorloper: "Voorloper",
  koploper: "Koploper",
};

function normaliseerTelefoon(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return "+" + cleaned.slice(2);
  if (cleaned.startsWith("0")) return "+31" + cleaned.slice(1);
  return "+31" + cleaned;
}

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

function bouwScanSamenvatting(
  lead: LeadGegevens,
  antwoorden: ScanAntwoorden,
  resultaat: ScanResultaat
): string {
  const pijnpunten = antwoorden.pijnpunten.join(", ");
  const applicaties = (antwoorden.kernApplicaties ?? []).join(", ") || "niet opgegeven";
  const zorgen = (antwoorden.aiZorgen ?? []).join(", ") || "geen";
  const volledigeNaam = `${lead.voornaam} ${lead.achternaam}`.trim();

  return `**AI Readiness Intake — ${new Date().toLocaleDateString("nl-NL")}**

**Score:** ${resultaat.aiReadinessScore}/100 — ${SCORE_LABELS[resultaat.scoreLabel] ?? resultaat.scoreLabel}
**Sector:** ${SECTOR_LABELS[antwoorden.sector] ?? antwoorden.sector}
**Omvang:** ${antwoorden.omvang} medewerkers
**Rol:** ${antwoorden.rol ?? "niet opgegeven"}
**Benchmark:** beter dan ${resultaat.benchmarkPercentiel}% van de sector

**ROI Potentieel:** €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
**Tijdsbesparing:** ${resultaat.tijdsbesparingTotaal} uur/week

**Pijnpunten:** ${pijnpunten}
**Uren verlies/week:** ${antwoorden.urenVerlies ?? "niet opgegeven"}

**Systemen:** ${applicaties}
**Datakwaliteit:** ${antwoorden.dataKwaliteit ?? "niet opgegeven"}
**Gevoelige data:** ${(antwoorden.gevoeligeData ?? []).join(", ") || "geen"}

**Team sentiment:** ${antwoorden.teamSentiment ?? "niet opgegeven"}
**Privacy beleid:** ${antwoorden.privacyBeleid ?? "niet opgegeven"}
**Governance risico:** ${resultaat.governanceRisico}
**Cultuur readiness:** ${resultaat.cultuurReadiness}
**AI Zorgen:** ${zorgen}

**Budget:** ${antwoorden.budgetBereidheid ?? "niet opgegeven"}
**Snelheid:** ${antwoorden.implementatieSnelheid ?? "niet opgegeven"}
**AI maturiteit:** ${antwoorden.aiMaturiteit ?? "niet opgegeven"}

**Naam:** ${volledigeNaam}
**Telefoon:** ${lead.telefoon ?? "niet opgegeven"}
**Toestemming verleend:** ja`;
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
    throw new Error(`Twenty REST ${res.status} op /${path}: ${text}`);
  }

  return JSON.parse(text);
}

/**
 * Twenty REST responses kunnen verschillende shapes hebben:
 *   { data: { id, ... } }
 *   { data: { createPerson: { id, ... } } }
 *   { id, ... }
 * Deze helper haalt het id eruit en logt de structuur bij onbekende shape.
 */
function extractId(response: unknown, path: string): string | null {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown>;
  if (typeof r.id === "string") return r.id;

  const data = r.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.id === "string") return d.id;
    // GraphQL-style nested response: data.createPerson.id, data.createCompany.id, etc.
    for (const value of Object.values(d)) {
      if (value && typeof value === "object" && typeof (value as Record<string, unknown>).id === "string") {
        return (value as Record<string, string>).id;
      }
    }
  }

  console.warn(`[CRM] Onverwachte response shape voor ${path}:`, JSON.stringify(response).slice(0, 300));
  return null;
}

export async function pushLeadToTwenty(
  lead: LeadGegevens,
  antwoorden: ScanAntwoorden,
  resultaat: ScanResultaat
): Promise<void> {
  const rawBaseUrl = process.env.TWENTY_BASE_URL;
  const apiKey = process.env.TWENTY_API_KEY;

  if (!rawBaseUrl || !apiKey) {
    console.log("[CRM] Twenty niet geconfigureerd — lead lokaal gelogd:", {
      naam: `${lead.voornaam} ${lead.achternaam}`,
      bedrijf: lead.bedrijf,
      email: lead.email,
      score: resultaat.aiReadinessScore,
    });
    return;
  }

  // Twenty API keys zijn JWT tokens (typisch 200+ chars beginnend met "eyJ").
  // Een korte string (< 50 chars) is meestal de workspace ID i.p.v. de API key.
  const looksLikeJwt = apiKey.startsWith("eyJ") && apiKey.length > 100;
  console.log(
    `[CRM] Verbinding naar: ${rawBaseUrl.slice(0, 50)} | API key: ${apiKey.length} chars` +
      (looksLikeJwt ? " (JWT format ✓)" : " ⚠️  geen JWT format — verwacht 'eyJ...' van 200+ chars")
  );


  const baseUrl = normaliseerBaseUrl(rawBaseUrl);

  try {
    // 1. Company aanmaken
    let companyId: string | null = null;
    try {
      const companyRes = await twentyREST(baseUrl, apiKey, "companies", { name: lead.bedrijf });
      companyId = extractId(companyRes, "companies");
    } catch (err) {
      console.warn("[CRM] Company aanmaken mislukt, ga door zonder koppeling:", err);
    }

    // 2. Person aanmaken
    const personBody: Record<string, unknown> = {
      name: { firstName: lead.voornaam, lastName: lead.achternaam },
      emails: { primaryEmail: lead.email },
      jobTitle: antwoorden.rol ?? "",
    };
    const telefoonE164 = normaliseerTelefoon(lead.telefoon);
    if (telefoonE164) {
      personBody.phones = { primaryPhoneNumber: telefoonE164 };
    }
    if (companyId) {
      personBody.companyId = companyId;
    }

    const personRes = await twentyREST(baseUrl, apiKey, "people", personBody);
    const personId = extractId(personRes, "people");

    if (!personId) {
      throw new Error("Person ID niet teruggekregen van Twenty");
    }

    // 3. Note aanmaken met scan samenvatting
    const noteSamenvatting = bouwScanSamenvatting(lead, antwoorden, resultaat);
    const noteRes = await twentyREST(baseUrl, apiKey, "notes", {
      title: `AI Readiness Scan — Score ${resultaat.aiReadinessScore}/100 — ${lead.bedrijf}`,
      body: noteSamenvatting,
    });

    // 4. Note koppelen aan person
    const noteId = extractId(noteRes, "notes");
    if (noteId) {
      try {
        await twentyREST(baseUrl, apiKey, "noteTargets", {
          noteId,
          personId,
        });
      } catch {
        // koppeling mislukt — note staat los in Twenty, niet fataal
      }
    }

    console.log(`[CRM] Lead aangemaakt in Twenty: ${lead.voornaam} ${lead.achternaam} (${lead.email}), score ${resultaat.aiReadinessScore}`);
  } catch (err) {
    console.error("[CRM] Twenty push mislukt (lead bewaard via e-mail):", err);
  }
}
