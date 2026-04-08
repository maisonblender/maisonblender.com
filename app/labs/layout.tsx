import type { Metadata } from "next";
import Link from "next/link";

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
      {/* Labs header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-white/90 px-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <Link href="/labs" className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold text-[#1f1f1f] tracking-tight">Limburg AI Labs</span>
            <span className="hidden sm:inline-block text-xs border border-[#22c55e]/40 bg-[#22c55e]/10 text-[#16a34a] px-2 py-0.5 rounded-full font-medium">by MAISON BLNDR</span>
          </Link>

          <nav className="hidden gap-6 text-sm font-medium text-[#575760] md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[#1f1f1f]">
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            href="https://maisonblender.com"
            className="hidden md:inline-block text-xs text-[#575760] hover:text-[#1f1f1f] transition-colors"
          >
            ← maisonblender.com
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-20">{children}</main>

      {/* Labs footer */}
      <footer className="border-t border-black/[0.06] bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1f1f1f]">Limburg AI Labs</span>
            <span className="text-xs text-[#b2b2be]">Een initiatief van MAISON BLNDR · Sittard, Limburg</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-5 text-xs text-[#575760] sm:justify-end">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#1f1f1f] transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="https://maisonblender.com" className="hover:text-[#1f1f1f] transition-colors">
              maisonblender.com ↗
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
