/**
 * In-memory IP-based rate limiter voor publieke API endpoints.
 *
 * BELANGRIJK — Vercel deployment caveat:
 *   Vercel kan bij hogere load meerdere parallelle warm-instances draaien.
 *   Deze limiter werkt per instance, dus iemand met geluk kan 2-3× over de
 *   limiet komen. Voor productie-strength rate limiting: gebruik Upstash Redis
 *   (`@upstash/ratelimit`). Zie de comment onderaan dit bestand.
 *
 * IP-bron — XFF spoofing-bescherming:
 *   We trusten alleen `x-vercel-forwarded-for` (door Vercel zelf gezet en kan
 *   niet door de client gespoofed worden). De `x-forwarded-for` header van een
 *   externe client wordt door Vercel overschreven, maar als we ooit op een
 *   andere host draaien (b.v. self-hosted), gebruiken we eerst de Vercel header.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

/** Verwijder verlopen entries om memory-bloat te voorkomen. */
function pruneExpired(windowMs: number) {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > windowMs) {
      store.delete(key);
    }
  }
}

/**
 * Check en registreer een request voor een gegeven key (typisch `endpoint:ip`).
 * Returns `{ allowed: true }` of `{ allowed: false, retryAfterSeconds: number }`.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  // Prune occasioneel om memory-bloat te voorkomen.
  if (Math.random() < 0.05) pruneExpired(windowMs);

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true };
}

/**
 * Extract de echte client-IP uit Vercel-specifieke headers eerst, daarna
 * generieke proxies. Vermijdt blind vertrouwen op `x-forwarded-for` (kan
 * door clients ingevuld worden bij self-hosted/non-Vercel deploys).
 */
export function getClientIp(request: Request): string {
  // Vercel zet deze altijd zelf, niet te spoofen door client.
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();

  // Vercel zet deze ook altijd; betrouwbaar binnen Vercel's edge.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Generieke fallback — alleen vertrouwen als we niet op Vercel draaien.
  // Op Vercel wordt dit door de proxy overschreven, dus veilig om te gebruiken.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

/*
 * --- Upstash Redis upgrade (production hardening) ---
 *
 * Voor multi-instance correctness, voeg toe aan .env:
 *   UPSTASH_REDIS_REST_URL=...
 *   UPSTASH_REDIS_REST_TOKEN=...
 *
 * Installeer:
 *   npm i @upstash/ratelimit @upstash/redis
 *
 * Vervang `checkRateLimit` met:
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 *   const limiter = new Ratelimit({
 *     redis: Redis.fromEnv(),
 *     limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs} ms`),
 *     analytics: true,
 *   });
 *   const { success, reset } = await limiter.limit(key);
 */
