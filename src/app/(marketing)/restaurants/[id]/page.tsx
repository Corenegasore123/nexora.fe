import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRestaurant } from "@/lib/public";
import { BookingWidget } from "@/components/discover/BookingWidget";
import { Photo } from "@/components/discover/Photo";
import { Icon } from "@/components/icons/Icon";
import { RatingStars } from "@/components/discover/RatingStars";
import { FavoriteButton, ShareButton } from "@/components/discover/Favorites";
import { MenuBoard } from "@/components/discover/MenuBoard";
import { WriteReview } from "@/components/discover/WriteReview";
import { PublicReviews } from "@/components/discover/PublicReviews";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const r = await fetchRestaurant(id);
    const title = `${r.name} - ${r.cuisine.split(/[•,]/)[0].trim()} Restaurant in ${r.city}`;
    return {
      title,
      description: r.description,
      alternates: { canonical: `/restaurants/${r.slug}` },
      openGraph: { title, description: r.description, images: r.coverUrl ? [{ url: r.coverUrl }] : undefined },
      twitter: { card: "summary_large_image", title, description: r.description },
    };
  } catch {
    return { title: "Restaurant | Nexora" };
  }
}

export default async function RestaurantProfilePage({ params }: Props) {
  const { id } = await params;
  let data;
  try {
    data = await fetchRestaurant(id);
  } catch {
    notFound();
  }

  const gallery = data.images.length ? data.images : data.coverUrl ? [{ url: data.coverUrl, alt: data.name }] : [];

  return (
    <div className="nx-discover nx-profile">
      <div className="nx-gallery">
        {gallery.slice(0, 3).map((img, i) => (
          <div key={img.url + i} className={i === 0 ? "nx-gallery-hero" : "nx-gallery-side"}>
            <Photo src={img.url} alt={img.alt || data.name} className="absolute inset-0 h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 70vw" priority={i === 0} />
          </div>
        ))}
      </div>

      <div className="nx-profile-grid">
        <div className="nx-profile-main">
          <p className="eyebrow">{data.cuisine}</p>
          <h1 className="nx-profile-name mt-2">{data.name}</h1>
          <div className="nx-profile-meta">
            <RatingStars value={data.rating} count={data.reviewCount} size={16} />
            <span>{data.priceTier}</span>
            <span className="inline-flex items-center gap-1">
              <Icon name="map-pin" size={14} />
              {data.neighborhood || data.city}
            </span>
            <span className={`nx-status-pill ${data.openNow ? "is-open" : ""}`}>
              {data.openNow ? `Open until ${data.openUntil}` : "Closed now"}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-foreground-secondary">{data.address}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href="#book" className="btn-primary min-h-11">
              Book a Table
            </a>
            <FavoriteButton restaurantId={data.id} variant="button" />
            <ShareButton title={data.name} />
          </div>

          <section className="mt-12">
            <h2 className="nx-section-title">Overview</h2>
            <p className="mt-3 max-w-2xl text-foreground-secondary leading-relaxed">{data.description}</p>
            {data.tags.length > 0 && (
              <p className="mt-4 flex flex-wrap gap-2">
                {data.tags.map((t) => (
                  <span key={t} className="nx-chip">
                    {t}
                  </span>
                ))}
              </p>
            )}
          </section>

          <MenuBoard restaurantName={data.name} sections={data.menuSections} items={data.menu} />

          <section className="mt-12">
            <h2 className="nx-section-title">Photos</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((img, i) => (
                <div key={img.url + i} className="relative h-40 overflow-hidden rounded-xl">
                  <Photo src={img.url} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12" id="reviews">
            <h2 className="nx-section-title">Reviews</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <RatingStars value={data.rating} size={18} />
              <p className="text-sm text-foreground-muted">{data.reviewCount} reviews</p>
            </div>
            {(data.ratingFood || data.ratingService || data.ratingAmbience) && (
              <p className="mt-3 flex flex-wrap gap-1.5">
                <span className="nx-chip">Food {(data.ratingFood ?? 0).toFixed(1)}</span>
                <span className="nx-chip">Service {(data.ratingService ?? 0).toFixed(1)}</span>
                <span className="nx-chip">Ambience {(data.ratingAmbience ?? 0).toFixed(1)}</span>
              </p>
            )}
            <WriteReview restaurantId={data.id} restaurantName={data.name} />
            <PublicReviews
              slug={data.slug}
              pages={Math.max(1, Math.ceil((data.reviewCount || data.reviews.length) / 8))}
              initial={data.reviews.map((r) => ({
                id: r.id ?? `${r.author}-${r.createdAt}`,
                rating: r.rating,
                food: r.food ?? null,
                service: r.service ?? null,
                ambience: r.ambience ?? null,
                comment: r.comment,
                author: r.author,
                createdAt: r.createdAt,
                images: r.images ?? [],
                restaurant: { id: data.id, slug: data.slug, name: data.name, coverUrl: data.coverUrl },
              }))}
            />
          </section>

          <section className="mt-12">
            <h2 className="nx-section-title">Location & hours</h2>
            <p className="mt-3 inline-flex items-start gap-2 text-sm">
              <Icon name="map-pin" size={16} className="mt-0.5 text-primary" />
              {data.address}
            </p>
            {data.mapUrl && (
              <p className="mt-2">
                <a className="text-sm font-medium text-primary" href={data.mapUrl} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </p>
            )}
            <ul className="nx-hours mt-5">
              {data.openingHours.map((h) => (
                <li key={h.day}>
                  <span>{h.day}</span>
                  <span>
                    {h.open} – {h.close}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div id="book" className="nx-profile-book">
          <BookingWidget restaurant={data} />
        </div>
      </div>
    </div>
  );
}
