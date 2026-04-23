// Types voor de toegankelijkheidsaudit (WCAG 2.1 AA + EN 301 549).

export interface AuditLead {
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  email: string;
  telefoon?: string;
  toestemming: boolean;
}

export type Impact = "critical" | "serious" | "moderate" | "minor";

export type Priority = "P1" | "P2" | "P3" | "P4";

export type Category =
  | "perceivable"
  | "operable"
  | "understandable"
  | "robust";

/** Statische definitie van een regel (zonder runtime data). */
export interface RuleDefinition {
  id: string;
  title: string;
  description: string;
  category: Category;
  /** WCAG 2.1 success criterion (bijv. "1.1.1") + niveau. */
  wcag: { sc: string; name: string; level: "A" | "AA" | "AAA" };
  /** EN 301 549 v3.2.1 clausule (bijv. "9.1.1.1"). */
  en301549: string;
  /** Standaard impact wanneer de regel faalt. */
  impact: Impact;
  /** Korte fix-aanwijzing (algemeen). */
  fix: string;
}

/** Resultaat van één regel-check op een specifieke pagina. */
export interface RuleResult {
  ruleId: string;
  /** "pass" wanneer geen issues, "fail" wanneer issues, "not-applicable" wanneer niet van toepassing. */
  status: "pass" | "fail" | "not-applicable";
  /** Aantal voorkomens van dit issue. */
  count: number;
  /** Maximaal 3 concrete voorbeelden uit de HTML (snippets). */
  examples: string[];
  /** Specifieke fix-aanwijzing voor deze pagina (kan algemener zijn). */
  fixHint?: string;
  /** Berekende impact (kan afwijken van default). */
  impact: Impact;
}

export interface CategoryScore {
  category: Category;
  label: string;
  score: number; // 0-100
  passed: number;
  failed: number;
  notApplicable: number;
}

export interface AuditFinding {
  rule: RuleDefinition;
  result: RuleResult;
  priority: Priority;
}

export interface AuditReport {
  url: string;
  finalUrl: string;
  fetchedAt: string; // ISO timestamp
  durationMs: number;
  /** Compliance-score 0-100 (gewogen). */
  score: number;
  /** Conformance-label op basis van score. */
  conformance: "non-conformant" | "partial" | "substantial" | "conformant";
  /** Stats. */
  stats: {
    totalRules: number;
    passed: number;
    failed: number;
    notApplicable: number;
    issuesByImpact: Record<Impact, number>;
  };
  categoryScores: CategoryScore[];
  findings: AuditFinding[];
  /** Algemene metadata uit de pagina. */
  pageMeta: {
    title: string | null;
    lang: string | null;
    charset: string | null;
    htmlBytes: number;
  };
  /** Vrijwaring/notitie voor menselijke beoordeling. */
  disclaimer: string;
}
