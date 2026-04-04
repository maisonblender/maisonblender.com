import SiteImage from "@/components/SiteImage";

const steps = [
  {
    step: "01",
    title: "Jouw processen eerst",
    description:
      "Geen intakegesprek waarbij jij vertelt wat je wilt en wij knikken. Wij gaan in op je processen, bouwen een architectuur die je bestaande systemen serieus neemt, en leveren een roadmap met realistische tijdlijnen — inclusief wat het je concreet oplevert.",
  },
  {
    step: "02",
    title: "Twee weken. Dan zie je het.",
    description:
      "Binnen twee weken draait een werkend prototype in je eigen omgeving. Geen demo-omgeving, geen mock-data. Je ziet direct of het past — en stuurt bij voordat er een euro te veel is uitgegeven.",
  },
  {
    step: "03",
    title: "Live. En wij blijven.",
    description:
      "Na validatie bouwen wij naar productie. Robuust, veilig, schaalbaar. Monitoring en beheer blijven bij ons — jij hoeft alleen de resultaten te zien.",
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
              <h2 className="text-3xl font-black tracking-tight text-[#1f1f1f] sm:text-4xl lg:text-5xl" style={{ letterSpacing: "-0.95px" }}>
                Geen big bang.
                <br />
                <span className="font-exposure">Wel live binnen vier weken.</span>
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
