import SiteImage from "@/components/SiteImage";

const steps = [
  {
    step: "01",
    title: "We beginnen bij jouw processen",
    description:
      "We beginnen niet met een wishlist. We lopen je processen door: waar gaat tijd verloren, wat is realistisch te automatiseren, welke systemen moeten mee. Je krijgt een plan met stappen, timing en een eerlijke inschatting van wat het oplevert.",
  },
  {
    step: "02",
    title: "Werkend prototype in twee weken",
    description:
      "Binnen twee weken draait er iets in jouw eigen omgeving. Echte data, echte koppelingen. Past het niet? Dan sturen we bij voordat we verder bouwen.",
  },
  {
    step: "03",
    title: "Live. En we blijven.",
    description:
      "Werkt het? Dan zetten we het productief neer. Monitoring en beheer nemen wij over. Jij ziet of het doet wat het moet doen.",
  },
];

export default function Process() {
  return (
    <section id="aanpak" className="relative bg-[#f2f3f5] px-6 py-20 lg:py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Steps column */}
          <div>
            <div className="mb-16 flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                Aanpak
              </span>
              <h2 className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]" style={{ letterSpacing: "-0.95px" }}>
                Stap voor stap.
                <br />
                <span className="font-exposure">Live binnen vier weken.</span>
              </h2>
            </div>

            <div className="relative flex flex-col gap-0">
              {steps.map((step, i) => (
                <div key={step.step} className="group relative flex gap-8 pb-16 last:pb-0">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[19px] top-10 h-full w-px bg-gradient-to-b from-black/20 to-transparent" />
                  )}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-white shadow-sm">
                    <span className="font-mono text-xs font-bold text-[#1f1f1f]">{step.step}</span>
                  </div>
                  <div className="flex flex-col gap-3 pt-1.5">
                    <h3 className="text-xl font-bold text-[#1f1f1f]">{step.title}</h3>
                    <p className="text-[#575760] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual column */}
          <div className="flex items-center">
            <div className="w-full">
              <SiteImage
                src="/images/process-steps.png"
                alt="Aanpak diagram"
                className="object-cover w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
    </section>
  );
}
