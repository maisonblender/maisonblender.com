"use client";

/**
 * HidePresenceUntilScrolledPast — verbergt de site-wide Liquid Presence
 * zolang de bezoeker een specifiek anker-element nog NIET volledig
 * voorbij is gescrolld. Zodra de onderkant van het element boven de
 * viewport-top is verdwenen, registreert deze component géén anchor meer
 * en valt de Presence terug op haar default-positie (corner).
 *
 * Use-case (homepage): de BrandAmbassadorSection toont al een lokale
 * Liquid Presence canvas. Twee tegelijk = visuele ruis. Met deze gate:
 *   - Hero / sectoren / tot en met de ambassador-sectie zelf → geen
 *     site-wide Presence (anchor: hidden).
 *   - Process / About / Testimonials / FAQ / Contact → Presence verschijnt
 *     rechtsonder en blijft beschikbaar.
 *   - Scrollt user terug omhoog naar de ambassador-sectie → Presence
 *     verbergt weer (consistente UX, geen "duplicate-presence" moment).
 *
 * useLayoutEffect registreert hidden vóór paint, zodat de default
 * corner-launcher niet kortstondig SSR/hydrateert boven klikbare content.
 */

import { useLayoutEffect } from "react";
import { usePresenceOptional } from "./PresenceContext";

interface Props {
  /**
   * CSS-selector van het anker-element. Default `#brand-ambassador`.
   * Kies een element dat een vaste id heeft op de pagina; refs werken niet
   * omdat deze component standalone mount kan worden vanuit een
   * server-component (zoals app/page.tsx).
   */
  targetSelector?: string;
}

export default function HidePresenceUntilScrolledPast({
  targetSelector = "#brand-ambassador",
}: Props) {
  const ctx = usePresenceOptional();

  useLayoutEffect(() => {
    if (!ctx) return;
    if (typeof window === "undefined") return;

    const el = document.querySelector(targetSelector);
    if (!el) return;

    let unregister: (() => void) | undefined;
    let raf = 0;

    const sync = () => {
      const rect = el.getBoundingClientRect();
      const shouldHide = rect.bottom > 0;

      if (shouldHide && !unregister) {
        unregister = ctx.registerPosition({
          anchor: { kind: "hidden" },
          size: "sm",
        });
      } else if (!shouldHide && unregister) {
        unregister();
        unregister = undefined;
      }
    };

    sync();

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      unregister?.();
    };
  }, [ctx, targetSelector]);

  return null;
}
