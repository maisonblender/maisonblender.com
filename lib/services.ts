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
    subtitle: "Minder vragen voor je team. Betere service voor je klant.",
    description:
      "Je klanten verwachten antwoord. Niet morgen, niet na drie klikken — nu. Maar je kunt niet altijd iemand beschikbaar hebben. Wij bouwen AI-agents die die kloof dichten: dag en nacht bereikbaar, zonder dat jij extra personeel nodig hebt.",
    tags: ["Conversational AI", "WhatsApp & web chat", "Lead generatie", "Omnichannel"],
    metaTitle: "AI Chatbots & Klantenservice - MAISON BLNDR | 24/7 Geautomatiseerde Klantinteractie",
    metaDescription:
      "Automatiseer tot 90% van je klantenservice met intelligente AI-chatbots. MAISON BLNDR bouwt conversational AI-agents voor web, WhatsApp en e-mail. Actief in Sittard, Maastricht en heel Zuid-Limburg.",
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
      "Dit zijn geen knoppen-chatbots die je doorsturen naar een FAQ. Ze begrijpen wat je klant bedoelt, zoeken het antwoord op in je eigen systemen — CRM, kennisbank, productcatalogus — en geven een concreet, persoonlijk antwoord. Ook als de vraag niet in het script staat.",
      "De chatbot plant afspraken in, genereert offertes, registreert klachten en kwalificeert leads. Allemaal zonder menselijke tussenkomst. Als het écht nodig is, schakelt hij over naar een collega — met de volledige gesprekscontext erbij.",
      "Gemiddeld halen onze klanten 70–90% van de herhalende klantvragen weg bij hun team. Wat overblijft zijn de gesprekken waar een mens echt het verschil maakt.",
      "Wij verzorgen de volledige implementatie: trainingen op jouw producten en diensten, integratie met je CRM of helpdesksysteem, en continu beheer na de lancering.",
    ],
    benefits: [
      "70–90% minder herhalende vragen voor je team",
      "Altijd beschikbaar — ook 's avonds en in het weekend",
      "Leads automatisch gekwalificeerd en doorgestuurd naar sales",
      "Eén agent, alle kanalen: web, WhatsApp, e-mail",
      "Wij beheren en verbeteren continu — jij ziet de resultaten",
    ],
    useCases: [
      "Veelgestelde vragen automatisch beantwoorden",
      "Afspraken inplannen via chat",
      "Leads kwalificeren en doorsturen naar sales",
      "Klachten registreren en routeren",
      "Productinformatie en beschikbaarheid opvragen",
    ],
    technologies: ["OpenAI GPT-4o", "Anthropic Claude", "WhatsApp Business API", "Zendesk", "HubSpot"],
    sections: [
      {
        id: "lead-generatie",
        title: "Lead generatie",
        content:
          "Een contactformulier wacht af. Een AI-agent gaat het gesprek aan. Waar een formulier passief informatie verzamelt, kwalificeert een AI-agent de bezoeker actief: wat zoekt hij, wat is zijn budget, hoe urgent is de vraag? Dat gesprek vindt plaats in gewone taal — niet als een verhoor, maar als een gesprek. Het resultaat: warme leads die direct naar de juiste salesmedewerker gaan, met alle context al uitgeschreven. Uit onze implementaties stijgt de conversie van websitebezoeker naar qualified lead gemiddeld met 35–60%.",
      },
      {
        id: "omnichannel",
        title: "Omnichannel",
        content:
          "Je klant begint op WhatsApp. Vervolgt via e-mail. Belt daarna. En moet elke keer opnieuw uitleggen wie hij is. Dat is het probleem dat omnichannel oplost. Wij bouwen AI-agents die de context meenemen over alle kanalen heen — web, WhatsApp, e-mail en telefoon. De klanthistorie en gesprekscontext zijn overal beschikbaar. Jouw team begint nooit meer opnieuw.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-chatbots-klantenservice#service",
    heroImage: { src: "/images/service-ai-chatbots.png", alt: "AI chatbot interface met chat bubbles op smartphone en desktop - AI-gestuurde klantenservice automatisering voor bedrijven in Zuid-Limburg" },
    jsonLdServiceType: "Conversational AI & Klantenservice Automatisering",
  },
  {
    id: "02",
    slug: "ai-agents-procesautomatisering",
    title: "AI Agents & Procesautomatisering",
    subtitle: "Taken uitvoeren, niet alleen adviseren.",
    description:
      "Custom agents die e-mails lezen, documenten verwerken en acties uitvoeren in je CRM of ERP. Dag en nacht, zonder dat jij of je collega er naar hoeft te kijken.",
    tags: ["Multi-agent orkestratie", "Documentverwerking", "CRM/ERP-koppelingen", "Taakuitvoering"],
    metaTitle: "AI Agents & Procesautomatisering - MAISON BLNDR | Intelligente Agents voor Je Bedrijf",
    metaDescription:
      "Custom AI-agents die zelfstandig taken uitvoeren: documenten verwerken, e-mails interpreteren, acties in CRM en ERP. 24/7 operationeel. MAISON BLNDR, AI-bureau in Zuid-Limburg.",
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
      "Een AI-agent leest binnenkomende e-mails, interpreteert de inhoud, haalt relevante data op uit je systemen en neemt de juiste actie: een offerte aanmaken in je ERP, een taak aanmaken in je projecttool, of een antwoord sturen aan de klant. Dit alles zonder dat een medewerker er naar hoeft te kijken.",
      "Bij complexere taken kan de agent escaleren naar een collega of een ander systeem. Bij drukte schaalt hij op. Bij fouten signaleert hij — niet andersom.",
      "Voor organisaties met veel terugkerende, kennisintensieve taken is dit transformatief. Denk aan een makelaarskantoor dat automatisch bezichtigingen plant en dossiers bijwerkt. Of een logistiek bedrijf dat inkomende vrachtbrieven verwerkt, afwijkingen signaleert en klanten proactief informeert.",
      "MAISON BLNDR bouwt deze agents op maat, gebaseerd op jouw specifieke processen en systemen. Je krijgt een schaalbare, veilige oplossing die meegroeit met je organisatie.",
    ],
    benefits: [
      "Zelfstandige taakuitvoering 24/7 zonder menselijke tussenkomst",
      "Naadloze integratie met je CRM, ERP en andere systemen",
      "Schaalbaarheid: meerdere agents parallel voor hoge volumes",
      "Volledige audittrail van elke actie die de agent uitvoert",
      "Hogere kwaliteit door consistente, foutloze verwerking",
    ],
    useCases: [
      "E-mailverwerking en automatische acties",
      "Offertes genereren vanuit inkomende aanvragen",
      "Dossiers en contracten bijhouden",
      "Inkooporders verwerken en goedkeuringen routeren",
      "Klantenportfolio monitoren en alerting",
    ],
    technologies: ["LangChain", "Anthropic Claude", "OpenAI GPT-4o", "Microsoft Azure AI", "n8n"],
    sections: [
      {
        id: "multi-agent",
        title: "Multi-agent orkestratie",
        content:
          "Multi-agent orkestratie is de aanpak waarbij meerdere gespecialiseerde AI-agents samenwerken aan een complex proces. Eén agent leest de inkomende e-mail en classificeert het verzoek. Een tweede agent haalt relevante data op uit je CRM. Een derde voert de benodigde actie uit. Een coördinerende orchestrator-agent stuurt het geheel aan. MAISON BLNDR bouwt multi-agent systemen op basis van LangChain en AutoGen, waarbij elke agent zijn eigen verantwoordelijkheid heeft en fouten door de andere agents worden opgevangen. Dit is de architectuur die schaalbaar is naar hoge volumes: bij drukte worden meer instanties van dezelfde agent opgestart. Bedrijven met complexe, meertrapsprocessen die nu door meerdere medewerkers worden afgehandeld, zijn de ideale kandidaat voor multi-agent automatisering.",
      },
      {
        id: "documentverwerking",
        title: "Intelligente documentverwerking",
        content:
          "AI-gestuurde documentverwerking gaat verder dan OCR. Een intelligent document processing-systeem van MAISON BLNDR begrijpt de betekenis van een document: het onderscheidt een offerte van een contract, herkent afwijkingen ten opzichte van de standaard en extraheert de relevante data in de juiste context. Of het nu gaat om inkomende offerteaanvragen, leverancierscontracten, belastingdocumenten of medische dossiers — het systeem verwerkt elk documenttype op maat. De geëxtraheerde data gaat direct naar je systemen: CRM, ERP of documentmanagementsysteem.",
      },
      {
        id: "taakuitvoering",
        title: "Autonome taakuitvoering",
        content:
          "Taakuitvoering door AI-agents is het stadium waarbij automatisering overgaat van data verwerken naar daadwerkelijk handelingen uitvoeren. Een AI-agent die niet alleen een inkomend verzoek classificeert, maar ook de bijbehorende taak aanmaakt in Asana, de verantwoordelijke notificeert via Slack en na 48 uur een follow-up stuurt als er geen reactie is. MAISON BLNDR bouwt AI-agents die taken volledig autonoom afhandelen via integraties met je tool-stack. De agents hebben toegang tot een gedefinieerde set acties en kiezen op basis van de situatie de juiste actie. Elke handeling wordt gelogd in een audittrail.",
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
    subtitle: "Systemen koppelen, handmatig kopieerwerk elimineren.",
    description:
      "Facturen, bestellingen, rapportages: wij automatiseren wat nu handmatig tussendoor gaat. Ook voor systemen zonder API. Volledig beheerd, inclusief onderhoud.",
    tags: ["Robotic Process Automation", "API-integraties", "Factuurverwerking", "Schermautomatisering"],
    metaTitle: "RPA & Workflow-integraties - MAISON BLNDR | Robotic Process Automation Zuid-Limburg",
    metaDescription:
      "Automatiseer repetitieve schermtaken en verbind je systemen met RPA. MAISON BLNDR implementeert robuuste workflow-automatisering met n8n, Make.com en Zapier. Volledig beheerd in Zuid-Limburg.",
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
      "Veel bedrijfsprocessen bestaan nog grotendeels uit handmatig werk dat eigenlijk nooit handmatig zou moeten zijn: facturen overzetten van e-mail naar boekhoudpakket, gegevens kopiëren tussen systemen, rapporten samenstellen uit meerdere bronnen. Robotic Process Automation (RPA) elimineert dit soort werk structureel en betrouwbaar.",
      "MAISON BLNDR implementeert en beheert RPA-oplossingen die je scherminteracties automatiseren alsof er een digitale medewerker achter de computer zit — maar dan sneller, nauwkeuriger en altijd beschikbaar. Wij werken met professionele tools zoals n8n, Make.com en Zapier voor workflow-automatisering, aangevuld met Python-gebaseerde automatisering voor complexere scenario's.",
      "Naast schermautomatisering bouwen wij robuuste API-integraties die je systemen met elkaar verbinden. Geen data meer handmatig overzetten tussen je webshop en je magazijnsysteem. Geen dubbele invoer meer bij het verwerken van bestellingen. Geen verloren informatie meer omdat twee systemen niet met elkaar praten.",
      "Voor het MKB in Zuid-Limburg is RPA vaak de snelste manier om uren per week te besparen. De implementatietijd is kort, de ROI is direct zichtbaar, en je hoeft geen bestaande systemen te vervangen. Wij beheren je automatiseringen proactief: bij systeemupdates of proceswijzigingen passen wij de robots aan zodat je nooit stilstaat.",
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
          "API-integraties zijn de verbindingen tussen softwaresystemen via gestandaardiseerde programmeerinterfaces. MAISON BLNDR bouwt robuuste API-integraties die systemen real-time laten communiceren: een bestelling in je webshop triggert automatisch een verzoek in je ERP, een nieuw klantcontact in je CRM maakt een taak aan in je projecttool, en een goedgekeurd verlofverzoek in je HR-systeem past de planning aan. Wij bouwen op REST en GraphQL API's en gebruiken platforms als n8n en Make.com voor visuele workflow-automatisering. Elke integratie wordt gebouwd met foutafhandeling, retry-logica en alerting — zodat je nooit ongemerkt data verliest bij een tijdelijk systeemprobleem. Onderhoud en updates bij API-versiewijzigingen zijn inbegrepen in ons beheercontract.",
      },
      {
        id: "schermautomatisering",
        title: "Schermautomatisering (UI automation)",
        content:
          "Schermautomatisering — ook wel UI-automatisering — is de RPA-techniek waarbij een softwarerobot een computerscherm bestuurt zoals een medewerker dat zou doen: klikken, typen, kopiëren, formulieren invullen. Het bijzondere voordeel is dat het werkt met systemen die geen API bieden. Een twintig jaar oud ERP-systeem, een leveranciersportaal dat je zelf niet kunt aanpassen, een overheidsportaal — allemaal automatiseerbaar via schermautomatisering. MAISON BLNDR implementeert schermautomatisering met Python-gebaseerde oplossingen en combineert dit waar nuttig met AI voor documentherkenning en besluitvorming. De robots draaien in een beveiligde omgeving en worden proactief gemonitord. Als een scherm verandert door een systeemupdate, signaleren wij dit en passen de robot aan voordat jij er last van hebt.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/rpa-workflow-integraties#service",
    heroImage: { src: "/images/service-rpa-workflow.png", alt: "RPA workflow automatisering: robot arm verbindt softwareapplicaties via geautomatiseerde processen - procesoptimalisatie voor MKB in Zuid-Limburg" },
    jsonLdServiceType: "Robotic Process Automation & Workflow-integraties",
  },
  {
    id: "04",
    slug: "custom-ai-software",
    title: "Custom AI Software & Portalen",
    subtitle: "Standaardsoftware is voor iedereen gebouwd. Jouw bedrijf is niet iedereen.",
    description:
      "Op een gegeven moment werkt het omgekeerde: je past niet meer aan het systeem aan, maar wil dat het systeem aanpast aan jou. Dat is het moment om maatwerk te overwegen — en dat is precies waar wij goed in zijn.",
    tags: ["Klantportalen", "Web & mobiele apps", "AI-applicaties", "Documentbeheer"],
    metaTitle: "Custom AI Software & Portalen - MAISON BLNDR | Maatwerk AI-applicaties Zuid-Limburg",
    metaDescription:
      "Bespoke AI-applicaties, klantportalen en mobiele apps volledig op maat. MAISON BLNDR bouwt custom AI-software voor ambitieuze bedrijven in Sittard, Maastricht en heel Zuid-Limburg.",
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
      "We bouwen webapplicaties, klantportalen, leveranciersportalen en mobiele apps — allemaal met AI als kernonderdeel, niet als bijgeleverd chatbotje. Je klantportaal beheert dossiers en geeft proactieve statusupdates. Je interne platform signaleert afwijkingen en informeert je team voordat het een probleem wordt.",
      "Het verschil met andere maatwerksoftware: bij ons zit de intelligentie in het fundament. Zoekfuncties begrijpen intentie. Aanbevelingen leren van jouw data. Documenten verwerken zichzelf. En het systeem wordt slimmer naarmate je het meer gebruikt.",
      "We werken met Next.js, TypeScript, Python en cloud-platforms als Microsoft Azure en AWS. Modulair gebouwd, zodat je software meegroeit. Security en performance zijn geen afterthought — bouwstenen van dag één.",
    ],
    benefits: [
      "Volledig op maat — past exact bij jouw processen en workflows",
      "AI in de kern: het systeem wordt slimmer naarmate je meer data opbouwt",
      "Moderne, intuïtieve gebruikerservaring — geen training nodig",
      "Schaalbaar en onderhoudbaar gebouwd van dag één",
      "Van analyse en ontwerp tot lancering volledig begeleid",
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
          "De meeste klantportalen zijn mappen met een wachtwoord ervoor. Wat wij bouwen is anders: een werkplek waar je klanten de status van hun project volgen, documenten uploaden, communiceren via geïntegreerde chat en proactieve updates ontvangen — zonder dat ze jou hoeven te bellen. Volledig op maat voor jouw branche en klantrelaties. Beveiliging, audit-logging en GDPR-compliance zijn standaard onderdeel van elke implementatie.",
      },
      {
        id: "web-mobiele-apps",
        title: "Web & mobiele apps",
        content:
          "Apps voor hoe mensen echt werken — niet voor hoe de specificatie het beschrijft. Voor buitendienstmedewerkers die onderweg klantdata nodig hebben. Voor teams die inspecties vastleggen terwijl ze er staan. Voor salesmensen die een offerte genereren in de auto. We bouwen met React en Next.js voor web, React Native voor iOS en Android — één codebase, op alle devices.",
      },
      {
        id: "ai-applicaties",
        title: "AI-applicaties als kernproduct",
        content:
          "AI-applicaties zijn niet standaardsoftware met een chatbot erbij — ze zijn gebouwd rond AI als kernfunctionaliteit. MAISON BLNDR ontwikkelt applicaties waarbij AI de gebruikerservaring fundamenteel verbetert: een interne zoekfunctie die documenten vindt op basis van vraag in plaats van trefwoord, een dashboard dat anomalieën proactief signaleert, of een adviesapplicatie die op basis van klantdata automatisch de beste productaanbeveling doet.",
      },
      {
        id: "documentbeheer",
        title: "Slim documentbeheer",
        content:
          "Slim documentbeheer is meer dan bestanden opslaan in mappen. We bouwen systemen waarbij AI automatisch documenten classificeert, metadata extraheert en gerelateerde documenten clustert. Je medewerkers vinden wat ze zoeken in seconden — via een zoekopdracht in gewone taal. Inkomende documenten worden automatisch verwerkt en aan het juiste dossier gekoppeld.",
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
    subtitle: "Je hebt de data al. Je gebruikt hem alleen nog niet.",
    description:
      "RAG-systemen die je kennisbase doorzoekbaar maken. Dashboards die je team dagelijks sturen op de juiste KPI's. Rapportages die zichzelf schrijven.",
    tags: ["RAG-systemen", "Kennismanagement", "Dashboards", "Automatische rapportages"],
    metaTitle: "Data-intelligentie & Rapportages - MAISON BLNDR | RAG-systemen en AI-dashboards",
    metaDescription:
      "Van ruwe data naar bruikbare inzichten met RAG-systemen, automatische rapportages en AI-dashboards. MAISON BLNDR, specialist in data-intelligentie voor bedrijven in Zuid-Limburg.",
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
      "Elke dag vult je bedrijf databases, inboxen en bestanden. Maar hoeveel van die informatie gebruik je echt om beslissingen te nemen? Bij de meeste bedrijven is het antwoord: een fractie. Niet omdat de data er niet is — maar omdat hij verspreid zit en moeilijk te bereiken.",
      "We maken die data werkbaar. Onze RAG-systemen geven je medewerkers directe toegang tot de collectieve kennis van je organisatie. Een medewerker typt: \"Wat spraken we vorig jaar af over het onderhoudscontract van klant X?\" Hij krijgt het antwoord, met bronvermelding, in vijf seconden. Zonder mappen open te klikken.",
      "Naast kennisontsluiting bouwen wij geautomatiseerde rapportagesystemen en live dashboards. Elke maandagochtend pakt iemand bij jouw bedrijf de Excel-bestanden van vorige week erbij en begint ze samen te voegen. Twee tot acht uur later is het rapport klaar. Wij automatiseren dat. Het rapport schrijft zichzelf — inclusief een samenvatting van wat opvalt en wat actie verdient.",
      "Afwijkingen worden proactief gesignaleerd voordat ze een probleem worden. De juiste persoon ontvangt een notificatie via e-mail, Slack of WhatsApp.",
    ],
    benefits: [
      "Directe toegang tot je interne kennisbase — via een vraag in gewone taal",
      "Rapportages die zichzelf schrijven — geen handmatig samenvoegen meer",
      "Proactieve alerting bij afwijkingen in je data",
      "Betere beslissingen op basis van actuele, accurate cijfers",
      "Integreert met al je bestaande databronnen",
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
          "Kennis zit in hoofden, e-mails en documenten. En is daarmee kwetsbaar. Een medewerker die vertrekt neemt kennis mee. Een nieuwe medewerker begint van nul. Klantenservice geeft inconsistente antwoorden afhankelijk van wie er dienst heeft. Wij lossen dat op: via RAG-technologie koppelen we een taalmodel aan je bestaande kennisrepositories — Confluence, SharePoint, interne wikis, proceshandleidingen. Medewerkers stellen vragen in gewone taal en krijgen accurate antwoorden met bronvermelding.",
      },
      {
        id: "dashboards",
        title: "KPI-dashboards",
        content:
          "Het probleem met de meeste dashboards is niet dat er te weinig op staat. Het is dat er te veel op staat — en dat niemand weet wat hij ermee moet. Wij bouwen dashboards die je team dagelijks sturen: de KPI's die er vandaag toe doen, met alerting als er iets afwijkt. De directeur ziet de strategische cijfers, de salesmanager de pipelinedata, de productieleider de capaciteitsbenutting.",
      },
      {
        id: "automatische-rapportages",
        title: "Automatische rapportages",
        content:
          "De rapportage schrijft zichzelf. We automatiseren de volledige rapportageketen: data ophalen uit alle bronnen, samenvoegen, berekeningen uitvoeren, visualiseren en distribueren naar de juiste ontvangers. AI voegt een laag toe die rapportage overstijgt: het systeem signaleert welke patronen opvallend zijn, vergelijkt met vorige periodes en geeft een korte tekstuele samenvatting. Elke maandagochtend klaar — zonder dat een medewerker er een vinger aan heeft geroerd.",
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
    subtitle: "Weten waar te beginnen is al de helft van het werk.",
    description:
      "Bijna elk bedrijf waarmee we in gesprek gaan zegt hetzelfde: we willen iets met AI doen, maar we weten niet waar we moeten beginnen. Eerlijk gezegd — dat is een verstandige houding. Niet alles leent zich voor AI. Maar sommige processen lenen zich er perfect voor.",
    tags: ["Gratis quickscan", "Implementatieroadmap", "Business case", "Team training"],
    metaTitle: "AI Strategie & Quickscan - MAISON BLNDR | Gratis AI-scan voor Je Bedrijf",
    metaDescription:
      "Start met een gratis automatiseringsquickscan. MAISON BLNDR maakt een concreet AI-implementatieplan met business case voor je bedrijf in Zuid-Limburg. Weet wat het oplevert vóór je investeert.",
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
      "We beginnen met een gratis quickscan van je processen: welke taken kosten het meeste tijd, welke worden het meest herhaald, welke zijn het meest gevoelig voor fouten. Uit die analyse komen de tien tot vijftien processen naar boven die het meeste opleveren als je ze automatiseert — gerangschikt op impact én implementatietijd.",
      "Wat je krijgt is geen lijst met aanbevelingen. Het is een uitvoerbaar plan: wat wordt wanneer gebouwd, wat kost het, wat levert het op, en hoe weet je dat het werkt. Per fase.",
      "Na de strategie-fase kun je de uitvoering bij ons neerleggen. Wij implementeren de oplossingen die in de roadmap staan en begeleiden je team in het werken met AI. Zo bouw je interne expertise op die je organisatie op de lange termijn versterkt.",
    ],
    benefits: [
      "Gratis quickscan — geen verplichtingen, wel direct inzicht",
      "Implementatieplan met ROI per proces, zwart op wit",
      "Duidelijke prioritering: quick wins eerst, complexe zaken later",
      "Onafhankelijk: we kiezen de tool die past, niet de tool die we zelf verkopen",
      "Van strategie tot lancering — we blijven erbij",
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
          "Een roadmap die je ook over zes maanden nog kunt uitleggen. We beginnen met de quick wins: snel te implementeren, direct ROI, intern draagvlak. Daarna bouwen we door op de infrastructuur die we hebben neergelegd. Per fase staat beschreven wat er wordt opgeleverd, welke resources nodig zijn, welke risico's er zijn en hoe succes gemeten wordt. We reviewen en actualiseren elk kwartaal.",
      },
      {
        id: "business-case",
        title: "Business case",
        content:
          "Een business case die standhoudt bij een kritische directeur. Vier onderdelen: waar staan we nu, waar staan we na implementatie, wat kost het daartussen, en wat is de financiële waarde van het verschil. We bouwen met conservatieve aannames en drie scenario's — zodat niemand kan zeggen dat het te mooi is om waar te zijn. Inclusief niet-financiële baten: betere kwaliteit, lagere foutmarges, hogere medewerkerstevredenheid.",
      },
      {
        id: "team-training",
        title: "Team training & adoptie",
        content:
          "De technologie is zelden het probleem. Het probleem is dat mensen de tool na zes weken niet meer gebruiken omdat niemand goed heeft uitgelegd waarom hij beter is dan wat ze al deden. Wij lossen dat op — niet met een eenmalige training, maar met een adoptietraject dat we meten. Niet hoeveel mensen een training hebben gevolgd, maar hoeveel mensen de tool daadwerkelijk gebruiken na drie maanden. Dat is de metric die telt.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-strategie-quickscan#service",
    heroImage: { src: "/images/service-ai-strategy.png", alt: "AI strategie en quickscan: roadmap met mijlpalen en analysevergrootglas - strategisch AI-advies voor bedrijven in Zuid-Limburg" },
    jsonLdServiceType: "AI Strategie Consultancy",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
