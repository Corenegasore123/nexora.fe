import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { fetchCity } from "@/lib/public";
import { placeToCityFilter } from "@/lib/rwanda-places";
import { RestaurantRail } from "@/components/discover/RestaurantRail";
import { DiscoverResults } from "@/components/discover/DiscoverResults";
import { SearchWidget } from "@/components/discover/SearchWidget";
import { Photo } from "@/components/discover/Photo";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  try {
    const data = await fetchCity(city);
    return {
      title: `Restaurants in ${data.city.name}`,
      description: `Find a table in ${data.city.name}. ${data.restaurantCount} restaurants, popular cuisines, and availability tonight.`,
      alternates: { canonical: `/cities/${data.city.slug}` },
    };
  } catch {
    return { title: "City | Nexora" };
  }
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  let data;
  try {
    data = await fetchCity(city);
  } catch {
    notFound();
  }

  const raw = await searchParams;
  const sp: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) sp[k] = Array.isArray(v) ? v[0] : v;
  const cityFilter = placeToCityFilter(data.city.name) || data.city.name;
  sp.city = cityFilter;
  const browsing = Boolean(sp.q || sp.cuisine || sp.neighborhood || sp.price || sp.openNow || sp.available || sp.page);

  return (
    <div className="nx-city-page">
      <section className="nx-city-hero">
        {data.coverUrl ? (
          <Photo src={data.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" sizes="100vw" priority />
        ) : (
          <div className="absolute inset-0 nx-city-hero-fallback" />
        )}
        <div className="nx-city-hero-fade" />
        <div className="nx-city-hero-inner">
          <Link href="/cities" className="nx-city-back">
            <ArrowLeft size={15} strokeWidth={2.2} />
            All cities
          </Link>
          <p className="nx-city-hero-region">{data.city.region}</p>
          <h1 className="nx-city-hero-title">Eat in {data.city.name}.</h1>
          <p className="nx-city-hero-lead">
            {data.restaurantCount > 0 ? (
              <>
                {data.restaurantCount} restaurant{data.restaurantCount === 1 ? "" : "s"}
                {data.neighborhoods[0]
                  ? ` across ${data.neighborhoods
                      .map((n) => n.name)
                      .slice(0, 4)
                      .join(", ")}`
                  : ""}
                . Book a table for tonight or browse by cuisine.
              </>
            ) : (
              <>We&apos;re still bringing restaurants online here. Browse nearby destinations or search across Rwanda.</>
            )}
          </p>
          {data.restaurantCount > 0 && (
            <dl className="nx-city-stats">
              <div>
                <dt>Restaurants</dt>
                <dd>{data.restaurantCount}</dd>
              </div>
              <div>
                <dt>Cuisines</dt>
                <dd>{data.cuisines.length}</dd>
              </div>
              <div>
                <dt>Neighborhoods</dt>
                <dd>{data.neighborhoods.length}</dd>
              </div>
            </dl>
          )}
          <div className="mt-8">
            <SearchWidget
              defaults={{ city: data.city.name, q: sp.q, date: sp.date, time: sp.time, guests: sp.guests }}
              action={`/cities/${data.city.slug}`}
              variant="compact"
            />
          </div>
        </div>
      </section>

      <div className="nx-discover nx-city-body">
        {data.restaurantCount === 0 ? (
          <section className="nx-city-empty">
            <MapPin size={22} strokeWidth={1.8} />
            <h2 className="nx-section-title">No tables listed yet</h2>
            <p>
              {data.city.name} is on the map. Check featured destinations or search the full catalog while we grow this
              district.
            </p>
            <div className="nx-city-empty-actions">
              <Link href="/cities" className="btn-primary">
                Browse cities
              </Link>
              <Link href="/restaurants" className="btn-secondary">
                All restaurants
              </Link>
            </div>
          </section>
        ) : (
          <>
            {data.cuisines.length > 0 && (
              <section className="nx-city-browse">
                <h2 className="nx-section-title">Popular cuisines</h2>
                <ul className="nx-city-chip-row">
                  {data.cuisines.map((c) => (
                    <li key={c.name}>
                      <Link
                        href={`/cities/${data.city.slug}?cuisine=${encodeURIComponent(c.name)}`}
                        className={`nx-chip-link ${sp.cuisine === c.name ? "is-active" : ""}`}
                      >
                        {c.name}
                        <span>{c.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {data.neighborhoods.length > 0 && (
              <section className="nx-city-browse">
                <h2 className="nx-section-title">Neighborhoods</h2>
                <ul className="nx-city-chip-row">
                  {data.neighborhoods.map((n) => (
                    <li key={n.name}>
                      <Link
                        href={`/cities/${data.city.slug}?neighborhood=${encodeURIComponent(n.name)}`}
                        className={`nx-chip-link ${sp.neighborhood === n.name ? "is-active" : ""}`}
                      >
                        {n.name}
                        <span>{n.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!browsing && (
              <>
                <div className="mt-10">
                  <RestaurantRail title={`Featured in ${data.city.name}`} items={data.featured} />
                </div>
                <RestaurantRail title="Available tonight" items={data.availableTonight} />
              </>
            )}

            <div className="mt-10">
              <DiscoverResults
                sp={sp}
                basePath={`/cities/${data.city.slug}`}
                heading={browsing ? `Restaurants in ${data.city.name}` : "All restaurants"}
                embedded
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
