/**
 * HTML / header escape helpers — gedeeld door alle routes en client-render.
 *
 * Gebruik:
 *   - `escapeHtml(s)` voor elke string die in HTML attributes of innerHTML belandt.
 *   - `safeInlineMarkdown(s)` voor markdown→HTML conversie van AI- of user-content
 *     waarbij we **bold** / *italic* willen renderen, én waarin bekende interne
 *     paden / externe URL's / e-mailadressen automatisch klikbaar worden.
 *   - `sanitizeHeader(s)` voor email subject / from / to of andere HTTP/SMTP headers,
 *     voorkomt CRLF-injectie.
 */

import { linkifyInlineHtml, restoreLinkTokens } from "./auto-link";

/** Escape HTML special chars zodat geen tags / attributes uitgevoerd worden. */
export function escapeHtml(s: string | undefined | null): string {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Veilige markdown-inline conversie + auto-linking:
 *   1. HTML escapen (alle `<`, `>`, `&`, `"`, `'` worden onschuldig).
 *   2. Linkify: markdown `[tekst](href)`, bare URL's, e-mails en bekende
 *      interne paden → placeholder-tokens + anchor-HTML in aparte array.
 *   3. Markdown bold/italic-substitutie op de restant-tekst (placeholders
 *      zijn opaque voor deze regexes en lopen dus niet kapot).
 *   4. Tokens her-inserteren → definitieve HTML met `<a>`-tags.
 *
 * BELANGRIJK: deze output is veilig om met `dangerouslySetInnerHTML` te renderen.
 *   Anchors krijgen class `mb-prose-link` voor styling; zie globals.css voor
 *   de light/dark varianten.
 */
export function safeInlineMarkdown(text: string | undefined | null): string {
  const escaped = escapeHtml(text).replace(/\u2014/g, "-");
  const { html, tokens } = linkifyInlineHtml(escaped);
  const withMarkdown = html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
  return restoreLinkTokens(withMarkdown, tokens);
}

/**
 * Strip CR/LF en controle-chars zodat user-input niet als header-injectie
 * misbruikt kan worden in email subjects, from-/to-lines of andere headers.
 * Bijvoorbeeld: voorkomt dat `bedrijf="x\nBcc: a@b.c"` extra headers toevoegt
 * in de payload die naar Resend gaat.
 */
export function sanitizeHeader(s: string | undefined | null, maxLen = 200): string {
  if (s === undefined || s === null) return "";
  return String(s)
    // alle controle-chars + CRLF eruit
    .replace(/[\x00-\x1F\x7F]+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/**
 * Strip HTML helemaal uit user-tekst die naar AI-prompts gaat. Voorkomt dat
 * een aanvaller HTML/script tags via prompt-injection door het model laat
 * "echoen" naar de UI. We laten letters/cijfers/leestekens intact.
 */
export function stripForPrompt(s: string | undefined | null, maxLen = 200): string {
  if (s === undefined || s === null) return "";
  return String(s)
    // tags + zelfde controle-chars eruit
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x1F\x7F]+/g, " ")
    // backticks die markdown code-blokken kunnen openen
    .replace(/`{3,}/g, "")
    .trim()
    .slice(0, maxLen);
}
