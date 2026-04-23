"use client";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import { services } from "@/lib/services";

const topLinks = [
  { href: "/#sectoren", label: "Sectoren" },
  { href: "/#aanpak", label: "Aanpak" },
  { href: "/#over-ons", label: "Over ons" },
  { href: "/#contact", label: "Contact" },
  { href: "/labs", label: "Labs →" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDienstenOpen, setMobileDienstenOpen] = useState(false);
  const [desktopDienstenOpen, setDesktopDienstenOpen] = useState(false);
  const desktopWrapRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuId = useId();
  const desktopMenuId = useId();

  useEffect(() => {
    if (!desktopDienstenOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (desktopWrapRef.current && !desktopWrapRef.current.contains(e.target as Node)) {
        setDesktopDienstenOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [desktopDienstenOpen]);

  useEffect(() => {
    if (!mobileOpen && !desktopDienstenOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDesktopDienstenOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, desktopDienstenOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const first = mobileMenuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
  }, [mobileOpen]);

  const linkFocus =
    "transition-colors hover:text-[#1f1f1f] focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-white/90 px-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- statisch SVG-logo */}
          <img src="/maison-blender-logo-black.svg" alt="MAISON BLNDR" className="h-5 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Hoofdmenu" className="hidden gap-8 text-sm font-medium text-[#575760] md:flex">
          <div className="relative" ref={desktopWrapRef}>
            <button
              type="button"
              className={`flex items-center gap-1 ${linkFocus}`}
              aria-expanded={desktopDienstenOpen}
              aria-controls={desktopMenuId}
              aria-haspopup="true"
              onClick={() => setDesktopDienstenOpen((v) => !v)}
            >
              Diensten
              <svg className="h-3 w-3 opacity-50" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {desktopDienstenOpen && (
              <div id={desktopMenuId} className="absolute left-0 top-full z-50 w-72 pt-1">
                <div className="border border-black/[0.06] bg-white py-2 shadow-lg">
                  {services.map((s) => (
                    <a
                      key={s.slug}
                      href={`/diensten/${s.slug}`}
                      className={`block px-4 py-2.5 text-sm text-[#575760] transition-colors hover:bg-[#f2f3f5] hover:text-[#1f1f1f] ${linkFocus}`}
                      onClick={() => setDesktopDienstenOpen(false)}
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {topLinks.map((l) => (
            <a key={l.href} href={l.href} className={linkFocus}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/strategiegesprek"
            className={`hidden rounded-full border border-[#1f1f1f]/20 bg-[#1f1f1f] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#3a3a42] md:inline-block ${linkFocus}`}
          >
            Strategiegesprek
          </a>

          <button
            type="button"
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-md p-3 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
          >
            <span
              className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform duration-200 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform duration-200 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id={mobileMenuId} ref={mobileMenuRef} className="border-t border-black/[0.06] bg-white py-4 md:hidden">
          <nav aria-label="Mobiel menu" className="flex flex-col gap-1">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-3 text-left text-sm font-medium text-[#575760] transition-colors hover:bg-[#f2f3f5] hover:text-[#1f1f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              onClick={() => setMobileDienstenOpen((v) => !v)}
              aria-expanded={mobileDienstenOpen}
              aria-controls="nav-mobile-diensten"
            >
              Diensten
              <svg
                className={`h-3 w-3 opacity-50 transition-transform ${mobileDienstenOpen ? "rotate-180" : ""}`}
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {mobileDienstenOpen && (
              <div id="nav-mobile-diensten" className="flex flex-col gap-1 pl-4">
                {services.map((s) => (
                  <a
                    key={s.slug}
                    href={`/diensten/${s.slug}`}
                    className={`rounded-md py-2 text-sm text-[#575760] transition-colors hover:text-[#1f1f1f] ${linkFocus}`}
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileDienstenOpen(false);
                    }}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            )}

            {topLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`rounded-md px-2 py-3 text-sm font-medium text-[#575760] transition-colors hover:bg-[#f2f3f5] hover:text-[#1f1f1f] ${linkFocus}`}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}

            <a
              href="/strategiegesprek"
              className="mt-2 rounded-full bg-[#1f1f1f] px-5 py-3 text-center text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Strategiegesprek
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
