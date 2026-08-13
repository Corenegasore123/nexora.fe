"use client";

import { useEffect, useRef, useState } from "react";

interface Measurement {
  id: string;
  value: number;
  unit: string;
  rawText: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  label: string | null;
}

interface Variable {
  name: string;
  measurementId?: string | null;
}

interface Props {
  imageUrl: string;
  measurements: Measurement[];
  variables: Variable[];
}

export function ImageAnnotation({ imageUrl, measurements, variables }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dims, setDims] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const update = () => setDims({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
    if (img.complete) update();
    img.addEventListener("load", update);
    return () => img.removeEventListener("load", update);
  }, [imageUrl]);

  const variableByMeasurement = new Map<string, string>();
  for (const v of variables) {
    if (v.measurementId) variableByMeasurement.set(v.measurementId, v.name);
  }

  return (
    <div className="relative inline-block w-full">
      <img ref={imgRef} src={imageUrl} alt="Uploaded diagram" className="w-full rounded-lg" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {measurements.map((m) => {
          const bb = m.boundingBox;
          if (!bb.width) return null;
          const varName = variableByMeasurement.get(m.id);
          return (
            <g key={m.id}>
              <rect
                x={bb.x}
                y={bb.y}
                width={bb.width}
                height={bb.height}
                fill="rgba(255, 255, 255, 0.06)"
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text
                x={bb.x}
                y={Math.max(bb.y - 4, 12)}
                fill="#ffffff"
                fontSize={12}
                fontWeight="600"
                fontFamily="var(--font-montserrat), sans-serif"
              >
                {varName ? `${varName.toUpperCase()} ` : ""}
                {m.rawText} ({(m.confidence * 100).toFixed(0)}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
