/**
 * In-memory IP-based rate limiter for quickscan endpoints.
 * Limits requests per IP within a sliding window.
 *
 * Vercel reuses warm function instances so this provides meaningful protection.
 * For multi-region or high-scale deployments, swap for an Upstash Redis rate limiter.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

/** Remove expired entries to prevent unbounded memory growth. */
function pruneExpired(windowMs: number) {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > windowMs) {
      store.delete(key);
    }
  }
}

/**
 * Check and record a request for a given key (typically `endpoint:ip`).
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterSeconds: number }`.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  // Prune occasionally to avoid memory bloat
  if (Math.random() < 0.05) pruneExpired(windowMs);

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // Fresh window
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

/** Extract the real client IP from Next.js request headers. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
