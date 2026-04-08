import type { Metadata } from "next";
import ScanForm from "./ScanForm";

export const metadata: Metadata = {
  title: "AI Impact Scan | MAISON BLNDR",
  description: "Vul de gratis AI Impact Scan in - 10 vragen, 3 minuten.",
  robots: { index: false, follow: false },
};

export default function ScanPage() {
  return <ScanForm />;
}
