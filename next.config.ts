import type { NextConfig } from "next";

/**
 * Globale security headers voor alle responses.
 *
 * CSP-keuzes verklaard:
 *   - 'unsafe-inline' voor script-src is helaas nodig zolang we Next.js'
 *     bootstrap-snippets en de JSON-LD <script type="application/ld+json">
 *     gebruiken. We mitigeren dit met:
 *       1. escape van AI/user-content vóór dangerouslySetInnerHTML
 *          (lib/security/escape.ts)
 *       2. frame-ancestors 'none' om clickjacking te blokkeren
 *   - 'unsafe-inline' voor style-src is nodig voor Tailwind's runtime utilities
 *     en framer-motion's inline styles.
 *   - Google Tag Manager / Analytics worden alleen toegestaan als
 *     NEXT_PUBLIC_GA_MEASUREMENT_ID gezet is — anders strikter.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: csp },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
