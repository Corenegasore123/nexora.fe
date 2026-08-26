"use client";

import { useState } from "react";
import { getPublicReviews, type CustomerReview } from "@/lib/api";
import { RatingStars } from "@/components/discover/RatingStars";

function ReviewItem({ r }: { r: CustomerReview }) {
  const initial = (r.author || "G").trim().charAt(0).toUpperCase();
  return (
    <article className="nx-review">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">
          <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-elevated text-xs">{initial}</span>
          {r.author}
        </p>
        <RatingStars value={r.rating} showValue={false} size={13} />
      </div>
      {(r.food || r.service || r.ambience) && (
        <p className="mt-2 flex flex-wrap gap-1.5">
          {r.food != null && <span className="nx-chip">Food {r.food}</span>}
          {r.service != null && <span className="nx-chip">Service {r.service}</span>}
          {r.ambience != null && <span className="nx-chip">Ambience {r.ambience}</span>}
        </p>
      )}
      {r.comment && <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{r.comment}</p>}
      <p className="mt-2 text-xs text-foreground-muted">{String(r.createdAt).slice(0, 10)}</p>
    </article>
  );
}

export function PublicReviews({
  slug,
  initial,
  pages,
}: {
  slug: string;
  initial: CustomerReview[];
  pages: number;
}) {
  const [items, setItems] = useState(initial);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);

  const loadMore = async () => {
    setBusy(true);
    try {
      const next = page + 1;
      const res = await getPublicReviews(slug, next);
      setItems((cur) => [...cur, ...res.items]);
      setPage(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mt-5 space-y-3">
        {items.map((r) => (
          <ReviewItem key={r.id} r={r} />
        ))}
      </div>
      {page < pages && (
        <button className="btn-secondary mt-4 min-h-11" type="button" disabled={busy} onClick={loadMore}>
          {busy ? "Loading…" : "More reviews"}
        </button>
      )}
    </>
  );
}
