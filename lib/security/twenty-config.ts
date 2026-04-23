/**
 * Centrale validatie van Twenty CRM credentials.
 *
 * Twenty API keys zijn JWT tokens (beginnen met "eyJ", typisch 200+ chars).
 * Een korte string is meestal de workspace ID i.p.v. de API key — die zou stille
 * 401's veroorzaken bij elke CRM call. We failen daarom hard zodat
 * misconfiguratie meteen zichtbaar is i.p.v. silent gedrag.
 */

export interface TwentyConfig {
  baseUrl: string;
  apiKey: string;
}

export type TwentyConfigResult =
  | { ok: true; config: TwentyConfig }
  | { ok: false; reason: "missing-env" | "invalid-key" | "invalid-url"; message: string };

function normaliseerBaseUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, "");
  if (url.includes("://")) {
    const scheme = url.split("://")[0].toLowerCase();
    if (scheme !== "http" && scheme !== "https") {
      url = "https://" + url.split("://").slice(1).join("://");
    }
  } else {
    url = `https://${url}`;
  }
  return url;
}

export function loadTwentyConfig(): TwentyConfigResult {
  const rawBaseUrl = process.env.TWENTY_BASE_URL;
  const apiKey = process.env.TWENTY_API_KEY;

  if (!rawBaseUrl || !apiKey) {
    return {
      ok: false,
      reason: "missing-env",
      message: "TWENTY_BASE_URL of TWENTY_API_KEY ontbreekt",
    };
  }

  if (!apiKey.startsWith("eyJ") || apiKey.length < 100) {
    return {
      ok: false,
      reason: "invalid-key",
      message: `TWENTY_API_KEY heeft geen JWT-format (verwacht 'eyJ...' van 200+ chars, kreeg ${apiKey.length} chars). Mogelijk gebruik je workspace-id i.p.v. de API key. Genereer een nieuwe key in Twenty: Settings → API & Webhooks → API Keys.`,
    };
  }

  let baseUrl: string;
  try {
    baseUrl = normaliseerBaseUrl(rawBaseUrl);
    new URL(baseUrl);
  } catch {
    return {
      ok: false,
      reason: "invalid-url",
      message: `TWENTY_BASE_URL is geen geldige URL: ${rawBaseUrl}`,
    };
  }

  return { ok: true, config: { baseUrl, apiKey } };
}
