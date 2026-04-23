// File: lib/kennisbank.ts
// Purpose: Single source of truth voor alle kennisbank-artikelen.
// Wordt gebruikt door app/labs/kennisbank/page.tsx (lijst-pagina) en
// app/sitemap.ts (dynamische sitemap-generatie).
//
// Bij het toevoegen van een nieuw artikel:
//   1. Maak app/labs/kennisbank/<slug>/page.tsx aan
//   2. Voeg een entry toe aan `kennisbankPosts` hieronder
//   3. Sitemap + lijstweergave updaten automatisch

export type KennisbankTag = "Case study" | "Gids" | "How-to" | "Achtergrond";

export interface KennisbankPost {
  slug: string;
  tag: KennisbankTag;
  title: string;
  excerpt: string;
  readTime: string;
  /** ISO 8601 datum van eerste publicatie. */
  datePublished: string;
  /** ISO 8601 datum van laatste content-update. Default = datePublished. */
  dateModified?: string;
}

export const kennisbankPosts: KennisbankPost[] = [
  {
    slug: "sittardse-accountant-8-uur-besparen-ai",
    tag: "Case study",
    title: "Hoe een Sittardse accountant 8 uur per week bespaart met AI",
    excerpt:
      "Een praktisch inkijkje in hoe factuurverwerking volledig geautomatiseerd werd - inclusief de valkuilen en wat het werkelijk kostte.",
    readTime: "6 min",
    datePublished: "2026-04-08",
  },
  {
    slug: "chatgpt-vs-claude-vs-gemini",
    tag: "Gids",
    title: "ChatGPT vs. Claude vs. Gemini: wat kies je als Limburgse ondernemer?",
    excerpt:
      "Geen tech-jargon. Gewoon: welke tool doet wat, voor wie is welke tool geschikt, en wat zijn de echte kosten?",
    readTime: "8 min",
    datePublished: "2026-04-08",
  },
  {
    slug: "eerste-ai-prompt-schrijven",
    tag: "How-to",
    title: "Je eerste AI-prompt schrijven: een stappenplan voor niet-techneuten",
    excerpt:
      "Van blanco pagina naar een prompt die echt werkt. Met voorbeelden voor offertes, e-mails en analyses.",
    readTime: "5 min",
    datePublished: "2026-04-08",
  },
  {
    slug: "ai-maastrichtse-zorginstelling",
    tag: "Case study",
    title: "AI in een Maastrichtse zorginstelling: wat werkt en wat (nog) niet",
    excerpt:
      "Een eerlijk verslag van een pilot met AI-ondersteunde intake - de successen, de compliance-uitdagingen en de lessen.",
    readTime: "7 min",
    datePublished: "2026-04-08",
  },
  {
    slug: "kosten-ai-automatisering-mkb-2026",
    tag: "Achtergrond",
    title: "Wat kost AI automatisering voor een MKB-bedrijf in 2026?",
    excerpt:
      "Een realistische kijk op investering, terugverdientijd en total cost of ownership - op basis van Limburgse praktijkdata.",
    readTime: "6 min",
    datePublished: "2026-04-08",
  },
  {
    slug: "avg-en-ai-automatiseren",
    tag: "Gids",
    title: "AVG en AI: wat mag je automatiseren en wat niet?",
    excerpt:
      "De belangrijkste vragen over privacy, dataverwerking en AI - beantwoord voor MKB-ondernemers zonder juridisch jargon.",
    readTime: "9 min",
    datePublished: "2026-04-08",
  },
];

/** Helper: laatste wijzigingsdatum (dateModified ?? datePublished) als Date. */
export function lastModifiedDate(post: KennisbankPost): Date {
  return new Date(post.dateModified ?? post.datePublished);
}
