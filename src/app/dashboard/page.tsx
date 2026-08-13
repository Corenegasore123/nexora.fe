"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard, DashboardData } from "@/lib/api";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
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
        <p className="text-neutral-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="page-title mt-3">Overview</h1>
          <p className="page-subtitle">Your projects, documents, and recent analyses.</p>
        </div>
        <Link href="/projects/new" className="btn-primary hidden md:inline-flex">
          New Project
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Projects" value={data.stats.projects} />
        <StatCard label="Calculations" value={data.stats.calculations} />
        <StatCard label="Completed" value={data.stats.completedAnalyses} />
        <StatCard label="Pending" value={data.stats.pendingAnalyses} />
        <StatCard label="Documents" value={data.stats.documents} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Recent Projects
            </h2>
            <Link href="/projects" className="text-xs text-neutral-500 hover:text-white">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentProjects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="card-raised block">
                <p className="font-medium text-white">{p.name}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {p._count?.calculationJobs ?? 0} calculations · {p._count?.images ?? 0} documents
                </p>
              </Link>
            ))}
            {data.recentProjects.length === 0 && (
              <p className="text-sm text-neutral-500">No projects yet.</p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Recent Analyses
            </h2>
            <Link href="/calculations" className="text-xs text-neutral-500 hover:text-white">
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th>File</th>
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
                        className="font-medium text-white hover:text-neutral-300"
                      >
                        {job.image.filename}
                      </Link>
                    </td>
                    <td>
                      <span className={statusClass(job.status)}>
                        {job.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="font-mono text-white">
                      {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                    </td>
                  </tr>
                ))}
                {data.recentCalculations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-neutral-500">
                      No analyses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
