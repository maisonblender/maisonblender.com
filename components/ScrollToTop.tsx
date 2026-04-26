"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Garandeert dat elke client-side route change bovenaan de pagina start.
 *
 * Next.js App Router scrollt standaard naar top, maar mist dat soms wanneer
 * de navigatie vanuit een diepe scroll-positie komt (bijv. footer-links) of
 * wanneer de browser native scroll restoration de positie bewaart. Deze
 * component forceert scroll (0,0) bij elke pathname-change, behalve wanneer
 * er een hash-anchor in de URL staat - dan respecteren we het natuurlijke
 * anchor-gedrag (bijv. /#contact vanaf een andere pagina).
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
