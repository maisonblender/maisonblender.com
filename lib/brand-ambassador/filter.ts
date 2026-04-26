/**
 * Brand Ambassador hardening — pre-LLM filter.
 *
 * Doel: voorkom dat onze Anthropic tokens opgaan aan:
 *  1. Prompt-injection / jailbreak pogingen
 *  2. Off-topic requests (code generation, gedichten, algemene AI-hulp, etc.)
 *
 * Strategie: pattern-match server-side VOOR we de call naar Claude doen.
 * Bij een match geven we een deterministisch, vriendelijk redirect-antwoord
 * terug via dezelfde SSE-shape als een normale chat-response. De UI merkt
 * geen verschil, wij betalen geen tokens.
 *
 * Tuning philosophy: false negatives (laten door) zijn acceptabel — de
 * system prompt vangt dat alsnog. False positives (ten onrechte blokkeren)
 * zijn erger, want die frustreren een echte prospect. Patronen zijn daarom
 * bewust specifiek.
 */

export type FilterResult =
  | { allowed: true }
  | { allowed: false; reason: "injection" | "offtopic"; reply: string };

const INJECTION_PATTERNS: RegExp[] = [
  /\bignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)\b/i,
  /\bdisregard\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)\b/i,
  /\bforget\s+(everything|all|what)\b.{0,40}\b(you.{0,10}(were|are)\s+told|instructions?|prompt)\b/i,

  /\byou\s+are\s+now\s+(?!an?\s+ambassador|the\s+ambassador|maison|blndr)/i,
  /\bfrom\s+now\s+on\s+you\s+(are|will|must)\b/i,
  /\bact\s+as\s+(if\s+)?(a|an|the)\s+(?!brand\s+ambassador|ambassador)/i,
  /\bpretend\s+(to\s+be|you\s+are|you're)\b/i,
  /\broleplay\s+as\b/i,
  /\bsimulate\s+(being|a|an)\b/i,

  /\b(show|reveal|print|output|repeat|display|tell\s+me)\s+(me\s+)?(your|the)\s+(system\s+prompt|initial\s+prompt|instructions|rules|guidelines)\b/i,
  /\bwhat\s+(is|are)\s+your\s+(system\s+prompt|initial\s+instructions|rules)\b/i,
  /\bwhat\s+were\s+you\s+(told|instructed|programmed)\b/i,

  /\b(DAN|jailbreak|developer\s+mode|god\s+mode)\b/i,
  /\bdo\s+anything\s+now\b/i,

  /^\s*system\s*:/im,
  /<\|\s*(system|im_start|im_end)\s*\|>/i,

  /\b(developer|admin|root|sudo)\s+(mode|override|access|command)\b/i,
];

const OFFTOPIC_PATTERNS: Array<{ re: RegExp; topic: string }> = [
  {
    re: /\b(schrijf|geef|maak|write|generate|create)\s+(me\s+|mij\s+|een\s+|a\s+|an\s+)?(gedicht|poem|haiku|sonnet|limerick|lied|song|verhaal|story|essay|novel|roman|grap|joke)\b/i,
    topic: "creatief schrijfwerk",
  },
  {
    re: /\b(schrijf|geef|maak|write|generate|build|code)\s+(me\s+|mij\s+|een\s+|a\s+|an\s+)?(python|javascript|typescript|php|ruby|go|rust|java|html|css|sql|react|vue|angular|node)\s+(script|function|class|component|programma|program|app|code)\b/i,
    topic: "code generation",
  },
  {
    re: /\b(los\s+op|solve|bereken|calculate|compute)\s+.{0,60}\b(wiskunde|math|integraal|integral|derivative|afgeleide|vergelijking|equation)\b/i,
    topic: "wiskundige berekeningen",
  },
  {
    re: /\b(vertaal|translate)\s+.{1,200}\b(naar|to|into|in)\s+(frans|french|duits|german|spaans|spanish|italiaans|italian|japans|japanese|chinees|chinese|russisch|russian|arabisch|arabic|portugees|portuguese)\b/i,
    topic: "vertalingen",
  },
  {
    re: /\b(wie\s+is|who\s+is|tell\s+me\s+about|wat\s+weet\s+je\s+over)\s+(trump|biden|putin|xi\s+jinping|zelensky|netanyahu|rutte|wilders|timmermans)\b/i,
    topic: "politiek / publieke figuren",
  },
  {
    re: /\b(recept|recipe|how\s+to\s+cook|hoe\s+maak\s+ik)\s+.{0,40}\b(pasta|pizza|soep|soup|taart|cake|brood|bread|kip|chicken)\b/i,
    topic: "recepten",
  },
  {
    re: /\b(wat\s+is\s+het\s+weer|how.{0,10}weather|weersverwachting|weather\s+forecast)\b/i,
    topic: "weer",
  },
  {
    re: /\b(speel|play|let'?s\s+play)\s+.{0,30}\b(schaak|chess|dammen|checkers|tic.?tac.?toe|hangman|galgje|20\s+questions)\b/i,
    topic: "spelletjes",
  },
];

function redirectReply(topic: string): string {
  return (
    `Ik ben de Brand Ambassador van MAISON BLNDR — ik kan je niet helpen met ${topic}, ` +
    `maar wél met alles rond AI-automatisering, onze AI-op-Maat Sessies, onze Brand ` +
    `Ambassador zelf, tarieven, en hoe we werken. Waar zou ik je mee op weg kunnen helpen?`
  );
}

const INJECTION_REPLY =
  "Ik focus me graag op MAISON BLNDR. Vertel me liever iets over je bedrijf of " +
  "stel een vraag over onze AI-Sessies, Brand Ambassador, of aanpak — daar help ik je echt vooruit.";

/**
 * Filter alleen het laatste user-bericht. Eerdere berichten zijn al door
 * de loop heen en kunnen niet opnieuw schade doen. Bovendien willen we
 * assistant-berichten nooit filteren (dat is de Ambassador zelf).
 */
export function filterUserMessage(content: string): FilterResult {
  const trimmed = content.trim();
  if (!trimmed) return { allowed: true };

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, reason: "injection", reply: INJECTION_REPLY };
    }
  }

  for (const { re, topic } of OFFTOPIC_PATTERNS) {
    if (re.test(trimmed)) {
      return { allowed: false, reason: "offtopic", reply: redirectReply(topic) };
    }
  }

  return { allowed: true };
}
