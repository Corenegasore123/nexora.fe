"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CampusRequest, getMe, getRequests, type AuthUser } from "@/lib/api";
import { SlaBadge, StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function RequestsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [requests, setRequests] = useState<CampusRequest[] | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
    getRequests().then((d) => setRequests(d.requests)).catch(() => setRequests([]));
  }, []);

  return (
    <div className="page-shell space-y-6">
      <div className="flex justify-end">
        {user?.role === "STUDENT" && (
          <Link href="/app/requests/new" className="btn-primary">
            + New Request
          </Link>
        )}
      </div>
      {!requests?.length ? (
        <EmptyState
          title="No requests yet"
          description="Submit a transcript, clearance, letter, or equipment request to start a workflow."
          actionLabel={user?.role === "STUDENT" ? "New request" : undefined}
          actionHref="/app/requests/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-pending-bg text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Step</th>
                <th className="px-4 py-3">SLA</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-pending-bg/60">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/app/requests/${r.id}`} className="text-primary">
                      {r.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{r.type.name}</td>
                  <td className="px-4 py-3">{r.requester.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-foreground-secondary">{r.currentStep?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <SlaBadge sla={r.sla} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
