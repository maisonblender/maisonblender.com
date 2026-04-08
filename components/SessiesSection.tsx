import Link from "next/link";
import SiteImage from "@/components/SiteImage";

export default function SessiesSection() {
  return (
    <section id="sessies" className="relative bg-[#1f1f1f] px-6 py-20 lg:py-32 text-white overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Text column */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
              Nieuw · On-site AI automatisering
            </div>

            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[26px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Eén dag bij jou.
              <br />
              <span className="font-exposure">Direct een werkend AI-systeem.</span>
            </h2>

            <p className="text-base leading-relaxed text-white/70 max-w-lg">
              Wij komen naar jou toe, analyseren een concreet knelpunt in jouw workflow en bouwen
              samen de automatisering op dezelfde dag. Geen pitch, geen advies op papier - gewoon
              bouwen en opleveren.
            </p>

            <ul className="flex flex-col gap-3 text-sm text-white/70">
              {[
                "Direct resultaat op dag 1 - geen wachttijd",
                "Gestandaardiseerde connectors voor Exact, Microsoft 365, WhatsApp",
                "Premium sessie met gegarandeerde output",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/sessies"
                className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg text-center"
              >
                Bekijk AI-op-Maat Sessies →
              </Link>
              <a
                href="/strategiegesprek"
                className="inline-block rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white text-center"
              >
                Boek een sessie
              </a>
            </div>
          </div>

          {/* Visual column */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <SiteImage
                src="/images/sessies-visual.png"
                alt="AI-op-Maat Sessie on-site illustratie"
                className="object-cover w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
