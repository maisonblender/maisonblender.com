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
  bouw: "Bouw & Installatietechniek",
  financieel: "Financiële dienstverlening",
  horeca: "Horeca & Recreatie",
  logistiek: "Logistiek & Transport",
  onderwijs: "Onderwijs & Onderzoek",
  overheid: "Overheid & Non-profit",
  productie: "Productie & Industrie",
  retail: "Retail & E-commerce",
  technologie: "Technologie & Software",
  zakelijk_dienstverlening: "Zakelijke dienstverlening",
  zorg: "Zorg & Welzijn",
  anders: "Anders",
};

const SCORE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  bewust: "Bewust",
  actief: "Actief",
  voorloper: "Voorloper",
  koploper: "Koploper",
};

const ROL_LABELS: Record<string, string> = {
  directeur_ceo: "Directeur / CEO / Eigenaar",
  manager: "Manager / Teamleider",
  it_verantwoordelijke: "IT / Technologie verantwoordelijke",
  operations: "Operations / Processen",
  hr_people: "HR / People & Culture",
  finance: "Finance / Controlling",
  marketing_sales: "Marketing / Sales",
  medewerker: "Medewerker",
  anders: "Anders",
};

const TECHSTACK_LABELS: Record<string, string> = {
  geen_systemen: "Voornamelijk handmatige processen",
  basis_office: "Basis Office & e-mail",
  erp_crm: "ERP en/of CRM systeem",
  cloud_first: "Cloud-first & API-gedreven",
  al_ai_gebruik: "Al AI in gebruik",
};

const PIJNPUNT_LABELS: Record<string, string> = {
  data_invoer_administratie: "Data-invoer & administratie",
  rapportages_verslaglegging: "Rapportages & verslaglegging",
  klantvragen: "Beantwoorden van klantvragen",
  email_verwerking: "E-mail verwerking & communicatie",
  planning_roostering: "Planning & roostering",
  factuurverwerking: "Factuurverwerking & boekhouding",
  contentcreatie: "Contentcreatie & marketing",
  hr_administratie: "HR-administratie & onboarding",
  data_analyse: "Data-analyse & rapportage",
  inkoop_leveranciers: "Inkoop & leveranciersbeheer",
  compliance_documentbeheer: "Compliance & documentbeheer",
  kwaliteitscontrole: "Kwaliteitscontrole",
  anders: "Anders",
};

const UREN_LABELS: Record<string, string> = {
  "<2": "Minder dan 2 uur per medewerker per week",
  "2-5": "2 tot 5 uur per medewerker per week",
  "5-10": "5 tot 10 uur per medewerker per week",
  "10-20": "10 tot 20 uur per medewerker per week",
  ">20": "Meer dan 20 uur per medewerker per week",
};

const KERNAPP_LABELS: Record<string, string> = {
  microsoft365: "Microsoft 365",
  google_workspace: "Google Workspace",
  exact: "Exact",
  afas: "AFAS",
  sap: "SAP",
  salesforce: "Salesforce",
  hubspot: "HubSpot",
  shopify: "Shopify",
  magento: "Magento / Adobe Commerce",
  woocommerce: "WooCommerce",
  lightspeed: "Lightspeed",
  mailchimp: "Mailchimp",
  klaviyo: "Klaviyo",
  asana_monday: "Asana / Monday / ClickUp",
  slack_teams: "Slack / MS Teams",
  powerbi_tableau: "Power BI / Tableau / Looker",
  branche_specifiek: "Branchespecifieke software",
  eigen_maatwerk: "Eigen / maatwerk software",
  anders: "Andere software",
  geen: "Geen specifieke systemen",
};

const DATA_KWALITEIT_LABELS: Record<string, string> = {
  chaotisch: "Chaotisch — data staat overal verspreid",
  basis: "Basis — data is aanwezig maar niet gestructureerd",
  redelijk: "Redelijk — data is grotendeels gestructureerd",
  goed: "Goed — data is gestructureerd en consistent",
  uitstekend: "Uitstekend — data is clean, gecentraliseerd en goed gedocumenteerd",
};

const SYSTEEM_INTEGRATIE_LABELS: Record<string, string> = {
  nauwelijks: "Nauwelijks — systemen staan los van elkaar",
  beperkt: "Beperkt — enkele handmatige koppelingen",
  gedeeltelijk: "Gedeeltelijk — sommige systemen zijn gekoppeld",
  goed: "Goed — de meeste systemen communiceren met elkaar",
  uitstekend: "Uitstekend — volledig geïntegreerd ecosysteem",
};

const IT_INFRA_LABELS: Record<string, string> = {
  cloud_based: "Volledig cloud-based",
  hybride: "Hybride (cloud + on-premise)",
  on_premise: "Voornamelijk on-premise",
  weet_niet: "Weet ik niet",
};

const GEVOELIGE_DATA_LABELS: Record<string, string> = {
  klantgegevens: "Klantgegevens & contactinformatie",
  financieel: "Financiële gegevens",
  medisch: "Medische / gezondheidsgegevens",
  personeel: "Personeelsgegevens",
  juridisch: "Juridische documenten & contracten",
  intellectueel_eigendom: "Intellectueel eigendom & bedrijfsgeheimen",
  minderjarigen: "Gegevens van minderjarigen",
  geen: "Geen bijzondere categorieën",
};

const SENTIMENT_LABELS: Record<string, string> = {
  enthousiast: "Enthousiast & nieuwsgierig",
  verdeeld: "Verdeeld — deel enthousiast, deel sceptisch",
  sceptisch: "Overwegend sceptisch of weerstand",
  onbekend: "Onbekend — niet gemeten",
};

const MGMT_LABELS: Record<string, string> = {
  niet_betrokken: "Niet betrokken — AI staat niet op de agenda",
  bewust: "Bewust — erkent het belang maar er is geen actie",
  geinteresseerd: "Geïnteresseerd — er zijn gesprekken gaande",
  actief: "Actief — management stuurt op AI-adoptie",
  strategisch: "Strategisch — AI is kernonderdeel van de bedrijfsstrategie",
};

const TRAINING_LABELS: Record<string, string> = {
  basiskennis_ai: "Basiskennis AI & automatisering",
  prompt_engineering: "Prompt engineering & effectief AI-gebruik",
  privacy_veilig_gebruik: "Privacy & veilig gebruik van AI-tools",
  specifieke_tools: "Specifieke tool-trainingen (Copilot, ChatGPT)",
  change_management: "Change management & adoptie",
  ai_strategie_leidinggevenden: "AI-strategie voor leidinggevenden",
  geen_training_nodig: "Geen training nodig",
};

const PRIVACY_LABELS: Record<string, string> = {
  geen_richtlijnen: "Nee, helemaal niet",
  informele_afspraken: "Informeel — er zijn mondelinge afspraken",
  basisbeleid: "Gedeeltelijk — er is een basisbeleid",
  formeel_ai_beleid: "Ja — er is een formeel AI-gebruiksbeleid",
  inclusief_toetsing: "Ja — inclusief toetsing en handhaving",
};

const EU_AI_ACT_LABELS: Record<string, string> = {
  nooit_gehoord: "Nog nooit van gehoord",
  gehoord_onbekend: "Gehoord van — maar weet niet wat het betekent",
  globaal_bekend: "Globaal bekend — moet er nog mee aan de slag",
  goed_bekend: "Goed bekend — al bezig met compliance",
  volledig_compliant: "Volledig compliant",
};

const AI_ZORG_LABELS: Record<string, string> = {
  dataveiligheid: "Dataveiligheid & privacy",
  banenverlies: "Impact op medewerkers",
  kwaliteitscontrole: "Kwaliteit & betrouwbaarheid",
  compliance: "Compliance & wetgeving",
  kosten: "Kosten & ROI",
  geen_zorgen: "Geen specifieke zorgen",
};

const MATURITY_LABELS: Record<string, string> = {
  geen_ai: "Geen — AI is een onbekend terrein",
  bewust: "Bewust — gehoord van AI maar nog niet mee gewerkt",
  experimenteel: "Experimenteel — enkele medewerkers gebruiken AI-tools",
  gevorderd: "Gevorderd — meerdere AI-tools in gebruik",
  expert: "Expert — AI is geïntegreerd in werkprocessen",
};

const BUDGET_LABELS: Record<string, string> = {
  laag: "Tot €5.000 per jaar",
  midden: "€5.000 – €25.000 per jaar",
  hoog: "Meer dan €25.000 per jaar",
};

const SNELHEID_LABELS: Record<string, string> = {
  direct: "Zo snel mogelijk",
  kwartaal: "Binnen dit kwartaal",
  jaar: "Op termijn verkennen",
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

  const urgentie = antwoorden.urgentie ? `${antwoorden.urgentie}/10` : "niet opgegeven";
  const risico = antwoorden.risicoOngecontroleerdAi ? `${antwoorden.risicoOngecontroleerdAi}/10` : "niet opgegeven";

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

**Wat is jouw functie binnen de organisatie?**
${label(ROL_LABELS, antwoorden.rol)}

**Hoe omschrijf je de digitale volwassenheid van jouw bedrijf?**
${label(TECHSTACK_LABELS, antwoorden.techStack)}

## Pijler 2 — Pijnpunten & urgentie
**Welke activiteiten kosten jullie de meeste tijd?**
${labelList(PIJNPUNT_LABELS, antwoorden.pijnpunten, "geen geselecteerd")}

**Hoeveel uur per week gaat er gemiddeld verloren aan repetitieve taken (per medewerker)?**
${label(UREN_LABELS, antwoorden.urenVerlies)}

**Hoe urgent voelt de behoefte aan procesverbetering en automatisering?**
${urgentie}

## Pijler 3 — Data, systemen & infrastructuur
**Welke software of systemen gebruiken jullie?**
${labelList(KERNAPP_LABELS, antwoorden.kernApplicaties)}

**Hoe is de kwaliteit en toegankelijkheid van jullie data?**
${label(DATA_KWALITEIT_LABELS, antwoorden.dataKwaliteit)}

**Hoe goed zijn jullie systemen met elkaar geïntegreerd?**
${label(SYSTEEM_INTEGRATIE_LABELS, antwoorden.systeemIntegratie)}

**Hoe is jullie IT-infrastructuur ingericht?**
${label(IT_INFRA_LABELS, antwoorden.itInfrastructuur)}

**Welke gevoelige data verwerkt jullie organisatie?**
${labelList(GEVOELIGE_DATA_LABELS, antwoorden.gevoeligeData)}

## Pijler 4 — Kennis, cultuur & governance
**Wat is het huidige kennisniveau van AI binnen jullie organisatie?**
${label(MATURITY_LABELS, antwoorden.aiMaturiteit)}

**Hoe staat het team tegenover AI en nieuwe technologie?**
${label(SENTIMENT_LABELS, antwoorden.teamSentiment)}

**Hoe betrokken is het management bij de AI-agenda?**
${label(MGMT_LABELS, antwoorden.managementBetrokkenheid)}

**Welke trainingsbehoeften zien jullie voor de medewerkers?**
${labelList(TRAINING_LABELS, antwoorden.trainingsbehoefte, "geen opgegeven")}

**Heeft jullie organisatie al richtlijnen voor het gebruik van AI-tools door medewerkers?**
${label(PRIVACY_LABELS, antwoorden.privacyBeleid)}

**Bent u bekend met de EU AI Act en de implicaties voor de organisatie?**
${label(EU_AI_ACT_LABELS, antwoorden.euAiActBekendheid)}

**Hoe groot wordt het risico van ongecontroleerd AI-gebruik ingeschat?**
${risico}

**Wat zijn jullie grootste zorgen bij AI-implementatie?**
${labelList(AI_ZORG_LABELS, antwoorden.aiZorgen, "geen specifieke zorgen")}

## Pijler 5 — AI-ambitie & contact
**Wat is het jaarlijkse budget voor AI-implementatie?**
${label(BUDGET_LABELS, antwoorden.budgetBereidheid)}

**Hoe snel willen jullie aan de slag met AI?**
${label(SNELHEID_LABELS, antwoorden.implementatieSnelheid)}

## Contactgegevens
- **Naam:** ${volledigeNaam}
- **Bedrijf:** ${lead.bedrijf}
- **E-mail:** ${lead.email}
- **Telefoon:** ${lead.telefoon ?? "niet opgegeven"}
- **Toestemming gegevensverwerking:** verleend op ${datum}`;
}

class TwentyDuplicateError extends Error {}

/**
 * Bron-attributie voor Twenty's `createdBy`-veld. Door dit expliciet mee te
 * sturen krijgt elke company/person/note in Twenty bovenaan
 * "Created by: Quickscan maisonblender.com" — onafhankelijk van welke
 * API-key gebruikt wordt. Dit voorkomt dat leads van andere integraties
 * (bv. de toegankelijkheidsaudit) per ongeluk als 'Quickscan' worden gelabeld.
 */
const CREATED_BY = {
  source: "API" as const,
  name: "Quickscan maisonblender.com",
} as const;

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

/**
 * Zoek een Twenty Person op email — probeert meerdere filter-syntaxes
 * omdat Twenty REST API verschilt per versie voor composite fields.
 */
async function zoekPersonOpEmail(
  baseUrl: string,
  apiKey: string,
  email: string
): Promise<string | null> {
  // Twenty REST filter syntax: filter=field.subfield[operator]:value
  // BELANGRIJK: filter[field][sub][op]=value syntax wordt door Twenty GENEGEERD
  // (geeft alle records terug) — niet gebruiken!
  const filterQuery = `filter=emails.primaryEmail[eq]:${encodeURIComponent(email)}`;

  try {
    const res = await twentyGET(baseUrl, apiKey, "people", filterQuery);
    const item = extractFirstItem(res);
    if (item) {
      const emails = item.emails as Record<string, unknown> | undefined;
      if (emails?.primaryEmail === email && !item.deletedAt && typeof item.id === "string") {
        console.log(`[CRM] ✓ Person gevonden via filter: ${email} (${item.id})`);
        return item.id;
      }
      if (emails?.primaryEmail !== email) {
        console.warn(`[CRM] Filter gaf verkeerde person (kreeg ${emails?.primaryEmail}). Skip.`);
      } else if (item.deletedAt) {
        console.warn(`[CRM] Person ${email} is soft-deleted (id=${item.id}). Hard-delete in Twenty UI nodig.`);
        return null;
      }
    }
  } catch (err) {
    console.warn(`[CRM] Filter-lookup faalde voor ${email}:`, err);
  }

  // Fallback: pagineer en match in code (Twenty filters zijn soms onbetrouwbaar voor composite fields)
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
                console.log(`[CRM] ✓ Person gevonden via fallback scan: ${email} (${it.id})`);
                return it.id;
              }
            }
          }
        }
      }
    }
    console.warn(`[CRM] Person ${email} niet in eerste 60 records — geen koppeling mogelijk`);
  } catch (err) {
    console.warn(`[CRM] Fallback person scan mislukt:`, err);
  }

  return null;
}

/** Haal het eerste record uit een Twenty REST list-response (incl. alle velden). */
function extractFirstItem(response: unknown): Record<string, unknown> | null {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown>;
  const data = r.data;
  if (!data || typeof data !== "object") return null;
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (Array.isArray(value) && value.length > 0) {
      const first = value[0];
      if (first && typeof first === "object") {
        return first as Record<string, unknown>;
      }
    }
  }
  return null;
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

    // 1a. Eerst zoeken op email-domain — meest unieke matcher.
    //    Filter syntax: filter=field.subfield[op]:value (NOOIT filter[a][b][op]=val).
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
          // Verifieer dat het record echt het juiste domein heeft
          if (dom?.primaryLinkUrl === emailDomain && !item.deletedAt && typeof item.id === "string") {
            companyId = item.id;
            console.log(`[CRM] Bestaande company hergebruikt op domain: ${emailDomain} (id=${companyId})`);
          } else {
            console.warn(`[CRM] Company filter retourneerde verkeerde match (verwacht domain ${emailDomain}, kreeg ${dom?.primaryLinkUrl}). Genegeerd.`);
          }
        }
      } catch {
        // lookup-fout is niet fataal, we maken zo nodig een nieuwe company
      }
    }

    // 1b. Geen bestaande gevonden → nieuwe company aanmaken
    if (!companyId) {
      const companyBody: Record<string, unknown> = {
        name: lead.bedrijf,
        createdBy: CREATED_BY,
      };
      if (emailDomain) {
        companyBody.domainName = { primaryLinkUrl: emailDomain };
      }
      try {
        console.log(`[CRM] → POST /companies body=${JSON.stringify(companyBody)}`);
        const companyRes = await twentyREST(baseUrl, apiKey, "companies", companyBody);
        companyId = extractId(companyRes, "companies");
        if (companyId) {
          console.log(`[CRM] ✓ Company aangemaakt: ${lead.bedrijf} (${companyId})`);
        } else {
          console.warn(`[CRM] ⚠️  Company POST 200 zonder id, response:`, JSON.stringify(companyRes).slice(0, 500));
        }
      } catch (err) {
        if (err instanceof TwentyDuplicateError) {
          console.warn(`[CRM] Company duplicate hint van Twenty: ${err.message.slice(0, 250)}`);
          // Twenty matched op iets anders (bijv. naam) — zoek nogmaals op naam
          try {
            const existing = await twentyGET(
              baseUrl,
              apiKey,
              "companies",
              `filter=name[eq]:${encodeURIComponent(lead.bedrijf)}`
            );
            companyId = extractFirstId(existing);
            if (companyId) {
              console.log(`[CRM] ✓ Company hergebruikt op naam: ${lead.bedrijf} (${companyId})`);
            } else {
              console.warn(`[CRM] ⚠️  Company duplicate maar lookup leeg — Twenty lijkt soft-deleted/ghost record te hebben. Probeer hard-delete via Twenty Settings → Data Model.`);
            }
          } catch (lookupErr) {
            console.warn("[CRM] Company duplicate + lookup mislukt:", lookupErr);
          }
        } else {
          console.warn("[CRM] ✗ Company aanmaken mislukt:", err);
        }
      }
    }

    // 2. Person aanmaken — of bestaande hergebruiken bij duplicate
    const personBody: Record<string, unknown> = {
      name: { firstName: lead.voornaam, lastName: lead.achternaam },
      emails: { primaryEmail: lead.email },
      jobTitle: antwoorden.rol ?? "",
      createdBy: CREATED_BY,
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
      console.log(`[CRM] → POST /people body=${JSON.stringify(personBody).slice(0, 300)}`);
      const personRes = await twentyREST(baseUrl, apiKey, "people", personBody);
      personId = extractId(personRes, "people");
      if (personId) {
        console.log(`[CRM] ✓ Person aangemaakt: ${lead.email} (${personId})`);
      } else {
        console.warn(`[CRM] ⚠️  Person POST 200 zonder id, response:`, JSON.stringify(personRes).slice(0, 500));
      }
    } catch (err) {
      if (err instanceof TwentyDuplicateError) {
        console.warn(`[CRM] Person duplicate hint van Twenty: ${err.message.slice(0, 250)}`);
        personId = await zoekPersonOpEmail(baseUrl, apiKey, lead.email);
      } else {
        console.warn(`[CRM] ✗ Person aanmaken faalde (geen duplicate):`, err);
        throw err;
      }
    }

    if (!personId) {
      console.warn(`[CRM] ⚠️  Person voor ${lead.email} niet aangemaakt en niet gevonden — note overgeslagen. Tip: check Twenty UI Trash & Settings → Data Model voor ghost records.`);
      return;
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
      createdBy: CREATED_BY,
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

  // Twenty noteTarget velden: noteId + targetPersonId / targetCompanyId / targetOpportunityId.
  // (Twenty gebruikt "target" prefix omdat noteTarget polymorf naar meerdere entiteiten linkt.)
  await koppelNoteTarget(baseUrl, apiKey, noteId, "person", personId, title);
  if (companyId) {
    await koppelNoteTarget(baseUrl, apiKey, noteId, "company", companyId, title);
  }

  console.log(`[CRM] ✓ Note "${title}" gekoppeld (note=${noteId}, person=${personId}, company=${companyId ?? "geen"})`);
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
    console.warn(`[CRM] Note→${relType} koppeling mislukt (${context}):`, err);
  }
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

  // Person opzoeken via email (robuste lookup met meerdere filter-shapes)
  const personId = await zoekPersonOpEmail(baseUrl, apiKey, email);
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
