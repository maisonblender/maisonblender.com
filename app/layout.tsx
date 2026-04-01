import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonblender.com"),
  title: "M∆ISON BLNDR — AI-bureau in Zuid-Limburg",
  description:
    "Maison Blender is het toonaangevende AI-bureau in Zuid-Limburg. Wij bouwen intelligente automatisering voor ambitieuze bedrijven: custom AI-agents, workflow-orchestratie en data-integraties.",
  keywords: [
    "AI bureau",
    "kunstmatige intelligentie",
    "Zuid-Limburg",
    "Sittard",
    "AI automatisering",
    "Maison Blender",
    "AI agents",
    "workflow automatisering",
  ],
  authors: [{ name: "Maison Blender", url: "https://maisonblender.com" }],
  openGraph: {
    title: "M∆ISON BLNDR — AI-bureau in Zuid-Limburg",
    description:
      "Intelligente groei. Gedreven door AI. Het toonaangevende AI-bureau van Zuid-Limburg.",
    url: "https://maisonblender.com",
    siteName: "Maison Blender",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M∆ISON BLNDR — AI-bureau in Zuid-Limburg",
    description: "Intelligente groei. Gedreven door AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
