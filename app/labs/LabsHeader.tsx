"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useId } from "react";

const navLinks = [
  { href: "/labs", label: "Home" },
  { href: "/labs/webinar", label: "Webinars" },
  { href: "/labs/kennisbank", label: "Kennisbank" },
  { href: "/labs/nieuwsbrief", label: "Nieuwsbrief" },
];

export default function LabsHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-white/90 px-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
        <Link href="/labs" className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-[#1f1f1f]">Limburg AI Labs</span>
          <span className="hidden rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10 px-2 py-0.5 text-xs font-medium text-[#16a34a] sm:inline-block">
            by MAISON BLNDR
          </span>
        </Link>

        <nav aria-label="Hoofdmenu Labs" className="hidden gap-6 text-sm font-medium text-[#575760] md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[#1f1f1f] focus-visible:underline focus-visible:underline-offset-4"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="https://maisonblender.com"
            className="hidden text-xs text-[#575760] transition-colors hover:text-[#1f1f1f] focus-visible:underline focus-visible:underline-offset-4 md:inline-block"
          >
            ← maisonblender.com
          </Link>

          <button
            type="button"
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-md p-3 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
          >
            <span
              className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id={menuId}
          ref={panelRef}
          className="border-t border-black/[0.06] bg-white py-4 md:hidden"
        >
          <nav aria-label="Mobiel menu Labs" className="mx-auto flex max-w-6xl flex-col gap-1 px-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-2 py-3 text-sm font-medium text-[#575760] transition-colors hover:bg-[#f2f3f5] hover:text-[#1f1f1f] focus-visible:underline focus-visible:underline-offset-4"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="https://maisonblender.com"
              className="mt-2 rounded-md px-2 py-3 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#f2f3f5] focus-visible:underline focus-visible:underline-offset-4"
              onClick={() => setMenuOpen(false)}
            >
              maisonblender.com →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
