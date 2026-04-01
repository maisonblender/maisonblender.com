export default function Contact() {
  return (
    <section id="contact" className="relative bg-[#0a0e15] px-6 py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#4af0c4]/20 to-transparent" />

      <div className="mx-auto max-w-3xl text-center">
        <div className="flex flex-col items-center gap-8">
          <span className="text-xs font-medium uppercase tracking-widest text-[#4af0c4]">
            Contact
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#f0f4ff] sm:text-5xl">
            Klaar om te beginnen?
          </h2>
          <p className="max-w-lg text-lg text-[#8892a4] leading-relaxed">
            Plan een vrijblijvend strategiegesprek. Wij luisteren, analyseren uw situatie en
            vertellen u eerlijk wat AI voor uw organisatie kan betekenen.
          </p>

          <a
            href="mailto:info@maisonblender.com"
            className="group relative rounded-full bg-[#4af0c4] px-10 py-5 text-base font-bold text-[#080b10] transition-all hover:bg-[#6af5d4] hover:shadow-[0_0_60px_rgba(74,240,196,0.4)]"
          >
            Plan een strategiegesprek
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          <div className="mt-4 flex flex-col items-center gap-3 text-sm text-[#8892a4]">
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#4af0c4]" />
              <a href="tel:+31462004035" className="hover:text-[#f0f4ff] transition-colors">
                +31 (0)46 200 4035
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#4af0c4]" />
              <span>Burg. Coonenplein 37, 6141BZ Sittard</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
