import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ChatGPT vs. Claude vs. Gemini: wat kies je als Limburgse ondernemer? - Limburg AI Labs",
  description:
    "ChatGPT, Claude of Gemini? Eerlijke vergelijking: wat kost het, wat kan het en welke tool past bij jouw bedrijf?",
  alternates: { canonical: "https://maisonblender.com/labs/kennisbank/chatgpt-vs-claude-vs-gemini" },
};

export default function ArticlePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1f1f1f] px-6 py-24 text-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">Gids</span>
            <span className="text-xs text-white/40">8 min lezen</span>
          </div>
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[42px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            ChatGPT vs. Claude vs. Gemini:
            <br />
            <span className="font-exposure">wat kies je als Limburgse ondernemer?</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-2xl">
            Welke tool doet wat, voor wie past welke, en wat kost het in 2026? Geen affiliate links. Wel cijfers.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              &ldquo;Welke AI-tool moet ik gebruiken?&rdquo; krijgen we elke week. Het antwoord hangt af van wat je
              ermee wilt doen. Daar heb je weinig aan zonder context. Hieronder de vergelijking die wij zelf ook
              gebruiken bij nieuwe klanten.
            </p>

            <p>
              We zetten ChatGPT (OpenAI), Claude (Anthropic) en Gemini (Google) naast elkaar. Alle drie werken in
              Nederland, hebben een gratis versie en zijn bruikbaar voor MKB. Niet voor dezelfde taken.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              ChatGPT vs. Claude vs. Gemini: de alleskunner
            </h2>

            <p>
              ChatGPT is de bekendste. Meer dan 200 miljoen mensen gebruiken het maandelijks. Redelijk tot goed
              voor teksten, vertalen, brainstormen, code debuggen en vragen over documenten.
            </p>

            <p>
              De gratis versie geeft toegang tot GPT-5.3 met beperkingen — prima voor incidenteel gebruik.
              De betaalde versie geeft volledige toegang tot GPT-5.3 en de geavanceerde o-serie redeneermodellen,
              hogere limieten en de mogelijkheid om eigen instructies in te stellen zodat de tool jouw
              bedrijfsstijl en context onthoudt.
            </p>

            <p>
              Waar ChatGPT minder sterk in is: taken waarbij nauwkeurigheid telt. Het model is gebouwd om
              overtuigende tekst te produceren, niet per se correcte. Bij juridische of financiele analyses:
              altijd dubbelchecken.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f]">Geschikt voor:</h3>
            <ul className="space-y-2 pl-4">
              {["Marketing en communicatieteksten", "Brainstormen en idee-generatie", "E-mails en offertes opstellen", "Samenvatten van documenten", "Klantenservice-antwoorden schrijven"].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Claude: preciezer, minder bekend
            </h2>

            <p>
              Claude is minder bekend maar scoort hoog op precisie. Ontwikkeld door Anthropic, met veiligheid als
              uitgangspunt. In de praktijk: vaker &ldquo;dat weet ik niet&rdquo;, en instructies worden strakker
              opgevolgd.
            </p>

            <p>
              Sterk punt: lange teksten. Contracten, rapporten, handleidingen. Waar ChatGPT na een paar pagina&apos;s
              de draad kwijtraakt, houdt Claude langer vol.
            </p>

            <p>
              Ook beter als de toon precies moet kloppen: een lastige brief, delicate interne mail, genuanceerd
              advies. Gratis: beperkt Claude Sonnet 4.6. Betaald: Claude Opus 4.7 voor zwaardere taken.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f]">Geschikt voor:</h3>
            <ul className="space-y-2 pl-4">
              {["Analyseren van lange documenten (contracten, rapporten)", "Delicate communicatie waarbij toon precies moet kloppen", "Gestructureerde outputs (formats, templates)", "Juridische en financiele teksten controleren", "Gedetailleerde instructies nauwkeurig uitvoeren"].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Gemini: handig als je in Google werkt
            </h2>

            <p>
              Gemini is Googles AI-assistent. Het voordeel zit in de koppeling met Google Workspace. Werk je met
              Gmail, Docs, Drive en Agenda, dan kan Gemini mails samenvatten, vergaderingen plannen en documenten
              bewerken. ChatGPT en Claude doen dat niet.
            </p>

            <p>
              Als pure tekstassistent scoort Gemini iets lager op nauwkeurigheid. Voor Google-gebruikers is het
              vaak de praktischste keuze. Gratis: Gemini 3 Flash. Betaald: Gemini 3.1 Pro met diepere Workspace-
              integratie.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f]">Geschikt voor:</h3>
            <ul className="space-y-2 pl-4">
              {["Teams die volledig in Google Workspace werken", "Automatisch e-mails en vergaderverslagen samenvatten", "Zoeken in Google Drive-documenten", "Agendabeheer en planning assistentie"].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Modellenvergelijking 2026
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">Prijsvergelijking ChatGPT, Claude en Gemini 2026</caption>
                <thead>
                  <tr className="bg-[#f2f3f5]">
                    <th scope="col" className="border border-black/[0.08] p-3 text-left font-semibold text-[#1f1f1f]">
                      Tool
                    </th>
                    <th scope="col" className="border border-black/[0.08] p-3 text-left font-semibold text-[#1f1f1f]">
                      Gratis model
                    </th>
                    <th scope="col" className="border border-black/[0.08] p-3 text-left font-semibold text-[#1f1f1f]">
                      Betaald model
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="border border-black/[0.08] p-3 text-left font-medium text-[#1f1f1f]">
                      ChatGPT
                    </th>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">GPT-5.3 (beperkt)</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">GPT-5.3 (volledig) + o-serie</td>
                  </tr>
                  <tr className="bg-[#f2f3f5]/50">
                    <th scope="row" className="border border-black/[0.08] p-3 text-left font-medium text-[#1f1f1f]">
                      Claude
                    </th>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Claude Sonnet 4.6 (beperkt)</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Claude Opus 4.7</td>
                  </tr>
                  <tr>
                    <th scope="row" className="border border-black/[0.08] p-3 text-left font-medium text-[#1f1f1f]">
                      Gemini
                    </th>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Gemini 3 Flash (beperkt)</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Gemini 3.1 Pro</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Onze aanbeveling voor Limburgse MKB
            </h2>

            <p>
              Begin met een gratis versie en gebruik die twee weken intensief. Pas dan weet je of betalen zin heeft
              voor jouw gebruik.
            </p>

            <p>
              Google Workspace? Start met Gemini. Veel lange documenten of delicate communicatie? Probeer Claude.
              Algemeen dagelijks gebruik en content? ChatGPT is een logisch startpunt.
            </p>

            <p>
              Veel ondernemers eindigen met twee tools: Gemini voor Google, Claude of ChatGPT voor tekstwerk.
              Kies er een, leer die goed kennen. Alle drie tegelijk aanschaffen is de fout die we het vaakst zien.
            </p>

          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1f1f1f] text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#22c55e] mb-4">Meer weten</p>
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight mb-4 sm:text-[28px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            Hulp nodig bij de keuze
            <br />
            <span className="font-exposure">voor jouw specifieke situatie?</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-8 max-w-xl">
            Wij helpen Limburgse bedrijven kiezen op basis van processen, niet op basis van wat op LinkedIn
            trending is. Plan een gratis kennismaking of doe eerst de AI Impact Scan.
          </p>
          <a
            href="https://maisonblender.com/impact-scan"
            className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a]"
          >
            Doe de gratis AI Impact Scan →
          </a>
        </div>
      </section>

      {/* Back link */}
      <section className="px-6 py-10 bg-[#f2f3f5]">
        <div className="mx-auto max-w-3xl">
          <Link href="/labs/kennisbank" className="text-sm text-[#575760] hover:text-[#1f1f1f] transition-colors">
            ← Terug naar de kennisbank
          </Link>
        </div>
      </section>
    </>
  );
}
