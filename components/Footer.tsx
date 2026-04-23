import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.08] bg-white px-6 py-14 text-[#1f1f1f]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- statisch SVG-logo, geen Image-optimalisatie nodig */}
          <img
            src="/maison-blender-logo-black.svg"
            alt="MAISON BLNDR"
            className="h-5 w-auto"
          />
          <div className="mt-5 space-y-1 text-sm leading-relaxed text-[#1f1f1f]">
            <p>Burgemeester Coonenplein 37</p>
            <p>6141BZ Sittard, NL</p>
            <p>
              T:{" "}
              <a href="tel:+31462004035" className="hover:text-black transition-colors">
                +31 (0)46 200 4035
              </a>
            </p>
            <p>BTW: NL001832932B87</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#1f1f1f]">Diensten</h3>
          <nav className="mt-4 flex flex-col gap-3 text-sm text-[#1f1f1f]">
            <Link href="/#diensten" className="hover:text-black transition-colors">Diensten</Link>
            <Link href="/sessies" className="hover:text-black transition-colors">AI-op-Maat Sessies</Link>
            <Link href="/brand-ambassador" className="hover:text-black transition-colors">Brand Ambassador</Link>
            <Link href="/#sectoren" className="hover:text-black transition-colors">Sectoren</Link>
            <Link href="/#aanpak" className="hover:text-black transition-colors">Aanpak</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#1f1f1f]">Bedrijf</h3>
          <nav className="mt-4 flex flex-col gap-3 text-sm text-[#1f1f1f]">
            <Link href="/#contact" className="hover:text-black transition-colors">Contact</Link>
            <Link href="/labs" className="hover:text-black transition-colors font-medium">Labs →</Link>
            <Link href="/privacybeleid" className="hover:text-black transition-colors">Privacybeleid</Link>
            <Link href="/toegankelijkheidsverklaring" className="hover:text-black transition-colors">
              Toegankelijkheidsverklaring
            </Link>
            <Link href="/eu-ai-act" className="hover:text-black transition-colors">EU AI Act</Link>
            <Link href="/toegankelijkheidsaudit" className="hover:text-black transition-colors">Toegankelijkheidsaudit</Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-black/[0.08] pt-6">
        <p className="text-sm text-[#1f1f1f]">
          © {year} MAISON BLNDR · Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}
