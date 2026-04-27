"use client";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "mb_cookie_consent";

function updateGtagConsent(analytics: boolean, marketing: boolean) {
  if (
    typeof window !== "undefined" &&
    typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === "function"
  ) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const prefsButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- consent UI na client mount + localStorage */
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else {
      try {
        const consent: CookieConsent = JSON.parse(stored);
        updateGtagConsent(consent.analytics, consent.marketing);
      } catch {
        setVisible(true);
      }
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Publiceer banner-zichtbaarheid naar document.body zodat andere
  // site-wide UI-elementen (bv. de Liquid Presence launcher) hun positie
  // kunnen offsetten om niet te overlappen met deze bottom-bar.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (visible) {
      document.body.dataset.cookieBanner = "open";
    } else {
      delete document.body.dataset.cookieBanner;
    }
    return () => {
      delete document.body.dataset.cookieBanner;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const t = window.requestAnimationFrame(() => {
      if (showPreferences) return;
      prefsButtonRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(t);
  }, [visible, showPreferences]);

  useEffect(() => {
    if (!visible || !showPreferences) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowPreferences(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible, showPreferences]);

  function save(analyticsVal: boolean, marketingVal: boolean) {
    const consent: CookieConsent = { necessary: true, analytics: analyticsVal, marketing: marketingVal };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    updateGtagConsent(analyticsVal, marketingVal);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-live="polite"
    >
      <div className="mx-auto max-w-5xl rounded-2xl border border-black/[0.08] bg-white shadow-xl shadow-black/[0.06]">
        <h2 id={titleId} className="sr-only">
          Cookie-instellingen
        </h2>
        {!showPreferences ? (
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
            <p id={descId} className="flex-1 text-sm leading-relaxed text-[#575760]">
              Wij gebruiken cookies voor een optimale ervaring en het meten van websitegebruik.{" "}
              <Link
                href="/privacybeleid"
                className="text-[#1f1f1f] underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              >
                Meer informatie
              </Link>
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                ref={prefsButtonRef}
                type="button"
                onClick={() => setShowPreferences(true)}
                className="rounded-lg border border-black/10 px-4 py-3 text-sm text-[#575760] transition-colors hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              >
                Voorkeuren
              </button>
              <button
                type="button"
                onClick={() => save(false, false)}
                className="rounded-lg border border-black/10 px-4 py-3 text-sm text-[#575760] transition-colors hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              >
                Alleen noodzakelijk
              </button>
              <button
                type="button"
                onClick={() => save(true, true)}
                className="rounded-lg bg-[#4af0c4] px-4 py-3 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#38ddb3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              >
                Alles accepteren
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#1f1f1f]">Cookievoorkeuren</h3>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="text-xs text-[#6b6b75] transition-colors hover:text-[#575760] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              >
                ← Terug
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4 rounded-xl bg-[#f2f3f5] p-4">
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f]">Noodzakelijk</p>
                  <p className="mt-0.5 text-xs text-[#575760]">
                    Vereist voor de basisfunctionaliteit van de website. Kunnen niet worden uitgeschakeld.
                  </p>
                </div>
                <span className="mt-0.5 shrink-0 self-center text-xs text-[#6b6b75]">Altijd aan</span>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-xl bg-[#f2f3f5] p-4">
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f]">Analytisch</p>
                  <p className="mt-0.5 text-xs text-[#575760]">
                    Helpt ons begrijpen hoe bezoekers de site gebruiken (Google Analytics).
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  aria-label="Analytische cookies"
                  onClick={() => setAnalytics(!analytics)}
                  className="flex min-h-11 min-w-11 shrink-0 items-center justify-center self-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4af0c4] focus-visible:ring-offset-2"
                >
                  <span
                    className={`relative h-6 w-10 rounded-full transition-colors ${
                      analytics ? "bg-[#4af0c4]" : "bg-[#d0d0d8]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        analytics ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </span>
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-xl bg-[#f2f3f5] p-4">
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f]">Marketing</p>
                  <p className="mt-0.5 text-xs text-[#575760]">
                    Cookies voor gepersonaliseerde advertenties en remarketing.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketing}
                  aria-label="Marketing cookies"
                  onClick={() => setMarketing(!marketing)}
                  className="flex min-h-11 min-w-11 shrink-0 items-center justify-center self-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4af0c4] focus-visible:ring-offset-2"
                >
                  <span
                    className={`relative h-6 w-10 rounded-full transition-colors ${
                      marketing ? "bg-[#4af0c4]" : "bg-[#d0d0d8]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        marketing ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => save(analytics, marketing)}
                className="rounded-lg bg-[#4af0c4] px-5 py-3 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#38ddb3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
              >
                Voorkeuren opslaan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
