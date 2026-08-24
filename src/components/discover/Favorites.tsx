"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/icons/Icon";

type FavoritesState = {
  ids: Set<string>;
  ready: boolean;
  signedIn: boolean;
  toggle: (restaurantId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesState>({
  ids: new Set(),
  ready: false,
  signedIn: false,
  toggle: async () => undefined,
  refresh: async () => undefined,
});

function hasRoleCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => part.trim().startsWith("nexora_role="));
}

async function readSession() {
  const res = await fetch("/api/auth/check", { credentials: "include" });
  if (!res.ok) return { signedIn: false, ids: [] as string[] };
  const favs = await fetch("/api/discover/me/favorites", { credentials: "include" })
    .then((r) => (r.ok ? r.json() : { ids: [] }))
    .catch(() => ({ ids: [] as string[] }));
  return { signedIn: true, ids: Array.isArray(favs?.ids) ? (favs.ids as string[]) : [] };
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ids, setIds] = useState<string[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await readSession();
      setSignedIn(next.signedIn);
      setIds(next.ids);
    } catch {
      setSignedIn(false);
      setIds([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [pathname, refresh]);

  const toggle = useCallback(async (restaurantId: string) => {
    const previous = ids;
    const already = previous.includes(restaurantId);
    setIds(already ? previous.filter((id) => id !== restaurantId) : [...previous, restaurantId]);
    const res = await fetch(`/api/discover/me/favorites/${encodeURIComponent(restaurantId)}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.status === 401) {
      setIds(previous);
      setSignedIn(false);
      throw new Error("UNAUTHENTICATED");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setIds(previous);
      throw new Error(data.error ?? data.message ?? "Could not save favorite");
    }
    setSignedIn(true);
    if (Array.isArray(data.ids)) setIds(data.ids);
  }, [ids]);

  const value = useMemo(
    () => ({ ids: new Set(ids), ready, signedIn, toggle, refresh }),
    [ids, ready, signedIn, toggle, refresh]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoriteButton({
  restaurantId,
  variant = "icon",
}: {
  restaurantId: string;
  variant?: "icon" | "button";
}) {
  const { ids, signedIn, toggle } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const saved = ids.has(restaurantId);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    const knownSignedIn = signedIn || hasRoleCookie();
    if (!knownSignedIn) {
      router.push(`/sign-in?from=${encodeURIComponent(pathname)}`);
      return;
    }
    setPending(true);
    try {
      await toggle(restaurantId);
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHENTICATED") {
        router.push(`/sign-in?from=${encodeURIComponent(pathname)}`);
      }
    } finally {
      setPending(false);
    }
  };

  if (variant === "button") {
    return (
      <button type="button" className="btn-secondary min-h-11" onClick={onClick} disabled={pending} aria-pressed={saved}>
        <Icon name="heart" size={16} filled={saved} className={saved ? "text-primary" : ""} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`nx-fav ${saved ? "is-on" : ""}`}
      aria-label={saved ? "Remove from favorites" : "Save restaurant"}
      aria-pressed={saved}
      disabled={pending}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
    >
      <Icon name="heart" size={16} filled={saved} />
    </button>
  );
}

export function ShareButton({ title }: { title: string }) {
  const onClick = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
  };
  return (
    <button type="button" className="btn-secondary min-h-11" onClick={onClick}>
      <Icon name="share" size={16} />
      Share
    </button>
  );
}
