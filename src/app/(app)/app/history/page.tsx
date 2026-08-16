"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getHistoryJobs, HistoryJobSummary } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { SkeletonTable } from "@/components/ui/Skeleton";

type StatusFilter = "all" | "COMPLETED" | "FAILED" | "processing";

function statusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isProcessing(status: string) {
  return status !== "COMPLETED" && status !== "FAILED";
}

function matchesSearch(job: HistoryJobSummary, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    job.image.filename.toLowerCase().includes(q) ||
    (job.project?.name.toLowerCase().includes(q) ?? false)
  );
}

function matchesFilter(job: HistoryJobSummary, filter: StatusFilter) {
  if (filter === "all") return true;
  if (filter === "processing") return isProcessing(job.status);
  return job.status === filter;
}

const FILTER_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "COMPLETED", label: "Completed" },
  { key: "processing", label: "In progress" },
  { key: "FAILED", label: "Failed" },
];

export default function CalculationsPage() {
  const [jobs, setJobs] = useState<HistoryJobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    getHistoryJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      completed: jobs.filter((j) => j.status === "COMPLETED").length,
      processing: jobs.filter((j) => isProcessing(j.status)).length,
      failed: jobs.filter((j) => j.status === "FAILED").length,
    }),
    [jobs]
  );

  const filtered = useMemo(
    () => jobs.filter((j) => matchesFilter(j, filter) && matchesSearch(j, search)),
    [jobs, filter, search]
  );

  const pageSubtitle = loading
    ? "Loading calculation history…"
    : `${stats.total} run${stats.total === 1 ? "" : "s"} across your workspaces`;

  useSetAppPageMeta({ title: "History", subtitle: pageSubtitle });

  if (loading) {
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
        <div className="mt-6">
          <SkeletonTable rows={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-metrics">
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Total runs</span>
          <span className="dashboard-metric-value">{stats.total}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Completed</span>
          <span className="dashboard-metric-value">{stats.completed}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">In progress</span>
          <span className="dashboard-metric-value">{stats.processing}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Failed</span>
          <span className="dashboard-metric-value">{stats.failed}</span>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <span className="settings-section-icon">
            <Icon name="history" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">Calculation history</h2>
            <p className="mt-1 text-xs text-foreground-muted">
              Browse processed diagrams and open results for review.
            </p>
          </div>
          <Link href="/app/calculator" className="dashboard-section-link">
            New calculation
          </Link>
        </div>

        <div className="history-toolbar">
          <label className="history-search">
            <span className="sr-only">Search calculations</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file or project…"
              className="input-field history-search-input"
            />
          </label>
        </div>

        <div className="history-filters" role="tablist" aria-label="Calculation status">
          {FILTER_OPTIONS.map((opt) => {
            const count =
              opt.key === "all"
                ? jobs.length
                : opt.key === "processing"
                  ? stats.processing
                  : jobs.filter((j) => j.status === opt.key).length;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={filter === opt.key}
                onClick={() => setFilter(opt.key)}
                className={`history-filter-tab ${filter === opt.key ? "history-filter-tab-active" : ""}`}
              >
                {opt.label}
                <span className="history-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="dashboard-empty">
            <p className="text-sm font-medium text-foreground">
              {jobs.length === 0 ? "No calculations yet" : "No matching calculations"}
            </p>
            <p className="mt-1 text-sm text-foreground-muted">
              {jobs.length === 0
                ? "Upload a diagram to run your first analysis."
                : "Try a different search term or status filter."}
            </p>
            {jobs.length === 0 && (
              <Link href="/app/calculator" className="btn-primary mt-4 inline-flex gap-2">
                <Icon name="upload" size={16} />
                New calculation
              </Link>
            )}
          </div>
        ) : (
          <div className="dashboard-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th className="hidden md:table-cell">Project</th>
                  <th>Status</th>
                  <th>Result</th>
                  <th className="hidden sm:table-cell">Confidence</th>
                  <th className="hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <Link href={`/app/history/${job.id}`} className="dashboard-row-link">
                        {job.image.filename}
                      </Link>
                    </td>
                    <td className="hidden text-foreground-muted md:table-cell">
                      {job.project?.name ?? "—"}
                    </td>
                    <td>
                      <span className={statusClass(job.status)}>
                        {job.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="font-mono text-sm">
                      {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                    </td>
                    <td className="hidden tabular-nums sm:table-cell">
                      {job.overallConfidence
                        ? `${(job.overallConfidence * 100).toFixed(0)}%`
                        : "—"}
                    </td>
                    <td className="hidden text-foreground-muted lg:table-cell">
                      {formatDate(job.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
