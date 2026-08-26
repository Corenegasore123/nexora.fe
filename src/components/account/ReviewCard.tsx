import Link from "next/link";
import type { CustomerReview } from "@/lib/api";
import { Photo } from "@/components/discover/Photo";
import { RatingStars } from "@/components/discover/RatingStars";

export function ReviewCard({ review }: { review: CustomerReview }) {
  const href = `/restaurants/${review.restaurant.slug}`;
  const scores = [
    review.food != null ? { label: "Food", value: review.food } : null,
    review.service != null ? { label: "Service", value: review.service } : null,
    review.ambience != null ? { label: "Ambience", value: review.ambience } : null,
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <article className="nx-review">
      <div className="flex gap-4">
        <Link href={href} className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-elevated sm:block">
          {review.restaurant.coverUrl ? (
            <Photo src={review.restaurant.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" sizes="80px" />
          ) : (
            <span className="flex h-full items-center justify-center font-display text-ink-faint">N</span>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-medium tracking-tight text-ink">
                <Link href={href}>{review.restaurant.name}</Link>
              </h3>
              <p className="mt-1">
                <RatingStars value={review.rating} size={14} />
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {review.status === "PENDING" && <span className="nx-rsvp-badge is-pending">Pending approval</span>}
              {review.status === "REJECTED" && <span className="nx-rsvp-badge is-cancelled">Rejected</span>}
              {review.status === "APPROVED" && <span className="nx-rsvp-badge is-upcoming">Published</span>}
              <Link href={href} className="text-sm font-medium text-primary">
                View restaurant
              </Link>
            </div>
          </div>
          {scores.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-1.5">
              {scores.map((s) => (
                <span key={s.label} className="nx-chip">
                  {s.label} {s.value}
                </span>
              ))}
            </p>
          )}
          {review.comment && <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{review.comment}</p>}
          {review.rejectReason && <p className="mt-2 text-sm text-error">{review.rejectReason}</p>}
        </div>
      </div>
    </article>
  );
}
