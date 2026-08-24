"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPublicRestaurant } from "@/lib/api";
import { WriteReview } from "@/components/discover/WriteReview";
import { AccountShell } from "@/components/account/AccountShell";

function WriteBody() {
  const sp = useSearchParams();
  const reservationId = sp.get("reservationId") ?? "";
  const slug = sp.get("restaurant") ?? "";
  const [restaurant, setRestaurant] = useState<{ id: string; name: string; slug: string } | null>(null);

  useEffect(() => {
    if (!slug) return;
    getPublicRestaurant(slug)
      .then((r) => setRestaurant({ id: r.id, name: r.name, slug: r.slug }))
      .catch(() => setRestaurant(null));
  }, [slug]);

  return (
    <AccountShell title="Write a review." subtitle="Share food, service, and ambience from a completed visit.">
      {!reservationId || !slug ? (
        <p className="text-sm text-foreground-muted">
          Pick a past reservation from{" "}
          <Link href="/account/reservations" className="font-medium text-primary">
            Reservations
          </Link>
          .
        </p>
      ) : !restaurant ? (
        <p className="text-sm text-foreground-muted">Loading restaurant…</p>
      ) : (
        <WriteReview restaurantId={restaurant.id} restaurantName={restaurant.name} reservationId={reservationId} />
      )}
    </AccountShell>
  );
}

export default function WriteReviewPage() {
  return (
    <Suspense fallback={<p className="p-10 text-sm text-foreground-muted">Loading…</p>}>
      <WriteBody />
    </Suspense>
  );
}
