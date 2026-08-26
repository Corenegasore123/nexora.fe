import type { Metadata } from "next";
import Link from "next/link";
import { fetchCities } from "@/lib/public";
import { DiscoverResults } from "@/components/discover/DiscoverResults";
import { SearchWidget } from "@/components/discover/SearchWidget";

export const metadata: Metadata = {
  title: "Restaurants | Nexora",
  description: "Browse every restaurant on Nexora and book a table.",
};

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RestaurantsIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const sp: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) sp[k] = first(v);
  const cities = await fetchCities().catch(() => []);
  const activeCity = (sp.city ?? "").toLowerCase();

  return (
    <div className="nx-discover nx-catalog-page">
      <p className="eyebrow">Catalog</p>
      <h1 className="nx-page-title">All restaurants</h1>
      <p className="mt-3 max-w-xl text-foreground-secondary">
        Every published venue on Nexora. Filter by city, cuisine, or what’s open - then book a table.
      </p>
      <div className="nx-finder-dock mt-8">
        <SearchWidget defaults={{ city: sp.city || "", q: sp.q, date: sp.date, time: sp.time, guests: sp.guests }} action="/restaurants" variant="compact" />
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        <li>
          <Link href="/restaurants" scroll={false} className={`nx-chip-link ${!activeCity ? "nx-chip-featured" : ""}`}>
            All cities
          </Link>
        </li>
        {cities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/restaurants?city=${encodeURIComponent(city.name)}`}
              scroll={false}
              className={`nx-chip-link ${activeCity === city.name.toLowerCase() ? "nx-chip-featured" : ""}`}
            >
              {city.name}
              <span className="ml-2 text-foreground-muted">{city.restaurantCount}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <DiscoverResults
          sp={sp}
          basePath="/restaurants"
          heading={sp.city ? `Restaurants in ${sp.city}` : "Browse the catalog"}
          embedded
          columns={3}
        />
      </div>
    </div>
  );
}
