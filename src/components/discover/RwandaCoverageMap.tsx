"use client";

import { useMemo, useState } from "react";
import { buildDistrictCoverage } from "@/lib/rwanda-coverage";

type Counts = Record<string, number>;

export function RwandaCoverageMap({
  counts = {},
  compact = false,
}: {
  counts?: Counts;
  compact?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);

  const districts = useMemo(() => buildDistrictCoverage(counts), [counts]);
  const liveCount = districts.filter((d) => d.live).length;
  const hovered = districts.find((d) => d.slug === active);

  return (
    <div className={`nx-map ${compact ? "is-compact" : ""}`}>
      <div className="nx-map-frame">
        <svg
          viewBox="0 0 1000 873"
          className="nx-map-svg"
          role="img"
          aria-label="Map of Rwanda districts with live Nexora coverage"
        >
          <image
            href="/rwanda-districts-reference.png"
            x="0"
            y="0"
            width="1000"
            height="873"
            preserveAspectRatio="none"
          />

          <g className="nx-map-district-markers">
            {districts.map((district) => (
              <a
                key={district.slug}
                href={`/cities/${district.slug}`}
                aria-label={
                  district.live
                    ? `${district.name}, live on Nexora, ${district.count} restaurants`
                    : `${district.name}, coming soon`
                }
              >
                <circle
                  cx={district.x}
                  cy={district.y}
                  r={compact ? 10 : 13}
                  className={`nx-map-district-marker ${district.live ? "is-live" : ""} ${
                    active === district.slug ? "is-active" : ""
                  }`}
                  onMouseEnter={() => setActive(district.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(district.slug)}
                  onBlur={() => setActive(null)}
                />
              </a>
            ))}
          </g>
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
                {liveCount} live districts shown on the Rwanda district map
              </span>
            </>
          )}
        </div>
      </div>

      <div className="nx-map-legend">
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch is-live" />
          Live district
        </span>
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch is-soon" />
          Coming soon
        </span>
      </div>
    </div>
  );
}
