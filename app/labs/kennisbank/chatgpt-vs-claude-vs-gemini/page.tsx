import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ChatGPT vs. Claude vs. Gemini: wat kies je als Limburgse ondernemer? - Limburg AI Labs",
  description:
    "ChatGPT, Claude of Gemini? Eerlijke vergelijking zonder jargon. Wat kost het, wat kan het en welke AI-tool past bij jouw bedrijf?",
  alternates: { canonical: "https://labs.maisonblender.com/kennisbank/chatgpt-vs-claude-vs-gemini" },
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
            Geen tech-jargon. Geen affiliate links. Gewoon: welke tool doet wat, voor wie is welke geschikt
            en wat zijn de echte kosten in 2026.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              De vraag "welke AI-tool moet ik gebruiken?" krijgen we elke week van Limburgse ondernemers.
              Het antwoord is altijd hetzelfde: het hangt af van wat je ermee wilt doen. Maar daar heb je niets
              aan zonder context. Dus hier is de vergelijking die wij zelf ook gebruiken als we met nieuwe klanten
              aan de slag gaan.
            </p>

            <p>
              We vergelijken de drie meest gebruikte AI-assistenten: ChatGPT (van OpenAI), Claude (van Anthropic)
              en Gemini (van Google). Alle drie zijn beschikbaar in Nederland, alle drie hebben een gratis versie
              en alle drie zijn geschikt voor MKB-gebruik - maar niet voor dezelfde taken.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              ChatGPT: de Zwitserse zakmes van AI
            </h2>

            <p>
              ChatGPT is de bekendste van de drie. Meer dan 200 miljoen mensen gebruiken het maandelijks. Die
              naamsbekendheid is verdiend: het is een veelzijdige tool die goed werkt voor een brede waaier aan
              taken. Teksten schrijven, vertalen, brainstormen, code debuggen, vragen beantwoorden over een
              document - ChatGPT doet het allemaal redelijk tot goed.
            </p>

            <p>
              De gratis versie (GPT-4o) is prima voor incidenteel gebruik. De betaalde versie (ChatGPT Plus,
              20 euro per maand) geeft toegang tot geavanceerdere functies, hogere limieten en de mogelijkheid
              om eigen instructies in te stellen zodat de tool jouw bedrijfsstijl en context onthoudt.
            </p>

            <p>
              Waar ChatGPT minder sterk in is: complexe redeneerprocessen waarbij nauwkeurigheid cruciaal is.
              Het model is ontworpen om overtuigende tekst te produceren, niet per se correcte tekst. Voor
              juridische of financiele analyses is extra verificatie altijd verstandig.
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
              Claude: de nauwkeurige denker
            </h2>

            <p>
              Claude is minder bekend maar scoort consistent hoog op taken waarbij precisie en nuance tellen.
              Het is ontwikkeld door Anthropic, een bedrijf dat veiligheid en betrouwbaarheid centraal stelt in
              zijn aanpak. In de praktijk merk je dat: Claude geeft vaker aan wanneer het iets niet weet en
              volgt instructies nauwkeuriger op.
            </p>

            <p>
              Het grote voordeel van Claude is de mogelijkheid om heel lange teksten te verwerken - denk aan
              volledige contracten, rapporten of handleidingen. Waar ChatGPT na een paar pagina's de draad
              kwijtraakt, houdt Claude een consistente lijn vast over veel langere teksten.
            </p>

            <p>
              Claude is ook merkbaar beter in situaties waarbij de toon precies goed moet zijn: een lastige
              brief aan een klant, een delicate interne communicatie of een nuanced advies. De gratis versie
              heeft limieten, maar is al indrukwekkend. Claude Pro kost 18 euro per maand.
            </p>

            <h3 className="text-[16px] font-semibold text-[#1f1f1f]">Geschikt voor:</h3>
            <ul className="space-y-2 pl-4">
              {["Analyseren van lange documenten (contracten, rapporten)", "Delicate communicatie waarbij toon cruciaal is", "Gestructureerde outputs (formats, templates)", "Juridische en financiele teksten controleren", "Gedetailleerde instructies nauwkeurig uitvoeren"].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#22c55e] font-bold mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Gemini: de Google-native keuze
            </h2>

            <p>
              Gemini is de AI-assistent van Google en heeft een specifiek voordeel: integratie met Google
              Workspace. Als jouw bedrijf werkt met Gmail, Google Docs, Google Drive en Google Agenda, dan is
              Gemini de enige van de drie die direct met die omgeving kan samenwerken. Het kan e-mails
              samenvatten, vergaderingen plannen op basis van je agenda en documenten in Google Docs bewerken.
            </p>

            <p>
              Als pure tekstassistent scoort Gemini iets lager dan de andere twee - met name op nauwkeurigheid
              en nuance. Maar als productiviteitstool voor Google-gebruikers is het de sterkste keuze. Gemini
              Advanced (via Google One AI Premium, 22 euro per maand) geeft toegang tot de meest geavanceerde
              versie en diepe integraties.
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
              Prijsvergelijking 2026
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f2f3f5]">
                    <th className="text-left p-3 font-semibold text-[#1f1f1f] border border-black/[0.08]">Tool</th>
                    <th className="text-left p-3 font-semibold text-[#1f1f1f] border border-black/[0.08]">Gratis versie</th>
                    <th className="text-left p-3 font-semibold text-[#1f1f1f] border border-black/[0.08]">Betaalde versie</th>
                    <th className="text-left p-3 font-semibold text-[#1f1f1f] border border-black/[0.08]">Prijs per maand</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-black/[0.08] font-medium text-[#1f1f1f]">ChatGPT</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">GPT-4o (beperkt)</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">ChatGPT Plus</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">20 euro</td>
                  </tr>
                  <tr className="bg-[#f2f3f5]/50">
                    <td className="p-3 border border-black/[0.08] font-medium text-[#1f1f1f]">Claude</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Claude (beperkt)</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Claude Pro</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">18 euro</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-black/[0.08] font-medium text-[#1f1f1f]">Gemini</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Gemini (beperkt)</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">Gemini Advanced</td>
                    <td className="p-3 border border-black/[0.08] text-[#575760]">22 euro</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Onze aanbeveling voor Limburgse MKB
            </h2>

            <p>
              Begin met een van de gratis versies en gebruik hem twee weken intensief. Pas dan weet je of de
              betaalde versie zijn geld waard is voor jouw specifieke gebruik.
            </p>

            <p>
              Gebruik je Google Workspace? Begin met Gemini. Werk je veel met lange documenten, contracten of
              delicate communicatie? Probeer Claude. Wil je een veelzijdige tool voor dagelijks gebruik en
              contentcreatie? Dan is ChatGPT het logische startpunt.
            </p>

            <p>
              En weet je wat? Veel Limburgse ondernemers eindigen met twee tools. Gemini voor de Google-integratie,
              en Claude of ChatGPT voor teksttaken waarbij precisie telt. De gecombineerde kosten zijn minder dan
              een halve dag werk per maand - en de tijdsbesparing is een veelvoud daarvan.
            </p>

            <p>
              Wat je niet moet doen: alle drie tegelijk aanschaffen en dan geen van drieeen goed leren kennen.
              Dat is de meest gemaakte fout.
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
            Bij MAISON BLNDR helpen we Limburgse bedrijven met een concrete toolkeuze op basis van hun processen -
            niet op basis van hype. Plan een gratis kennismakingsgesprek of doe eerst de AI Impact Scan.
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
