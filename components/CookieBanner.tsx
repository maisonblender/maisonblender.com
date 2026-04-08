'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = 'mb_cookie_consent';

function updateGtagConsent(analytics: boolean, marketing: boolean) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
    (window as unknown as { gtag: Function }).gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    });
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
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
  }, []);

  function save(analyticsVal: boolean, marketingVal: boolean) {
    const consent: CookieConsent = { necessary: true, analytics: analyticsVal, marketing: marketingVal };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    updateGtagConsent(analyticsVal, marketingVal);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl bg-white border border-black/[0.08] rounded-2xl shadow-xl shadow-black/[0.06]">
        {!showPreferences ? (
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
            <p className="flex-1 text-sm text-[#575760] leading-relaxed">
              Wij gebruiken cookies voor een optimale ervaring en het meten van websitegebruik.{' '}
              <Link
                href="/privacybeleid"
                className="text-[#1f1f1f] underline underline-offset-2 hover:no-underline"
              >
                Meer informatie
              </Link>
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 text-sm text-[#575760] border border-black/10 rounded-lg hover:border-black/20 transition-colors"
              >
                Voorkeuren
              </button>
              <button
                onClick={() => save(false, false)}
                className="px-4 py-2 text-sm text-[#575760] border border-black/10 rounded-lg hover:border-black/20 transition-colors"
              >
                Alleen noodzakelijk
              </button>
              <button
                onClick={() => save(true, true)}
                className="px-4 py-2 text-sm font-medium bg-[#4af0c4] text-[#1f1f1f] rounded-lg hover:bg-[#38ddb3] transition-colors"
              >
                Alles accepteren
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#1f1f1f]">Cookievoorkeuren</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-xs text-[#b2b2be] hover:text-[#575760] transition-colors"
              >
                ← Terug
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4 p-4 bg-[#f2f3f5] rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f]">Noodzakelijk</p>
                  <p className="text-xs text-[#575760] mt-0.5">
                    Vereist voor de basisfunctionaliteit van de website. Kunnen niet worden uitgeschakeld.
                  </p>
                </div>
                <span className="mt-0.5 text-xs text-[#b2b2be] shrink-0 self-center">Altijd aan</span>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 bg-[#f2f3f5] rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f]">Analytisch</p>
                  <p className="text-xs text-[#575760] mt-0.5">
                    Helpt ons begrijpen hoe bezoekers de site gebruiken (Google Analytics).
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={analytics}
                  aria-label="Analytische cookies"
                  onClick={() => setAnalytics(!analytics)}
                  className={`shrink-0 self-center w-10 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4af0c4] ${
                    analytics ? 'bg-[#4af0c4]' : 'bg-[#d0d0d8]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      analytics ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 bg-[#f2f3f5] rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f]">Marketing</p>
                  <p className="text-xs text-[#575760] mt-0.5">
                    Cookies voor gepersonaliseerde advertenties en remarketing.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={marketing}
                  aria-label="Marketing cookies"
                  onClick={() => setMarketing(!marketing)}
                  className={`shrink-0 self-center w-10 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4af0c4] ${
                    marketing ? 'bg-[#4af0c4]' : 'bg-[#d0d0d8]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      marketing ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => save(analytics, marketing)}
                className="px-5 py-2 text-sm font-medium bg-[#4af0c4] text-[#1f1f1f] rounded-lg hover:bg-[#38ddb3] transition-colors"
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
