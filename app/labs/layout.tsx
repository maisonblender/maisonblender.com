import type { Metadata } from "next";
import Link from "next/link";
import LabsHeader from "./LabsHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://labs.maisonblender.com"),
  title: {
    default: "Limburg AI Labs - AI kennis voor Zuid-Limburg",
    template: "%s | Limburg AI Labs",
  },
  description:
    "Limburg AI Labs deelt praktische AI-kennis met Limburgse ondernemers. Webinars, tools, cases en een kennisbank - gratis toegankelijk.",
  openGraph: {
    siteName: "Limburg AI Labs",
    locale: "nl_NL",
    type: "website",
  },
};

const navLinks = [
  { href: "/labs", label: "Home" },
  { href: "/labs/webinar", label: "Webinars" },
  { href: "/labs/kennisbank", label: "Kennisbank" },
  { href: "/labs/nieuwsbrief", label: "Nieuwsbrief" },
];

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LabsHeader />

      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {children}
      </main>

      {/* Labs footer */}
      <footer className="border-t border-black/[0.06] bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1f1f1f]">Limburg AI Labs</span>
            <span className="text-xs text-[#6b6b75]">Een initiatief van MAISON BLNDR · Sittard, Limburg</span>
          </div>
          <nav aria-label="Footer Labs" className="flex flex-wrap justify-center gap-5 text-xs text-[#575760] sm:justify-end">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#1f1f1f] transition-colors focus-visible:underline focus-visible:underline-offset-4">
                {l.label}
              </Link>
            ))}
            <Link href="https://maisonblender.com" className="hover:text-[#1f1f1f] transition-colors focus-visible:underline focus-visible:underline-offset-4">
              maisonblender.com ↗
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
