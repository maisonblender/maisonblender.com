export interface TagFaq {
  question: string;
  answer: string;
}

export interface TagPage {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  parentSlug: string;
  parentTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  longDescription: string[];
  benefits: string[];
  faqs: TagFaq[];
  technologies: string[];
  tags: string[];
  heroImage?: { src: string; alt: string };
  jsonLdId: string;
}

export const tagPages: TagPage[] = [
  {
    slug: "whatsapp-chatbot",
    title: "WhatsApp chatbot laten bouwen",
    subtitle: "Automatisch klantcontact via WhatsApp",
    description:
      "Een WhatsApp chatbot van MAISON BLNDR handelt klantvragen af, plant afspraken in en kwalificeert leads - automatisch, 24/7, in de app die je klanten al dagelijks gebruiken.",
    parentSlug: "ai-chatbots-klantenservice",
    parentTitle: "AI Chatbots & Klantenservice",
    metaTitle:
      "WhatsApp chatbot laten bouwen - MAISON BLNDR Limburg | Zakelijk WhatsApp automatiseren",
    metaDescription:
      "WhatsApp chatbot zakelijk laten bouwen? MAISON BLNDR automatiseert je klantcontact via WhatsApp Business API. 70–85% minder handmatig werk. Actief in Sittard en heel Limburg.",
    keywords: [
      "whatsapp chatbot zakelijk",
      "whatsapp chatbot bedrijf",
      "chatbot voor website",
      "whatsapp automatisering",
      "whatsapp business chatbot",
      "whatsapp klantenservice automatiseren",
    ],
    longDescription: [
      "Je klanten zitten al op WhatsApp. De vraag is of jij er op reageert als je team offline is. Onze chatbot antwoordt direct, begrijpt intentie en zet de juiste actie uit. Geen standaard FAQ-tekst.",
      "Via de officiële WhatsApp Business API, gekoppeld aan CRM, agenda en kennisbank. De bot kent de klant, eerdere vragen en orderstatus. Vraagt iemand om een mens? Overdracht met context.",
      "APK-afspraken voor een garage, herinneringen voor een kliniek, retouren voor een webshop: 70–85% van het inkomende contact gaat zelfstandig.",
      "Wij regelen API-toegang, training op jouw producten en koppelingen. Zelfde team als de implementatie, ook in Limburg.",
    ],
    benefits: [
      "Bereikbaar op het kanaal dat klanten al gebruiken",
      "70–85% van contacten automatisch afgehandeld",
      "Overdracht naar medewerker met gesprekscontext",
      "Koppeling met CRM, agenda en kennisbank",
      "Officiële WhatsApp Business API",
    ],
    faqs: [
      {
        question: "Wat is een WhatsApp chatbot en hoe werkt het?",
        answer:
          "Een WhatsApp chatbot is een geautomatiseerde gesprekspartner die via WhatsApp communiceert. Je klant stuurt een bericht, de chatbot begrijpt de intentie, haalt informatie op uit je systemen en stuurt een antwoord - of voert een actie uit zoals het inplannen van een afspraak. De chatbot draait op de officiële WhatsApp Business API en is verbonden met jouw CRM of kennisbank.",
      },
      {
        question:
          "Wat zijn de voordelen van een WhatsApp chatbot voor het MKB?",
        answer:
          "Je bent 24/7 bereikbaar zonder extra personeel. Klanten hoeven niet te wachten op een reactie per e-mail. Repetitieve vragen worden automatisch beantwoord, zodat je team tijd overhoudt voor complexe taken. Uit onze implementaties blijkt dat 70–85% van het inkomende klantcontact zelfstandig wordt afgehandeld.",
      },
      {
        question: "Wat kost een WhatsApp chatbot laten bouwen?",
        answer:
          "De investering hangt af van de complexiteit van de integraties en het aantal geautomatiseerde gespreksflows. Na de gratis quickscan ontvang je een concreet voorstel. Een basisimplementatie start bij een paar duizend euro; complexere integraties met CRM en ERP liggen hoger. De terugverdientijd is bij de meeste klanten minder dan zes maanden.",
      },
      {
        question: "Hoe lang duurt een WhatsApp chatbot implementatie?",
        answer:
          "Een standaard implementatie is doorgaans klaar in vier tot acht weken. Dat omvat het aanvragen van de WhatsApp Business API-toegang (twee tot drie weken), het bouwen en trainen van de chatbot en de integratie met je systemen. Voor complexere scenario's rekenen we acht tot twaalf weken.",
      },
      {
        question:
          "Welke bedrijven in Limburg gebruiken al een WhatsApp chatbot?",
        answer:
          "Bedrijven in de zorg, dienstverlening, retail en zakelijke dienstverlening in Limburg zetten al WhatsApp chatbots in voor afspraakplanning, klantenservice en leadopvolging. Vanwege vertrouwelijkheidsafspraken noemen we klanten niet bij naam, maar bij een gratis strategiegesprek lopen we concrete cases door.",
      },
    ],
    technologies: [
      "WhatsApp Business API",
      "OpenAI",
      "Anthropic Claude",
      "HubSpot",
      "Twilio",
    ],
    tags: [
      "WhatsApp Business API",
      "Conversational AI",
      "Lead generatie",
      "CRM-integratie",
    ],
    heroImage: { src: "/images/tag-whatsapp-chatbot.png", alt: "WhatsApp chatbot met AI chat bubbles op smartphone - automatisch klantcontact via WhatsApp voor bedrijven in Limburg" },
    jsonLdId:
      "https://maisonblender.com/diensten/whatsapp-chatbot#service",
  },
  {
    slug: "robotic-process-automation",
    title: "Robotic Process Automation",
    subtitle: "Digitale robots die jouw handmatige taken overnemen",
    description:
      "RPA-robots van MAISON BLNDR automatiseren schermtaken, koppelen systemen en verwerken data - betrouwbaar, foutloos en beheerd door ons door ons.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "Robotic Process Automation bureau - MAISON BLNDR Limburg | RPA implementeren",
    metaDescription:
      "RPA laten implementeren door een specialist in Limburg? MAISON BLNDR automatiseert repetitieve taken met Robotic Process Automation. Gemiddeld 15-25 uur tijdsbesparing per week. Gratis quickscan beschikbaar.",
    keywords: [
      "robotic process automation bureau",
      "RPA implementeren",
      "RPA software nederland",
      "procesautomatisering RPA",
      "RPA Limburg",
      "softwarerobot bedrijf",
    ],
    longDescription: [
      "RPA laat een softwarerobot klikken, kopiëren en invullen zoals een medewerker. Sneller, zonder typfouten. Voor MKB in Limburg vaak de snelste winst zonder systemen te vervangen.",
      "We starten met wat het meeste tijd en fouten kost: facturen naar boekhouding, sync tussen pakketten, maandrapporten uit meerdere bronnen. Bouwen, testen, beheren.",
      "Ook zonder API: de robot werkt via het scherm. Legacy ERP of leveranciersportaal kan meestal toch mee.",
      "Klanten besparen gemiddeld 15–25 uur per week. ROI vaak binnen drie maanden. Bij updates passen wij de robots aan.",
    ],
    benefits: [
      "Geen bestaande systemen vervangen - RPA werkt bovenop wat je al hebt",
      "Gemiddeld 15–25 uur tijdsbesparing per week",
      "ROI zichtbaar binnen drie maanden",
      "Beheerd door ons - inclusief updates bij systeemwijzigingen",
      "Werkt ook op legacy-systemen zonder API",
    ],
    faqs: [
      {
        question: "Wat is Robotic Process Automation (RPA) precies?",
        answer:
          "RPA is software die de handelingen van een medewerker op een computer automatisch uitvoert: klikken, kopiëren, invullen, opslaan. De software-robot werkt met je bestaande systemen zonder dat die aangepast hoeven te worden. Ideaal voor herhaalbare, regelgebaseerde taken die nu handmatig worden gedaan.",
      },
      {
        question: "Wat zijn de voordelen van RPA voor het MKB?",
        answer:
          "Minder uren aan copy-paste en meer tijd voor werk dat echt telt. Minder fouten in data, snellere verwerking, en een audittrail van elke stap.",
      },
      {
        question: "Wat kost RPA laten implementeren?",
        answer:
          "De investering hangt af van het aantal processen en de complexiteit van de integraties. Na de gratis quickscan ontvang je een concreet voorstel. De meeste RPA-projecten voor MKB liggen in de range van enkele duizenden euro's, met een terugverdientijd van twee tot zes maanden.",
      },
      {
        question: "Hoe lang duurt een RPA-implementatie?",
        answer:
          "Een enkelvoudig proces automatiseren kost doorgaans twee tot vier weken. Complexere multi-process implementaties nemen zes tot twaalf weken in beslag. Wij werken in iteraties zodat je snel de eerste resultaten ziet, terwijl we de scope stap voor stap uitbreiden.",
      },
      {
        question: "Werkt RPA ook als we verouderde software gebruiken?",
        answer:
          "Ja - dat is juist een van de sterkste punten van RPA. Omdat de robot werkt via de gebruikersinterface (het scherm), is het niet afhankelijk van API's of moderne software. Zelfs twintig jaar oude systemen zonder koppelmogelijkheden zijn automatiseerbaar met RPA.",
      },
    ],
    technologies: [
      "n8n",
      "Make.com",
      "Python",
      "Selenium",
      "UiPath",
      "REST API-integraties",
    ],
    tags: [
      "Schermautomatisering",
      "Procesautomatisering",
      "Legacy-systemen",
      "Workflow-automatisering",
    ],
    heroImage: { src: "/images/tag-robotic-process-automation.png", alt: "Digitale robot voert handmatige taken automatisch uit op de computer - Robotic Process Automation voor MKB in Limburg" },
    jsonLdId:
      "https://maisonblender.com/diensten/robotic-process-automation#service",
  },
  {
    slug: "conversational-ai",
    title: "Conversational AI",
    subtitle: "gesprekken op elk kanaal",
    description:
      "AI-agents die intentie begrijpen, context onthouden en actie zetten op web, WhatsApp, e-mail en telefoon.",
    parentSlug: "ai-chatbots-klantenservice",
    parentTitle: "AI Chatbots & Klantenservice",
    metaTitle:
      "Conversational AI bureau - MAISON BLNDR Limburg | chatbot bouwen",
    metaDescription:
      "Conversational AI platform laten bouwen door een specialist? MAISON BLNDR ontwikkelt AI-agents die intentie begrijpen en acties uitvoeren. Actief voor bedrijven in Limburg.",
    keywords: [
      "conversational ai bureau",
      "ai chatbot bouwen",
      "conversational ai platform",
      "chatbot",
      "conversational ai Limburg",
      "ai klantenservice agent",
    ],
    longDescription: [
      "Conversational AI begrijpt intentie, onthoudt context en weet wanneer te vragen of te handelen. Een script-chatbot volgt paden; dit voelt als een gesprek.",
      "We bouwen agents op sterke taalmodellen plus jouw data: producten, klantgeschiedenis, processen. Toon past zich aan: zakelijk of service.",
      "Ook intern: vragen aan de kennisbank in gewone taal, of sales die leads kwalificeert vóór overdracht.",
      "Productierijp genoeg voor echte omgevingen. We hebben trajecten in Limburg afgerond en kennen de valkuilen.",
    ],
    benefits: [
      "Begrijpt intentie, niet alleen trefwoorden",
      "Beschikbaar op elk kanaal: web, WhatsApp, e-mail, telefoon",
      "Leert van elk gesprek en wordt continu beter",
      "Integreert met CRM, kennisbank en bedrijfssystemen",
      "Van simpele FAQ-bot tot complexe multi-turn agents",
    ],
    faqs: [
      {
        question:
          "Wat is conversational AI en wat maakt het anders dan een chatbot?",
        answer:
          "Een traditionele chatbot volgt vooraf ingestelde paden. Conversational AI begrijpt de intentie achter een boodschap, houdt context bij over meerdere berichten en kan omgaan met variaties in taal en formulering. Het voelt als een gesprek met een competente medewerker, niet als navigatie door een keuzemenu.",
      },
      {
        question: "Op welke kanalen werkt een conversational AI-agent?",
        answer:
          "Een conversational AI-agent kan worden ingezet op je website (live chat), WhatsApp Business, e-mail, Slack en zelfs via telefoon (met spraakherkenning). Wij bouwen omnichannel agents die de context meenemen als een klant van kanaal wisselt.",
      },
      {
        question: "Wat kost een conversational AI-platform bouwen?",
        answer:
          "De investering hangt af van het aantal kanalen, de diepte van de integraties en de complexiteit van de gespreksflows. Na de gratis quickscan ontvang je een gedetailleerd voorstel. Startende implementaties beginnen bij een paar duizend euro; enterprise omnichannel agents liggen hoger.",
      },
      {
        question: "Hoe lang duurt een conversational AI-implementatie?",
        answer:
          "Een eerste werkende versie is doorgaans klaar in vier tot zes weken. Dit omvat het trainen op je eigen data, de integraties met je systemen en uitgebreid testen. Na livegang monitoren en optimaliseren we op basis van echte gesprekken.",
      },
      {
        question:
          "Kunnen bedrijven in Limburg voorbeelden zien van conversational AI in de praktijk?",
        answer:
          "Plan een gratis strategiegesprek in Sittard. We laten zien hoe vergelijkbare agents presteren en wat dat voor jouw situatie betekent.",
      },
    ],
    technologies: [
      "OpenAI",
      "Anthropic Claude",
      "LangChain",
      "WhatsApp Business API",
      "Twilio",
      "n8n",
    ],
    tags: [
      "Intentieherkenning",
      "Multi-turn gesprekken",
      "Omnichannel",
      "CRM-integratie",
    ],
    heroImage: { src: "/images/tag-conversational-ai.png", alt: "Conversational AI: mens en AI-brain voeren gesprekken via teal verbindingslijnen - meertalige AI op elk kanaal" },
    jsonLdId:
      "https://maisonblender.com/diensten/conversational-ai#service",
  },
  {
    slug: "rag-systemen",
    title: "RAG-systemen",
    subtitle: "Je eigen data doorzoekbaar met AI",
    description:
      "Een RAG-systeem van MAISON BLNDR geeft medewerkers directe toegang tot alle interne kennis via AI - documenten, contracten, handleidingen - in gewone taal, met accurate antwoorden.",
    parentSlug: "data-intelligentie-rapportages",
    parentTitle: "Data-intelligentie & Rapportages",
    metaTitle:
      "RAG systeem implementeren - MAISON BLNDR Limburg | Retrieval-Augmented Generation",
    metaDescription:
      "RAG systeem laten implementeren voor je bedrijf? MAISON BLNDR koppelt AI aan jouw eigen documenten en kennisbank. Antwoorden gebaseerd op jouw data, niet op het internet. Actief in Limburg.",
    keywords: [
      "rag systeem implementeren",
      "retrieval augmented generation",
      "kennisbank AI",
      "AI op eigen data",
      "RAG bureau Limburg",
      "enterprise AI kennissysteem",
    ],
    longDescription: [
      "RAG koppelt een taalmodel aan jouw documenten. Antwoorden komen uit je eigen data, niet uit het open web. Vragen in gewone taal, antwoord met bron.",
      "Word, PDF, Excel, mail, SharePoint, Confluence: we indexeren en bouwen een interface die relevante passages ophaalt.",
      "Snellere onboarding, contractinfo bij de klant op locatie, consistente antwoorden in service zonder mapjes doorzoeken.",
      "On-premise of beveiligde cloud. Jouw data blijft waar jij dat wilt.",
    ],
    benefits: [
      "Directe toegang tot interne kennis in gewone taal",
      "Antwoorden altijd gebaseerd op jouw actuele documenten",
      "Bronvermelding bij elk antwoord - transparant en controleerbaar",
      "Werkt met alle gangbare documentformaten",
      "Veilig: on-premise of eigen cloudomgeving mogelijk",
    ],
    faqs: [
      {
        question: "Wat is een RAG-systeem en hoe werkt het?",
        answer:
          "RAG (Retrieval-Augmented Generation) combineert een AI-taalmodel met een zoekmechanisme over jouw documenten. Stel je een vraag, dan zoekt het systeem de meest relevante passages op in je eigen documenten en gebruikt die als basis voor het antwoord. De AI verzint niets - alles is terug te herleiden naar bronnen in jouw eigen data.",
      },
      {
        question: "Welke documenten kan een RAG-systeem verwerken?",
        answer:
          "Bijna alles: PDF's, Word-documenten, Excel-bestanden, PowerPoints, e-mails, Confluence-pagina's, SharePoint-inhoud, webteksten en meer. Wij stellen de datapipeline in op jouw specifieke documenttypes en -structuren.",
      },
      {
        question: "Wat kost een RAG-systeem implementeren?",
        answer:
          "De investering hangt af van de hoeveelheid data, de beveiligingseisen en de integratiecomplexiteit. Na de gratis quickscan ontvang je een concreet voorstel. De ROI is zichtbaar in tijdsbesparing op kennisopzoeking en snellere onboarding van nieuwe medewerkers.",
      },
      {
        question:
          "Hoe snel werkt een RAG-systeem bij grote documentbibliotheken?",
        answer:
          "Zoekopdrachten worden doorgaans beantwoord binnen één tot drie seconden, ook bij duizenden documenten. De vectordatabase schakelt extreem snel en de AI-generatiestap neemt de meeste tijd. Wij optimaliseren de architectuur op jouw specifieke gebruik.",
      },
      {
        question:
          "Is een RAG-systeem veilig voor gevoelige bedrijfsdocumenten in Limburg?",
        answer:
          "Ja, mits juist ingericht. We kunnen een RAG-systeem volledig on-premise draaien - jouw data verlaat je eigen serveromgeving niet. Ook cloud-implementaties zijn mogelijk in een geïsoleerde, beveiligde omgeving (bijv. Azure Private Link). We adviseren je over de beste aanpak voor jouw compliancevereisten.",
      },
    ],
    technologies: [
      "LangChain",
      "Anthropic Claude",
      "OpenAI",
      "Supabase pgvector",
      "Pinecone",
      "Python",
    ],
    tags: [
      "Vectordatabase",
      "Documentherkenning",
      "Kennisborging",
      "On-premise mogelijk",
    ],
    heroImage: { src: "/images/tag-rag-systemen.png", alt: "RAG-systeem: AI doorzoekt kennisdatabase en retourneert precieze data - bedrijfseigen data doorzoekbaar met AI in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/rag-systemen#service",
  },
  {
    slug: "crm-erp-koppelingen",
    title: "CRM & ERP-koppelingen",
    subtitle: "Systemen die automatisch met elkaar praten",
    description:
      "MAISON BLNDR koppelt je CRM, ERP en andere software via robuuste API-integraties en AI-automatisering - zodat data automatisch klopt en je team nooit dubbel invoert.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "CRM koppeling automatisering - MAISON BLNDR Limburg | ERP integratie bureau",
    metaDescription:
      "CRM en ERP koppelen met AI-automatisering? MAISON BLNDR bouwt robuuste API-integraties voor HubSpot, Salesforce, SAP, AFAS en Exact. Geen dubbele invoer meer. Actief in Limburg.",
    keywords: [
      "crm koppeling automatisering",
      "ERP integratie bureau",
      "API koppeling CRM",
      "systemen koppelen AI",
      "CRM ERP integratie Limburg",
      "HubSpot SAP koppeling",
    ],
    longDescription: [
      "CRM, ERP, webshop, projecttool: overlappende data, handmatig overzetten als ze niet praten. Wij koppelen zodat de juiste info automatisch meeloopt.",
      "Van webhooks tot tweerichting-sync met logging. REST, GraphQL, HubSpot, Salesforce, SAP, Exact, AFAS, Shopify, n8n, Make.com.",
      "Waar het helpt: AI die leads verrijkt en in de juiste pipeline zet, of offertes uit ERP die direct naar de klant gaan.",
      "Maatwerk voor complexe of branchespecifieke pakketten in Limburg. Met API, en soms zonder.",
    ],
    benefits: [
      "Geen dubbele invoer meer tussen systemen",
      "Real-time data-synchronisatie tussen CRM, ERP en overige tools",
      "AI-laag bovenop integraties voor slimmere automatisering",
      "Ervaring met SAP, AFAS, Exact, HubSpot, Salesforce en meer",
      "Robuust gebouwd met foutafhandeling en monitoring",
    ],
    faqs: [
      {
        question:
          "Wat is het verschil tussen een API-koppeling en een integratie?",
        answer:
          "Een API-koppeling is de technische verbinding tussen twee systemen via hun programmeerinterface. Een integratie is breder: het omvat de koppeling plus de logica die bepaalt welke data wanneer wordt uitgewisseld, hoe conflicten worden opgelost en wat er gebeurt als er iets fout gaat. Wij bouwen complete integraties, niet alleen technische verbindingen.",
      },
      {
        question: "Welke CRM- en ERP-systemen kunnen worden gekoppeld?",
        answer:
          "Wij koppelen alle gangbare systemen: HubSpot, Salesforce, Pipedrive en Microsoft Dynamics aan CRM-kant; SAP, AFAS, Exact, Odoo en UNIT4 aan ERP-kant. Aanvullend koppelen we webshops (Shopify, WooCommerce), projecttools (Asana, Monday, Jira) en branchespecifieke pakketten.",
      },
      {
        question: "Wat kost een CRM-ERP koppeling laten bouwen?",
        answer:
          "De investering hangt sterk af van de complexiteit - het aantal systemen, de richting van de synchronisatie en de gewenste businesslogica. Na de gratis quickscan ontvang je een transparant voorstel. Eenvoudige koppelingen zijn betaalbaar voor elk MKB-budget; complexere bi-directionele integraties vragen meer.",
      },
      {
        question: "Hoe lang duurt een ERP-koppeling bouwen?",
        answer:
          "Een enkelvoudige koppeling tussen twee systemen is doorgaans klaar in twee tot vier weken. Complexere multi-system integraties met AI-lagen nemen zes tot twaalf weken in beslag, afhankelijk van API-documentatie en testbaarheid van de systemen.",
      },
      {
        question:
          "Kunnen bestaande Limburgse bedrijfssystemen worden gekoppeld zonder volledige migratie?",
        answer:
          "Ja - koppelingen vereisen geen vervanging of migratie van bestaande systemen. We verbinden wat je al hebt. In gevallen waar geen directe API beschikbaar is, gebruiken we RPA of screen-scraping om toch een betrouwbare koppeling te realiseren.",
      },
    ],
    technologies: [
      "n8n",
      "Make.com",
      "REST API",
      "GraphQL",
      "HubSpot",
      "Salesforce",
      "SAP",
      "AFAS",
      "Exact",
    ],
    tags: [
      "Bi-directionele sync",
      "Webhooks",
      "Middleware",
      "Real-time data",
    ],
    heroImage: { src: "/images/tag-crm-erp-koppelingen.png", alt: "CRM en ERP systemen verbonden via bidirectionele teal API-koppelingen - automatische systeemintegraties voor bedrijven in Limburg" },
    jsonLdId:
      "https://maisonblender.com/diensten/crm-erp-koppelingen#service",
  },
  {
    slug: "factuurverwerking-automatiseren",
    title: "Factuurverwerking automatiseren",
    subtitle: "Van inbox naar boekhouding - automatisch",
    description:
      "MAISON BLNDR automatiseert de volledige factuurverwerking: PDF's uitlezen, regels matchen, goedkeuringen routeren en boeken in je boekhoudpakket - zonder handmatig werk.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "Factuurverwerking automatiseren met AI - MAISON BLNDR Limburg | AP-automatisering",
    metaDescription:
      "Factuurverwerking automatiseren met AI? MAISON BLNDR verwerkt inkomende facturen automatisch in Exact, AFAS en SAP. 80–90% tijdsbesparing. Gratis quickscan beschikbaar in Limburg.",
    keywords: [
      "factuurverwerking automatiseren",
      "automatische factuurverwerking",
      "facturen verwerken AI",
      "AP-automatisering",
      "factuurherkenning software",
      "crediteuren automatiseren Limburg",
    ],
    longDescription: [
      "Inkomende factuur: uitlezen, matchen, goedkeuren, boeken. Bij volume wordt dat snel een halve FTE. Wij automatiseren de hele keten.",
      "PDF, mail, scan, UBL: leverancier, regels, BTW, kostenplaats. Match met inkooporders in ERP. Klopt het? Boeken. Niet? Naar de juiste persoon met context.",
      "Boven 95% nauwkeurigheid bij bekende, gestructureerde facturen. Nieuwe layouts leren mee. Goedkeuringsflows op maat.",
      "Vanaf ~50 facturen/maand vaak 80–90% tijdsbesparing. Koppeling met Exact, AFAS, SAP, Twinfield, Snelstart. Volledige audittrail.",
    ],
    benefits: [
      "80–90% tijdsbesparing op factuurverwerking",
      "Meer dan 95% nauwkeurigheid bij gestructureerde facturen",
      "Volledige audit-trail voor compliance",
      "Integreert met Exact, AFAS, SAP, Twinfield en meer",
      "Goedkeuringsflows op maat voor jouw organisatie",
    ],
    faqs: [
      {
        question: "Hoe werkt automatische factuurverwerking met AI?",
        answer:
          "AI-factuurverwerking combineert documentherkenning (OCR) met een taalmodel dat de structuur en betekenis van de factuurdata begrijpt. Het systeem extraheert alle relevante velden, matcht ze aan je bestaande data (inkooporders, leveranciersgegevens) en neemt automatisch de juiste actie - boeken of routeren voor goedkeuring.",
      },
      {
        question: "Welke factuurformaten worden ondersteund?",
        answer:
          "Alle gangbare formaten: PDF (zowel digitaal als gescand), e-mail-bijlagen, UBL-XML (e-factuur), EDI en factuurbeelden. Het systeem leert ook leverancierspecifieke layouts die afwijken van de standaard.",
      },
      {
        question: "Wat kost factuurverwerking automatiseren?",
        answer:
          "De investering hangt af van het factuurvolume, het gewenste automatiseringspercentage en de integratiecomplexiteit. Na de gratis quickscan ontvang je een transparant voorstel met ROI-berekening. Bij een volume van honderd facturen per maand verdient de meeste implementaties zichzelf terug binnen zes maanden.",
      },
      {
        question:
          "Hoe lang duurt de implementatie van automatische factuurverwerking?",
        answer:
          "Een standaard implementatie is klaar in vier tot acht weken. Dit omvat de integratie met je boekhoudpakket, het trainen van het model op jouw leveranciersfacturen en het inrichten van de goedkeuringsflows. Daarna gaat het systeem in productie met een monitoring-periode.",
      },
      {
        question:
          "Is automatische factuurverwerking veilig en AVG-compliant voor bedrijven in Limburg?",
        answer:
          "Ja, mits juist ingericht. Wij implementeren de verwerking in een beveiligde omgeving die voldoet aan AVG-vereisten. Factuurdata wordt niet gedeeld met derden. De volledige verwerkingsgeschiedenis is beschikbaar voor audit-doeleinden.",
      },
    ],
    technologies: [
      "Python",
      "OpenAI",
      "Azure Document Intelligence",
      "n8n",
      "Exact",
      "AFAS",
      "SAP",
    ],
    tags: [
      "OCR & documentherkenning",
      "Inkooporder-matching",
      "Goedkeuringsflows",
      "AVG-compliant",
    ],
    heroImage: { src: "/images/tag-factuurverwerking.png", alt: "Factuur vloeit automatisch van inbox via scannen naar boekhouding - factuurverwerking automatiseren met AI voor MKB in Limburg" },
    jsonLdId:
      "https://maisonblender.com/diensten/factuurverwerking-automatiseren#service",
  },
  {
    slug: "ai-quickscan",
    title: "Gratis AI quickscan",
    subtitle: "Weet wat AI oplevert vóór je investeert",
    description:
      "In een gratis automatiseringsquickscan brengt MAISON BLNDR de vijftien meest kansrijke automatiseringsmogelijkheden in je bedrijf in kaart - met verwachte ROI per kans.",
    parentSlug: "ai-strategie-quickscan",
    parentTitle: "AI Strategie & Quickscan",
    metaTitle:
      "Gratis AI quickscan voor je bedrijf - MAISON BLNDR Limburg | Automatisering scan",
    metaDescription:
      "Gratis AI quickscan aanvragen? MAISON BLNDR brengt de automatiseringskansen in je bedrijf in kaart met concrete ROI-schattingen. Geen verplichtingen. Actief in Sittard en heel Limburg.",
    keywords: [
      "ai quickscan gratis",
      "automatisering quickscan",
      "AI scan bedrijf",
      "gratis AI analyse",
      "AI potentieel scan",
      "automatisering scan Limburg",
    ],
    longDescription: [
      "Veel bedrijven willen met AI maar weten niet waar te beginnen. De gratis quickscan haalt die onzekerheid weg: in één sessie brengen we je belangrijkste processen in kaart.",
      "Intake van twee tot drie uur met proceseigenaren. We kijken naar volume, herhaling, fouten en strategisch belang. Daaruit volgt een prioriteitenmatrix: wat levert het meest op en wat is het snelst te bouwen?",
      "Per kans: huidige situatie, aanpak, geschatte besparing, indicatieve investering. Cijfers die je direct als business case kunt gebruiken.",
      "Gratis, zonder verplichting. Of je daarna met ons of iemand anders verdergaat, bepaal jij. Veel teams starten wel na het rapport.",
    ],
    benefits: [
      "Volledig gratis, geen verplichtingen",
      "Concrete ROI-schatting per automatiseringskans",
      "Bruikbaar als business case voor directie of board",
      "Uitgevoerd door practitioners, niet door consultants",
      "Rapport binnen vijf werkdagen in handen",
    ],
    faqs: [
      {
        question: "Wat houdt de gratis AI quickscan precies in?",
        answer:
          "Een intake van twee tot drie uur met sleutelpersonen uit jouw bedrijf, gevolgd door een analyse en een rapport met de vijftien meest kansrijke automatiseringsmogelijkheden. Per kans beschrijven we de huidige situatie, de aanbevolen aanpak, de verwachte besparing en de indicatieve investering.",
      },
      {
        question: "Wie voert de quickscan uit?",
        answer:
          "De quickscan wordt uitgevoerd door de consultants van MAISON BLNDR - dezelfde mensen die ook de implementaties doen. Geen juniors of stagiaires, maar practitioners met hands-on ervaring in AI-implementatie bij bedrijven in Limburg.",
      },
      {
        question: "Is de quickscan echt gratis?",
        answer:
          "Ja, zonder verborgen kosten. Wij vragen geen tegenprestatie en er zijn geen verplichtingen. Wij doen dit omdat een goed geïnformeerde klant een betere klant is - en omdat ons rapport voor zichzelf spreekt.",
      },
      {
        question: "Hoe lang duurt het voordat ik het rapport ontvang?",
        answer:
          "Binnen vijf werkdagen na de intake. Het rapport is in PDF-formaat en bevat een prioriteitenmatrix, per-proces-analyses en een aanbevolen implementatievolgorde.",
      },
      {
        question:
          "Zijn er ook bedrijven in Limburg die al een AI quickscan hebben gedaan?",
        answer:
          "Ja. MAISON BLNDR heeft quickscans uitgevoerd voor bedrijven in diverse sectoren in Limburg: maakindustrie, zakelijke dienstverlening, zorg en retail. Vanwege vertrouwelijkheid noemen we namen niet publiekelijk, maar tijdens het strategiegesprek bespreken we vergelijkbare cases.",
      },
    ],
    technologies: [
      "OpenAI",
      "Anthropic Claude",
      "n8n",
      "Make.com",
      "LangChain",
      "Microsoft Azure AI",
    ],
    tags: [
      "Prioriteitenmatrix",
      "ROI-berekening",
      "Procesanalyse",
      "Zonder verplichtingen",
    ],
    heroImage: { src: "/images/tag-ai-quickscan.png", alt: "AI quickscan: vergrootglas met AI-circuit scant bedrijf op automatiseringsmogelijkheden - gratis AI quickscan voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/ai-quickscan#service",
  },
  {
    slug: "lead-generatie-chatbot",
    title: "Lead generatie via chatbot",
    subtitle: "Automatisch leads kwalificeren via AI",
    description:
      "Een lead generatie chatbot van MAISON BLNDR kwalificeert bezoekers, verzamelt contactgegevens en stuurt warme leads direct door naar je verkoopteam - dag en nacht, zonder handmatig werk.",
    parentSlug: "ai-chatbots-klantenservice",
    parentTitle: "AI Chatbots & Klantenservice",
    metaTitle:
      "Lead generatie chatbot - MAISON BLNDR Limburg | AI leadgeneratie B2B",
    metaDescription:
      "Lead generatie chatbot laten bouwen in Limburg? MAISON BLNDR automatiseert leadkwalificatie en salesfunnel via AI. Warme leads zonder extra handwerk. Gratis strategiegesprek.",
    keywords: [
      "lead generatie chatbot",
      "chatbot leads genereren",
      "ai leadgeneratie b2b",
      "leadkwalificatie automatisering",
      "lead nurturing chatbot",
      "salesfunnel automatiseren",
    ],
    longDescription: [
      "De meeste websitebezoekers vertrekken zonder spoor. Een lead-chatbot spreekt op het juiste moment aan, stelt gerichte vragen en kwalificeert in real-time.",
      "Aansluitend op je salesproces: budget, timing, behoefte. Gekwalificeerde leads gaan naar CRM met het volledige gesprek. Je team belt niet meer blind.",
      "Sterk voor B2B in Limburg: leads buiten kantooruren blijven warm, productvragen worden beantwoord, afspraken kunnen direct ingepland.",
      "Na livegang optimaliseren we flows op basis van echte data. Geen statisch formulier, maar iets dat meeleert.",
    ],
    benefits: [
      "Leads kwalificeren buiten kantooruren zonder extra personeel",
      "Volledig gespreksverloop direct in je CRM",
      "Hogere leadkwaliteit door gerichte kwalificatievragen",
      "Naadloze overdracht naar je verkoopteam",
      "Continu lerende bot die steeds beter converteert",
    ],
    faqs: [
      {
        question: "Wat is een lead generatie chatbot en hoe werkt het?",
        answer:
          "Een lead generatie chatbot is een geautomatiseerde gesprekspartner op je website die bezoekers kwalificeert als potentiële klant. De chatbot stelt gerichte vragen over budget, behoefte en tijdlijn, en stuurt gekwalificeerde leads met volledige gesprekscontext door naar je CRM en verkoopteam.",
      },
      {
        question: "Wat is het verschil met een gewoon contactformulier?",
        answer:
          "Een formulier is passief en koud. Een lead generatie chatbot is actief: het spreekt bezoekers aan, past vragen aan op basis van antwoorden, beantwoordt bezwaren en houdt de aandacht vast. Conversiepercentages liggen doorgaans twee tot vier keer hoger dan bij standaard formulieren.",
      },
      {
        question: "Met welke CRM-systemen integreert de chatbot?",
        answer:
          "MAISON BLNDR integreert lead generatie chatbots met alle gangbare CRM-systemen: HubSpot, Salesforce, Pipedrive, Microsoft Dynamics en branchespecifieke pakketten. Leads worden inclusief gespreksverloop en kwalificatiescore direct aangemaakt in het systeem dat jij gebruikt.",
      },
      {
        question: "Is een lead generatie chatbot geschikt voor B2B in Limburg?",
        answer:
          "Ja. Juist voor B2B in de regio is het waardevol: prospects die je website bezoeken buiten kantoortijd worden niet koud. De chatbot kwalificeert, beantwoordt productvragen en plant afspraken in. MAISON BLNDR heeft deze implementaties gedaan voor zakelijke dienstverleners en industriebedrijven in Limburg.",
      },
      {
        question: "Hoe snel levert een lead generatie chatbot resultaat?",
        answer:
          "De eerste gekwalificeerde leads via de chatbot zie je doorgaans binnen de eerste week na lancering. Optimalisatie van de gespreksflows - op basis van echte data - levert de grootste conversieverbeteringen na vier tot acht weken. MAISON BLNDR begeleidt dit optimalisatieproces.",
      },
    ],
    technologies: [
      "OpenAI",
      "Anthropic Claude",
      "HubSpot",
      "Salesforce",
      "Pipedrive",
      "WhatsApp Business API",
    ],
    tags: ["Leadkwalificatie", "CRM-integratie", "Conversational AI", "B2B sales"],
    heroImage: { src: "/images/tag-lead-generatie-chatbot.png", alt: "Leadgeneratie funnel: websitebezoekers stromen via AI chatbot naar gekwalificeerde leads - automatische leadgeneratie via chatbot in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/lead-generatie-chatbot#service",
  },
  {
    slug: "omnichannel-ai-klantcontact",
    title: "Omnichannel AI klantcontact",
    subtitle: "Eén AI-brein, alle klantkanalen",
    description:
      "MAISON BLNDR verbindt WhatsApp, e-mail, webchat en sociale media tot één consistent klantcontactplatform - aangedreven door AI die elke klant en elk gesprek kent.",
    parentSlug: "ai-chatbots-klantenservice",
    parentTitle: "AI Chatbots & Klantenservice",
    metaTitle:
      "Omnichannel AI klantcontact - MAISON BLNDR Limburg | Multichannel klantenservice automatiseren",
    metaDescription:
      "Omnichannel AI klantcontact implementeren in Limburg? MAISON BLNDR verbindt WhatsApp, e-mail en webchat via één AI-platform. Consistente klantervaring op elk kanaal. Gratis strategiegesprek.",
    keywords: [
      "omnichannel ai klantcontact",
      "omnichannel chatbot integratie",
      "multichannel klantenservice ai",
      "omnichannel automatisering",
      "klantenservice meerdere kanalen",
      "ai klantcontact platform",
    ],
    longDescription: [
      "Klanten wisselen van kanaal en moeten zich steeds opnieuw voorstellen. Wij verbinden WhatsApp, mail, webchat en meer via één platform met gedeeld geheugen.",
      "Zelfde antwoorden, zelfde context. WhatsApp nu, mail morgen: de AI pakt de draad op. Je team ziet alles op één plek.",
      "Voor teams die meerdere kanalen beheren: minder dubbel werk, snellere reacties, routine op alle kanalen tegelijk.",
      "Implementatie, training, escalatieregels en rapportage. Na livegang bijsturen per kanaal.",
    ],
    benefits: [
      "Eén consistent klantgesprek over WhatsApp, e-mail en webchat",
      "AI-geheugen dat elke klant en elk gesprek onthoudt",
      "Geen dubbel werk meer voor je klantenserviceteam",
      "Snellere responstijden op elk kanaal tegelijk",
      "Volledige zichtbaarheid in één unified inbox",
    ],
    faqs: [
      {
        question: "Wat is omnichannel AI klantcontact precies?",
        answer:
          "Omnichannel AI klantcontact betekent dat één AI-systeem alle klantkanalen tegelijk beheert - WhatsApp, e-mail, webchat, sociale media - met gedeeld geheugen. De klant hoeft zichzelf nooit te herhalen, ongeacht via welk kanaal ze contact opnemen. Je team heeft één overzicht van alle gesprekken.",
      },
      {
        question: "Welke kanalen kunnen worden gekoppeld?",
        answer:
          "Wij koppelen WhatsApp Business API, e-mail (via IMAP/SMTP of Microsoft 365), webchat, Instagram Direct, Facebook Messenger en telefonie (via SIP-integratie). De prioriteit bepaal je zelf op basis van welke kanalen je klanten het meest gebruiken.",
      },
      {
        question: "Hoe verschilt dit van een gewone chatbot?",
        answer:
          "Een gewone chatbot werkt op één kanaal en heeft geen geheugen buiten dat gesprek. Een omnichannel AI-platform werkt op alle kanalen tegelijk, onthoudt elk gesprek en elke klant, en geeft je team één centraal overzicht. Het is het verschil tussen een loket en een persoonlijke relatiebeheerder.",
      },
      {
        question: "Is omnichannel AI geschikt voor MKB in Limburg?",
        answer:
          "Ja. Kleine teams met veel kanalen winnen het meest: routine op WhatsApp, mail en web tegelijk. We hebben dit bij diverse Limburgse bedrijven neergezet.",
      },
      {
        question: "Wat gebeurt er als een klant menselijke hulp nodig heeft?",
        answer:
          "De AI herkent wanneer een gesprek te complex wordt of wanneer de klant expliciet om een medewerker vraagt. Op dat moment schakelt het systeem over naar een medewerker in de unified inbox - inclusief het volledige gespreksverloop. De klant merkt de overgang nauwelijks.",
      },
    ],
    technologies: [
      "WhatsApp Business API",
      "OpenAI",
      "Anthropic Claude",
      "Twilio",
      "Microsoft 365",
      "HubSpot",
    ],
    tags: ["WhatsApp Business API", "Multichannel", "Unified inbox", "Klantenservice"],
    heroImage: { src: "/images/tag-omnichannel-klantcontact.png", alt: "Omnichannel AI hub verbindt chat, e-mail, telefoon, WhatsApp en web - één AI-brein voor alle klantkanalen in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/omnichannel-ai-klantcontact#service",
  },
  {
    slug: "multi-agent-orkestratie",
    title: "Multi-agent orkestratie",
    subtitle: "AI-agents die samenwerken als een team",
    description:
      "MAISON BLNDR ontwerpt en implementeert multi-agent systemen waarbij gespecialiseerde AI-agents samenwerken om complexe workflows end-to-end te automatiseren - zonder menselijke tussenkomst.",
    parentSlug: "ai-agents-procesautomatisering",
    parentTitle: "AI Agents & Procesautomatisering",
    metaTitle:
      "Multi-agent orkestratie AI - MAISON BLNDR Limburg | Multi-agent systeem implementeren",
    metaDescription:
      "Multi-agent orkestratie laten implementeren in Limburg? MAISON BLNDR bouwt AI-agent frameworks waarbij meerdere agents samenwerken. Complexe workflows geautomatiseerd. Gratis strategiegesprek.",
    keywords: [
      "multi-agent orkestratie ai",
      "multi-agent systeem implementeren",
      "ai agent framework bureau",
      "ai agents samenwerking",
      "agentic workflow automatisering",
      "multi-agent architectuur",
    ],
    longDescription: [
      "Eén agent kan één taak. Complexe processen vragen om meerdere gespecialiseerde agents onder één orchestrator.",
      "Onderzoek, analyse, beslissing, uitvoering: elk zijn eigen agent. De mens stelt doelen, agents voeren uit.",
      "Voorbeelden: inkoop met selectie en bestelling in ERP, of contentworkflows met briefing en concept.",
      "Eerst architectuur: wie doet wat, foutafhandeling, controle. Daarna bouwen en monitoren.",
    ],
    benefits: [
      "Complexe end-to-end workflows geautomatiseerd",
      "Gespecialiseerde agents voor maximale precisie per taak",
      "Schaalbaar: voeg agents toe naarmate processen groeien",
      "Volledige audit-trail van elke agent-actie",
      "Menselijke oversight behouden op strategisch niveau",
    ],
    faqs: [
      {
        question: "Wat is multi-agent orkestratie en waarom is het nuttig?",
        answer:
          "Multi-agent orkestratie is een architectuur waarbij meerdere gespecialiseerde AI-agents samenwerken onder aansturing van een orkestrator. Elke agent doet wat hij het beste kan. Dit maakt het mogelijk om complexe, meerstaps-workflows volledig te automatiseren die te ingewikkeld zijn voor één enkele agent.",
      },
      {
        question: "Wat is het verschil met een gewone AI-chatbot of RPA?",
        answer:
          "Een chatbot handelt gesprekken af. RPA automatiseert schermhandelingen. Multi-agent orkestratie is iets anders: het gaat om samenwerking tussen agents die redeneren, plannen en beslissingen nemen. De agents kunnen zelfstandig met externe systemen communiceren, data verwerken en acties initiëren op basis van context.",
      },
      {
        question: "Voor welke bedrijfsprocessen is multi-agent orkestratie geschikt?",
        answer:
          "Processen die meerdere stappen bevatten met afhankelijkheden, uiteenlopende databronnen en beslismomenten zijn de beste kandidaten. Denk aan inkoop, contentproductie, klantonderzoek, compliance-checks en rapportage. MAISON BLNDR doet een procesanalyse om te bepalen welke workflows het meest baat hebben bij een multi-agent aanpak.",
      },
      {
        question: "Hoe houd ik controle over wat de agents doen?",
        answer:
          "MAISON BLNDR bouwt altijd een human-in-the-loop mechanisme in voor kritieke beslissingen. Agents kunnen ingesteld worden om bij twijfel of hoge-impact acties goedkeuring te vragen. Bovendien is elke agent-actie gelogd in een audit-trail, zodat je precies kunt zien wat er is gebeurd en waarom.",
      },
      {
        question: "Zijn multi-agent systemen al ingezet bij bedrijven in Limburg?",
        answer:
          "Ja. MAISON BLNDR heeft multi-agent architecturen geïmplementeerd bij bedrijven in de zakelijke dienstverlening en industrie in Limburg. Vanwege vertrouwelijkheid bespreken we concrete cases tijdens een strategiegesprek, niet publiekelijk.",
      },
    ],
    technologies: [
      "LangChain",
      "LangGraph",
      "OpenAI",
      "Anthropic Claude",
      "n8n",
      "Python",
    ],
    tags: ["Agentic AI", "Workflow orchestration", "LangGraph", "Autonome agents"],
    heroImage: { src: "/images/tag-multi-agent-orkestratie.png", alt: "Multi-agent orkestratie: drie AI-agents werken samen via centrale orchestrator - AI-samenwerking voor complexe bedrijfsprocessen" },
    jsonLdId: "https://maisonblender.com/diensten/multi-agent-orkestratie#service",
  },
  {
    slug: "documentverwerking-ai",
    title: "documentverwerking",
    subtitle: "Van document naar data - automatisch",
    description:
      "MAISON BLNDR automatiseert de extractie en verwerking van data uit contracten, formulieren en rapporten - zodat je team nooit meer handmatig documenten uitleest.",
    parentSlug: "ai-agents-procesautomatisering",
    parentTitle: "AI Agents & Procesautomatisering",
    metaTitle:
      "Documentverwerking AI automatisering - MAISON BLNDR Limburg | documentherkenning",
    metaDescription:
      "Documentverwerking automatiseren met AI in Limburg? MAISON BLNDR extraheert data uit contracten, formulieren en PDF's automatisch. 90%+ nauwkeurigheid. Gratis strategiegesprek.",
    keywords: [
      "documentverwerking ai automatisering",
      "ai document processing",
      "automatische documentherkenning",
      "documentverwerking",
      "document extraction ai",
      "ocr ai verwerking",
    ],
    longDescription: [
      "Contracten, offertes, formulieren: data zit erin, maar iemand moet het eruit halen. Wij automatiseren extractie uit PDF, Word, scans en mail.",
      "Type herkennen, velden pakken, leren van correcties. Uitzonderingen naar een reviewer met context klaar.",
      "Boven 90% nauwkeurigheid bij gestructureerde documenten. Koppeling met ERP, DMS of CRM.",
      "Validatie en goedkeuringsflows op maat. Beheer en training bij nieuwe documenttypes.",
    ],
    benefits: [
      "90%+ nauwkeurigheid bij gestructureerde documenten",
      "Werkt met PDF, Word, scans en e-mailbijlagen",
      "Directe integratie met je ERP, CRM of DMS",
      "Continues verbetering op basis van feedback",
      "Uitzonderingen efficiënt naar menselijke reviewer",
    ],
    faqs: [
      {
        question: "Welke documenttypes kan AI verwerken?",
        answer:
          "AI documentverwerking werkt met vrijwel elk documenttype: PDF (digitaal en gescand), Word, Excel, e-mailbijlagen en afbeeldingen. Gestructureerde documenten zoals facturen en formulieren hebben de hoogste nauwkeurigheid. Semi-gestructureerde documenten zoals contracten en rapporten worden verwerkt met hogere foutmarge, maar het systeem leert van correcties.",
      },
      {
        question: "Hoe nauwkeurig is AI documentverwerking?",
        answer:
          "Voor gestructureerde documenten van bekende leveranciers of standaardformulieren ligt de nauwkeurigheid boven de 90%. Voor minder gestructureerde documenten begint het lager maar verbetert het snel naarmate het systeem meer voorbeelden ziet. MAISON BLNDR bouwt altijd een validatiestap in voor kritieke data.",
      },
      {
        question: "Wat is het verschil met gewone OCR-software?",
        answer:
          "Traditionele OCR zet tekst om van beeld naar tekst. AI documentverwerking begrijpt de semantische betekenis: het herkent dat een getal een factuurbedrag is, dat een naam een contractpartij betreft, en dat een datum een vervaldatum aangeeft. Die context maakt het systeem bruikbaar voor echte businessprocessen.",
      },
      {
        question: "Werkt documentverwerking ook met documenten in het Nederlands?",
        answer:
          "Ja. Moderne AI-modellen zijn goed in het Nederlands, inclusief juridische en zakelijke taal die veel in Limburgse bedrijven voorkomt. Wij trainen het systeem specifiek op jouw documenttypes en woordenschat, zodat de nauwkeurigheid voor jouw use case maximaal is.",
      },
      {
        question: "Met welke systemen integreert documentverwerking in Limburg?",
        answer:
          "MAISON BLNDR integreert documentverwerking met Exact, AFAS, SAP, SharePoint, custom databases en branchespecifieke pakketten. De extractie-output kan ook worden doorgegeven via REST API of webhooks naar elk systeem dat je al gebruikt.",
      },
    ],
    technologies: [
      "Azure Document Intelligence",
      "OpenAI",
      "Anthropic Claude",
      "Python",
      "n8n",
      "SharePoint",
    ],
    tags: ["OCR", "Document extraction", "PDF-verwerking", "Backoffice automatisering"],
    heroImage: { src: "/images/tag-documentverwerking.png", alt: "AI scant documenten en extraheert gestructureerde data automatisch - documentverwerking voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/documentverwerking-ai#service",
  },
  {
    slug: "ai-taakuitvoering",
    title: "Autonome AI taakuitvoering",
    subtitle: "AI-agents die zelfstandig taken uitvoeren",
    description:
      "MAISON BLNDR bouwt AI-agents die taken end-to-end uitvoeren - van onderzoek en analyse tot het aansturen van externe systemen - zonder dat je team er bij hoeft te zitten.",
    parentSlug: "ai-agents-procesautomatisering",
    parentTitle: "AI Agents & Procesautomatisering",
    metaTitle:
      "AI taakuitvoering automatisering - MAISON BLNDR Limburg | Autonome taakverwerking",
    metaDescription:
      "Autonome AI taakuitvoering implementeren in Limburg? MAISON BLNDR bouwt AI-agents die taken end-to-end zelfstandig uitvoeren. Meer output zonder extra handwerk. Gratis strategiegesprek.",
    keywords: [
      "ai taakuitvoering automatisering",
      "ai task execution",
      "autonome taakverwerking",
      "geautomatiseerde werkopdrachten ai",
      "agentic ai bureau",
      "ai agent taakbeheer",
    ],
    longDescription: [
      "Verder dan klikken: agents die zoeken, interpreteren, beslissen en handelen. Inbox-triage, concurrentierapport, antwoord op basis van je kennisbank.",
      "Grenzen per project: wat mag zelfstandig, waar is goedkeuring nodig. Elke actie gelogd.",
      "Meten wat goed gaat, waar het faalt, wat escaleert. Verfijnen op echte data.",
      "Handig als je wilt groeien zonder overal mensen bij te zetten.",
    ],
    benefits: [
      "Taken end-to-end uitgevoerd zonder handmatige tussenkomst",
      "Escalatiemechanismen voor twijfelgevallen ingebouwd",
      "Volledige audit-trail van elke uitgevoerde actie",
      "Schaalbaar naar meer agents naarmate de behoefte groeit",
      "Minder repetitief handmatig werk, meer strategische focus",
    ],
    faqs: [
      {
        question: "Wat is autonome AI taakuitvoering precies?",
        answer:
          "Autonome AI taakuitvoering betekent dat een AI-agent een taak ontvangt en die zelfstandig uitvoert - inclusief het opzoeken van informatie, nemen van beslissingen op basis van regels en uitvoeren van acties in externe systemen. De agent rapporteert het resultaat en escaleert alleen als de situatie buiten zijn bevoegdheid valt.",
      },
      {
        question: "Welke taken zijn geschikt voor autonome AI-uitvoering?",
        answer:
          "Taken met duidelijke criteria, herhaalbare structuur en toegang tot benodigde data zijn het beste geschikt. Denk aan: inbox-triage, rapport-generatie, data-verrijking, klantcommunicatie op basis van templates, periodieke analyses en notificatie-workflows. MAISON BLNDR helpt bepalen welke taken in jouw bedrijf het meeste opleveren.",
      },
      {
        question: "Hoe zorg je dat de AI geen fouten maakt?",
        answer:
          "Door grenzen te stellen aan wat de agent zelfstandig mag doen en menselijke checkpoints in te bouwen voor kritieke beslissingen. MAISON BLNDR ontwerpt altijd een validatielaag en audit-trail. Bij twijfel escaleert de agent naar een medewerker - met alle context al voorbereid zodat die snel kan beslissen.",
      },
      {
        question: "Is autonome taakuitvoering al inzetbaar voor MKB in Limburg?",
        answer:
          "Ja. De technologie is volwassen genoeg voor productie-implementaties. MAISON BLNDR heeft autonome AI-agents ingezet bij meerdere bedrijven in de regio. De sleutel is een goed ontwerp: begin met afgebakende, laag-risico taken en breid uit naarmate het vertrouwen groeit.",
      },
      {
        question: "Hoe verschilt dit van RPA?",
        answer:
          "RPA volgt vaste scripts op scherm-niveau. Autonome AI-taakuitvoering is flexibeler: de agent begrijpt context, kan omgaan met variatie in input en neemt beslissingen op basis van redenering. Waar RPA een strak pad volgt, navigeert een AI-agent ook onverwachte situaties.",
      },
    ],
    technologies: [
      "LangChain",
      "LangGraph",
      "OpenAI",
      "Anthropic Claude",
      "n8n",
      "Python",
    ],
    tags: ["Agentic AI", "Task automation", "Autonome agents", "Procesautomatisering"],
    heroImage: { src: "/images/tag-ai-taakuitvoering.png", alt: "Autonome AI voert taakenlijst zelfstandig uit met teal vinkjes - AI taakautomatisering zonder menselijke tussenkomst in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/ai-taakuitvoering#service",
  },
  {
    slug: "api-integraties-automatisering",
    title: "API-integraties op maat",
    subtitle: "Systemen verbinden via slimme API-koppelingen",
    description:
      "MAISON BLNDR bouwt robuuste API-integraties die jouw bedrijfssystemen realtime verbinden - zodat data automatisch stroomt waar die nodig is, zonder handmatige tussenkomst.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "API integraties automatisering - MAISON BLNDR Limburg | REST API koppeling bureau",
    metaDescription:
      "API integraties laten bouwen in Limburg? MAISON BLNDR bouwt REST API en webhook koppelingen tussen al je systemen. Realtime data, geen handmatig werk. Gratis strategiegesprek.",
    keywords: [
      "api integraties automatisering",
      "rest api koppeling bureau",
      "systeem api integratie",
      "api-first automatisering",
      "webhook integratie",
      "api koppelingen bouwen",
    ],
    longDescription: [
      "Tientallen pakketten, verouderde info, dubbele invoer: zonder koppeling kost dat tijd. API-integraties laten data realtime meelopen.",
      "REST, webhooks, event-driven. Retries, alerts, monitoring bij storing.",
      "Maatwerklogica wanneer standaard connectoren niet passen.",
      "Na oplevering beheer: leveranciersupdates breken soms koppelingen, wij vangen dat op.",
    ],
    benefits: [
      "Realtime datauitwisseling tussen al je systemen",
      "Foutafhandeling en retry-logica ingebouwd",
      "Proactieve monitoring en beheer na lancering",
      "Maatwerklogica voor jouw specifieke businessregels",
      "Werkt ook met systemen zonder standaard connector",
    ],
    faqs: [
      {
        question: "Wat is een API-integratie en waarom is het nuttig?",
        answer:
          "Een API-integratie verbindt twee of meer softwaresystemen via hun programmeerinterface, zodat data automatisch wordt uitgewisseld. In plaats van handmatig gegevens van systeem A naar systeem B te kopiëren, stroomt de data automatisch en realtime. Dit elimineert fouten, bespaart tijd en zorgt dat iedereen altijd met actuele informatie werkt.",
      },
      {
        question: "Welke systemen kunnen worden gekoppeld?",
        answer:
          "Alle systemen met een API. Dat omvat CRM (HubSpot, Salesforce, Pipedrive), ERP (SAP, AFAS, Exact, Odoo), webshops (Shopify, WooCommerce), marketingplatforms (Mailchimp, ActiveCampaign), klantenservicetools (Zendesk, Intercom) en vrijwel alle moderne SaaS-applicaties.",
      },
      {
        question: "Wat als een systeem geen API heeft?",
        answer:
          "Dan kijken we naar alternatieven: file-based integraties via SFTP, e-mail parsing, of RPA als allerlaatste redmiddel. MAISON BLNDR adviseert altijd de meest robuuste oplossing voor jouw specifieke situatie. Systemen zonder API zijn zeldzamer geworden, maar komen nog steeds voor bij oudere branchespecifieke pakketten.",
      },
      {
        question: "Hoe betrouwbaar zijn API-integraties in de praktijk?",
        answer:
          "MAISON BLNDR bouwt productie-grade integraties met foutafhandeling, retry-logica, dead-letter queues en monitoring. Bij een storing ontvang je direct een alert en voert het systeem automatisch herstelacties uit. De beschikbaarheid van onze integraties ligt boven de 99,5% in productie.",
      },
      {
        question: "Bouwen jullie ook integraties voor bedrijven in Limburg die al systemen hebben?",
        answer:
          "Ja, dat is juist de meest voorkomende situatie. Je hebt al systemen die je niet wilt vervangen, maar die niet met elkaar praten. MAISON BLNDR bouwt de verbindingen bovenop wat je al hebt. We beginnen met een korte inventarisatie van je systemenlandschap en stellen dan het optimale integratiepakket voor.",
      },
    ],
    technologies: [
      "REST API",
      "GraphQL",
      "Webhooks",
      "n8n",
      "Make.com",
      "Python",
    ],
    tags: ["REST API", "Webhooks", "Systeem integratie", "Realtime data"],
    heroImage: { src: "/images/tag-api-integraties.png", alt: "API-integratie: twee softwaresystemen verbonden via teal dataflow connector - maatwerk API-koppelingen voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/api-integraties-automatisering#service",
  },
  {
    slug: "schermautomatisering-rpa",
    title: "Schermautomatisering (UI automation)",
    subtitle: "Softwarerobots die elke computertaak overnemen",
    description:
      "MAISON BLNDR automatiseert schermhandelingen op desktop- en webapplicaties via UI automation - inclusief systemen die geen API bieden. De robot doet het, jij niet meer.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "Schermautomatisering RPA - MAISON BLNDR Limburg | UI automatisering bureau",
    metaDescription:
      "Schermautomatisering laten implementeren in Limburg? MAISON BLNDR automatiseert desktop- en webtaken via RPA en UI automation. Werkt ook op legacy-systemen. Gratis strategiegesprek.",
    keywords: [
      "schermautomatisering rpa",
      "ui automatisering bureau",
      "desktop automatisering software",
      "rpa scherm scraping",
      "ui automation implementeren",
      "legacy systeem automatisering",
    ],
    longDescription: [
      "Geen API? Dan de UI. Robot klikt en typt zoals een medewerker, sneller en zonder fouten.",
      "Branchesoftware, overheidsportalen, oud ERP: vaak toch te automatiseren. Geen migratie nodig.",
      "Bij schermwijzigingen passen wij de robot aan. Repetitief schermwerk is vaak de snelste besparing.",
    ],
    benefits: [
      "Werkt op elk systeem, ook zonder API of integratiemogelijkheid",
      "Geen nieuwe software aanschaffen of migreren",
      "Foutloze uitvoering van repetitieve schermtaken",
      "Actief beheer bij schermwijzigingen",
      "Direct inzetbaar naast bestaande processen",
    ],
    faqs: [
      {
        question: "Wat is schermautomatisering (UI automation) precies?",
        answer:
          "Schermautomatisering is een vorm van RPA waarbij een softwarerobot de grafische interface van een applicatie bestuurt - net zoals een medewerker dat doet. De robot herkent schermonderdelen, klikt op knoppen, vult velden in en leest data uit. Dit maakt automatisering mogelijk op systemen die geen API bieden.",
      },
      {
        question: "Verschilt schermautomatisering van reguliere RPA?",
        answer:
          "Schermautomatisering is een specifieke techniek binnen het RPA-spectrum, gericht op de UI-laag van applicaties. Reguliere RPA kan ook werken via API's, bestandsoverdracht of databasekoppelingen. Schermautomatisering wordt ingezet wanneer die andere methoden niet beschikbaar zijn - typisch bij legacy-systemen of portalen van derden.",
      },
      {
        question: "Welke systemen ondersteunt schermautomatisering?",
        answer:
          "Vrijwel alle Windows-desktopapplicaties, webbrowsers, en hybride applicaties. Denk aan branchespecifieke pakketten in de zorg, overheid of logistiek, maar ook aan oudere ERP-systemen, gemeenteportalen en interne tools die nooit een moderne API hebben gekregen. Als een mens het op een scherm kan doen, kan een robot het ook.",
      },
      {
        question: "Wat als de applicatie een update krijgt en het scherm verandert?",
        answer:
          "Dit is een reëel risico bij schermautomatisering. MAISON BLNDR monitort robots actief en past ze aan bij schermwijzigingen. Bij een beheercontract is dit inbegrepen: jij merkt de wijziging niet omdat wij de robot al hebben aangepast voordat die in productie faalt.",
      },
      {
        question: "Is schermautomatisering geschikt voor bedrijven in Limburg?",
        answer:
          "Ja, juist voor MKB in de regio dat werkt met branchespecifieke of verouderde software. Schermautomatisering vereist geen investering in nieuwe systemen. MAISON BLNDR heeft UI automation geïmplementeerd bij diverse bedrijven in Limburg - van maakindustrie tot zakelijke dienstverlening.",
      },
    ],
    technologies: [
      "UiPath",
      "Microsoft Power Automate",
      "Python (pyautogui / playwright)",
      "Selenium",
      "n8n",
    ],
    tags: ["UI automation", "Legacy systemen", "RPA", "Desktop automatisering"],
    heroImage: { src: "/images/tag-schermautomatisering.png", alt: "Softwarerobot bestuurt computerinterface automatisch - schermautomatisering en UI automation voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/schermautomatisering-rpa#service",
  },
  {
    slug: "klantportaal-ontwikkeling-ai",
    title: "AI klantportaal laten bouwen",
    subtitle: "Selfservice klantomgeving op maat",
    description:
      "MAISON BLNDR bouwt klantportalen met ingebouwde AI - zodat je klanten zelf orders plaatsen, statussen controleren en vragen stellen, zonder dat je team erbij hoeft.",
    parentSlug: "custom-ai-software",
    parentTitle: "Custom AI Software & Portalen",
    metaTitle:
      "AI klantportaal ontwikkelen - MAISON BLNDR Limburg | Selfservice klantomgeving op maat",
    metaDescription:
      "AI klantportaal laten bouwen in Limburg? MAISON BLNDR ontwikkelt B2B selfservice portalen met AI-ondersteuning. Meer selfservice voor klanten. Gratis strategiegesprek.",
    keywords: [
      "ai klantportaal ontwikkelen",
      "selfservice klantomgeving ai",
      "b2b klantportaal maatwerk",
      "klantportaal integratie",
      "customer portal ai",
      "klantportaal bouwen",
    ],
    longDescription: [
      "Klanten willen status en controle zonder te bellen. Portaal met orders, documenten, chat en AI die live data uit je backoffice haalt.",
      "Sterk voor vaste B2B-relaties: lagere servicedruk, makkelijker bestellen, meer transparantie.",
      "UX, development, AI, koppelingen, lancering. Daarna optimaliseren op gebruik.",
    ],
    benefits: [
      "Klanten helpen zichzelf - minder druk op je klantenservice",
      "Realtime data uit je ERP en orderbeheersysteem",
      "AI-assistent die productspecifieke vragen direct beantwoordt",
      "Hogere orderfrequentie doordat bestellen eenvoudiger wordt",
      "Volledig op maat gebouwd voor jouw klantrelaties",
    ],
    faqs: [
      {
        question: "Wat is een AI klantportaal?",
        answer:
          "Een AI klantportaal is een beveiligde online omgeving voor je klanten waar ze orders plaatsen, statussen volgen, documenten inzien en vragen stellen aan een AI-assistent die realtime data uit jouw backofficesystemen ophaalt. Het combineert selfservice met ondersteuning op één plek.",
      },
      {
        question: "Is een klantportaal geschikt voor B2B in Limburg?",
        answer:
          "Voor vaste B2B-klanten werkt het goed: regelmatig bestellen of veel info nodig, zonder te bellen. We bouwen dit voor bedrijven in de regio.",
      },
      {
        question: "Met welke systemen kan het portaal worden geïntegreerd?",
        answer:
          "MAISON BLNDR integreert klantportalen met vrijwel elk ERP (SAP, AFAS, Exact, Odoo), CRM (HubSpot, Salesforce), ordermanagementsysteem en documentopslag. De AI-assistent haalt realtime data op uit deze systemen om klanten accurate informatie te geven.",
      },
      {
        question: "Hoe lang duurt het bouwen van een klantportaal?",
        answer:
          "Een standaard klantportaal met AI-assistent en backoffice-integratie is doorgaans klaar in acht tot twaalf weken. Complexere portalen met meerdere klantrolniveaus of uitgebreide ERP-integraties nemen meer tijd. We werken iteratief: een eerste versie is vroeg beschikbaar voor feedback.",
      },
      {
        question: "Hoe zit het met beveiliging van klantdata?",
        answer:
          "MAISON BLNDR bouwt klantportalen met role-based access control: elke klant ziet alleen zijn eigen data. Authenticatie via SSO of MFA is standaard. Data wordt opgeslagen conform GDPR, binnen Europese infrastructuur. Beveiligingsaudits zijn onderdeel van het opleverproces.",
      },
    ],
    technologies: [
      "Next.js",
      "React",
      "OpenAI",
      "Anthropic Claude",
      "SAP / AFAS / Exact",
      "PostgreSQL",
    ],
    tags: ["B2B portaal", "Selfservice", "ERP-integratie", "AI-assistent"],
    heroImage: { src: "/images/tag-klantportaal.png", alt: "AI klantportaal op tablet met selfservice functies en teal actieknoppen - maatwerk klantportaal ontwikkeling voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/klantportaal-ontwikkeling-ai#service",
  },
  {
    slug: "web-mobiele-app-ai",
    title: "AI web app laten maken",
    subtitle: "Web- en mobiele apps met ingebouwde AI",
    description:
      "MAISON BLNDR bouwt web- en mobiele applicaties met AI als kern - van zoekfuncties en personalisatie tot geautomatiseerde workflows in je app.",
    parentSlug: "custom-ai-software",
    parentTitle: "Custom AI Software & Portalen",
    metaTitle:
      "AI web app laten maken - MAISON BLNDR Limburg | AI mobiele app ontwikkeling",
    metaDescription:
      "AI web app of mobiele app laten maken in Limburg? MAISON BLNDR bouwt web- en mobiele applicaties met ingebouwde AI. Van zoekfunctie tot volledige AI-workflow. Gratis strategiegesprek.",
    keywords: [
      "ai web app laten maken",
      "ai mobiele app ontwikkeling",
      "web applicatie ai integratie",
      "progressive web app ai",
      "ai app bouwen",
      "web app met ai",
    ],
    longDescription: [
      "AI hoort in de kern, niet als feature achteraf. Zoeken op intentie, personalisatie, taken via gesprek.",
      "PWA of React Native: één codebase, desktop en mobiel. Eerst UX, dan bouwen wat waarde levert.",
      "Iteratief met demo's. Beheer en doorontwikkeling door het team dat het bouwde.",
    ],
    benefits: [
      "AI ingebouwd als kern van de applicatielogica",
      "Werkt op desktop, tablet en mobiel",
      "Gebruikersgericht ontwerp voor maximale adoptie",
      "Schaalbare architectuur die meegroeien met je bedrijf",
      "Langdurig beheer en doorontwikkeling beschikbaar",
    ],
    faqs: [
      {
        question: "Wat maakt een web app 'AI-aangedreven'?",
        answer:
          "Een AI-aangedreven web app gebruikt machine learning of taalmodellen als onderdeel van de kernfunctionaliteit. Voorbeelden: een zoekfunctie die semantisch begrijpt wat je zoekt, een aanbevelingssysteem dat aanpast op gebruikersgedrag, of een conversatie-interface waarmee je taken uitvoert via natuurlijke taal. AI zit ingebakken in de functionaliteit, niet geplakt op een bestaande app.",
      },
      {
        question: "Wat is een progressive web app (PWA)?",
        answer:
          "Een PWA is een webapplicatie die op elk apparaat werkt - desktop, tablet, mobiel - en zich gedraagt als een native app: installeert op je homescreen, werkt offline, stuurt notificaties. Voor de meeste zakelijke use cases biedt een PWA de beste balans tussen ontwikkelkosten en gebruikerservaring.",
      },
      {
        question: "Bouwen jullie ook voor iOS en Android?",
        answer:
          "Ja. Naast PWA's bouwt MAISON BLNDR ook native-achtige apps via React Native, zodat je één codebase hebt voor iOS en Android. Voor use cases waarbij native hardware-toegang (camera, GPS, biometrie) essentieel is, bespreken we de beste aanpak in het initiële gesprek.",
      },
      {
        question: "Hoelang duurt het ontwikkelen van een AI web app?",
        answer:
          "Een MVP - een eerste werkende versie met de kernfunctionaliteit - is bij de meeste projecten klaar in zes tot twaalf weken. We werken iteratief met tweewekelijkse releases. Je ziet vroeg resultaat en kunt sturen op basis van echte gebruikersfeedback in plaats van op papier.",
      },
      {
        question: "Bouwen jullie ook interne tools voor bedrijven in Limburg?",
        answer:
          "Ja, juist. Interne tools voor operationeel gebruik - planning, rapportage, klantbeheer, productie-tracking - zijn een groot deel van ons werk. Maatwerk werkt beter dan generieke software als je processen specifiek zijn. MAISON BLNDR heeft interne tools gebouwd voor bedrijven in diverse sectoren in de regio.",
      },
    ],
    technologies: [
      "Next.js",
      "React",
      "React Native",
      "OpenAI",
      "Anthropic Claude",
      "PostgreSQL",
    ],
    tags: ["Web app", "Mobiele app", "PWA", "AI-integratie"],
    heroImage: { src: "/images/tag-web-mobiele-app.png", alt: "AI-gestuurde web app op desktop en smartphone met teal accent grafieken - web en mobiele app ontwikkeling met ingebouwde AI in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/web-mobiele-app-ai#service",
  },
  {
    slug: "ai-applicaties-maatwerk",
    title: "Maatwerk AI applicatie bouwen",
    subtitle: "AI-first software die jouw probleem oplost",
    description:
      "Software op maat rond jouw probleem: beslissingstools, kennisassistenten of autonome workflows met AI in de kern.",
    parentSlug: "custom-ai-software",
    parentTitle: "Custom AI Software & Portalen",
    metaTitle:
      "Maatwerk AI applicatie bouwen - MAISON BLNDR Limburg | Custom AI software op maat",
    metaDescription:
      "Maatwerk AI applicatie laten bouwen in Limburg? MAISON BLNDR ontwikkelt AI-first software op maat voor jouw specifieke businessprobleem. Gratis strategiegesprek beschikbaar.",
    keywords: [
      "maatwerk ai applicatie bouwen",
      "ai software op maat",
      "custom ai applicatie ontwikkeling",
      "ai-first applicatie bureau",
      "ai software bouwen",
      "bedrijfsspecifieke ai applicatie",
    ],
    longDescription: [
      "Generieke software past zelden precies. Wij bouwen AI-applicaties rond jouw proces en data.",
      "Prijsoptimalisatie, interne kennisassistent, churn-signaal: AI in de businesslogica, niet eromheen.",
      "Samen met jouw team: domeinkennis plus onze techniek. Beheer na livegang.",
    ],
    benefits: [
      "100% op maat gebouwd voor jouw businessprobleem",
      "AI als kern van de functionaliteit, niet als bijproduct",
      "Moeilijk te kopiëren door concurrenten",
      "Leert en verbetert naarmate er meer data doorheen gaat",
      "Beheer en doorontwikkeling door het team dat het heeft gebouwd",
    ],
    faqs: [
      {
        question: "Wat is een maatwerk AI applicatie?",
        answer:
          "Een maatwerk AI applicatie is software die van de grond af is gebouwd voor één specifiek businessprobleem of -kans. In tegenstelling tot standaardsoftware zijn alle beslissingen - architectuur, UI, AI-modellen, data-integraties - gemaakt vanuit jouw specifieke use case. Het resultaat past precies, in plaats van een stukje te groot of te klein te zijn.",
      },
      {
        question: "Wanneer kies je voor maatwerk boven standaardsoftware?",
        answer:
          "Als de standaardsoftware niet bestaat, te generiek is, te veel compromissen vereist of te veel kost voor wat je eigenlijk nodig hebt. Maatwerk is ook de juiste keuze als je een concurrentievoordeel wilt opbouwen: een applicatie op jouw data en processen is uniek. MAISON BLNDR helpt je de business case eerlijk inschatten.",
      },
      {
        question: "Hoe betrokken moet ik zijn bij het bouwproces?",
        answer:
          "Actief betrokken, maar zonder het je werk te maken. We werken in tweewekelijkse sprints met demo's en feedbackrondes. Jij zorgt voor domeinkennis en feedback; wij zorgen voor techniek en uitvoering. De combinatie van jouw businesskennis en onze AI- en softwareexpertise levert het beste resultaat.",
      },
      {
        question: "Kan een maatwerk AI applicatie worden uitgebreid na lancering?",
        answer:
          "Ja, dat is de bedoeling. MAISON BLNDR bouwt applicaties met uitbreidbaarheid als architectuurprincipe. Na lancering beginnen de echte learnings: welke functies worden het meest gebruikt, waar willen gebruikers meer? Op basis van data voegen we functionaliteiten toe die de meeste waarde opleveren.",
      },
      {
        question: "Is maatwerk AI software geschikt voor MKB in Limburg?",
        answer:
          "Ja. Maatwerk hoeft niet duurder te zijn dan een licentie voor enterprise-software die je toch niet volledig gebruikt. MAISON BLNDR werkt ook met MKB in de regio op gefaseerde projecten waarbij je begint met een MVP. Kleine stappen, meetbare waarde, geen grote risico's.",
      },
    ],
    technologies: [
      "Python",
      "Next.js",
      "OpenAI",
      "Anthropic Claude",
      "LangChain",
      "PostgreSQL",
    ],
    tags: ["AI-first software", "Maatwerk", "Beslissingstool", "Kennisassistent"],
    heroImage: { src: "/images/tag-ai-applicaties-maatwerk.png", alt: "Puzzelstukjes vormen samen een maatwerk AI applicatie - custom AI software ontwikkeling op maat voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/ai-applicaties-maatwerk#service",
  },
  {
    slug: "documentbeheer-ai",
    title: "Documentbeheer automatiseren met AI",
    subtitle: "Gecontroleerde documenten, altijd vindbaar",
    description:
      "MAISON BLNDR implementeert AI-gestuurde documentbeheersystemen die documenten automatisch classificeren, archiveren en doorzoekbaar maken - altijd de juiste versie, altijd terug te vinden.",
    parentSlug: "custom-ai-software",
    parentTitle: "Custom AI Software & Portalen",
    metaTitle:
      "Documentbeheer automatiseren AI - MAISON BLNDR Limburg | AI DMS implementatie",
    metaDescription:
      "Documentbeheer automatiseren met AI in Limburg? MAISON BLNDR implementeert DMS-oplossingen die documenten classificeren en doorzoekbaar maken. Gratis strategiegesprek.",
    keywords: [
      "documentbeheer automatiseren ai",
      "digitaal documentbeheer systeem",
      "ai dms implementatie",
      "document management ai",
      "intelligent documentbeheer",
      "archivering automatiseren",
    ],
    longDescription: [
      "Documenten overal, juiste versie zoeken kost tijd. AI classificeert, tagt en maakt doorzoekbaar op inhoud.",
      "Nieuw contract? Juiste map, tags, metadata zonder handwerk. Oud archief kan mee.",
      "Zoeken in gewone taal. Handig bij ISO en juridische dossiers.",
      "SharePoint, OneDrive of maatwerk. Versiebeheer en toegang ingebouwd.",
    ],
    benefits: [
      "Automatische classificatie en archivering van nieuwe documenten",
      "Semantisch zoeken: vind documenten op inhoud, niet op naam",
      "Versiecontrole en toegangsbeheer ingebouwd",
      "Audit-trail voor compliance en kwaliteitssystemen",
      "Integreert met SharePoint, OneDrive en bestaande systemen",
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen documentbeheer en documentverwerking?",
        answer:
          "Documentverwerking gaat over het extraheren van data uit documenten voor gebruik in andere systemen. Documentbeheer gaat over het organiseren, opslaan en doorzoekbaar maken van documenten als kennisartefacten. Beide zijn waardevol maar dienen een ander doel. MAISON BLNDR biedt beide, onafhankelijk of gecombineerd.",
      },
      {
        question: "Met welke platforms integreert het documentbeheersysteem?",
        answer:
          "MAISON BLNDR integreert met SharePoint (Microsoft 365), OneDrive, Google Workspace, Dropbox Business en op maat gebouwde opslag. Ook integratie met branchespecifieke DMS-platforms (zoals PlanGrid, Procore of branchesoftware) is mogelijk. We adviseren de beste fit voor jouw situatie.",
      },
      {
        question: "Hoe werkt automatische documentclassificatie?",
        answer:
          "De AI analyseert de inhoud van het document - tekst, structuur, metadata - en koppelt dit aan een classificatieschema dat we samen met jou hebben opgesteld. Op basis van dat schema wordt het document automatisch gecategoriseerd en voorzien van tags. Het systeem leert van correcties en wordt nauwkeuriger naarmate het meer documenten verwerkt.",
      },
      {
        question: "Is AI documentbeheer geschikt voor ISO-gecertificeerde bedrijven in Limburg?",
        answer:
          "Ja, juist. ISO 9001 en andere normen stellen eisen aan documentbeheersing: versiebeheer, toegangsbeheer, reviewcycli en audit-trails. MAISON BLNDR bouwt documentbeheersystemen die specifiek aan deze eisen voldoen. Bedrijven in Limburg met een ISO-certificering profiteren direct van betere compliance en minder audittijd.",
      },
      {
        question: "Hoe lang duurt implementatie van een AI documentbeheersysteem?",
        answer:
          "Voor een standaard implementatie met classificatie, zoekmogelijkheden en SharePoint-integratie rekenen we vier tot acht weken. Als je bestaand archief ook moet worden gemigreerd en geherstructureerd, voeg je daar nog twee tot vier weken aan toe afhankelijk van de omvang.",
      },
    ],
    technologies: [
      "SharePoint",
      "Microsoft 365",
      "OpenAI",
      "Azure AI Search",
      "Python",
      "Next.js",
    ],
    tags: ["DMS", "Versiebeheer", "SharePoint", "Compliance"],
    heroImage: { src: "/images/tag-documentbeheer.png", alt: "AI sorteert documenten automatisch in categorieën en maakt ze direct vindbaar - documentbeheer automatiseren met AI voor MKB in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/documentbeheer-ai#service",
  },
  {
    slug: "kennismanagement-ai",
    title: "Kennismanagement met AI",
    subtitle: "Bedrijfskennis borgen en ontsluiten",
    description:
      "MAISON BLNDR implementeert AI-gestuurde kennismanagementsystemen die de kennis in je organisatie borgen, structureren en direct beschikbaar maken - voor iedereen die het nodig heeft.",
    parentSlug: "data-intelligentie-rapportages",
    parentTitle: "Data-intelligentie & Rapportages",
    metaTitle:
      "Kennismanagement AI systeem - MAISON BLNDR Limburg | Kennisbank AI implementatie",
    metaDescription:
      "Kennismanagement met AI implementeren in Limburg? MAISON BLNDR borgt en ontsluit bedrijfskennis via kennissystemen. Minder kennisuitstroom, snellere onboarding. Gratis strategiegesprek.",
    keywords: [
      "kennismanagement ai systeem",
      "knowledge management ai implementatie",
      "bedrijfskennis automatiseren",
      "ai kennisbank bureau",
      "kennisborging ai",
      "organisatorisch kennisbeheer",
    ],
    longDescription: [
      "Kennis in hoofden verdwijnt bij vertrek. Wij helpen vastleggen, structureren en ontsluiten.",
      "Documentatie, interviews, processen. AI maakt het vindbaar; nieuwe collega's stellen vragen in plaats van iedereen te storen.",
      "Anders dan alleen RAG: ook het organisatorische proces om kennis actueel te houden.",
    ],
    benefits: [
      "Bedrijfskennis geborgd - ongeacht wie er vertrekt",
      "AI kennisassistent die elk werkgerelateerd vraag beantwoordt",
      "Nieuwe medewerkers sneller productief",
      "Kennis gestructureerd en continu actueel gehouden",
      "Doorzoekbaar via conversatie-interface",
    ],
    faqs: [
      {
        question: "Wat is kennismanagement en waarom is AI hierbij nuttig?",
        answer:
          "Kennismanagement is het systematisch vastleggen, organiseren en toegankelijk maken van kennis binnen een organisatie. AI versnelt dit: het helpt kennis te extraheren uit bestaande documenten, structureert die automatisch en maakt het doorzoekbaar via een interface die begrijpt wat je zoekt.",
      },
      {
        question: "Wat is het verschil tussen kennismanagement en een gewone kennisbank?",
        answer:
          "Een kennisbank is een statische verzameling documenten. AI kennismanagement is dynamisch: het systeem begrijpt relaties tussen kennisitems, geeft contextuele antwoorden op specifieke vragen en signaleert wanneer kennis verouderd is. Het is het verschil tussen een bibliotheek en een adviseur die de bibliotheek kent.",
      },
      {
        question: "Hoe zorgen jullie dat de kennis actueel blijft?",
        answer:
          "MAISON BLNDR bouwt een reviewproces in waarbij kennisitems een houdbaarheidsdatum hebben en periodiek worden aangeboden aan de verantwoordelijke medewerker voor actualisatie. De AI signaleert ook inconsistenties en verouderde informatie op basis van nieuwe inputs. Kennismanagement is een doorlopend proces, geen eenmalig project.",
      },
      {
        question: "Is kennismanagement met AI geschikt voor MKB in Limburg?",
        answer:
          "Ja, juist voor MKB is het waardevol. Grote bedrijven hebben doorgaans meer formele kennisdocumentatie. Bij MKB zit de kennis vaker in mensen - en is het risico van kennisuitstroom groter. MAISON BLNDR heeft kennismanagementprojecten gedaan bij bedrijven van twintig tot tweehonderd medewerkers in de regio.",
      },
      {
        question: "Hoe verschilt kennismanagement van RAG-systemen?",
        answer:
          "RAG (retrieval-augmented generation) is een technische architectuur waarbij een AI-model realtime informatie ophaalt uit een documentenset om antwoorden te genereren. Kennismanagement is het bredere organisatorische proces van kennis borgen, structureren en actueel houden. RAG kan onderdeel zijn van een kennismanagementoplossing, maar is niet hetzelfde.",
      },
    ],
    technologies: [
      "OpenAI",
      "Anthropic Claude",
      "LangChain",
      "Azure AI Search",
      "Notion / Confluence",
      "Next.js",
    ],
    tags: ["Kennisborging", "AI kennisbank", "Onboarding", "Organisatorisch leren"],
    heroImage: { src: "/images/tag-kennismanagement.png", alt: "AI kennisgraaf verbindt boeken, ideeën en processen in een centraal brein - kennismanagement met AI voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/kennismanagement-ai#service",
  },
  {
    slug: "ai-dashboard-ontwikkeling",
    title: "AI dashboard ontwikkeling",
    subtitle: "Interactieve dashboards die antwoord geven",
    description:
      "MAISON BLNDR bouwt AI-aangedreven business intelligence dashboards die niet alleen KPI's tonen, maar ook verklaren wat er achter de cijfers zit en de juiste vervolgactie suggereren.",
    parentSlug: "data-intelligentie-rapportages",
    parentTitle: "Data-intelligentie & Rapportages",
    metaTitle:
      "AI dashboard ontwikkeling - MAISON BLNDR Limburg | Business intelligence dashboard AI",
    metaDescription:
      "AI dashboard laten bouwen in Limburg? MAISON BLNDR ontwikkelt interactieve BI dashboards die KPI's verklaren en vervolgacties suggereren. Van data naar beslissing. Gratis strategiegesprek.",
    keywords: [
      "ai dashboard ontwikkeling",
      "business intelligence dashboard ai",
      "interactief datavisualisatie dashboard",
      "ai-powered reporting dashboard",
      "kpi dashboard op maat",
      "bi dashboard bouwen",
    ],
    longDescription: [
      "Veel dashboards tonen cijfers maar zeggen niet wat ermee te doen. Wij voegen uitleg, alerts en afwijkingsdetectie toe.",
      "Alle bronnen in één actueel beeld. Per rol de juiste KPI's.",
      "Voorspellende lijnen waar dat zinvol is. Training zodat je team zelf kan doorvragen.",
    ],
    benefits: [
      "Alle databronnen in één consistent dashboard",
      "AI verklaart trends en anomalieën automatisch",
      "Voorspellende analyses voor sturen",
      "Altijd actueel - geen handmatige exports",
      "Trainingen zodat je team zelfstandig analyseert",
    ],
    faqs: [
      {
        question: "Wat maakt een AI dashboard anders dan een normaal BI dashboard?",
        answer:
          "Een normaal BI dashboard toont historische data in grafieken en tabellen. Een AI dashboard voegt een intelligentielaag toe: automatische detectie van opvallende patronen, verklaringen in gewone taal bij trends, voorspellingen op basis van historische data en proactieve alerts als KPI's buiten verwachte bandbreedte bewegen.",
      },
      {
        question: "Met welke databronnen kan het dashboard verbinden?",
        answer:
          "MAISON BLNDR koppelt dashboards aan vrijwel elke databron: ERP (SAP, AFAS, Exact), CRM (HubSpot, Salesforce), marketing (Google Analytics, Meta), e-commerce platforms, productiesystemen en SQL-databases. Data uit meerdere bronnen wordt gecombineerd tot een consistent datamodel.",
      },
      {
        question: "Hoelang duurt het bouwen van een AI dashboard?",
        answer:
          "Een eerste werkend dashboard met de kernmetrieken is doorgaans klaar in vier tot zes weken. Dat omvat datasourcing, datamodelontwerp, visualisatieontwikkeling en AI-integratie. Uitgebreidere dashboards met voorspellende analyses en meerdere databronnen nemen acht tot twaalf weken in beslag.",
      },
      {
        question: "Kunnen medewerkers zelf queries en analyses uitvoeren?",
        answer:
          "Ja. MAISON BLNDR bouwt dashboards met een natural language query interface: je stelt een vraag in gewone taal en het systeem genereert direct de bijbehorende visualisatie. Geen SQL-kennis vereist. We trainen ook je team zodat ze zelfstandig nieuwe analyses kunnen opzetten.",
      },
      {
        question: "Is een AI dashboard geschikt voor MKB in Limburg?",
        answer:
          "Ja. Een goed dashboard is waardevoller naarmate je minder tijd hebt voor uitgebreide data-analyse - en dat geldt juist voor MKB. MAISON BLNDR heeft BI dashboards gebouwd voor diverse sectoren in de regio: van productiebedrijven tot zakelijke dienstverleners. We werken met budgetten die passen bij MKB.",
      },
    ],
    technologies: [
      "Power BI",
      "Metabase",
      "Next.js",
      "OpenAI",
      "dbt",
      "PostgreSQL",
    ],
    tags: ["Business intelligence", "Data visualisatie", "KPI monitoring", "Voorspellende analyse"],
    heroImage: { src: "/images/tag-ai-dashboard.png", alt: "Interactief AI dashboard met teal staafdiagrammen, lijngrafiek en KPI-kaarten - AI dashboard ontwikkeling voor datagedreven bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/ai-dashboard-ontwikkeling#service",
  },
  {
    slug: "automatische-rapportages-ai",
    title: "Automatische rapportages met AI",
    subtitle: "Rapporten die zichzelf schrijven",
    description:
      "Periodieke rapporten automatisch: data ophalen, cijfers berekenen, samenvatting schrijven. Klaar in je inbox, zonder handwerk.",
    parentSlug: "data-intelligentie-rapportages",
    parentTitle: "Data-intelligentie & Rapportages",
    metaTitle:
      "Automatische rapportages AI - MAISON BLNDR Limburg | Rapportage automatisering bedrijf",
    metaDescription:
      "Automatische rapportages laten inrichten in Limburg? MAISON BLNDR automatiseert periodieke rapporten inclusief AI-geschreven samenvattingen. Uren per maand bespaard. Gratis strategiegesprek.",
    keywords: [
      "automatische rapportages ai",
      "rapportage automatisering bedrijf",
      "ai rapport generatie",
      "geautomatiseerde periodieke rapportage",
      "management rapportage automatiseren",
      "maandrapportage automatiseren",
    ],
    longDescription: [
      "Maandelijks Excel's samenvoegen kost een halve dag. Wij automatiseren ophalen, rekenen, visualiseren en versturen.",
      "AI schrijft de samenvatting: wat viel op, vergelijking met vorige periode, wat actie vraagt.",
      "Consistent, op tijd, minder rekenfouten. Afwijkingen gemarkeerd in de tekst.",
      "Jouw format: PDF, PowerPoint, mail of dashboard.",
    ],
    benefits: [
      "Periodieke rapporten geautomatiseerd",
      "AI-geschreven narratieve samenvattingen",
      "Nooit meer calculatiefouten of vertraagde rapporten",
      "Proactieve signalering van afwijkende KPI's",
      "Output in PDF, PowerPoint, dashboard of e-mail",
    ],
    faqs: [
      {
        question: "Welke soorten rapporten kunnen worden geautomatiseerd?",
        answer:
          "Vrijwel elk periodiek rapport: maandelijkse managementrapporten, wekelijkse salesoverzichten, kwartaalrapportages voor aandeelhouders, operationele KPI-dashboards, marketingperformancerapporten en projectvoortgangsrapportages. Als het rapport een vaste structuur heeft en data uit bekende bronnen haalt, kan het worden geautomatiseerd.",
      },
      {
        question: "Hoe schrijft AI een narratieve samenvatting?",
        answer:
          "Het AI-model analyseert de data en vergelijkt die met historische benchmarks, seizoenspatronen en doelstellingen. Op basis daarvan genereert het een samenvatting in jouw tone of voice die de meest relevante ontwikkelingen benoemt en context geeft. Je kunt het model trainen op eerdere samenvattingen die je zelf hebt geschreven voor maximale consistentie.",
      },
      {
        question: "Hoe nauwkeurig zijn geautomatiseerde rapportages?",
        answer:
          "De data-uitvoer is even nauwkeurig als de databronnen: geen handmatige fouten, geen foutieve kopieerpraktijken. MAISON BLNDR bouwt validatieregels in die controleren of alle verwachte data aanwezig is en logisch consistent is. Bij afwijkingen wordt een alert gestuurd in plaats van een incorrect rapport.",
      },
      {
        question: "Kunnen bestaande Excel-rapportages worden geautomatiseerd?",
        answer:
          "Ja. MAISON BLNDR analyseert je huidige Excel-rapportage, identificeert alle databronnen en rekenmethoden, en bouwt een geautomatiseerd systeem dat hetzelfde resultaat produceert - maar dan zonder handmatig werk. Het eindresultaat kan nog steeds als Excel worden opgeleverd als dat gewenst is.",
      },
      {
        question: "Is rapportage automatisering geschikt voor MKB in Limburg?",
        answer:
          "Ja. Juist voor MKB-directeuren die meerdere petten dragen en geen tijd willen besteden aan rapporten samenstellen is dit waardevol. MAISON BLNDR heeft rapportageautomatisering geïmplementeerd bij diverse bedrijven in de regio. De return-on-investment is direct: de uren die je bespaart op rapportage zijn waardevol.",
      },
    ],
    technologies: [
      "Python",
      "OpenAI",
      "Power BI",
      "n8n",
      "PostgreSQL",
      "Microsoft 365",
    ],
    tags: ["Management rapportage", "BI automatisering", "AI copywriting", "Scheduled workflows"],
    heroImage: { src: "/images/tag-automatische-rapportages.png", alt: "AI schrijft automatisch rapporten met grafieken en bulletpoints vanuit ruwe data - automatische rapportages met AI voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/automatische-rapportages-ai#service",
  },
  {
    slug: "ai-implementatie-roadmap",
    title: "AI implementatie roadmap opstellen",
    subtitle: "Van diagnose naar uitvoeringsplan",
    description:
      "MAISON BLNDR stelt een concrete AI implementatie roadmap op - met prioriteiten, tijdlijn en investering - zodat je precies weet wat je wanneer doet en wat het oplevert.",
    parentSlug: "ai-strategie-quickscan",
    parentTitle: "AI Strategie & Quickscan",
    metaTitle:
      "AI implementatie roadmap opstellen - MAISON BLNDR Limburg | AI stappenplan bedrijf",
    metaDescription:
      "AI implementatie roadmap laten opstellen in Limburg? MAISON BLNDR maakt een concreet AI stappenplan met prioriteiten, tijdlijn en ROI. Van diagnose naar uitvoering. Gratis strategiegesprek.",
    keywords: [
      "ai implementatie roadmap opstellen",
      "ai roadmap bureau",
      "ai implementatieplan bedrijf",
      "ai stappenplan op maat",
      "ai strategie uitvoering",
      "ai planning bedrijf",
    ],
    longDescription: [
      "Quickscan zegt wat kan; roadmap zegt hoe. Volgorde, budget, wie, verwacht resultaat.",
      "Quick wins eerst voor draagvlak, daarna zwaardere stappen. Risico's en afhankelijkheden expliciet.",
      "Document dat board en directie kunnen gebruiken. Na goedkeuring kunnen wij uitvoeren.",
    ],
    benefits: [
      "Concrete prioriteitenmatrix op basis van ROI en complexiteit",
      "Stappenplan dat quick wins voorop zet",
      "Expliciete risico- en afhankelijkheidsinschatting per initiatief",
      "Direct bruikbaar als business case voor board of aandeelhouders",
      "MAISON BLNDR voert de roadmap ook uit",
    ],
    faqs: [
      {
        question: "Wat bevat een AI implementatie roadmap?",
        answer:
          "Een AI implementatie roadmap bevat: een overzicht van geïdentificeerde automatiseringskansen, een prioriteitenmatrix op basis van verwachte ROI en implementatiecomplexiteit, een fasering in kwartalen of maanden, per initiatief een beschrijving van aanpak, investering, tijdlijn en vereiste resources, en een risico- en afhankelijkheidsanalyse.",
      },
      {
        question: "Wat is het verschil tussen een roadmap en een quickscan?",
        answer:
          "Een quickscan identificeert de kansen: wat zijn de processen die in aanmerking komen voor AI, en wat leveren ze op? Een roadmap bepaalt hoe je die kansen aanpakt: welke prioriteit, welke volgorde, welk budget, welke risico's. De quickscan is de diagnose; de roadmap is het behandelplan.",
      },
      {
        question: "Hoe lang duurt het opstellen van een AI roadmap?",
        answer:
          "Na een gratis quickscan of op basis van bestaande procesanalyse stelt MAISON BLNDR een roadmap op in twee tot drie weken. We werken daarvoor intensief samen met jou en de relevante proceseigenaren. Het resultaat is een document dat direct bespreekbaar is op directie- of boardniveau.",
      },
      {
        question: "Is de roadmap ook bruikbaar als business case?",
        answer:
          "Ja, dat is een expliciete doelstelling. MAISON BLNDR structureert de roadmap zo dat je die direct kunt presenteren aan aandeelhouders, investeerders of een raad van commissarissen. Per initiatief staan de verwachte kosten, baten en terugverdientijd helder beschreven. Geen vage adviezen - concrete getallen.",
      },
      {
        question: "Voert MAISON BLNDR de roadmap ook uit voor bedrijven in Limburg?",
        answer:
          "Ja. De roadmap is het startpunt van een uitvoeringsrelatie, geen losse consultancyopdracht. MAISON BLNDR kent jouw bedrijf na de roadmap-fase goed genoeg om direct te beginnen met implementatie. Dat bespaart je de kosten en tijd van opnieuw een leverancier selecteren en inwerken.",
      },
    ],
    technologies: [
      "OpenAI",
      "Anthropic Claude",
      "n8n",
      "Make.com",
      "Python",
      "Microsoft Azure AI",
    ],
    tags: ["AI strategie", "Prioriteitenmatrix", "Business case", "Implementatieplanning"],
    heroImage: { src: "/images/tag-ai-implementatie-roadmap.png", alt: "AI implementatie roadmap: pad met teal mijlpalen en kompas - stap-voor-stap AI uitvoeringsplan voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/ai-implementatie-roadmap#service",
  },
  {
    slug: "ai-business-case",
    title: "AI business case opstellen",
    subtitle: "ROI-onderbouwing voor je AI-investering",
    description:
      "MAISON BLNDR stelt een heldere AI business case op met concrete ROI-berekening, haalbaarheidsanalyse en financiële onderbouwing - zodat je board niet twijfelt.",
    parentSlug: "ai-strategie-quickscan",
    parentTitle: "AI Strategie & Quickscan",
    metaTitle:
      "AI business case opstellen - MAISON BLNDR Limburg | ROI berekening AI investering",
    metaDescription:
      "AI business case laten opstellen in Limburg? MAISON BLNDR berekent ROI, kosten en haalbaarheid van je AI-investering. Concreet, boardklaar document. Gratis strategiegesprek.",
    keywords: [
      "ai business case opstellen",
      "roi berekening ai investering",
      "haalbaarheidsonderzoek ai",
      "business case ai project",
      "ai investering onderbouwen",
      "ai financiele analyse",
    ],
    longDescription: [
      "Boards keuren op cijfers, niet op hype. Investering, baten, terugverdientijd, risico's.",
      "Benchmarks uit Limburgse implementaties. Conservatief, met sensitiviteit als aannames lager uitvallen.",
      "Maximaal vijftien pagina's, in twintig minuten te beoordelen.",
    ],
    benefits: [
      "Concrete ROI-berekening op basis van realistische aannames",
      "Benchmarkdata uit eerdere implementaties in de regio",
      "Risico- en sensitiviteitsanalyse ingebouwd",
      "Boardklaar document in maximaal vijftien pagina's",
      "Eerlijk over onzekerheden - geloofwaardiger voor de CFO",
    ],
    faqs: [
      {
        question: "Wat bevat een AI business case?",
        answer:
          "Een AI business case bevat: een beschrijving van het te automatiseren proces of de te bouwen AI-oplossing, een gedetailleerde kostprijsberekening (ontwikkeling, licenties, beheer), een kwantificering van de verwachte baten (tijdsbesparing, foutreductie, omzeteffect), een ROI-berekening met terugverdientijd, een risico-analyse en een sensitiviteitsanalyse.",
      },
      {
        question: "Hoe nauwkeurig zijn de ROI-schattingen?",
        answer:
          "MAISON BLNDR baseert schattingen op benchmark-data uit eerdere implementaties en op een grondige analyse van jouw specifieke processen. Schattingen worden als range gepresenteerd (optimistisch, realistisch, conservatief). We zijn expliciet over aannames, zodat je board die kan challengen en zelf tot een oordeel kan komen.",
      },
      {
        question: "Verschilt een AI business case van een normale business case?",
        answer:
          "Een AI business case heeft specifieke karakteristieken: technologierisico (het model presteert anders dan verwacht), adoptierisico (medewerkers gebruiken het systeem niet optimaal) en het leereffect (resultaten verbeteren naarmate het systeem meer data verwerkt). MAISON BLNDR kwantificeert deze factoren expliciet - dat is wat een generalist niet kan.",
      },
      {
        question: "Hoe lang duurt het opstellen van een AI business case?",
        answer:
          "MAISON BLNDR stelt een volledige AI business case op in twee tot drie weken, afhankelijk van de beschikbaarheid van procesdata en de complexiteit van het initiatief. We plannen één tot twee werkessies met de relevante stakeholders voor het verzamelen van informatie.",
      },
      {
        question: "Is een AI business case nuttig voor bedrijven in Limburg zonder AI-ervaring?",
        answer:
          "Zonder eigen AI-ervaring helpt benchmarkdata uit de regio. Die cijfers maken je case concreter voor board of directie.",
      },
    ],
    technologies: [
      "OpenAI",
      "Microsoft Excel / Power BI",
      "Python",
      "n8n",
      "Microsoft Azure AI",
    ],
    tags: ["ROI-analyse", "Business case", "CFO-presentatie", "Haalbaarheidsonderzoek"],
    heroImage: { src: "/images/tag-ai-business-case.png", alt: "Weegschaal met investering links en stijgende ROI rechts - AI business case en ROI-onderbouwing voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/ai-business-case#service",
  },
  {
    slug: "ai-team-training",
    title: "AI team training voor bedrijven",
    subtitle: "Jouw team AI-vaardig maken",
    description:
      "MAISON BLNDR traint je team in het effectief werken met AI - van basisvaardigheden en prompt engineering tot het zelfstandig bouwen van AI-workflows. Praktisch, direct toepasbaar.",
    parentSlug: "ai-strategie-quickscan",
    parentTitle: "AI Strategie & Quickscan",
    metaTitle:
      "AI team training bedrijf - MAISON BLNDR Limburg | AI upskilling medewerkers",
    metaDescription:
      "AI team training voor je bedrijf in Limburg? MAISON BLNDR traint medewerkers in prompt engineering en AI-werkflows. Praktisch, direct toepasbaar. Gratis strategiegesprek.",
    keywords: [
      "ai team training bedrijf",
      "ai training medewerkers",
      "ai upskilling personeel",
      "ai workshop bedrijf",
      "prompt engineering training",
      "ai adoptie training",
    ],
    longDescription: [
      "Tools zonder adoptie leveren niets op. Training op wat je team echt gebruikt: prompts, n8n, Copilot, Claude.",
      "Praktisch: start bij het dagelijkse probleem, niet bij ML-geschiedenis.",
      "Workshop, traject of online. Playbook voor intern gebruik. Meten op gebruik na drie maanden.",
    ],
    benefits: [
      "Praktisch en direct toepasbaar op jouw tools en processen",
      "Trainingen op maat voor alle niveaus in je organisatie",
      "Inclusief change management en adoptie-begeleiding",
      "AI-playbook voor intern gebruik na de training",
      "Op locatie of online, halve dag tot meerdaagse trajecten",
    ],
    faqs: [
      {
        question: "Voor welke niveaus biedt MAISON BLNDR AI training aan?",
        answer:
          "MAISON BLNDR biedt trainingen voor drie niveaus: strategisch (directie en management - AI begrijpen en strategisch inzetten), operationeel (alle medewerkers - effectief werken met AI-tools in het dagelijks werk) en technisch (IT en proceseigenaren - zelf AI-workflows en automatiseringen bouwen zonder diepgaande programmeerkennis).",
      },
      {
        question: "Welke AI-tools komen aan bod in de training?",
        answer:
          "Dat hangt af van wat jouw bedrijf al gebruikt of wil gaan gebruiken. Standaard behandelen we ChatGPT, Claude, Microsoft Copilot, en automatiseringstool n8n of Make.com. Op verzoek gaan we dieper in op specifieke tools zoals GitHub Copilot, Notion AI, of de tools die MAISON BLNDR voor je heeft geïmplementeerd.",
      },
      {
        question: "Hoe lang duurt een AI team training?",
        answer:
          "Een intensieve sessie voor een team is doorgaans een halve of hele dag. Bredere leertrajecten voor grotere organisaties lopen over meerdere weken met wekelijkse sessies of gecombineerd met online modules. MAISON BLNDR adviseert het format op basis van je leerdoelen, teamgrootte en beschikbare tijd.",
      },
      {
        question: "Is AI training ook zinvol als je team al AI-tools gebruikt?",
        answer:
          "Vaak wel. Teams gebruiken maar een deel van wat de tools kunnen. Prompts, workflows en integratie leveren dan snel winst, omdat de basis al bekend is.",
      },
      {
        question: "Biedt MAISON BLNDR ook AI training op locatie in Limburg?",
        answer:
          "Ja. MAISON BLNDR is gevestigd in de regio en geeft trainingen op locatie bij bedrijven in heel Limburg. Werken op locatie maakt de training relevanter: we kunnen direct naar jullie eigen systemen, processen en tools verwijzen in plaats van generieke voorbeelden te gebruiken.",
      },
    ],
    technologies: [
      "ChatGPT / OpenAI",
      "Anthropic Claude",
      "Microsoft Copilot",
      "n8n",
      "Make.com",
      "GitHub Copilot",
    ],
    tags: ["Prompt engineering", "AI adoptie", "Upskilling", "Change management"],
    heroImage: { src: "/images/tag-ai-team-training.png", alt: "Drie medewerkers ontvangen AI-kennis via teal kennisstralen van scherm - AI team training voor bedrijven in Limburg" },
    jsonLdId: "https://maisonblender.com/diensten/ai-team-training#service",
  },
];

export function getTagPageBySlug(slug: string): TagPage | undefined {
  return tagPages.find((t) => t.slug === slug);
}

// Mapping from display tag label to its URL (Track A = own page, Track B = anchor on parent)
export const tagUrlMap: Record<string, string> = {
  "Conversational AI": "/diensten/conversational-ai",
  "WhatsApp & web chat": "/diensten/whatsapp-chatbot",
  "Lead generatie": "/diensten/lead-generatie-chatbot",
  Omnichannel: "/diensten/omnichannel-ai-klantcontact",
  "Multi-agent orkestratie": "/diensten/multi-agent-orkestratie",
  Documentverwerking: "/diensten/documentverwerking-ai",
  "CRM/ERP-koppelingen": "/diensten/crm-erp-koppelingen",
  Taakuitvoering: "/diensten/ai-taakuitvoering",
  "Robotic Process Automation": "/diensten/robotic-process-automation",
  "API-integraties": "/diensten/api-integraties-automatisering",
  Factuurverwerking: "/diensten/factuurverwerking-automatiseren",
  Schermautomatisering: "/diensten/schermautomatisering-rpa",
  Klantportalen: "/diensten/klantportaal-ontwikkeling-ai",
  "Web & mobiele apps": "/diensten/web-mobiele-app-ai",
  "AI-applicaties": "/diensten/ai-applicaties-maatwerk",
  Documentbeheer: "/diensten/documentbeheer-ai",
  "RAG-systemen": "/diensten/rag-systemen",
  Kennismanagement: "/diensten/kennismanagement-ai",
  Dashboards: "/diensten/ai-dashboard-ontwikkeling",
  "Automatische rapportages": "/diensten/automatische-rapportages-ai",
  "Gratis quickscan": "/diensten/ai-quickscan",
  Implementatieroadmap: "/diensten/ai-implementatie-roadmap",
  "Business case": "/diensten/ai-business-case",
  "Team training": "/diensten/ai-team-training",
};
