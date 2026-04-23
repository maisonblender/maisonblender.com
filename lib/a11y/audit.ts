import {
  RULES,
  CATEGORY_LABELS,
  ruleById,
} from "./rules";
import type {
  AuditFinding,
  AuditReport,
  Category,
  CategoryScore,
  Impact,
  Priority,
  RuleResult,
} from "./types";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_HTML_BYTES = 4_000_000; // 4MB cap
const USER_AGENT =
  "MaisonBlndrA11yAudit/1.0 (+https://maisonblender.com/toegankelijkheidsaudit)";

const IMPACT_WEIGHT: Record<Impact, number> = {
  critical: 12,
  serious: 8,
  moderate: 4,
  minor: 2,
};

const IMPACT_PRIORITY: Record<Impact, Priority> = {
  critical: "P1",
  serious: "P2",
  moderate: "P3",
  minor: "P4",
};

const PRIORITY_ORDER: Record<Priority, number> = { P1: 0, P2: 1, P3: 2, P4: 3 };

// ---------------------------------------------------------------------------
// HTML helpers (regex-based; bewust simpel, geen zware DOM-parser)
// ---------------------------------------------------------------------------

function stripComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

function stripScriptsAndStyles(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

interface ParsedTag {
  tagName: string;
  attrs: Record<string, string>;
  raw: string;
  innerText?: string; // Voor non-void elements
}

const ATTR_RE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'>`=]+)))?/g;

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  // Knip de tagnaam eraf
  const inner = raw.replace(/^<\/?[a-zA-Z][a-zA-Z0-9-]*\s*/, "").replace(/\/?>\s*$/, "");
  let m: RegExpExecArray | null;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(inner)) !== null) {
    const name = m[1].toLowerCase();
    const value = m[3] ?? m[4] ?? m[5] ?? "";
    attrs[name] = value;
  }
  return attrs;
}

function findOpenTags(html: string, tag: string): ParsedTag[] {
  const re = new RegExp(`<${tag}\\b([^>]*)>`, "gi");
  const matches: ParsedTag[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[0];
    matches.push({ tagName: tag.toLowerCase(), attrs: parseAttrs(raw), raw });
  }
  return matches;
}

function findVoidTags(html: string, tag: string): ParsedTag[] {
  const re = new RegExp(`<${tag}\\b([^>]*)\\/?>`, "gi");
  const matches: ParsedTag[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    matches.push({ tagName: tag.toLowerCase(), attrs: parseAttrs(m[0]), raw: m[0] });
  }
  return matches;
}

function findElementsWithContent(html: string, tag: string): ParsedTag[] {
  const re = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const matches: ParsedTag[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[0];
    matches.push({
      tagName: tag.toLowerCase(),
      attrs: parseAttrs(`<${tag}${m[1]}>`),
      innerText: m[2],
      raw,
    });
  }
  return matches;
}

function textContent(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function snippet(s: string, max = 140): string {
  const trimmed = s.replace(/\s+/g, " ").trim();
  return trimmed.length > max ? trimmed.slice(0, max - 1) + "…" : trimmed;
}

// ---------------------------------------------------------------------------
// Regel-uitvoering
// ---------------------------------------------------------------------------

interface RuleContext {
  rawHtml: string;
  cleanHtml: string; // zonder scripts/styles/comments
  bodyHtml: string;
}

function buildContext(rawHtml: string): RuleContext {
  const noComments = stripComments(rawHtml);
  const cleanHtml = stripScriptsAndStyles(noComments);
  const bodyMatch = cleanHtml.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : cleanHtml;
  return { rawHtml, cleanHtml, bodyHtml };
}

function runRule(ruleId: string, ctx: RuleContext): RuleResult {
  const def = ruleById(ruleId)!;
  switch (ruleId) {
    case "html-lang":
      return checkHtmlLang(ctx, def.impact);
    case "document-title":
      return checkDocumentTitle(ctx, def.impact);
    case "viewport-meta":
      return checkViewportMeta(ctx, def.impact);
    case "image-alt":
      return checkImageAlt(ctx, def.impact);
    case "form-label":
      return checkFormLabels(ctx, def.impact);
    case "link-name":
      return checkLinkName(ctx, def.impact);
    case "button-name":
      return checkButtonName(ctx, def.impact);
    case "iframe-title":
      return checkIframeTitle(ctx, def.impact);
    case "heading-order":
      return checkHeadingOrder(ctx, def.impact);
    case "landmarks":
      return checkLandmarks(ctx, def.impact);
    case "skip-link":
      return checkSkipLink(ctx, def.impact);
    case "doctype-html5":
      return checkDoctype(ctx, def.impact);
    case "duplicate-ids":
      return checkDuplicateIds(ctx, def.impact);
    default:
      return {
        ruleId,
        status: "not-applicable",
        count: 0,
        examples: [],
        impact: def.impact,
      };
  }
}

function pass(ruleId: string, impact: Impact): RuleResult {
  return { ruleId, status: "pass", count: 0, examples: [], impact };
}

function fail(
  ruleId: string,
  impact: Impact,
  count: number,
  examples: string[],
  fixHint?: string
): RuleResult {
  return {
    ruleId,
    status: "fail",
    count,
    examples: examples.slice(0, 3),
    impact,
    fixHint,
  };
}

// --- Individuele regelchecks ------------------------------------------------

function checkHtmlLang(ctx: RuleContext, impact: Impact): RuleResult {
  const m = ctx.rawHtml.match(/<html\b([^>]*)>/i);
  if (!m) return fail("html-lang", impact, 1, ["<html>-element niet gevonden"]);
  const attrs = parseAttrs(m[0]);
  const lang = attrs["lang"]?.trim();
  if (!lang) return fail("html-lang", impact, 1, [snippet(m[0])]);
  if (!/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(lang)) {
    return fail("html-lang", impact, 1, [snippet(m[0])], `Lang-waarde "${lang}" lijkt geen geldige BCP47-tag.`);
  }
  return pass("html-lang", impact);
}

function checkDocumentTitle(ctx: RuleContext, impact: Impact): RuleResult {
  const m = ctx.cleanHtml.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return fail("document-title", impact, 1, ["<title> niet gevonden"]);
  const text = textContent(m[1]);
  if (!text) return fail("document-title", impact, 1, [snippet(m[0])], "Title is leeg.");
  if (text.length < 4)
    return fail("document-title", "moderate", 1, [snippet(m[0])], `Title "${text}" is erg kort.`);
  return pass("document-title", impact);
}

function checkViewportMeta(ctx: RuleContext, impact: Impact): RuleResult {
  const metas = findVoidTags(ctx.cleanHtml, "meta");
  const viewport = metas.find((m) => (m.attrs["name"] ?? "").toLowerCase() === "viewport");
  if (!viewport) {
    return fail("viewport-meta", "moderate", 1, ["<meta name=\"viewport\"> ontbreekt"]);
  }
  const content = (viewport.attrs["content"] ?? "").toLowerCase();
  const issues: string[] = [];
  if (/user-scalable\s*=\s*(no|0)/.test(content)) {
    issues.push("user-scalable=no");
  }
  const maxScaleMatch = content.match(/maximum-scale\s*=\s*([0-9.]+)/);
  if (maxScaleMatch && parseFloat(maxScaleMatch[1]) < 2) {
    issues.push(`maximum-scale=${maxScaleMatch[1]}`);
  }
  if (issues.length) {
    return fail("viewport-meta", impact, issues.length, [snippet(viewport.raw)], `Blokkeert zoomen: ${issues.join(", ")}.`);
  }
  return pass("viewport-meta", impact);
}

function checkImageAlt(ctx: RuleContext, impact: Impact): RuleResult {
  const imgs = findVoidTags(ctx.bodyHtml, "img");
  const failing = imgs.filter((img) => {
    if (img.attrs["role"] === "presentation" || img.attrs["aria-hidden"] === "true") return false;
    return !("alt" in img.attrs);
  });
  if (!imgs.length) return { ruleId: "image-alt", status: "not-applicable", count: 0, examples: [], impact };
  if (!failing.length) return pass("image-alt", impact);
  return fail(
    "image-alt",
    impact,
    failing.length,
    failing.map((f) => snippet(f.raw))
  );
}

function checkFormLabels(ctx: RuleContext, impact: Impact): RuleResult {
  // Verzamel alle labels met for=
  const labels = findElementsWithContent(ctx.bodyHtml, "label");
  const labelFor = new Set<string>();
  for (const l of labels) {
    if (l.attrs["for"]) labelFor.add(l.attrs["for"]);
  }

  const inputs = findVoidTags(ctx.bodyHtml, "input");
  const selects = findElementsWithContent(ctx.bodyHtml, "select");
  const textareas = findElementsWithContent(ctx.bodyHtml, "textarea");

  const candidates: ParsedTag[] = [
    ...inputs.filter((i) => {
      const t = (i.attrs["type"] ?? "text").toLowerCase();
      return !["hidden", "submit", "button", "reset", "image"].includes(t);
    }),
    ...selects,
    ...textareas,
  ];

  if (!candidates.length)
    return { ruleId: "form-label", status: "not-applicable", count: 0, examples: [], impact };

  const failing = candidates.filter((el) => {
    if (el.attrs["aria-label"]?.trim()) return false;
    if (el.attrs["aria-labelledby"]?.trim()) return false;
    if (el.attrs["title"]?.trim()) return false;
    const id = el.attrs["id"];
    if (id && labelFor.has(id)) return false;
    return true;
  });

  if (!failing.length) return pass("form-label", impact);
  return fail(
    "form-label",
    impact,
    failing.length,
    failing.map((f) => snippet(f.raw))
  );
}

function checkLinkName(ctx: RuleContext, impact: Impact): RuleResult {
  const links = findElementsWithContent(ctx.bodyHtml, "a");
  if (!links.length)
    return { ruleId: "link-name", status: "not-applicable", count: 0, examples: [], impact };

  const failing = links.filter((a) => {
    if (a.attrs["aria-label"]?.trim()) return false;
    if (a.attrs["aria-labelledby"]?.trim()) return false;
    if (a.attrs["title"]?.trim()) return false;
    const text = textContent(a.innerText ?? "");
    if (text.length > 0) return false;
    // Check img alt binnen link
    const innerImgs = findVoidTags(a.innerText ?? "", "img");
    if (innerImgs.some((img) => (img.attrs["alt"] ?? "").trim().length > 0)) return false;
    // svg met title
    if (/<title\b[^>]*>[^<]+<\/title>/i.test(a.innerText ?? "")) return false;
    return true;
  });

  if (!failing.length) return pass("link-name", impact);
  return fail(
    "link-name",
    impact,
    failing.length,
    failing.map((f) => snippet(f.raw))
  );
}

function checkButtonName(ctx: RuleContext, impact: Impact): RuleResult {
  const buttons = findElementsWithContent(ctx.bodyHtml, "button");
  // Ook input type=submit/button/reset met value="" check
  const inputs = findVoidTags(ctx.bodyHtml, "input").filter((i) => {
    const t = (i.attrs["type"] ?? "").toLowerCase();
    return ["submit", "button", "reset"].includes(t);
  });

  if (!buttons.length && !inputs.length)
    return { ruleId: "button-name", status: "not-applicable", count: 0, examples: [], impact };

  const failingButtons = buttons.filter((b) => {
    if (b.attrs["aria-label"]?.trim()) return false;
    if (b.attrs["aria-labelledby"]?.trim()) return false;
    if (b.attrs["title"]?.trim()) return false;
    const text = textContent(b.innerText ?? "");
    if (text.length > 0) return false;
    const innerImgs = findVoidTags(b.innerText ?? "", "img");
    if (innerImgs.some((img) => (img.attrs["alt"] ?? "").trim().length > 0)) return false;
    return true;
  });

  const failingInputs = inputs.filter((i) => {
    if (i.attrs["aria-label"]?.trim()) return false;
    if (i.attrs["value"]?.trim()) return false;
    return true;
  });

  const all = [...failingButtons, ...failingInputs];
  if (!all.length) return pass("button-name", impact);
  return fail(
    "button-name",
    impact,
    all.length,
    all.map((f) => snippet(f.raw))
  );
}

function checkIframeTitle(ctx: RuleContext, impact: Impact): RuleResult {
  const iframes = findOpenTags(ctx.bodyHtml, "iframe");
  if (!iframes.length)
    return { ruleId: "iframe-title", status: "not-applicable", count: 0, examples: [], impact };
  const failing = iframes.filter((f) => {
    if (f.attrs["aria-hidden"] === "true") return false;
    if (f.attrs["title"]?.trim()) return false;
    if (f.attrs["aria-label"]?.trim()) return false;
    return true;
  });
  if (!failing.length) return pass("iframe-title", impact);
  return fail(
    "iframe-title",
    impact,
    failing.length,
    failing.map((f) => snippet(f.raw))
  );
}

function checkHeadingOrder(ctx: RuleContext, impact: Impact): RuleResult {
  const re = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings: { level: number; text: string; raw: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(ctx.bodyHtml)) !== null) {
    headings.push({
      level: parseInt(m[1].slice(1), 10),
      text: textContent(m[2]),
      raw: m[0],
    });
  }
  if (!headings.length)
    return fail("heading-order", impact, 1, ["Geen headings (h1-h6) gevonden in <body>"], "Voeg een <h1> toe en structureer de pagina met h2/h3/...");

  const issues: string[] = [];
  const examples: string[] = [];
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    issues.push("Geen <h1>");
    examples.push("Eerste heading: " + snippet(headings[0].raw));
  } else if (h1s.length > 1) {
    issues.push(`${h1s.length} <h1>'s`);
  }

  // Check skipped levels
  let prev = 0;
  for (const h of headings) {
    if (prev !== 0 && h.level > prev + 1) {
      issues.push(`niveau-sprong h${prev}→h${h.level}`);
      if (examples.length < 3) examples.push(snippet(h.raw));
    }
    prev = h.level;
  }

  if (!issues.length) return pass("heading-order", impact);
  return fail("heading-order", impact, issues.length, examples, issues.join("; "));
}

function checkLandmarks(ctx: RuleContext, impact: Impact): RuleResult {
  const hasMain = /<main\b/i.test(ctx.bodyHtml) || /role\s*=\s*['"]main['"]/i.test(ctx.bodyHtml);
  if (hasMain) return pass("landmarks", impact);
  return fail("landmarks", impact, 1, ["Geen <main> of role=\"main\" gevonden"]);
}

function checkSkipLink(ctx: RuleContext, impact: Impact): RuleResult {
  // Zoek de eerste <a href="#..."> in de body
  const firstLinkMatch = ctx.bodyHtml.match(
    /<a\b[^>]*href\s*=\s*["']#[^"']+["'][^>]*>([\s\S]*?)<\/a>/i
  );
  if (firstLinkMatch) {
    const text = textContent(firstLinkMatch[1]).toLowerCase();
    // Heuristiek: "skip", "naar inhoud", "ga naar inhoud", "spring", "main content"
    if (/(skip|naar (de )?(inhoud|hoofdinhoud)|ga naar inhoud|spring|main content|skip to)/i.test(text)) {
      return pass("skip-link", impact);
    }
  }
  return fail("skip-link", impact, 1, ["Geen herkenbare skip-link gevonden vóór de hoofdinhoud"]);
}

function checkDoctype(ctx: RuleContext, impact: Impact): RuleResult {
  const head = ctx.rawHtml.slice(0, 500).trim().toLowerCase();
  if (head.startsWith("<!doctype html>") || head.startsWith("<!doctype html ")) {
    return pass("doctype-html5", impact);
  }
  return fail("doctype-html5", impact, 1, [snippet(ctx.rawHtml.slice(0, 80))]);
}

function checkDuplicateIds(ctx: RuleContext, impact: Impact): RuleResult {
  const re = /\sid\s*=\s*["']([^"']+)["']/gi;
  const counts = new Map<string, number>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(ctx.bodyHtml)) !== null) {
    const id = m[1].trim();
    if (!id) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const dupes = [...counts.entries()].filter(([, n]) => n > 1);
  if (!dupes.length)
    return counts.size === 0
      ? { ruleId: "duplicate-ids", status: "not-applicable", count: 0, examples: [], impact }
      : pass("duplicate-ids", impact);
  return fail(
    "duplicate-ids",
    impact,
    dupes.length,
    dupes.slice(0, 3).map(([id, n]) => `id="${id}" komt ${n}× voor`)
  );
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function computeCategoryScores(findings: AuditFinding[]): CategoryScore[] {
  const groups = new Map<Category, AuditFinding[]>();
  for (const f of findings) {
    const arr = groups.get(f.rule.category) ?? [];
    arr.push(f);
    groups.set(f.rule.category, arr);
  }
  const out: CategoryScore[] = [];
  for (const [category, items] of groups.entries()) {
    const passed = items.filter((i) => i.result.status === "pass").length;
    const failed = items.filter((i) => i.result.status === "fail").length;
    const notApplicable = items.filter((i) => i.result.status === "not-applicable").length;
    const applicable = passed + failed;
    let penalty = 0;
    for (const i of items) {
      if (i.result.status === "fail") {
        penalty += IMPACT_WEIGHT[i.result.impact] * Math.min(i.result.count, 5);
      }
    }
    const base = applicable === 0 ? 100 : (passed / applicable) * 100;
    const score = clampScore(base - penalty);
    out.push({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      score,
      passed,
      failed,
      notApplicable,
    });
  }
  // Stabiele volgorde
  const order: Category[] = ["perceivable", "operable", "understandable", "robust"];
  out.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
  return out;
}

function computeOverallScore(findings: AuditFinding[]): number {
  // Start op 100, trek per failing rule (impact * min(count, 5)) af.
  let score = 100;
  for (const f of findings) {
    if (f.result.status === "fail") {
      score -= IMPACT_WEIGHT[f.result.impact] * Math.min(f.result.count, 5);
    }
  }
  return clampScore(score);
}

function computeConformance(score: number): AuditReport["conformance"] {
  if (score >= 95) return "conformant";
  if (score >= 80) return "substantial";
  if (score >= 55) return "partial";
  return "non-conformant";
}

// ---------------------------------------------------------------------------
// Public: runAudit
// ---------------------------------------------------------------------------

export class AuditError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url) throw new AuditError(400, "Voer een URL in.");
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AuditError(400, "Ongeldige URL.");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new AuditError(400, "Alleen http(s)-URLs worden ondersteund.");
  }
  // Veiligheid: geen interne IP-bereiken / loopbacks
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    throw new AuditError(400, "Interne of lokale adressen worden niet ondersteund.");
  }
  return parsed.toString();
}

async function fetchHtml(url: string): Promise<{ html: string; finalUrl: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "nl,en;q=0.8",
      },
      redirect: "follow",
      signal: ctrl.signal,
    });
    if (!res.ok) {
      throw new AuditError(
        502,
        `De URL gaf een ${res.status} ${res.statusText || ""} terug. Controleer of de pagina publiek bereikbaar is.`
      );
    }
    const ct = res.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(ct)) {
      throw new AuditError(
        415,
        `De URL serveert geen HTML (content-type: ${ct || "onbekend"}).`
      );
    }
    const reader = res.body?.getReader();
    if (!reader) {
      const text = await res.text();
      return { html: text.slice(0, MAX_HTML_BYTES), finalUrl: res.url };
    }
    let received = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        received += value.byteLength;
        chunks.push(value);
        if (received > MAX_HTML_BYTES) {
          await reader.cancel().catch(() => {});
          break;
        }
      }
    }
    const buf = new Uint8Array(received);
    let offset = 0;
    for (const c of chunks) {
      buf.set(c, offset);
      offset += c.byteLength;
    }
    const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    return { html, finalUrl: res.url };
  } catch (err) {
    if (err instanceof AuditError) throw err;
    if ((err as Error)?.name === "AbortError") {
      throw new AuditError(504, "De pagina reageerde niet binnen 12 seconden.");
    }
    throw new AuditError(502, `Kon de pagina niet ophalen: ${(err as Error).message}`);
  } finally {
    clearTimeout(timer);
  }
}

function extractMeta(rawHtml: string): AuditReport["pageMeta"] {
  const titleMatch = rawHtml.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const langMatch = rawHtml.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i);
  const charsetMatch =
    rawHtml.match(/<meta\b[^>]*\bcharset\s*=\s*["']?([\w-]+)["']?/i) ||
    rawHtml.match(/content\s*=\s*["'][^"']*charset=([\w-]+)/i);
  return {
    title: titleMatch ? textContent(titleMatch[1]) || null : null,
    lang: langMatch ? langMatch[1] : null,
    charset: charsetMatch ? charsetMatch[1] : null,
    htmlBytes: rawHtml.length,
  };
}

export async function runAudit(rawUrl: string): Promise<AuditReport> {
  const start = Date.now();
  const url = normalizeUrl(rawUrl);
  const { html, finalUrl } = await fetchHtml(url);
  const ctx = buildContext(html);

  const findings: AuditFinding[] = RULES.map((rule) => {
    const result = runRule(rule.id, ctx);
    return {
      rule,
      result,
      priority: IMPACT_PRIORITY[result.impact],
    };
  });

  // Sorteer findings: failing eerst, op prioriteit, daarna op count desc
  findings.sort((a, b) => {
    const aFail = a.result.status === "fail" ? 0 : 1;
    const bFail = b.result.status === "fail" ? 0 : 1;
    if (aFail !== bFail) return aFail - bFail;
    if (a.result.status === "fail" && b.result.status === "fail") {
      const pri = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pri !== 0) return pri;
      return b.result.count - a.result.count;
    }
    return 0;
  });

  const passed = findings.filter((f) => f.result.status === "pass").length;
  const failed = findings.filter((f) => f.result.status === "fail").length;
  const notApplicable = findings.filter((f) => f.result.status === "not-applicable").length;

  const issuesByImpact: Record<Impact, number> = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };
  for (const f of findings) {
    if (f.result.status === "fail") {
      issuesByImpact[f.result.impact] += f.result.count;
    }
  }

  const score = computeOverallScore(findings);

  return {
    url,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    durationMs: Date.now() - start,
    score,
    conformance: computeConformance(score),
    stats: {
      totalRules: findings.length,
      passed,
      failed,
      notApplicable,
      issuesByImpact,
    },
    categoryScores: computeCategoryScores(findings),
    findings,
    pageMeta: extractMeta(html),
    disclaimer:
      "Dit is een geautomatiseerde statische audit. Een statische scan vangt veel structurele WCAG 2.1 AA-signalen, " +
      "maar kan geen oordeel vellen over zaken die menselijke beoordeling vereisen — zoals de betekenisvolheid van " +
      "alt-teksten, de logische focusvolgorde, kleurcontrast in dynamische states of de begrijpelijkheid van content. " +
      "Een volledige WCAG/EN 301 549-conformiteitsverklaring vereist aanvullend handmatig en gebruikersonderzoek.",
  };
}
