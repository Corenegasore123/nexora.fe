import Link from "next/link";
import type { PublicCard } from "@/lib/public";
import { Photo } from "@/components/discover/Photo";
import { RatingStars } from "@/components/discover/RatingStars";
import { FavoriteButton } from "@/components/discover/Favorites";

export function RestaurantCard({ restaurant, hrefQuery = "" }: { restaurant: PublicCard; hrefQuery?: string }) {
  const href = `/restaurants/${restaurant.slug}${hrefQuery}`;
  return (
    <article className="nx-card group">
      <Link href={href} className="block">
        <div className="nx-card-media">
          {restaurant.coverUrl ? (
            <Photo
              src={restaurant.coverUrl}
              alt=""
              sizes="(max-width: 768px) 100vw, 33vw"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface-elevated text-sm text-foreground-muted">Nexora</div>
          )}
          <div className="nx-card-media-fade" />
          <p className={`nx-card-open ${restaurant.openNow ? "is-open" : ""}`}>{restaurant.openNow ? "Open now" : "Closed"}</p>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight tracking-tight">{restaurant.name}</h3>
            <RatingStars value={restaurant.rating} count={restaurant.reviewCount} compact />
          </div>
          <p className="mt-1 text-sm text-foreground-secondary">
            {restaurant.cuisine} · {restaurant.priceTier}
          </p>
          <p className="mt-1 text-sm text-foreground-muted">
            {restaurant.neighborhood ? `${restaurant.neighborhood}, ` : ""}
            {restaurant.city}
          </p>
          {restaurant.featuredTags.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-1.5">
              {restaurant.featuredTags.slice(0, 3).map((tag) => (
                <span key={tag} className="nx-chip nx-chip-featured">
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </p>
          )}
          {restaurant.featuredTags.length === 0 && restaurant.tags.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-1.5">
              {restaurant.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="nx-chip">
                  {tag}
                </span>
              ))}
            </p>
          )}
          {restaurant.nextSlots.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-1.5">
              {restaurant.nextSlots.map((s) => (
                <span key={s.time} className="nx-slot">
                  {s.time}
                </span>
              ))}
            </p>
          )}
        </div>
      </Link>
      <FavoriteButton restaurantId={restaurant.id} />
    </article>
  );
}

export function RestaurantRail({ title, items }: { title: string; items: PublicCard[] }) {
  if (!items.length) return null;
  return (
    <section className="nx-rail">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="nx-section-title">{title}</h2>
      </div>
      <div className="nx-rail-track">
        {items.map((r) => (
          <div key={r.id} className="nx-rail-item">
            <RestaurantCard restaurant={r} />
          </div>
        ))}
      </div>
    </section>
  );
}
