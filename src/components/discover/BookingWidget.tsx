"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, getAvailability, publicBook, type AuthUser } from "@/lib/api";
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
    let cancelled = false;
    (async () => {
      try {
        const check = await fetch("/api/auth/check", { credentials: "include" });
        if (!check.ok) return;
        const session = await check.json();
        if (session?.role !== "CUSTOMER") return;
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!meRes.ok) return;
        const u = (await meRes.json()) as AuthUser;
        if (cancelled) return;
        setMe(u);
        setGuest({ name: u.name, email: u.email, phone: u.phone ?? "" });
      } catch {
        if (!cancelled) setMe(null);
      }
    })();
    return () => {
      cancelled = true;
    };
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

  useEffect(() => {
    if (!time) return;
    const el = document.getElementById("nx-book-confirm");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [time]);

  const book = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!time || busy) return;
    setBusy(true);
    setError(null);
    try {
      const name = (me?.name || guest.name).trim();
      const email = (me?.email || guest.email).trim() || undefined;
      const phone = (me?.phone || guest.phone || "").trim() || undefined;
      if (!name) {
        setError("Guest name is required");
        return;
      }
      if (!me && !email && !phone) {
        setError("Add an email or phone so you can look up this booking later.");
        return;
      }

      const res = await publicBook({
        restaurantId: restaurant.id,
        branchId: restaurant.branches[0]?.id,
        date,
        time,
        guests,
        name,
        email,
        phone,
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
      if (me) q.set("account", "1");
      router.push(`/reservations/confirmation?${q.toString()}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not book that table");
    } finally {
      setBusy(false);
    }
  };

  const canConfirm = Boolean(time) && !busy && Boolean(me || guest.email || guest.phone);

  return (
    <>
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
          <form id="nx-book-confirm" onSubmit={book} className="mt-4 space-y-3 border-t border-border pt-4">
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
            <button type="submit" className="btn-primary w-full min-h-11" disabled={!canConfirm}>
              {busy ? "Booking…" : "Confirm booking"}
            </button>
          </form>
        )}
      </aside>

      <div className="nx-sticky-book lg:hidden">
        <div>
          <p className="text-sm font-semibold">{restaurant.name}</p>
          <p className="text-xs text-foreground-muted">
            <RatingStars value={restaurant.rating} size={12} compact /> · Open until {restaurant.openUntil}
          </p>
        </div>
        {time ? (
          <button type="submit" form="nx-book-confirm" className="btn-primary min-h-11 px-5" disabled={!canConfirm}>
            {busy ? "Booking…" : "Confirm"}
          </button>
        ) : (
          <a href="#book" className="btn-primary min-h-11 px-5">
            Book a Table
          </a>
        )}
      </div>
    </>
  );
}

/** @deprecated sticky bar now renders from BookingWidget */
export function StickyBookBar(_props: { restaurant: PublicProfile }) {
  return null;
}
