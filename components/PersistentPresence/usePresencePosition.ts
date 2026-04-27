"use client";

/**
 * usePresencePosition — pagina-hook om de site-wide Liquid Presence
 * positie, size en optionele state-hint op te leggen zolang de pagina
 * mounted is.
 *
 * Gebruik:
 *   function MijnPagina() {
 *     usePresencePosition({ anchor: { kind: "corner", corner: "br" }, size: "sm" });
 *     return ...;
 *   }
 *
 * Als meerdere componenten tegelijk registreren wint de laatste (LIFO).
 * Bij unmount wordt de registratie automatisch opgeruimd.
 *
 * Om de Presence ergens volledig te verbergen (bv. op /brand-ambassador
 * waar de widget zelf al een presence toont), gebruik `anchor: { kind: "hidden" }`.
 */

import { useEffect } from "react";
import type { PresenceState } from "@/components/BrandAmbassador/AmbassadorPresence";
import {
  usePresenceOptional,
  type PresenceAnchor,
  type PresenceSize,
} from "./PresenceContext";

interface PositionOpts {
  anchor: PresenceAnchor;
  size?: PresenceSize;
  stateHint?: PresenceState;
}

export function usePresencePosition(opts: PositionOpts) {
  const ctx = usePresenceOptional();
  const { anchor, size = "sm", stateHint } = opts;

  useEffect(() => {
    if (!ctx) return;
    const unregister = ctx.registerPosition({ anchor, size, stateHint });
    return unregister;
    // We stringify anchor om object-identity-induced re-registrations te
    // voorkomen. Pagina's geven vaak een nieuw object per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, JSON.stringify(anchor), size, stateHint]);
}
