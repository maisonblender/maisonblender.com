"use client";

import { useState } from "react";

const links = [
  { href: "#diensten", label: "Diensten" },
  { href: "#sectoren", label: "Sectoren" },
  { href: "#aanpak", label: "Aanpak" },
  { href: "#over-ons", label: "Over ons" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-bold tracking-widest text-[#1f1f1f]">
          M<span className="font-exposure">∆</span>ISON BLNDR
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-8 text-sm font-medium text-[#575760] md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[#1f1f1f]">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
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
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#1f1f1f] transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/[0.06] bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#575760] transition-colors hover:text-[#1f1f1f]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
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
