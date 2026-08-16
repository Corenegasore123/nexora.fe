"use client";

import { useEffect, useRef, useState } from "react";
import { classifyConfidence } from "@/lib/confidence";

interface Measurement {
  id: string;
  value: number;
  unit: string;
  rawText: string;
  confidence: number;
  userCorrected?: boolean;
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
  selectedId?: string | null;
}

function confidenceStroke(cls: ReturnType<typeof classifyConfidence>): string {
  if (cls === "accepted") return "var(--color-confidence-high)";
  if (cls === "flagged") return "var(--color-confidence-medium)";
  return "var(--color-confidence-low)";
}

export function ImageAnnotation({ imageUrl, measurements, variables, selectedId }: Props) {
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
    <div className="image-canvas-frame relative inline-block w-full p-3">
      <img ref={imgRef} src={imageUrl} alt="Uploaded diagram" className="w-full rounded-lg" />
      <svg
        className="pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {measurements.map((m) => {
          const bb = m.boundingBox;
          if (!bb.width) return null;
          const varName = variableByMeasurement.get(m.id);
          const isSelected = selectedId === m.id;
          const isCorrected = m.userCorrected;

          let stroke = isCorrected
            ? "var(--color-user-correction)"
            : isSelected
              ? "var(--color-measurement-selected)"
              : confidenceStroke(classifyConfidence(m.confidence));

          if (!isCorrected && !isSelected) {
            stroke = "var(--color-measurement-detected)";
          }

          const fill = isSelected
            ? "var(--color-measurement-selected-fill)"
            : isCorrected
              ? "rgba(219, 39, 119, 0.12)"
              : "var(--color-measurement-detected-fill)";

          const strokeWidth = isSelected ? 2.5 : 2;

          return (
            <g key={m.id}>
              <rect
                x={bb.x}
                y={bb.y}
                width={bb.width}
                height={bb.height}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <text
                x={bb.x}
                y={Math.max(bb.y - 4, 12)}
                fill={isCorrected ? "var(--color-user-correction)" : stroke}
                fontSize={12}
                fontWeight="600"
                fontFamily="var(--font-montserrat), sans-serif"
              >
                {varName ? `${varName.toUpperCase()} ` : ""}
                {m.rawText} ({(m.confidence * 100).toFixed(0)}%)
                {isCorrected ? " ✎" : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
