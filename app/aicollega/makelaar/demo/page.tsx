import type { Metadata } from "next";
import Link from "next/link";
import AmbassadorWidget from "@/components/BrandAmbassador/AmbassadorWidget";
import HidePresence from "@/components/PersistentPresence/HidePresence";

export const metadata: Metadata = {
  title: "Live demo — AI Collega Makelaar | MAISON BLNDR",
  description:
    "Stel de AI Collega een vraag over een woning en zie hoe hij reageert. Dezelfde Liquid Presence, voice en leadcapture — geconfigureerd voor jouw kantoor.",
  alternates: { canonical: "https://maisonblender.com/aicollega/makelaar/demo" },
  robots: { index: false, follow: true },
};

const MAKELAAR_OPENING = {
  content:
    "Hoi, ik ben de online assistent van Makelaardij Van den Berg in Sittard. Je kunt me alles vragen over onze woningen, het aankoop- of verkoopproces, of een bezichtiging inplannen. Waar kan ik je mee helpen?",
  suggestions: [
    "Welke woningen zijn er beschikbaar?",
    "Hoe werkt een bezichtiging aanvragen?",
    "Wat zijn de courtagekosten?",
  ],
};

/**
 * Tenant-accent hue voor de demo. Navy/royal blue (220) — bewust ANDERS dan de
 * MAISON BLNDR mint (160). De Liquid Presence en alle UI-accenten gebruiken
 * deze hue zodat de AI Collega visueel los staat van de eigen Brand Presence.
 */
const MAKELAAR_HUE = 220;

export default function DemoPage() {
  return (
    <>
      {/* Verberg de site-wide Persistent Presence — de Ambassador-widget is hier zelf aanwezig */}
      <HidePresence />

      {/* Lichte standaard achtergrond met subtiel dot-pattern, zelfde stijl
          als de andere AI Collega pagina's. De donkere widget eronder is dé
          "stage" voor de Liquid Presence en steekt nu juist mooi af. */}
      <section className="relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #b2b2be 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
          {/* Back + header */}
          <div className="mb-6">
            <Link
              href="/aicollega/makelaar"
              className="inline-flex items-center gap-2 text-sm text-[#575760] hover:text-[#1f1f1f] transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Terug
            </Link>

            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-[#575760]">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live demo — Makelaardij Van den Berg, Sittard
              </div>
            </div>

            <h1
              className="text-[32px] font-normal leading-tight text-[#1f1f1f] mb-2"
              style={{ letterSpacing: "-0.6px" }}
            >
              Gesprek met de AI Collega
            </h1>
            <p className="text-[#575760] text-sm max-w-xl">
              Dit is dezelfde Liquid Presence, voice en leadcapture als de MAISON BLNDR Brand
              Ambassador — geconfigureerd voor een makelaarskantoor. Zo ziet jouw AI Collega eruit.
            </p>
          </div>

          {/* De volledige AmbassadorWidget, gericht op de makelaar-tenant.
              voiceSessionEndpoint zorgt dat een live voice-sessie de tenant-
              specifieke system-prompt + first-message krijgt — dezelfde
              instructies als de tekst-chat, via session overrides op de
              gedeelde ElevenLabs ConvAI-agent.
              accentHue=220 = navy blue, bewust anders dan de MAISON BLNDR mint. */}
          <AmbassadorWidget
            chatEndpoint="/api/aicollega/makelaar/chat"
            voiceSessionEndpoint="/api/aicollega/makelaar/voice-session?tenantId=demo-makelaar-01"
            tenantId="demo-makelaar-01"
            brandName="Makelaardij Van den Berg"
            personaLabel="Online assistent"
            initialBubble={MAKELAAR_OPENING}
            defaultFullscreen={false}
            accentHue={MAKELAAR_HUE}
            theme="light"
          />

          {/* Sidebar-context onder de widget */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Objecten in demo",
                items: [
                  "Wilhelminastraat 14, Sittard — € 425.000",
                  "Mgr. Buckxstraat 8, Geleen — € 195.000",
                  "Parallelweg 33, Beek — Verkocht",
                ],
              },
              {
                label: "Features actief",
                items: [
                  "Liquid Presence (levend canvas)",
                  "Voice read-aloud (ElevenLabs)",
                  "Lead scoring: warm / lauw / koud",
                ],
              },
              {
                label: "Dit werkt voor jouw kantoor",
                items: [
                  "Geconfigureerd met jouw objecten & FAQ",
                  "Eigen tone-of-voice (formeel/informeel)",
                  "Live in 15 minuten",
                ],
              },
            ].map((col) => (
              <div
                key={col.label}
                className="bg-white border border-black/10 p-5"
              >
                <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-3">
                  {col.label}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-[#1f1f1f] flex items-start gap-2"
                    >
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                        style={{ background: `hsl(${MAKELAAR_HUE}, 70%, 50%)` }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/aicollega/makelaar/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#3a3a42] hover:shadow-md transition-all"
            >
              Mijn kantoor aanmelden — gratis proberen
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
