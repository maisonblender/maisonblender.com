"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

export interface UseFocusTrapOptions {
  /** When true, trap focus inside containerRef */
  active: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  /** Called when Escape is pressed */
  onEscape?: () => void;
  /** If false, does not restore focus to previously focused element on deactivate */
  restoreFocus?: boolean;
  /** Element to focus first; otherwise first focusable in container */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Traps Tab/Shift+Tab within container, focuses first element on activate,
 * restores focus on deactivate, optional Escape handler.
 * WCAG 2.1.2 / ARIA dialog pattern support.
 */
export function useFocusTrap({
  active,
  containerRef,
  onEscape,
  restoreFocus = true,
  initialFocusRef,
}: UseFocusTrapOptions): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusables = getFocusableElements(container);
    const initial =
      initialFocusRef?.current && container.contains(initialFocusRef.current)
        ? initialFocusRef.current
        : focusables[0];
    initial?.focus({ preventScroll: true });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      if (e.key !== "Tab" || !container) return;

      const nodes = getFocusableElements(container);
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (restoreFocus && previousFocusRef.current?.focus) {
        previousFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef, onEscape, restoreFocus, initialFocusRef]);
}
