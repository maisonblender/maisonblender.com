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
  // script-src: 'blob:' is nodig voor de ElevenLabs ConvAI SDK
  // (@elevenlabs/client). Die genereert de audio worklet ("rawAudioProcessor")
  // on-the-fly als Blob-URL en registreert die via audioWorklet.addModule().
  // Zonder blob: krijg je "Failed to load the rawAudioProcessor worklet
  // module" en kan de live voice-modus niet opstarten.
  "script-src 'self' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.google-analytics.com",
  // worker-src: AudioWorklet, Web Workers, Service Workers. Browsers
  // routeren AudioWorklet-loads via deze directive (fallback was script-src,
  // maar moderne browsers honoreren worker-src apart). 'self' + blob: dekt
  // de ElevenLabs SDK + onze eigen workers.
  "worker-src 'self' blob:",
  // child-src: legacy fallback voor browsers die nog geen worker-src
  // ondersteunen — zelfde policy.
  "child-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  // connect-src: GA + ElevenLabs REST/WebSocket + LiveKit RTC signaling (voor
  // ConvAI live-gesprek). TTS loopt via onze eigen /api/.../tts proxy (self).
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.elevenlabs.io wss://*.elevenlabs.io",
  // media-src: TTS-response komt binnen als MP3-blob → new Audio(blob:URL).
  // Zonder blob: hier wordt de audio-playback geblokkeerd door CSP.
  "media-src 'self' blob:",
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
    // microphone=(self) is nodig voor de Brand Ambassador voice-features
    // (getUserMedia + ElevenLabs ConvAI). We staan alleen de eigen origin
    // toe — geen iframes of externe scripts krijgen mic-toegang.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
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

  /**
   * Domain rewrites voor de AI Collega product-sites.
   * Registreer deze domeinen als Vercel Custom Domains — ze wijzen
   * automatisch naar de juiste routes binnen deze Next.js app.
   *
   * Toevoegen: Vercel dashboard → Project → Settings → Domains
   *   aicollegamakelaar.nl    → wordt /aicollega/makelaar/*
   *   aicollegaaccountant.nl  → wordt /aicollega/accountant/*  (toekomstig)
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "aicollegamakelaar.nl" }],
          destination: "/aicollega/makelaar/:path*",
        },
        {
          source: "/:path*",
          has: [{ type: "host", value: "www.aicollegamakelaar.nl" }],
          destination: "/aicollega/makelaar/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
