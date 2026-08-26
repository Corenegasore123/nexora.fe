"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, getAvailability, getMe, publicBook, type AuthUser } from "@/lib/api";
import type { PublicProfile } from "@/lib/public";
import { RatingStars } from "@/components/discover/RatingStars";
import { clampDateToToday, todayKigali } from "@/lib/dates";

export function BookingWidget({ restaurant }: { restaurant: PublicProfile }) {
  const router = useRouter();
  const [date, setDate] = useState(todayKigali());
  const [guests, setGuests] = useState(2);
  const [slots, setSlots] = useState<{ time: string; available: number; label: string }[]>([]);
  const [time, setTime] = useState("");
  const [me, setMe] = useState<AuthUser | null>(null);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((session) => {
        if (session?.role !== "CUSTOMER") return;
        return getMe().then((u) => {
          setMe(u);
          setGuest({ name: u.name, email: u.email, phone: u.phone ?? "" });
        });
      })
      .catch(() => setMe(null));
  }, []);

  const searchSlots = async (e?: FormEvent) => {
    e?.preventDefault();
    const rows = await getAvailability(restaurant.slug, date, guests);
    setSlots(rows);
  };

  useEffect(() => {
    searchSlots().catch(() => setSlots([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.slug]);

  const book = async (e: FormEvent) => {
    e.preventDefault();
    if (!time) return;
    setBusy(true);
    setError(null);
    try {
      const res = await publicBook({
        restaurantId: restaurant.id,
        branchId: restaurant.branches[0]?.id,
        date,
        time,
        guests,
        name: guest.name,
        email: guest.email || undefined,
        phone: guest.phone || undefined,
      });
      const p = res.public;
      const q = new URLSearchParams({
        number: p.number,
        restaurant: p.restaurant,
        slug: p.restaurantSlug || restaurant.slug,
        date: p.date,
        time: p.time,
        guests: String(p.guests),
      });
      if (p.email) q.set("email", p.email);
      if (p.phone) q.set("phone", p.phone);
      router.push(`/reservations/confirmation?${q.toString()}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not book that table");
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="nx-book">
      <p className="eyebrow">Book a table</p>
      <form onSubmit={searchSlots} className="mt-4 space-y-3">
        <label className="block text-sm">
          Date
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2.5"
            type="date"
            min={todayKigali()}
            value={date}
            onChange={(e) => setDate(clampDateToToday(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          Guests
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2.5"
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </label>
        <button className="btn-secondary w-full min-h-11" type="submit">
          Search availability
        </button>
      </form>
      <div className="mt-3 space-y-2">
        {slots.map((s) => (
          <button
            key={s.time}
            type="button"
            disabled={!s.available}
            onClick={() => setTime(s.time)}
            className={`min-h-11 w-full rounded-lg border px-3 py-2 text-left text-sm ${time === s.time ? "border-primary bg-primary-soft text-primary" : "border-border"} ${!s.available ? "opacity-40" : ""}`}
          >
            {s.time} · {s.label}
          </button>
        ))}
      </div>
      {time && (
        <form onSubmit={book} className="mt-4 space-y-3 border-t border-border pt-4">
          <p className="text-sm font-medium">{me ? "Confirm as your diner account" : "Guest details - no account required"}</p>
          {!me && (
            <>
              <input
                className="w-full rounded-lg border border-border px-3 py-2.5"
                placeholder="Name"
                value={guest.name}
                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                required
              />
              <input
                className="w-full rounded-lg border border-border px-3 py-2.5"
                placeholder="Email"
                type="email"
                value={guest.email}
                onChange={(e) => setGuest({ ...guest, email: e.target.value })}
              />
              <input
                className="w-full rounded-lg border border-border px-3 py-2.5"
                placeholder="Phone"
                value={guest.phone}
                onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
              />
              {!guest.email && !guest.phone && (
                <p className="text-xs text-foreground-muted">Add email or phone so you can look up this booking later.</p>
              )}
              <p className="text-xs text-foreground-muted">
                Prefer an account? <Link href="/sign-up">Create one</Link> to save reservations.
              </p>
            </>
          )}
          {me && (
            <p className="text-sm text-foreground-secondary">
              {me.name} · {me.email}
              {me.phone ? ` · ${me.phone}` : ""}
            </p>
          )}
          {error && <p className="text-sm text-error">{error}</p>}
          <button className="btn-primary w-full min-h-11" disabled={busy || (!me && !guest.email && !guest.phone)}>
            {busy ? "Booking…" : "Confirm booking"}
          </button>
        </form>
      )}
    </aside>
  );
}

export function StickyBookBar({ restaurant }: { restaurant: PublicProfile }) {
  return (
    <div className="nx-sticky-book lg:hidden">
      <div>
        <p className="text-sm font-semibold">{restaurant.name}</p>
        <p className="text-xs text-foreground-muted">
          <RatingStars value={restaurant.rating} size={12} compact /> · Open until {restaurant.openUntil}
        </p>
      </div>
      <a href="#book" className="btn-primary min-h-11 px-5">
        Book a Table
      </a>
    </div>
  );
}
