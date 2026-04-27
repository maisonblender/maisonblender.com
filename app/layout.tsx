import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";
import SkipLink from "@/components/SkipLink";
import ScrollToTop from "@/components/ScrollToTop";
import PersistentPresenceRoot from "@/components/PersistentPresence";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonblender.com"),
  title: "MAISON BLNDR · Custom AI-agents & Procesautomatisering voor het MKB",
  description:
    "Custom AI-agents, procesautomatisering en maatwerksoftware voor het MKB. MAISON BLNDR levert werkende AI-systemen binnen vier weken. Start een gratis AI Impact Scan.",
  keywords: [
    "AI consultant Limburg",
    "AI bureau Sittard",
    "kunstmatige intelligentie bureau",
    "AI automatisering",
    "custom AI agents",
    "workflow automatisering",
    "MAISON BLNDR",
    "AI bureau Nederland",
    "procesautomatisering MKB",
    "AI chatbot bedrijf",
    "RPA automatisering",
    "AI strategie consultancy",
    "digitale transformatie Limburg",
    "AI implementatie",
    "intelligente automatisering",
  ],
  authors: [{ name: "MAISON BLNDR", url: "https://maisonblender.com" }],
  alternates: {
    canonical: "https://maisonblender.com",
  },
  openGraph: {
    title: "MAISON BLNDR - Custom AI-agents & Procesautomatisering voor het MKB",
    description:
      "MAISON BLNDR bouwt werkende AI-agents, procesautomatisering en maatwerksoftware voor het MKB. Geen data-scientist nodig. Gevestigd in Sittard, actief door heel Nederland.",
    url: "https://maisonblender.com",
    siteName: "MAISON BLNDR",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAISON BLNDR - Custom AI-agents & Procesautomatisering voor het MKB",
    description:
      "Werkende AI-agents en procesautomatisering voor het MKB. Geen data-scientist nodig. Van AI Impact Scan tot live systeem.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
      "@id": "https://maisonblender.com/#organization",
      name: "MAISON BLNDR",
      url: "https://maisonblender.com",
      logo: "https://maisonblender.com/maison-blender-logo-black.svg",
      description:
        "MAISON BLNDR bouwt custom AI-agents, workflow-automatisering en intelligente software voor ambitieuze bedrijven in het MKB. Gespecialiseerd in AI-chatbots, procesautomatisering, RPA en maatwerksoftware.",
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
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Strategie & Impact Scan" } },
        ],
      },
      sameAs: [
        "https://maisonblender.com",
        "https://www.linkedin.com/company/maisonblender",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://maisonblender.com/#website",
      url: "https://maisonblender.com",
      name: "MAISON BLNDR",
      description: "MAISON BLNDR - Custom AI-agents & Procesautomatisering voor het MKB",
      publisher: { "@id": "https://maisonblender.com/#organization" },
      inLanguage: "nl-NL",
    },
    {
      "@type": "WebPage",
      "@id": "https://maisonblender.com/#webpage",
      url: "https://maisonblender.com",
      name: "MAISON BLNDR - Custom AI-agents & Procesautomatisering voor het MKB",
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
        "Automatiseer tot 90% van je klantenservice met AI-agents die vragen beantwoorden, afspraken inplannen en leads kwalificeren - via web, WhatsApp, e-mail en meer. Aangedreven door OpenAI en Anthropic Claude.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Conversational AI & Klantenservice Automatisering",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-agents",
      name: "AI Agents & Procesautomatisering",
      description:
        "Custom AI-agents die taken uitvoeren: documenten verwerken, e-mails interpreteren, acties uitvoeren in je CRM of ERP. Gebouwd op LangChain, Anthropic Claude en OpenAI. 24/7 operationeel, zonder menselijke tussenkomst.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "AI Agents & Intelligente Procesautomatisering",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-rpa",
      name: "RPA & Workflow-integraties",
      description:
        "Automatiseer repetitieve schermtaken en verbind je systemen via robuuste API-koppelingen. Wij werken met n8n, Make.com en Zapier voor betrouwbare workflow-automatisering. Van factuurverwerking tot contractbeheer.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Robotic Process Automation & Workflow-integraties",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-software",
      name: "Custom AI Software & Portalen",
      description:
        "Bespoke AI-applicaties, klant- en leveranciersportalen, mobiele apps en webapplicaties - volledig op maat gebouwd met Microsoft Azure AI, OpenAI en LangChain.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Custom AI Software Development",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-data",
      name: "Data-intelligentie & Rapportages",
      description:
        "RAG-systemen op basis van LangChain en Anthropic Claude die je interne kennisbase ontsluiten, automatische rapportages en dashboards die je team dagelijks sturen op de juiste KPI's.",
      provider: { "@id": "https://maisonblender.com/#organization" },
      areaServed: { "@type": "State", name: "Limburg" },
      serviceType: "Data-intelligentie & Business Intelligence",
    },
    {
      "@type": "Service",
      "@id": "https://maisonblender.com/#service-strategie",
      name: "AI Strategie & Impact Scan",
      description:
        "Gratis AI Impact Scan van je processen met een concreet implementatieplan inclusief business case. Wij adviseren over de inzet van OpenAI, Anthropic Claude, n8n, Make.com, Zapier, LangChain en Microsoft Azure AI.",
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
      <body className="min-h-full flex flex-col">
        <ScrollToTop />
        <SkipLink />
        <GoogleAnalytics />
        <CookieBanner />
        <PersistentPresenceRoot>{children}</PersistentPresenceRoot>
      </body>
    </html>
  );
}
