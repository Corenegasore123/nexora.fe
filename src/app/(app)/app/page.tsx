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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

const STAT_CONFIG = [
  {
    key: "projects" as const,
    label: "Projects",
    icon: "folder" as IconName,
    href: "/app/projects",
    meta: "Active workspaces",
  },
  {
    key: "pendingAnalyses" as const,
    label: "In progress",
    icon: "scan" as IconName,
    href: "/app/history",
    meta: "Running analyses",
    warn: true,
  },
  {
    key: "completedAnalyses" as const,
    label: "Completed",
    icon: "clipboard-check" as IconName,
    href: "/app/history",
    meta: "Finished calculations",
  },
  {
    key: "documents" as const,
    label: "Documents",
    icon: "file-text" as IconName,
    href: "/app/projects",
    meta: "Uploaded drawings",
  },
];

const QUICK_ACTIONS = [
  { href: "/app/calculator", label: "Run calculation", icon: "calculator" as IconName },
  { href: "/app/projects", label: "Browse projects", icon: "folder" as IconName },
  { href: "/app/reports", label: "View reports", icon: "file-text" as IconName },
  { href: "/app/rules", label: "Calculation rules", icon: "book-open" as IconName },
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
        <div className="dashboard-stat-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable rows={5} />
      </div>
    );
  }

  const processing = data.recentCalculations.filter(
    (j) => j.status !== "COMPLETED" && j.status !== "FAILED"
  );
  const completionRate =
    data.stats.calculations > 0
      ? Math.round((data.stats.completedAnalyses / data.stats.calculations) * 100)
      : 0;

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Workspace overview</p>
        <h2 className="dashboard-hero-title mt-2">Your engineering pipeline at a glance</h2>
        <p className="dashboard-hero-text">
          Monitor project activity, track live analyses, and return to recent calculations without leaving
          the dashboard.
        </p>

        {data.stats.needsReview > 0 && (
          <div className="dashboard-alert">
            <Icon name="shield" size={18} className="mt-0.5 shrink-0" />
            <p>
              <span className="font-semibold">{data.stats.needsReview} calculation(s)</span> need review
              for low-confidence measurements.
            </p>
          </div>
        )}

        <div className="dashboard-hero-actions">
          <Link href="/app/calculator" className="btn-primary inline-flex gap-2">
            <Icon name="plus-circle" size={16} />
            New calculation
          </Link>
          <Link href="/app/projects/new" className="btn-secondary">
            Create project
          </Link>
        </div>
      </section>

      <div className="dashboard-stat-grid">
        {STAT_CONFIG.map((stat) => {
          const value = data.stats[stat.key];
          const highlight = stat.warn && value > 0;
          return (
            <Link key={stat.key} href={stat.href} className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <div>
                  <p className="dashboard-stat-label">{stat.label}</p>
                  <p className={`dashboard-stat-value ${highlight ? "text-warning" : ""}`}>{value}</p>
                </div>
                <span className="dashboard-stat-icon">
                  <Icon name={stat.icon} size={18} />
                </span>
              </div>
              <p className="dashboard-stat-meta">{stat.meta}</p>
            </Link>
          );
        })}
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">Quick actions</h3>
            <p className="dashboard-section-desc">Jump straight into common workflows</p>
          </div>
        </div>
        <div className="dashboard-quick-grid">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href} className="dashboard-quick-link">
              <span className="dashboard-quick-icon">
                <Icon name={action.icon} size={18} />
              </span>
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="dashboard-layout-grid">
        <div className="dashboard-layout-main">
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h3 className="dashboard-section-title">Recent projects</h3>
                <p className="dashboard-section-desc">Latest workspaces you&apos;ve been working in</p>
              </div>
              <Link href="/app/projects" className="dashboard-view-link">
                View all
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            {data.recentProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create your first project to organize documents and calculations."
                actionLabel="Create project"
                actionHref="/app/projects/new"
              />
            ) : (
              <div className="dashboard-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Calculations</th>
                      <th>Documents</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentProjects.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="dashboard-file-cell">
                            <span className="dashboard-file-icon">
                              <Icon name="folder" size={16} />
                            </span>
                            <span className="font-medium text-foreground">{p.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge status-pending">{p.status}</span>
                        </td>
                        <td className="tabular-nums">{p._count?.calculationJobs ?? 0}</td>
                        <td className="tabular-nums">{p._count?.images ?? 0}</td>
                        <td className="text-right">
                          <Link href={`/app/projects/${p.id}`} className="dashboard-view-link">
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

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h3 className="dashboard-section-title">Recent calculations</h3>
                <p className="dashboard-section-desc">Latest uploads and analysis results</p>
              </div>
              <Link href="/app/history" className="dashboard-view-link">
                View history
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            {data.recentCalculations.length === 0 ? (
              <EmptyState
                title="No calculations yet"
                description="Upload a technical drawing to run your first analysis."
                actionLabel="New calculation"
                actionHref="/app/calculator"
              />
            ) : (
              <div className="dashboard-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th className="hidden md:table-cell">Project</th>
                      <th className="hidden sm:table-cell">Date</th>
                      <th>Status</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentCalculations.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <Link href={`/app/history/${job.id}`} className="dashboard-file-cell hover:text-primary">
                            <span className="dashboard-file-icon">
                              <Icon name="file-text" size={16} />
                            </span>
                            <span className="font-medium">{job.image.filename}</span>
                          </Link>
                        </td>
                        <td className="hidden text-foreground-muted md:table-cell">
                          {job.project?.name ?? "—"}
                        </td>
                        <td className="hidden text-foreground-muted sm:table-cell">
                          {formatDate(job.createdAt)}
                        </td>
                        <td>
                          <span className={statusClass(job.status)}>{formatStatus(job.status)}</span>
                        </td>
                        <td className="font-mono text-sm">
                          {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="dashboard-layout-side">
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h3 className="dashboard-section-title">Live processing</h3>
                <p className="dashboard-section-desc">Jobs currently running in the queue</p>
              </div>
            </div>
            <div className="card min-h-[240px] space-y-4">
              {processing.length === 0 ? (
                <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center">
                  <span className="dashboard-file-icon mb-3 !h-11 !w-11">
                    <Icon name="clipboard-check" size={20} />
                  </span>
                  <p className="text-sm font-medium text-foreground">All clear</p>
                  <p className="mt-1 text-xs text-foreground-muted">No analyses are processing right now.</p>
                </div>
              ) : (
                processing.slice(0, 4).map((job) => (
                  <div key={job.id} className="dashboard-processing-card">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-medium text-foreground">{job.image.filename}</p>
                      <span className={statusClass(job.status)}>{formatStatus(job.status)}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                      <div className="h-full w-4/5 animate-pulse rounded-full bg-primary" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h3 className="dashboard-section-title">Performance</h3>
                <p className="dashboard-section-desc">Completion snapshot</p>
              </div>
            </div>
            <div className="card space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-foreground-muted">
                  <span>Completion rate</span>
                  <span className="font-semibold text-foreground">{completionRate}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-success transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground-muted">Revised</p>
                  <p className="mt-1 text-lg font-bold tabular-nums">{data.stats.revisedCalculations}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground-muted">Corrected</p>
                  <p className="mt-1 text-lg font-bold tabular-nums">{data.stats.correctedMeasurements}</p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {data.needsReview.length > 0 && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h3 className="dashboard-section-title">Needs review</h3>
              <p className="dashboard-section-desc">Calculations flagged for low-confidence measurements</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.needsReview.map((job) => (
              <Link key={job.id} href={`/app/history/${job.id}`} className="dashboard-review-card">
                <div className="dashboard-file-cell">
                  <span className="dashboard-file-icon !bg-warning-bg !text-warning">
                    <Icon name="shield" size={16} />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{job.image.filename}</p>
                    <p className="mt-0.5 text-xs text-warning">Review recommended</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-foreground-secondary">
                  {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
