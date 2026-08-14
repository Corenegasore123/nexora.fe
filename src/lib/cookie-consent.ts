export const CONSENT_COOKIE = "quantscope_cookie_consent";
export const CONSENT_STORAGE_KEY = "quantscope_cookie_consent";

export type CookieConsentStatus = "accepted" | "declined";

export function readStoredConsent(): CookieConsentStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "accepted" || value === "declined") return value;
    return null;
  } catch {
    return null;
  }
}

export function storeConsent(status: CookieConsentStatus) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: status }));
}

export function hasCookieConsent(): boolean {
  return readStoredConsent() === "accepted";
}

export async function syncCookieConsent(accepted: boolean): Promise<void> {
  const { apiFetch } = await import("./api");
  await apiFetch<{ ok: boolean }>("/api/consent/cookies", {
    method: "POST",
    body: JSON.stringify({ accepted }),
  });
}
