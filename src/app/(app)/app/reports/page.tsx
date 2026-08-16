"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCalculations, HistoryJobSummary, apiUrl } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { SkeletonTable } from "@/components/ui/Skeleton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function matchesSearch(job: HistoryJobSummary, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    job.image.filename.toLowerCase().includes(q) ||
    (job.project?.name.toLowerCase().includes(q) ?? false)
  );
}

export default function ReportsPage() {
  const [jobs, setJobs] = useState<HistoryJobSummary[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCalculations()
      .then((all) => setJobs(all.filter((j) => j.status === "COMPLETED")))
      .catch(() => setJobs([]));
  }, []);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((j) => matchesSearch(j, search));
  }, [jobs, search]);

  const stats = useMemo(() => {
    if (!jobs) return { total: 0, projects: 0, recent: 0 };
    const projectIds = new Set(jobs.map((j) => j.project?.id).filter(Boolean));
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return {
      total: jobs.length,
      projects: projectIds.size,
      recent: jobs.filter((j) => new Date(j.createdAt).getTime() > thirtyDaysAgo).length,
    };
  }, [jobs]);

  const pageSubtitle = !jobs
    ? "Loading reports…"
    : `${stats.total} exportable report${stats.total === 1 ? "" : "s"}`;

  useSetAppPageMeta({ title: "Reports", subtitle: pageSubtitle });

  if (!jobs) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-metrics">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dashboard-metric animate-pulse">
              <div className="h-3 w-20 rounded bg-border" />
              <div className="mt-3 h-8 w-12 rounded bg-border" />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <SkeletonTable rows={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-metrics">
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Ready to export</span>
          <span className="dashboard-metric-value">{stats.total}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Projects</span>
          <span className="dashboard-metric-value">{stats.projects}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Last 30 days</span>
          <span className="dashboard-metric-value">{stats.recent}</span>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <span className="settings-section-icon">
            <Icon name="file-text" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">Export library</h2>
            <p className="mt-1 text-xs text-foreground-muted">
              Download PDF or CSV reports from completed calculations.
            </p>
          </div>
          <Link href="/app/calculator" className="dashboard-section-link">
            New calculation
          </Link>
        </div>

        <div className="history-toolbar">
          <label className="history-search">
            <span className="sr-only">Search reports</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file or project…"
              className="input-field history-search-input"
            />
          </label>
        </div>

        {jobs.length === 0 ? (
          <div className="dashboard-empty">
            <p className="text-sm font-medium text-foreground">No reports yet</p>
            <p className="mt-1 text-sm text-foreground-muted">
              Complete a calculation to generate exportable PDF and CSV reports.
            </p>
            <Link href="/app/calculator" className="btn-primary mt-4 inline-flex gap-2">
              <Icon name="calculator" size={16} />
              Run calculation
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dashboard-empty">
            <p className="text-sm font-medium text-foreground">No matching reports</p>
            <p className="mt-1 text-sm text-foreground-muted">Try a different search term.</p>
          </div>
        ) : (
          <div className="dashboard-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Calculation</th>
                  <th className="hidden md:table-cell">Project</th>
                  <th>Result</th>
                  <th className="hidden sm:table-cell">Created</th>
                  <th>Export</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <Link href={`/app/history/${job.id}`} className="dashboard-row-link">
                        {job.image.filename}
                      </Link>
                      {job.version != null && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-muted">
                          v{job.version}
                        </span>
                      )}
                    </td>
                    <td className="hidden text-foreground-muted md:table-cell">
                      {job.project?.name ?? "—"}
                    </td>
                    <td className="font-mono text-sm">
                      {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                    </td>
                    <td className="hidden text-foreground-muted sm:table-cell">
                      {formatDate(job.createdAt)}
                    </td>
                    <td>
                      <div className="reports-export-actions">
                        <a
                          href={apiUrl(`/api/calculations/${job.id}/report?format=pdf&template=full`)}
                          className="reports-export-btn"
                        >
                          PDF
                        </a>
                        <a
                          href={apiUrl(`/api/calculations/${job.id}/report?format=csv&template=summary`)}
                          className="reports-export-btn"
                        >
                          CSV
                        </a>
                      </div>
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
