"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { myReviews, type CustomerReview } from "@/lib/api";
import { AccountShell } from "@/components/account/AccountShell";
import { ReviewCard } from "@/components/account/ReviewCard";

export default function AccountReviewsPage() {
  const [rows, setRows] = useState<CustomerReview[] | null>(null);

  useEffect(() => {
    myReviews()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <AccountShell title="Reviews." subtitle="What you told other diners — the same stars and scores you see on a restaurant page.">
      {rows === null && <p className="text-sm text-foreground-muted">Loading reviews…</p>}
      {rows && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
      {rows && !rows.length && (
        <p className="text-sm text-foreground-muted">
          You haven’t left a review yet. After a completed visit, open{" "}
          <Link href="/account/reservations" className="font-medium text-primary">
            Reservations
          </Link>{" "}
          and choose <span className="font-medium text-ink">Write a review</span>.
        </p>
      )}
    </AccountShell>
  );
}
