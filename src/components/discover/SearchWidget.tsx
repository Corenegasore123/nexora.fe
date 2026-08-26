"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Search } from "lucide-react";
import { DatePicker, PlacePicker, TimePicker } from "@/components/discover/FinderPickers";
import { clampDateToToday, todayKigali } from "@/lib/dates";
import { cityToPlace, placeToCityFilter } from "@/lib/rwanda-places";

export function SearchWidget({
  defaults,
  variant = "hero",
  action = "/discover",
}: {
  defaults?: { city?: string; date?: string; time?: string; guests?: string; q?: string };
  variant?: "hero" | "compact";
  action?: string;
}) {
  const router = useRouter();
  const [place, setPlace] = useState(() => cityToPlace(defaults?.city));
  const [date, setDate] = useState(() => clampDateToToday(defaults?.date ?? todayKigali()));
  const [time, setTime] = useState(defaults?.time ?? "19:00");
  const [guests, setGuests] = useState(() => {
    const n = Number(defaults?.guests);
    return Number.isFinite(n) && n >= 1 ? Math.min(20, Math.floor(n)) : 2;
  });
  const [q, setQ] = useState(defaults?.q ?? "");

  const bumpGuests = (delta: number) => {
    setGuests((n) => Math.min(20, Math.max(1, n + delta)));
  };

  const go = (e?: FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    const city = placeToCityFilter(place);
    if (city.trim()) params.set("city", city.trim());
    params.set("date", clampDateToToday(date));
    params.set("time", time);
    params.set("guests", String(guests));
    if (q.trim()) params.set("q", q.trim());
    router.push(`${action}?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={go} className={`nx-finder ${variant === "hero" ? "nx-finder-hero" : "nx-finder-compact"}`}>
      <div className="nx-finder-field flex flex-col">
        <span>Where</span>
        <PlacePicker value={place} onChange={setPlace} />
      </div>
      <span className="nx-finder-rule" aria-hidden />
      <label className="nx-finder-field nx-finder-grow flex flex-col">
        <span>Search</span>
        <span className="nx-finder-control">
          <Search size={16} strokeWidth={1.85} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cuisine, dish, restaurant" />
        </span>
      </label>
      <span className="nx-finder-rule" aria-hidden />
      <div className="nx-finder-field flex flex-col">
        <span>Date</span>
        <DatePicker value={date} onChange={(next) => setDate(clampDateToToday(next))} />
      </div>
      <span className="nx-finder-rule hidden md:block" aria-hidden />
      <div className="nx-finder-field hidden md:flex md:flex-col">
        <span>Time</span>
        <TimePicker value={time} onChange={setTime} />
      </div>
      <span className="nx-finder-rule" aria-hidden />
      <div className="nx-finder-field nx-finder-guests flex flex-col">
        <span>Guests</span>
        <span className="nx-finder-control nx-stepper">
          <button
            type="button"
            className="nx-stepper-btn"
            aria-label="Fewer guests"
            disabled={guests <= 1}
            onClick={() => bumpGuests(-1)}
          >
            <Minus size={14} strokeWidth={2} />
          </button>
          <span className="nx-stepper-value" aria-live="polite">
            {guests}
          </span>
          <button
            type="button"
            className="nx-stepper-btn"
            aria-label="More guests"
            disabled={guests >= 20}
            onClick={() => bumpGuests(1)}
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </span>
      </div>
      <button type="submit" className="btn-primary nx-finder-submit">
        Find a Table
      </button>
    </form>
  );
}

export function DiscoverFilters({
  values,
  basePath = "/discover",
}: {
  values: Record<string, string | undefined>;
  basePath?: string;
}) {
  const router = useRouter();

  const apply = (patch: Record<string, string>) => {
    const next = new URLSearchParams();
    const merged = { ...values, ...patch };
    for (const [k, v] of Object.entries(merged)) {
      if (v) next.set(k, v);
    }
    next.delete("page");
    router.push(`${basePath}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="nx-filters">
      <select value={values.cuisine ?? ""} onChange={(e) => apply({ cuisine: e.target.value })}>
        <option value="">Cuisine</option>
        <option>Rwandan</option>
        <option>Italian</option>
        <option>Indian</option>
        <option>Japanese</option>
        <option>Grill</option>
        <option>Cafe</option>
        <option>Seafood</option>
        <option>French</option>
      </select>
      <select value={values.price ?? ""} onChange={(e) => apply({ price: e.target.value })}>
        <option value="">Price</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>
      <select value={values.rating ?? ""} onChange={(e) => apply({ rating: e.target.value })}>
        <option value="">Rating</option>
        <option value="4">4.0+</option>
        <option value="4.5">4.5+</option>
      </select>
      <select value={values.feature ?? ""} onChange={(e) => apply({ feature: e.target.value })}>
        <option value="">Features</option>
        <option value="outdoor">Outdoor seating</option>
        <option value="date night">Date night</option>
        <option value="family">Family friendly</option>
        <option value="groups">Groups</option>
        <option value="open late">Open late</option>
        <option value="business">Business dining</option>
        <option value="vegetarian">Vegetarian</option>
      </select>
      <label className="nx-check">
        <input type="checkbox" checked={values.openNow === "1"} onChange={(e) => apply({ openNow: e.target.checked ? "1" : "" })} />
        Open now
      </label>
      <label className="nx-check">
        <input type="checkbox" checked={values.available === "1"} onChange={(e) => apply({ available: e.target.checked ? "1" : "" })} />
        Available
      </label>
      <select value={values.sort ?? "recommended"} onChange={(e) => apply({ sort: e.target.value })}>
        <option value="recommended">Recommended</option>
        <option value="rating">Highest rated</option>
        <option value="reviews">Most reviewed</option>
        <option value="price">Price</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}
