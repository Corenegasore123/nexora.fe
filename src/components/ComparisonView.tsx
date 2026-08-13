"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, apiUrl } from "@/lib/api";

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
  return "status-badge";
}

function deltaClass(delta: number | null) {
  if (delta === null || delta === 0) return "text-foreground-muted";
  if (delta > 0) return "text-warning";
  return "text-success";
}

export function ComparisonView({ jobId }: { jobId: string }) {
  const [data, setData] = useState<ComparisonData | null>(null);

  useEffect(() => {
    apiFetch<ComparisonData>(`/api/calculations/${jobId}/compare`)
      .then(setData)
      .catch(console.error);
  }, [jobId]);

  if (!data) return null;

  const rows = [data.baseline, ...data.scenarios, ...data.versions];
  if (rows.length <= 1) return null;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-label">Comparison</h2>
        <a
          href={apiUrl(`/api/calculations/${jobId}/compare?format=csv`)}
          className="text-xs text-foreground-muted hover:text-primary"
        >
          Export CSV
        </a>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
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
                <td className="font-mono text-foreground">
                  {row.result !== null ? `${row.result} ${row.unit ?? ""}` : "—"}
                </td>
                <td className={deltaClass(row.delta)}>
                  {row.type === "baseline"
                    ? "—"
                    : formatDelta(row.delta, row.unit, row.deltaPercent)}
                </td>
                <td>
                  {row.type !== "baseline" && (
                    <Link
                      href={`/app/history/${row.id}`}
                      className="text-xs text-foreground-muted hover:text-primary"
                    >
                      Open
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
