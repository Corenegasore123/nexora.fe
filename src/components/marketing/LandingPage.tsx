"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { discoverRestaurants, type PublicRestaurant } from "@/lib/api";
import { RatingStars } from "@/components/discover/RatingStars";
import { clampDateToToday, todayKigali } from "@/lib/dates";

export function LandingPage() {
  const [city, setCity] = useState("Kigali");
  const [date, setDate] = useState(todayKigali());
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(4);
  const [cuisine, setCuisine] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [results, setResults] = useState<PublicRestaurant[] | null>(null);

  const search = async (e?: FormEvent) => {
    e?.preventDefault();
    const rows = await discoverRestaurants({
      city,
      cuisine: cuisine || undefined,
      price: price || undefined,
      rating: rating || undefined,
    });
    setResults(rows);
  };

  useEffect(() => {
    search().catch(() => setResults([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="page-shell pt-28">
        <p className="eyebrow">Nexora</p>
        <h1 className="page-title max-w-3xl">Find your next dining experience.</h1>
        <p className="page-subtitle">Discover. Book. Dine. Search live restaurant availability across the city.</p>
        <form onSubmit={search} className="mt-8 grid gap-3 rounded-2xl border border-border bg-surface-elevated p-4 md:grid-cols-5">
          <label className="text-sm">
            Where?
            <input className="mt-1 w-full rounded-lg border border-border px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="text-sm">
            Date
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              type="date"
              min={todayKigali()}
              value={date}
              onChange={(e) => setDate(clampDateToToday(e.target.value))}
            />
          </label>
          <label className="text-sm">
            Time
            <input className="mt-1 w-full rounded-lg border border-border px-3 py-2" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label className="text-sm">
            Guests
            <input className="mt-1 w-full rounded-lg border border-border px-3 py-2" type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          </label>
          <button className="btn-primary self-end" type="submit">
            Find Restaurants
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <select className="rounded-lg border border-border px-3 py-2" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">Cuisine</option>
            <option>Rwandan</option>
            <option>African</option>
            <option>Grill</option>
            <option>International</option>
          </select>
          <select className="rounded-lg border border-border px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">Price</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
          </select>
          <select className="rounded-lg border border-border px-3 py-2" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">Rating</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
          <button className="btn-secondary" type="button" onClick={() => search()}>
            Apply filters
          </button>
        </div>
      </section>

      <section className="page-shell">
        <h2 className="text-2xl font-bold">Restaurants in {city || "your city"}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(results ?? []).map((r) => (
            <article key={r.id} className="card-raised">
              <p className="text-xs uppercase tracking-wider text-accent">{r.cuisine}</p>
              <h3 className="mt-2 text-xl font-semibold">{r.name}</h3>
              <p className="mt-1 text-sm">
                <RatingStars value={r.rating} count={r.reviewCount} compact />
              </p>
              <p className="mt-1 text-sm text-foreground-secondary">{r.branch} · {r.priceTier}</p>
              <p className="mt-3 text-sm text-success">{r.available ? "Available today" : "Fully booked"}</p>
              <Link href={`/restaurants/${r.slug}?date=${date}&time=${time}&guests=${guests}`} className="btn-secondary mt-4 inline-flex">
                View Restaurant
              </Link>
            </article>
          ))}
          {results && !results.length && <p className="text-sm text-foreground-muted">No restaurants match that search.</p>}
          {!results && <p className="text-sm text-foreground-muted">Search to see restaurants you can book.</p>}
        </div>
      </section>
    </div>
  );
}
