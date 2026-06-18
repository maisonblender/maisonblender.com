"use client";

/**
 * AmbassadorPresence — de Liquid Presence canvas-entiteit.
 *
 * Dit is de visuele handtekening van de Brand Ambassador. Geen avatar,
 * geen initialen, geen robot-icoon: een vloeibare GLAS-ORB in Siri-stijl die
 * ademt, luistert, denkt en spreekt. Een glazen bol met meerdere kleurige
 * licht-blobs die additief door het glas zwerven, sphere-shading, een
 * glas-reflectie bovenaan en een buitenste bloom.
 *
 * States:
 *   - idle       : langzaam pulseren, zachte beweging
 *   - listening  : trilt mee met audio-amplitude (via optionele audioLevel prop)
 *   - thinking   : snellere, complexere morfologie (terwijl AI tokens genereert)
 *   - responding : uitdijende vloeibare motion (terwijl tekst naar user streamt)
 *
 * Implementatie: pure Canvas 2D + requestAnimationFrame. Geen three.js, geen
 * WebGL — omdat we willen dat dit op elke device werkt inclusief mobile én
 * batterij-zuinig blijft. Respect voor prefers-reduced-motion (statische orb).
 *
 * Kleur wordt bepaald door de `palette` prop (multi-color glas). Default =
 * MAISON BLNDR "Aurora Nocturne". Tijdens "Imagine-This-Is-Yours" geeft de
 * widget een uit de merk-hue afgeleide palette mee (zie `paletteFromHue`).
 */

import { useEffect, useRef } from "react";

export type PresenceState = "idle" | "listening" | "thinking" | "responding";

type RGB = [number, number, number];

export interface PresencePalette {
  /** Vloeibare licht-blobs die door het glas zwerven (additief geblend). */
  blobs: RGB[];
  /** Buitenste bloom/halo rond de orb. */
  glow: RGB;
  /** Glas-rand reflectie (lichte highlight bovenaan). */
  rim: RGB;
}

/**
 * MAISON BLNDR signature — "Aurora Nocturne".
 * Indigo → violet → magenta met een cyaan accent. Premium, glasachtig,
 * Siri-esque. Bewust géén mintgroen.
 */
export const MAISON_PRESENCE_PALETTE: PresencePalette = {
  blobs: [
    [79, 70, 229], // indigo  #4F46E5
    [139, 92, 246], // violet  #8B5CF6
    [236, 72, 153], // magenta #EC4899
    [34, 211, 238], // cyaan   #22D3EE
  ],
  glow: [124, 58, 237], // #7C3AED
  rim: [199, 210, 254], // #C7D2FE
};

/** UI-accent hue (HSL) voor chat-elementen die kleur-matchen met de orb. */
export const MAISON_PRESENCE_HUE = 270;

export type Props = {
  state: PresenceState;
  /**
   * Multi-color glas-palette voor de orb. Default = MAISON BLNDR
   * "Aurora Nocturne". De widget geeft tijdens "Imagine-This-Is-Yours" een
   * uit de merk-hue afgeleide palette mee.
   */
  palette?: PresencePalette;
  /** Optionele audio-amplitude (0-1) voor listening state. */
  audioLevel?: number;
  /** Grootte in pixels (canvas is vierkant). */
  size?: number;
  /** Extra className om in de layout te passen. */
  className?: string;
  /**
   * Behouden voor backward-compat met bestaande call-sites. De glas-orb is
   * volledig palette-gedreven; `hue` en `contrastMode` beïnvloeden de
   * rendering niet meer (de orb is identiek op donkere én lichte pagina's).
   */
  hue?: number;
  contrastMode?: "dark" | "light" | "lightAccent";
};

/** Bewegingsprofiel per blob in de glas-orb. Kleuren komen uit de palette. */
interface BlobConfig {
  orbit: number; // fractie van de orb-straal: hoe ver van het midden
  size: number; // fractie van de orb-straal: straal van de licht-gradient
  speed: number;
  phase: number;
  freqX: number;
  freqY: number;
}

const TAU = Math.PI * 2;

const BLOB_CONFIG: BlobConfig[] = [
  { orbit: 0.26, size: 0.66, speed: 0.00065, phase: 0, freqX: 0.8, freqY: 1.0 },
  { orbit: 0.4, size: 0.54, speed: 0.00085, phase: TAU * 0.33, freqX: 1.05, freqY: 0.82 },
  { orbit: 0.34, size: 0.6, speed: 0.00072, phase: TAU * 0.66, freqX: 0.92, freqY: 1.18 },
  { orbit: 0.46, size: 0.46, speed: 0.00098, phase: TAU * 0.5, freqX: 1.22, freqY: 0.7 },
];

function rgba([r, g, b]: RGB, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const hp = ((((h % 360) + 360) % 360) / 60);
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = lN - c / 2;
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/**
 * Leid een multi-color glas-palette af uit één hue. Gebruikt door de
 * "Imagine-This-Is-Yours"-modus zodat de orb live verkleurt naar het
 * ingevoerde merk, maar de vloeibare glas-look behoudt.
 */
export function paletteFromHue(hue: number): PresencePalette {
  return {
    blobs: [
      hslToRgb(hue, 80, 58),
      hslToRgb(hue + 28, 85, 62),
      hslToRgb(hue - 32, 82, 60),
      hslToRgb(hue + 62, 75, 60),
    ],
    glow: hslToRgb(hue + 10, 80, 55),
    rim: hslToRgb(hue, 70, 88),
  };
}

function stateProfile(state: PresenceState) {
  switch (state) {
    case "listening":
      return { speedMul: 1.4, amplitudeMul: 1.25, glow: 0.9 };
    case "thinking":
      return { speedMul: 2.2, amplitudeMul: 1.5, glow: 1.0 };
    case "responding":
      return { speedMul: 1.8, amplitudeMul: 1.7, glow: 1.2 };
    case "idle":
    default:
      return { speedMul: 1.0, amplitudeMul: 1.0, glow: 0.7 };
  }
}

export default function AmbassadorPresence({
  state,
  palette = MAISON_PRESENCE_PALETTE,
  audioLevel = 0,
  size = 280,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<PresenceState>(state);
  const paletteRef = useRef<PresencePalette>(palette);
  const audioRef = useRef(audioLevel);
  const animRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);

  useEffect(() => {
    audioRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // HiDPI scaling zodat de canvas niet wazig is op retina.
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio ?? 1, 2) : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // prefers-reduced-motion: één statische frame, geen animatieloop.
    if (typeof window !== "undefined" && window.matchMedia) {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const cx = size / 2;
    const cy = size / 2;
    const baseRadius = size * 0.32;

    let t = 0;
    let lastRender = performance.now();

    const render = (now: number) => {
      const dt = now - lastRender;
      lastRender = now;

      const profile = stateProfile(stateRef.current);
      const reduced = reducedMotionRef.current;
      t += dt * profile.speedMul;
      const time = reduced ? 1500 : t; // bevroren tijd voor reduced-motion

      const pal = paletteRef.current;
      const audio = audioRef.current;

      const breathe = reduced
        ? 1
        : 1 + Math.sin(t * 0.0011) * (0.018 + profile.glow * 0.012);
      const R = baseRadius * 1.12 * breathe;

      ctx.clearRect(0, 0, size, size);

      // 1. Buitenste bloom / halo.
      const bloomR = R * (1.85 + profile.glow * 0.3);
      const bloom = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, bloomR);
      bloom.addColorStop(0, rgba(pal.glow, 0.3 * profile.glow));
      bloom.addColorStop(0.5, rgba(pal.glow, 0.08 * profile.glow));
      bloom.addColorStop(1, rgba(pal.glow, 0));
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, size, size);

      // 2. Glas-lichaam: clip naar cirkel.
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.closePath();
      ctx.clip();

      // Donkere glas-basis (lichter naar boven voor diepte).
      const base = ctx.createRadialGradient(cx, cy - R * 0.25, R * 0.1, cx, cy, R);
      base.addColorStop(0, "rgba(28, 26, 46, 1)");
      base.addColorStop(1, "rgba(8, 8, 16, 1)");
      ctx.fillStyle = base;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 3. Vloeibare licht-blobs — additief geblend (licht door glas).
      ctx.globalCompositeOperation = "lighter";
      const ampMul = (reduced ? 0 : 1) * profile.amplitudeMul * (1 + audio * 0.9);
      for (let i = 0; i < BLOB_CONFIG.length; i++) {
        const bl = BLOB_CONFIG[i];
        const color = pal.blobs[i % pal.blobs.length];
        const tt = time * bl.speed;
        const orbit = R * bl.orbit * (0.55 + 0.45 * ampMul);
        const bx = cx + Math.cos(tt * bl.freqX + bl.phase) * orbit;
        const by = cy + Math.sin(tt * bl.freqY + bl.phase * 1.3) * orbit;
        const wobble = reduced ? 1 : 1 + Math.sin(tt * 0.6 + bl.phase) * 0.12;
        const br = R * bl.size * wobble;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, rgba(color, 0.55 * profile.glow));
        g.addColorStop(0.45, rgba(color, 0.22 * profile.glow));
        g.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      }
      ctx.globalCompositeOperation = "source-over";

      // 4. Sphere-vignette: donkere randen geven de bol 3D-diepte.
      const vig = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
      vig.addColorStop(0, "rgba(0, 0, 0, 0)");
      vig.addColorStop(0.8, "rgba(0, 0, 0, 0)");
      vig.addColorStop(1, "rgba(4, 4, 11, 0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 5. Glas-reflectie: zachte specular highlight links-boven.
      const hlX = cx - R * 0.3;
      const hlY = cy - R * 0.42;
      const hl = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, R * 0.62);
      hl.addColorStop(0, rgba(pal.rim, 0.42));
      hl.addColorStop(0.4, rgba(pal.rim, 0.08));
      hl.addColorStop(1, rgba(pal.rim, 0));
      ctx.fillStyle = hl;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      ctx.restore();

      // 6. Glas-rand: één doorlopende, fijne ring (lichter bovenaan via de
      //    verticale gradient). Geen losse boog meer — dat las als een
      //    rare "halve buitenring".
      const rimGrad = ctx.createLinearGradient(cx, cy - R, cx, cy + R);
      rimGrad.addColorStop(0, rgba(pal.rim, 0.5));
      rimGrad.addColorStop(0.5, rgba(pal.rim, 0.1));
      rimGrad.addColorStop(1, rgba(pal.glow, 0.22));
      ctx.lineWidth = Math.max(1, size * 0.005);
      ctx.strokeStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R - ctx.lineWidth * 0.5, 0, TAU);
      ctx.stroke();

      if (!reduced) animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [size]);

  const labels: Record<PresenceState, string> = {
    idle: "Gereed",
    listening: "Luistert",
    thinking: "Denkt",
    responding: "Antwoordt",
  };

  return (
    <div className={`relative ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        aria-label={`Brand Ambassador visuele aanwezigheid — status: ${labels[state]}`}
        role="img"
      />
      <span className="sr-only" aria-live="polite">
        Ambassador status: {labels[state]}
      </span>
    </div>
  );
}
