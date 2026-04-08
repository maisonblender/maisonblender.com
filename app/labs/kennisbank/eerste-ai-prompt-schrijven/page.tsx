import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Je eerste AI-prompt schrijven: stappenplan voor niet-techneuten - Limburg AI Labs",
  description:
    "Van blanco pagina naar een prompt die echt werkt. Praktisch stappenplan met voorbeelden voor offertes, e-mails en analyses. Geen technische kennis vereist.",
  alternates: { canonical: "https://labs.maisonblender.com/kennisbank/eerste-ai-prompt-schrijven" },
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
            <span className="text-xs font-medium uppercase tracking-widest text-[#22c55e]">How-to</span>
            <span className="text-xs text-white/40">5 min lezen</span>
          </div>
          <h1
            className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-[36px] lg:text-[42px] mb-6"
            style={{ letterSpacing: "-0.95px" }}
          >
            Je eerste AI-prompt schrijven:
            <br />
            <span className="font-exposure">een stappenplan voor niet-techneuten</span>
          </h1>
          <p className="text-base leading-relaxed text-white/70 max-w-2xl">
            De kwaliteit van je prompt bepaalt de kwaliteit van het antwoord. Dit zijn de vijf stappen
            die het verschil maken - met voorbeelden die je morgen kunt gebruiken.
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[15px] leading-[1.75] text-[#3a3a42]">

            <p>
              De meeste mensen beginnen hun AI-gebruik verkeerd. Ze tikken een vaag verzoek in, krijgen een
              generiek antwoord terug en concluderen dat AI niet zo nuttig is als iedereen beweert. De tool heeft
              hen niet teleurgesteld. Zij hebben de tool niet goed gevraagd.
            </p>

            <p>
              Prompts schrijven is een vaardigheid, net als een goede briefing geven aan een medewerker. Hoe
              specifieker je bent over context, doel en format, hoe bruikbaarder het resultaat. Dit stappenplan
              geeft je een formule die werkt voor de meest voorkomende zakelijke situaties.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Wat is een prompt precies?
            </h2>

            <p>
              Een prompt is simpelweg de instructie die je aan een AI-tool geeft. Alles wat je in het tekstvak
              typt is een prompt. Een slechte prompt is: "schrijf een e-mail". Een goede prompt is zes regels
              lang en beschrijft wie je bent, voor wie je schrijft, wat je wil bereiken en in welke toon.
            </p>

            <p>
              Het verschil in uitkomst is enorm. Niet tien procent beter. Soms het verschil tussen iets wat
              je direct kunt gebruiken en iets wat je nog anderhalf uur moet herschrijven.
            </p>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              De vijf onderdelen van een goede prompt
            </h2>

            <p>
              Gebruik deze structuur als basis. Je hoeft niet altijd alle vijf te gebruiken - maar hoe meer je
              er meeneemt, hoe beter het resultaat.
            </p>

            {[
              {
                step: "1. Rol",
                desc: 'Vertel de AI welke rol hij moet aannemen. "Jij bent een ervaren accountmanager" of "Je bent een juridisch adviseur die schrijft voor niet-juristen" geeft de tool context over het perspectief dat het moet innemen.',
              },
              {
                step: "2. Context",
                desc: "Beschrijf de situatie. Wie is de ontvanger? Wat is de achtergrond? Wat is er al gezegd of gedaan? Hoe meer relevante context, hoe passsender het antwoord.",
              },
              {
                step: "3. Taak",
                desc: "Formuleer wat je precies wil. Niet 'schrijf iets over X' maar 'schrijf een e-mail van maximaal 150 woorden waarin ik X vraag aan Y'.",
              },
              {
                step: "4. Format",
                desc: "Geef aan hoe je het resultaat wil ontvangen. Een opsomming? Een lopende tekst? Drie varianten? Met of zonder onderwerpregel? De tool past zich aan.",
              },
              {
                step: "5. Beperkingen",
                desc: "Wat moet er niet in? Geen jargon? Geen beloftes die je niet kunt nakomen? Geen informele aanspreekvormen? Benoem het expliciet.",
              },
            ].map(({ step, desc }) => (
              <div key={step} className="bg-[#f2f3f5] border border-black/[0.06] p-5">
                <h3 className="text-[15px] font-semibold text-[#1f1f1f] mb-2">{step}</h3>
                <p className="text-sm text-[#575760] leading-relaxed">{desc}</p>
              </div>
            ))}

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Voorbeeld 1: een offerte begeleiden
            </h2>

            <div className="bg-[#1f1f1f] text-white p-5 text-sm leading-relaxed font-mono rounded-none">
              <p className="text-white/50 text-xs mb-3 font-sans font-medium uppercase tracking-widest">Slechte prompt</p>
              <p>"Schrijf een e-mail bij mijn offerte."</p>
            </div>

            <div className="bg-[#f0fdf4] border border-[#22c55e]/30 p-5 text-sm leading-relaxed font-mono">
              <p className="text-[#16a34a] text-xs mb-3 font-sans font-medium uppercase tracking-widest">Goede prompt</p>
              <p className="text-[#1f1f1f]">
                "Jij bent een accountmanager bij een klein IT-bureau in Zuid-Limburg. Schrijf een begeleidende e-mail
                bij een offerte voor website-onderhoud (3.200 euro per jaar) aan een MKB-klant die twijfelt over de
                prijs. De toon is professioneel maar warm. Benoem kort de drie voordelen van het pakket: beschikbaarheid,
                snelheid en zekerheid. Geen technisch jargon. Geen komma-opsommingen. Maximaal 120 woorden.
                Sluit af met een concrete uitnodiging voor een korte call."
              </p>
            </div>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Voorbeeld 2: een klacht beantwoorden
            </h2>

            <div className="bg-[#f0fdf4] border border-[#22c55e]/30 p-5 text-sm leading-relaxed font-mono">
              <p className="text-[#16a34a] text-xs mb-3 font-sans font-medium uppercase tracking-widest">Voorbeeld prompt</p>
              <p className="text-[#1f1f1f]">
                "Jij bent klantenservice medewerker bij een hoveniersbedrijf in Maastricht. Een klant klaagt via
                e-mail dat zijn pas aangelegde terras al na twee weken scheuren vertoont. Hij is boos. Schrijf een
                reactie die: 1) de frustratie erkent zonder schuld toe te geven, 2) aangeeft dat je het gaat
                onderzoeken, 3) een concrete volgende stap benoemt (inspectieafspraak). Geen standaardtekst, geen
                sjabloonzinnen. Maximaal 100 woorden."
              </p>
            </div>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Voorbeeld 3: een vergadering samenvatten
            </h2>

            <div className="bg-[#f0fdf4] border border-[#22c55e]/30 p-5 text-sm leading-relaxed font-mono">
              <p className="text-[#16a34a] text-xs mb-3 font-sans font-medium uppercase tracking-widest">Voorbeeld prompt</p>
              <p className="text-[#1f1f1f]">
                "Hieronder staat een ruwe transcriptie van een teamvergadering. Maak een overzichtelijke samenvatting
                met drie secties: 1) Genomen beslissingen, 2) Openstaande actiepunten (met naam en deadline), 3)
                Vragen die nog beantwoord moeten worden. Gebruik opsomming. Geen intro-paragraaf nodig.
                [plak hier de transcriptie]"
              </p>
            </div>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Veelgemaakte fouten
            </h2>

            <ul className="space-y-3 pl-4">
              {[
                "Te vaag zijn over het doel. Schrijf nooit 'maak iets over X' als je 'schrijf een LinkedIn-post van 80 woorden over X voor een publiek van Y' bedoelt.",
                "Vergeten te vertellen wat er NIET in moet. Als je geen jargon wil, zeg het dan.",
                "Niet specificeren wie de lezer is. Een tekst voor een CFO klinkt anders dan een tekst voor een receptionist.",
                "Alles in een keer willen. Begin met een eenvoudige prompt, bekijk het resultaat en geef daarna gerichte feedback. AI-gesprekken zijn iteratief.",
                "Opgeven na het eerste teleurstellende resultaat. Pas je prompt aan en probeer opnieuw. Na drie pogingen weet je of het werkt.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-red-400 font-bold mt-0.5">x</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-[20px] font-semibold text-[#1f1f1f] pt-4" style={{ letterSpacing: "-0.5px" }}>
              Oefening maakt meester
            </h2>

            <p>
              De beste manier om beter te worden in prompts schrijven is simpelweg doen. Pak een taak die je deze
              week toch moet uitvoeren - een e-mail, een samenvatting, een analyse - en probeer het eerst via een
              AI-tool. Gebruik de formule hierboven. Bekijk wat er uitkomt. Pas aan.
            </p>

            <p>
              Na twee weken dagelijks gebruik ben je merkbaar sneller en weet je precies wat de tool voor je kan
              en wat niet. Dat is de kennis die je daarna niet meer kwijtraakt.
            </p>

          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1f1f1f] text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#22c55e] mb-4">Gratis download</p>
          <h2
            className="text-[22px] font-normal leading-[1.2] tracking-tight mb-4 sm:text-[28px]"
            style={{ letterSpacing: "-0.5px" }}
          >
            10 prompts die je direct kunt
            <br />
            <span className="font-exposure">gebruiken in jouw bedrijf.</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/70 mb-8 max-w-xl">
            De MAISON BLNDR Prompt Starter Kit bevat 10 kant-en-klare prompts voor offertes, e-mails, analyses
            en klantcommunicatie. Gratis te downloaden, direct inzetbaar.
          </p>
          <a
            href="https://maisonblender.com/prompt-starter-kit"
            className="inline-block rounded-full bg-[#22c55e] px-8 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a]"
          >
            Download de Prompt Starter Kit →
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
