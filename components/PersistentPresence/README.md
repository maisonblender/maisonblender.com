# Persistent Presence — "The Living Thread"

Site-wide Liquid Presence die door de hele website meereist met de bezoeker
en als altijd-beschikbare Ambassador-launcher fungeert.

## Architectuur

```
<PersistentPresenceRoot>                    (in app/layout.tsx)
 ├─ <PresenceProvider>                      (context: state, positie, open/close)
 │   ├─ {children}                          (alle pagina's)
 │   ├─ <PersistentPresenceShell>           (renders canvas + chat modal + morph)
 │   └─ <GlobalTriggers>                    (Cmd+K, selection, hover, scroll)
 └─ ...
```

## Wat het doet

1. **Persistent launcher** — klein Liquid Presence-canvas in de bottom-right
   van elke pagina (behalve `/brand-ambassador`), altijd zichtbaar.
2. **Click = fullscreen chat** — de launcher morpht via Framer Motion
   `layoutId` naar een fullscreen modal die de `AmbassadorWidget` lazy-loaded
   weergeeft. Dezelfde vorm, één wezen.
3. **Cmd/Ctrl + K** — opent de chat vanaf elke plek, Raycast-stijl.
4. **Text-selection nudge** — als de bezoeker >8 woorden selecteert, biedt
   de Presence een "Leg uit"-chip aan met de selectie als prefill.
5. **Hover-triggers** — elementen met `data-presence-trigger` triggeren na
   1.5s dwell een contextuele nudge.
6. **Scroll-bound state** — secties met `data-presence-state-hint` sturen
   de Presence-state tijdens scrollen (idle / listening / thinking / responding).

## Per-pagina gebruik

### Positie overrijden

```tsx
"use client";
import { usePresencePosition } from "@/components/PersistentPresence";

export default function MijnSectie() {
  usePresencePosition({
    anchor: { kind: "center-right" },
    size: "md",
  });
  return <section>…</section>;
}
```

Anchors: `{ kind: "corner", corner: "br" | "bl" | "tr" | "tl" }`,
`{ kind: "center-right" }`, `{ kind: "bottom-center" }`,
`{ kind: "hidden" }`, `{ kind: "coords", x, y }`.

Sizes: `"xs" | "sm" | "md" | "lg"` (56/80/112/160 px).

### Verbergen op specifieke pagina's

Server-component-vriendelijk:

```tsx
import HidePresence from "@/components/PersistentPresence/HidePresence";

export default function Page() {
  return (
    <>
      <HidePresence />
      {/* pagina-content */}
    </>
  );
}
```

### Hover-CTA triggers (HTML-only, geen hook nodig)

```tsx
<a
  href="/quickscan"
  data-presence-trigger="hero-quickscan"
  data-presence-hint="Vragen over de scan?"
  data-presence-chip="Vraag de Ambassador"
  data-presence-prefill="Kun je uitleggen wat de AI Impact Scan doet?"
>
  Start scan
</a>
```

### Scroll-bound state-hints

```tsx
<section data-presence-state-hint="thinking">
  {/* tijdens scroll op deze sectie → Presence versnelt / denkt-modus */}
</section>
```

## Programmatisch openen / pulsen

```tsx
"use client";
import { usePresence } from "@/components/PersistentPresence";

function MijnComponent() {
  const { open, pulse } = usePresence();
  return (
    <button onClick={() => open({ prefill: "Help me met X" })}>
      Chat nu
    </button>
  );
}
```

## A11y

- `prefers-reduced-motion`: alle morph-transitions worden 0s, canvas zelf
  respecteert dit ook via z'n eigen reduce-motion check.
- Esc sluit de chat-modal.
- Close-knop en launcher hebben `aria-label` + `focus-visible` ring.
- Tijdens fullscreen: body scroll-lock (via `AmbassadorWidget` z'n eigen
  effect).

## Performance

- `AmbassadorWidget` is `dynamic({ ssr: false })` — niet in initial JS bundle.
- Canvas pauzeert bij `document.hidden`.
- Op `anchor: "hidden"` rendert de shell niets — geen canvas-kosten.
- Nudges worden na `NUDGE_HINT_MS` (6s) automatisch opgeruimd.
- Triggers hebben `TRIGGER_COOLDOWN_MS` (8s) cooldown om spam te voorkomen.

## Z-index stack

- launcher: `z-[55]` (boven de nav `z-50`, onder mobile-menu `z-[60]`).
- modal: `z-[90]` (boven alles behalve close-button).
- close-button: `z-[100]`.
- cookie-banner (`z-50`): coördinatie via `body[data-cookie-banner="open"]`
  → launcher wordt verhoogd via CSS in `globals.css`.
