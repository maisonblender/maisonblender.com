"use client";

import { useState } from "react";
import { services } from "@/lib/services";

const topLinks = [
  { href: "/#sectoren", label: "Sectoren" },
  { href: "/#aanpak", label: "Aanpak" },
  { href: "/#over-ons", label: "Over ons" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [dienstenOpen, setDienstenOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-white/90 px-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
        <a href="/" className="shrink-0">
          <img
            src="/maison-blender-logo-black.svg"
            alt="MAISON BLNDR"
            className="h-5 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-8 text-sm font-medium text-[#575760] md:flex">
          {/* Diensten dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDienstenOpen(true)}
            onMouseLeave={() => setDienstenOpen(false)}
          >
            <a
              href="/#diensten"
              className="flex items-center gap-1 transition-colors hover:text-[#1f1f1f]"
            >
              Diensten
              <svg className="h-3 w-3 opacity-50" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {dienstenOpen && (
              <div className="absolute left-0 top-full z-50 w-72 pt-1">
                <div className="border border-black/[0.06] bg-white py-2 shadow-lg">
                  {services.map((s) => (
                    <a
                      key={s.slug}
                      href={`/diensten/${s.slug}`}
                      className="block px-4 py-2.5 text-sm text-[#575760] transition-colors hover:bg-[#f2f3f5] hover:text-[#1f1f1f]"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {topLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[#1f1f1f]">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/strategiegesprek"
            className="hidden rounded-full border border-[#1f1f1f]/20 bg-[#1f1f1f] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#3a3a42] md:block"
          >
            Strategiegesprek
          </a>

          {/* Mobile hamburger */}
          <button
            className="flex flex-col gap-1.5 p-1 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/[0.06] bg-white py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {/* Diensten with sub-links */}
            <button
              className="flex w-full items-center justify-between px-2 py-2 text-left text-sm font-medium text-[#575760] transition-colors hover:text-[#1f1f1f]"
              onClick={() => setDienstenOpen((v) => !v)}
            >
              Diensten
              <svg
                className={`h-3 w-3 opacity-50 transition-transform ${dienstenOpen ? "rotate-180" : ""}`}
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {dienstenOpen && (
              <div className="flex flex-col gap-1 pl-4">
                {services.map((s) => (
                  <a
                    key={s.slug}
                    href={`/diensten/${s.slug}`}
                    className="py-2 text-sm text-[#575760] transition-colors hover:text-[#1f1f1f]"
                    onClick={() => setOpen(false)}
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
                className="px-2 py-2 text-sm font-medium text-[#575760] transition-colors hover:text-[#1f1f1f]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}

            <a
              href="/strategiegesprek"
              className="mt-2 rounded-full bg-[#1f1f1f] px-5 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Strategiegesprek
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
