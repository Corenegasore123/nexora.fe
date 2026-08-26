import type { Metadata } from "next";
import Link from "next/link";
import { fetchCities } from "@/lib/public";

export const metadata: Metadata = {
  title: "About Nexora",
  description: "Nexora helps you discover where to eat in Rwanda and book a table. A diner-first restaurant discovery product.",
};

export default async function AboutPage() {
  const cities = await fetchCities().catch(() => []);

  return (
    <div className="nx-discover">
      <p className="eyebrow">About</p>
      <h1 className="nx-page-title">Discover where to eat. Book your table.</h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
        Nexora is for people who want somewhere great to eat tonight - not a restaurant dashboard. Search by city, cuisine, or neighborhood, see who is open, and reserve a table.
      </p>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          { step: "01", title: "Find a place", body: "Browse restaurants across Rwanda. Filter by cuisine, price, rating, and what’s open now." },
          { step: "02", title: "Book a table", body: "Pick a date, time, and party size. Availability comes from the restaurant’s real tables - not a placeholder calendar." },
          { step: "03", title: "Show up", body: "You get a confirmation. The restaurant sees the booking. Dinner is the point." },
        ].map((item) => (
          <article key={item.step} className="rounded-2xl border border-border bg-surface-elevated p-6">
            <p className="font-mono text-xs text-primary">{item.step}</p>
            <h2 className="nx-section-title mt-3">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="nx-section-title">Where Nexora is live</h2>
        <p className="mt-2 max-w-xl text-sm text-foreground-muted">
          The catalog starts in Rwanda. Every city uses the same discovery model - restaurants, neighborhoods, and tonight’s availability.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link href={`/cities/${city.slug}`} className="nx-chip-link">
                {city.name}
                <span className="ml-2 text-foreground-muted">{city.restaurantCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
