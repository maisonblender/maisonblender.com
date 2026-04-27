/**
 * Auto-linking voor AI-gegenereerde chat-output.
 *
 * Waarom deze laag bestaat:
 *   De AI schrijft in natuurlijke taal en noemt vaak routes als `/quickscan`
 *   of `/strategiegesprek`. Zonder auto-linking zijn dat platte tekst-strings
 *   — conversie-dood. Deze helper zet bekende paden, externe URL's,
 *   e-mailadressen en [markdown](links) om in klikbare `<a>`-tags.
 *
 * Security-contract:
 *   Deze functie neemt ALTIJD al-escapete HTML als input (output van
 *   `escapeHtml()`). Daardoor zijn `<`, `>`, `&`, `"`, `'` al onschuldig.
 *   Wij bouwen alleen de anchor-tags en valideren het href-schema via
 *   `isSafeUrl()` om `javascript:` / `data:` / `vbscript:` injecties af
 *   te vangen.
 *
 * Volgorde van matching (strikt, met placeholder-tokenisatie zodat
 * eerdere matches niet opnieuw door latere regexes of markdown-substitutie
 * lopen):
 *   1. Markdown `[tekst](href)`   — meest specifiek, AI kan eigen label kiezen
 *   2. Bare `https?://…`           — externe URL's
 *   3. Bare `e-mail@adres.tld`     — mailto-links
 *   4. Bare interne paden          — whitelist-gefilterd, geen false positives
 *
 * Token-delimiters: we gebruiken U+001F (Unit Separator) — een controle-char
 * die nooit legitiem in AI-output voorkomt en niet door escapeHtml aangeraakt
 * wordt. Elke match wordt vervangen door `\u001FMB_LINK_${i}\u001F`; de
 * caller krijgt de tokens-array mee en kan na markdown-substitutie
 * `restoreLinkTokens()` aanroepen.
 */

/**
 * Whitelist van interne paden die als klikbare links gerenderd mogen worden.
 * Bewust strikt: we willen GEEN false positives (bv. "3/4 weken" dat
 * toevallig als path wordt geïnterpreteerd). Alles wat niet in deze set
 * staat blijft platte tekst.
 *
 * Exact gesynced met `app/`-routes per 2026-04-27. Als er nieuwe routes
 * bijkomen die relevant zijn voor de brand-ambassador conversatie, voeg
 * ze hier toe.
 */
export const INTERNAL_PATHS: ReadonlySet<string> = new Set([
  "/quickscan",
  "/quickscan/scan",
  "/quickscan/resultaten",
  "/strategiegesprek",
  "/brand-ambassador",
  "/sessies",
  "/diensten",
  "/labs",
  "/labs/kennisbank",
  "/labs/nieuwsbrief",
  "/labs/prompt-starter-kit",
  "/labs/tools-vergelijker",
  "/labs/webinar",
  "/team",
  "/eu-ai-act",
  "/privacybeleid",
  "/toegankelijkheidsaudit",
  "/toegankelijkheidsverklaring",
]);

/** Blokkeer gevaarlijke schemas. Alleen http(s), mailto, tel en relatieve paths. */
function isSafeUrl(href: string): boolean {
  const lower = href.toLowerCase().trim();
  if (lower.startsWith("javascript:")) return false;
  if (lower.startsWith("data:")) return false;
  if (lower.startsWith("vbscript:")) return false;
  if (lower.startsWith("file:")) return false;
  return true;
}

/**
 * Bouw een anchor-tag. href en text worden ingestoken in HTML-context; wij
 * gaan er vanuit dat beide al via escapeHtml() zijn gegaan door de caller.
 * Externe http(s)-links krijgen target="_blank" + rel="noopener noreferrer"
 * behalve als ze naar maisonblender.com zelf wijzen.
 */
function buildAnchor(href: string, text: string): string {
  if (!isSafeUrl(href)) return text;
  const isHttp = /^https?:\/\//i.test(href);
  const isOwnDomain = /^https?:\/\/(www\.)?maisonblender\.com/i.test(href);
  const shouldOpenNewTab = isHttp && !isOwnDomain;
  const targetAttrs = shouldOpenNewTab
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";
  return `<a href="${href}" class="mb-prose-link"${targetAttrs}>${text}</a>`;
}

export interface LinkifyResult {
  /** HTML met placeholder-tokens waar anchor-tags moeten komen. */
  html: string;
  /** Anchor-HTML per token-index. Herstel met restoreLinkTokens(). */
  tokens: string[];
}

/**
 * Converteer klikbare patronen in al-escapete inline-HTML naar placeholder-tokens.
 *
 * Input: HTML waarin alle `<`, `>`, `&`, `"`, `'` al zijn geëscaped.
 * Output: { html, tokens } — html bevat `\u001FMB_LINK_N\u001F` placeholders
 *         op de plekken waar anchors moeten komen; tokens[N] bevat de
 *         anchor-HTML. Roep `restoreLinkTokens(html, tokens)` aan na
 *         eventuele markdown-bold/italic-substitutie.
 */
export function linkifyInlineHtml(input: string): LinkifyResult {
  const tokens: string[] = [];
  const tokenize = (html: string): string => {
    const i = tokens.length;
    tokens.push(html);
    return `\u001FMB_LINK_${i}\u001F`;
  };

  let html = input;

  // 1. Markdown-style [tekst](href) — href kan /pad, https://, mailto: of tel: zijn
  html = html.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:|\/)[^\s)]+)\)/g,
    (_m, linkText: string, href: string) => tokenize(buildAnchor(href, linkText))
  );

  // 2. Bare https?:// URLs — greedy match tot whitespace/haakje, daarna
  //    trailing punctuation trimmen zodat "…bezoek https://x.com." netjes
  //    eindigt en de "." buiten de link valt.
  html = html.replace(/(https?:\/\/[^\s<)]+)/gi, (match: string) => {
    const trailMatch = match.match(/[.,;:!?]+$/);
    let url = match;
    let trailing = "";
    if (trailMatch) {
      trailing = trailMatch[0];
      url = match.slice(0, -trailing.length);
    }
    if (!url) return match;
    return tokenize(buildAnchor(url, url)) + trailing;
  });

  // 3. Bare e-mailadressen
  html = html.replace(
    /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
    (_m, email: string) => tokenize(buildAnchor(`mailto:${email}`, email))
  );

  // 4. Whitelist interne paden. Match alleen na woord-begin (start, whitespace,
  //    of openingshaakje) zodat "€3.000/€8.000" en "3/4 weken" niet getroffen
  //    worden. Lookahead eist dat het pad eindigt op whitespace,
  //    zin-einde-punctuation, of string-einde.
  html = html.replace(
    /(^|[\s(])((?:\/[a-z0-9][a-z0-9-]*)+)(?=[\s.,;:!?)]|$)/gi,
    (match: string, pre: string, path: string) => {
      const normalized = path.toLowerCase();
      if (!INTERNAL_PATHS.has(normalized)) return match;
      return `${pre}${tokenize(buildAnchor(normalized, path))}`;
    }
  );

  return { html, tokens };
}

/** Her-insert getokenized anchor-HTML. Aanroepen ná markdown-substitutie. */
export function restoreLinkTokens(input: string, tokens: readonly string[]): string {
  return input.replace(/\u001FMB_LINK_(\d+)\u001F/g, (_m, idx: string) => {
    const i = Number(idx);
    return tokens[i] ?? "";
  });
}
