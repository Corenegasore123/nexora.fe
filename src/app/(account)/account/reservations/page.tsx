"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { myReservations, type Reservation } from "@/lib/api";
import { AccountShell } from "@/components/account/AccountShell";
import { ReservationCard, isUpcomingReservation } from "@/components/account/ReservationCard";

export default function AccountReservationsPage() {
  const [rows, setRows] = useState<Reservation[] | null>(null);

  useEffect(() => {
    myReservations()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  const patch = (id: string) =>
    setRows((cur) => (cur ?? []).map((row) => (row.id === id ? { ...row, status: "CANCELLED" } : row)));

  const upcoming = (rows ?? []).filter((r) => isUpcomingReservation(r.status));
  const past = (rows ?? []).filter((r) => !isUpcomingReservation(r.status));

  return (
    <AccountShell title="Reservations." subtitle="Tables you’ve booked across Nexora. Open a restaurant to change plans or book again.">
      {rows === null && <p className="text-sm text-foreground-muted">Loading reservations…</p>}
      {rows && !rows.length && (
        <p className="text-sm text-foreground-muted">
          No reservations yet.{" "}
          <Link href="/restaurants" className="font-medium text-primary">
            Browse restaurants
          </Link>
          .
        </p>
      )}
      {upcoming.length > 0 && (
        <section>
          <h2 className="nx-section-title">Upcoming Reservations</h2>
          <div className="mt-5 space-y-3">
            {upcoming.map((r) => (
              <ReservationCard key={r.id} reservation={r} onCancelled={patch} />
            ))}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section className={upcoming.length ? "mt-14" : ""}>
          <h2 className="nx-section-title">Past Reservations</h2>
          <div className="mt-5 space-y-3">
            {past.map((r) => (
              <ReservationCard key={r.id} reservation={r} />
            ))}
          </div>
        </section>
      )}
    </AccountShell>
  );
}
