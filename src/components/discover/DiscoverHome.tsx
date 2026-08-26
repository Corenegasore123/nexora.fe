import { fetchHome } from "@/lib/public";
import { SearchWidget } from "@/components/discover/SearchWidget";
import { RestaurantRail } from "@/components/discover/RestaurantCard";

export async function DiscoverHome({ city }: { city?: string } = {}) {
  const data = await fetchHome(city || undefined).catch(() => ({
    city: city || "Rwanda",
    demo: true,
    rails: [],
  }));
  return (
    <div className="nx-discover">
      <section className="nx-hero">
        <p className="eyebrow">Nexora</p>
        <h1 className="nx-hero-title">Discover your next table.</h1>
        <p className="nx-hero-sub">Find somewhere to eat. Book it. Show up.</p>
        <SearchWidget defaults={{ city: city || "" }} />
      </section>
      {data.rails.map((rail) => (
        <RestaurantRail key={rail.id} title={rail.title} items={rail.items} />
      ))}
    </div>
  );
}
