"use client";

/**
 * AmbassadorPresence — de Liquid Presence canvas-entiteit.
 *
 * Dit is de visuele handtekening van de Brand Ambassador. Geen avatar,
 * geen initialen, geen robot-icoon: een levende organische vorm die ademt,
 * luistert, denkt en spreekt. Wat de Ambassador onderscheidt van elke
 * andere chatbot op het web.
 *
 * Dark-mode (MAISON BLNDR signature) = een vloeibare GLAS-ORB in Siri-stijl:
 * een glazen bol met meerdere kleurige licht-blobs die additief door het glas
 * zwerven, sphere-shading, een glas-reflectie bovenaan en een buitenste bloom.
 * Light / lightAccent (AI Collega tenants) = de rustige single-hue ring-look.
 *
 * States:
 *   - idle       : langzaam pulseren, zachte beweging
 *   - listening  : trilt mee met audio-amplitude (via optionele audioLevel prop)
 *   - thinking   : snellere, complexere morfologie (terwijl AI tokens genereert)
 *   - responding : uitdijende vloeibare motion (terwijl tekst naar user streamt)
 *
 * Implementatie: pure Canvas 2D + requestAnimationFrame. Geen three.js, geen
 * WebGL — omdat we willen dat dit op elke device werkt inclusief mobile én
 * batterij-zuinig blijft. Respect voor prefers-reduced-motion.
 *
 * Kleur wordt bepaald door de `palette` prop (multi-color glas). Default =
 * MAISON BLNDR "Aurora Nocturne". Tijdens "Imagine-This-Is-Yours" geeft de
 * widget een uit de merk-hue afgeleide palette mee (zie `paletteFromHue`).
 * De `hue`-prop blijft bestaan voor de light-mode tenant ring-look.
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
 * Siri-esque tegen de donkere `#0b0b0d` achtergrond. Bewust géén mintgroen.
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
  /** HSL hue 0-360. Alleen gebruikt in de light/lightAccent ring-look. */
  hue?: number;
  /**
   * Multi-color glas-palette voor de dark-mode orb. Default = MAISON BLNDR
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
   * Contrastmodus:
   *   - "dark"        (default) — de Siri glas-orb tegen donkere achtergrond.
   *   - "light"                 — anthracite/ink ring-look op lichte achtergrond
   *                                (hue genegeerd; MAISON BLNDR signature look)
   *   - "lightAccent"           — donker-getinte accent ring-look (hue actief) op
   *                                lichte achtergrond (AI Collega tenants).
   *
   * De site-wide shell detecteert automatisch wat onder de Presence zit
   * en switcht live tussen "dark" en "light".
   */
  contrastMode?: "dark" | "light" | "lightAccent";
};

interface Ring {
  points: number;
  amplitude: number;
  phase: number;
  radius: number;
  speed: number;
  opacity: number;
  lineWidth: number;
}

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
      return { speedMul: 1.4, amplitudeMul: 1.25, ringCount: 3, glow: 0.9 };
    case "thinking":
      return { speedMul: 2.2, amplitudeMul: 1.5, ringCount: 4, glow: 1.0 };
    case "responding":
      return { speedMul: 1.8, amplitudeMul: 1.7, ringCount: 5, glow: 1.2 };
    case "idle":
    default:
      return { speedMul: 1.0, amplitudeMul: 1.0, ringCount: 3, glow: 0.7 };
  }
}

export default function AmbassadorPresence({
  state,
  hue = 160,
  palette = MAISON_PRESENCE_PALETTE,
  audioLevel = 0,
  size = 280,
  className = "",
  contrastMode = "dark",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<PresenceState>(state);
  const hueRef = useRef(hue);
  const paletteRef = useRef<PresencePalette>(palette);
  const audioRef = useRef(audioLevel);
  const modeRef = useRef<"dark" | "light" | "lightAccent">(contrastMode);
  const animRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);

  useEffect(() => {
    audioRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    modeRef.current = contrastMode;
  }, [contrastMode]);

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

    // prefers-reduced-motion: val terug op een statische, gestileerde glyph.
    if (typeof window !== "undefined" && window.matchMedia) {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const cx = size / 2;
    const cy = size / 2;
    const baseRadius = size * 0.32;

    // Rings — alleen gebruikt in de light/lightAccent tenant-look.
    const rings: Ring[] = [
      { points: 60, amplitude: 8, phase: 0, radius: baseRadius, speed: 0.0015, opacity: 0.9, lineWidth: 1.5 },
      { points: 72, amplitude: 14, phase: Math.PI / 3, radius: baseRadius * 1.08, speed: 0.0022, opacity: 0.55, lineWidth: 1 },
      { points: 90, amplitude: 20, phase: Math.PI / 2, radius: baseRadius * 1.16, speed: 0.0009, opacity: 0.3, lineWidth: 0.75 },
      { points: 54, amplitude: 28, phase: Math.PI, radius: baseRadius * 1.28, speed: 0.0028, opacity: 0.15, lineWidth: 0.5 },
      { points: 46, amplitude: 34, phase: Math.PI / 4, radius: baseRadius * 1.42, speed: 0.0035, opacity: 0.08, lineWidth: 0.5 },
    ];

    let t = 0;
    let lastRender = performance.now();

    // ----------------------------------------------------------------
    // DARK MODE — Liquid Glass Siri-orb.
    // ----------------------------------------------------------------
    const renderGlass = (now: number) => {
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

      // 6. Glas-rand: verticale gradient-stroke + heldere boog bovenaan.
      const rimGrad = ctx.createLinearGradient(cx, cy - R, cx, cy + R);
      rimGrad.addColorStop(0, rgba(pal.rim, 0.7));
      rimGrad.addColorStop(0.5, rgba(pal.rim, 0.12));
      rimGrad.addColorStop(1, rgba(pal.glow, 0.28));
      ctx.lineWidth = Math.max(1, size * 0.006);
      ctx.strokeStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.stroke();

      ctx.lineWidth = Math.max(1, size * 0.01);
      ctx.strokeStyle = rgba(pal.rim, 0.5);
      ctx.beginPath();
      ctx.arc(cx, cy, R - ctx.lineWidth * 0.5, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      if (!reduced) animRef.current = requestAnimationFrame(tick);
    };

    // ----------------------------------------------------------------
    // LIGHT / LIGHTACCENT — rustige single-hue ring-look (tenants).
    // ----------------------------------------------------------------
    const renderRings = (now: number) => {
      const dt = now - lastRender;
      lastRender = now;

      const profile = stateProfile(stateRef.current);
      t += dt * profile.speedMul;

      const h = hueRef.current;
      const audio = audioRef.current;
      const mode = modeRef.current;

      const INK_HUE = 220;
      const INK_SAT = 8;
      let P;
      if (mode === "light") {
        // MAISON BLNDR signature ink-look — hue genegeerd, anthracite tegen wit.
        P = {
          glowInner: `hsla(${INK_HUE}, ${INK_SAT}%, 18%, ${0.1 * profile.glow})`,
          glowMid: `hsla(${INK_HUE}, ${INK_SAT}%, 14%, ${0.04 * profile.glow})`,
          glowOuter: `hsla(${INK_HUE}, ${INK_SAT}%, 10%, 0)`,
          coreInner: `hsla(${INK_HUE}, ${INK_SAT}%, 22%, 0.92)`,
          coreMid: `hsla(${INK_HUE}, ${INK_SAT}%, 16%, 0.7)`,
          coreOuter: `hsla(${INK_HUE}, ${INK_SAT}%, 12%, 0.28)`,
          coreStroke: (op: number) =>
            `hsla(${INK_HUE}, ${INK_SAT}%, 12%, ${Math.min(1, op * 1.6)})`,
          ringStroke: (op: number) =>
            `hsla(${INK_HUE}, ${INK_SAT}%, 18%, ${Math.min(1, op * 1.9)})`,
          dot: `hsla(${INK_HUE}, ${INK_SAT}%, 10%, 0.95)`,
        };
      } else {
        // lightAccent — AI Collega: hue blijft volle accentkleur, donkerder +
        // meer saturated zodat hij niet verdwijnt tegen wit.
        P = {
          glowInner: `hsla(${h}, 75%, 45%, ${0.14 * profile.glow})`,
          glowMid: `hsla(${h}, 70%, 35%, ${0.05 * profile.glow})`,
          glowOuter: `hsla(${h}, 65%, 25%, 0)`,
          coreInner: `hsla(${h}, 75%, 42%, 0.92)`,
          coreMid: `hsla(${h}, 70%, 32%, 0.6)`,
          coreOuter: `hsla(${h}, 65%, 22%, 0.22)`,
          coreStroke: (op: number) =>
            `hsla(${h}, 80%, 28%, ${Math.min(1, op * 1.5)})`,
          ringStroke: (op: number) =>
            `hsla(${h}, 75%, 38%, ${Math.min(1, op * 1.7)})`,
          dot: `hsla(${h}, 85%, 25%, 0.95)`,
        };
      }

      ctx.clearRect(0, 0, size, size);

      const glowRadius = baseRadius * (1.6 + profile.glow * 0.2);
      const glow = ctx.createRadialGradient(cx, cy, baseRadius * 0.2, cx, cy, glowRadius);
      glow.addColorStop(0, P.glowInner);
      glow.addColorStop(0.6, P.glowMid);
      glow.addColorStop(1, P.glowOuter);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      const rc = reducedMotionRef.current ? 1 : profile.ringCount;

      for (let r = 0; r < rc; r++) {
        const ring = rings[r];
        const amp = reducedMotionRef.current
          ? 0
          : ring.amplitude * profile.amplitudeMul * (1 + audio * 0.8);
        const offset = reducedMotionRef.current ? 0 : t * ring.speed;

        ctx.beginPath();
        for (let i = 0; i <= ring.points; i++) {
          const a = (i / ring.points) * TAU;
          const noise =
            Math.sin(a * 3 + offset + ring.phase) * 0.5 +
            Math.sin(a * 5 - offset * 1.3 + ring.phase * 2) * 0.3 +
            Math.sin(a * 2 + offset * 0.7) * 0.2;
          const rad = ring.radius + noise * amp;
          const px = cx + Math.cos(a) * rad;
          const py = cy + Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        if (r === 0) {
          const coreGradient = ctx.createRadialGradient(cx, cy - baseRadius * 0.2, 0, cx, cy, ring.radius * 1.1);
          coreGradient.addColorStop(0, P.coreInner);
          coreGradient.addColorStop(0.7, P.coreMid);
          coreGradient.addColorStop(1, P.coreOuter);
          ctx.fillStyle = coreGradient;
          ctx.fill();

          ctx.strokeStyle = P.coreStroke(ring.opacity);
          ctx.lineWidth = ring.lineWidth;
          ctx.stroke();
        } else {
          ctx.strokeStyle = P.ringStroke(ring.opacity);
          ctx.lineWidth = ring.lineWidth;
          ctx.stroke();
        }
      }

      // Twee symmetrische "kijk"-puntjes (pareidolia → vriendelijk, niet uncanny).
      const pulse = reducedMotionRef.current ? 1 : 1 + Math.sin(t * 0.004) * 0.2;
      const dotRadius = 2.6 * pulse;
      const eyeY = cy - baseRadius * 0.22;
      const eyeOffsetX = baseRadius * 0.32;

      const blinkPhase = (t * 0.0002) % 1;
      const blinking =
        !reducedMotionRef.current &&
        stateRef.current === "idle" &&
        blinkPhase > 0.96;
      const eyeScaleY = blinking ? 0.15 : 1;

      for (const sign of [-1, 1]) {
        ctx.save();
        ctx.translate(cx + sign * eyeOffsetX, eyeY);
        ctx.scale(1, eyeScaleY);
        ctx.beginPath();
        ctx.arc(0, 0, dotRadius, 0, TAU);
        ctx.fillStyle = P.dot;
        ctx.fill();
        ctx.restore();
      }

      if (!reducedMotionRef.current && stateRef.current === "responding") {
        const mouthY = cy + baseRadius * 0.18;
        const mouthWidth = baseRadius * 0.45;
        const mouthCurve = baseRadius * 0.06 * (1 + Math.sin(t * 0.006) * 0.4);
        ctx.beginPath();
        ctx.moveTo(cx - mouthWidth / 2, mouthY);
        ctx.quadraticCurveTo(cx, mouthY + mouthCurve, cx + mouthWidth / 2, mouthY);
        ctx.strokeStyle = P.dot;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      if (modeRef.current === "dark") renderGlass(now);
      else renderRings(now);
    };

    animRef.current = requestAnimationFrame(tick);

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
