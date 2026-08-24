"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMe, myReservations, type AuthUser, type Reservation } from "@/lib/api";
import { AccountShell } from "@/components/account/AccountShell";
import { ReservationCard, isUpcomingReservation } from "@/components/account/ReservationCard";

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [rows, setRows] = useState<Reservation[] | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null));
    myReservations()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const upcoming = (rows ?? []).filter((r) => isUpcomingReservation(r.status)).slice(0, 3);

  return (
    <AccountShell
      title={`Hello, ${firstName}.`}
      subtitle="Your tables, saved restaurants, and reviews — the same Nexora you use to discover where to eat."
    >
      <section>
        <h2 className="nx-section-title">Upcoming Reservations</h2>
        <div className="mt-5 space-y-3">
          {rows === null && <p className="text-sm text-foreground-muted">Loading reservations…</p>}
          {upcoming.map((r) => (
            <ReservationCard key={r.id} reservation={r} onCancelled={(id) => setRows((cur) => (cur ?? []).map((row) => (row.id === id ? { ...row, status: "CANCELLED" } : row)))} />
          ))}
          {rows && !upcoming.length && (
            <p className="text-sm text-foreground-muted">
              No tables booked yet.{" "}
              <Link href="/restaurants" className="font-medium text-primary">
                Find a restaurant
              </Link>
              .
            </p>
          )}
        </div>
      </section>
      <div className="mt-14">
        <Link href="/restaurants" className="btn-primary min-h-11">
          Book a Table
        </Link>
      </div>
    </AccountShell>
  );
}
