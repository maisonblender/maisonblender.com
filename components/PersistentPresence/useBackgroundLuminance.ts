"use client";

/**
 * useBackgroundLuminance — sampled periodiek de achtergrondkleur onder
 * een punt op het scherm, en classificeert "light" vs "dark" zodat de
 * Liquid Presence zich live adapteert aan de pagina-sectie waar hij
 * bovenop zit.
 *
 * Aanpak:
 *   - Gebruik document.elementsFromPoint() om de stapel DOM-elementen op
 *     (x, y) te vinden; loop door tot een element met een niet-transparante
 *     background-color komt.
 *   - Parse de kleur (rgb/rgba) en bereken relatieve luminance (gewoon
 *     gewogen gemiddelde — goed genoeg voor light/dark beslissing).
 *   - Her-sample on-scroll, on-resize én elke `interval` ms als fallback
 *     (voor pagina's met gradient-backgrounds of dynamische elementen).
 *
 * Hysterese:
 *   We switchen niet op één sample. Een switch vereist dat 2 achtereenvolgende
 *   samples dezelfde nieuwe staat rapporteren, anders oscilleert de UI op
 *   border-gradients. Dit voelt aangenamer dan abrupt flashen.
 *
 * Hit-testing:
 *   Zet `data-presence-ignore` of pointer-events:none op elementen die niet
 *   meetellen (bv. de launcher zelf). Anders zou elementFromPoint de launcher
 *   terugkrijgen en z'n eigen halo als "background" zien.
 *
 * Performance:
 *   - Throttled via requestAnimationFrame + rAF-level debounce op scroll
 *   - Default interval 1500ms is ruim voldoende voor static pages
 *   - Hook doet niets als enabled=false (bv. tijdens fullscreen modal)
 */

import { useEffect, useState } from "react";

const LIGHT_THRESHOLD = 0.6; // 0..1, > betekent "lichte achtergrond"

export type Luminance = "light" | "dark";

function parseColor(color: string): [number, number, number] | null {
  // rgb(R, G, B) / rgba(R, G, B, A) / rgb(R G B) / rgb(R G B / A)
  const match = color.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,\/]+([\d.]+))?\s*\)/
  );
  if (!match) return null;
  const r = parseFloat(match[1]);
  const g = parseFloat(match[2]);
  const b = parseFloat(match[3]);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
  if (a < 0.1) return null; // te transparant → negeer
  return [r, g, b];
}

/** Perceptual luminance (ITU-R BT.601) — simpel en snel. */
function rgbLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Loop door de DOM-stack op (x, y) en vind het eerste element met
 * een niet-transparante background-color. Als niks gevonden: return
 * document.body's color.
 */
function sampleAt(x: number, y: number): Luminance {
  if (typeof document === "undefined") return "dark";
  // elementsFromPoint faalt als (x,y) buiten viewport — clamp eerst
  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = Math.max(2, Math.min(W - 2, x));
  const cy = Math.max(2, Math.min(H - 2, y));

  let stack: Element[] = [];
  try {
    stack = document.elementsFromPoint(cx, cy);
  } catch {
    return "dark";
  }

  for (const el of stack) {
    // Sla elementen over die zichzelf flaggen als "niet meetellen"
    if ((el as HTMLElement).dataset?.presenceIgnore !== undefined) continue;
    // Sla ook de launcher-wrapper zelf over (extra safety-net)
    if (el.closest("[data-presence-ignore]")) continue;

    const bg = getComputedStyle(el).backgroundColor;
    const rgb = parseColor(bg);
    if (!rgb) continue;
    return rgbLuminance(rgb[0], rgb[1], rgb[2]) > LIGHT_THRESHOLD
      ? "light"
      : "dark";
  }

  // Fallback op body
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const rgb = parseColor(bodyBg);
  if (rgb) {
    return rgbLuminance(rgb[0], rgb[1], rgb[2]) > LIGHT_THRESHOLD
      ? "light"
      : "dark";
  }
  // Ultieme fallback: aanname "light" (want site heeft overwegend witte
  // content-vlakken; safer voor contrast als we 't niet weten)
  return "light";
}

interface Opts {
  /** Uitgeschakelde hook samplet niet en retourneert laatst bekende waarde. */
  enabled?: boolean;
  /** Resample-interval in ms (fallback naast scroll/resize). Default 1500. */
  intervalMs?: number;
  /** Initiele waarde voordat de eerste sample plaatsvindt. */
  initial?: Luminance;
}

/**
 * Samplet periodiek de achtergrondluminance op het gegeven schermpunt.
 * Geeft live "light" of "dark" terug.
 */
export function useBackgroundLuminance(
  getPoint: () => { x: number; y: number } | null,
  opts: Opts = {}
): Luminance {
  const { enabled = true, intervalMs = 1500, initial = "dark" } = opts;
  const [luminance, setLuminance] = useState<Luminance>(initial);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let lastSample: Luminance = initial;
    let pendingSwitchTo: Luminance | null = null;

    const doSample = () => {
      rafId = null;
      const pt = getPoint();
      if (!pt) return;
      const sampled = sampleAt(pt.x, pt.y);

      // Hysterese: vereis 2 consecutive samples voordat we switchen.
      if (sampled === lastSample) {
        pendingSwitchTo = null;
        if (sampled !== luminance) setLuminance(sampled);
        return;
      }
      if (pendingSwitchTo === sampled) {
        lastSample = sampled;
        pendingSwitchTo = null;
        setLuminance(sampled);
      } else {
        pendingSwitchTo = sampled;
      }
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(doSample);
    };

    schedule();
    intervalId = setInterval(schedule, intervalMs);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, intervalMs, getPoint]);

  return luminance;
}
