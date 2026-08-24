import Link from "next/link";
import { fetchRestaurants } from "@/lib/public";
import { RestaurantCard } from "@/components/discover/RestaurantCard";
import { DiscoverFilters, SearchWidget } from "@/components/discover/SearchWidget";
import { SuggestSearch } from "@/components/discover/SuggestSearch";

export async function DiscoverResults({
  sp,
  basePath = "/discover",
  heading,
  embedded = false,
  columns = 2,
}: {
  sp: Record<string, string | undefined>;
  basePath?: string;
  heading?: string;
  embedded?: boolean;
  columns?: 2 | 3;
}) {
  const page = sp.page ?? "1";
  const data = await fetchRestaurants({
    city: sp.city,
    q: sp.q,
    cuisine: sp.cuisine,
    neighborhood: sp.neighborhood,
    price: sp.price,
    rating: sp.rating,
    feature: sp.feature,
    openNow: sp.openNow,
    available: sp.available,
    date: sp.date,
    time: sp.time,
    guests: sp.guests,
    sort: sp.sort,
    page,
    pageSize: columns === 3 ? "18" : "12",
  }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 12, pages: 1 }));

  const hrefQuery = (() => {
    const q = new URLSearchParams();
    if (sp.date) q.set("date", sp.date);
    if (sp.time) q.set("time", sp.time);
    if (sp.guests) q.set("guests", sp.guests);
    const s = q.toString();
    return s ? `?${s}` : "";
  })();

  const title =
    heading ??
    (sp.q ? `Results for “${sp.q}”` : sp.city ? `Restaurants in ${sp.city}` : "All restaurants");

  return (
    <div className={embedded ? "nx-discover-list" : "nx-discover nx-discover-list"}>
      {!embedded && <SearchWidget defaults={sp} variant="compact" />}
      {!embedded && (
        <div className="mt-6">
          <SuggestSearch city={sp.city} />
        </div>
      )}
      <div className={embedded ? "flex flex-col gap-6 lg:flex-row" : "mt-8 flex flex-col gap-6 lg:flex-row"}>
        <aside className="nx-filters-rail lg:w-56 shrink-0">
          <DiscoverFilters values={sp} basePath={basePath} />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h1 className={embedded ? "nx-section-title" : "nx-page-title"}>{title}</h1>
              <p className="mt-1 text-sm text-foreground-muted">{data.total} restaurants · demo catalog</p>
            </div>
          </div>
          <div className={`nx-catalog-grid ${columns === 3 ? "nx-catalog-grid-3" : ""}`}>
            {data.items.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} hrefQuery={hrefQuery} />
            ))}
          </div>
          {!data.items.length && <p className="card mt-4 text-sm text-foreground-muted">No restaurants match those filters.</p>}
          {data.pages > 1 && (
            <nav className="mt-8 flex flex-wrap gap-2">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => {
                const q = new URLSearchParams();
                for (const [k, v] of Object.entries(sp)) if (v) q.set(k, v);
                q.set("page", String(n));
                return (
                  <Link
                    key={n}
                    href={`${basePath}?${q.toString()}`}
                    className={`min-h-11 min-w-11 rounded-lg border px-3 py-2 text-center text-sm ${n === data.page ? "border-primary bg-primary-soft text-primary" : "border-border"}`}
                  >
                    {n}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
