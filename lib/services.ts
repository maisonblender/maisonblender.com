export interface ServiceSection {
  id: string;   // anchor id (no #), e.g. "lead-generatie"
  title: string;
  content: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  longDescription: string[];
  benefits: string[];
  useCases: string[];
  technologies: string[];
  sections?: ServiceSection[];
  heroImage?: { src: string; alt: string };
  jsonLdId: string;
  jsonLdServiceType: string;
}

export const services: Service[] = [
  {
    id: "01",
    slug: "ai-chatbots-klantenservice",
    title: "AI Chatbots & Klantenservice",
    subtitle: "Klanten krijgen antwoord. Je team houdt tijd over.",
    description:
      "Klanten willen nu antwoord, niet morgen. Wij bouwen agents voor web, WhatsApp en mail die veel vragen zelf afhandelen en alleen doorzetten als het echt nodig is.",
    tags: ["Conversational AI", "WhatsApp & web chat", "Lead generatie", "Omnichannel"],
    metaTitle: "AI Chatbots & Klantenservice - MAISON BLNDR | 24/7 Geautomatiseerde Klantinteractie",
    metaDescription:
      "Automatiseer tot 90% van je klantenservice met intelligente AI-chatbots. MAISON BLNDR bouwt conversational AI-agents voor web, WhatsApp en e-mail. Actief in Sittard, Maastricht en heel Limburg.",
    keywords: [
      "AI chatbot klantenservice",
      "WhatsApp chatbot zakelijk",
      "conversational AI Limburg",
      "AI klantenservice automatisering",
      "chatbot integratie",
      "lead kwalificatie AI",
      "24/7 klantenservice automatiseren",
    ],
    longDescription: [
      "Geen knoppen-chatbot die je naar een FAQ stuurt. Deze agents begrijpen wat je klant bedoelt, zoeken in je CRM, kennisbank of productcatalogus, en geven een concreet antwoord. Ook als de vraag niet in het script staat.",
      "Afspraken inplannen, offertes maken, klachten registreren, leads kwalificeren: dat kan zonder tussenkomst. Moet er een mens bij? Dan schakelt de agent over met het volledige gesprek erbij.",
      "Klanten halen gemiddeld 70–90% van de herhalende vragen van hun team af. Wat overblijft zijn de gesprekken waar een mens echt verschil maakt.",
      "Wij doen de implementatie: trainen op jouw producten, koppelen aan CRM of helpdesk, en beheer na livegang.",
    ],
    benefits: [
      "70–90% minder herhalende vragen",
      "Bereikbaar ook 's avonds en in het weekend",
      "Leads gekwalificeerd en doorgestuurd naar sales",
      "Eén agent op web, WhatsApp en e-mail",
      "Doorlopend beheer en verbetering door ons",
    ],
    useCases: [
      "Veelgestelde vragen automatisch beantwoorden",
      "Afspraken inplannen via chat",
      "Leads kwalificeren en doorsturen naar sales",
      "Klachten registreren en routeren",
      "Productinformatie en beschikbaarheid opvragen",
    ],
    technologies: ["OpenAI", "Anthropic Claude", "WhatsApp Business API", "Zendesk", "HubSpot"],
    sections: [
      {
        id: "lead-generatie",
        title: "Lead generatie",
        content:
          "Een contactformulier wacht af tot iemand invult. Een AI-agent start het gesprek: wat zoek je, wat is het budget, hoe urgent is het? Gewone taal, geen verhoor. Warme leads gaan naar de juiste salesmedewerker met context erbij. In onze implementaties zien we gemiddeld 35–60% meer qualified leads vanaf de website.",
      },
      {
        id: "omnichannel",
        title: "Omnichannel",
        content:
          "WhatsApp, e-mail, telefoon: klanten wisselen van kanaal en moeten zich steeds opnieuw voorstellen. Wij bouwen agents die context meenemen over web, WhatsApp, e-mail en telefoon. Klanthistorie staat overal klaar. Je team hoeft niet opnieuw te beginnen.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-chatbots-klantenservice#service",
    heroImage: { src: "/images/service-ai-chatbots.png", alt: "AI chatbot interface met chat bubbles op smartphone en desktop - AI-gestuurde klantenservice automatisering voor bedrijven in Limburg" },
    jsonLdServiceType: "Conversational AI & Klantenservice Automatisering",
  },
  {
    id: "02",
    slug: "ai-agents-procesautomatisering",
    title: "AI Agents & Procesautomatisering",
    subtitle: "Niet alleen lezen. Ook doen.",
    description:
      "Agents die mail lezen, documenten verwerken en acties zetten in je CRM of ERP. Zonder dat iemand elke stap handmatig afvinkt.",
    tags: ["Multi-agent orkestratie", "Documentverwerking", "CRM/ERP-koppelingen", "Taakuitvoering"],
    metaTitle: "AI Agents & Procesautomatisering - MAISON BLNDR | Intelligente Agents voor Je Bedrijf",
    metaDescription:
      "Custom AI-agents die zelfstandig taken uitvoeren: documenten verwerken, e-mails interpreteren, acties in CRM en ERP. 24/7 operationeel. MAISON BLNDR, AI-bureau in Limburg.",
    keywords: [
      "AI agents procesautomatisering",
      "intelligente automatisering",
      "custom AI agents bedrijf",
      "documentverwerking AI",
      "CRM automatisering",
      "ERP koppeling AI",
      "multi-agent systemen",
    ],
    longDescription: [
      "Een agent leest inkomende mail, haalt data op uit je systemen en zet acties: offerte in ERP, taak in je projecttool, antwoord naar de klant. Zonder dat iemand elke stap afvinkt.",
      "Complexe taken? Escalatie naar een collega. Drukte? Meer capaciteit. Fout? Signaal, niet stil falen.",
      "Handig bij veel herhaalwerk: een makelaar die bezichtigingen plant en dossiers bijwerkt, of een logistiek bedrijf dat vrachtbrieven verwerkt en afwijkingen doorgeeft.",
      "We bouwen op maat op jouw processen en systemen. Schaalbaar en beveiligd, meegroeien met je organisatie.",
    ],
    benefits: [
      "Taken 24/7 zonder handmatige stappen",
      "Koppeling met CRM, ERP en overige systemen",
      "Meerdere agents parallel bij piekbelasting",
      "Audittrail van elke agent-actie",
      "Consistente verwerking, minder fouten",
    ],
    useCases: [
      "E-mailverwerking en automatische acties",
      "Offertes genereren vanuit inkomende aanvragen",
      "Dossiers en contracten bijhouden",
      "Inkooporders verwerken en goedkeuringen routeren",
      "Klantenportfolio monitoren en alerting",
    ],
    technologies: ["LangChain", "Anthropic Claude", "OpenAI", "Microsoft Azure AI", "n8n"],
    sections: [
      {
        id: "multi-agent",
        title: "Multi-agent orkestratie",
        content:
          "Bij complexe processen werken meerdere gespecialiseerde agents samen. Eén classificeert de mail, een tweede haalt CRM-data op, een derde voert de actie uit. Een orchestrator stuurt aan. We bouwen dit met LangChain en AutoGen: elke agent heeft een duidelijke rol, fouten worden opgevangen. Bij drukte schaal je instanties op. Ideaal als nu meerdere mensen dezelfde meerstapsflow doen.",
      },
      {
        id: "documentverwerking",
        title: "Intelligente documentverwerking",
        content:
          "Meer dan OCR: het systeem begrijpt wat een document is. Offerte of contract, afwijking ten opzichte van standaard, relevante velden in context. Offerteaanvragen, leverancierscontracten, belastingstukken, medische dossiers: elk type op maat. Data gaat direct naar CRM, ERP of je DMS.",
      },
      {
        id: "taakuitvoering",
        title: "Autonome taakuitvoering",
        content:
          "Niet alleen data lezen, ook handelen. Classificeren, taak in Asana, Slack-notificatie, follow-up na 48 uur zonder reactie. Agents krijgen een vaste set acties en kiezen wat past bij de situatie. Alles in de audittrail.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-agents-procesautomatisering#service",
    heroImage: { src: "/images/service-ai-agents.png", alt: "Autonome AI agents die taken uitvoeren: documenten verwerken, CRM-koppelingen en e-mail automatisering voor bedrijven in Limburg" },
    jsonLdServiceType: "AI Agents & Intelligente Procesautomatisering",
  },
  {
    id: "03",
    slug: "rpa-workflow-integraties",
    title: "RPA & Workflow-integraties",
    subtitle: "Stop met copy-pasten tussen systemen.",
    description:
      "Facturen, orders, rapporten: wat nu tussen schermen heen en weer gaat, laten we lopen. Ook als er geen API is. Wij bouwen en beheren het.",
    tags: ["Robotic Process Automation", "API-integraties", "Factuurverwerking", "Schermautomatisering"],
    metaTitle: "RPA & Workflow-integraties - MAISON BLNDR | Robotic Process Automation Limburg",
    metaDescription:
      "Automatiseer repetitieve schermtaken en verbind je systemen met RPA. MAISON BLNDR implementeert robuuste workflow-automatisering met n8n, Make.com en Zapier. Volledig beheerd in Limburg.",
    keywords: [
      "RPA automatisering Limburg",
      "robotic process automation",
      "workflow integraties",
      "API koppeling bedrijf",
      "n8n automatisering",
      "Make.com integraties",
      "factuurverwerking automatiseren",
    ],
    longDescription: [
      "Facturen van mail naar boekhouding, data tussen systemen kopiëren, rapporten uit meerdere bronnen: werk dat zelden handmatig hoeft. RPA pakt dat structureel op.",
      "We automatiseren schermhandelingen alsof er iemand achter de computer zit, maar sneller en zonder typfouten. Met n8n, Make.com en Zapier voor workflows, plus Python waar het complexer wordt.",
      "Ook API-koppelingen: webshop en magazijn, orders zonder dubbele invoer, systemen die eindelijk dezelfde data delen.",
      "Voor MKB in Limburg vaak de snelste winst: korte implementatie, zichtbare ROI, geen vervanging van bestaande pakketten. Bij updates of proceswijzigingen passen wij de robots aan.",
    ],
    benefits: [
      "Uren per week besparen op handmatige dataverwerking",
      "Foutloos: geen typfouten of vergeten stappen meer",
      "Snelle implementatie, directe ROI",
      "Volledig beheerd: wij houden de robots draaiende",
      "Schaalbaar: van één proces tot tientallen workflows",
    ],
    useCases: [
      "Facturen verwerken en boeken",
      "Bestellingen synchroniseren tussen systemen",
      "Rapportages automatisch samenstellen",
      "HR-onboarding workflows automatiseren",
      "Voorraad- en inkoopbeheer koppelen",
    ],
    technologies: ["n8n", "Make.com", "Zapier", "Python", "REST API-integraties"],
    sections: [
      {
        id: "api-integraties",
        title: "API-integraties op maat",
        content:
          "Systemen praten via API's. Bestelling in de webshop triggert ERP, nieuw CRM-contact wordt een taak in je projecttool, goedgekeurd verlof past de planning aan. REST en GraphQL, vaak via n8n of Make.com. Foutafhandeling, retries en alerts ingebouwd. API-wijzigingen? Dat valt onder ons beheer.",
      },
      {
        id: "schermautomatisering",
        title: "Schermautomatisering (UI automation)",
        content:
          "Geen API? Dan de UI. De robot klikt, typt en vult in zoals een medewerker. Oud ERP, leveranciersportaal, overheidsformulier: vaak toch te automatiseren. Python als basis, waar nodig AI voor documenten en beslissingen. Beveiligde omgeving, actieve monitoring. Scherm wijzigt na een update? Wij passen de robot aan voordat jij storing merkt.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/rpa-workflow-integraties#service",
    heroImage: { src: "/images/service-rpa-workflow.png", alt: "RPA workflow automatisering: robot arm verbindt softwareapplicaties via geautomatiseerde processen - procesoptimalisatie voor MKB in Limburg" },
    jsonLdServiceType: "Robotic Process Automation & Workflow-integraties",
  },
  {
    id: "04",
    slug: "custom-ai-software",
    title: "Custom AI Software & Portalen",
    subtitle: "Als standaardsoftware niet meer past.",
    description:
      "Soms moet je software meebewegen met hoe jij werkt, niet andersom. Portalen, apps en interne tools met AI erin vanaf het begin.",
    tags: ["Klantportalen", "Web & mobiele apps", "AI-applicaties", "Documentbeheer"],
    metaTitle: "Custom AI Software & Portalen - MAISON BLNDR | Maatwerk AI-applicaties Limburg",
    metaDescription:
      "Bespoke AI-applicaties, klantportalen en mobiele apps volledig op maat. MAISON BLNDR bouwt custom AI-software voor ambitieuze bedrijven in Sittard, Maastricht en heel Limburg.",
    keywords: [
      "custom AI software",
      "maatwerk AI applicaties",
      "klantportaal bouwen",
      "AI webapplicatie",
      "mobiele app AI",
      "leveranciersportaal",
      "maatwerksoftware Limburg",
    ],
    longDescription: [
      "Webapps, klant- en leveranciersportalen, mobiele apps: AI zit erin vanaf het begin, niet als los chatbotje. Klanten volgen dossiers en krijgen updates. Interne tools signaleren afwijkingen voordat het escaleert.",
      "Zoeken op intentie, aanbevelingen op jouw data, documenten die zichzelf verwerken. Hoe meer je het gebruikt, hoe nuttiger het wordt.",
      "Next.js, TypeScript, Python, Azure of AWS. Modulair, zodat je kunt uitbreiden. Security en performance vanaf dag één.",
    ],
    benefits: [
      "Op maat voor jouw processen",
      "AI in de kern, leert van je data",
      "Interface die je team snel oppakt",
      "Schaalbaar en onderhoudbaar gebouwd",
      "Van analyse tot lancering bij ons",
    ],
    useCases: [
      "Klantenportalen met AI-functionaliteit",
      "Interne tools voor kennisbeheer",
      "Documentverwerking en archivering",
      "Mobiele apps voor veldmedewerkers",
      "Dashboards en rapportageplatformen",
    ],
    technologies: ["Next.js", "TypeScript", "Python", "Microsoft Azure AI", "OpenAI", "Anthropic Claude"],
    sections: [
      {
        id: "klantportalen",
        title: "Klantportalen",
        content:
          "Veel portalen zijn mappen met login. Wij bouwen een plek waar klanten status volgen, documenten uploaden, chatten en updates krijgen zonder te bellen. Op maat voor jouw branche. Beveiliging, audit-log en GDPR zitten standaard in.",
      },
      {
        id: "web-mobiele-apps",
        title: "Web & mobiele apps",
        content:
          "Apps voor hoe mensen werken: klantdata onderweg, inspecties ter plekke, offerte vanuit de auto. React en Next.js voor web, React Native voor iOS en Android. Eén codebase, alle devices.",
      },
      {
        id: "ai-applicaties",
        title: "AI-applicaties als kernproduct",
        content:
          "Geen standaardpakket met chatbot erop. AI is de kern: zoeken op vraag in plaats van trefwoord, dashboards die afwijkingen signaleren, advies op basis van klantdata. Dat is waar het verschil zit.",
      },
      {
        id: "documentbeheer",
        title: "Slim documentbeheer",
        content:
          "Niet alleen mappen. AI classificeert, haalt metadata eruit en groepeert gerelateerde stukken. Zoeken in gewone taal. Inkomend wordt verwerkt en aan het juiste dossier gekoppeld.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/custom-ai-software#service",
    heroImage: { src: "/images/service-custom-software.png", alt: "Custom AI software portaal met modern dashboard - maatwerk AI-oplossingen en intelligente portalen ontwikkeld door MAISON BLNDR in Limburg" },
    jsonLdServiceType: "Custom AI Software Development",
  },
  {
    id: "05",
    slug: "data-intelligentie-rapportages",
    title: "Data-intelligentie & Rapportages",
    subtitle: "Data die je al hebt, bruikbaar maken.",
    description:
      "Zoeken in je kennisbank via een gewone vraag. Dashboards die je team echt gebruikt. Rapporten die maandagochtend al klaarstaan.",
    tags: ["RAG-systemen", "Kennismanagement", "Dashboards", "Automatische rapportages"],
    metaTitle: "Data-intelligentie & Rapportages - MAISON BLNDR | RAG-systemen en AI-dashboards",
    metaDescription:
      "Van ruwe data naar bruikbare inzichten met RAG-systemen, automatische rapportages en AI-dashboards. MAISON BLNDR, specialist in data-intelligentie voor bedrijven in Limburg.",
    keywords: [
      "RAG systemen bedrijf",
      "data-intelligentie Limburg",
      "AI rapportages automatisch",
      "kennismanagement AI",
      "business intelligence AI",
      "dashboard automatisering",
      "KPI monitoring AI",
    ],
    longDescription: [
      "Data zit overal: databases, inbox, mappen. Gebruiken voor beslissingen lukt vaak maar deels, omdat alles verspreid staat.",
      "RAG geeft medewerkers toegang tot collectieve kennis. \"Wat spraken we vorig jaar af over onderhoud bij klant X?\" Antwoord met bron, in seconden.",
      "Ook rapportages en dashboards. Geen maandagochtend meer met Excel's samenvoegen. Het rapport staat klaar, met een korte samenvatting van wat opvalt.",
      "Afwijkingen? Alert naar de juiste persoon via mail, Slack of WhatsApp.",
    ],
    benefits: [
      "Interne kennis opvragen in gewone taal",
      "Rapporten zonder handmatig samenvoegen",
      "Alerts bij afwijkingen in je data",
      "Beslissen op actuele cijfers",
      "Koppeling met bestaande databronnen",
    ],
    useCases: [
      "Interne kennisbank doorzoekbaar maken met AI",
      "Dagelijkse managementrapportages automatiseren",
      "KPI-dashboards live bijhouden",
      "Contracten en dossiers analyseren",
      "Financiële afwijkingen automatisch signaleren",
    ],
    technologies: ["LangChain", "Anthropic Claude", "OpenAI", "Python", "Supabase", "Grafana"],
    sections: [
      {
        id: "kennismanagement",
        title: "Kennismanagement",
        content:
          "Kennis in hoofden, mail en losse docs is fragiel. Vertrek, en het is weg. Nieuwe collega's starten op nul. RAG koppelt een taalmodel aan Confluence, SharePoint, wiki's en handleidingen. Vragen in gewone taal, antwoord met bron.",
      },
      {
        id: "dashboards",
        title: "KPI-dashboards",
        content:
          "Te veel grafieken, te weinig actie: dat zien we vaak. Wij bouwen dashboards rond de KPI's die vandaag tellen, met alert bij afwijking. Directie, sales en productie krijgen elk hun eigen scherm.",
      },
      {
        id: "automatische-rapportages",
        title: "Automatische rapportages",
        content:
          "Data ophalen, samenvoegen, rekenen, visualiseren, versturen: volledig geautomatiseerd. AI markeert opvallende patronen, vergelijkt met vorige periodes en schrijft een korte samenvatting. Maandagochtend klaar, zonder handwerk.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/data-intelligentie-rapportages#service",
    heroImage: { src: "/images/service-data-intelligence.png", alt: "Data-intelligentie visualisaties: grafieken en analytics dashboards die ruwe bedrijfsdata omzetten naar bruikbare inzichten voor MKB in Limburg" },
    jsonLdServiceType: "Data-intelligentie & Business Intelligence",
  },
  {
    id: "06",
    slug: "ai-strategie-quickscan",
    title: "AI Strategie & Quickscan",
    subtitle: "Eerst weten waar het zin heeft.",
    description:
      "Veel bedrijven willen iets met AI maar weten niet waar te starten. Logisch. We helpen je prioriteiten kiezen: wat levert snel op, wat wacht beter even.",
    tags: ["Gratis quickscan", "Implementatieroadmap", "Business case", "Team training"],
    metaTitle: "AI Strategie & Quickscan - MAISON BLNDR | Gratis AI-scan voor Je Bedrijf",
    metaDescription:
      "Start met een gratis automatiseringsquickscan. MAISON BLNDR maakt een concreet AI-implementatieplan met business case voor je bedrijf in Limburg. Weet wat het oplevert vóór je investeert.",
    keywords: [
      "AI strategie consultancy",
      "gratis AI quickscan",
      "AI implementatieplan",
      "AI business case",
      "AI consultant Limburg",
      "digitale transformatie strategie",
      "AI roadmap bedrijf",
    ],
    longDescription: [
      "Gratis quickscan: welke taken kosten tijd, welke herhalen zich, waar gaan fouten mis? Daaruit komen tien tot vijftien kansen, gerangschikt op impact en doorlooptijd.",
      "Geen advieslijst, maar een plan: wat wanneer, wat het kost, wat het oplevert, hoe je succes meet.",
      "Uitvoering mag bij ons. We bouwen wat in de roadmap staat en helpen je team met AI in het dagelijks werk.",
    ],
    benefits: [
      "Gratis quickscan, geen verplichting",
      "ROI per proces in het plan",
      "Quick wins eerst, zwaardere stappen later",
      "Toolkeuze op fit, niet op wat wij verkopen",
      "Van strategie tot livegang bij één partij",
    ],
    useCases: [
      "Inventarisatie van automatiseringskansen",
      "Business case opbouwen voor directie of board",
      "Team trainen in werken met AI",
      "Leveranciersselectie voor AI-tools",
      "Change management bij AI-implementatie",
    ],
    technologies: ["OpenAI", "Anthropic Claude", "n8n", "Make.com", "LangChain", "Microsoft Azure AI"],
    sections: [
      {
        id: "implementatieroadmap",
        title: "Implementatieroadmap",
        content:
          "Roadmap die je over een half jaar nog kunt uitleggen. Eerst quick wins voor snelle ROI en draagvlak. Daarna uitbreiden op wat er al staat. Per fase: oplevering, resources, risico's, meetpunten. Elk kwartaal bijsturen.",
      },
      {
        id: "business-case",
        title: "Business case",
        content:
          "Business case voor een kritische directeur: nu, straks, kosten ertussen, financiële waarde. Conservatieve aannames, drie scenario's. Ook niet-financiële baten: minder fouten, betere kwaliteit, tevredenere teams.",
      },
      {
        id: "team-training",
        title: "Team training & adoptie",
        content:
          "Techniek faalt zelden; adoptie wel. Na zes weken ligt de tool stil als niemand snapte waarom die beter is. Geen eenmalige training, maar een traject dat we meten op gebruik na drie maanden, niet op aanwezigheid in een workshop.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-strategie-quickscan#service",
    heroImage: { src: "/images/service-ai-strategy.png", alt: "AI strategie en quickscan: roadmap met mijlpalen en analysevergrootglas - strategisch AI-advies voor bedrijven in Limburg" },
    jsonLdServiceType: "AI Strategie Consultancy",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
