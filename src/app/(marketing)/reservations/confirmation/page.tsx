"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationBody() {
  const sp = useSearchParams();
  const number = sp.get("number") ?? "";
  const restaurant = sp.get("restaurant") ?? "Restaurant";
  const slug = sp.get("slug");
  const date = sp.get("date") ?? "";
  const time = sp.get("time") ?? "";
  const guests = sp.get("guests") ?? "";
  const email = sp.get("email");
  const phone = sp.get("phone");

  return (
    <div className="nx-discover mx-auto max-w-xl px-4 py-16">
      <p className="eyebrow text-success">Reservation confirmed</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">{restaurant}</h1>
      <p className="mt-3 text-foreground-secondary">
        {date} · {time} · {guests} {guests === "1" ? "guest" : "guests"}
      </p>
      <p className="mt-6 font-mono text-lg tracking-wide">{number}</p>
      <p className="mt-2 text-sm text-foreground-muted">
        Keep this reference. You can look it up later with your email or phone
        {email || phone ? ` (${[email, phone].filter(Boolean).join(" · ")})` : ""}.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account/reservations" className="btn-primary min-h-11">
          View reservation
        </Link>
        {slug && (
          <Link href={`/restaurants/${slug}`} className="btn-secondary min-h-11">
            Back to restaurant
          </Link>
        )}
        <Link href="/reservations/lookup" className="btn-ghost min-h-11">
          Look up later
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<p className="p-10 text-sm text-foreground-muted">Loading confirmation…</p>}>
      <ConfirmationBody />
    </Suspense>
  );
}
