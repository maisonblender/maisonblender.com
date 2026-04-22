import type { ScanAntwoorden, ScanResultaat } from "./types";

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
  anders: "Andere activiteiten",
};

const MATURITY_LABELS: Record<string, string> = {
  geen_ai: "Geen AI in gebruik — onbekend terrein",
  bewust: "Bewust van AI maar nog geen ervaring",
  experimenteel: "Experimenteert — enkele medewerkers gebruiken AI-tools",
  gevorderd: "Gevorderd — meerdere AI-tools in gebruik",
  expert: "Expert — AI is geïntegreerd in werkprocessen",
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
  weet_niet: "Onbekend / geen zicht op infrastructuur",
};

const PRIVACY_LABELS: Record<string, string> = {
  geen_richtlijnen: "Geen richtlijnen — medewerkers gebruiken tools naar eigen inzicht",
  informele_afspraken: "Informeel — alleen mondelinge afspraken",
  basisbeleid: "Gedeeltelijk — er is een basisbeleid",
  formeel_ai_beleid: "Formeel AI-gebruiksbeleid aanwezig",
  inclusief_toetsing: "Formeel beleid inclusief toetsing en handhaving",
};

const EU_AI_ACT_LABELS: Record<string, string> = {
  nooit_gehoord: "Nog nooit van gehoord",
  gehoord_onbekend: "Gehoord van — maar weet niet wat het betekent",
  globaal_bekend: "Globaal bekend — moet er nog mee aan de slag",
  goed_bekend: "Goed bekend — al bezig met compliance",
  volledig_compliant: "Volledig compliant",
};

const SENTIMENT_LABELS: Record<string, string> = {
  enthousiast: "Enthousiast & nieuwsgierig",
  verdeeld: "Verdeeld — deel enthousiast, deel sceptisch",
  sceptisch: "Overwegend sceptisch of weerstand",
  onbekend: "Onbekend — niet gemeten",
};

const MGMT_LABELS: Record<string, string> = {
  niet_betrokken: "Niet betrokken — AI staat niet op de agenda",
  bewust: "Bewust — erkent het belang maar geen actie",
  geinteresseerd: "Geïnteresseerd — verkennende fase",
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

const UREN_LABELS: Record<string, string> = {
  "<2": "minder dan 2 uur per medewerker per week",
  "2-5": "2 tot 5 uur per medewerker per week",
  "5-10": "5 tot 10 uur per medewerker per week (significant)",
  "10-20": "10 tot 20 uur per medewerker per week (hoog potentieel)",
  ">20": "meer dan 20 uur per medewerker per week (urgent)",
};

const GEVOELIGE_DATA_LABELS: Record<string, string> = {
  klantgegevens: "Klantgegevens & contactinformatie",
  financieel: "Financiële gegevens",
  medisch: "Medische / gezondheidsgegevens (AVG art. 9)",
  personeel: "Personeelsgegevens",
  juridisch: "Juridische documenten & contracten",
  intellectueel_eigendom: "Intellectueel eigendom & bedrijfsgeheimen",
  minderjarigen: "Gegevens van minderjarigen",
  geen: "Geen bijzondere categorieën",
};

const TECHSTACK_LABELS: Record<string, string> = {
  geen_systemen: "Voornamelijk handmatige processen — weinig digitale systemen",
  basis_office: "Basis Office & e-mail (Microsoft 365 of Google Workspace)",
  erp_crm: "ERP en/of CRM systeem in gebruik",
  cloud_first: "Cloud-first & API-gedreven (moderne integraties)",
  al_ai_gebruik: "Al AI in gebruik (ChatGPT, Copilot of eigen tools)",
};

const KERNAPP_LABELS: Record<string, string> = {
  microsoft365: "Microsoft 365 (Teams, SharePoint, Outlook, Office)",
  google_workspace: "Google Workspace (Gmail, Drive, Docs)",
  exact: "Exact (ERP / boekhouding)",
  afas: "AFAS (ERP / HR / financiën)",
  sap: "SAP (enterprise resource planning)",
  salesforce: "Salesforce (CRM)",
  hubspot: "HubSpot (CRM & marketing automation)",
  shopify: "Shopify (e-commerce)",
  magento: "Magento / Adobe Commerce (e-commerce)",
  woocommerce: "WooCommerce (e-commerce op WordPress)",
  lightspeed: "Lightspeed (POS & e-commerce)",
  mailchimp: "Mailchimp (e-mail marketing)",
  klaviyo: "Klaviyo (e-mail & SMS marketing)",
  asana_monday: "Asana / Monday / ClickUp (projectmanagement)",
  slack_teams: "Slack / MS Teams (communicatie)",
  powerbi_tableau: "Power BI / Tableau / Looker (BI)",
  branche_specifiek: "Branchespecifieke software",
  eigen_maatwerk: "Eigen / maatwerk software",
  anders: "Andere software",
  geen: "Geen specifieke systemen — voornamelijk spreadsheets / handmatig",
};

const AI_ZORG_LABELS: Record<string, string> = {
  dataveiligheid: "Dataveiligheid & privacy",
  banenverlies: "Impact op medewerkers / banenverlies",
  kwaliteitscontrole: "Kwaliteit & betrouwbaarheid AI-output",
  compliance: "Compliance & wetgeving (AVG, EU AI Act)",
  kosten: "Kosten & ROI onzeker",
  geen_zorgen: "Geen specifieke zorgen",
};

const BUDGET_LABELS: Record<string, string> = {
  laag: "Tot €5.000 per jaar — kleine investering, focus op quick wins",
  midden: "€5.000 – €25.000 per jaar — serieuze implementatie met meerdere use cases",
  hoog: "Meer dan €25.000 per jaar — strategisch AI-programma op organisatieniveau",
};

const SNELHEID_LABELS: Record<string, string> = {
  direct: "Zo snel mogelijk — direct aan de slag",
  kwartaal: "Binnen dit kwartaal — bewuste, geplande aanpak",
  jaar: "Op termijn verkennen — oriëntatiefase",
};

function urgentieLabel(score: number | undefined): string {
  if (!score) return "niet opgegeven";
  if (score >= 8) return `${score}/10 — zeer urgent`;
  if (score >= 6) return `${score}/10 — duidelijk urgent`;
  if (score >= 4) return `${score}/10 — gemiddelde urgentie`;
  return `${score}/10 — lage urgentie`;
}

function risicoLabel(score: number | undefined): string {
  if (!score) return "niet opgegeven";
  if (score >= 8) return `${score}/10 — zeer hoog risico`;
  if (score >= 6) return `${score}/10 — hoog risico`;
  if (score >= 4) return `${score}/10 — gemiddeld risico`;
  return `${score}/10 — laag risico`;
}

export function buildAnalysePrompt(
  antwoorden: ScanAntwoorden,
  resultaat: ScanResultaat,
  klant?: { bedrijf?: string }
): string {
  const bedrijfsnaam = klant?.bedrijf?.trim() || "";
  const pijnpuntenTekst = antwoorden.pijnpunten
    .map((p) => `- ${PIJNPUNT_LABELS[p] ?? p}`)
    .join("\n");

  const kansenTekst = resultaat.topKansen
    .map(
      (k, i) =>
        `${i + 1}. ${k.functie}: €${k.roiEurosPerJaar.toLocaleString("nl-NL")} potentieel/jaar, ${k.tijdsbesparing} uur/week besparing`
    )
    .join("\n");

  const applicatiesTekst =
    (antwoorden.kernApplicaties ?? []).map((a) => KERNAPP_LABELS[a] ?? a).join(", ") || "niet opgegeven";
  const gevoeligeDataTekst =
    (antwoorden.gevoeligeData ?? []).map((d) => GEVOELIGE_DATA_LABELS[d] ?? d).join(", ") || "niet opgegeven";
  const aiZorgenTekst =
    (antwoorden.aiZorgen ?? []).map((z) => AI_ZORG_LABELS[z] ?? z).join(", ") || "geen specifieke zorgen";
  const trainingTekst =
    (antwoorden.trainingsbehoefte ?? []).map((t) => TRAINING_LABELS[t] ?? t).join(", ") || "niet opgegeven";

  return `Je bent een expert AI-strateeg van MAISON BLNDR. Je analyseert een uitgebreid bedrijfsprofiel en geeft een gepersonaliseerde, diepgaande maar toegankelijke AI-readiness analyse. Begin direct met de inhoud — geen titels, geen aanhef, geen "Opgesteld door" regels.

${bedrijfsnaam ? `KLANT: ${bedrijfsnaam} — gebruik deze bedrijfsnaam expliciet in de analyse (minimaal 2-3 keer), zodat het persoonlijk en gericht voelt.\n\n` : ""}BEDRIJFSPROFIEL:
- Sector: ${SECTOR_LABELS[antwoorden.sector] ?? antwoorden.sector}
- Omvang: ${antwoorden.omvang} medewerkers
- Functie contactpersoon: ${ROL_LABELS[antwoorden.rol] ?? antwoorden.rol}
- Digitale volwassenheid: ${TECHSTACK_LABELS[antwoorden.techStack] ?? antwoorden.techStack}

PIJNPUNTEN, TIJDVERLIES & URGENTIE:
${pijnpuntenTekst}
- Tijdsverlies aan repetitief werk: ${UREN_LABELS[antwoorden.urenVerlies ?? "5-10"]}
- Urgentie van procesverbetering: ${urgentieLabel(antwoorden.urgentie)}

DATA, SYSTEMEN & INFRASTRUCTUUR:
- Kernapplicaties: ${applicatiesTekst}
- Datakwaliteit: ${DATA_KWALITEIT_LABELS[antwoorden.dataKwaliteit] ?? antwoorden.dataKwaliteit}
- Systeem-integratie: ${SYSTEEM_INTEGRATIE_LABELS[antwoorden.systeemIntegratie] ?? antwoorden.systeemIntegratie}
- IT-infrastructuur: ${IT_INFRA_LABELS[antwoorden.itInfrastructuur] ?? antwoorden.itInfrastructuur}
- Gevoelige data aanwezig: ${gevoeligeDataTekst}

KENNIS, CULTUUR & GOVERNANCE:
- Huidige AI-maturiteit: ${MATURITY_LABELS[antwoorden.aiMaturiteit] ?? antwoorden.aiMaturiteit}
- Team sentiment: ${SENTIMENT_LABELS[antwoorden.teamSentiment ?? "onbekend"]}
- Management betrokkenheid: ${MGMT_LABELS[antwoorden.managementBetrokkenheid] ?? antwoorden.managementBetrokkenheid}
- Trainingsbehoeften: ${trainingTekst}
- AI-gebruiksbeleid: ${PRIVACY_LABELS[antwoorden.privacyBeleid] ?? antwoorden.privacyBeleid}
- Bekendheid EU AI Act: ${EU_AI_ACT_LABELS[antwoorden.euAiActBekendheid] ?? antwoorden.euAiActBekendheid}
- Risico ongecontroleerd AI-gebruik: ${risicoLabel(antwoorden.risicoOngecontroleerdAi)}
- Grootste zorgen bij AI: ${aiZorgenTekst}
- Governance risico (berekend): ${resultaat.governanceRisico}
- Cultuur readiness (berekend): ${resultaat.cultuurReadiness}

AI AMBITIE:
- Budget bereidheid: ${BUDGET_LABELS[antwoorden.budgetBereidheid] ?? antwoorden.budgetBereidheid}
- Gewenste implementatiesnelheid: ${SNELHEID_LABELS[antwoorden.implementatieSnelheid] ?? antwoorden.implementatieSnelheid}

BEREKENDE SCAN-UITKOMSTEN:
- AI Readiness Score: ${resultaat.aiReadinessScore}/100 (${resultaat.scoreLabel})
- Benchmark: beter dan ${resultaat.benchmarkPercentiel}% van vergelijkbare bedrijven
- Sectorgemiddelde: ${resultaat.sectorBenchmark}/100
- Totaal ROI potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
- Tijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week

TOP AI-KANSEN:
${kansenTekst}

TAAK: Schrijf een gestructureerde, gepersonaliseerde AI-analyse in het Nederlands. Wees concreet, enthousiast maar zakelijk. Gebruik de specifieke bedrijfsgegevens. Maximaal 550 woorden.

Structuur:
1. **Korte bedrijfsdiagnose** (2-3 zinnen): Wat zegt dit profiel over de AI-gereedheid?
2. **Grootste AI-kans** (3-4 zinnen): De meest impactvolle eerste stap, met concrete cijfers uit de scan.
3. **Data, systemen & infrastructuur** (2-3 zinnen): Wat betekenen datakwaliteit, integratie en infra-keuze voor implementatiesnelheid en complexiteit?
4. **Cultuur, kennis & training** (2-3 zinnen): Is het team klaar? Welke trainingsbehoeften vragen aandacht? Hoe sturend is het management?
5. **Governance & risico** (2-3 zinnen): Wat betekent het privacy-beleid + bekendheid met de EU AI Act + ingeschat risico voor de roadmap?
6. **Aanbevolen eerste stap** (2 zinnen): Concreet en actionabel — wat doen ze als allereerste?

Schrijf alsof je rechtstreeks tegen de ondernemer praat. Gebruik "je"${bedrijfsnaam ? ` en noem expliciet "${bedrijfsnaam}" een paar keer in de tekst (niet in elke zin, maar wel duidelijk gericht op dit specifieke bedrijf)` : ' en "jouw bedrijf"'}. Benoem specifieke sectornuances.`;
}

export function buildActieplanPrompt(
  antwoorden: ScanAntwoorden,
  resultaat: ScanResultaat,
  klant?: { naam?: string; bedrijf?: string }
): string {
  const klantNaam = klant?.bedrijf ?? klant?.naam ?? "het bedrijf";
  const aanhef = klant?.naam ? klant.naam : "de ondernemer";

  const pijnpuntenTekst =
    antwoorden.pijnpunten.map((p) => PIJNPUNT_LABELS[p] ?? p).join(", ") || "niet opgegeven";
  const applicatiesTekst =
    (antwoorden.kernApplicaties ?? []).map((a) => KERNAPP_LABELS[a] ?? a).join(", ") || "niet gespecificeerd";
  const gevoeligeDataTekst =
    (antwoorden.gevoeligeData ?? []).map((d) => GEVOELIGE_DATA_LABELS[d] ?? d).join(", ") || "niet opgegeven";
  const aiZorgenTekst =
    (antwoorden.aiZorgen ?? []).map((z) => AI_ZORG_LABELS[z] ?? z).join(", ") || "geen specifieke zorgen";
  const trainingTekst =
    (antwoorden.trainingsbehoefte ?? []).map((t) => TRAINING_LABELS[t] ?? t).join(", ") || "niet opgegeven";
  const sentimentTekst = SENTIMENT_LABELS[antwoorden.teamSentiment ?? "onbekend"];
  const mgmtTekst = MGMT_LABELS[antwoorden.managementBetrokkenheid] ?? antwoorden.managementBetrokkenheid;

  return `Je bent een senior AI-strateeg van MAISON BLNDR (het adviesbureau). Je schrijft een professioneel AI Actieplan voor een KLANT. MAISON BLNDR is de adviseur — NIET de klant. Begin DIRECT met de Executive Summary. Voeg GEEN titel zoals "AI Actieplan — [bedrijf]", GEEN "Opgesteld door" regel, GEEN "Ter attentie van" toe en eindig NIET met een zin als "Neem contact op via MAISON BLNDR".

KLANT: ${klantNaam} (contactpersoon: ${aanhef})

BEDRIJFSPROFIEL KLANT:
- Sector: ${SECTOR_LABELS[antwoorden.sector] ?? antwoorden.sector}
- Omvang: ${antwoorden.omvang} medewerkers
- Functie contactpersoon: ${ROL_LABELS[antwoorden.rol] ?? antwoorden.rol}
- Digitale volwassenheid: ${TECHSTACK_LABELS[antwoorden.techStack] ?? antwoorden.techStack}

PIJNPUNTEN, TIJDVERLIES & URGENTIE:
- Belangrijkste pijnpunten: ${pijnpuntenTekst}
- Tijdsverlies aan handmatig werk: ${UREN_LABELS[antwoorden.urenVerlies ?? "5-10"]}
- Urgentie procesverbetering: ${urgentieLabel(antwoorden.urgentie)}

DATA, SYSTEMEN & INFRASTRUCTUUR:
- Huidige systemen: ${applicatiesTekst}
- Datakwaliteit: ${DATA_KWALITEIT_LABELS[antwoorden.dataKwaliteit] ?? antwoorden.dataKwaliteit}
- Systeem-integratie: ${SYSTEEM_INTEGRATIE_LABELS[antwoorden.systeemIntegratie] ?? antwoorden.systeemIntegratie}
- IT-infrastructuur: ${IT_INFRA_LABELS[antwoorden.itInfrastructuur] ?? antwoorden.itInfrastructuur}
- Gevoelige data aanwezig: ${gevoeligeDataTekst}

KENNIS, CULTUUR & GOVERNANCE:
- AI maturiteit: ${MATURITY_LABELS[antwoorden.aiMaturiteit] ?? antwoorden.aiMaturiteit}
- Team sentiment: ${sentimentTekst}
- Management betrokkenheid: ${mgmtTekst}
- Trainingsbehoeften: ${trainingTekst}
- AI-gebruiksbeleid: ${PRIVACY_LABELS[antwoorden.privacyBeleid] ?? antwoorden.privacyBeleid}
- Bekendheid EU AI Act: ${EU_AI_ACT_LABELS[antwoorden.euAiActBekendheid] ?? antwoorden.euAiActBekendheid}
- Risico ongecontroleerd AI-gebruik: ${risicoLabel(antwoorden.risicoOngecontroleerdAi)}
- Grootste zorgen: ${aiZorgenTekst}
- Governance risico (berekend): ${resultaat.governanceRisico}
- Cultuur readiness (berekend): ${resultaat.cultuurReadiness}

AI AMBITIE:
- Budget bereidheid: ${BUDGET_LABELS[antwoorden.budgetBereidheid] ?? antwoorden.budgetBereidheid}
- Gewenste implementatiesnelheid: ${SNELHEID_LABELS[antwoorden.implementatieSnelheid] ?? antwoorden.implementatieSnelheid}

BEREKENDE SCAN-UITKOMSTEN:
- AI Score: ${resultaat.aiReadinessScore}/100 (${resultaat.scoreLabel})
- Benchmark: beter dan ${resultaat.benchmarkPercentiel}% van de sector (sectorgemiddelde ${resultaat.sectorBenchmark}/100)
- ROI potentieel: €${resultaat.roiTotaal.toLocaleString("nl-NL")}/jaar
- Tijdsbesparing: ${resultaat.tijdsbesparingTotaal} uur/week

Schrijf een professioneel AI Actieplan (ca. 950 woorden) voor ${klantNaam}. Gebruik de bedrijfsnaam "${klantNaam}" expliciet door de tekst heen (minimaal 5-8 keer verspreid over de secties) zodat het persoonlijk en gericht voelt. Wissel af met "je/jouw bedrijf". Noem MAISON BLNDR alleen als adviseur/uitvoerder.

## Executive Summary
[3 zinnen over de huidige situatie, het grootste potentieel en de urgentie voor ${klantNaam}]

## AI Readiness Positie
[Score, benchmark, wat dit betekent voor de concurrentiepositie in de sector]

## Top 3 Quick Wins
${resultaat.topKansen.map((k, i) => `### ${i + 1}. ${k.functie}\n[Concrete aanpak op basis van huidige systemen van ${klantNaam}, tijdlijn, verwacht resultaat: €${k.roiEurosPerJaar.toLocaleString("nl-NL")}/jaar en ${k.tijdsbesparing}u/week besparing]`).join("\n\n")}

## Data, Integratie & Infrastructuur
[Wat de huidige datakwaliteit, systeem-integratie en IT-infrastructuur betekenen voor de implementatievolgorde — wat kan direct, wat vraagt voorbereiding?]

## Governance, Privacy & EU AI Act Roadmap
[Concrete stappen voor ${klantNaam} om AI veilig en compliant in te zetten, afgestemd op het governance risico (${resultaat.governanceRisico}), het huidige AI-gebruiksbeleid en de bekendheid met de EU AI Act. Adresseer ook het ingeschatte risico van ongecontroleerd AI-gebruik.]

## Change Management, Kennis & Training
[Aanpak voor team adoptie gegeven het sentiment "${sentimentTekst}" en management betrokkenheid "${mgmtTekst}". Vertaal de specifieke trainingsbehoeften (${trainingTekst}) naar een concreet trainingsprogramma. Houd rekening met budget (${BUDGET_LABELS[antwoorden.budgetBereidheid] ?? antwoorden.budgetBereidheid}) en gewenste implementatiesnelheid (${SNELHEID_LABELS[antwoorden.implementatieSnelheid] ?? antwoorden.implementatieSnelheid}).]

## 90-Dagen Roadmap
[Week 1-4: Quick win selectie en voorbereiding | Week 5-8: Eerste implementatie | Week 9-12: Evaluatie en opschaling]

## Investering & Rendement
Toon dit verplicht als een markdown-tabel in exact deze vorm (vul de bedragen specifiek voor ${klantNaam} in op basis van de scanresultaten — geen placeholders):

| Post | Bedrag |
|---|---|
| Verwacht jaarrendement | €[bedrag] |
| Tijdsbesparing | [uur]/week (~[uur*52] uur/jaar) |
| Geschatte implementatiekosten | €[laag]–€[hoog] éénmalig |
| Terugverdientijd | [aantal] tot [aantal] maanden |

Voeg na de tabel één korte alinea (max 2 zinnen) toe met de businesscase-context voor ${klantNaam}.

## Volgende Stap
[Concrete eerste actie voor ${klantNaam} — wat doen ze morgen? Plan een strategiegesprek met MAISON BLNDR.]

Schrijf in het Nederlands, professioneel maar toegankelijk. Gebruik concrete getallen uit de scan.`;
}
