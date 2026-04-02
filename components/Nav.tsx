export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-bold tracking-widest text-[#1f1f1f]">
          M<span className="font-exposure">∆</span>ISON BLNDR
        </a>
        <nav className="hidden gap-8 text-sm font-medium text-[#575760] md:flex">
          <a href="#diensten" className="transition-colors hover:text-[#1f1f1f]">Diensten</a>
          <a href="#sectoren" className="transition-colors hover:text-[#1f1f1f]">Sectoren</a>
          <a href="#aanpak" className="transition-colors hover:text-[#1f1f1f]">Aanpak</a>
          <a href="#over-ons" className="transition-colors hover:text-[#1f1f1f]">Over ons</a>
          <a href="#contact" className="transition-colors hover:text-[#1f1f1f]">Contact</a>
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-[#1f1f1f]/20 bg-[#1f1f1f] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#3a3a42]"
        >
          Strategiegesprek
        </a>
      </div>
    </header>
  );
}
