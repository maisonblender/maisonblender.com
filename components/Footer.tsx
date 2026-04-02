export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-sm font-bold tracking-widest text-[#f0f4ff]">
          M<span className="text-[#4af0c4]">∆</span>ISON BLNDR
        </span>
        <p className="text-xs text-[#8892a4]">
          © {year} Maison Blender · BTW: NL001832932B87 · Sittard, Nederland
        </p>
        <nav className="flex gap-6 text-xs text-[#8892a4]">
          <a href="#diensten" className="hover:text-[#f0f4ff] transition-colors">Diensten</a>
          <a href="#sectoren" className="hover:text-[#f0f4ff] transition-colors">Sectoren</a>
          <a href="#aanpak" className="hover:text-[#f0f4ff] transition-colors">Aanpak</a>
          <a href="#contact" className="hover:text-[#f0f4ff] transition-colors">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
