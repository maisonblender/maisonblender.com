"use client";

/**
 * PresenceContext — coördineert de site-wide Liquid Presence.
 *
 * Architectuur:
 *   <PresenceProvider>         (in app/layout.tsx)
 *     {children}                (alle pagina's)
 *     <PersistentPresenceShell> (rendert canvas + chat-modal)
 *
 * Pagina's beïnvloeden de Presence via `usePresencePosition()`:
 *   - anchor: "corner" | "hidden" | "center-right" | { x, y }
 *   - size: "sm" | "md" | "lg"
 *   - state-hints per sectie (via usePresenceSection)
 *
 * Globale triggers (Cmd+K, text-selection, hover) manipuleren de Presence
 * via `usePresence()`.open(), .pulse(), .setState().
 *
 * Design-principe: één bron van waarheid. Geen lokale Presence-instances
 * buiten de shell. De shell zelf is idempotent — meerdere pagina's die
 * `usePresencePosition()` aanroepen stapelen niet; laatste roep wint met
 * een LIFO-stack zodat modals/dialogs zelf geen state-pollutie achter
 * kunnen laten als ze unmounten.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PresenceState } from "@/components/BrandAmbassador/AmbassadorPresence";

export type PresenceAnchor =
  | { kind: "corner"; corner: "br" | "bl" | "tr" | "tl" }
  | { kind: "center-right" }
  | { kind: "bottom-center" }
  | { kind: "hidden" }
  | { kind: "coords"; x: number; y: number };

export type PresenceSize = "xs" | "sm" | "md" | "lg";

export const SIZE_PX: Record<PresenceSize, number> = {
  xs: 56,
  sm: 80,
  md: 112,
  lg: 160,
};

export interface PresenceNudge {
  /** Pulse dot duration in ms. */
  durationMs: number;
  /** Optionele tooltip-tekst die naast de Presence verschijnt. */
  hint?: string;
  /** Optionele call-to-action chip. Klik = openConversation met prefill. */
  chip?: { label: string; prefill: string };
  /** Uniek id om dupes te deduperen (bv. bij herhaalde selection-events). */
  id: string;
}

interface PositionRegistration {
  id: number;
  anchor: PresenceAnchor;
  size: PresenceSize;
  /** Optionele state-hint bij actieve registratie. */
  stateHint?: PresenceState;
}

interface PresenceContextValue {
  // Observeerbare staat
  anchor: PresenceAnchor;
  size: PresenceSize;
  state: PresenceState;
  isOpen: boolean;
  prefill: string | null;
  nudge: PresenceNudge | null;
  reduceMotion: boolean;

  // Registraties vanuit pagina's (top-of-stack wint)
  registerPosition: (reg: Omit<PositionRegistration, "id">) => () => void;

  // Interacties
  open: (opts?: { prefill?: string }) => void;
  close: () => void;
  setState: (state: PresenceState) => void;
  pulse: (nudge: Omit<PresenceNudge, "id"> & { id?: string }) => void;
  clearNudge: () => void;
}

const DEFAULT_ANCHOR: PresenceAnchor = { kind: "corner", corner: "br" };
const DEFAULT_SIZE: PresenceSize = "sm";

const PresenceContext = createContext<PresenceContextValue | null>(null);

/**
 * Provider — mount één keer in app/layout.tsx.
 */
export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<PositionRegistration[]>([]);
  const [state, setStateInternal] = useState<PresenceState>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<string | null>(null);
  const [nudge, setNudge] = useState<PresenceNudge | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const nextId = useRef(1);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // prefers-reduced-motion: we dimmen motion-intensive effects (transitie-swirl,
  // big size-animations). Canvas zelf heeft z'n eigen respecter.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const registerPosition = useCallback(
    (reg: Omit<PositionRegistration, "id">) => {
      const id = nextId.current++;
      setStack((prev) => [...prev, { ...reg, id }]);
      return () => {
        setStack((prev) => prev.filter((r) => r.id !== id));
      };
    },
    []
  );

  // Top-of-stack wint. Dit laat pagina-componenten hun eigen voorkeur
  // opleggen zonder de default te muteren, en keurig opruimen bij
  // unmount.
  const top = stack[stack.length - 1];
  const anchor: PresenceAnchor = top?.anchor ?? DEFAULT_ANCHOR;
  const size: PresenceSize = top?.size ?? DEFAULT_SIZE;

  // State-hint uit top-of-stack overschrijft interne state, tenzij we
  // expliciet in een thinking/responding zitten (dan win die).
  const effectiveState: PresenceState = useMemo(() => {
    if (state === "thinking" || state === "responding") return state;
    if (top?.stateHint) return top.stateHint;
    return state;
  }, [state, top]);

  const open = useCallback((opts?: { prefill?: string }) => {
    setPrefill(opts?.prefill ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPrefill(null);
  }, []);

  const setPresenceState = useCallback((s: PresenceState) => {
    setStateInternal(s);
  }, []);

  const clearNudge = useCallback(() => {
    if (nudgeTimerRef.current) {
      clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }
    setNudge(null);
  }, []);

  const pulse = useCallback(
    (next: Omit<PresenceNudge, "id"> & { id?: string }) => {
      const id = next.id ?? `${Date.now()}-${Math.random()}`;
      // Dedupe: identieke id binnen 1 sec negeren (bv. fast selection events)
      setNudge((current) => {
        if (current?.id === id) return current;
        return { ...next, id };
      });
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = setTimeout(() => {
        setNudge(null);
        nudgeTimerRef.current = null;
      }, next.durationMs);
    },
    []
  );

  // Esc-key sluit modal
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    };
  }, []);

  const value = useMemo<PresenceContextValue>(
    () => ({
      anchor,
      size,
      state: effectiveState,
      isOpen,
      prefill,
      nudge,
      reduceMotion,
      registerPosition,
      open,
      close,
      setState: setPresenceState,
      pulse,
      clearNudge,
    }),
    [
      anchor,
      size,
      effectiveState,
      isOpen,
      prefill,
      nudge,
      reduceMotion,
      registerPosition,
      open,
      close,
      setPresenceState,
      pulse,
      clearNudge,
    ]
  );

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence(): PresenceContextValue {
  const ctx = useContext(PresenceContext);
  if (!ctx) {
    throw new Error(
      "usePresence() moet binnen <PresenceProvider> aangeroepen worden."
    );
  }
  return ctx;
}

/**
 * Optional variant die null teruggeeft buiten de provider — handig voor
 * componenten die zowel in standalone contexts als binnen de provider
 * kunnen leven (bv. pagina's die lokaal ook een Presence kunnen mounten).
 */
export function usePresenceOptional(): PresenceContextValue | null {
  return useContext(PresenceContext);
}
