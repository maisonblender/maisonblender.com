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

async function twentyGQL<T>(
  baseUrl: string,
  apiKey: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${baseUrl}/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Twenty GraphQL HTTP ${res.status}: ${text}`);
  }

  const json = await res.json() as { data?: T; errors?: { message: string }[] };

  if (json.errors?.length) {
    throw new Error(`Twenty GraphQL fout: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  return json.data as T;
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

  const baseUrl = normaliseerBaseUrl(rawBaseUrl);

  try {
    // 1. Company aanmaken
    let companyId: string | null = null;
    try {
      const companyResult = await twentyGQL<{ createCompany: { id: string } }>(
        baseUrl,
        apiKey,
        `mutation CreateCompany($name: String!) {
          createCompany(data: { name: $name }) {
            id
          }
        }`,
        { name: lead.bedrijf }
      );
      companyId = companyResult?.createCompany?.id ?? null;
    } catch (err) {
      console.warn("[CRM] Company aanmaken mislukt, ga door zonder koppeling:", err);
    }

    // 2. Person aanmaken
    const personResult = await twentyGQL<{ createPerson: { id: string } }>(
      baseUrl,
      apiKey,
      `mutation CreatePerson(
        $firstName: String!
        $lastName: String!
        $email: String!
        $phone: String
        $jobTitle: String
        $companyId: ID
      ) {
        createPerson(data: {
          name: { firstName: $firstName, lastName: $lastName }
          emails: { primaryEmail: $email }
          phones: { primaryPhoneNumber: $phone }
          jobTitle: $jobTitle
          company: { id: $companyId }
        }) {
          id
        }
      }`,
      {
        firstName: lead.voornaam,
        lastName: lead.achternaam,
        email: lead.email,
        phone: lead.telefoon ?? null,
        jobTitle: antwoorden.rol ?? null,
        companyId: companyId ?? null,
      }
    );
    const personId = personResult?.createPerson?.id;

    if (!personId) {
      throw new Error("Person ID niet teruggekregen van Twenty");
    }

    // 3. Note aanmaken
    const noteSamenvatting = bouwScanSamenvatting(lead, antwoorden, resultaat);
    const noteResult = await twentyGQL<{ createNote: { id: string } }>(
      baseUrl,
      apiKey,
      `mutation CreateNote($title: String!, $body: String!) {
        createNote(data: { title: $title, body: $body }) {
          id
        }
      }`,
      {
        title: `AI Readiness Scan — Score ${resultaat.aiReadinessScore}/100 — ${lead.bedrijf}`,
        body: noteSamenvatting,
      }
    );

    // 4. Note koppelen aan person
    const noteId = noteResult?.createNote?.id;
    if (noteId) {
      try {
        await twentyGQL(
          baseUrl,
          apiKey,
          `mutation CreateNoteTarget($noteId: ID!, $personId: ID!) {
            createNoteTarget(data: {
              note: { id: $noteId }
              person: { id: $personId }
            }) {
              id
            }
          }`,
          { noteId, personId }
        );
      } catch {
        // noteTarget koppeling mislukt — note staat los in Twenty, niet fataal
      }
    }

    console.log(`[CRM] Lead aangemaakt in Twenty: ${lead.voornaam} ${lead.achternaam} (${lead.email}), score ${resultaat.aiReadinessScore}`);
  } catch (err) {
    console.error("[CRM] Twenty push mislukt (lead bewaard via e-mail):", err);
  }
}
