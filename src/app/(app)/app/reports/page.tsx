"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCalculations, HistoryJobSummary, apiUrl } from "@/lib/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";

function statusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

export default function ReportsPage() {
  const [jobs, setJobs] = useState<HistoryJobSummary[] | null>(null);

  useEffect(() => {
    getCalculations()
      .then((all) => setJobs(all.filter((j) => j.status === "COMPLETED")))
      .catch(() => setJobs([]));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <p className="eyebrow">Output</p>
      <h1 className="page-title mt-3">Reports</h1>
      <p className="page-subtitle">Download and manage exported calculation reports.</p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface">
        {!jobs ? (
          <div className="p-6"><SkeletonTable rows={5} /></div>
        ) : jobs.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No reports yet"
              description="Complete a calculation to generate exportable reports."
              actionLabel="New Calculation"
              actionHref="/app/calculator"
            />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Calculation</th>
                <th>Project</th>
                <th>Result</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link href={`/app/history/${job.id}`} className="font-medium text-foreground hover:text-primary">
                      {job.image.filename}
                    </Link>
                    <span className="ml-2 text-xs text-foreground-muted">v{job.version}</span>
                  </td>
                  <td className="text-foreground-muted">{job.project?.name ?? "—"}</td>
                  <td className="font-mono">
                    {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                  </td>
                  <td className="text-foreground-muted">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <a
                      href={apiUrl(`/api/calculations/${job.id}/report?format=pdf&template=full`)}
                      className="text-xs text-primary hover:underline"
                    >
                      PDF
                    </a>
                    <span className="mx-2 text-foreground-placeholder">·</span>
                    <a
                      href={apiUrl(`/api/calculations/${job.id}/report?format=csv&template=summary`)}
                      className="text-xs text-primary hover:underline"
                    >
                      CSV
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
