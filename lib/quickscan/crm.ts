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

const ROL_LABELS: Record<string, string> = {
  eigenaar_directeur: "Eigenaar / Directeur",
  manager: "Manager / Teamleider",
  it_verantwoordelijke: "IT / Digitalisering verantwoordelijke",
  medewerker: "Medewerker",
  anders: "Anders",
};

const TECHSTACK_LABELS: Record<string, string> = {
  basaal: "Basaal — losse tools, weinig integratie",
  modern: "Modern — kernsystemen geïntegreerd",
  geavanceerd: "Geavanceerd — automation en API's actief",
};

const PIJNPUNT_LABELS: Record<string, string> = {
  repetitief_handwerk: "Repetitief handmatig werk",
  klantcommunicatie: "Klantcommunicatie & support",
  data_analyse: "Data analyse & rapportage",
  documentverwerking: "Document- & factuurverwerking",
  planning_roostering: "Planning & roostering",
  kwaliteitscontrole: "Kwaliteitscontrole & compliance",
  hr_recruitment: "HR & recruitment",
  inkoop_leveranciers: "Inkoop & leveranciersbeheer",
  marketing_content: "Marketing & contentcreatie",
};

const UREN_LABELS: Record<string, string> = {
  "<5": "Minder dan 5 uur per week",
  "5-15": "5 tot 15 uur per week",
  "15-30": "15 tot 30 uur per week",
  ">30": "Meer dan 30 uur per week",
};

const KERNAPP_LABELS: Record<string, string> = {
  microsoft365: "Microsoft 365 / SharePoint",
  google_workspace: "Google Workspace",
  crm_erp: "CRM / ERP (Salesforce, Exact, Afas, etc.)",
  boekhouding: "Boekhoudsoftware",
  branche_specifiek: "Branchespecifieke software",
  custom_software: "Eigen / maatwerk software",
  voornamelijk_papier: "Voornamelijk papier en losse bestanden",
};

const DATA_KWALITEIT_LABELS: Record<string, string> = {
  verspreid_inconsistent: "Verspreid & inconsistent",
  structureel_geisoleerd: "Structureel maar geïsoleerd per systeem",
  centraal_goed: "Centraal & goed gestructureerd",
};

const GEVOELIGE_DATA_LABELS: Record<string, string> = {
  klantgegevens: "Klantgegevens (NAW, contact)",
  financiele_data: "Financiële data",
  medische_data: "Medische / gezondheidsgegevens",
  hr_personeelsdata: "HR & personeelsdata",
  bedrijfsgeheimen: "Bedrijfsgeheimen / IP",
  geen: "Geen gevoelige data",
};

const SENTIMENT_LABELS: Record<string, string> = {
  enthousiast: "Enthousiast & nieuwsgierig",
  verdeeld: "Verdeeld — deel enthousiast, deel sceptisch",
  sceptisch: "Overwegend sceptisch of weerstand",
  onbekend: "Onbekend — niet gemeten",
};

const TREKKER_LABELS: Record<string, string> = {
  directie: "Directie / eigenaar",
  it_manager: "IT- of digitaliseringsmanager",
  geen_centrale_trekker: "Geen centrale trekker",
};

const PRIVACY_LABELS: Record<string, string> = {
  geen_richtlijnen: "Geen richtlijnen",
  informele_afspraken: "Informele afspraken",
  formeel_avg: "Formeel AVG-beleid",
  iso_gecertificeerd: "ISO/NEN gecertificeerd",
};

const AI_ZORG_LABELS: Record<string, string> = {
  privacy_data_lekken: "Privacy & datalekken",
  verkeerde_output: "Onjuiste of misleidende output",
  baan_zekerheid: "Baanzekerheid medewerkers",
  kosten_complexiteit: "Kosten & complexiteit",
  afhankelijkheid_leverancier: "Afhankelijkheid van leveranciers",
  geen_zorgen: "Geen specifieke zorgen",
};

const MATURITY_LABELS: Record<string, string> = {
  geen_ai: "Geen AI in gebruik",
  experimenteren: "Experimenteert met AI (bijv. ChatGPT)",
  productief_gebruik: "AI productief in gebruik",
  ai_core: "AI is kern van processen",
};

const BUDGET_LABELS: Record<string, string> = {
  laag: "Tot €5.000 per jaar",
  midden: "€5.000 – €25.000 per jaar",
  hoog: "Meer dan €25.000 per jaar",
};

const SNELHEID_LABELS: Record<string, string> = {
  voorzichtig: "Voorzichtig — eerst onderzoeken",
  gebalanceerd: "Gebalanceerd — gefaseerde uitrol",
  agressief: "Agressief — snel resultaten",
};

function label(map: Record<string, string>, key: string | undefined | null, fallback = "niet opgegeven"): string {
  if (!key) return fallback;
  return map[key] ?? key;
}

function labelList(
  map: Record<string, string>,
  keys: string[] | undefined | null,
  fallback = "niet opgegeven"
): string {
  if (!keys || keys.length === 0) return fallback;
  return keys.map((k) => map[k] ?? k).join(", ");
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
  const datum = new Date().toLocaleString("nl-NL", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const volledigeNaam = `${lead.voornaam} ${lead.achternaam}`.trim();

  return `# AI Readiness Intake — ${datum}

## Resultaat
- **AI Readiness Score:** ${resultaat.aiReadinessScore}/100 — ${SCORE_LABELS[resultaat.scoreLabel] ?? resultaat.scoreLabel}
- **Benchmark:** beter dan ${resultaat.benchmarkPercentiel}% van de sector (sectorgemiddelde: ${resultaat.sectorBenchmark}/100)
- **ROI potentieel:** €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
- **Tijdsbesparing:** ${resultaat.tijdsbesparingTotaal} uur/week
- **Governance risico:** ${resultaat.governanceRisico}
- **Cultuur readiness:** ${resultaat.cultuurReadiness}

## Pijler 1 — Bedrijfsprofiel
**In welke sector is jouw bedrijf actief?**
${label(SECTOR_LABELS, antwoorden.sector)}

**Hoeveel medewerkers heeft jouw bedrijf?**
${antwoorden.omvang ?? "niet opgegeven"} medewerkers

**Wat is jouw rol binnen de organisatie?**
${label(ROL_LABELS, antwoorden.rol)}

**Hoe omschrijf je de digitale volwassenheid van jouw bedrijf?**
${label(TECHSTACK_LABELS, antwoorden.techStack)}

## Pijler 2 — Pijnpunten & tijdvreters
**Welke processen kosten jullie de meeste tijd?**
${labelList(PIJNPUNT_LABELS, antwoorden.pijnpunten, "geen geselecteerd")}

**Hoeveel uur per week gaat er verloren aan repetitief of handmatig werk?**
${label(UREN_LABELS, antwoorden.urenVerlies)}

## Pijler 3 — Data & systemen
**Welke software of systemen gebruiken jullie?**
${labelList(KERNAPP_LABELS, antwoorden.kernApplicaties)}

**Hoe is de kwaliteit en toegankelijkheid van jullie data?**
${label(DATA_KWALITEIT_LABELS, antwoorden.dataKwaliteit)}

**Welke soorten gevoelige data verwerken jullie?**
${labelList(GEVOELIGE_DATA_LABELS, antwoorden.gevoeligeData)}

## Pijler 4 — Cultuur, kennis & governance
**Hoe staat het team tegenover AI en nieuwe technologie?**
${label(SENTIMENT_LABELS, antwoorden.teamSentiment)}

**Wie trekt de digitale agenda binnen jullie organisatie?**
${label(TREKKER_LABELS, antwoorden.digitaleAgendasTrekker)}

**Welk privacy- en databeleid hanteren jullie nu?**
${label(PRIVACY_LABELS, antwoorden.privacyBeleid)}

**Wat zijn jullie grootste zorgen bij het inzetten van AI?**
${labelList(AI_ZORG_LABELS, antwoorden.aiZorgen, "geen specifieke zorgen")}

## Pijler 5 — AI-ambitie & contact
**Wat is jullie huidige AI-maturiteit?**
${label(MATURITY_LABELS, antwoorden.aiMaturiteit)}

**Wat is jullie jaarlijkse budget voor AI-initiatieven?**
${label(BUDGET_LABELS, antwoorden.budgetBereidheid)}

**Welke implementatiesnelheid past bij jullie?**
${label(SNELHEID_LABELS, antwoorden.implementatieSnelheid)}

## Contactgegevens
- **Naam:** ${volledigeNaam}
- **Bedrijf:** ${lead.bedrijf}
- **E-mail:** ${lead.email}
- **Telefoon:** ${lead.telefoon ?? "niet opgegeven"}
- **Toestemming gegevensverwerking:** verleend op ${datum}`;
}

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
    if (res.status === 400 && /duplicate/i.test(text)) {
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
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`Twenty REST GET ${res.status} op /${path}: ${text}`);
  }
  return JSON.parse(text);
}

/** Zoek bestaand record via filter en geef het eerste id terug. */
function extractFirstId(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown>;
  const data = r.data;
  if (data && typeof data === "object") {
    for (const value of Object.values(data as Record<string, unknown>)) {
      if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (first && typeof first === "object" && typeof (first as Record<string, unknown>).id === "string") {
          return (first as Record<string, string>).id;
        }
      }
    }
  }
  return null;
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

  // Email-domain als unieke company identifier — applemooz.nl ≠ applemooz.com.
  // BELANGRIJK: gratis email providers (gmail, outlook, etc.) zijn GEEN bedrijfsdomein —
  // anders zouden alle gmail-gebruikers onder één "gmail.com" company belanden.
  // Voor die gevallen vallen we terug op match-by-name + nieuwe company per scan.
  const FREE_EMAIL_DOMAINS = new Set([
    "gmail.com", "googlemail.com",
    "outlook.com", "outlook.nl", "hotmail.com", "hotmail.nl", "live.com", "live.nl", "msn.com",
    "yahoo.com", "yahoo.nl", "ymail.com",
    "icloud.com", "me.com", "mac.com",
    "ziggo.nl", "kpnmail.nl", "planet.nl", "xs4all.nl", "telfort.nl", "home.nl", "online.nl",
    "proton.me", "protonmail.com", "tutanota.com",
    "aol.com", "gmx.com", "gmx.nl", "mail.com",
  ]);
  const rawDomain = lead.email.split("@")[1]?.toLowerCase() ?? "";
  const isBusinessDomain = rawDomain !== "" && !FREE_EMAIL_DOMAINS.has(rawDomain);
  const emailDomain = isBusinessDomain ? rawDomain : "";

  try {
    // 1. Company aanmaken — of bestaande hergebruiken op basis van domain (niet alleen naam,
    //    omdat meerdere bedrijven dezelfde naam kunnen hebben).
    let companyId: string | null = null;

    // 1a. Eerst zoeken op email-domain — meest unieke matcher
    if (emailDomain) {
      try {
        const existing = await twentyGET(
          baseUrl,
          apiKey,
          "companies",
          `filter=domainName.primaryLinkUrl[eq]:${encodeURIComponent(emailDomain)}`
        );
        companyId = extractFirstId(existing);
        if (companyId) {
          console.log(`[CRM] Bestaande company hergebruikt op domain: ${emailDomain}`);
        }
      } catch {
        // lookup-fout is niet fataal, we maken zo nodig een nieuwe company
      }
    }

    // 1b. Geen bestaande gevonden → nieuwe company aanmaken
    if (!companyId) {
      const companyBody: Record<string, unknown> = { name: lead.bedrijf };
      if (emailDomain) {
        companyBody.domainName = { primaryLinkUrl: emailDomain };
      }
      try {
        const companyRes = await twentyREST(baseUrl, apiKey, "companies", companyBody);
        companyId = extractId(companyRes, "companies");
      } catch (err) {
        if (err instanceof TwentyDuplicateError) {
          // Twenty matched op iets anders (bijv. domain in andere shape) — zoek nogmaals op naam
          try {
            const existing = await twentyGET(
              baseUrl,
              apiKey,
              "companies",
              `filter=name[eq]:${encodeURIComponent(lead.bedrijf)}`
            );
            companyId = extractFirstId(existing);
            if (companyId) {
              console.log(`[CRM] Bestaande company hergebruikt op naam: ${lead.bedrijf}`);
            }
          } catch (lookupErr) {
            console.warn("[CRM] Company duplicate, lookup mislukt:", lookupErr);
          }
        } else {
          console.warn("[CRM] Company aanmaken mislukt, ga door zonder koppeling:", err);
        }
      }
    }

    // 2. Person aanmaken — of bestaande hergebruiken bij duplicate
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

    let personId: string | null = null;
    try {
      const personRes = await twentyREST(baseUrl, apiKey, "people", personBody);
      personId = extractId(personRes, "people");
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
          if (personId) {
            console.log(`[CRM] Bestaande person hergebruikt: ${lead.email}`);
          }
        } catch (lookupErr) {
          console.warn("[CRM] Person duplicate, lookup mislukt:", lookupErr);
        }
      } else {
        throw err;
      }
    }

    if (!personId) {
      throw new Error("Person ID niet teruggekregen van Twenty (ook geen bestaand record gevonden)");
    }

    // 3. Note met scan samenvatting (Q&A) aanmaken en koppelen
    await maakNoteEnKoppel(
      baseUrl,
      apiKey,
      `AI Readiness Intake — Score ${resultaat.aiReadinessScore}/100 — ${lead.bedrijf}`,
      bouwScanSamenvatting(lead, antwoorden, resultaat),
      personId,
      companyId
    );

    console.log(`[CRM] Lead verwerkt in Twenty: ${lead.voornaam} ${lead.achternaam} (${lead.email}), score ${resultaat.aiReadinessScore}, company=${companyId ?? "geen"}, person=${personId}`);
  } catch (err) {
    console.error("[CRM] Twenty push mislukt (lead bewaard via e-mail):", err);
  }
}

/**
 * Maak een note aan in Twenty en koppel die aan een person en (optioneel) company.
 * Faalt silent — Twenty CRM is een nice-to-have voor logging, niet kritiek voor de flow.
 */
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
    });
    noteId = extractId(noteRes, "notes");
  } catch (err) {
    console.warn(`[CRM] Note aanmaken mislukt (${title}):`, err);
    return;
  }

  if (!noteId) {
    console.warn(`[CRM] Note aangemaakt maar id niet gevonden (${title})`);
    return;
  }

  try {
    await twentyREST(baseUrl, apiKey, "noteTargets", { noteId, personId });
  } catch (err) {
    console.warn(`[CRM] Note→Person koppeling mislukt (${title}):`, err);
  }

  if (companyId) {
    try {
      await twentyREST(baseUrl, apiKey, "noteTargets", { noteId, companyId });
    } catch (err) {
      console.warn(`[CRM] Note→Company koppeling mislukt (${title}):`, err);
    }
  }

  console.log(`[CRM] Note "${title}" toegevoegd (note=${noteId}, person=${personId}, company=${companyId ?? "geen"})`);
}

/**
 * Voeg een extra note toe voor een bestaande lead (gevonden via email).
 * Wordt gebruikt om de AI-analyse en het email-actieplan los te bewaren.
 */
export async function addNoteForLead(
  email: string,
  title: string,
  markdownBody: string
): Promise<void> {
  const rawBaseUrl = process.env.TWENTY_BASE_URL;
  const apiKey = process.env.TWENTY_API_KEY;

  if (!rawBaseUrl || !apiKey) {
    console.log(`[CRM] Twenty niet geconfigureerd — note "${title}" overgeslagen`);
    return;
  }

  const baseUrl = normaliseerBaseUrl(rawBaseUrl);

  // Person opzoeken via email
  let personId: string | null = null;
  try {
    const personLookup = await twentyGET(
      baseUrl,
      apiKey,
      "people",
      `filter=emails.primaryEmail[eq]:${encodeURIComponent(email)}`
    );
    personId = extractFirstId(personLookup);
  } catch (err) {
    console.warn(`[CRM] Person lookup mislukt voor ${email}:`, err);
    return;
  }

  if (!personId) {
    console.warn(`[CRM] Geen person gevonden voor ${email} — note "${title}" overgeslagen`);
    return;
  }

  // Company afleiden via email-domain (alleen voor zakelijke domeinen)
  let companyId: string | null = null;
  const FREE_EMAIL_DOMAINS = new Set([
    "gmail.com", "googlemail.com",
    "outlook.com", "outlook.nl", "hotmail.com", "hotmail.nl", "live.com", "live.nl", "msn.com",
    "yahoo.com", "yahoo.nl", "ymail.com",
    "icloud.com", "me.com", "mac.com",
    "ziggo.nl", "kpnmail.nl", "planet.nl", "xs4all.nl", "telfort.nl", "home.nl", "online.nl",
    "proton.me", "protonmail.com", "tutanota.com",
    "aol.com", "gmx.com", "gmx.nl", "mail.com",
  ]);
  const rawDomain = email.split("@")[1]?.toLowerCase() ?? "";
  if (rawDomain && !FREE_EMAIL_DOMAINS.has(rawDomain)) {
    try {
      const companyLookup = await twentyGET(
        baseUrl,
        apiKey,
        "companies",
        `filter=domainName.primaryLinkUrl[eq]:${encodeURIComponent(rawDomain)}`
      );
      companyId = extractFirstId(companyLookup);
    } catch {
      // niet fataal — note alleen aan person koppelen
    }
  }

  await maakNoteEnKoppel(baseUrl, apiKey, title, markdownBody, personId, companyId);
}
