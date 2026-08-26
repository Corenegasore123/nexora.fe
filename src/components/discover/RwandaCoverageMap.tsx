"use client";

import { useMemo, useState } from "react";
import { buildProvinceCoverage, RWANDA_MAP } from "@/lib/rwanda-coverage";

type Counts = Record<string, number>;

export function RwandaCoverageMap({
  counts = {},
  compact = false,
}: {
  counts?: Counts;
  compact?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);

  const provinces = useMemo(() => buildProvinceCoverage(counts), [counts]);
  const liveCount = provinces.filter((p) => p.live).length;
  const hovered = provinces.find((p) => p.id === active);

  return (
    <div className={`nx-map ${compact ? "is-compact" : ""}`}>
      <div className="nx-map-frame">
        <svg
          viewBox={RWANDA_MAP.viewBox}
          className="nx-map-svg"
          role="img"
          aria-label="Map of Rwanda provinces with live Nexora coverage"
        >
          <g className="nx-map-provinces">
            {provinces.map((p) => (
              <a
                key={p.id}
                href={`/cities/${p.primarySlug}`}
                aria-label={
                  p.live
                    ? `${p.name}, live on Nexora, ${p.count} restaurants`
                    : `${p.name}, coming soon`
                }
              >
                <path
                  d={p.d}
                  className={`nx-map-province ${p.live ? "is-live" : ""} ${active === p.id ? "is-active" : ""}`}
                  onMouseEnter={() => setActive(p.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.id)}
                  onBlur={() => setActive(null)}
                />
              </a>
            ))}
          </g>

          {!compact &&
            provinces.map((p) => (
              <text
                key={`label-${p.id}`}
                x={p.cx}
                y={p.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`nx-map-province-label ${p.live ? "is-live" : ""}`}
                pointerEvents="none"
              >
                {p.name === "Kigali City" ? "Kigali" : p.name}
              </text>
            ))}
        </svg>

        <div className="nx-map-tooltip" aria-live="polite">
          {hovered ? (
            <>
              <strong>{hovered.name}</strong>
              <span>{hovered.region}</span>
              <span>
                {hovered.live
                  ? `${hovered.count} restaurant${hovered.count === 1 ? "" : "s"} live`
                  : "Coming soon"}
              </span>
            </>
          ) : (
            <>
              <strong>Where Nexora is live</strong>
              <span>
                {liveCount} of {provinces.length} provinces · updates with the catalog
              </span>
            </>
          )}
        </div>
      </div>

      <div className="nx-map-legend">
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch is-live" />
          Live province
        </span>
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch is-soon" />
          Coming soon
        </span>
      </div>
    </div>
  );
}
