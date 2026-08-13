"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDashboard, getMe, DashboardData, AuthUser } from "@/lib/api";
import { Icon, type IconName } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STAT_CONFIG = [
  { key: "projects" as const, label: "Projects", icon: "folder" as IconName },
  { key: "pendingAnalyses" as const, label: "Active Analyses", icon: "scan" as IconName, warn: true },
  { key: "completedAnalyses" as const, label: "Completed", icon: "clipboard-check" as IconName },
  { key: "documents" as const, label: "Documents", icon: "file-text" as IconName },
];

function statusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const pageSubtitle = useMemo(() => `${greeting()}, ${firstName}`, [firstName]);

  useSetAppPageMeta({ title: "Dashboard", subtitle: pageSubtitle });

  useEffect(() => {
    Promise.all([getDashboard(), getMe()]).then(([d, u]) => {
      setData(d);
      setUser(u);
    });
  }, []);

  if (!data) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-stat-grid !mt-0">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="dashboard-section">
          <SkeletonTable rows={4} />
        </div>
      </div>
    );
  }

  const processing = data.recentCalculations.filter(
    (j) => j.status !== "COMPLETED" && j.status !== "FAILED"
  );

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Workspace overview</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
            Track projects, monitor processing jobs, and jump back into recent calculations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/app/calculator" className="btn-primary inline-flex gap-2">
            <Icon name="plus-circle" size={16} />
            New Calculation
          </Link>
          <Link href="/app/projects/new" className="btn-secondary">
            New Project
          </Link>
        </div>
      </section>

      <div className="dashboard-stat-grid">
        {STAT_CONFIG.map((stat) => {
          const value = data.stats[stat.key];
          const highlight = stat.warn && value > 0;
          return (
            <div key={stat.key} className="dashboard-stat-card">
              <span className="dashboard-stat-icon">
                <Icon name={stat.icon} size={20} />
              </span>
              <div>
                <p className="eyebrow">{stat.label}</p>
                <p className={`dashboard-stat-value ${highlight ? "text-warning" : ""}`}>{value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-section grid gap-8 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="dashboard-section-header">
            <h2 className="section-label">Recent Projects</h2>
            <Link href="/app/projects" className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
              View all
            </Link>
          </div>
          {data.recentProjects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Create your first project to organize your calculations."
              actionLabel="Create Project"
              actionHref="/app/projects/new"
            />
          ) : (
            <div className="dashboard-panel">
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
                        <Link href={`/app/projects/${p.id}`} className="text-xs font-semibold text-primary hover:underline">
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
          <div className="dashboard-section-header">
            <h2 className="section-label">Processing</h2>
          </div>
          <div className="card min-h-[220px]">
            {processing.length === 0 ? (
              <p className="text-sm text-foreground-muted">No jobs currently processing.</p>
            ) : (
              <ul className="space-y-5">
                {processing.slice(0, 3).map((job) => (
                  <li key={job.id}>
                    <p className="truncate text-sm font-medium text-foreground">{job.image.filename}</p>
                    <p className="mt-1 text-xs text-foreground-muted">{job.status.replace(/_/g, " ")}</p>
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-border">
                      <div className="h-full w-4/5 animate-pulse rounded-full bg-primary" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="section-label">Recent Calculations</h2>
          <Link href="/app/history" className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
            View history
          </Link>
        </div>
        <div className="dashboard-panel">
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
                  <td className="hidden text-foreground-muted sm:table-cell">{job.project?.name ?? "—"}</td>
                  <td>
                    <span className={statusClass(job.status)}>{job.status.replace(/_/g, " ")}</span>
                  </td>
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
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="section-label">Needs Review</h2>
          </div>
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
