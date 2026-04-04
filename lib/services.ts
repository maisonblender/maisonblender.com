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
      "Automatiseer tot 90% van je klantenservice met AI-agents die vragen beantwoorden, afspraken inplannen en leads kwalificeren — via web, WhatsApp, e-mail en meer.",
    tags: ["Conversational AI", "WhatsApp & web chat", "Lead generatie", "Omnichannel"],
    metaTitle: "AI Chatbots & Klantenservice — Maison Blender | 24/7 Geautomatiseerde Klantinteractie",
    metaDescription:
      "Automatiseer tot 90% van je klantenservice met intelligente AI-chatbots. Maison Blender bouwt conversational AI-agents voor web, WhatsApp en e-mail. Actief in Sittard, Maastricht en heel Zuid-Limburg.",
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
      "Je klanten verwachten directe antwoorden — dag en nacht, ook buiten kantooruren. Met een AI-chatbot van Maison Blender geef je klantenservice een krachtige upgrade zonder extra personeel. Wij bouwen intelligente conversational AI-agents die naadloos integreren met je bestaande systemen: van je website tot WhatsApp Business, e-mail en zelfs telefoon.",
      "Onze AI-chatbots zijn niet de simpele knoppen-chatbots van vroeger. Ze begrijpen de intentie achter een vraag, halen informatie op uit je CRM of kennisbank, en geven persoonlijke, accurate antwoorden. Ze leren van elk gesprek en worden continu beter. Denk aan een chatbot die niet alleen vragen beantwoordt, maar ook zelfstandig afspraken inplant, offertes genereert of klachten registreert — allemaal zonder menselijke tussenkomst.",
      "Voor bedrijven in Zuid-Limburg die groeien zonder evenredig meer personeel aan te nemen, is dit een directe hefboom. Klanten krijgen sneller antwoord, je medewerkers houden tijd over voor complexe of waardevolle taken, en je conversieratio stijgt doordat leads direct worden gekwalificeerd en opgevolgd. Gemiddeld automatiseren onze klanten 70 tot 90% van de repetitieve klantcontacten.",
      "Wij zorgen voor de volledige implementatie: van het trainen van het model op je producten en diensten, tot de integratie met je CRM, ERP of helpdesksysteem. Jij hoeft niets te doen dan de resultaten te zien. Na de lancering monitoren en verbeteren wij de chatbot op basis van echte gesprekken.",
    ],
    benefits: [
      "70–90% minder repetitief klantcontact voor je team",
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
    sections: [
      {
        id: "lead-generatie",
        title: "Lead generatie via AI",
        content:
          "AI-gestuurde lead generatie via conversational AI gaat verder dan een contactformulier. Een AI-agent op je website of WhatsApp-kanaal kwalificeert bezoekers in real-time: wat zijn hun behoeften, welk budget hebben ze, hoe urgent is de vraag? De agent verzamelt deze informatie in een natuurlijk gesprek — zonder dat de bezoeker het gevoel heeft een formulier in te vullen. Het resultaat: warme leads die direct naar de juiste salesmedewerker gaan, met alle context al uitgeschreven. Maison Blender koppelt AI-gestuurde lead generatie aan je CRM zodat elke lead automatisch wordt aangemaakt, gescoord en opgevolgd. Uit onze implementaties blijkt dat de conversie van websitebezoeker naar qualified lead gemiddeld met 35–60% stijgt na implementatie van AI-gestuurde lead generatie.",
      },
      {
        id: "omnichannel",
        title: "Omnichannel klantcontact",
        content:
          "Omnichannel betekent meer dan aanwezig zijn op meerdere kanalen — het betekent dat je klant een consistente ervaring heeft, ongeacht welk kanaal ze kiezen. Een gesprek dat begint op WhatsApp moet naadloos doorgaan op e-mail of telefonisch, zonder dat de klant alles opnieuw hoeft uit te leggen. Maison Blender bouwt omnichannel AI-agents die context meenemen over kanalen heen. Technisch gezien draait er één centrale agent gekoppeld aan alle kanalen: web, WhatsApp Business, e-mail, Messenger en telefoon. De klanthistorie, openstaande vragen en gesprekscontext zijn overal beschikbaar. Voor MKB in Limburg met klanten die via verschillende kanalen contact opnemen, is dit de oplossing die zorgt dat je team niet steeds opnieuw begint.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-chatbots-klantenservice#service",
    jsonLdServiceType: "Conversational AI & Klantenservice Automatisering",
  },
  {
    id: "02",
    slug: "ai-agents-procesautomatisering",
    title: "AI Agents & Procesautomatisering",
    subtitle: "Intelligente agents die voor je werken",
    description:
      "Custom AI-agents die taken uitvoeren: documenten verwerken, e-mails interpreteren, acties uitvoeren in je CRM of ERP. 24/7 operationeel, zonder menselijke tussenkomst.",
    tags: ["Multi-agent orkestratie", "Documentverwerking", "CRM/ERP-koppelingen", "Taakuitvoering"],
    metaTitle: "AI Agents & Procesautomatisering — Maison Blender | Intelligente Agents voor Je Bedrijf",
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
      "De volgende stap na chatbots zijn AI-agents: autonome digitale medewerkers die zelfstandig taken uitvoeren, beslissingen nemen en systemen aansturen. Maison Blender ontwikkelt custom AI-agents die werken als verlengstuk van je team — dag en nacht, zonder fouten door vermoeidheid of afleiding.",
      "Een AI-agent van ons leest binnenkomende e-mails, interpreteert de inhoud, haalt relevante data op uit je systemen en neemt de juiste actie: een offerte aanmaken in je ERP, een taak aanmaken in je projecttool, of een antwoord sturen aan de klant. Dit alles zonder dat een medewerker er naar hoeft te kijken. Bij complexere taken kan de agent escaleren naar een collega of een ander systeem.",
      "Voor organisaties met veel terugkerende, kennisintensieve taken is dit transformatief. Denk aan een makelaarskantoor dat automatisch bezichtigingen plant en dossiers bijwerkt. Of een logistiek bedrijf dat AI inzet om inkomende vrachtbrieven te verwerken, afwijkingen te signaleren en klanten proactief te informeren. De mogelijkheden zijn breed: overal waar mensen nu repetitieve beslissingstaken uitvoeren, kan een AI-agent het overnemen.",
      "Maison Blender bouwt deze agents op maat, gebaseerd op jouw specifieke processen en systemen. Wij werken met de nieuwste frameworks zoals LangChain en multi-agent orkestratie om agents te laten samenwerken op complexe workflows. Je krijgt een schaalbare, veilige oplossing die meegroeit met je organisatie.",
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
          "Multi-agent orkestratie is de aanpak waarbij meerdere gespecialiseerde AI-agents samenwerken aan een complex proces. Eén agent leest de inkomende e-mail en classificeert het verzoek. Een tweede agent haalt relevante data op uit je CRM. Een derde voert de benodigde actie uit. Een coördinerende orchestrator-agent stuurt het geheel aan. Maison Blender bouwt multi-agent systemen op basis van LangChain en AutoGen, waarbij elke agent zijn eigen verantwoordelijkheid heeft en fouten door de andere agents worden opgevangen. Dit is de architectuur die schaalbaar is naar hoge volumes: bij drukte worden meer instanties van dezelfde agent opgestart. Bedrijven met complexe, meertrapsprocessen die nu door meerdere medewerkers worden afgehandeld, zijn de ideale kandidaat voor multi-agent automatisering.",
      },
      {
        id: "documentverwerking",
        title: "Intelligente documentverwerking",
        content:
          "AI-gestuurde documentverwerking gaat verder dan OCR. Een intelligent document processing-systeem van Maison Blender begrijpt de betekenis van een document: het onderscheidt een offerte van een contract, herkent afwijkingen ten opzichte van de standaard en extraheert de relevante data in de juiste context. Of het nu gaat om inkomende offerteaanvragen, leverancierscontracten, belastingdocumenten of medische dossiers — het systeem verwerkt elk documenttype op maat. De geëxtraheerde data gaat direct naar je systemen: CRM, ERP of documentmanagementsysteem. Wij bouwen ook de validatielaag: welke data moet aanwezig zijn, welke waarden zijn plausibel en wanneer moet een medewerker er naar kijken.",
      },
      {
        id: "taakuitvoering",
        title: "Autonome taakuitvoering",
        content:
          "Taakuitvoering door AI-agents is het stadium waarbij automatisering overgaat van data verwerken naar daadwerkelijk handelingen uitvoeren. Een AI-agent die niet alleen een inkomend verzoek classificeert, maar ook de bijbehorende taak aanmaakt in Asana, de verantwoordelijke notificeert via Slack en na 48 uur een follow-up stuurt als er geen reactie is. Maison Blender bouwt AI-agents die taken volledig autonoom afhandelen via integraties met je tool-stack. De agents hebben toegang tot een gedefinieerde set acties — API-calls, bestandsbewerkingen, communicatieplugins — en kiezen op basis van de situatie de juiste actie. Elke handeling wordt gelogd in een audittrail. Voor bedrijven die hun backoffice willen automatiseren zonder bestaande processen volledig te herontwerpen, is deze incrementele aanpak de meest pragmatische weg.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-agents-procesautomatisering#service",
    jsonLdServiceType: "AI Agents & Intelligente Procesautomatisering",
  },
  {
    id: "03",
    slug: "rpa-workflow-integraties",
    title: "RPA & Workflow-integraties",
    subtitle: "Robotic Process Automation zonder zorgen",
    description:
      "Automatiseer repetitieve schermtaken en verbind je systemen via robuuste API-koppelingen. Van factuurverwerking tot contractbeheer — wij beheren het volledig voor je.",
    tags: ["Robotic Process Automation", "API-integraties", "Factuurverwerking", "Schermautomatisering"],
    metaTitle: "RPA & Workflow-integraties — Maison Blender | Robotic Process Automation Zuid-Limburg",
    metaDescription:
      "Automatiseer repetitieve schermtaken en verbind je systemen met RPA. Maison Blender implementeert robuuste workflow-automatisering met n8n, Make.com en Zapier. Volledig beheerd in Zuid-Limburg.",
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
      "Maison Blender implementeert en beheert RPA-oplossingen die je scherminteracties automatiseren alsof er een digitale medewerker achter de computer zit — maar dan sneller, nauwkeuriger en altijd beschikbaar. Wij werken met professionele tools zoals n8n, Make.com en Zapier voor workflow-automatisering, aangevuld met Python-gebaseerde automatisering voor complexere scenario's.",
      "Naast schermautomatisering bouwen wij robuuste API-integraties die je systemen met elkaar verbinden. Geen data meer handmatig overzetten tussen je webshop en je magazijnsysteem. Geen dubbele invoer meer bij het verwerken van bestellingen. Geen verloren informatie meer omdat twee systemen niet met elkaar praten. Wij verbinden de systemen die je al hebt en zorgen dat data automatisch en correct vloeit.",
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
          "API-integraties zijn de verbindingen tussen softwaresystemen via gestandaardiseerde programmeerinterfaces. Maison Blender bouwt robuuste API-integraties die systemen real-time laten communiceren: een bestelling in je webshop triggert automatisch een verzoek in je ERP, een nieuw klantcontact in je CRM maakt een taak aan in je projecttool, en een goedgekeurd verlofverzoek in je HR-systeem past de planning aan. Wij bouwen op REST en GraphQL API's en gebruiken platforms als n8n en Make.com voor visuele workflow-automatisering. Elke integratie wordt gebouwd met foutafhandeling, retry-logica en alerting — zodat je nooit ongemerkt data verliest bij een tijdelijk systeemprobleem. Onderhoud en updates bij API-versiewijzigingen zijn inbegrepen in ons beheercontract.",
      },
      {
        id: "schermautomatisering",
        title: "Schermautomatisering (UI automation)",
        content:
          "Schermautomatisering — ook wel UI-automatisering — is de RPA-techniek waarbij een softwarerobot een computerscherm bestuurt zoals een medewerker dat zou doen: klikken, typen, kopiëren, formulieren invullen. Het bijzondere voordeel is dat het werkt met systemen die geen API bieden. Een twintig jaar oud ERP-systeem, een leveranciersportaal dat je zelf niet kunt aanpassen, een overheidsportaal — allemaal automatiseerbaar via schermautomatisering. Maison Blender implementeert schermautomatisering met Python-gebaseerde oplossingen en combineert dit waar nuttig met AI voor documentherkenning en besluitvorming. De robots draaien in een beveiligde omgeving en worden proactief gemonitord. Als een scherm verandert door een systeemupdate, signaleren wij dit en passen de robot aan voordat jij er last van hebt.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/rpa-workflow-integraties#service",
    jsonLdServiceType: "Robotic Process Automation & Workflow-integraties",
  },
  {
    id: "04",
    slug: "custom-ai-software",
    title: "Custom AI Software & Portalen",
    subtitle: "Maatwerksoftware aangedreven door AI",
    description:
      "Bespoke AI-applicaties, klant- en leveranciersportalen, mobiele apps en webapplicaties — volledig op maat gebouwd voor jouw processen en data.",
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
      "Standaardsoftware is gebouwd voor iedereen — en dus voor niemand perfect. Als je processen complex genoeg zijn om een eigen aanpak te verdienen, bouwt Maison Blender de software die precies past bij hoe jij werkt. Niet aanpassen aan het systeem, maar het systeem aanpassen aan jou.",
      "Wij ontwikkelen bespoke webapplicaties, klant- en leveranciersportalen en mobiele apps, allemaal aangedreven door moderne AI-technologie. Denk aan een klantenportaal waar je klanten zelf hun dossier beheren, documenten uploaden en AI-gestuurde statusupdates ontvangen. Of een intern platform dat automatisch rapportages genereert, afwijkingen signaleert en je team proactief informeert.",
      "Onze ontwikkelaanpak is pragmatisch en resultaatgericht. Wij beginnen met een grondige analyse van je processen en gebruikerswensen, ontwerpen een intuïtieve gebruikerservaring en bouwen modulair zodat je software meegroeit. Security en performance zijn geen afterthought maar bouwstenen van dag één. Wij werken met moderne stacks: Next.js, TypeScript, Python en cloud-platforms als Microsoft Azure en AWS.",
      "Wat onze maatwerksoftware onderscheidt is de diepte van AI-integratie. Dit zijn geen systemen die toevallig een chatbot hebben — de AI is verweven in de kernfunctionaliteit. Documenten worden automatisch verwerkt en geclassificeerd. Zoekopdrachten begrijpen intentie in plaats van alleen trefwoorden. Aanbevelingen worden gedaan op basis van patronen in je eigen data. De software wordt slimmer naarmate je er meer mee werkt.",
    ],
    benefits: [
      "Volledig op maat: past exact bij je processen en workflows",
      "AI in de kern: slimmer naarmate je meer data opbouwt",
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
    sections: [
      {
        id: "klantportalen",
        title: "Klantportalen met AI",
        content:
          "Een klantportaal van Maison Blender is meer dan een loginpagina met documenten. Het is een gepersonaliseerde werkplek voor je klanten: ze zien de status van lopende projecten of orders, kunnen documenten uploaden en bekijken, communiceren via geïntegreerde chat en ontvangen proactieve AI-gestuurde statusupdates. De portaal is volledig op maat gebouwd voor jouw branche en klantrelaties. Wij bouwen klantportalen op Next.js en TypeScript, gehost op Microsoft Azure of AWS, met AI-integraties die de klantervaring persoonlijker maken. Beveiliging is ingebouwd: toegang per klant, audit-logging en GDPR-compliance zijn standaard onderdeel van elke implementatie.",
      },
      {
        id: "web-mobiele-apps",
        title: "Web & mobiele apps",
        content:
          "Maison Blender bouwt web- en mobiele applicaties die meer kunnen dan standaardsoftware. Onze apps zijn AI-native: van zoekfuncties die intentie begrijpen tot aanbevelingen op basis van gebruikersgedrag en geautomatiseerde rapportages die zichzelf genereren. We werken met React en Next.js voor web, en React Native voor cross-platform mobiele apps — één codebase, beschikbaar op iOS en Android. Voor buitendienstmedewerkers in Zuid-Limburg die onderweg toegang nodig hebben tot klantdata, inspecties moeten vastleggen of offertes moeten genereren, bieden mobiele apps de juiste tool op het juiste moment. Elke app die wij bouwen is ontworpen voor echte gebruikers: intuïtief, snel en betrouwbaar ook bij een slechte verbinding.",
      },
      {
        id: "ai-applicaties",
        title: "AI-applicaties als kernproduct",
        content:
          "AI-applicaties zijn niet standaardsoftware met een chatbot erbij — ze zijn gebouwd rond AI als kernfunctionaliteit. Maison Blender ontwikkelt applicaties waarbij AI de gebruikerservaring fundamenteel verbetert: een interne zoekfunctie die documenten vindt op basis van vraag in plaats van trefwoord, een dashboard dat anomalieën proactief signaleert, of een adviesapplicatie die op basis van klantdata automatisch de beste productaanbeveling doet. We bouwen custom AI-applicaties op de API's van OpenAI en Anthropic, gecombineerd met jouw eigen data en processen. Het eindresultaat is software die slimmer wordt naarmate je hem meer gebruikt.",
      },
      {
        id: "documentbeheer",
        title: "AI-gestuurd documentbeheer",
        content:
          "Slim documentbeheer is meer dan bestanden opslaan in mappenstructuren. Maison Blender bouwt documentbeheersystemen waarbij AI automatisch documenten classificeert, metadata extraheert, versies bijhoudt en gerelateerde documenten clustert. Je medewerkers vinden wat ze zoeken in seconden via AI-gestuurde zoekfuncties die begrijpen waar ze naar zoeken. Wij integreren met bestaande DMS-platforms (SharePoint, DocuWare, OpenText) of bouwen een eigen oplossing als de standaardpakketten niet passen. Inkomende documenten worden automatisch verwerkt, geclassificeerd en aan het juiste dossier gekoppeld. Voor bedrijven in Limburg met grote documentvolumes in gereguleerde sectoren is dit een compliance- én efficiëntieoplossing tegelijk.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/custom-ai-software#service",
    jsonLdServiceType: "Custom AI Software Development",
  },
  {
    id: "05",
    slug: "data-intelligentie-rapportages",
    title: "Data-intelligentie & Rapportages",
    subtitle: "Van ruwe data naar bruikbare inzichten",
    description:
      "RAG-systemen die je interne kennisbase ontsluiten, automatische rapportages en dashboards die je team dagelijks sturen op de juiste KPI's.",
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
      "Je bedrijf produceert dagelijks enorme hoeveelheden data — maar hoeveel daarvan gebruik je daadwerkelijk om beslissingen te verbeteren? De meeste organisaties laten een groot deel van hun data onbenut liggen, verspreid over systemen, bestanden en inboxen. Maison Blender maakt die data werkbaar met slimme AI-oplossingen voor data-intelligentie en kennismanagement.",
      "Onze RAG-systemen (Retrieval-Augmented Generation) geven je medewerkers directe toegang tot de collectieve kennis van je organisatie. Stel vragen in gewone taal en ontvang nauwkeurige antwoorden gebaseerd op je eigen documenten, contracten, handleidingen en dossiers — niet op generieke informatie van het internet. Dit is kennismanagement zoals het hoort te werken: snel, accuraat en direct toepasbaar.",
      "Naast kennisontsluiting bouwen wij geautomatiseerde rapportagesystemen en live dashboards die je team dagelijks sturen op de juiste KPI's. Geen uren meer verliezen aan het handmatig samenstellen van managementrapportages. In plaats daarvan ontvang je elke ochtend automatisch de cijfers die er toe doen, samengesteld door AI uit al je databronnen. Afwijkingen worden proactief gesignaleerd voordat ze een probleem worden.",
      "Wij ondersteunen de volledige data-stack: van het inrichten van databronnen en pipelines, tot het bouwen van de AI-laag en de visualisatielaag. Wij werken samen met je bestaande tools of bouwen iets nieuws als dat beter past. Het resultaat: een organisatie die stuurt op feiten in plaats van op gevoel.",
    ],
    benefits: [
      "Directe toegang tot je interne kennisbase via AI",
      "Automatische rapportages — geen handmatig werk meer",
      "Proactieve alerting bij afwijkingen in je data",
      "Betere beslissingen door actuele, accurate inzichten",
      "Integratie met al je bestaande databronnen",
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
        title: "AI-gestuurd kennismanagement",
        content:
          "Kennismanagement met AI lost een fundamenteel bedrijfsprobleem op: kennis zit verspreid in hoofden, e-mails, documenten en gesprekken — en is daarmee kwetsbaar en moeilijk toegankelijk. Maison Blender implementeert AI-gestuurd kennismanagement waarbij alles wat je bedrijf weet doorzoekbaar en deelbaar wordt. Via RAG-technologie koppelen we een taalmodel aan je bestaande kennisrepositories: Confluence, SharePoint, interne wikis, proceshandleidingen en trainingsmateriaal. Medewerkers stellen vragen in gewone taal en krijgen accurate antwoorden met bronvermelding. Nieuwe medewerkers zijn sneller ingewerkt. Expertise van vertrekkende medewerkers wordt geborgd. En je klantenserviceteam geeft altijd consistente, correcte antwoorden — niet afhankelijk van wie er dienst heeft.",
      },
      {
        id: "dashboards",
        title: "Intelligente KPI-dashboards",
        content:
          "Een goed dashboard geeft je niet meer data — het geeft je de juiste data, op het juiste moment, in de juiste context. Maison Blender bouwt dashboards die niet alleen historische KPI's tonen maar ook afwijkingen detecteren, trends voorspellen en aanbevelingen doen. We verbinden je databronnen — CRM, ERP, websiteanalytics, productiesystemen — in één overzicht dat in real-time updates ontvangt. Het dashboard past zich aan op de rol van de gebruiker: een directeur ziet de strategische KPI's, een salesmanager de pipelinedata, een productieleider de capaciteitsbenutting. Elk dashboard wordt gebouwd met een alert-systeem: bij overschrijding van een drempelwaarde ontvangt de juiste persoon een notificatie via e-mail, Slack of WhatsApp.",
      },
      {
        id: "automatische-rapportages",
        title: "Automatische rapportages",
        content:
          "Handmatig rapportages samenstellen kost gemiddeld twee tot acht uur per rapport per week — tijd die niet besteed wordt aan analyse en actie. Maison Blender automatiseert de volledige rapportageketen: data ophalen uit alle bronnen, samenvoegen, berekeningen uitvoeren, visualiseren en distribueren naar de juiste ontvangers op het juiste moment. AI voegt een laag toe die pure rapportage overstijgt: het systeem signaleert welke patronen in de data opvallend zijn, vergelijkt met vorige periodes en geeft een korte tekstuele samenvatting. De rapportage schrijft zichzelf. Onze klanten ontvangen elke maandagochtend automatisch een management summary die de vorige week samenvat — inclusief uitschieters en aanbevolen acties. Geen enkele medewerker heeft er een vinger aan geroerd.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/data-intelligentie-rapportages#service",
    jsonLdServiceType: "Data-intelligentie & Business Intelligence",
  },
  {
    id: "06",
    slug: "ai-strategie-quickscan",
    title: "AI Strategie & Quickscan",
    subtitle: "Van strategie naar uitvoering",
    description:
      "Wij beginnen met een gratis automatiseringsquickscan van je processen. Je krijgt een concreet implementatieplan inclusief business case — zodat je weet wat het oplevert vóór je investeert.",
    tags: ["Gratis quickscan", "Implementatieroadmap", "Business case", "Team training"],
    metaTitle: "AI Strategie & Quickscan — Maison Blender | Gratis AI-scan voor Je Bedrijf",
    metaDescription:
      "Start met een gratis automatiseringsquickscan. Maison Blender maakt een concreet AI-implementatieplan met business case voor je bedrijf in Zuid-Limburg. Weet wat het oplevert vóór je investeert.",
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
      "Veel bedrijven weten dat AI kansen biedt, maar weten niet waar te beginnen of wat het hen concreet oplevert. Precies daar begint de samenwerking met Maison Blender: met een gratis automatiseringsquickscan die in beeld brengt welke van je processen het meest geschikt zijn voor AI-automatisering en wat de verwachte impact is.",
      "Tijdens de quickscan analyseren wij je workflows, tijdsbesteding en pijnpunten. Wij kijken naar volume, complexiteit en repetitiviteit van taken, en identificeren de tien tot vijftien processen met het hoogste automatiseringspotentieel. Per proces berekenen wij de verwachte tijdsbesparing, kostenverlaging en kwaliteitsverbetering. Je ontvangt een heldere prioriteitenmatrix: wat levert het meeste op, wat is het snelst te implementeren, en wat vereist een langere adem.",
      "Op basis van de scan stellen wij een implementatieroadmap op — een concreet, gefaseerd plan met tijdlijnen, benodigde investeringen en verwachte returns. Geen vage adviezen, maar een uitvoerbaar plan dat je direct kunt gebruiken. Wij denken mee over change management: hoe zorg je dat je team de nieuwe tools omarmt en er optimaal gebruik van maakt?",
      "Na de strategie-fase kun je de uitvoering bij ons neerleggen. Wij implementeren de oplossingen die in de roadmap staan — chatbots, AI-agents, RPA, maatwerksoftware — en begeleiden je team in het werken met AI. Zo ben je nooit afhankelijk van één leverancier voor kennis, maar bouw je interne expertise op die je organisatie op de lange termijn versterkt.",
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
    sections: [
      {
        id: "implementatieroadmap",
        title: "Implementatieroadmap op maat",
        content:
          "Een AI-implementatieroadmap is meer dan een lijst met projecten. Het is een gefaseerd plan dat rekening houdt met je beschikbare capaciteit, budget, organisatorische veranderbereidheid en de afhankelijkheden tussen verschillende automatiseringen. Maison Blender stelt implementatieroadmaps op die pragmatisch zijn: we beginnen met de quick wins die snel ROI genereren en intern draagvlak creëren, bouwen daarna door op de infrastructuur die we hebben neergelegd, en lopen naar de meer complexe transformaties. Per fase staat beschreven wat er wordt opgeleverd, welke resources nodig zijn, welke risico's er zijn en hoe succes gemeten wordt. De roadmap is niet in steen gebeiteld — wij reviewen en actualiseren hem elk kwartaal op basis van voortgang en veranderende prioriteiten.",
      },
      {
        id: "business-case",
        title: "AI business case bouwen",
        content:
          "Een overtuigende AI business case bevat meer dan een kostenschatting. Hij beschrijft de huidige situatie (baseline), de verwachte situatie na implementatie (target state), de investering die daarvoor nodig is, en de financiële en strategische waarde van het verschil. Maison Blender bouwt business cases die houdbaar zijn onder kritische bestuursleden: wij gebruiken conservatieve aannames, bouwen scenario-analyses in (pessimistisch, basis, optimistisch) en valideren de aannames bij vergelijkbare implementaties. De business case omvat ook de niet-financiële baten: betere kwaliteit, lagere foutmarges, hogere medewerkerssatisfactie. Voor directies en aandeelhouders in Zuid-Limburg die AI serieus overwegen maar nog een concreet onderbouwd verhaal missen, is de business case van Maison Blender het vertrekpunt.",
      },
      {
        id: "team-training",
        title: "Team training & adoptie",
        content:
          "AI-implementatie slaagt of faalt met de mensen die ermee werken. Maison Blender begeleidt niet alleen de technische implementatie maar zorgt ook dat je team de nieuwe tools daadwerkelijk gebruikt en vertrouwt. Wij verzorgen training op maat: voor eindgebruikers die dagelijks met de AI-tools werken, voor managers die de outputs moeten interpreteren en beoordelen, en voor de IT-afdeling die de systemen beheert. Training is geen eenmalige sessie maar een doorlopend traject: bij elke nieuwe functionaliteit, bij verloop, en bij de doorontwikkeling van de AI-tools. We meten adoptie — niet hoeveel mensen een training hebben gevolgd, maar hoeveel mensen de tool daadwerkelijk gebruiken na drie maanden. Dat is de metric die telt.",
      },
    ],
    jsonLdId: "https://maisonblender.com/diensten/ai-strategie-quickscan#service",
    jsonLdServiceType: "AI Strategie Consultancy",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
