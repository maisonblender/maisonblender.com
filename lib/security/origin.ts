/**
 * Origin/Referer-check als CSRF-bescherming voor state-changing API routes.
 *
 * We hebben geen sessions (alle endpoints zijn publiek), dus klassieke CSRF
 * tokens zijn overkill. Een Origin-header check is voldoende om automatische
 * cross-site form-POSTs en simpele scripted abuse te blokkeren.
 *
 * In dev (NODE_ENV !== "production") accepteren we alle origins zodat lokaal
 * testen via curl / Postman blijft werken.
 */

const ALLOWED_HOST_SUFFIXES = [
  "maisonblender.com",
  // Vercel preview deploys zien er uit als <project>-<hash>.vercel.app
  ".vercel.app",
];

const ALLOWED_DEV_HOSTS = ["localhost", "127.0.0.1"];

/**
 * Check of de request van een vertrouwde origin komt.
 * Returns een Response (403) als de check faalt, of `null` als alles ok is.
 */
export function checkOrigin(request: Request): Response | null {
  if (process.env.NODE_ENV !== "production") return null;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Browsers sturen voor same-origin POST altijd Origin mee. Geen Origin én geen
  // Referer = waarschijnlijk een non-browser client (curl etc) — die laten we niet
  // toe op state-changing routes in productie.
  const sourceUrl = origin ?? referer;
  if (!sourceUrl) {
    return Response.json(
      { error: "Origin header verplicht." },
      { status: 403 }
    );
  }

  let host: string;
  try {
    host = new URL(sourceUrl).hostname.toLowerCase();
  } catch {
    return Response.json({ error: "Ongeldige origin." }, { status: 403 });
  }

  const isAllowed =
    ALLOWED_DEV_HOSTS.includes(host) ||
    ALLOWED_HOST_SUFFIXES.some((suffix) =>
      suffix.startsWith(".") ? host.endsWith(suffix) : host === suffix || host.endsWith("." + suffix)
    );

  if (!isAllowed) {
    return Response.json({ error: "Forbidden origin." }, { status: 403 });
  }

  return null;
}
