import SiteImage from "@/components/SiteImage";

export default function About() {
  return (
    <section id="over-ons" className="relative bg-white px-6 py-20 lg:py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: text */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                Over ons
              </span>
              <h2 className="text-3xl font-black tracking-tight text-[#1f1f1f] sm:text-4xl lg:text-5xl" style={{ letterSpacing: "-0.95px" }}>
                Twaalf bedrijven in de regio.
                <br />
                <span className="font-exposure">Geen data-scientist nodig.</span>
              </h2>
            </div>

            <div id="about-description" className="flex flex-col gap-4 text-[#575760] leading-relaxed">
              <p>
                Wij zijn begonnen met één overtuiging: AI-implementaties mislukken niet door de technologie.
                Ze mislukken omdat bureaus leveren wat indrukwekkend klinkt — niet wat werkt voor de mensen
                die het dagelijks moeten gebruiken.
              </p>
              <p>
                Daarom beginnen wij altijd met uw processen. Dan pas met de code.
              </p>
              <p>
                Wij bouwen met tools die al bewezen zijn: <strong>OpenAI</strong>, <strong>Anthropic Claude</strong>{" "}
                en <strong>LangChain</strong> voor intelligente agents; <strong>n8n</strong>,{" "}
                <strong>Make.com</strong> en <strong>Zapier</strong> voor robuuste koppelingen met uw bestaande
                systemen. Geen evangelisatie van de nieuwste hype — keuze voor wat werkt.
              </p>
              <p>
                Gevestigd in Sittard. Actief in Maastricht, Geleen, Heerlen, Venlo en daarbuiten.
                U heeft geen reiskosten, geen tijdsverschil en geen callcenter — u heeft een team
                dat uw regio kent.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Gevestigd in", value: "Sittard, NL" },
                { label: "Focusgebied", value: "Zuid-Limburg" },
                { label: "Specialisatie", value: "Custom AI-agents" },
                { label: "Doelgroep", value: "MKB & Scale-ups" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-l-2 border-black/20 pl-4">
                  <span className="text-xs text-[#b2b2be] uppercase tracking-widest">{item.label}</span>
                  <span className="text-sm font-medium text-[#1f1f1f]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual + manifesto card */}
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <SiteImage
                src="/images/about-visual.png"
                alt="Maison Blender team"
                className="object-cover w-full"
              />
            </div>
            <div className="w-full bg-[#f2f3f5] p-6 sm:p-10">
              <div className="flex flex-col gap-6">
                <div className="h-px w-8 bg-black/30" />
                <blockquote className="text-2xl font-bold leading-tight text-[#1f1f1f]" style={{ letterSpacing: "-0.5px" }}>
                  &ldquo;De meeste AI-bureaus zijn weg zodra het systeem live staat.
                  Wij zijn er dan pas echt begonnen.&rdquo;
                </blockquote>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#575760]">MAISON BLNDR</span>
                  <span className="text-xs text-[#b2b2be]">Sittard, Zuid-Limburg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
