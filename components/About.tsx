export default function About() {
  return (
    <section id="over-ons" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: text */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-[#4af0c4]">
                Over ons
              </span>
              <h2 className="text-4xl font-black tracking-tight text-[#f0f4ff] sm:text-5xl">
                De AI-autoriteit
                <br />
                van Zuid-Limburg.
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-[#8892a4] leading-relaxed">
              <p>
                Maison Blender is opgericht met één missie: AI toegankelijk en impactvol maken voor
                ambitieuze organisaties in Zuid-Limburg en daarbuiten. Wij zijn niet alleen
                adviseurs — wij bouwen en implementeren.
              </p>
              <p>
                Onze klanten zijn SMBs, startups en scale-ups die willen groeien zonder
                proportioneel meer mensen aan te nemen. Wij zijn er niet voor organisaties die
                niet open staan voor innovatie.
              </p>
              <p>
                Gevestigd in Sittard, hart van Zuid-Limburg. Denken globaal, handelen lokaal.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Gevestigd in", value: "Sittard, NL" },
                { label: "Focusgebied", value: "Zuid-Limburg" },
                { label: "Specialisatie", value: "Custom AI-agents" },
                { label: "Doelgroep", value: "MKB & Scale-ups" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-l border-[#4af0c4]/20 pl-4">
                  <span className="text-xs text-[#8892a4]/60 uppercase tracking-widest">{item.label}</span>
                  <span className="text-sm font-medium text-[#f0f4ff]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: manifesto card */}
          <div className="flex items-center">
            <div className="relative w-full rounded-2xl border border-white/5 bg-[#0a0e15] p-10">
              {/* Corner accent */}
              <div className="absolute right-0 top-0 h-24 w-24 overflow-hidden rounded-tr-2xl">
                <div className="absolute right-0 top-0 h-px w-24 bg-[#4af0c4]/30" />
                <div className="absolute right-0 top-0 h-24 w-px bg-[#4af0c4]/30" />
              </div>

              <div className="flex flex-col gap-6">
                <div className="h-px w-8 bg-[#4af0c4]" />
                <blockquote className="text-2xl font-bold leading-tight text-[#f0f4ff]">
                  &ldquo;AI is geen toekomstmuziek meer. Het is de infrastructuur van nu. Wij
                  helpen u die infrastructuur bouwen.&rdquo;
                </blockquote>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#4af0c4]">Maison Blender</span>
                  <span className="text-xs text-[#8892a4]">Sittard, Zuid-Limburg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
