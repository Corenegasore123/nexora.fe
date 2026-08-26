import type { Metadata } from "next";
import Link from "next/link";
import { fetchCities } from "@/lib/public";
import { Photo } from "@/components/discover/Photo";

export const metadata: Metadata = {
  title: "Cities | Nexora",
  description: "Discover restaurants in Kigali, Musanze, Rubavu, and Huye - then book a table.",
};

export default async function CitiesPage() {
  const cities = await fetchCities().catch(() => []);

  return (
    <div className="nx-discover">
      <p className="eyebrow">Rwanda</p>
      <h1 className="nx-page-title">Eat your way through the city.</h1>
      <p className="mt-3 max-w-xl text-foreground-secondary">
        Neighborhoods, cuisines, and tables available tonight. Start with a city - every page is built from the live catalog.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {cities.map((city) => (
          <Link key={city.slug} href={`/cities/${city.slug}`} className="nx-city-card">
            {city.coverUrl ? (
              <Photo src={city.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="absolute inset-0 bg-ink" />
            )}
            <span className="nx-city-card-fade" />
            <span className="nx-city-card-body">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">{city.region}</span>
              <span className="mt-1 block font-display text-3xl font-medium tracking-tight">{city.name}</span>
              <span className="mt-2 block text-sm text-white/80">
                {city.restaurantCount} restaurants
                {city.neighborhoods[0] ? ` · ${city.neighborhoods.slice(0, 2).join(", ")}` : ""}
              </span>
              {city.cuisines.length > 0 && (
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {city.cuisines.slice(0, 3).map((c) => (
                    <span key={c} className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs">
                      {c}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
