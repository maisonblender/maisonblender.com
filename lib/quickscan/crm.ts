/**
 * Twenty CRM integratie voor quickscan leads.
 *
 * Setup:
 * 1. Deploy Twenty op Contabo met Docker Compose (zie README hieronder)
 * 2. Genereer API key in Twenty: Settings → API Keys → Create
 * 3. Voeg toe aan .env.local en Vercel environment variables:
 *    TWENTY_API_KEY=your_api_key_here
 *    TWENTY_BASE_URL=https://crm.jouwdomein.nl  (geen trailing slash)
 *
 * Twenty Contabo Docker deploy:
 *   git clone https://github.com/twentyhq/twenty.git
 *   cd twenty/packages/twenty-docker
 *   cp .env.example .env
 *   # Pas SERVER_URL, APP_SECRET en storage aan in .env
 *   docker compose up -d
 */

import type { ScanAntwoorden, ScanResultaat, LeadGegevens } from "./types";

interface TwentyPerson {
  name: { firstName: string; lastName: string };
  emails: { primaryEmail: string };
  phones?: { primaryPhoneNumber: string };
}

interface TwentyCompany {
  name: string;
}

interface TwentyNote {
  title: string;
  body: string;
}

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

function parsNaam(volledigeNaam: string): { firstName: string; lastName: string } {
  const delen = volledigeNaam.trim().split(" ");
  if (delen.length === 1) return { firstName: delen[0], lastName: "" };
  const firstName = delen[0];
  const lastName = delen.slice(1).join(" ");
  return { firstName, lastName };
}

function bouwScanSamenvatting(
  lead: LeadGegevens,
  antwoorden: ScanAntwoorden,
  resultaat: ScanResultaat
): string {
  const pijnpunten = antwoorden.pijnpunten.join(", ");
  const applicaties = (antwoorden.kernApplicaties ?? []).join(", ") || "niet opgegeven";
  const zorgen = (antwoorden.aiZorgen ?? []).join(", ") || "geen";

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
    throw new Error(`Twenty API fout ${res.status}: ${text}`);
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
      naam: lead.naam,
      bedrijf: lead.bedrijf,
      email: lead.email,
      score: resultaat.aiReadinessScore,
    });
    return;
  }

  try {
    const { firstName, lastName } = parsNaam(lead.naam);

    // 1. Maak of zoek Company op naam
    let companyId: string | null = null;
    try {
      const companyData = await twentyRequest<{ data: { createCompany: { id: string } } }>(
        "/objects/companies",
        "POST",
        { name: lead.bedrijf } satisfies TwentyCompany
      );
      companyId = companyData.data?.createCompany?.id ?? null;
    } catch (err) {
      console.warn("[CRM] Company aanmaken mislukt, ga door zonder company koppeling:", err);
    }

    // 2. Maak Person aan
    const personPayload: TwentyPerson & { companyId?: string; jobTitle?: string } = {
      name: { firstName, lastName },
      emails: { primaryEmail: lead.email },
      jobTitle: antwoorden.rol ?? undefined,
      ...(lead.telefoon
        ? { phones: { primaryPhoneNumber: lead.telefoon } }
        : {}),
      ...(companyId ? { companyId } : {}),
    };

    const personData = await twentyRequest<{ data: { createPerson: { id: string } } }>(
      "/objects/people",
      "POST",
      personPayload
    );
    const personId = personData.data?.createPerson?.id;

    if (!personId) {
      throw new Error("Person ID niet teruggekregen van Twenty");
    }

    // 3. Voeg Note toe met volledige scan samenvatting
    const noteSamenvatting = bouwScanSamenvatting(lead, antwoorden, resultaat);
    const notePayload: TwentyNote & { personId?: string } = {
      title: `AI Readiness Scan — Score ${resultaat.aiReadinessScore}/100`,
      body: noteSamenvatting,
      personId,
    };

    await twentyRequest("/objects/notes", "POST", notePayload);

    console.log(`[CRM] Lead succesvol aangemaakt in Twenty: ${lead.naam} (${lead.email}), score ${resultaat.aiReadinessScore}`);
  } catch (err) {
    // Niet-fatale fout — lead is al via e-mail opgeslagen
    console.error("[CRM] Twenty push mislukt (lead bewaard via e-mail):", err);
  }
}
