"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDashboard, getMe, DashboardData, AuthUser } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { DashboardCharts } from "@/components/app/DashboardCharts";
import { SkeletonTable } from "@/components/ui/Skeleton";

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

const QUICK_ACTIONS = [
  { href: "/app/calculator", label: "New calculation", icon: "plus-circle" as const, primary: true },
  { href: "/app/projects/new", label: "New project", icon: "folder" as const },
  { href: "/app/projects", label: "Browse projects", icon: "layout-dashboard" as const },
  { href: "/app/history", label: "View history", icon: "history" as const },
  { href: "/app/reports", label: "Reports", icon: "file-text" as const },
  { href: "/app/rules", label: "Rules", icon: "book-open" as const },
];

const STAT_CONFIG = [
  { key: "projects" as const, label: "Projects", href: "/app/projects" },
  { key: "pendingAnalyses" as const, label: "In progress", href: "/app/history", warn: true },
  { key: "completedAnalyses" as const, label: "Completed", href: "/app/history" },
  { key: "documents" as const, label: "Documents", href: "/app/projects" },
];

function statusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

function DashboardEmpty({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="dashboard-empty">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      <Link href={actionHref} className="btn-primary mt-4 inline-flex">
        {actionLabel}
      </Link>
    </div>
  );
}

function DashboardSection({
  title,
  description,
  icon,
  action,
  children,
}: {
  title: string;
  description: string;
  icon: "folder" | "history" | "scan" | "shield" | "plus-circle";
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <span className="settings-section-icon">
          <Icon name={icon} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-foreground-muted">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
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
      <div className="dashboard-shell">
        <div className="dashboard-metrics">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dashboard-metric animate-pulse">
              <div className="h-3 w-20 rounded bg-border" />
              <div className="mt-3 h-8 w-12 rounded bg-border" />
            </div>
          ))}
        </div>
        <div className="dashboard-charts dashboard-charts-loading mt-6">
          <div className="dashboard-chart-card animate-pulse">
            <div className="h-4 w-24 rounded bg-border" />
            <div className="mt-6 h-32 rounded bg-border" />
          </div>
          <div className="dashboard-chart-card animate-pulse">
            <div className="h-4 w-32 rounded bg-border" />
            <div className="mt-6 h-32 rounded bg-border" />
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkeletonTable rows={4} />
          </div>
          <SkeletonTable rows={3} />
        </div>
      </div>
    );
  }

  const processing = data.recentCalculations.filter(
    (j) => j.status !== "COMPLETED" && j.status !== "FAILED"
  );

  return (
    <div className="dashboard-shell">
      {data.stats.needsReview > 0 && (
        <div className="dashboard-notice">
          <Icon name="shield" size={16} className="shrink-0" />
          <p>
            <span className="font-medium">{data.stats.needsReview}</span> calculation
            {data.stats.needsReview === 1 ? "" : "s"} require review.
          </p>
          <Link href="/app/history" className="dashboard-notice-link">
            Review
          </Link>
        </div>
      )}

      <div className="dashboard-metrics">
        {STAT_CONFIG.map((stat) => {
          const value = data.stats[stat.key];
          const highlight = stat.warn && value > 0;
          return (
            <Link key={stat.key} href={stat.href} className="dashboard-metric">
              <span className="dashboard-metric-label">{stat.label}</span>
              <span className={`dashboard-metric-value ${highlight ? "text-warning" : ""}`}>{value}</span>
            </Link>
          );
        })}
      </div>

      <DashboardSection
        title="Quick actions"
        description="Common tasks and shortcuts."
        icon="plus-circle"
      >
        <div className="dashboard-actions">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`dashboard-action ${action.primary ? "dashboard-action-primary" : ""}`}
            >
              <span className="dashboard-action-icon">
                <Icon name={action.icon} size={16} />
              </span>
              {action.label}
            </Link>
          ))}
        </div>
      </DashboardSection>

      <DashboardCharts data={data} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DashboardSection
            title="Recent projects"
            description="Workspaces with recent activity."
            icon="folder"
            action={
              <Link href="/app/projects" className="dashboard-section-link">
                View all
              </Link>
            }
          >
            {data.recentProjects.length === 0 ? (
              <DashboardEmpty
                title="No projects yet"
                description="Create a project to organize documents and calculations."
                actionLabel="Create project"
                actionHref="/app/projects/new"
              />
            ) : (
              <div className="dashboard-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Calculations</th>
                      <th>Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentProjects.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link href={`/app/projects/${p.id}`} className="dashboard-row-link">
                            {p.name}
                          </Link>
                        </td>
                        <td>
                          <span className="status-badge status-pending">{p.status}</span>
                        </td>
                        <td className="tabular-nums">{p._count?.calculationJobs ?? 0}</td>
                        <td className="tabular-nums">{p._count?.images ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardSection>

          <DashboardSection
            title="Recent calculations"
            description="Latest analysis results across your workspace."
            icon="history"
            action={
              <Link href="/app/history" className="dashboard-section-link">
                View history
              </Link>
            }
          >
            {data.recentCalculations.length === 0 ? (
              <DashboardEmpty
                title="No calculations yet"
                description="Upload a technical drawing to run your first analysis."
                actionLabel="New calculation"
                actionHref="/app/calculator"
              />
            ) : (
              <div className="dashboard-table-wrap">
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
                          <Link href={`/app/history/${job.id}`} className="dashboard-row-link">
                            {job.image.filename}
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
                        <td className="font-mono text-sm text-foreground">
                          {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardSection>
        </div>

        <div className="space-y-6">
          <DashboardSection
            title="Processing queue"
            description="Analyses currently running."
            icon="scan"
          >
            {processing.length === 0 ? (
              <p className="dashboard-empty-text">No active jobs.</p>
            ) : (
              <ul className="dashboard-queue">
                {processing.slice(0, 6).map((job) => (
                  <li key={job.id} className="dashboard-queue-item">
                    <Link href={`/app/history/${job.id}`} className="dashboard-row-link block truncate">
                      {job.image.filename}
                    </Link>
                    <span className={`mt-2 inline-flex ${statusClass(job.status)}`}>
                      {formatStatus(job.status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </DashboardSection>

          {data.needsReview.length > 0 && (
            <DashboardSection
              title="Needs review"
              description="Low-confidence measurements flagged for verification."
              icon="shield"
            >
              <ul className="dashboard-queue">
                {data.needsReview.map((job) => (
                  <li key={job.id} className="dashboard-queue-item">
                    <Link href={`/app/history/${job.id}`} className="dashboard-row-link block truncate">
                      {job.image.filename}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-foreground-secondary">
                      {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </DashboardSection>
          )}
        </div>
      </div>
    </div>
  );
}
