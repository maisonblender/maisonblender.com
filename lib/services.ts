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
  jsonLdId: string;
  jsonLdServiceType: string;
}

export const services: Service[] = [
  {
    id: "01",
    slug: "ai-chatbots-klantenservice",
    title: "AI Chatbots & Klantenservice",
    subtitle: "24/7 geautomatiseerde klantinteractie",
    description:
      "Automatiseer tot 90% van uw klantenservice met AI-agents die vragen beantwoorden, afspraken inplannen en leads kwalificeren - via web, WhatsApp, e-mail en meer.",
    tags: ["Conversational AI", "WhatsApp & web chat", "Lead generatie", "Omnichannel"],
    metaTitle: "AI Chatbots & Klantenservice — Maison Blender | 24/7 Geautomatiseerde Klantinteractie",
    metaDescription:
      "Automatiseer tot 90% van uw klantenservice met intelligente AI-chatbots. Maison Blender bouwt conversational AI-agents voor web, WhatsApp en e-mail. Actief in Sittard, Maastricht en heel Zuid-Limburg.",
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
      "Uw klanten verwachten directe antwoorden — dag en nacht, ook buiten kantooruren. Met een AI-chatbot van Maison Blender geeft u uw klantenservice een krachtige upgrade zonder extra personeel. Wij bouwen intelligente conversational AI-agents die naadloos integreren met uw bestaande systemen: van uw website tot WhatsApp Business, e-mail en zelfs telefoon.",
      "Onze AI-chatbots zijn niet de simpele knoppen-chatbots van vroeger. Ze begrijpen de intentie achter een vraag, halen informatie op uit uw CRM of kennisbank, en geven persoonlijke, accurate antwoorden. Ze leren van elk gesprek en worden continu beter. Denk aan een chatbot die niet alleen vragen beantwoordt, maar ook zelfstandig afspraken inplant, offertes genereert of klachten registreert — allemaal zonder menselijke tussenkomst.",
      "Voor bedrijven in Zuid-Limburg die groeien zonder evenredig meer personeel aan te nemen, is dit een directe hefboom. Klanten krijgen sneller antwoord, uw medewerkers houden tijd over voor complexe of waardevolle taken, en uw conversieratio stijgt doordat leads direct worden gekwalificeerd en opgevolgd. Gemiddeld automatiseren onze klanten 70 tot 90% van de repetitieve klantcontacten.",
      "Wij zorgen voor de volledige implementatie: van het trainen van het model op uw producten en diensten, tot de integratie met uw CRM, ERP of helpdesksysteem. U hoeft niets te doen dan de resultaten te zien. Na de lancering monitoren en verbeteren wij de chatbot op basis van echte gesprekken.",
    ],
    benefits: [
      "70–90% minder repetitief klantcontact voor uw team",
      "Directe reactietijden: geen wachtrijen, ook buiten kantooruren",
      "Automatische lead-kwalificatie en afspraakplanning",
      "Omnichannel: één AI-agent voor web, WhatsApp, e-mail en meer",
      "Volledig beheerd: wij trainen, monitoren en verbeteren continu",
    ],
    useCases: [
      "Veelgestelde vragen automatisch beantwoorden",
      "Afspraken inplannen via chat",
      "Leads kwalificeren en doorsturen naar sales",
      "Klachten registreren en routeren",
      "Productinformatie en beschikbaarheid opvragen",
    ],
    technologies: ["OpenAI GPT-4o", "Anthropic Claude", "WhatsApp Business API", "Zendesk", "HubSpot"],
    jsonLdId: "https://maisonblender.com/diensten/ai-chatbots-klantenservice#service",
    jsonLdServiceType: "Conversational AI & Klantenservice Automatisering",
  },
  {
    id: "02",
    slug: "ai-agents-procesautomatisering",
    title: "AI Agents & Procesautomatisering",
    subtitle: "Intelligente agents die voor u werken",
    description:
      "Custom AI-agents die taken uitvoeren: documenten verwerken, e-mails interpreteren, acties uitvoeren in uw CRM of ERP. 24/7 operationeel, zonder menselijke tussenkomst.",
    tags: ["Multi-agent orkestratie", "Documentverwerking", "CRM/ERP-koppelingen", "Taakuitvoering"],
    metaTitle: "AI Agents & Procesautomatisering — Maison Blender | Intelligente Agents voor Uw Bedrijf",
    metaDescription:
      "Custom AI-agents die zelfstandig taken uitvoeren: documenten verwerken, e-mails interpreteren, acties in CRM en ERP. 24/7 operationeel. Maison Blender, AI-bureau in Zuid-Limburg.",
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
      "De volgende stap na chatbots zijn AI-agents: autonome digitale medewerkers die zelfstandig taken uitvoeren, beslissingen nemen en systemen aansturen. Maison Blender ontwikkelt custom AI-agents die werken als verlengstuk van uw team — dag en nacht, zonder fouten door vermoeidheid of afleiding.",
      "Een AI-agent van ons leest binnenkomende e-mails, interpreteert de inhoud, haalt relevante data op uit uw systemen en neemt de juiste actie: een offerte aanmaken in uw ERP, een taak aanmaken in uw projecttool, of een antwoord sturen aan de klant. Dit alles zonder dat een medewerker er naar hoeft te kijken. Bij complexere taken kan de agent escaleren naar een collega of een ander systeem.",
      "Voor organisaties met veel terugkerende, kennisintensieve taken is dit transformatief. Denk aan een makelaarskantoor dat automatisch bezichtigingen plant en dossiers bijwerkt. Of een logistiek bedrijf dat AI inzet om inkomende vrachtbrieven te verwerken, afwijkingen te signaleren en klanten proactief te informeren. De mogelijkheden zijn breed: overal waar mensen nu repetitieve beslissingstaken uitvoeren, kan een AI-agent het overnemen.",
      "Maison Blender bouwt deze agents op maat, gebaseerd op uw specifieke processen en systemen. Wij werken met de nieuwste frameworks zoals LangChain en multi-agent orkestratie om agents te laten samenwerken op complexe workflows. U krijgt een schaalbare, veilige oplossing die meegroeit met uw organisatie.",
    ],
    benefits: [
      "Zelfstandige taakuitvoering 24/7 zonder menselijke tussenkomst",
      "Naadloze integratie met uw CRM, ERP en andere systemen",
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
    jsonLdId: "https://maisonblender.com/diensten/ai-agents-procesautomatisering#service",
    jsonLdServiceType: "AI Agents & Intelligente Procesautomatisering",
  },
  {
    id: "03",
    slug: "rpa-workflow-integraties",
    title: "RPA & Workflow-integraties",
    subtitle: "Robotic Process Automation zonder zorgen",
    description:
      "Automatiseer repetitieve schermtaken en verbind uw systemen via robuuste API-koppelingen. Van factuurverwerking tot contractbeheer - wij beheren het volledig voor u.",
    tags: ["Robotic Process Automation", "API-integraties", "Factuurverwerking", "Schermautomatisering"],
    metaTitle: "RPA & Workflow-integraties — Maison Blender | Robotic Process Automation Zuid-Limburg",
    metaDescription:
      "Automatiseer repetitieve schermtaken en verbind uw systemen met RPA. Maison Blender implementeert robuuste workflow-automatisering met n8n, Make.com en Zapier. Volledig beheerd in Zuid-Limburg.",
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
      "Maison Blender implementeert en beheert RPA-oplossingen die uw scherminteracties automatiseren alsof er een digitale medewerker achter de computer zit — maar dan sneller, nauwkeuriger en altijd beschikbaar. Wij werken met professionele tools zoals n8n, Make.com en Zapier voor workflow-automatisering, aangevuld met Python-gebaseerde automatisering voor complexere scenario's.",
      "Naast schermautomatisering bouwen wij robuuste API-integraties die uw systemen met elkaar verbinden. Geen data meer handmatig overzetten tussen uw webshop en uw magazijnsysteem. Geen dubbele invoer meer bij het verwerken van bestellingen. Geen verloren informatie meer omdat twee systemen niet met elkaar praten. Wij verbinden de systemen die u al heeft en zorgen dat data automatisch en correct vloeit.",
      "Voor het MKB in Zuid-Limburg is RPA vaak de snelste manier om uren per week te besparen. De implementatietijd is kort, de ROI is direct zichtbaar, en u hoeft geen bestaande systemen te vervangen. Wij beheren uw automatiseringen proactief: bij systeemupdates of proceswijzigingen passen wij de robots aan zodat u nooit stilstaat.",
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
    jsonLdId: "https://maisonblender.com/diensten/rpa-workflow-integraties#service",
    jsonLdServiceType: "Robotic Process Automation & Workflow-integraties",
  },
  {
    id: "04",
    slug: "custom-ai-software",
    title: "Custom AI Software & Portalen",
    subtitle: "Maatwerksoftware aangedreven door AI",
    description:
      "Bespoke AI-applicaties, klant- en leveranciersportalen, mobiele apps en webapplicaties - volledig op maat gebouwd voor uw processen en data.",
    tags: ["Klantportalen", "Web & mobiele apps", "AI-applicaties", "Documentbeheer"],
    metaTitle: "Custom AI Software & Portalen — Maison Blender | Maatwerk AI-applicaties Zuid-Limburg",
    metaDescription:
      "Bespoke AI-applicaties, klantportalen en mobiele apps volledig op maat. Maison Blender bouwt custom AI-software voor ambitieuze bedrijven in Sittard, Maastricht en heel Zuid-Limburg.",
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
      "Standaardsoftware is gebouwd voor iedereen — en dus voor niemand perfect. Als uw processen complex genoeg zijn om een eigen aanpak te verdienen, bouwt Maison Blender de software die precies past bij hoe u werkt. Niet aanpassen aan het systeem, maar het systeem aanpassen aan u.",
      "Wij ontwikkelen bespoke webapplicaties, klant- en leveranciersportalen en mobiele apps, allemaal aangedreven door moderne AI-technologie. Denk aan een klantenportaal waar uw klanten zelf hun dossier beheren, documenten uploaden en AI-gestuurde statusupdates ontvangen. Of een intern platform dat automatisch rapportages genereert, afwijkingen signaleert en uw team proactief informeert.",
      "Onze ontwikkelaanpak is pragmatisch en resultaatgericht. Wij beginnen met een grondige analyse van uw processen en gebruikerswensen, ontwerpen een intuïtieve gebruikerservaring en bouwen modulair zodat uw software meegroeit. Security en performance zijn geen afterthought maar bouwstenen van dag één. Wij werken met moderne stacks: Next.js, TypeScript, Python en cloud-platforms als Microsoft Azure en AWS.",
      "Wat onze maatwerksoftware onderscheidt is de diepte van AI-integratie. Dit zijn geen systemen die toevallig een chatbot hebben — de AI is verweven in de kernfunctionaliteit. Documenten worden automatisch verwerkt en geclassificeerd. Zoekopdrachten begrijpen intentie in plaats van alleen trefwoorden. Aanbevelingen worden gedaan op basis van patronen in uw eigen data. De software wordt slimmer naarmate u er meer mee werkt.",
    ],
    benefits: [
      "Volledig op maat: past exact bij uw processen en workflows",
      "AI in de kern: slimmer naarmate u meer data opbouwt",
      "Moderne, intuïtieve gebruikerservaring",
      "Schaalbaar en onderhoudbaar gebouwd",
      "Van ontwerp tot lancering volledig begeleid",
    ],
    useCases: [
      "Klantenportalen met AI-functionaliteit",
      "Interne tools voor kennisbeheer",
      "Documentverwerking en archivering",
      "Mobiele apps voor veldmedewerkers",
      "Dashboards en rapportageplatformen",
    ],
    technologies: ["Next.js", "TypeScript", "Python", "Microsoft Azure AI", "OpenAI", "Anthropic Claude"],
    jsonLdId: "https://maisonblender.com/diensten/custom-ai-software#service",
    jsonLdServiceType: "Custom AI Software Development",
  },
  {
    id: "05",
    slug: "data-intelligentie-rapportages",
    title: "Data-intelligentie & Rapportages",
    subtitle: "Van ruwe data naar bruikbare inzichten",
    description:
      "RAG-systemen die uw interne kennisbase ontsluiten, automatische rapportages en dashboards die uw team dagelijks sturen op de juiste KPI's.",
    tags: ["RAG-systemen", "Kennismanagement", "Dashboards", "Automatische rapportages"],
    metaTitle: "Data-intelligentie & Rapportages — Maison Blender | RAG-systemen en AI-dashboards",
    metaDescription:
      "Van ruwe data naar bruikbare inzichten met RAG-systemen, automatische rapportages en AI-dashboards. Maison Blender, specialist in data-intelligentie voor bedrijven in Zuid-Limburg.",
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
      "Uw bedrijf produceert dagelijks enorme hoeveelheden data — maar hoeveel daarvan gebruikt u daadwerkelijk om beslissingen te verbeteren? De meeste organisaties laten een groot deel van hun data onbenut liggen, verspreid over systemen, bestanden en inboxen. Maison Blender maakt die data werkbaar met slimme AI-oplossingen voor data-intelligentie en kennismanagement.",
      "Onze RAG-systemen (Retrieval-Augmented Generation) geven uw medewerkers directe toegang tot de collectieve kennis van uw organisatie. Stel vragen in gewone taal en ontvang nauwkeurige antwoorden gebaseerd op uw eigen documenten, contracten, handleidingen en dossiers — niet op generieke informatie van het internet. Dit is kennismanagement zoals het hoort te werken: snel, accuraat en direct toepasbaar.",
      "Naast kennisontsluitng bouwen wij geautomatiseerde rapportagesystemen en live dashboards die uw team dagelijks sturen op de juiste KPI's. Geen uren meer verliezen aan het handmatig samenstellen van managementrapportages. In plaats daarvan ontvangt u elke ochtend automatisch de cijfers die er toe doen, samengesteld door AI uit al uw databronnen. Afwijkingen worden proactief gesignaleerd voordat ze een probleem worden.",
      "Wij ondersteunen de volledige data-stack: van het inrichten van databronnen en pipelines, tot het bouwen van de AI-laag en de visualisatielaag. Wij werken samen met uw bestaande tools of bouwen iets nieuws als dat beter past. Het resultaat: een organisatie die stuurt op feiten in plaats van op gevoel.",
    ],
    benefits: [
      "Directe toegang tot uw interne kennisbase via AI",
      "Automatische rapportages — geen handmatig werk meer",
      "Proactieve alerting bij afwijkingen in uw data",
      "Betere beslissingen door actuele, accurate inzichten",
      "Integratie met al uw bestaande databronnen",
    ],
    useCases: [
      "Interne kennisbank doorzoekbaar maken met AI",
      "Dagelijkse managementrapportages automatiseren",
      "KPI-dashboards live bijhouden",
      "Contracten en dossiers analyseren",
      "Financiële afwijkingen automatisch signaleren",
    ],
    technologies: ["LangChain", "Anthropic Claude", "OpenAI", "Python", "Supabase", "Grafana"],
    jsonLdId: "https://maisonblender.com/diensten/data-intelligentie-rapportages#service",
    jsonLdServiceType: "Data-intelligentie & Business Intelligence",
  },
  {
    id: "06",
    slug: "ai-strategie-quickscan",
    title: "AI Strategie & Quickscan",
    subtitle: "Van strategie naar uitvoering",
    description:
      "Wij beginnen met een gratis automatiseringsquickscan van uw processen. U krijgt een concreet implementatieplan inclusief business case - zodat u weet wat het oplevert vóór u investeert.",
    tags: ["Gratis quickscan", "Implementatieroadmap", "Business case", "Team training"],
    metaTitle: "AI Strategie & Quickscan — Maison Blender | Gratis AI-scan voor Uw Bedrijf",
    metaDescription:
      "Start met een gratis automatiseringsquickscan. Maison Blender maakt een concreet AI-implementatieplan met business case voor uw bedrijf in Zuid-Limburg. Weet wat het oplevert vóór u investeert.",
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
      "Veel bedrijven weten dat AI kansen biedt, maar weten niet waar te beginnen of wat het hen concreet oplevert. Precies daar begint de samenwerking met Maison Blender: met een gratis automatiseringsquickscan die in beeld brengt welke van uw processen het meest geschikt zijn voor AI-automatisering en wat de verwachte impact is.",
      "Tijdens de quickscan analyseren wij uw workflows, tijdsbesteding en pijnpunten. Wij kijken naar volume, complexiteit en repetitiviteit van taken, en identificeren de tien tot vijftien processen met het hoogste automatiseringspotentieel. Per proces berekenen wij de verwachte tijdsbesparing, kostenverlaging en kwaliteitsverbetering. U ontvangt een heldere prioriteitenmatrix: wat levert het meeste op, wat is het snelst te implementeren, en wat vereist een langere adem.",
      "Op basis van de scan stellen wij een implementatieroadmap op — een concreet, gefaseerd plan met tijdlijnen, benodigde investeringen en verwachte returns. Geen vage adviezen, maar een uitvoerbaar plan dat u direct kunt gebruiken. Wij denken mee over change management: hoe zorgt u dat uw team de nieuwe tools omarmt en er optimaal gebruik van maakt?",
      "Na de strategie-fase kunt u de uitvoering bij ons neerleggen. Wij implementeren de oplossingen die in de roadmap staan — chatbots, AI-agents, RPA, maatwerksoftware — en begeleiden uw team in het werken met AI. Zo bent u nooit afhankelijk van één leverancier voor kennis, maar bouwt u interne expertise op die uw organisatie op de lange termijn versterkt.",
    ],
    benefits: [
      "Gratis quickscan zonder verplichtingen",
      "Concreet implementatieplan met ROI-berekening",
      "Prioriteitenmatrix: wat levert het meeste op",
      "Onafhankelijk advies over tools en aanpak",
      "Volledige begeleiding van strategie tot uitvoering",
    ],
    useCases: [
      "Inventarisatie van automatiseringskansen",
      "Business case opbouwen voor directie of board",
      "Team trainen in werken met AI",
      "Leveranciersselectie voor AI-tools",
      "Change management bij AI-implementatie",
    ],
    technologies: ["OpenAI", "Anthropic Claude", "n8n", "Make.com", "LangChain", "Microsoft Azure AI"],
    jsonLdId: "https://maisonblender.com/diensten/ai-strategie-quickscan#service",
    jsonLdServiceType: "AI Strategie Consultancy",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
