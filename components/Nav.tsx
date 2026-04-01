export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080b10]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-bold tracking-widest text-[#f0f4ff]">
          M<span className="text-[#4af0c4]">∆</span>ISON BLNDR
        </a>
        <nav className="hidden gap-8 text-sm font-medium text-[#8892a4] md:flex">
          <a href="#diensten" className="transition-colors hover:text-[#f0f4ff]">Diensten</a>
          <a href="#aanpak" className="transition-colors hover:text-[#f0f4ff]">Aanpak</a>
          <a href="#demo" className="transition-colors hover:text-[#4af0c4]">Demo</a>
          <a href="#over-ons" className="transition-colors hover:text-[#f0f4ff]">Over ons</a>
          <a href="#contact" className="transition-colors hover:text-[#f0f4ff]">Contact</a>
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-[#4af0c4]/30 bg-[#4af0c4]/10 px-5 py-2 text-sm font-medium text-[#4af0c4] transition-all hover:bg-[#4af0c4]/20"
        >
          Strategiegesprek
        </a>
      </div>
    </header>
  );
}
