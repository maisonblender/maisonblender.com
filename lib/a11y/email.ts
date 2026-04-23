/**
 * E-mail-bevestiging met audit-samenvatting via Resend.
 *
 * Setup:
 *   - RESEND_API_KEY in .env.local
 *   - From-domein moet geverifieerd zijn in Resend
 */

import type { AuditLead, AuditReport, Impact } from "./types";
import { escapeHtml, sanitizeHeader } from "@/lib/security/escape";

const FROM = "MAISON BLNDR <website@maisonblender.com>";
const REPLY_TO = "info@maisonblender.com";
const INTERN_TO = "info@maisonblender.com";

const IMPACT_LABEL: Record<Impact, string> = {
  critical: "Kritiek",
  serious: "Hoog",
  moderate: "Middel",
  minor: "Laag",
};

const CONFORMANCE_LABEL: Record<AuditReport["conformance"], string> = {
  "non-conformant": "Niet-conformant",
  partial: "Gedeeltelijk conform",
  substantial: "Grotendeels conform",
  conformant: "Conform (indicatief)",
};

function scoreColor(score: number): string {
  if (score >= 90) return "#059669";
  if (score >= 75) return "#65a30d";
  if (score >= 55) return "#d97706";
  if (score >= 35) return "#ea580c";
  return "#e11d48";
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function buildHtml(lead: AuditLead, report: AuditReport): string {
  const failing = report.findings.filter((f) => f.result.status === "fail");
  const top = failing.slice(0, 8);
  const totalIssues = Object.values(report.stats.issuesByImpact).reduce((a, b) => a + b, 0);

  const findingRows = top
    .map((f) => {
      const impactColor =
        f.result.impact === "critical"
          ? "#e11d48"
          : f.result.impact === "serious"
            ? "#ea580c"
            : f.result.impact === "moderate"
              ? "#d97706"
              : "#64748b";
      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #eee;vertical-align:top;width:48px;">
            <span style="display:inline-block;background:#1f1f1f;color:#fff;font-size:11px;font-weight:600;padding:4px 8px;border-radius:4px;font-family:Menlo,Consolas,monospace;">${f.priority}</span>
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #eee;vertical-align:top;">
            <div style="font-size:14px;font-weight:600;color:#1f1f1f;">${escapeHtml(f.rule.title)}</div>
            <div style="font-size:12px;color:#575760;margin-top:4px;line-height:1.5;">${escapeHtml(f.rule.description)}</div>
            <div style="margin-top:8px;font-size:11px;color:#575760;font-family:Menlo,Consolas,monospace;">
              WCAG ${escapeHtml(f.rule.wcag.sc)} (${f.rule.wcag.level}) · EN 301 549 §${escapeHtml(f.rule.en301549)}
            </div>
            <div style="margin-top:10px;font-size:13px;color:#1f1f1f;background:#f2f3f5;border-left:3px solid #059669;padding:8px 12px;line-height:1.5;">
              <strong style="font-size:11px;color:#059669;text-transform:uppercase;letter-spacing:0.5px;">Fix</strong><br/>
              ${escapeHtml(f.result.fixHint || f.rule.fix)}
            </div>
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #eee;vertical-align:top;text-align:right;white-space:nowrap;">
            <span style="display:inline-block;color:${impactColor};border:1px solid ${impactColor};font-size:11px;padding:2px 8px;border-radius:4px;font-family:Menlo,Consolas,monospace;text-transform:uppercase;">
              ${IMPACT_LABEL[f.result.impact]}
            </span>
            <div style="font-size:12px;color:#575760;margin-top:6px;font-family:Menlo,Consolas,monospace;">${f.result.count}× gevonden</div>
          </td>
        </tr>`;
    })
    .join("");

  const moreCount = failing.length - top.length;
  const restRow = moreCount > 0
    ? `<tr><td colspan="3" style="padding:14px 16px;background:#f8f8fa;text-align:center;font-size:13px;color:#575760;">+ nog ${moreCount} bevinding${moreCount === 1 ? "" : "en"} in het volledige dashboard.</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f2f3f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f1f1f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f3f5;">
    <tr><td align="center" style="padding:32px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 32px 16px 32px;">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#b2b2be;font-family:Menlo,Consolas,monospace;">// Toegankelijkheidsaudit</p>
          <h1 style="margin:0;font-size:24px;line-height:1.2;letter-spacing:-0.5px;color:#1f1f1f;font-weight:500;">
            Hoi ${escapeHtml(lead.voornaam)}, hier is je audit-rapport.
          </h1>
        </td></tr>

        <tr><td style="padding:0 32px 24px 32px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#575760;">
            We hebben <a href="${escapeHtml(report.finalUrl)}" style="color:#1f1f1f;text-decoration:underline;">${escapeHtml(report.finalUrl)}</a>
            getoetst tegen <strong style="color:#1f1f1f;">WCAG 2.1 AA</strong> en <strong style="color:#1f1f1f;">EN 301 549 v3.2.1</strong>.
            Hieronder vind je de samenvatting; het volledige interactieve dashboard is online beschikbaar.
          </p>
        </td></tr>

        <tr><td style="padding:0 32px 24px 32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(0,0,0,0.06);">
            <tr>
              <td style="padding:24px;border-right:1px solid rgba(0,0,0,0.06);width:50%;vertical-align:top;">
                <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#b2b2be;font-family:Menlo,Consolas,monospace;">Compliance-score</p>
                <p style="margin:0;font-size:48px;font-weight:500;line-height:1;letter-spacing:-1.5px;color:${scoreColor(report.score)};">
                  ${report.score}<span style="font-size:14px;color:#b2b2be;font-weight:400;letter-spacing:0;"> / 100</span>
                </p>
                <p style="margin:12px 0 0;font-size:12px;color:#575760;text-transform:uppercase;letter-spacing:1px;">${CONFORMANCE_LABEL[report.conformance]}</p>
              </td>
              <td style="padding:24px;width:50%;vertical-align:top;">
                <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#b2b2be;font-family:Menlo,Consolas,monospace;">Stats</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;color:#575760;">
                  <tr><td style="padding:2px 0;">Geslaagd</td><td style="padding:2px 0;text-align:right;color:#059669;font-weight:600;">${report.stats.passed}</td></tr>
                  <tr><td style="padding:2px 0;">Gefaald</td><td style="padding:2px 0;text-align:right;color:#e11d48;font-weight:600;">${report.stats.failed}</td></tr>
                  <tr><td style="padding:2px 0;">Niet van toepassing</td><td style="padding:2px 0;text-align:right;color:#575760;font-weight:600;">${report.stats.notApplicable}</td></tr>
                  <tr><td style="padding:6px 0 0;border-top:1px solid #f2f3f5;font-weight:600;color:#1f1f1f;">Totaal issues</td><td style="padding:6px 0 0;text-align:right;border-top:1px solid #f2f3f5;font-weight:600;color:#1f1f1f;">${totalIssues}</td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td></tr>

        ${
          failing.length > 0
            ? `
        <tr><td style="padding:0 32px 8px 32px;">
          <p style="margin:24px 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#b2b2be;font-family:Menlo,Consolas,monospace;">// Prioriteitenlijst</p>
          <h2 style="margin:0 0 16px;font-size:18px;color:#1f1f1f;font-weight:500;letter-spacing:-0.3px;">Top fixes, gerangschikt op prioriteit</h2>
        </td></tr>
        <tr><td style="padding:0 32px 24px 32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(0,0,0,0.06);">
            ${findingRows}
            ${restRow}
          </table>
        </td></tr>
            `
            : `
        <tr><td style="padding:0 32px 24px 32px;">
          <div style="background:#ecfdf5;border-left:3px solid #059669;padding:16px 20px;font-size:14px;color:#1f1f1f;">
            Geen automatisch detecteerbare WCAG 2.1 AA-issues gevonden. Tof werk!
            Aanvullende handmatige toetsing blijft nodig voor een volledig oordeel.
          </div>
        </td></tr>
            `
        }

        <tr><td style="padding:0 32px 28px 32px;">
          <div style="background:#fef3c7;border-left:3px solid #d97706;padding:16px 20px;font-size:13px;color:#3a3a42;line-height:1.6;">
            <strong style="display:block;margin-bottom:6px;color:#92400e;">Wat deze audit niet kan zien</strong>
            ${escapeHtml(report.disclaimer)}
          </div>
        </td></tr>

        <tr><td style="padding:0 32px 32px 32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1f1f1f;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);font-family:Menlo,Consolas,monospace;">// Volledige audit?</p>
              <p style="margin:0 0 12px;font-size:15px;color:#ffffff;line-height:1.5;">
                Wij combineren deze automatische scan met handmatig en gebruikersonderzoek tot een formele toegankelijkheidsverklaring.
              </p>
              <a href="https://maisonblender.com/strategiegesprek" style="display:inline-block;background:#ffffff;color:#1f1f1f;font-size:13px;font-weight:600;text-decoration:none;padding:10px 20px;border-radius:999px;">Plan een gesprek →</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 32px 32px 32px;border-top:1px solid rgba(0,0,0,0.06);padding-top:20px;">
          <p style="margin:0;font-size:11px;color:#b2b2be;line-height:1.6;">
            Verzonden op ${escapeHtml(new Date(report.fetchedAt).toLocaleString("nl-NL"))} door MAISON BLNDR · Burgemeester Coonenplein 37, 6141 BZ Sittard ·
            <a href="https://maisonblender.com/privacybeleid" style="color:#575760;">Privacybeleid</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildPlainText(lead: AuditLead, report: AuditReport): string {
  const failing = report.findings.filter((f) => f.result.status === "fail");
  const lines: string[] = [];
  lines.push(`Hoi ${lead.voornaam},`);
  lines.push("");
  lines.push(`Hier is je toegankelijkheidsaudit voor ${report.finalUrl}.`);
  lines.push("");
  lines.push(`Compliance-score: ${report.score}/100 — ${CONFORMANCE_LABEL[report.conformance]}`);
  lines.push(`Stats: ${report.stats.passed} pass · ${report.stats.failed} fail · ${report.stats.notApplicable} n.v.t.`);
  lines.push("");
  if (failing.length === 0) {
    lines.push("Geen automatisch detecteerbare WCAG 2.1 AA-issues gevonden.");
  } else {
    lines.push("Prioriteitenlijst:");
    failing.slice(0, 10).forEach((f, i) => {
      lines.push(
        `  ${i + 1}. [${f.priority} · ${IMPACT_LABEL[f.result.impact]}] ${f.rule.title} (${f.result.count}×)`
      );
      lines.push(`     WCAG ${f.rule.wcag.sc} ${f.rule.wcag.name} (${f.rule.wcag.level}) · EN 301 549 §${f.rule.en301549}`);
      lines.push(`     Fix: ${f.result.fixHint || f.rule.fix}`);
      lines.push("");
    });
    if (failing.length > 10) {
      lines.push(`  + nog ${failing.length - 10} bevindingen in het volledige dashboard.`);
    }
  }
  lines.push("");
  lines.push("---");
  lines.push("Disclaimer:");
  lines.push(report.disclaimer);
  lines.push("");
  lines.push("Vragen of een volledige handmatige audit nodig?");
  lines.push("Plan een gesprek: https://maisonblender.com/strategiegesprek");
  lines.push("");
  lines.push("MAISON BLNDR · Burgemeester Coonenplein 37, 6141 BZ Sittard");
  return lines.join("\n");
}

async function sendResend(payload: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[a11y/email] Resend fail:", res.status, err.slice(0, 300));
    return false;
  }
  return true;
}

/** Stuur de audit-samenvatting naar de lead. */
export async function sendAuditEmailToLead(
  lead: AuditLead,
  report: AuditReport
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[a11y/email] RESEND_API_KEY ontbreekt — e-mail naar lead overgeslagen.");
    return false;
  }
  const subject = sanitizeHeader(
    `Toegankelijkheidsaudit voor ${safeHost(report.finalUrl)} · score ${report.score}/100`,
    180
  );
  return sendResend({
    from: FROM,
    to: [lead.email],
    reply_to: REPLY_TO,
    subject,
    html: buildHtml(lead, report),
    text: buildPlainText(lead, report),
  });
}

/** Interne notificatie naar info@. */
export async function sendInternalLeadNotification(
  lead: AuditLead,
  report: AuditReport
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  const failing = report.findings.filter((f) => f.result.status === "fail");
  const top3 = failing
    .slice(0, 3)
    .map((f) => `- ${f.priority} · ${IMPACT_LABEL[f.result.impact]} · ${f.rule.title} (${f.result.count}×)`)
    .join("\n");

  const text = `Nieuwe toegankelijkheidsaudit-lead via maisonblender.com

URL: ${report.finalUrl}
Score: ${report.score}/100 — ${CONFORMANCE_LABEL[report.conformance]}

Lead:
- Naam: ${lead.voornaam} ${lead.achternaam}
- Bedrijf: ${lead.bedrijf}
- E-mail: ${lead.email}
- Telefoon: ${lead.telefoon || "—"}

Top issues:
${top3 || "(geen failing issues)"}

Volledig rapport in Twenty (note bij person + company).`;

  return sendResend({
    from: FROM,
    to: [INTERN_TO],
    reply_to: lead.email,
    subject: sanitizeHeader(
      `Nieuwe a11y-audit lead: ${lead.bedrijf} (score ${report.score})`,
      180
    ),
    text,
  });
}
