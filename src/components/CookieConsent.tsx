"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  hasCookieConsent,
  readStoredConsent,
  storeConsent,
  syncCookieConsent,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setVisible(readStoredConsent() === null);
  }, []);

  useEffect(() => {
    const onChange = () => setVisible(readStoredConsent() === null);
    window.addEventListener("cookie-consent-change", onChange);
    return () => window.removeEventListener("cookie-consent-change", onChange);
  }, []);

  const applyChoice = useCallback(async (accepted: boolean) => {
    setBusy(true);
    try {
      await syncCookieConsent(accepted);
      storeConsent(accepted ? "accepted" : "declined");
      setVisible(false);
    } catch {
      storeConsent(accepted ? "accepted" : "declined");
      setVisible(false);
    } finally {
      setBusy(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-live="polite">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-copy">
          <p id="cookie-consent-title" className="cookie-consent-title">
            Cookie consent
          </p>
          <p className="cookie-consent-text">
            QuantaScope uses essential cookies only — to keep you signed in and protect your session.
            We do not use advertising or third-party tracking cookies.{" "}
            <Link href="/about" className="cookie-consent-link">
              Learn more
            </Link>
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-consent-btn cookie-consent-btn-decline"
            disabled={busy}
            onClick={() => void applyChoice(false)}
          >
            Decline
          </button>
          <button
            type="button"
            className="cookie-consent-btn cookie-consent-btn-accept"
            disabled={busy}
            onClick={() => void applyChoice(true)}
          >
            Accept essential cookies
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook for auth forms — blocks sign-in until cookies are accepted. */
export function useCookieConsentRequired() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasCookieConsent());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsentStatus>).detail;
      setConsented(detail === "accepted");
    };
    window.addEventListener("cookie-consent-change", onChange);
    return () => window.removeEventListener("cookie-consent-change", onChange);
  }, []);

  return consented;
}
