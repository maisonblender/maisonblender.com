"use client";

/**
 * Barrel export voor de Persistent Presence. Eén mount-punt vanuit
 * layout.tsx: <PersistentPresenceRoot />. Hij wrapt Provider + Shell +
 * GlobalTriggers zodat alle pagina's 'm "gratis" krijgen.
 */

import { PresenceProvider } from "./PresenceContext";
import PersistentPresenceShell from "./PersistentPresenceShell";
import GlobalTriggers from "./GlobalTriggers";

export { usePresence, usePresenceOptional } from "./PresenceContext";
export { usePresencePosition } from "./usePresencePosition";
export type { PresenceAnchor, PresenceSize } from "./PresenceContext";

export default function PersistentPresenceRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PresenceProvider>
      {children}
      <PersistentPresenceShell />
      <GlobalTriggers />
    </PresenceProvider>
  );
}
