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
      logo: "https://maisonblender.com/favicon.ico",
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
        latitude: 51.0,
        longitude: 5.87,
      },
      areaServed: [
        {
          "@type": "State",
          name: "Limburg",
          sameAs: "https://en.wikipedia.org/wiki/Limburg_(Netherlands)",
        },
        {
          "@type": "Country",
          name: "Nederland",
        },
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "AI Agents",
        "Process Automation",
        "Robotic Process Automation",
        "Large Language Models",
        "Workflow Orchestration",
        "Conversational AI",
        "RAG Systems",
        "Business Intelligence",
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
