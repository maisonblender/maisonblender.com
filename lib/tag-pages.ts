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
  jsonLdId: string;
}

export const tagPages: TagPage[] = [
  {
    slug: "whatsapp-chatbot",
    title: "WhatsApp chatbot laten bouwen",
    subtitle: "Automatisch klantcontact via WhatsApp",
    description:
      "Een WhatsApp chatbot van Maison Blender handelt klantvragen af, plant afspraken in en kwalificeert leads — automatisch, 24/7, in de app die je klanten al dagelijks gebruiken.",
    parentSlug: "ai-chatbots-klantenservice",
    parentTitle: "AI Chatbots & Klantenservice",
    metaTitle:
      "WhatsApp chatbot laten bouwen — Maison Blender Limburg | Zakelijk WhatsApp automatiseren",
    metaDescription:
      "WhatsApp chatbot zakelijk laten bouwen? Maison Blender automatiseert je klantcontact via WhatsApp Business API. 70–85% minder handmatig werk. Actief in Sittard en heel Zuid-Limburg.",
    keywords: [
      "whatsapp chatbot zakelijk",
      "whatsapp chatbot bedrijf",
      "chatbot voor website",
      "whatsapp automatisering",
      "whatsapp business chatbot",
      "whatsapp klantenservice automatiseren",
    ],
    longDescription: [
      "Nederland telt meer dan 12 miljoen WhatsApp-gebruikers. Je klanten zitten er al — de vraag is of je er ook voor ze beschikbaar bent. Een WhatsApp chatbot van Maison Blender reageert direct op elk bericht: dag en nacht, ook als je team offline is. Niet met standaard antwoorden, maar met intelligente conversaties die de intentie van de klant begrijpen en de juiste actie ondernemen.",
      "Wij bouwen WhatsApp chatbots op de officiële WhatsApp Business API, gekoppeld aan jouw CRM, agenda en kennisbank. De chatbot weet wie je klant is, wat ze eerder hebben gevraagd en wat de status van hun bestelling of afspraak is. Ze sturen zichzelf bij op basis van feedback. Je klant merkt het verschil met een medewerker nauwelijks — tenzij ze om een mens vragen, want dan schakelt de chatbot naadloos over naar je team.",
      "De toepassingen zijn concreet: een Limburgse autogarage die via WhatsApp APK-afspraken inplant zonder telefonisch wachten. Een kliniek die patiënten automatisch herinnert en vervolgafspraken laat verzetten. Een webshop die retourzendingen verwerkt zonder e-mailtickets. Gemiddeld verwerken onze chatbots 70–85% van het inkomende klantcontact volledig zelfstandig.",
      "Maison Blender verzorgt de volledige implementatie — van het aanvragen van de WhatsApp Business API-licentie tot het trainen van het model op jouw producten en het koppelen aan je systemen. Je bent met iemand in gesprek die dit al meerdere keren voor bedrijven in Zuid-Limburg heeft gedaan. Geen externe consultants, geen onboarding in het buitenland.",
    ],
    benefits: [
      "Direct beschikbaar via het kanaal dat je klanten al gebruiken",
      "70–85% van klantcontacten automatisch afgehandeld",
      "Naadloos doorschakelen naar menselijke medewerker",
      "Volledige integratie met CRM, agenda en kennisbank",
      "Officiële WhatsApp Business API — geen grijze zone",
    ],
    faqs: [
      {
        question: "Wat is een WhatsApp chatbot en hoe werkt het?",
        answer:
          "Een WhatsApp chatbot is een geautomatiseerde gesprekspartner die via WhatsApp communiceert. Je klant stuurt een bericht, de chatbot begrijpt de intentie, haalt informatie op uit je systemen en stuurt een antwoord — of voert een actie uit zoals het inplannen van een afspraak. De chatbot draait op de officiële WhatsApp Business API en is verbonden met jouw CRM of kennisbank.",
      },
      {
        question:
          "Wat zijn de voordelen van een WhatsApp chatbot voor het MKB?",
        answer:
          "Je bent 24/7 bereikbaar zonder extra personeel. Klanten hoeven niet te wachten op een reactie per e-mail. Repetitieve vragen worden automatisch beantwoord, zodat je team tijd overhoudt voor complexe taken. Uit onze implementaties blijkt dat 70–85% van het inkomende klantcontact volledig zelfstandig wordt afgehandeld.",
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
          "Bedrijven in de zorg, dienstverlening, retail en zakelijke dienstverlening in Zuid-Limburg zetten al WhatsApp chatbots in voor afspraakplanning, klantenservice en leadopvolging. Vanwege vertrouwelijkheidsafspraken noemen we klanten niet bij naam, maar bij een gratis strategiegesprek lopen we concrete cases door.",
      },
    ],
    technologies: [
      "WhatsApp Business API",
      "OpenAI GPT-4o",
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
    jsonLdId:
      "https://maisonblender.com/diensten/whatsapp-chatbot#service",
  },
  {
    slug: "robotic-process-automation",
    title: "Robotic Process Automation",
    subtitle: "Digitale robots die jouw handmatige taken overnemen",
    description:
      "RPA-robots van Maison Blender automatiseren schermtaken, koppelen systemen en verwerken data — betrouwbaar, foutloos en volledig beheerd door ons.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "Robotic Process Automation bureau — Maison Blender Limburg | RPA implementeren",
    metaDescription:
      "RPA laten implementeren door een specialist in Zuid-Limburg? Maison Blender automatiseert repetitieve taken met Robotic Process Automation. Gemiddeld 15-25 uur tijdsbesparing per week. Gratis quickscan beschikbaar.",
    keywords: [
      "robotic process automation bureau",
      "RPA implementeren",
      "RPA software nederland",
      "procesautomatisering RPA",
      "RPA Limburg",
      "softwarerobot bedrijf",
    ],
    longDescription: [
      "Robotic Process Automation (RPA) is de technologie waarbij softwarerobots exact dezelfde handelingen uitvoeren als een medewerker achter een computer: klikken, kopiëren, invullen, opslaan. Maar dan tien keer sneller, nooit moe en nooit fout. Voor het MKB in Zuid-Limburg is RPA vaak de directste weg naar significante tijdsbesparing, zonder dat je bestaande systemen hoeft te vervangen.",
      "Maison Blender implementeert RPA-oplossingen die aansluiten op jouw specifieke processen. Wij starten altijd met een analyse van welke taken het meest tijdsintensief en foutgevoelig zijn. Denk aan: facturen verwerken vanuit e-mail naar boekhoudpakket, klantgegevens synchroniseren tussen systemen, of maandelijkse rapportages samenstellen uit meerdere databronnen. Wij bouwen de robot, testen hem grondig en beheren hem proactief.",
      "Het verschil met gewone automatisering is dat RPA kan werken met bestaande softwareinterfaces — inclusief legacy-systemen die geen API bieden. De robot 'ziet' het scherm zoals een mens dat doet, en voert de handelingen uit op precies dezelfde manier. Dat maakt RPA toepasbaar op vrijwel elk herhaalbaar procesonderdeel, ook als je leverancier geen koppeling biedt.",
      "Onze klanten in Limburg besparen gemiddeld 15–25 uur per week op handmatige dataverwerking na RPA-implementatie. De return-on-investment is voor de meeste projecten zichtbaar binnen drie maanden. Na de lancering beheren wij de robots actief: bij systeemupdates of proceswijzigingen passen wij ze aan zodat je nooit stilstaat.",
    ],
    benefits: [
      "Geen bestaande systemen vervangen — RPA werkt bovenop wat je al hebt",
      "Gemiddeld 15–25 uur tijdsbesparing per week",
      "ROI zichtbaar binnen drie maanden",
      "Volledig beheerd — inclusief updates bij systeemwijzigingen",
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
          "Tijdsbesparing is het meest directe voordeel: medewerkers besteden minder tijd aan handmatig werk en meer aan taken die echte waarde toevoegen. Daarnaast elimineert RPA menselijke fouten in dataverwerking, verhoogt het de verwerkingssnelheid en biedt het volledige audittrails van elke actie.",
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
          "Ja — dat is juist een van de sterkste punten van RPA. Omdat de robot werkt via de gebruikersinterface (het scherm), is het niet afhankelijk van API's of moderne software. Zelfs twintig jaar oude systemen zonder koppelmogelijkheden zijn automatiseerbaar met RPA.",
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
    jsonLdId:
      "https://maisonblender.com/diensten/robotic-process-automation#service",
  },
  {
    slug: "conversational-ai",
    title: "Conversational AI",
    subtitle: "Intelligente gesprekken op elk kanaal",
    description:
      "Conversational AI van Maison Blender bouwt AI-agents die niet alleen vragen beantwoorden, maar de intentie begrijpen, context onthouden en actie ondernemen — op web, WhatsApp, e-mail en meer.",
    parentSlug: "ai-chatbots-klantenservice",
    parentTitle: "AI Chatbots & Klantenservice",
    metaTitle:
      "Conversational AI bureau — Maison Blender Limburg | Intelligente chatbot bouwen",
    metaDescription:
      "Conversational AI platform laten bouwen door een specialist? Maison Blender ontwikkelt intelligente AI-agents die intentie begrijpen en acties uitvoeren. Actief voor bedrijven in Zuid-Limburg.",
    keywords: [
      "conversational ai bureau",
      "ai chatbot bouwen",
      "conversational ai platform",
      "intelligente chatbot",
      "conversational ai Limburg",
      "ai klantenservice agent",
    ],
    longDescription: [
      "Conversational AI is de technologie achter AI-agents die in natuurlijke taal kunnen communiceren: ze begrijpen wat je klant bedoelt, onthouden de context van het gesprek en weten wanneer ze een vraag moeten stellen of een actie moeten ondernemen. Het verschil met een gewone chatbot is fundamenteel. Een gewone chatbot volgt een script. Een conversational AI-agent denkt mee.",
      "Maison Blender bouwt conversational AI-agents op basis van de meest geavanceerde taalmodellen — GPT-4o en Claude 3.5 Sonnet — aangevuld met jouw eigen bedrijfsdata. De agent kent je producten, diensten, klanthistorie en processen. Hij past zijn toon aan op de situatie: professioneel in zakelijke communicatie, warmer in klantenservice. En hij leert van elk gesprek.",
      "De toepassingen gaan verder dan klantenservice. Conversational AI-agents kunnen ook intern worden ingezet: medewerkers stellen vragen aan de bedrijfskennisbank in gewone taal en krijgen directe, accurate antwoorden. Of een sales-agent die leads automatisch kwalificeert via een gesprek voordat ze worden doorgegeven aan een accountmanager.",
      "Voor bedrijven in Zuid-Limburg is dit het moment om in te stappen. De technologie is volwassen genoeg voor productieomgevingen, maar de meeste concurrenten beginnen net. Maison Blender heeft meerdere conversational AI-trajecten afgerond voor Limburgse bedrijven en weet welke valkuilen vermeden moeten worden en welke aanpakken direct werken.",
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
          "Ja — plan een gratis strategiegesprek bij Maison Blender in Sittard. We laten je live zien hoe onze conversational AI-agents presteren voor vergelijkbare bedrijven en hoe dat vertaalt naar jouw situatie.",
      },
    ],
    technologies: [
      "OpenAI GPT-4o",
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
    jsonLdId:
      "https://maisonblender.com/diensten/conversational-ai#service",
  },
  {
    slug: "rag-systemen",
    title: "RAG-systemen",
    subtitle: "Je eigen data doorzoekbaar met AI",
    description:
      "Een RAG-systeem van Maison Blender geeft medewerkers directe toegang tot alle interne kennis via AI — documenten, contracten, handleidingen — in gewone taal, met accurate antwoorden.",
    parentSlug: "data-intelligentie-rapportages",
    parentTitle: "Data-intelligentie & Rapportages",
    metaTitle:
      "RAG systeem implementeren — Maison Blender Limburg | Retrieval-Augmented Generation",
    metaDescription:
      "RAG systeem laten implementeren voor je bedrijf? Maison Blender koppelt AI aan jouw eigen documenten en kennisbank. Antwoorden gebaseerd op jouw data, niet op het internet. Actief in Zuid-Limburg.",
    keywords: [
      "rag systeem implementeren",
      "retrieval augmented generation",
      "kennisbank AI",
      "AI op eigen data",
      "RAG bureau Limburg",
      "enterprise AI kennissysteem",
    ],
    longDescription: [
      "RAG staat voor Retrieval-Augmented Generation. Het is de technologie die een taalmodel koppelt aan jouw eigen documenten en databases, zodat de AI alleen antwoorden geeft op basis van jouw data — niet op basis van wat ergens op het internet staat. Het resultaat: medewerkers kunnen vragen stellen in gewone taal en krijgen nauwkeurige, actuele antwoorden direct uit je eigen kennisbase.",
      "Maison Blender implementeert RAG-systemen die werken met alle gangbare documentformaten: Word, PDF, Excel, e-mails, SharePoint-mappen, Confluence-pagina's. We vectoriseren je documenten, slaan ze op in een geoptimaliseerde vectordatabase en bouwen een AI-interface die je medewerkers direct kunnen gebruiken. Het systeem weet welke documenten er zijn, zoekt de relevante passages op en genereert een antwoord met bronvermelding.",
      "De praktische impact is aanzienlijk. Nieuwe medewerkers zijn sneller ingewerkt omdat ze antwoorden direct kunnen opvragen in plaats van de juiste persoon te moeten zoeken. Medewerkers in de buitendienst kunnen contractdetails opvragen terwijl ze bij de klant zitten. Klantenserviceteams geven consistent correcte informatie zonder handmatig door kennisdocumenten te zoeken.",
      "Voor bedrijven in Zuid-Limburg die veel hebben geïnvesteerd in documentatie, procedures of technische handleidingen is dit bijzonder waardevol. Wij implementeren RAG-systemen die veilig on-premise of in een beveiligde cloudomgeving draaien — je data verlaat je omgeving niet tenzij je dat wilt.",
    ],
    benefits: [
      "Directe toegang tot interne kennis in gewone taal",
      "Antwoorden altijd gebaseerd op jouw actuele documenten",
      "Bronvermelding bij elk antwoord — transparant en controleerbaar",
      "Werkt met alle gangbare documentformaten",
      "Veilig: on-premise of eigen cloudomgeving mogelijk",
    ],
    faqs: [
      {
        question: "Wat is een RAG-systeem en hoe werkt het?",
        answer:
          "RAG (Retrieval-Augmented Generation) combineert een AI-taalmodel met een zoekmechanisme over jouw documenten. Stel je een vraag, dan zoekt het systeem de meest relevante passages op in je eigen documenten en gebruikt die als basis voor het antwoord. De AI verzint niets — alles is terug te herleiden naar bronnen in jouw eigen data.",
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
          "Ja, mits juist ingericht. We kunnen een RAG-systeem volledig on-premise draaien — jouw data verlaat je eigen serveromgeving niet. Ook cloud-implementaties zijn mogelijk in een geïsoleerde, beveiligde omgeving (bijv. Azure Private Link). We adviseren je over de beste aanpak voor jouw compliancevereisten.",
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
    jsonLdId: "https://maisonblender.com/diensten/rag-systemen#service",
  },
  {
    slug: "crm-erp-koppelingen",
    title: "CRM & ERP-koppelingen",
    subtitle: "Systemen die automatisch met elkaar praten",
    description:
      "Maison Blender koppelt je CRM, ERP en andere software via robuuste API-integraties en AI-automatisering — zodat data automatisch klopt en je team nooit dubbel invoert.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "CRM koppeling automatisering — Maison Blender Limburg | ERP integratie bureau",
    metaDescription:
      "CRM en ERP koppelen met AI-automatisering? Maison Blender bouwt robuuste API-integraties voor HubSpot, Salesforce, SAP, AFAS en Exact. Geen dubbele invoer meer. Actief in Zuid-Limburg.",
    keywords: [
      "crm koppeling automatisering",
      "ERP integratie bureau",
      "API koppeling CRM",
      "systemen koppelen AI",
      "CRM ERP integratie Limburg",
      "HubSpot SAP koppeling",
    ],
    longDescription: [
      "De meeste bedrijven werken met vijf tot tien softwarepakketten. CRM voor klantbeheer, ERP voor boekhouding en voorraden, een webshop, een projecttool en misschien een losse planningsapplicatie. Al die systemen bevatten overlappende data — en als ze niet met elkaar praten, gaat er handmatig werk in zitten. Maison Blender elimineert die handmatige schakel door systemen te koppelen die automatisch de juiste informatie uitwisselen.",
      "Wij bouwen API-integraties op maat, van eenvoudige webhooks tot complexe bi-directionele synchronisaties met foutafhandeling en logging. We werken met de standaard REST en GraphQL API's van jouw bestaande tools — HubSpot, Salesforce, SAP, Exact, AFAS, Odoo, Shopify, WooCommerce — en met middleware-platforms als n8n en Make.com voor visuele workflow-automatisering.",
      "Naast technische koppelingen voegen wij AI toe waar nuttig. Een AI-agent die inkomende leads vanuit je webformulier automatisch verrijkt met bedrijfsdata, kwalificeert en toevoegt aan de juiste CRM-pipeline. Of een koppeling die offerteregels uit je ERP haalt, een offertedocument genereert en het rechtstreeks mailt naar de klant — zonder menselijke tussenkomst.",
      "Voor Limburgse bedrijven met complexe ERP-omgevingen of branchespecifieke software zijn wij gewend aan maatwerk. Wij hebben ervaring met koppelingen voor bedrijven in de maakindustrie, zorg, logistiek en zakelijke dienstverlening in Zuid-Limburg. Als er een API beschikbaar is — en soms ook als die er niet is — vinden we een oplossing.",
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
          "De investering hangt sterk af van de complexiteit — het aantal systemen, de richting van de synchronisatie en de gewenste businesslogica. Na de gratis quickscan ontvang je een transparant voorstel. Eenvoudige koppelingen zijn betaalbaar voor elk MKB-budget; complexere bi-directionele integraties vragen meer.",
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
          "Ja — koppelingen vereisen geen vervanging of migratie van bestaande systemen. We verbinden wat je al hebt. In gevallen waar geen directe API beschikbaar is, gebruiken we RPA of screen-scraping om toch een betrouwbare koppeling te realiseren.",
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
    jsonLdId:
      "https://maisonblender.com/diensten/crm-erp-koppelingen#service",
  },
  {
    slug: "factuurverwerking-automatiseren",
    title: "Factuurverwerking automatiseren",
    subtitle: "Van inbox naar boekhouding — automatisch",
    description:
      "Maison Blender automatiseert de volledige factuurverwerking: PDF's uitlezen, regels matchen, goedkeuringen routeren en boeken in je boekhoudpakket — zonder handmatig werk.",
    parentSlug: "rpa-workflow-integraties",
    parentTitle: "RPA & Workflow-integraties",
    metaTitle:
      "Factuurverwerking automatiseren met AI — Maison Blender Limburg | AP-automatisering",
    metaDescription:
      "Factuurverwerking automatiseren met AI? Maison Blender verwerkt inkomende facturen automatisch in Exact, AFAS en SAP. 80–90% tijdsbesparing. Gratis quickscan beschikbaar in Zuid-Limburg.",
    keywords: [
      "factuurverwerking automatiseren",
      "automatische factuurverwerking",
      "facturen verwerken AI",
      "AP-automatisering",
      "factuurherkenning software",
      "crediteuren automatiseren Limburg",
    ],
    longDescription: [
      "Factuurverwerking is een van de meest tijdrovende en foutgevoelige administratieve taken in het bedrijfsleven. Elke inkomende factuur moet worden uitgelezen, gecontroleerd, gematcht aan een inkooporder, goedgekeurd en geboekt. Bij honderd facturen per maand kost dat een halve tot volledige arbeidsplaats. Maison Blender automatiseert dit proces van begin tot eind met AI-gestuurde factuurverwerking.",
      "Ons systeem herkent facturen in alle gangbare formaten — PDF, e-mail, scan, UBL-XML — en extraheert automatisch de relevante data: leverancier, factuurnummer, regels, bedragen, BTW-splitsing, kostenplaatsen. Die data wordt gematcht aan je openstaande inkooporders in je ERP. Klopt alles? Dan wordt de factuur automatisch geboekt. Klopt er iets niet? Dan gaat de factuur naar de juiste medewerker voor goedkeuring — met alle context alvast voorbereid.",
      "De nauwkeurigheid van moderne AI-factuurherkenning ligt boven de 95% voor gestructureerde facturen van bekende leveranciers. Voor minder gestructureerde facturen of nieuwe leveranciers leert het systeem van correcties en verbetert het continu. Wij bouwen ook de goedkeuringsflows in: wie keurt welke facturen goed, tot welk bedrag, en wat zijn de escalatiepaden bij afwezigheid.",
      "Bedrijven in Zuid-Limburg die meer dan vijftig facturen per maand verwerken, halen doorgaans 80–90% tijdsbesparing op de AP-verwerking. Het systeem integreert met Exact, AFAS, SAP, Twinfield en Snelstart. Compliance en audit-trail zijn ingebouwd: elke stap in het verwerkingsproces wordt gelogd.",
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
          "AI-factuurverwerking combineert documentherkenning (OCR) met een taalmodel dat de structuur en betekenis van de factuurdata begrijpt. Het systeem extraheert alle relevante velden, matcht ze aan je bestaande data (inkooporders, leveranciersgegevens) en neemt automatisch de juiste actie — boeken of routeren voor goedkeuring.",
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
      "OpenAI GPT-4o",
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
    jsonLdId:
      "https://maisonblender.com/diensten/factuurverwerking-automatiseren#service",
  },
  {
    slug: "ai-quickscan",
    title: "Gratis AI quickscan",
    subtitle: "Weet wat AI oplevert vóór je investeert",
    description:
      "In een gratis automatiseringsquickscan brengt Maison Blender de vijftien meest kansrijke automatiseringsmogelijkheden in je bedrijf in kaart — met verwachte ROI per kans.",
    parentSlug: "ai-strategie-quickscan",
    parentTitle: "AI Strategie & Quickscan",
    metaTitle:
      "Gratis AI quickscan voor je bedrijf — Maison Blender Limburg | Automatisering scan",
    metaDescription:
      "Gratis AI quickscan aanvragen? Maison Blender brengt de automatiseringskansen in je bedrijf in kaart met concrete ROI-schattingen. Geen verplichtingen. Actief in Sittard en heel Zuid-Limburg.",
    keywords: [
      "ai quickscan gratis",
      "automatisering quickscan",
      "AI scan bedrijf",
      "gratis AI analyse",
      "AI potentieel scan",
      "automatisering scan Limburg",
    ],
    longDescription: [
      "De meest voorkomende reden waarom bedrijven nog niet met AI bezig zijn, is niet onwil — het is onzekerheid. Waar begin je? Wat levert het op? Hoeveel kost het? De gratis AI quickscan van Maison Blender neemt die onzekerheid weg. In één sessie brengen wij je belangrijkste processen in kaart en identificeren de concrete kansen waar AI het meeste kan opleveren.",
      "De quickscan bestaat uit een gerichte intake van twee tot drie uur met de proceseigenaren van jouw bedrijf. Wij kijken naar volume, herhaalbaarheid, foutgevoeligheid en strategisch belang van elke taak. Op basis daarvan maken wij een prioriteitenmatrix: welke processen leveren het meest op als ze worden geautomatiseerd, en welke zijn het snelst implementeerbaar?",
      "Het rapport bevat voor elk geïdentificeerd kansgebied: een beschrijving van de huidige situatie, de aanbevolen AI-aanpak, een schatting van de tijdsbesparing of kostenverlaging, en een indicatieve investering. Geen vage adviezen — concrete getallen waar je iets mee kunt. Het rapport is direct bruikbaar als business case voor de directie of aandeelhouders.",
      "De quickscan is gratis en zonder verplichtingen. Wij doen dit omdat wij geloven dat Limburgse bedrijven goed geïnformeerde beslissingen moeten kunnen nemen over AI. Of je daarna kiest voor Maison Blender of een andere partij — dat is jouw beslissing. Maar de meeste bedrijven die de quickscan doen, komen terug. Niet omdat ze moeten, maar omdat het rapport overtuigend genoeg is om direct te starten.",
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
          "De quickscan wordt uitgevoerd door de consultants van Maison Blender — dezelfde mensen die ook de implementaties doen. Geen juniors of stagiaires, maar practitioners met hands-on ervaring in AI-implementatie bij bedrijven in Zuid-Limburg.",
      },
      {
        question: "Is de quickscan echt gratis?",
        answer:
          "Ja, zonder verborgen kosten. Wij vragen geen tegenprestatie en er zijn geen verplichtingen. Wij doen dit omdat een goed geïnformeerde klant een betere klant is — en omdat ons rapport voor zichzelf spreekt.",
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
          "Ja. Maison Blender heeft quickscans uitgevoerd voor bedrijven in diverse sectoren in Zuid-Limburg: maakindustrie, zakelijke dienstverlening, zorg en retail. Vanwege vertrouwelijkheid noemen we namen niet publiekelijk, maar tijdens het strategiegesprek bespreken we vergelijkbare cases.",
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
    jsonLdId: "https://maisonblender.com/diensten/ai-quickscan#service",
  },
];

export function getTagPageBySlug(slug: string): TagPage | undefined {
  return tagPages.find((t) => t.slug === slug);
}

// Mapping from display tag label to its URL (Track A = own page, Track B = anchor on parent)
export const tagUrlMap: Record<string, string> = {
  "Conversational AI": "/diensten/conversational-ai",
  "WhatsApp & web chat": "/diensten/whatsapp-chatbot",
  "Lead generatie": "/diensten/ai-chatbots-klantenservice#lead-generatie",
  Omnichannel: "/diensten/ai-chatbots-klantenservice#omnichannel",
  "Multi-agent orkestratie":
    "/diensten/ai-agents-procesautomatisering#multi-agent",
  Documentverwerking:
    "/diensten/ai-agents-procesautomatisering#documentverwerking",
  "CRM/ERP-koppelingen": "/diensten/crm-erp-koppelingen",
  Taakuitvoering: "/diensten/ai-agents-procesautomatisering#taakuitvoering",
  "Robotic Process Automation": "/diensten/robotic-process-automation",
  "API-integraties": "/diensten/rpa-workflow-integraties#api-integraties",
  Factuurverwerking: "/diensten/factuurverwerking-automatiseren",
  Schermautomatisering:
    "/diensten/rpa-workflow-integraties#schermautomatisering",
  Klantportalen: "/diensten/custom-ai-software#klantportalen",
  "Web & mobiele apps": "/diensten/custom-ai-software#web-mobiele-apps",
  "AI-applicaties": "/diensten/custom-ai-software#ai-applicaties",
  Documentbeheer: "/diensten/custom-ai-software#documentbeheer",
  "RAG-systemen": "/diensten/rag-systemen",
  Kennismanagement:
    "/diensten/data-intelligentie-rapportages#kennismanagement",
  Dashboards: "/diensten/data-intelligentie-rapportages#dashboards",
  "Automatische rapportages":
    "/diensten/data-intelligentie-rapportages#automatische-rapportages",
  "Gratis quickscan": "/diensten/ai-quickscan",
  Implementatieroadmap: "/diensten/ai-strategie-quickscan#implementatieroadmap",
  "Business case": "/diensten/ai-strategie-quickscan#business-case",
  "Team training": "/diensten/ai-strategie-quickscan#team-training",
};
