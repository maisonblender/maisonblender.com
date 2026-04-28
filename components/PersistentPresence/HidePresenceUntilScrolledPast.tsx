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
 * Implementatie:
 *   - Plain scroll-listener met requestAnimationFrame-throttle. We hadden
 *     IntersectionObserver kunnen gebruiken, maar die fired alleen op
 *     intersection-toggle; we willen continue evaluatie van rect.bottom
 *     zodat de overgang exact bij `bottom === 0` valt. rAF-throttle is
 *     hier idiomatisch en even goedkoop.
 *   - Alleen registreren wanneer `hidden === true`. Wanneer false,
 *     unregistreren we (return value uit useEffect cleanup) zodat de
 *     LIFO-stack in PresenceContext een lagere registratie of de default
 *     kan oppakken — geen "show-corner-br" lock-in.
 */

import { useEffect, useState } from "react";
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

  // Initieel hidden=true: we willen geen flash van de Presence in
  // rechterhoek voordat de scroll-positie geëvalueerd is. Op pagina's
  // waar het target-element niet bestaat, schakelen we direct uit
  // (in het effect hieronder).
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.querySelector(targetSelector);
    if (!el) {
      // Element niet aanwezig (bv. sub-pagina importeert deze component
      // per ongeluk) → geen reden om iets te verbergen.
      setHidden(false);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // Verbergen zolang het element nog (deels) zichtbaar is OF nog
      // helemaal onder de viewport hangt. Pas tonen wanneer de bottom
      // boven de top van de viewport is gepasseerd.
      setHidden(rect.bottom > 0);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetSelector]);

  useEffect(() => {
    if (!ctx || !hidden) return;
    return ctx.registerPosition({
      anchor: { kind: "hidden" },
      size: "sm",
    });
  }, [ctx, hidden]);

  return null;
}
