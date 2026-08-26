import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, UtensilsCrossed } from "lucide-react";
import { fetchCities, type CitySummary } from "@/lib/public";
import { isPlaceLive } from "@/lib/rwanda-coverage";
import { KIGALI_DISTRICT_NAMES } from "@/lib/rwanda-places";
import { Photo } from "@/components/discover/Photo";

export const metadata: Metadata = {
  title: "Cities | Nexora",
  description: "Discover restaurants across Rwanda's cities and districts - then book a table.",
};

const KIGALI_DISTRICT_SET = new Set<string>(KIGALI_DISTRICT_NAMES);

function provinceRestaurantTotal(region: string, rows: CitySummary[], all: CitySummary[]) {
  if (region === "City of Kigali") {
    const metro = all.find((c) => c.name === "Kigali");
    if (metro) return metro.restaurantCount;
    return rows.reduce((sum, city) => sum + city.restaurantCount, 0);
  }
  return rows.reduce((sum, city) => sum + city.restaurantCount, 0);
}

function groupByRegion(cities: CitySummary[]) {
  const map = new Map<string, CitySummary[]>();
  for (const city of cities) {
    // Cities page lists Gasabo / Nyarugenge / Kicukiro under Kigali — not a separate "Kigali" row.
    if (city.name === "Kigali") continue;
    const region = city.region || "Rwanda";
    if (!map.has(region)) map.set(region, []);
    map.get(region)!.push(city);
  }

  return [...map.entries()]
    .map(([region, rows]) => {
      const sortedRows =
        region === "City of Kigali"
          ? [...rows].sort((a, b) => {
              const ai = KIGALI_DISTRICT_NAMES.findIndex((n) => n === a.name);
              const bi = KIGALI_DISTRICT_NAMES.findIndex((n) => n === b.name);
              const aRank = ai === -1 ? 99 : ai;
              const bRank = bi === -1 ? 99 : bi;
              return aRank - bRank || a.name.localeCompare(b.name);
            })
          : [...rows].sort((a, b) => b.restaurantCount - a.restaurantCount || a.name.localeCompare(b.name));

      return {
        region,
        cities: sortedRows,
        restaurantTotal: provinceRestaurantTotal(region, sortedRows, cities),
      };
    })
    .sort((a, b) => b.restaurantTotal - a.restaurantTotal || a.region.localeCompare(b.region));
}

export default async function CitiesPage() {
  const cities = await fetchCities().catch(() => [] as CitySummary[]);
  const featured = cities.filter((c) => c.featured && c.restaurantCount > 0).slice(0, 6);
  const browseCities = cities.filter((c) => c.name !== "Kigali");
  const liveCities = browseCities.filter((c) => isPlaceLive(c.restaurantCount));
  const totalRestaurants = cities.reduce((sum, c) => {
    if (c.name === "Kigali" || !KIGALI_DISTRICT_SET.has(c.name)) {
      return sum + c.restaurantCount;
    }
    return sum;
  }, 0);
  const liveDistricts = liveCities.length;
  const regions = groupByRegion(cities);

  return (
    <div className="nx-cities">
      <section className="nx-cities-hero">
        <div className="nx-cities-hero-copy">
          <div className="nx-cities-hero-glow" aria-hidden />
          <p className="eyebrow">Nexora · Rwanda</p>
          <h1 className="nx-cities-title">Cities &amp; districts.</h1>
          <p className="nx-cities-lead">
            Discover where Nexora is already live, browse every district by province, and go straight to the places
            worth booking.
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
            <span>{regions.length} provinces covered</span>
          </div>
        </div>
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
                <span className="nx-city-card-media">
                  {city.coverUrl ? (
                    <Photo
                      src={city.coverUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <span className="nx-city-card-fallback" />
                  )}
                </span>
                <span className="nx-city-card-body">
                  <span className="nx-city-card-top">
                    <span className="nx-city-live-pill">Live</span>
                    <span className="nx-city-card-region">{city.region}</span>
                  </span>
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
          <p className="nx-cities-section-sub">
            Provinces with the most restaurants first. Kigali is listed as Gasabo, Nyarugenge, and Kicukiro.
          </p>
        </div>
        <div className="nx-cities-regions">
          {regions.map(({ region, cities: rows, restaurantTotal }) => (
            <div key={region} className="nx-cities-region-card">
              <div className="nx-cities-region-head">
                <h3 className="nx-cities-region-title">{region}</h3>
                <p className="nx-cities-region-meta">
                  {restaurantTotal} restaurant{restaurantTotal === 1 ? "" : "s"} · {rows.length} district
                  {rows.length === 1 ? "" : "s"} · {rows.filter((city) => isPlaceLive(city.restaurantCount)).length}{" "}
                  live
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
