"use client";

import { useId, useMemo, useState } from "react";
import {
  buildRwandaLandDots,
  isPlaceLive,
  RWANDA_DISTRICT_POINTS,
  RWANDA_OUTLINE,
} from "@/lib/rwanda-coverage";

type Counts = Record<string, number>;

const LAND_DOTS = buildRwandaLandDots(7);

export function RwandaCoverageMap({
  counts = {},
  compact = false,
}: {
  counts?: Counts;
  compact?: boolean;
}) {
  const glowId = useId().replace(/:/g, "");
  const [active, setActive] = useState<string | null>(null);

  const points = useMemo(() => {
    const districts = RWANDA_DISTRICT_POINTS.filter((p) => p.name !== "Kigali").map((p) => {
      const count = counts[p.name] ?? 0;
      return { ...p, count, live: isPlaceLive(count) };
    });

    // Prefer a single Kigali glow when the capital metro is live, instead of three identical markers.
    const kigaliCount = Math.max(
      counts.Kigali ?? 0,
      counts.Gasabo ?? 0,
      counts.Kicukiro ?? 0,
      counts.Nyarugenge ?? 0
    );
    const kigaliMeta = RWANDA_DISTRICT_POINTS.find((p) => p.name === "Kigali")!;
    const withoutKigaliDistricts = districts.filter(
      (p) => !["Gasabo", "Kicukiro", "Nyarugenge"].includes(p.name)
    );

    return [
      ...withoutKigaliDistricts,
      {
        ...kigaliMeta,
        count: kigaliCount,
        live: isPlaceLive(kigaliCount),
      },
    ];
  }, [counts]);

  const livePoints = points.filter((p) => p.live);
  const liveCount = livePoints.length;
  const hovered = points.find((p) => p.name === active);

  const outline = RWANDA_OUTLINE.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div className={`nx-map ${compact ? "is-compact" : ""}`}>
      <div className="nx-map-frame nx-map-frame-dark">
        <svg viewBox="0 0 420 420" className="nx-map-svg" role="img" aria-label="Dotted map of Rwanda with live Nexora districts">
          <defs>
            <radialGradient id={`nx-live-core-${glowId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="45%" stopColor="#ffebe6" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0.95" />
            </radialGradient>
            <filter id={`nx-live-glow-${glowId}`} x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="420" height="420" rx="28" fill="#0b0b0c" />

          <polygon points={outline} fill="none" stroke="#1f1f22" strokeWidth="1.2" opacity="0.9" />

          {LAND_DOTS.map((d, i) => (
            <circle key={`land-${i}`} cx={d.x} cy={d.y} r={compact ? 1.35 : 1.55} className="nx-map-land-dot" />
          ))}

          {points
            .filter((p) => !p.live)
            .map((p) => (
              <a key={p.slug} href={`/cities/${p.slug}`} aria-label={`${p.name}, coming soon`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={compact ? 2.4 : 2.8}
                  className={`nx-map-district-dot ${active === p.name ? "is-active" : ""}`}
                  onMouseEnter={() => setActive(p.name)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.name)}
                  onBlur={() => setActive(null)}
                />
              </a>
            ))}

          {livePoints.map((p) => (
            <a key={`live-${p.slug}`} href={`/cities/${p.slug}`} aria-label={`${p.name}, live on Nexora, ${p.count} restaurants`}>
              <g
                filter={`url(#nx-live-glow-${glowId})`}
                onMouseEnter={() => setActive(p.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.name)}
                onBlur={() => setActive(null)}
              >
                <circle cx={p.x} cy={p.y} r={compact ? 7 : 9} fill="#ff5a3c" opacity="0.28" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={compact ? 3.8 : 4.6}
                  fill={`url(#nx-live-core-${glowId})`}
                  className={`nx-map-live-dot ${active === p.name ? "is-active" : ""}`}
                />
              </g>
              {!compact && (
                <text x={p.x} y={p.y - 14} textAnchor="middle" className="nx-map-label-dark">
                  {p.name}
                </text>
              )}
            </a>
          ))}
        </svg>

        <div className="nx-map-tooltip nx-map-tooltip-dark" aria-live="polite">
          {hovered ? (
            <>
              <strong>{hovered.name}</strong>
              <span>{hovered.region}</span>
              <span>
                {hovered.live ? `${hovered.count} restaurant${hovered.count === 1 ? "" : "s"} live` : "Coming soon"}
              </span>
            </>
          ) : (
            <>
              <strong>Where Nexora is live</strong>
              <span>
                {liveCount} {liveCount === 1 ? "place" : "places"} glowing · updates with the catalog
              </span>
            </>
          )}
        </div>
      </div>

      <div className="nx-map-legend nx-map-legend-dark">
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch is-live-glow" />
          Live (has restaurants)
        </span>
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch is-dim" />
          Coming soon
        </span>
      </div>
    </div>
  );
}
