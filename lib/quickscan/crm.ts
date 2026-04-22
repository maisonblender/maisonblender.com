/**
 * Twenty CRM integratie voor quickscan leads.
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

async function twentyRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH",
  body?: unknown
): Promise<T> {
  const baseUrl = process.env.TWENTY_BASE_URL;
  const apiKey = process.env.TWENTY_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Twenty CRM niet geconfigureerd (TWENTY_BASE_URL of TWENTY_API_KEY ontbreekt)");
  }

  const res = await fetch(`${baseUrl}/api${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Twenty API fout ${res.status} op ${endpoint}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function pushLeadToTwenty(
  lead: LeadGegevens,
  antwoorden: ScanAntwoorden,
  resultaat: ScanResultaat
): Promise<void> {
  if (!process.env.TWENTY_API_KEY || !process.env.TWENTY_BASE_URL) {
    console.log("[CRM] Twenty niet geconfigureerd — lead lokaal gelogd:", {
      naam: `${lead.voornaam} ${lead.achternaam}`,
      bedrijf: lead.bedrijf,
      email: lead.email,
      score: resultaat.aiReadinessScore,
    });
    return;
  }

  try {
    // 1. Company aanmaken
    let companyId: string | null = null;
    try {
      const company = await twentyRequest<{ id: string }>(
        "/companies",
        "POST",
        { name: lead.bedrijf }
      );
      companyId = company?.id ?? null;
    } catch (err) {
      console.warn("[CRM] Company aanmaken mislukt, ga door zonder koppeling:", err);
    }

    // 2. Person aanmaken
    const personPayload: Record<string, unknown> = {
      name: { firstName: lead.voornaam, lastName: lead.achternaam },
      emails: { primaryEmail: lead.email },
    };
    if (lead.telefoon) {
      personPayload.phones = { primaryPhoneNumber: lead.telefoon };
    }
    if (antwoorden.rol) {
      personPayload.jobTitle = antwoorden.rol;
    }
    if (companyId) {
      personPayload.companyId = companyId;
    }

    const person = await twentyRequest<{ id: string }>(
      "/people",
      "POST",
      personPayload
    );
    const personId = person?.id;

    if (!personId) {
      throw new Error("Person ID niet teruggekregen van Twenty");
    }

    // 3. Note aanmaken
    const noteSamenvatting = bouwScanSamenvatting(lead, antwoorden, resultaat);
    const note = await twentyRequest<{ id: string }>(
      "/notes",
      "POST",
      {
        title: `AI Readiness Scan — Score ${resultaat.aiReadinessScore}/100`,
        body: noteSamenvatting,
      }
    );

    // 4. Note koppelen aan person via noteTargets
    if (note?.id) {
      try {
        await twentyRequest(
          "/noteTargets",
          "POST",
          { noteId: note.id, personId }
        );
      } catch {
        // noteTargets koppeling mislukt — note staat nog los in Twenty
      }
    }

    console.log(`[CRM] Lead aangemaakt in Twenty: ${lead.voornaam} ${lead.achternaam} (${lead.email}), score ${resultaat.aiReadinessScore}`);
  } catch (err) {
    console.error("[CRM] Twenty push mislukt (lead bewaard via e-mail):", err);
  }
}
