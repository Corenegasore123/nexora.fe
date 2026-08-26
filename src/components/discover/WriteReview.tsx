"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ApiError, eligibleReviews, writeReview, type EligibleReviewVisit } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";

function StarPicker({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div>
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground-muted">{label}</p>
      <div className="nx-rating mt-2 flex items-center gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="border-0 bg-transparent p-0.5"
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            onClick={() => onChange(n)}
          >
            <Icon name="star" size={22} filled={n <= value} className={n <= value ? "nx-star-fill" : "nx-star-empty"} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function WriteReview({
  restaurantId,
  restaurantName,
  reservationId: forcedReservationId,
}: {
  restaurantId: string;
  restaurantName: string;
  reservationId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [visits, setVisits] = useState<EligibleReviewVisit[]>([]);
  const [reservationId, setReservationId] = useState(forcedReservationId ?? "");
  const [rating, setRating] = useState(5);
  const [food, setFood] = useState(5);
  const [service, setService] = useState(5);
  const [ambience, setAmbience] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/check", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(async (session) => {
        if (cancelled) return;
        setRole(session?.role ?? null);
        if (session?.role === "CUSTOMER") {
          const rows = await eligibleReviews(restaurantId).catch(() => []);
          if (cancelled) return;
          setVisits(rows);
          if (forcedReservationId) setReservationId(forcedReservationId);
          else if (rows[0]) setReservationId(rows[0].reservationId);
        }
      })
      .catch(() => {
        if (!cancelled) setRole(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId, forcedReservationId]);

  if (!ready) return null;

  if (!role) {
    return (
      <div className="nx-review mt-6">
        <p className="font-display text-lg font-medium tracking-tight">Been here?</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          <Link href={`/sign-in?from=${encodeURIComponent(pathname)}`} className="font-medium text-primary">
            Sign in
          </Link>{" "}
          after a completed visit to review {restaurantName}.
        </p>
      </div>
    );
  }

  if (role !== "CUSTOMER") return null;

  if (!visits.length && !forcedReservationId) {
    return (
      <div className="nx-review mt-6">
        <p className="font-display text-lg font-medium tracking-tight">Reviews open after your visit</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          Book a table, dine, then come back here - or use <span className="font-medium text-ink">Write a review</span> on a past reservation.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId || !rating || !food || !service || !ambience) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await writeReview({
        reservationId,
        rating,
        food,
        service,
        ambience,
        comment: comment.trim() || undefined,
      });
      setSaved(true);
      setVisits((v) => v.filter((row) => row.reservationId !== reservationId));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your review");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="nx-review mt-6 space-y-5" id="write-review">
      <div>
        <h3 className="font-display text-xl font-medium tracking-tight">Write a review</h3>
        <p className="mt-1 text-sm text-foreground-muted">Submitted reviews go to moderation before they appear publicly.</p>
      </div>
      {visits.length > 1 && !forcedReservationId && (
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Which visit?</span>
          <select
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
          >
            {visits.map((v) => (
              <option key={v.reservationId} value={v.reservationId}>
                {v.number} · {String(v.date).slice(0, 10)} · {v.time}
              </option>
            ))}
          </select>
        </label>
      )}
      <StarPicker label="Overall" value={rating} onChange={setRating} />
      <div className="grid gap-5 sm:grid-cols-3">
        <StarPicker label="Food" value={food} onChange={setFood} />
        <StarPicker label="Service" value={service} onChange={setService} />
        <StarPicker label="Ambience" value={ambience} onChange={setAmbience} />
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Your notes</span>
        <textarea
          className="min-h-28 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
          maxLength={800}
          placeholder={`How was ${restaurantName}?`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      {saved && (
        <p className="text-sm text-success">
          Submitted for approval. You can track it under{" "}
          <Link href="/account/reviews" className="font-medium text-primary">
            My reviews
          </Link>
          .
        </p>
      )}
      <button className="btn-primary min-h-11" disabled={busy || !reservationId || !rating} type="submit">
        {busy ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
