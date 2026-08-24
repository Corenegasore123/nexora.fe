"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ApiError, lookupReservation } from "@/lib/api";

export default function LookupReservationPage() {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    number: string;
    status: string;
    date: string;
    time: string;
    guests: number;
    restaurant: string;
    restaurantSlug: string | null;
    address: string;
    table: string | null;
    name: string;
  } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const row = await lookupReservation({
        number,
        email: email || undefined,
        phone: phone || undefined,
      });
      setResult(row);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reservation not found");
    }
  };

  return (
    <div className="nx-discover mx-auto max-w-lg px-4 py-16">
      <p className="eyebrow">Guest booking</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">Find your reservation</h1>
      <p className="mt-3 text-sm text-foreground-secondary">
        Enter the confirmation reference plus the email or phone used when booking.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input
          className="w-full rounded-lg border border-border px-3 py-2.5 font-mono"
          placeholder="RES-0001"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border border-border px-3 py-2.5"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-border px-3 py-2.5"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button className="btn-primary w-full min-h-11" type="submit">
          Look up
        </button>
      </form>
      {result && (
        <article className="nx-card mt-8 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">{result.number}</p>
          <h2 className="mt-2 font-display text-2xl font-medium">{result.restaurant}</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            {String(result.date).slice(0, 10)} · {result.time} · {result.guests} guests · {result.status}
          </p>
          <p className="mt-1 text-sm text-foreground-muted">{result.name}{result.table ? ` · Table ${result.table}` : ""}</p>
          {result.restaurantSlug && (
            <Link href={`/restaurants/${result.restaurantSlug}`} className="mt-4 inline-flex text-sm font-medium text-primary">
              View restaurant
            </Link>
          )}
        </article>
      )}
    </div>
  );
}
