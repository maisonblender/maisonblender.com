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
                Wij bouwen AI
                <br />
                <span className="font-exposure">die werkt voor u.</span>
              </h2>
            </div>

            <div id="about-description" className="flex flex-col gap-4 text-[#575760] leading-relaxed">
              <p>
                Maison Blender bouwt AI-oplossingen voor bedrijven die willen groeien.
                Geen loze strategiedocumenten - wij leveren werkende software die uw mensen
                dagelijks gebruiken.
              </p>
              <p>
                We werken met ondernemers die concreet willen verbeteren: minder handmatig werk,
                snellere processen, betere klantervaring. Of u nu tien of duizend medewerkers hebt.
              </p>
              <p>
                Wij bouwen met de beste tools: <strong>OpenAI</strong>, <strong>Anthropic Claude</strong>,{" "}
                <strong>LangChain</strong> en <strong>Microsoft Azure AI</strong> voor intelligente agents en
                taalmodellen; <strong>n8n</strong>, <strong>Make.com</strong> en <strong>Zapier</strong> voor
                workflow-automatisering en systeemkoppelingen.
              </p>
              <p>
                Gevestigd in Sittard, actief door heel Nederland.
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
                  &ldquo;Automatisering werkt pas als het past bij uw mensen en uw processen.
                  Daarom bouwen wij altijd op maat - en blijven wij betrokken na de lancering.&rdquo;
                </blockquote>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#575760]">Maison Blender</span>
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
