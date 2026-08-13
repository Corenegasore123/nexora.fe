const STEPS = [
  { label: "Technical drawing", detail: "JPG · PNG · PDF", accent: false },
  { label: "Detected measurements", detail: "OCR + CV extraction", accent: true },
  { label: "Mapped variables", detail: "L, W, H → inputs", accent: false },
  { label: "Deterministic calc", detail: "Verified formulas", accent: true },
  { label: "Audited result", detail: "m³ · with steps", accent: false, result: "142.5 m³" },
];

export function ProductFlowVisual({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const dark = variant === "dark";
  const card = dark
    ? "border-white/10 bg-white/5 text-white"
    : "border-border bg-surface text-foreground";
  const muted = dark ? "text-white/50" : "text-foreground-muted";
  const accentBg = dark ? "bg-primary/15 border-primary/30" : "bg-primary-soft border-primary/20";

  return (
    <div className={`relative w-full ${compact ? "max-w-md" : "max-w-lg"}`}>
      {!compact && (
        <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" aria-hidden />
      )}
      <div className={`relative rounded-2xl border p-5 shadow-elevated ${card}`}>
        <p className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>
          Product pipeline
        </p>
        <div className={`mt-4 space-y-2 ${compact ? "text-sm" : ""}`}>
          {STEPS.map((step, i) => (
            <div key={step.label}>
              <div className={`rounded-xl border px-4 py-3 ${step.accent ? accentBg : card}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className={`text-xs ${muted}`}>{step.detail}</p>
                  </div>
                  {step.result && (
                    <span className="font-mono text-sm font-semibold text-success">{step.result}</span>
                  )}
                  {i === 0 && !step.result && (
                    <div className="h-10 w-14 rounded border border-white/20 bg-[var(--color-image-canvas)]" />
                  )}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg className={`h-4 w-4 ${muted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
