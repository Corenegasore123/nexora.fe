"use client"; 

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  getMe,
  logout,
  myFavorites,
  myReservations,
  myReviews,
  updateMe,
  type AuthUser,
} from "@/lib/api";
import { AccountShell } from "@/components/account/AccountShell";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "N";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function joined(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Africa/Kigali" });
}

export default function AccountProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [counts, setCounts] = useState({ reservations: 0, favorites: 0, reviews: 0 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then((me) => {
        setUser(me);
        setName(me.name ?? "");
        setPhone(me.phone ?? "");
      })
      .catch(() => setUser(null));
    Promise.all([
      myReservations().catch(() => []),
      myFavorites().catch(() => ({ items: [] })),
      myReviews().catch(() => []),
    ]).then(([reservations, favs, reviews]) => {
      setCounts({
        reservations: reservations.length,
        favorites: favs.items?.length ?? 0,
        reviews: reviews.length,
      });
    });
  }, []);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const next = await updateMe({ name: name.trim(), phone: phone.trim() });
      setUser(next);
      setMessage("Profile saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountShell title="Profile." subtitle="How other diners and restaurants see you on Nexora.">
      <div className="nx-review flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid size-20 shrink-0 place-items-center rounded-full bg-coral-soft font-display text-2xl font-medium text-coral">
          {initials(user?.name ?? name)}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">{user?.name ?? "—"}</h2>
          <p className="mt-1 text-sm text-foreground-secondary">{user?.email}</p>
          <p className="mt-2 flex flex-wrap gap-1.5">
            <span className="nx-chip nx-chip-featured">Diner</span>
            <span className="nx-chip">Member since {joined(user?.createdAt)}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link href="/account/reservations" className="nx-review no-underline">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground-muted">Reservations</p>
          <p className="mt-2 font-display text-3xl font-medium tracking-tight">{counts.reservations}</p>
        </Link>
        <Link href="/account/favorites" className="nx-review no-underline">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground-muted">Favorites</p>
          <p className="mt-2 font-display text-3xl font-medium tracking-tight">{counts.favorites}</p>
        </Link>
        <Link href="/account/reviews" className="nx-review no-underline">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground-muted">Reviews</p>
          <p className="mt-2 font-display text-3xl font-medium tracking-tight">{counts.reviews}</p>
        </Link>
      </div>

      <form onSubmit={onSave} className="nx-review mt-8 space-y-5">
        <h3 className="font-display text-xl font-medium tracking-tight">Personal details</h3>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Full name</span>
          <input
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Email</span>
          <input className="w-full rounded-xl border border-border bg-pending-bg px-3 py-2.5 text-foreground-muted" value={user?.email ?? ""} disabled />
          <span className="mt-1.5 block text-xs text-foreground-muted">Email is used to sign in and cannot be changed here.</span>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Phone</span>
          <input
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+250 7…"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <p className="text-sm">
            <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground-muted">Language</span>
            <span className="mt-1.5 block">{user?.language === "en" ? "English" : user?.language ?? "English"}</span>
          </p>
          <p className="text-sm">
            <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground-muted">Timezone</span>
            <span className="mt-1.5 block">{user?.timezone ?? "Africa/Kigali"}</span>
          </p>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        {message && <p className="text-sm text-success">{message}</p>}
        <button className="btn-primary min-h-11" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/restaurants" className="btn-primary min-h-11">
          Find a table
        </Link>
        <button
          type="button"
          className="btn-secondary min-h-11"
          onClick={async () => {
            await logout();
            router.push("/");
            router.refresh();
          }}
        >
          Sign out
        </button>
      </div>
    </AccountShell>
  );
}
