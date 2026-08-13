"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard, getMe, DashboardData, AuthUser } from "@/lib/api";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: "warning" | "success" }) {
  const color =
    highlight === "warning" ? "text-warning" : highlight === "success" ? "text-success" : "text-foreground";
  return (
    <div className="card">
      <p className="eyebrow">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
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
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    Promise.all([getDashboard(), getMe()]).then(([d, u]) => {
      setData(d);
      setUser(u);
    }).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="mt-8"><SkeletonTable rows={4} /></div>
      </div>
    );
  }

  const processing = data.recentCalculations.filter(
    (j) => j.status !== "COMPLETED" && j.status !== "FAILED"
  );
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Here&apos;s what&apos;s happening with your work.
          </p>
        </div>
        <Link href="/app/calculator" className="btn-primary shrink-0">
          + New Calculation
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={data.stats.projects} />
        <StatCard label="Active Analyses" value={data.stats.pendingAnalyses} highlight={data.stats.pendingAnalyses > 0 ? "warning" : undefined} />
        <StatCard label="Completed Calculations" value={data.stats.completedAnalyses} />
        <StatCard label="Documents" value={data.stats.documents} />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-label">Recent Projects</h2>
            <Link href="/app/projects" className="text-xs text-foreground-muted hover:text-primary">View all</Link>
          </div>
          {data.recentProjects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Create your first project to organize your calculations."
              actionLabel="Create Project"
              actionHref="/app/projects/new"
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Calculations</th>
                    <th>Documents</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.recentProjects.map((p) => (
                    <tr key={p.id}>
                      <td className="font-medium text-foreground">{p.name}</td>
                      <td>{p._count?.calculationJobs ?? 0}</td>
                      <td>{p._count?.images ?? 0}</td>
                      <td>
                        <Link href={`/app/projects/${p.id}`} className="text-xs text-primary hover:underline">
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="section-label mb-4">Processing</h2>
          <div className="card min-h-[200px]">
            {processing.length === 0 ? (
              <p className="text-sm text-foreground-muted">No jobs currently processing.</p>
            ) : (
              <ul className="space-y-4">
                {processing.slice(0, 3).map((job) => (
                  <li key={job.id}>
                    <p className="truncate text-sm font-medium text-foreground">{job.image.filename}</p>
                    <p className="mt-1 text-xs text-foreground-muted">{job.status.replace(/_/g, " ")}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                      <div className="h-full w-4/5 animate-pulse rounded-full bg-primary" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-label">Recent Calculations</h2>
          <Link href="/app/history" className="text-xs text-foreground-muted hover:text-primary">View history</Link>
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
                    <Link href={`/app/history/${job.id}`} className="font-medium hover:text-primary">
                      {job.image.filename}
                    </Link>
                  </td>
                  <td className="hidden sm:table-cell text-foreground-muted">{job.project?.name ?? "—"}</td>
                  <td><span className={statusClass(job.status)}>{job.status.replace(/_/g, " ")}</span></td>
                  <td className="font-mono">{job.result ? `${job.result.result} ${job.result.unit}` : "—"}</td>
                </tr>
              ))}
              {data.recentCalculations.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <EmptyState
                      title="No calculations yet"
                      description="Upload a diagram to run your first analysis."
                      actionLabel="New Calculation"
                      actionHref="/app/calculator"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {data.needsReview.length > 0 && (
        <section className="mt-10">
          <h2 className="section-label mb-4">Needs Review</h2>
          <div className="space-y-3">
            {data.needsReview.map((job) => (
              <Link key={job.id} href={`/app/history/${job.id}`} className="card-raised flex justify-between gap-4">
                <div>
                  <p className="font-medium">{job.image.filename}</p>
                  <p className="mt-1 text-xs text-warning">Low-confidence measurements</p>
                </div>
                <span className="font-mono text-sm">{job.result ? `${job.result.result} ${job.result.unit}` : "—"}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
