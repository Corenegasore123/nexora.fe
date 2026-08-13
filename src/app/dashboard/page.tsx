"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard, DashboardData } from "@/lib/api";

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: "warning" | "success";
}) {
  const color =
    highlight === "warning"
      ? "text-warning"
      : highlight === "success"
        ? "text-success"
        : "text-foreground";
  return (
    <div className="card">
      <p className="eyebrow">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function statusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="page-shell">
        <p className="text-foreground-muted">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="page-shell pb-24 md:pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="page-title mt-3">Overview</h1>
          <p className="page-subtitle">Your projects, documents, and recent analyses.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/upload" className="btn-primary md:hidden">
            Quick Upload
          </Link>
          <Link href="/calculator" className="btn-secondary hidden md:inline-flex">
            Upload &amp; Calculate
          </Link>
          <Link href="/projects/new" className="btn-primary hidden md:inline-flex">
            New Project
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Projects" value={data.stats.projects} />
        <StatCard label="Calculations" value={data.stats.calculations} />
        <StatCard label="Completed" value={data.stats.completedAnalyses} />
        <StatCard label="Pending" value={data.stats.pendingAnalyses} />
        <StatCard label="Documents" value={data.stats.documents} />
        <StatCard
          label="Needs Review"
          value={data.stats.needsReview}
          highlight={data.stats.needsReview > 0 ? "warning" : undefined}
        />
        <StatCard
          label="Revised"
          value={data.stats.revisedCalculations}
          highlight={data.stats.revisedCalculations > 0 ? "success" : undefined}
        />
        <StatCard label="Corrections" value={data.stats.correctedMeasurements} />
      </div>

      {data.needsReview.length > 0 && (
        <section className="mt-10">
          <h2 className="section-label">Needs Review</h2>
          <div className="mt-4 space-y-3">
            {data.needsReview.map((job) => (
              <Link
                key={job.id}
                href={`/calculations/${job.id}`}
                className="card-raised flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-foreground">{job.image.filename}</p>
                  <p className="mt-1 text-xs text-warning">Low-confidence measurements detected</p>
                </div>
                <span className="font-mono text-sm text-foreground">
                  {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Recent Projects
            </h2>
            <Link href="/projects" className="text-xs text-foreground-muted hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentProjects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="card-raised block">
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  {p._count?.calculationJobs ?? 0} calculations · {p._count?.images ?? 0} documents
                </p>
              </Link>
            ))}
            {data.recentProjects.length === 0 && (
              <p className="text-sm text-foreground-muted">No projects yet.</p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Recent Documents
            </h2>
            <Link href="/upload" className="text-xs text-foreground-muted hover:text-foreground md:hidden">
              Upload
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentDocuments.map((doc) => (
              <div key={doc.id} className="card-raised flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{doc.filename}</p>
                  <p className="mt-1 text-xs text-foreground-muted">
                    {doc.project?.name ?? "Unassigned"} · {doc.status.replace(/_/g, " ")}
                  </p>
                </div>
                {doc.project && (
                  <Link
                    href={`/projects/${doc.project.id}`}
                    className="btn-ghost shrink-0 py-1.5 text-[10px]"
                  >
                    Open
                  </Link>
                )}
              </div>
            ))}
            {data.recentDocuments.length === 0 && (
              <p className="text-sm text-foreground-muted">No documents yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Recent Analyses
          </h2>
          <Link href="/calculations" className="text-xs text-foreground-muted hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="data-table">
            <thead>
              <tr>
                <th>File</th>
                <th className="hidden sm:table-cell">Project</th>
                <th>Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {data.recentCalculations.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link
                      href={`/calculations/${job.id}`}
                      className="font-medium text-foreground hover:text-foreground"
                    >
                      {job.image.filename}
                    </Link>
                    {job.result?.validation?.status === "needs_review" && (
                      <span className="ml-2 text-[10px] text-warning">review</span>
                    )}
                  </td>
                  <td className="hidden sm:table-cell text-foreground-muted">
                    {job.project?.name ?? "—"}
                  </td>
                  <td>
                    <span className={statusClass(job.status)}>
                      {job.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="font-mono text-foreground">
                    {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                  </td>
                </tr>
              ))}
              {data.recentCalculations.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-foreground-muted">
                    No analyses yet.{" "}
                    <Link href="/upload" className="text-foreground underline underline-offset-4">
                      Upload a diagram
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Link href="/upload" className="fab md:hidden" aria-label="Quick upload">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}
