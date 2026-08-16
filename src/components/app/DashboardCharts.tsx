"use client";

import { useMemo } from "react";
import type { DashboardData } from "@/lib/api";

const CHART_COLORS = {
  completed: "var(--color-success)",
  processing: "var(--color-processing)",
  failed: "var(--color-error)",
  review: "var(--color-warning)",
};

function last7DayLabels() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString(undefined, { weekday: "short" });
  });
}

function last7DayKeys() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function ActivityChart({ data }: { data: DashboardData }) {
  const { labels, counts } = useMemo(() => {
    const keys = last7DayKeys();
    const map = new Map(keys.map((k) => [k, 0]));
    for (const job of data.recentCalculations) {
      const key = job.createdAt.slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    }
    return {
      labels: last7DayLabels(),
      counts: keys.map((k) => map.get(k) ?? 0),
    };
  }, [data.recentCalculations]);

  const max = Math.max(...counts, 1);
  const w = 280;
  const h = 120;
  const padX = 8;
  const padY = 8;
  const barGap = 6;
  const barW = (w - padX * 2 - barGap * (counts.length - 1)) / counts.length;

  const points = counts
    .map((count, i) => {
      const x = padX + i * (barW + barGap) + barW / 2;
      const barH = (count / max) * (h - padY * 2);
      const y = h - padY - barH;
      return { x, y, barH, count };
    });

  return (
    <div className="dashboard-chart-body">
      <svg viewBox={`0 0 ${w} ${h}`} className="dashboard-chart-svg" aria-hidden>
        {points.map((p, i) => (
          <rect
            key={labels[i]}
            x={p.x - barW / 2}
            y={p.y}
            width={barW}
            height={p.count > 0 ? Math.max(p.barH, 4) : 0}
            rx={3}
            className="dashboard-chart-bar"
          />
        ))}
      </svg>
      <div className="dashboard-chart-labels">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="dashboard-chart-caption">
        {counts.reduce((a, b) => a + b, 0)} calculation{counts.reduce((a, b) => a + b, 0) === 1 ? "" : "s"} in the last 7 days
      </p>
    </div>
  );
}

function StatusDonut({ data }: { data: DashboardData }) {
  const segments = useMemo(() => {
    const failed = data.recentCalculations.filter((j) => j.status === "FAILED").length;
    const items = [
      { label: "Completed", value: data.stats.completedAnalyses, color: CHART_COLORS.completed },
      { label: "In progress", value: data.stats.pendingAnalyses, color: CHART_COLORS.processing },
      { label: "Needs review", value: data.stats.needsReview, color: CHART_COLORS.review },
      { label: "Failed", value: failed, color: CHART_COLORS.failed },
    ].filter((s) => s.value > 0);

    const total = items.reduce((sum, s) => sum + s.value, 0) || 1;
    return items.map((s) => ({ ...s, pct: (s.value / total) * 100 }));
  }, [data]);

  const total = data.stats.calculations;
  let offset = 0;
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div className="dashboard-chart-body dashboard-chart-donut-wrap">
      <div className="dashboard-donut">
        <svg viewBox="0 0 120 120" className="dashboard-chart-svg" aria-hidden>
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="12" />
          {segments.length === 0 ? (
            <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="12" strokeDasharray={`${c * 0.25} ${c * 0.75}`} />
          ) : (
            segments.map((seg) => {
              const dash = (seg.pct / 100) * c;
              const gap = c - dash;
              const el = (
                <circle
                  key={seg.label}
                  cx="60"
                  cy="60"
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                />
              );
              offset += dash;
              return el;
            })
          )}
        </svg>
        <div className="dashboard-donut-center">
          <span className="dashboard-donut-value">{total}</span>
          <span className="dashboard-donut-label">Total</span>
        </div>
      </div>
      <ul className="dashboard-chart-legend">
        {segments.length === 0 ? (
          <li className="text-sm text-foreground-muted">No analysis data yet.</li>
        ) : (
          segments.map((seg) => (
            <li key={seg.label}>
              <span className="dashboard-legend-dot" style={{ backgroundColor: seg.color }} />
              <span className="dashboard-legend-label">{seg.label}</span>
              <span className="dashboard-legend-value">{seg.value}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function DashboardCharts({ data }: { data: DashboardData }) {
  return (
    <div className="dashboard-charts">
      <div className="dashboard-chart-card">
        <h3 className="dashboard-chart-title">Activity</h3>
        <p className="dashboard-chart-desc">Calculations over the last 7 days</p>
        <ActivityChart data={data} />
      </div>
      <div className="dashboard-chart-card">
        <h3 className="dashboard-chart-title">Status breakdown</h3>
        <p className="dashboard-chart-desc">Current workspace analysis mix</p>
        <StatusDonut data={data} />
      </div>
    </div>
  );
}
