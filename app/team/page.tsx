import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Team | MAISON BLNDR",
  description:
    "Maak kennis met het team achter MAISON BLNDR - specialisten in AI, automatisering, development, design en strategie.",
  alternates: { canonical: "https://maisonblender.com/team" },
  openGraph: {
    title: "Team | MAISON BLNDR",
    description:
      "Maak kennis met het team achter MAISON BLNDR - specialisten in AI, automatisering, development, design en strategie.",
    url: "https://maisonblender.com/team",
  },
};

type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
};

const team: TeamMember[] = [
  {
    slug: "karl-dreissen",
    name: "Karl Dreissen",
    role: "AI Engineer / Automation Specialist",
    bio: "Karl vormt de brug tussen emotie en technologie. Hij bouwt AI-systemen die menselijke creativiteit versterken zonder de persoonlijke touch te verliezen. Met zijn innovatieve oplossingen maakt hij gepersonaliseerde ervaringen op schaal mogelijk, terwijl hij complexe technologie vertaalt naar praktische toepassingen.",
  },
  {
    slug: "thijs-verhoeven",
    name: "Thijs Verhoeven",
    role: "Brand Strategist & Copywriter",
    bio: "Thijs ontwikkelt merkidentiteiten die blijven hangen in het digitale tijdperk. Als strategisch denker vertaalt hij complexe ideeën naar heldere merkposities. Met zijn copywriting expertise creëert hij verhalen die emotioneel verbinden en campagnes die niet alleen mooi zijn, maar ook werken.",
  },
  {
    slug: "milou-vos",
    name: "Milou Vos",
    role: "Creative Director & Grafisch Ontwerper",
    bio: "Milou geeft richting aan de visuele identiteit van onze klanten met een scherp oog voor detail. Haar analytische aanpak zorgt ervoor dat design niet alleen mooi is, maar ook doeltreffend. Ze vertaalt merkwaarden naar visuele systemen die impact maken over alle touchpoints.",
  },
  {
    slug: "fleur-van-dijk",
    name: "Fleur van Dijk",
    role: "E-commerce Developer",
    bio: "Fleur bouwt digitale winkelervaringen die niet alleen functioneel zijn, maar ook de merkbeleving versterken. Haar expertise in Shopify en headless commerce stelt merken in staat om unieke online ervaringen te creëren. Ze combineert technische kennis met een scherp oog voor design en gebruiksvriendelijkheid.",
  },
  {
    slug: "daan-meijer",
    name: "Daan Meijer",
    role: "SEO-specialist",
    bio: "Daan zorgt ervoor dat merkbeleving samengaat met optimale vindbaarheid in zoekmachines. Zijn methodische aanpak en expertise maken hem de perfecte gids in het SEO-landschap. Met diepgaande kennis van algoritmes en gebruikersintent optimaliseert hij content voor maximale resultaten.",
  },
  {
    slug: "lars-van-dam",
    name: "Lars van Dam",
    role: "Performance Marketeer",
    bio: "Lars is onze datagedreven resultaatjager. Hij zorgt ervoor dat campagnes niet alleen emotioneel verbinden, maar ook meetbare resultaten opleveren door constante testing en optimalisatie. Met zijn analytische mindset vertaalt hij complexe data naar praktische strategieën die zorgen voor maximale ROI.",
  },
  {
    slug: "sanne-jansen",
    name: "Sanne Jansen",
    role: "Social Media Manager",
    bio: "Sanne houdt toezicht op sociale kanalen en community engagement. Met haar energieke persoonlijkheid en culturele bewustzijn weet zij merken authentiek te positioneren op diverse platforms. Ze creëert content die niet alleen engagement genereert, maar ook de unieke merkpersoonlijkheid in elke interactie overbrengt.",
  },
  {
    slug: "eva-martens",
    name: "Eva Martens",
    role: "AI Fotograaf",
    bio: "Eva creëert visuele content met behulp van AI-technologie en haar achtergrond in fotografie. Ze gebruikt AI-tools om unieke beelden te maken die perfect aansluiten bij de emotionele kernwaarden van merken. Haar werk bevindt zich precies op het snijvlak van technologie en artistieke expressie.",
  },
  {
    slug: "niels-de-groot",
    name: "Niels de Groot",
    role: "AI Visueel Specialist",
    bio: "Niels combineert AI-technologie met creatieve visie voor impactvolle foto's en video's. Hij creëert visuele content die merkverhalen tot leven brengt met innovatieve technieken. Zijn expertise in prompt engineering vertaalt concepten naar precieze visuele resultaten die emotioneel verbinden.",
  },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {/* Hero */}
        <section className="relative bg-[#1f1f1f] px-6 py-28 text-white overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 mb-8">
              Team
            </div>
            <h1
              className="text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[42px] lg:text-[52px] mb-6"
              style={{ letterSpacing: "-0.95px" }}
            >
              De mensen achter
              <br />
              <span className="font-exposure">MAISON BLNDR.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg max-w-2xl mx-auto">
              Een multidisciplinair team van specialisten in AI, automatisering,
              development, design en strategie. Geen wisselende consultants -
              dezelfde mensen van eerste gesprek tot beheer.
            </p>
          </div>
        </section>

        {/* Team grid */}
        <section className="px-6 py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-6xl">
            <ul
              role="list"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {team.map((member) => (
                <li
                  key={member.slug}
                  className="flex flex-col border border-black/[0.06] bg-white p-6 transition-shadow hover:shadow-sm"
                >
                  <div
                    aria-hidden="true"
                    className="relative mb-6 aspect-[4/5] w-full overflow-hidden bg-[#f2f3f5]"
                  >
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #1f1f1f 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <span
                        className="font-exposure text-[44px] leading-none text-[#1f1f1f]/70"
                        style={{ letterSpacing: "-0.05em" }}
                      >
                        {initials(member.name)}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-widest text-[#b2b2be]">
                        Foto volgt
                      </span>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-[#1f1f1f]">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-[#575760]">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#575760]">
                    {member.bio}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 bg-[#1f1f1f] text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[26px] mb-4"
              style={{ letterSpacing: "-0.95px" }}
            >
              Benieuwd met wie je
              <br />
              <span className="font-exposure">gaat samenwerken?</span>
            </h2>
            <p className="text-base leading-relaxed text-white/70 mb-8 max-w-xl mx-auto">
              Plan een gratis strategiegesprek van 30 minuten. Je spreekt direct
              iemand uit het team - niet een accountmanager.
            </p>
            <a
              href="/strategiegesprek"
              className="inline-block rounded-full bg-[#22c55e] px-10 py-4 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg"
            >
              Plan een strategiegesprek →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
