/** Inline SVG mimicking an engineering cross-section drawing with dimension lines. */
export function TechnicalDrawingVisual({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const w = compact ? 200 : 280;
  const h = compact ? 150 : 210;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`w-full ${className}`}
      aria-hidden
      role="img"
    >
      {/* Drawing sheet background */}
      <rect width={w} height={h} fill="#fafbfc" rx="4" />
      {/* Grid */}
      {Array.from({ length: Math.ceil(w / 20) }).map((_, i) => (
        <line
          key={`vg-${i}`}
          x1={i * 20}
          y1={0}
          x2={i * 20}
          y2={h}
          stroke="#e8ecf0"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: Math.ceil(h / 20) }).map((_, i) => (
        <line
          key={`hg-${i}`}
          x1={0}
          y1={i * 20}
          x2={w}
          y2={i * 20}
          stroke="#e8ecf0"
          strokeWidth="0.5"
        />
      ))}

      {/* Border frame */}
      <rect
        x={8}
        y={8}
        width={w - 16}
        height={h - 16}
        fill="none"
        stroke="#354554"
        strokeWidth="1.2"
      />

      {/* Title block */}
      <rect x={w - 72} y={h - 36} width={64} height={28} fill="#f0f3f6" stroke="#354554" strokeWidth="0.8" />
      <text x={w - 68} y={h - 24} fill="#354554" fontSize="5" fontFamily="monospace" fontWeight="600">
        DWG-042
      </text>
      <text x={w - 68} y={h - 16} fill="#6b7a85" fontSize="4" fontFamily="monospace">
        EARTHWORK SEC.
      </text>
      <text x={w - 68} y={h - 9} fill="#6b7a85" fontSize="4" fontFamily="monospace">
        SCALE 1:100
      </text>

      {/* Ground line */}
      <line x1={24} y1={h * 0.55} x2={w - 24} y2={h * 0.55} stroke="#354554" strokeWidth="1" />
      <text x={26} y={h * 0.55 - 4} fill="#4f4f4f" fontSize="4.5" fontFamily="monospace">
        NGL ±0.00
      </text>

      {/* Cut cross-section (trapezoid) */}
      <polygon
        points={`${w * 0.28},${h * 0.55} ${w * 0.72},${h * 0.55} ${w * 0.65},${h * 0.78} ${w * 0.35},${h * 0.78}`}
        fill="#e8f4fd"
        stroke="#5baeea"
        strokeWidth="1.2"
        strokeDasharray="none"
      />
      {/* Hatching */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`hatch-${i}`}
          x1={w * 0.32 + i * 8}
          y1={h * 0.78}
          x2={w * 0.38 + i * 8}
          y2={h * 0.55}
          stroke="#5baeea"
          strokeWidth="0.4"
          opacity="0.35"
        />
      ))}

      {/* Dimension: width (top) */}
      <line x1={w * 0.28} y1={h * 0.42} x2={w * 0.72} y2={h * 0.42} stroke="#f9b33f" strokeWidth="0.8" />
      <line x1={w * 0.28} y1={h * 0.40} x2={w * 0.28} y2={h * 0.44} stroke="#f9b33f" strokeWidth="0.8" />
      <line x1={w * 0.72} y1={h * 0.40} x2={w * 0.72} y2={h * 0.44} stroke="#f9b33f" strokeWidth="0.8" />
      <rect x={w * 0.44} y={h * 0.38} width={36} height={10} fill="#fef6e8" rx="2" />
      <text x={w * 0.5} y={h * 0.445} fill="#354554" fontSize="5.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">
        L = 12.5 m
      </text>

      {/* Dimension: depth (right) */}
      <line x1={w * 0.76} y1={h * 0.55} x2={w * 0.76} y2={h * 0.78} stroke="#f9b33f" strokeWidth="0.8" />
      <line x1={w * 0.74} y1={h * 0.55} x2={w * 0.78} y2={h * 0.55} stroke="#f9b33f" strokeWidth="0.8" />
      <line x1={w * 0.74} y1={h * 0.78} x2={w * 0.78} y2={h * 0.78} stroke="#f9b33f" strokeWidth="0.8" />
      <rect x={w * 0.79} y={h * 0.63} width={28} height={10} fill="#fef6e8" rx="2" />
      <text x={w * 0.805} y={h * 0.695} fill="#354554" fontSize="5" fontFamily="monospace" fontWeight="600">
        H=2.4m
      </text>

      {/* Detected measurement highlight box */}
      <rect
        x={w * 0.38}
        y={h * 0.62}
        width={44}
        height={14}
        fill="none"
        stroke="#5baeea"
        strokeWidth="1"
        strokeDasharray="3 2"
        rx="2"
      />
      <text x={w * 0.5} y={h * 0.72} fill="#5baeea" fontSize="4.5" fontFamily="monospace" textAnchor="middle">
        OCR detected
      </text>

      {/* North arrow */}
      <g transform={`translate(${24}, ${h * 0.18})`}>
        <line x1={0} y1={8} x2={0} y2={0} stroke="#354554" strokeWidth="0.8" />
        <polygon points="0,0 -3,6 3,6" fill="#354554" />
        <text x={0} y={14} fill="#4f4f4f" fontSize="4" fontFamily="monospace" textAnchor="middle">
          N
        </text>
      </g>
    </svg>
  );
}
