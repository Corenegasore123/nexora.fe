export const CONSENT_COOKIE = "quantscope_cookie_consent";
export const CONSENT_STORAGE_KEY = "quantscope_cookie_consent";

export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** Banner stays until the user accepts — decline does not persist. */
export function shouldShowConsentBanner(): boolean {
  return !hasCookieConsent();
}

export function storeConsentAccepted() {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
  window.dispatchEvent(new CustomEvent("cookie-consent-change"));
}

export function clearStoredConsent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("cookie-consent-change"));
}

export async function syncCookieConsent(accepted: boolean): Promise<void> {
  const { apiFetch } = await import("./api");
  await apiFetch<{ ok: boolean }>("/api/consent/cookies", {
    method: "POST",
    body: JSON.stringify({ accepted }),
  });
}
