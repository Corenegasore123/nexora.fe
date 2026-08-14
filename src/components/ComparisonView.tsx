"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, apiUrl } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";

interface ComparisonRow {
  id: string;
  label: string;
  type: "baseline" | "scenario" | "version";
  version?: number;
  result: number | null;
  unit: string | null;
  delta: number | null;
  deltaPercent: number | null;
}

interface ComparisonData {
  baseline: ComparisonRow;
  scenarios: ComparisonRow[];
  versions: ComparisonRow[];
}

function formatDelta(delta: number | null, unit: string | null, pct: number | null) {
  if (delta === null) return "—";
  const sign = delta > 0 ? "+" : "";
  const pctStr = pct !== null ? ` (${sign}${pct.toFixed(1)}%)` : "";
  return `${sign}${delta.toFixed(3)} ${unit ?? ""}${pctStr}`;
}

function typeBadge(type: ComparisonRow["type"]) {
  if (type === "baseline") return "status-badge status-completed";
  if (type === "scenario") return "status-badge status-processing";
  return "status-badge status-pending";
}

function deltaClass(delta: number | null) {
  if (delta === null || delta === 0) return "text-foreground-muted";
  if (delta > 0) return "text-warning";
  return "text-success";
}

export function ComparisonView({ jobId, embedded = false }: { jobId: string; embedded?: boolean }) {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<ComparisonData>(`/api/calculations/${jobId}/compare`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return embedded ? (
      <section className="dashboard-section">
        <div className="dashboard-empty">
          <p className="text-sm text-foreground-muted">Loading comparisons…</p>
        </div>
      </section>
    ) : null;
  }

  if (!data) {
    return embedded ? (
      <section className="dashboard-section">
        <div className="dashboard-empty">
          <p className="text-sm font-medium text-foreground">No comparison data</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Create a scenario or revision to compare results.
          </p>
        </div>
      </section>
    ) : null;
  }

  const rows = [data.baseline, ...data.scenarios, ...data.versions];
  if (rows.length <= 1) {
    return embedded ? (
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <span className="settings-section-icon">
            <Icon name="scale" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">Compare results</h2>
            <p className="mt-1 text-xs text-foreground-muted">
              Baseline only — create scenarios to compare variations.
            </p>
          </div>
        </div>
        <div className="dashboard-empty">
          <p className="text-sm text-foreground-muted">
            Use the Calculation tab to create a what-if scenario.
          </p>
        </div>
      </section>
    ) : null;
  }

  const content = (
    <>
      <div className="dashboard-section-header">
        <span className="settings-section-icon">
          <Icon name="scale" size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground">Compare results</h2>
          <p className="mt-1 text-xs text-foreground-muted">
            Baseline vs scenarios and version revisions.
          </p>
        </div>
        <a href={apiUrl(`/api/calculations/${jobId}/compare?format=csv`)} className="dashboard-section-link">
          Export CSV
        </a>
      </div>
      <div className="dashboard-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Type</th>
              <th>Result</th>
              <th>Delta vs baseline</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.type}-${row.id}`}>
                <td className="font-medium text-foreground">
                  {row.label}
                  {row.version !== undefined && row.type !== "baseline" && (
                    <span className="ml-2 text-xs text-foreground-muted">v{row.version}</span>
                  )}
                </td>
                <td>
                  <span className={typeBadge(row.type)}>{row.type}</span>
                </td>
                <td className="font-mono text-sm">
                  {row.result !== null ? `${row.result} ${row.unit ?? ""}` : "—"}
                </td>
                <td className={`font-mono text-sm ${deltaClass(row.delta)}`}>
                  {row.type === "baseline"
                    ? "—"
                    : formatDelta(row.delta, row.unit, row.deltaPercent)}
                </td>
                <td>
                  {row.type !== "baseline" && (
                    <Link href={`/app/history/${row.id}`} className="dashboard-row-link text-xs">
                      Open
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  if (embedded) {
    return <section className="dashboard-section">{content}</section>;
  }

  return <section className="mt-12">{content}</section>;
}
