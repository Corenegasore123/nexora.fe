"use client";

import { useMemo, useState } from "react";
import { isNexoraLivePlace, RWANDA_DISTRICT_POINTS } from "@/lib/rwanda-coverage";

type Counts = Record<string, number>;

export function RwandaCoverageMap({
  counts = {},
  compact = false,
}: {
  counts?: Counts;
  compact?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);
  const points = useMemo(
    () =>
      RWANDA_DISTRICT_POINTS.filter((p) => p.name !== "Kigali").map((p) => ({
        ...p,
        live: isNexoraLivePlace(p.name),
        count: counts[p.name] ?? 0,
      })),
    [counts]
  );

  const liveCount = points.filter((p) => p.live).length;
  const hovered = points.find((p) => p.name === active);

  return (
    <div className={`nx-map ${compact ? "is-compact" : ""}`}>
      <div className="nx-map-frame">
        <svg viewBox="0 0 420 420" className="nx-map-svg" role="img" aria-label="Map of Rwanda districts">
          <defs>
            <linearGradient id="nx-map-land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7f7f5" />
              <stop offset="100%" stopColor="#ebebe7" />
            </linearGradient>
            <filter id="nx-map-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#171717" floodOpacity="0.08" />
            </filter>
          </defs>

          <path
            d="M118 46c42-18 96-24 148-10 38 10 72 34 88 68 18 38 22 84 10 126-10 36-34 72-66 98-34 28-74 48-118 52-46 4-92-8-124-38-30-28-48-70-46-112 2-44 22-86 54-114 28-24 44-50 54-70z"
            fill="url(#nx-map-land)"
            stroke="#d4d4cf"
            strokeWidth="2"
            filter="url(#nx-map-soft)"
          />
          <path
            d="M132 78c34-16 78-22 118-12 28 8 54 28 66 54 16 34 18 74 8 108-8 28-28 56-54 76-30 24-66 40-104 42-40 2-78-12-104-38-24-24-38-60-36-96 2-36 18-70 44-92 20-18 36-32 62-42z"
            fill="none"
            stroke="#c4c4be"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.7"
          />

          {points.map((p) => (
            <a key={p.slug} href={`/cities/${p.slug}`} aria-label={`${p.name}${p.live ? ", live on Nexora" : ""}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.live ? (compact ? 9 : 11) : compact ? 5.5 : 6.5}
                className={`nx-map-dot ${p.live ? "is-live" : ""} ${active === p.name ? "is-active" : ""}`}
                onMouseEnter={() => setActive(p.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.name)}
                onBlur={() => setActive(null)}
              />
              {p.live && !compact && (
                <text x={p.x} y={p.y - 16} textAnchor="middle" className="nx-map-label">
                  {p.name}
                </text>
              )}
            </a>
          ))}
        </svg>

        <div className="nx-map-tooltip" aria-live="polite">
          {hovered ? (
            <>
              <strong>{hovered.name}</strong>
              <span>{hovered.region}</span>
              <span>{hovered.live ? (hovered.count ? `${hovered.count} restaurants` : "Live on Nexora") : "Coming soon"}</span>
            </>
          ) : (
            <>
              <strong>Rwanda coverage</strong>
              <span>{liveCount} districts live · hover a point</span>
            </>
          )}
        </div>
      </div>

      <div className="nx-map-legend">
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch is-live" />
          Live on Nexora
        </span>
        <span className="nx-map-legend-item">
          <i className="nx-map-swatch" />
          Coming soon
        </span>
      </div>
    </div>
  );
}
