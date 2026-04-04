import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="relative bg-[#2c3e50] px-6 py-20 lg:py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-white/50">
            Contact
          </span>
          <h2
            className="text-4xl font-black tracking-tight text-white sm:text-5xl"
            style={{ letterSpacing: "-0.95px" }}
          >
            Eerlijk advies. Geen verplichtingen.
          </h2>
          <p className="max-w-lg text-lg text-white/70 leading-relaxed">
            Plan een gratis gesprek van een uur. Wij analyseren je drie grootste tijdvreters
            en vertellen je concreet welke daarvan AI-klaar zijn — inclusief een ruwe business case.
            Geen pitch, geen verplichtingen.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: form */}
          <ContactForm />

          {/* Right: direct contact details */}
          <div className="flex flex-col gap-8 lg:pt-2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                  Telefoon
                </span>
                <a
                  href="tel:+31462004035"
                  className="text-white hover:text-white/70 transition-colors"
                >
                  +31 (0)46 200 4035
                </a>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                  E-mail
                </span>
                <a
                  href="mailto:info@maisonblender.com"
                  className="text-white hover:text-white/70 transition-colors"
                >
                  info@maisonblender.com
                </a>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                  Adres
                </span>
                <span className="text-white/70">
                  Burg. Coonenplein 37<br />
                  6141BZ Sittard
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <a
                href="mailto:info@maisonblender.com"
                className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                Liever direct mailen?
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
