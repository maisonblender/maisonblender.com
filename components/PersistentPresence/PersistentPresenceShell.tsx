"use client";

/**
 * PersistentPresenceShell — de enige render-plek voor de site-wide Liquid
 * Presence. Mount één keer vanuit <PresenceProvider> in layout.tsx.
 *
 * Verantwoordelijkheden:
 *   1. Rendert de Liquid Presence in een fixed positie (per anchor + size)
 *   2. Morpht vloeiend tussen pagina-posities via Framer Motion layoutId
 *   3. Toont nudge-tooltip + optionele action-chip bij pulse()
 *   4. Opent een fullscreen chat-modal (lazy-loaded AmbassadorWidget) bij klik
 *   5. Tijdens chat-modal: de persistent presence FADE-t uit, de modal
 *      krijgt z'n eigen (grotere) Presence via shared layoutId zodat het
 *      visueel continu voelt — één wezen, één beweging.
 *
 * Performance:
 *   - AmbassadorWidget is lazy via next/dynamic (ssr:false); wordt pas
 *     geladen als de modal voor het eerst opent
 *   - Canvas pauzeert automatisch bij document.hidden (in AmbassadorPresence)
 *   - Bij anchor="hidden" renderen we niets — geen canvas-kosten op pagina's
 *     die hun eigen presence bezitten (/brand-ambassador)
 *
 * A11y:
 *   - Launcher-button heeft aria-label + aria-expanded
 *   - Modal: focus trap + Esc sluit + body scroll lock
 *   - prefers-reduced-motion: alle framer-motion-transitions worden 0s
 */

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef } from "react";
import AmbassadorPresence from "@/components/BrandAmbassador/AmbassadorPresence";
import {
  SIZE_PX,
  usePresence,
  type PresenceAnchor,
  type PresenceSize,
} from "./PresenceContext";
import { useBackgroundLuminance } from "./useBackgroundLuminance";

/**
 * Lazy-load de AmbassadorWidget. Hij pullt een grote streaming/chat
 * abstractie mee die we niet op elke page-load willen bundelen. Pas bij
 * de eerste open() wordt hij opgehaald; daarna blijft hij mounted en
 * snel herbruikbaar.
 */
const AmbassadorWidget = dynamic(
  () => import("@/components/BrandAmbassador/AmbassadorWidget"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0b0b0d]">
        <div className="text-xs uppercase tracking-widest text-white/40">
          Ambassador laadt…
        </div>
      </div>
    ),
  }
);

const LAYOUT_ID = "mb-liquid-presence";

/** Map anchor naar CSS positionering. */
function anchorToStyle(anchor: PresenceAnchor, size: PresenceSize): React.CSSProperties {
  const px = SIZE_PX[size];
  const margin = 24;

  switch (anchor.kind) {
    case "hidden":
      return { display: "none" };
    case "corner": {
      const base: React.CSSProperties = {
        position: "fixed",
        width: px,
        height: px,
      };
      switch (anchor.corner) {
        case "br":
          return { ...base, bottom: margin, right: margin };
        case "bl":
          return { ...base, bottom: margin, left: margin };
        case "tr":
          return { ...base, top: margin, right: margin };
        case "tl":
          return { ...base, top: margin, left: margin };
      }
      return base;
    }
    case "center-right":
      return {
        position: "fixed",
        width: px,
        height: px,
        top: "50%",
        right: margin,
        transform: "translateY(-50%)",
      };
    case "bottom-center":
      return {
        position: "fixed",
        width: px,
        height: px,
        bottom: margin * 1.5,
        left: "50%",
        transform: "translateX(-50%)",
      };
    case "coords":
      return {
        position: "fixed",
        width: px,
        height: px,
        top: anchor.y,
        left: anchor.x,
      };
  }
}

/** Map anchor naar passende tooltip-richting. */
function nudgeSideForAnchor(anchor: PresenceAnchor): "left" | "right" | "top" {
  if (anchor.kind === "corner") {
    if (anchor.corner === "br" || anchor.corner === "tr") return "left";
    return "right";
  }
  if (anchor.kind === "center-right") return "left";
  if (anchor.kind === "bottom-center") return "top";
  return "left";
}

export default function PersistentPresenceShell() {
  const {
    anchor,
    size,
    state,
    isOpen,
    prefill,
    nudge,
    reduceMotion,
    open,
    close,
    clearNudge,
  } = usePresence();

  const wrapperStyle = useMemo(() => anchorToStyle(anchor, size), [anchor, size]);
  const px = SIZE_PX[size];
  const hidden = anchor.kind === "hidden";

  // Transitie-profielen. Bij reduced-motion: 0ms alles.
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.9 };

  // Ref op het launcher-wrapper-element. We gebruiken z'n positie om de
  // achtergrond-luminance eronder te sampleren en contrastMode te bepalen.
  const launcherRef = useRef<HTMLDivElement | null>(null);
  const getLauncherCenter = useCallback(() => {
    const el = launcherRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, []);
  const luminance = useBackgroundLuminance(getLauncherCenter, {
    enabled: !isOpen && !hidden,
  });
  const contrastMode = luminance === "light" ? "light" : "dark";

  const handleLauncherClick = useCallback(() => {
    open();
    clearNudge();
  }, [open, clearNudge]);

  const handleNudgeChipClick = useCallback(() => {
    if (nudge?.chip) {
      open({ prefill: nudge.chip.prefill });
      clearNudge();
    }
  }, [nudge, open, clearNudge]);

  const nudgeSide = nudgeSideForAnchor(anchor);

  return (
    <>
      {/* Eén AnimatePresence rond de shared-layoutId flip: launcher ⇄ modal.
          mode="popLayout" laat beide kortstondig coexisteren zodat de
          spring-morph visueel doorloopt zonder flicker. */}
      <AnimatePresence mode="popLayout">
        {isOpen ? (
          <motion.div
            key="presence-modal"
            layoutId={LAYOUT_ID}
            style={{ position: "fixed", inset: 0 }}
            className="z-[90] bg-[#0b0b0d]"
            transition={spring}
            initial={{ borderRadius: px }}
            animate={{ borderRadius: 0 }}
            exit={{ borderRadius: px, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Ambassador gesprek"
          >
            {/* Geen aparte close-button: de AmbassadorWidget header-knop
                gedraagt zich als close zodra we `onClose` meegeven. Dat
                voorkomt dubbele iconen (expand + close) rechtsboven. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.28, delay: 0.18 }
              }
              className="h-full w-full"
            >
              <AmbassadorWidget
                defaultFullscreen
                initialPrompt={prefill ?? undefined}
                onClose={close}
              />
            </motion.div>
          </motion.div>
        ) : !hidden ? (
          <motion.div
            key="presence-launcher"
            ref={launcherRef}
            layoutId={LAYOUT_ID}
            style={wrapperStyle}
            className="mb-presence-launcher z-[55]"
            data-presence-ignore=""
            transition={spring}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <button
              type="button"
              onClick={handleLauncherClick}
              aria-label="Open gesprek met de Ambassador (Cmd+K)"
              aria-expanded={isOpen}
              className="group relative block h-full w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#4af0c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0d]"
              style={{
                // Soft halo achter de canvas. Adapteert met contrastMode:
                //   - dark  = lichte mint-glow (huidig, staat mooi op donker)
                //   - light = donkere mint-wash (geeft gewicht tegen wit)
                background:
                  contrastMode === "light"
                    ? "radial-gradient(circle, rgba(6, 92, 68, 0.14) 0%, rgba(6, 92, 68, 0.06) 45%, transparent 72%)"
                    : "radial-gradient(circle, rgba(74, 240, 196, 0.18) 0%, rgba(74, 240, 196, 0.08) 40%, transparent 70%)",
                transition: "background 320ms ease",
              }}
            >
              <AmbassadorPresence
                state={state}
                hue={160}
                size={px}
                contrastMode={contrastMode}
                className="pointer-events-none"
              />
              <span
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute inset-0 rounded-full ring-1 transition-[box-shadow,ring-color] duration-300",
                  contrastMode === "light"
                    ? "ring-[#0a7a5c]/0 group-hover:ring-[#0a7a5c]/40 group-hover:[box-shadow:0_0_24px_rgba(10,122,92,0.25)]"
                    : "ring-[#4af0c4]/0 group-hover:ring-[#4af0c4]/30 group-hover:[box-shadow:0_0_24px_rgba(74,240,196,0.3)]",
                ].join(" ")}
              />
            </button>

            <AnimatePresence>
              {nudge && (
                <motion.div
                  key="presence-nudge"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.22 }}
                  className={[
                    "absolute flex flex-col gap-1.5",
                    nudgeSide === "left"
                      ? "right-full mr-3 top-1/2 -translate-y-1/2 items-end"
                      : "",
                    nudgeSide === "right"
                      ? "left-full ml-3 top-1/2 -translate-y-1/2 items-start"
                      : "",
                    nudgeSide === "top"
                      ? "bottom-full mb-3 left-1/2 -translate-x-1/2 items-center"
                      : "",
                  ].join(" ")}
                >
                  {nudge.hint && (
                    <div className="max-w-[240px] whitespace-normal rounded-2xl border border-white/10 bg-[#0b0b0d]/95 px-3.5 py-2 text-xs leading-snug text-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur">
                      {nudge.hint}
                    </div>
                  )}
                  {nudge.chip && (
                    <button
                      type="button"
                      onClick={handleNudgeChipClick}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#4af0c4]/40 bg-[#4af0c4]/10 px-3.5 py-1.5 text-xs font-medium text-[#4af0c4] transition-colors hover:border-[#4af0c4] hover:bg-[#4af0c4]/20"
                    >
                      {nudge.chip.label}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
