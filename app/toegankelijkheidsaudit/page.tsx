import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AuditIntro from "./AuditIntro";
import AuditDashboard from "./AuditDashboard";

export const metadata: Metadata = {
  title: "Toegankelijkheidsaudit · WCAG 2.1 AA & EN 301 549 | MAISON BLNDR",
  description:
    "Voer een URL in en ontvang direct een geautomatiseerde toegankelijkheidsaudit tegen WCAG 2.1 AA en EN 301 549, inclusief compliance-score, impact-analyse en prioriteitenlijst van concrete fixes.",
  alternates: { canonical: "https://maisonblender.com/toegankelijkheidsaudit" },
  openGraph: {
    title: "Toegankelijkheidsaudit · WCAG 2.1 AA & EN 301 549 | MAISON BLNDR",
    description:
      "Gratis statische WCAG 2.1 AA + EN 301 549-audit voor jouw website. Compliance-score, impact-distributie en prioriteitenlijst met concrete fixes.",
    url: "https://maisonblender.com/toegankelijkheidsaudit",
  },
  robots: { index: true, follow: true },
};

export default function ToegankelijkheidsauditPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <AuditIntro />
        <AuditDashboard />
      </main>
      <Footer />
    </>
  );
}
