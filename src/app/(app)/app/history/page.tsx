"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistoryJobs, HistoryJobSummary } from "@/lib/api";

function statusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

export default function CalculationsPage() {
  const [jobs, setJobs] = useState<HistoryJobSummary[]>([]);

  useEffect(() => {
    getHistoryJobs().then(setJobs);
  }, []);

  return (
    <div className="page-shell">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">History</p>
          <h1 className="page-title mt-3">Calculations</h1>
          <p className="page-subtitle">All processed diagrams and their results.</p>
        </div>
        <Link href="/app/calculator" className="btn-secondary hidden md:inline-flex">
          New Calculation
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="data-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Status</th>
              <th>Result</th>
              <th>Confidence</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <Link
                    href={`/app/history/${job.id}`}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {job.image.filename}
                  </Link>
                </td>
                <td>
                  <span className={statusClass(job.status)}>
                    {job.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="font-mono text-foreground">
                  {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                </td>
                <td>
                  {job.overallConfidence
                    ? `${(job.overallConfidence * 100).toFixed(0)}%`
                    : "—"}
                </td>
                <td className="text-foreground-muted">
                  {new Date(job.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-foreground-muted">
                  No calculations yet.{" "}
                  <Link href="/app/calculator" className="text-foreground underline underline-offset-4">
                    Upload an image
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
