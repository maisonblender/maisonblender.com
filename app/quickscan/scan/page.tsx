import type { Metadata } from "next";
import ScanForm from "./ScanForm";

export const metadata: Metadata = {
  title: "AI Impact Scan | MAISON BLNDR",
  description: "Vul de gratis AI Readiness Intake in — 5 pijlers, 17 vragen, ~10 minuten.",
  robots: { index: false, follow: false },
};

export default function ScanPage() {
  return <ScanForm />;
}
