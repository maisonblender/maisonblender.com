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
              <h2 className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]" style={{ letterSpacing: "-0.95px" }}>
                We zijn begonnen met
                <br />
                <span className="font-exposure">één overtuiging.</span>
              </h2>
            </div>

            <div id="about-description" className="flex flex-col gap-4 text-[#575760] leading-relaxed">
              <p>
                AI-projecten gaan mis als het mooi klinkt in een deck, maar onhandig is voor degene
                die er elke dag mee moet werken. Dat zien we vaker dan we zouden willen.
              </p>
              <p>
                Daarom beginnen we bij je processen. Code komt daarna.
              </p>
              <p>
                Voor agents gebruiken we onder andere{" "}
                <strong>OpenAI</strong>, <strong>Anthropic Claude</strong> en{" "}
                <strong>LangChain</strong>. Voor koppelingen{" "}
                <strong>n8n</strong>, <strong>Make.com</strong> en <strong>Zapier</strong>. Welke
                tool past, hangt af van jouw situatie — niet van wat deze maand trending is.
              </p>
              <p>
                We zitten in Sittard en werken door heel Nederland. Zelfde team, geen doorverbinden
                naar een callcenter.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Gevestigd in", value: "Sittard, NL" },
                { label: "Focusgebied", value: "MKB & Scale-ups" },
                { label: "Specialisatie", value: "Custom AI-agents" },
                { label: "Doelgroep", value: "Operationeel NL" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-l-2 border-black/20 pl-4">
                  <span className="text-xs uppercase tracking-widest text-[#6b6b75]">{item.label}</span>
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
                alt="MAISON BLNDR team"
                className="object-cover w-full"
              />
            </div>
            <div className="w-full bg-[#f2f3f5] p-6 sm:p-10">
              <div className="flex flex-col gap-6">
                <div className="h-px w-8 bg-black/30" />
                <blockquote className="text-2xl font-bold leading-tight text-[#1f1f1f]" style={{ letterSpacing: "-0.5px" }}>
                  &ldquo;Features tellen weinig. Uren terug in de week, dat wel.&rdquo;
                </blockquote>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#575760]">MAISON BLNDR</span>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
