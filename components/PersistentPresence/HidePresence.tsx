"use client";

/**
 * HidePresence — render-prop component die de site-wide Presence op de
 * huidige pagina verbergt. Mount hem ergens in de layout van een pagina
 * die z'n eigen lokale Presence toont (/brand-ambassador) zodat je geen
 * twee entities naast elkaar krijgt.
 *
 * Server-safe: deze file is client-only, dus pagina's die server-first
 * zijn importeren alleen deze kleine component. De rest van de pagina
 * blijft server-rendered.
 */

import { usePresencePosition } from "./usePresencePosition";

export default function HidePresence() {
  usePresencePosition({ anchor: { kind: "hidden" } });
  return null;
}
