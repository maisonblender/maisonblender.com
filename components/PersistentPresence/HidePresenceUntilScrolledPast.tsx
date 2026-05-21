"use client";

/**
 * HidePresenceUntilScrolledPast — verbergt de site-wide Liquid Presence
 * zolang de bezoeker een specifiek anker-element nog NIET volledig
 * voorbij is gescrolld. Zodra de onderkant van het element boven de
 * viewport-top is verdwenen, registreert deze component géén anchor meer
 * en valt de Presence terug op haar default-positie (corner).
 */

import { useEffect, useRef, useState } from "react";
import { usePresenceOptional } from "./PresenceContext";

interface Props {
  targetSelector?: string;
}

export default function HidePresenceUntilScrolledPast({
  targetSelector = "#brand-ambassador",
}: Props) {
  const ctx = usePresenceOptional();
  const registerRef = useRef(ctx?.registerPosition);
  registerRef.current = ctx?.registerPosition;

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.querySelector(targetSelector);
    if (!el) {
      setHidden(false);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
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
    if (!hidden) return;
    const register = registerRef.current;
    if (!register) return;
    return register({
      anchor: { kind: "hidden" },
      size: "sm",
    });
  }, [hidden]);

  return null;
}
