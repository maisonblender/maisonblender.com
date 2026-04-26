"use client";

/**
 * AmbassadorPresence — de Liquid Presence canvas-entiteit.
 *
 * Dit is de visuele handtekening van de Brand Ambassador. Geen avatar,
 * geen initialen, geen robot-icoon: een levende organische vorm die ademt,
 * luistert, denkt en spreekt. Wat de Ambassador onderscheidt van elke
 * andere chatbot op het web.
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
 * Color wordt bepaald door `hue` prop (HSL 0-360). Default = MAISON BLNDR
 * mint-accent (hue ~160). Tijdens "Imagine-This-Is-Yours" shift hij naar
 * de hash-hue van het gekozen merk.
 */

import { useEffect, useRef } from "react";

export type PresenceState = "idle" | "listening" | "thinking" | "responding";

interface Props {
  state: PresenceState;
  /** HSL hue 0-360. Default = mint-groen (~160). */
  hue?: number;
  /** Optionele audio-amplitude (0-1) voor listening state. */
  audioLevel?: number;
  /** Grootte in pixels (canvas is vierkant). */
  size?: number;
  /** Extra className om in de layout te passen. */
  className?: string;
}

interface Ring {
  points: number;
  amplitude: number;
  phase: number;
  radius: number;
  speed: number;
  opacity: number;
  lineWidth: number;
}

const TAU = Math.PI * 2;

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
  audioLevel = 0,
  size = 280,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<PresenceState>(state);
  const hueRef = useRef(hue);
  const audioRef = useRef(audioLevel);
  const animRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

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

    // prefers-reduced-motion: val terug op een statische, gestileerde glyph.
    if (typeof window !== "undefined" && window.matchMedia) {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const cx = size / 2;
    const cy = size / 2;
    const baseRadius = size * 0.32;

    // Meerdere "rings" die we samen renderen voor een liquid-feel.
    const rings: Ring[] = [
      { points: 60, amplitude: 8, phase: 0, radius: baseRadius, speed: 0.0015, opacity: 0.9, lineWidth: 1.5 },
      { points: 72, amplitude: 14, phase: Math.PI / 3, radius: baseRadius * 1.08, speed: 0.0022, opacity: 0.55, lineWidth: 1 },
      { points: 90, amplitude: 20, phase: Math.PI / 2, radius: baseRadius * 1.16, speed: 0.0009, opacity: 0.3, lineWidth: 0.75 },
      { points: 54, amplitude: 28, phase: Math.PI, radius: baseRadius * 1.28, speed: 0.0028, opacity: 0.15, lineWidth: 0.5 },
      { points: 46, amplitude: 34, phase: Math.PI / 4, radius: baseRadius * 1.42, speed: 0.0035, opacity: 0.08, lineWidth: 0.5 },
    ];

    let t = 0;
    let lastRender = performance.now();

    const render = (now: number) => {
      const dt = now - lastRender;
      lastRender = now;

      const current = stateRef.current;
      const profile = stateProfile(current);
      t += dt * profile.speedMul;

      const h = hueRef.current;
      const audio = audioRef.current;

      // Clear met subtle dark fill (geen pitch-black zodat de glow werkt).
      ctx.clearRect(0, 0, size, size);

      // Radiale gradient als achtergrond-glow.
      const glowRadius = baseRadius * (1.6 + profile.glow * 0.2);
      const glow = ctx.createRadialGradient(cx, cy, baseRadius * 0.2, cx, cy, glowRadius);
      glow.addColorStop(0, `hsla(${h}, 90%, 60%, ${0.18 * profile.glow})`);
      glow.addColorStop(0.6, `hsla(${h}, 85%, 50%, ${0.06 * profile.glow})`);
      glow.addColorStop(1, `hsla(${h}, 80%, 40%, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      // Teken elke ring. Bij reduced-motion: één statische cirkel.
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
          // Meerdere overlappende sinus-golven voor organische flow.
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

        // Gevulde kern (eerste ring) is licht getint; outer rings zijn outlines.
        if (r === 0) {
          const coreGradient = ctx.createRadialGradient(cx, cy - baseRadius * 0.2, 0, cx, cy, ring.radius * 1.1);
          coreGradient.addColorStop(0, `hsla(${h}, 90%, 68%, 0.9)`);
          coreGradient.addColorStop(0.7, `hsla(${h}, 85%, 45%, 0.55)`);
          coreGradient.addColorStop(1, `hsla(${h}, 80%, 30%, 0.2)`);
          ctx.fillStyle = coreGradient;
          ctx.fill();

          ctx.strokeStyle = `hsla(${h}, 100%, 75%, ${ring.opacity})`;
          ctx.lineWidth = ring.lineWidth;
          ctx.stroke();
        } else {
          ctx.strokeStyle = `hsla(${h}, 100%, 70%, ${ring.opacity * profile.glow})`;
          ctx.lineWidth = ring.lineWidth;
          ctx.stroke();
        }
      }

      // Subtiele highlight-dot bovenin (suggereert "leven").
      const pulse = reducedMotionRef.current ? 1 : 1 + Math.sin(t * 0.004) * 0.2;
      const dotRadius = 3 * pulse;
      ctx.beginPath();
      ctx.arc(cx, cy - baseRadius * 0.35, dotRadius, 0, TAU);
      ctx.fillStyle = `hsla(${h}, 100%, 85%, 0.95)`;
      ctx.fill();

      animRef.current = requestAnimationFrame(render);
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
