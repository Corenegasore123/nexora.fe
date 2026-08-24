"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { approveReview, getModerationQueue, rejectReview, type ModerationReview } from "@/lib/api";
import { RatingStars } from "@/components/discover/RatingStars";

export default function ModerationPage() {
  const [status, setStatus] = useState("pending");
  const [rows, setRows] = useState<ModerationReview[]>([]);
  const [reason, setReason] = useState<Record<string, string>>({});

  const load = () => getModerationQueue(status).then(setRows).catch(() => setRows([]));
  useEffect(() => {
    load();
  }, [status]);

  return (
    <div className="page-shell space-y-6 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            <Link href="/platform-admin" className="text-primary">
              Platform
            </Link>{" "}
            / Moderation
          </p>
          <h1 className="mt-2 text-3xl font-bold">Review moderation</h1>
        </div>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={status === s ? "btn-primary text-xs capitalize" : "btn-secondary text-xs capitalize"}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <article key={r.id} className="card space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.restaurant.name}</p>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {r.author}
                  {r.reservation ? ` · ${r.reservation.number}` : ""} · <RatingStars value={r.rating} size={12} />
                </p>
                <p className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="nx-chip">Food {r.food}</span>
                  <span className="nx-chip">Service {r.service}</span>
                  <span className="nx-chip">Ambience {r.ambience}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed">{r.comment || "No comment"}</p>
              </div>
              {status === "pending" && (
                <div className="flex w-full max-w-xs flex-col gap-2 sm:w-auto">
                  <input
                    className="rounded-lg border border-border px-3 py-2 text-sm"
                    placeholder="Reject reason (optional)"
                    value={reason[r.id] ?? ""}
                    onChange={(e) => setReason({ ...reason, [r.id]: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button className="btn-primary text-xs" type="button" onClick={() => approveReview(r.id).then(load)}>
                      Approve
                    </button>
                    <button
                      className="btn-ghost text-xs"
                      type="button"
                      onClick={() => rejectReview(r.id, reason[r.id]).then(load)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
        {!rows.length && <p className="card text-sm text-foreground-muted">No reviews in this queue.</p>}
      </div>
    </div>
  );
}
