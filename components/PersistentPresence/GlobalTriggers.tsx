"use client";

/**
 * GlobalTriggers — site-wide interactie-listeners die de Liquid Presence
 * contextueel laten reageren op wat de bezoeker doet.
 *
 * Mount één keer (via PersistentPresenceShell z'n provider-level).
 *
 * Triggers:
 *   1. Cmd/Ctrl + K        — global launcher (Raycast-stijl)
 *   2. Text-selection      — "Laat me dit uitleggen"-chip als >8 woorden geselecteerd
 *   3. [data-presence-trigger] — hover 1.5s op CTA-elementen → pulse + hint
 *   4. scroll-bound state  — IntersectionObserver op [data-presence-state-hint]
 *                            secties om de state sync met de pagina-flow
 *
 * Design-principes:
 *   - Niet opdringerig: debounced + throttled, nudges verdwijnen na 6s
 *   - Dedupe: gelijke selectie/hint niet meerdere keren triggeren
 *   - Respect voor bezoeker: als hij de Presence wegklikt of escape,
 *     eerstvolgende trigger pas na X seconden
 */

import { useEffect, useRef } from "react";
import { usePresence } from "./PresenceContext";
import type { PresenceState } from "@/components/BrandAmbassador/AmbassadorPresence";

const NUDGE_HINT_MS = 6_000;
const HOVER_DWELL_MS = 1_500;
const SELECTION_MIN_WORDS = 8;
const SELECTION_MAX_CHARS = 600;
const TRIGGER_COOLDOWN_MS = 8_000;

export default function GlobalTriggers() {
  const { open, pulse, setState, isOpen, reduceMotion } = usePresence();
  const lastTriggerAtRef = useRef(0);
  const recentSelectionRef = useRef("");

  // 1. Cmd/Ctrl + K — global launcher
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isLauncher =
        (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (!isLauncher) return;
      // Laat input/contenteditable Cmd+K met rust zodat browsers hun eigen
      // defaults niet door ons verstoord worden (bv. Safari find-in-page zit
      // op Cmd+F; Cmd+K heeft hier doorgaans géén eigen default).
      e.preventDefault();
      if (!isOpen) open();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, isOpen]);

  // 2. Text-selection — "Laat me dit uitleggen"-chip
  useEffect(() => {
    if (isOpen) return; // geen nudges wanneer de chat al open is
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handler = () => {
      if (timer) clearTimeout(timer);
      // Debounce — wacht tot gebruiker klaar is met selecteren
      timer = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection) return;
        const text = selection.toString().trim();
        if (!text) return;

        // Negeer selections in form fields / modals
        const anchorNode = selection.anchorNode;
        if (anchorNode && anchorNode.parentElement) {
          const closest = anchorNode.parentElement.closest(
            "input, textarea, [contenteditable='true'], [data-presence-ignore]"
          );
          if (closest) return;
        }

        const words = text.split(/\s+/).filter(Boolean);
        if (words.length < SELECTION_MIN_WORDS) return;

        // Cap de lengte — we sturen niet de hele pagina in het prefill
        const trimmed =
          text.length > SELECTION_MAX_CHARS
            ? text.slice(0, SELECTION_MAX_CHARS).trim() + "…"
            : text;

        // Dedupe identieke selectie binnen één sessie
        if (trimmed === recentSelectionRef.current) return;
        recentSelectionRef.current = trimmed;

        // Cooldown check
        const now = Date.now();
        if (now - lastTriggerAtRef.current < TRIGGER_COOLDOWN_MS) return;
        lastTriggerAtRef.current = now;

        pulse({
          durationMs: NUDGE_HINT_MS,
          hint: "Zal ik dit uitleggen?",
          chip: {
            label: "Leg uit",
            prefill: `Kun je dit stuk voor me uitleggen:\n\n"${trimmed}"`,
          },
          id: `selection-${trimmed.slice(0, 40)}`,
        });
      }, 650);
    };

    document.addEventListener("selectionchange", handler);
    return () => {
      document.removeEventListener("selectionchange", handler);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, pulse]);

  // 3. [data-presence-trigger] — hover 1.5s op CTA-elementen
  useEffect(() => {
    if (isOpen) return;
    let hoverTimer: ReturnType<typeof setTimeout> | null = null;
    let activeEl: Element | null = null;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const trigger = target.closest(
        "[data-presence-trigger]"
      ) as HTMLElement | null;
      if (!trigger || trigger === activeEl) return;
      activeEl = trigger;
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        const hint =
          trigger.getAttribute("data-presence-hint") ||
          "Vraag me hier iets over?";
        const chipLabel =
          trigger.getAttribute("data-presence-chip") || "Vraag de Ambassador";
        const prefill =
          trigger.getAttribute("data-presence-prefill") ||
          `Ik lees op deze pagina over "${trigger.textContent?.trim().slice(0, 80) || ""}". Kun je me hier meer over vertellen?`;

        const now = Date.now();
        if (now - lastTriggerAtRef.current < TRIGGER_COOLDOWN_MS) return;
        lastTriggerAtRef.current = now;

        pulse({
          durationMs: NUDGE_HINT_MS,
          hint,
          chip: { label: chipLabel, prefill },
          id: `hover-${trigger.getAttribute("data-presence-trigger") || "anon"}-${Math.floor(now / 10000)}`,
        });
      }, HOVER_DWELL_MS);
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || !activeEl) return;
      if (activeEl.contains(target) || activeEl === target) {
        const related = e.relatedTarget as Element | null;
        if (!related || !activeEl.contains(related)) {
          if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
          }
          activeEl = null;
        }
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (hoverTimer) clearTimeout(hoverTimer);
    };
  }, [isOpen, pulse]);

  // 4. Scroll-bound state via IntersectionObserver op
  //    [data-presence-state-hint="thinking|responding|listening|idle"]
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduceMotion) return; // minder state-geflikker als motion uit staat
    if (isOpen) return;

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-presence-state-hint]"
    );
    if (targets.length === 0) return;

    const currentIntersecting = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) currentIntersecting.add(el);
          else currentIntersecting.delete(el);
        }
        // Kies de hint van het meest in-view element (hoogste intersectionRatio)
        let best: HTMLElement | null = null;
        let bestRatio = 0;
        for (const el of currentIntersecting) {
          const rect = el.getBoundingClientRect();
          const viewportH = window.innerHeight;
          const visibleH = Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0);
          const ratio = Math.max(0, visibleH) / Math.max(1, rect.height);
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = el;
          }
        }
        if (best) {
          const hint = best.getAttribute(
            "data-presence-state-hint"
          ) as PresenceState | null;
          if (hint === "idle" || hint === "listening" || hint === "thinking" || hint === "responding") {
            setState(hint);
          }
        } else {
          setState("idle");
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [isOpen, reduceMotion, setState]);

  return null;
}
