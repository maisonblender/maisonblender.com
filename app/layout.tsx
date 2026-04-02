import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonblender.com"),
  title: "Maison Blender — AI-bureau in Zuid-Limburg | Custom AI-agents & Automatisering",
  description:
    "Maison Blender is het toonaangevende AI-bureau in Zuid-Limburg. Wij bouwen custom AI-agents, workflow-automatisering en intelligente software voor ambitieuze bedrijven in Sittard, Maastricht en heel Zuid-Limburg. Bespaar 40+ uur per week.",
  keywords: [
    "AI bureau Zuid-Limburg",
    "AI consultant Limburg",
    "AI bureau Sittard",
    "kunstmatige intelligentie bureau",
    "AI automatisering",
    "custom AI agents",
    "workflow automatisering",
    "Maison Blender",
    "AI bureau Nederland",
    "procesautomatisering MKB",
    "AI chatbot bedrijf",
    "RPA automatisering",
    "AI strategie consultancy",
    "digitale transformatie Limburg",
    "AI implementatie",
    "intelligente automatisering",
  ],
  authors: [{ name: "Maison Blender", url: "https://maisonblender.com" }],
  alternates: {
    canonical: "https://maisonblender.com",
  },
  openGraph: {
    title: "Maison Blender — AI-bureau in Zuid-Limburg",
    description:
      "Intelligente groei. Gedreven door AI. Het toonaangevende AI-bureau van Zuid-Limburg. Custom AI-agents, procesautomatisering en maatwerksoftware voor ambitieuze bedrijven.",
    url: "https://maisonblender.com",
    siteName: "Maison Blender",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Blender — AI-bureau in Zuid-Limburg",
    description:
      "Intelligente groei. Gedreven door AI. Custom AI-agents en automatisering voor MKB in Zuid-Limburg.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
      "@id": "https://maisonblender.com/#organization",
      name: "Maison Blender",
      url: "https://maisonblender.com",
      logo: "https://maisonblender.com/maison-blender-logo-black.svg",
      description:
        "Maison Blender is het toonaangevende AI-bureau in Zuid-Limburg. Wij bouwen custom AI-agents, workflow-automatisering en intelligente software voor ambitieuze bedrijven. Gespecialiseerd in AI-chatbots, procesautomatisering, RPA en maatwerksoftware.",
      foundingDate: "2024",
      email: "info@maisonblender.com",
      telephone: "+31462004035",
      vatID: "NL001832932B87",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Burg. Coonenplein 37",
        postalCode: "6141BZ",
        addressLocality: "Sittard",
        addressRegion: "Limburg",
        addressCountry: "NL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 51.0043,
        longitude: 5.8727,
      },
      areaServed: [
        {
          "@type": "State",
          name: "Limburg",
          sameAs: "https://en.wikipedia.org/wiki/Limburg_(Netherlands)",
        },
        { "@type": "Country", name: "Nederland" },
        { "@type": "City", name: "Sittard" },
        { "@type": "City", name: "Geleen" },
        { "@type": "City", name: "Maastricht" },
        { "@type": "City", name: "Heerlen" },
        { "@type": "City", name: "Roermond" },
        { "@type": "City", name: "Venlo" },
        { "@type": "City", name: "Beek" },
        { "@type": "City", name: "Stein" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:30",
        },
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Kunstmatige intelligentie",
        "Machine Learning",
        "AI Agents",
        "AI-agenten",
        "Process Automation",
        "Procesautomatisering",
        "Robotic Process Automation",
        "Large Language Models",
        "Taalmodellen",
        "Workflow Orchestration",
        "Workflowautomatisering",
        "Conversational AI",
        "Conversationele AI",
        "RAG Systems",
        "Business Intelligence",
        "Bedrijfsintelligentie",
        "OpenAI",
        "Anthropic Claude",
        "n8n",
        "Make.com",
        "Zapier",
        "LangChain",
        "Microsoft Azure AI",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI-diensten",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Chatbots & Klantenservice" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Agents & Procesautomatisering" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "RPA & Workflow-integraties" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom AI Software & Portalen" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Data-intelligentie & Rapportages" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Strategie & Quickscan" } },
        ],
      },
      sameAs: [
        "https://maisonblender.com",
        "https://www.linkedin.com/company/maisonblender",
        "https://g.co/kgs/maisonblender",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://maisonblender.com/#website",
      url: "https://maisonblender.com",
      name: "Maison Blender",
      description: "Het toonaangevende AI-bureau van Zuid-Limburg",
      publisher: { "@id": "https://maisonblender.com/#organization" },
      inLanguage: "nl-NL",
    },
    {
      "@type": "WebPage",
      "@id": "https://maisonblender.com/#webpage",
      url: "https://maisonblender.com",
      name: "Maison Blender — AI-bureau in Zuid-Limburg | Custom AI-agents & Automatisering",
      isPartOf: { "@id": "https://maisonblender.com/#website" },
      about: { "@id": "https://maisonblender.com/#organization" },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#hero-description", "#about-description"],
      },
      inLanguage: "nl-NL",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-chatbots",
      name: "AI Chatbots & Klantenservice",
      description:
        "Automatiseer tot 90% van uw klantenservice met AI-agents die vragen beantwoorden, afspraken inplannen en leads kwalificeren — via web, WhatsApp, e-mail en meer. Aangedreven door OpenAI en Anthropic Claude.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Conversational AI & Klantenservice Automatisering",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-agents",
      name: "AI Agents & Procesautomatisering",
      description:
        "Custom AI-agents die taken uitvoeren: documenten verwerken, e-mails interpreteren, acties uitvoeren in uw CRM of ERP. Gebouwd op LangChain, Anthropic Claude en OpenAI. 24/7 operationeel, zonder menselijke tussenkomst.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "AI Agents & Intelligente Procesautomatisering",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-rpa",
      name: "RPA & Workflow-integraties",
      description:
        "Automatiseer repetitieve schermtaken en verbind uw systemen via robuuste API-koppelingen. Wij werken met n8n, Make.com en Zapier voor betrouwbare workflow-automatisering. Van factuurverwerking tot contractbeheer.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Robotic Process Automation & Workflow-integraties",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-software",
      name: "Custom AI Software & Portalen",
      description:
        "Bespoke AI-applicaties, klant- en leveranciersportalen, mobiele apps en webapplicaties — volledig op maat gebouwd met Microsoft Azure AI, OpenAI en LangChain.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Custom AI Software Development",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-data",
      name: "Data-intelligentie & Rapportages",
      description:
        "RAG-systemen op basis van LangChain en Anthropic Claude die uw interne kennisbase ontsluiten, automatische rapportages en dashboards die uw team dagelijks sturen op de juiste KPI's.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Data-intelligentie & Business Intelligence",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-strategie",
      name: "AI Strategie & Quickscan",
      description:
        "Gratis automatiseringsquickscan van uw processen met een concreet implementatieplan inclusief business case. Wij adviseren over de inzet van OpenAI, Anthropic Claude, n8n, Make.com, Zapier, LangChain en Microsoft Azure AI.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "AI Strategie Consultancy",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
