"use client";

import Link from "next/link";
import { useState } from "react";
import { cancelMyReservation, type Reservation } from "@/lib/api";
import { Photo } from "@/components/discover/Photo";

const UPCOMING = new Set(["NEW", "PENDING", "CONFIRMED", "ARRIVED", "SEATED"]);

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    timeZone: "Africa/Kigali",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function badge(status: string) {
  if (status === "CANCELLED" || status === "NO_SHOW") {
    return { label: status === "NO_SHOW" ? "No-show" : "Cancelled", className: "nx-rsvp-badge is-cancelled" };
  }
  if (UPCOMING.has(status)) return { label: "Upcoming", className: "nx-rsvp-badge is-upcoming" };
  return { label: "Past", className: "nx-rsvp-badge" };
}

export function isUpcomingReservation(status: string) {
  return UPCOMING.has(status);
}

export function ReservationCard({
  reservation: r,
  onCancelled,
}: {
  reservation: Reservation;
  onCancelled?: (id: string) => void;
}) {
  const restaurant = r.branch.restaurant;
  const name = restaurant?.name ?? r.branch.name;
  const href = restaurant?.slug ? `/restaurants/${restaurant.slug}` : "/restaurants";
  const cover = restaurant?.coverUrl ?? restaurant?.images?.[0]?.url ?? null;
  const tone = badge(r.status);
  const canCancel = ["NEW", "PENDING", "CONFIRMED"].includes(r.status);
  const [busy, setBusy] = useState(false);

  const onCancel = async () => {
    setBusy(true);
    try {
      await cancelMyReservation(r.id);
      onCancelled?.(r.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="nx-card">
      <div className="nx-rsvp">
        <div className="nx-rsvp-media">
          {cover ? (
            <Photo src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" sizes="120px" />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-lg text-ink-faint">Nexora</div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[0.6875rem] uppercase tracking-wider text-foreground-muted">{r.number}</p>
              <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink">
                <Link href={href}>{name}</Link>
              </h3>
              <p className="mt-1 text-sm text-foreground-secondary">
                {formatDate(r.date)} · {r.time} · {r.guests} {r.guests === 1 ? "guest" : "guests"}
              </p>
              {r.branch.name && restaurant?.name && r.branch.name !== restaurant.name && (
                <p className="mt-1 text-sm text-foreground-muted">{r.branch.name}</p>
              )}
            </div>
            <span className={tone.className}>{tone.label}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link href={href} className="text-sm font-medium text-primary">
              View restaurant
            </Link>
            {canCancel && (
              <button type="button" className="text-sm font-medium text-foreground-muted hover:text-error" disabled={busy} onClick={onCancel}>
                {busy ? "Cancelling…" : "Cancel"}
              </button>
            )}
            {tone.label === "Past" && restaurant?.slug && !r.review && (
              <Link href={`/account/reviews/write?reservationId=${r.id}&restaurant=${restaurant.slug}`} className="text-sm font-medium text-primary">
                Write a review
              </Link>
            )}
            {r.review?.status === "PENDING" && <span className="nx-rsvp-badge is-pending">Review pending</span>}
            {r.review?.status === "APPROVED" && (
              <Link href="/account/reviews" className="text-sm font-medium text-primary">
                Your review
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
