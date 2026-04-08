export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] bg-white px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <img
          src="/maison-blender-logo-black.svg"
          alt="MAISON BLNDR"
          className="h-4 w-auto"
        />
        <p className="text-xs text-[#b2b2be]">
          © {year} MAISON BLNDR · BTW: NL001832932B87 · Sittard, Nederland
        </p>
        <nav className="flex flex-wrap justify-center gap-6 text-xs text-[#575760] sm:justify-end">
          <a href="/#diensten" className="hover:text-[#1f1f1f] transition-colors">Diensten</a>
          <a href="/sessies" className="hover:text-[#1f1f1f] transition-colors">AI-op-Maat Sessies</a>
          <a href="/brand-ambassador" className="hover:text-[#1f1f1f] transition-colors">Brand Ambassador</a>
          <a href="/#sectoren" className="hover:text-[#1f1f1f] transition-colors">Sectoren</a>
          <a href="/#aanpak" className="hover:text-[#1f1f1f] transition-colors">Aanpak</a>
          <a href="/#contact" className="hover:text-[#1f1f1f] transition-colors">Contact</a>
          <a href="/labs" className="hover:text-[#1f1f1f] transition-colors font-medium">Labs →</a>
          <a href="/privacybeleid" className="hover:text-[#1f1f1f] transition-colors">Privacybeleid</a>
        </nav>
      </div>
    </footer>
  );
}
