import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, UtensilsCrossed } from "lucide-react";
import { fetchCities, type CitySummary } from "@/lib/public";
import { isPlaceLive } from "@/lib/rwanda-coverage";
import { Photo } from "@/components/discover/Photo";

export const metadata: Metadata = {
  title: "Cities | Nexora",
  description: "Discover restaurants across Rwanda's cities and districts - then book a table.",
};

const REGION_ORDER = [
  "City of Kigali",
  "Northern Province",
  "Southern Province",
  "Eastern Province",
  "Western Province",
];

function groupByRegion(cities: CitySummary[]) {
  const map = new Map<string, CitySummary[]>();
  for (const city of cities) {
    const region = city.region || "Rwanda";
    if (!map.has(region)) map.set(region, []);
    map.get(region)!.push(city);
  }
  return REGION_ORDER.filter((r) => map.has(r))
    .concat([...map.keys()].filter((r) => !REGION_ORDER.includes(r)))
    .map((region) => ({
      region,
      cities: (map.get(region) ?? []).sort((a, b) => b.restaurantCount - a.restaurantCount || a.name.localeCompare(b.name)),
    }));
}

export default async function CitiesPage() {
  const cities = await fetchCities().catch(() => [] as CitySummary[]);
  const featured = cities.filter((c) => c.featured && c.restaurantCount > 0).slice(0, 6);
  const liveCities = cities.filter((c) => isPlaceLive(c.restaurantCount));
  const totalRestaurants = cities.reduce((sum, c) => {
    if (c.name === "Kigali" || !["Gasabo", "Kicukiro", "Nyarugenge"].includes(c.name)) {
      return sum + c.restaurantCount;
    }
    return sum;
  }, 0);
  const liveDistricts = cities.filter((c) => c.featured && isPlaceLive(c.restaurantCount)).length;
  const regions = groupByRegion(cities);

  return (
    <div className="nx-cities">
      <section className="nx-cities-hero-shell">
        <div className="nx-cities-hero">
          <div className="nx-cities-hero-glow" aria-hidden />
          <p className="eyebrow">Nexora · Rwanda</p>
          <h1 className="nx-cities-title">Cities &amp; districts.</h1>
          <p className="nx-cities-lead">
            Discover where Nexora is already live, browse every district by province, and jump straight into the best
            places to book tonight.
          </p>
          <div className="nx-cities-meta">
            <span>
              <MapPin size={15} strokeWidth={2} />
              {liveDistricts} live districts
            </span>
            <span>
              <UtensilsCrossed size={15} strokeWidth={2} />
              {totalRestaurants} restaurants on Nexora
            </span>
          </div>
        </div>

        <aside className="nx-cities-summary">
          <p className="nx-cities-summary-label">At a glance</p>
          <div className="nx-cities-summary-stats">
            <div className="nx-cities-summary-stat">
              <strong>{liveCities.length}</strong>
              <span>places live now</span>
            </div>
            <div className="nx-cities-summary-stat">
              <strong>{regions.length}</strong>
              <span>provinces covered</span>
            </div>
          </div>

          {liveCities.length > 0 && (
            <div className="nx-cities-summary-list">
              <p className="nx-cities-summary-heading">Popular live places</p>
              <div className="nx-cities-summary-links">
                {liveCities.slice(0, 4).map((city) => (
                  <Link key={city.slug} href={`/cities/${city.slug}`} className="nx-cities-summary-link">
                    <span>{city.name}</span>
                    <em>{city.restaurantCount} restaurants</em>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>

      {featured.length > 0 && (
        <section className="nx-cities-section">
          <div className="nx-cities-section-head">
            <h2 className="nx-section-title">Live destinations</h2>
            <p className="nx-cities-section-sub">Places already live on Nexora and bookable tonight.</p>
          </div>
          <div className="nx-cities-featured">
            {featured.map((city, i) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className={`nx-city-card ${i === 0 ? "nx-city-card-lead" : ""}`}
              >
                {city.coverUrl ? (
                  <Photo
                    src={city.coverUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 nx-city-card-fallback" />
                )}
                <span className="nx-city-card-fade" />
                <span className="nx-city-card-body">
                  <span className="nx-city-live-pill">Live</span>
                  <span className="nx-city-card-region">{city.region}</span>
                  <span className="nx-city-card-name">{city.name}</span>
                  <span className="nx-city-card-stats">
                    {city.restaurantCount} restaurant{city.restaurantCount === 1 ? "" : "s"}
                    {city.neighborhoods[0] ? ` · ${city.neighborhoods.slice(0, 2).join(", ")}` : ""}
                  </span>
                  {city.cuisines.length > 0 && (
                    <span className="nx-city-card-tags">
                      {city.cuisines.slice(0, 3).map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </span>
                  )}
                  <span className="nx-city-card-cta">
                    Explore
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="nx-cities-section">
        <div className="nx-cities-section-head">
          <h2 className="nx-section-title">Browse by province</h2>
          <p className="nx-cities-section-sub">All districts, grouped by province.</p>
        </div>
        <div className="nx-cities-regions">
          {regions.map(({ region, cities: rows }) => (
            <div key={region} className="nx-cities-region-card">
              <div className="nx-cities-region-head">
                <h3 className="nx-cities-region-title">{region}</h3>
                <p className="nx-cities-region-meta">
                  {rows.length} district{rows.length === 1 ? "" : "s"} ·{" "}
                  {rows.filter((city) => isPlaceLive(city.restaurantCount)).length} live
                </p>
              </div>
              <ul className="nx-cities-district-grid">
                {rows.map((city) => {
                  const live = isPlaceLive(city.restaurantCount);
                  return (
                    <li key={city.slug}>
                      <Link href={`/cities/${city.slug}`} className={`nx-district-card ${live ? "is-live" : ""}`}>
                        <span className="nx-district-card-main">
                          <span className="nx-district-card-name">
                            {city.name}
                            {live && <span className="nx-district-live-dot" aria-label="Live" />}
                          </span>
                          <span className="nx-district-card-count">
                            {live ? `${city.restaurantCount} open on Nexora` : "Coming soon"}
                          </span>
                        </span>
                        <ArrowRight size={16} strokeWidth={2} className="nx-district-card-arrow" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
