import type { Metadata } from "next";
import Link from "next/link";
import { fetchCities } from "@/lib/public";
import { RwandaCoverageMap } from "@/components/discover/RwandaCoverageMap";

export const metadata: Metadata = {
  title: "About Nexora",
  description: "Nexora helps you discover where to eat in Rwanda and book a table. See where we are live today.",
};

export default async function AboutPage() {
  const cities = await fetchCities().catch(() => []);
  const liveFeatured = cities.filter((c) => c.featured && c.restaurantCount > 0);
  const counts = Object.fromEntries(cities.map((c) => [c.name, c.restaurantCount]));

  return (
    <div className="nx-about">
      <section className="nx-about-hero">
        <p className="eyebrow">About Nexora</p>
        <h1 className="nx-about-title">Discover where to eat. Book your table.</h1>
        <p className="nx-about-lead">
          Nexora is for people who want somewhere great to eat tonight - not a restaurant dashboard. Search by city,
          cuisine, or neighborhood, see who is open, and reserve a table.
        </p>
      </section>

      <section className="nx-about-steps">
        {[
          { step: "01", title: "Find a place", body: "Browse restaurants across Rwanda. Filter by cuisine, price, rating, and what's open now." },
          { step: "02", title: "Book a table", body: "Pick a date, time, and party size. Availability comes from the restaurant's real tables." },
          { step: "03", title: "Show up", body: "You get a confirmation. The restaurant sees the booking. Dinner is the point." },
        ].map((item) => (
          <article key={item.step} className="nx-about-step">
            <p className="nx-about-step-num">{item.step}</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="nx-about-map-block">
        <div className="nx-about-map-copy">
          <p className="eyebrow">Coverage</p>
          <h2 className="nx-section-title">Where Nexora works today</h2>
          <p>
            Coral provinces have restaurants in the live catalog. Soft green means coming soon. The map uses Rwanda&apos;s
            five provinces and updates when venues are added or removed.
          </p>
          <ul className="nx-about-live-list">
            {liveFeatured.map((city) => (
              <li key={city.slug}>
                <Link href={`/cities/${city.slug}`}>
                  <span>{city.name}</span>
                  <em>{city.restaurantCount} restaurants</em>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/cities" className="btn-primary nx-about-map-cta">
            Browse all cities
          </Link>
        </div>
        <RwandaCoverageMap counts={counts} />
      </section>
    </div>
  );
}
