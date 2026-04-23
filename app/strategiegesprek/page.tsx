import type { Metadata } from "next";
import StrategiegesprekClient from "./StrategiegesprekClient";

export const metadata: Metadata = {
  title: "Strategiegesprek | MAISON BLNDR",
  description:
    "Plan een gratis strategiegesprek van 30 minuten. We bespreken jouw AI-kansen, concrete eerste stappen en de businesscase — zonder verplichtingen.",
  alternates: { canonical: "https://maisonblender.com/strategiegesprek" },
  openGraph: {
    title: "Strategiegesprek | MAISON BLNDR",
    description: "Gratis 30 minuten: AI-kansen, concrete stappen en businesscase.",
    url: "https://maisonblender.com/strategiegesprek",
  },
  robots: { index: true, follow: true },
};

export default function StrategiegesprekPage() {
  return <StrategiegesprekClient />;
}
