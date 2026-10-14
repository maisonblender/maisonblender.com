/**
 * Gedeelde afhandeling van een website-aanvraag: lead in Twenty zetten en
 * interne mail naar info@ sturen (parallel). Pas als minstens één van beide
 * gelukt is, krijgt de bezoeker een bevestigingsmail en mag de route "ok"
 * teruggeven.
 */

import { pushWebsiteLead, type WebsiteLead } from "./crm";
import { sendInternalLeadNotification, sendLeadConfirmation } from "./email";

export interface LeadSubmission {
  lead: WebsiteLead;
  mailSubject: string;
  mailText: string;
}

export interface LeadSubmissionResult {
  stored: boolean;
  crm: boolean;
  mail: boolean;
}

export async function verwerkLead({ lead, mailSubject, mailText }: LeadSubmission): Promise<LeadSubmissionResult> {
  const [crmStatus, mail] = await Promise.all([
    pushWebsiteLead(lead),
    sendInternalLeadNotification({ subject: mailSubject, text: mailText, replyTo: lead.email }),
  ]);
  const crm = crmStatus === "ok";
  const stored = crm || mail;

  if (!stored) {
    console.error(
      `[leads] ${lead.bron}-aanvraag van ${lead.email} NIET opgeslagen (crm=${crmStatus}, mail=${mail ? "ok" : "mislukt"})`
    );
    return { stored, crm, mail };
  }

  if (!crm) console.warn(`[leads] ${lead.bron}-aanvraag alleen per mail binnengekomen (crm=${crmStatus})`);
  if (!mail) console.warn(`[leads] ${lead.bron}-aanvraag alleen in CRM opgeslagen (interne mail mislukt)`);

  const bevestigd = await sendLeadConfirmation({ bron: lead.bron, naam: lead.naam, email: lead.email });
  if (!bevestigd) console.warn(`[leads] Bevestigingsmail naar ${lead.email} niet verstuurd`);

  return { stored, crm, mail };
}
