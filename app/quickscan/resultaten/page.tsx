import type { Metadata } from "next";
import ResultatenDashboard from "./ResultatenDashboard";

export const metadata: Metadata = {
  title: "Jouw AI Resultaten | MAISON BLNDR",
  description: "Jouw persoonlijke AI Readiness Score en aanbevelingen.",
  robots: { index: false, follow: false },
};

export default function ResultatenPage() {
  return <ResultatenDashboard />;
}
