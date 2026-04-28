import type { Metadata } from "next";
import Link from "next/link";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Mijn kantoor aanmelden — AI Collega Makelaar | MAISON BLNDR",
  description:
    "Meld jouw makelaarskantoor aan voor de AI Collega. In 10 minuten live met een geconfigureerde digitale medewerker.",
  robots: { index: false, follow: true },
};

export default function OnboardingPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f2f3f5]">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-16">
        <div className="max-w-2xl">
        <Link
          href="/aicollega/makelaar"
          className="inline-flex items-center gap-2 text-sm text-[#575760] hover:text-[#1f1f1f] transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Terug naar overzicht
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760] mb-4">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            30 dagen gratis — geen creditcard nodig
          </div>
          <h1
            className="text-[28px] font-normal leading-tight text-[#1f1f1f] mb-3"
            style={{ letterSpacing: "-0.6px" }}
          >
            Jouw AI Collega instellen
          </h1>
          <p className="text-[#575760] text-sm leading-relaxed">
            Vul de gegevens van je kantoor in. Je AI Collega wordt direct geconfigureerd op
            basis van jouw informatie. Na het aanmelden ontvang je een link naar je dashboard.
          </p>
        </div>

        <OnboardingForm />

        <p className="text-xs text-[#575760] mt-6">
          Vragen? Bel{" "}
          <a href="tel:+31462004035" className="underline">
            046 200 4035
          </a>{" "}
          of mail{" "}
          <a href="mailto:info@maisonblender.com" className="underline">
            info@maisonblender.com
          </a>
        </p>
        </div>
      </div>
    </div>
  );
}
