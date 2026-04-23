import type { Metadata } from "next";
import ToolsVergelijkerClient from "./ToolsVergelijkerClient";

export const metadata: Metadata = {
  title: "AI Tools Vergelijker",
  description:
    "Vergelijk AI-tools voor het MKB: prijs, GDPR-status, Nederlandse taal en gebruiksgemak. ChatGPT, Claude, Gemini, Zapier, n8n en meer.",
  alternates: { canonical: "https://maisonblender.com/labs/tools-vergelijker" },
  openGraph: {
    title: "AI Tools Vergelijker | Limburg AI Labs",
    description: "Vergelijk de meest gebruikte AI-tools op prijs, GDPR en taal.",
    url: "https://maisonblender.com/labs/tools-vergelijker",
  },
};

export default function ToolsVergelijkerPage() {
  return <ToolsVergelijkerClient />;
}
