"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import {
  hasCookieConsent,
  shouldShowConsentBanner,
  storeConsentAccepted,
  syncCookieConsent,
} from "@/lib/cookie-consent";

const COOKIE_DETAILS = [
  {
    name: "Cookie preferences",
    purpose: "Remembers that you accepted essential cookies on QuantaScope.",
    type: "Essential",
  },
  {
    name: "Sign-in session",
    purpose: "Keeps you securely signed in to your workspace after login.",
    type: "Essential",
  },
  {
    name: "Workspace role",
    purpose: "Stores your role so the app can show the correct access level.",
    type: "Essential",
  },
] as const;

function CookieDetailsOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="cookie-consent-overlay" role="presentation">
      <button
        type="button"
        className="cookie-consent-overlay-backdrop"
        aria-label="Close cookie details"
        onClick={onClose}
      />
      <div
        className="cookie-consent-overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-details-title"
      >
        <div className="cookie-consent-overlay-header">
          <div>
            <p className="cookie-consent-overlay-eyebrow">Privacy</p>
            <h2 id="cookie-details-title" className="cookie-consent-overlay-title">
              How we use cookies
            </h2>
          </div>
          <button
            type="button"
            className="cookie-consent-overlay-close"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="cookie-consent-overlay-body">
          <p className="cookie-consent-overlay-intro">
            QuantaScope uses a small set of <strong>essential cookies</strong> required for
            authentication and security. We do not use advertising, analytics, or third-party
            tracking cookies.
          </p>

          <div className="cookie-consent-table-wrap">
            <table className="cookie-consent-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {COOKIE_DETAILS.map((row) => (
                  <tr key={row.name}>
                    <td>
                      <span className="cookie-consent-name">{row.name}</span>
                      <span className="cookie-consent-tag">{row.type}</span>
                    </td>
                    <td>{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="cookie-consent-overlay-list">
            <li>The consent banner stays visible on each visit until you accept essential cookies.</li>
            <li>Session cookies are only set after you accept and sign in.</li>
            <li>Cookies are httpOnly and transmitted only over secure connections in production.</li>
          </ul>
        </div>

        <div className="cookie-consent-overlay-footer">
          <button type="button" className="cookie-consent-btn cookie-consent-btn-accept" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    setVisible(shouldShowConsentBanner());
  }, []);

  useEffect(() => {
    const onChange = () => setVisible(shouldShowConsentBanner());
    window.addEventListener("cookie-consent-change", onChange);
    return () => window.removeEventListener("cookie-consent-change", onChange);
  }, []);

  const applyChoice = useCallback(async (accepted: boolean) => {
    setBusy(true);
    setDetailsOpen(false);
    try {
      if (accepted) {
        await syncCookieConsent(true);
        storeConsentAccepted();
        setVisible(false);
      } else {
        await syncCookieConsent(false);
        setVisible(true);
      }
    } catch {
      if (accepted) {
        storeConsentAccepted();
        setVisible(false);
      } else {
        setVisible(true);
      }
    } finally {
      setBusy(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <>
      {detailsOpen && <CookieDetailsOverlay onClose={() => setDetailsOpen(false)} />}

      <div className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-live="polite">
        <div className="cookie-consent-inner">
          <div className="cookie-consent-copy">
            <p id="cookie-consent-title" className="cookie-consent-title">
              Cookie consent
            </p>
            <p className="cookie-consent-text">
              QuantaScope uses essential cookies only — to keep you signed in and protect your session.
              We do not use advertising or third-party tracking cookies.{" "}
              <button
                type="button"
                className="cookie-consent-link"
                onClick={() => setDetailsOpen(true)}
              >
                Learn more
              </button>
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
    </>
  );
}

/** Hook for auth forms — blocks sign-in until cookies are accepted. */
export function useCookieConsentRequired() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasCookieConsent());
    const onChange = () => setConsented(hasCookieConsent());
    window.addEventListener("cookie-consent-change", onChange);
    return () => window.removeEventListener("cookie-consent-change", onChange);
  }, []);

  return consented;
}
