const STEPS = [
  { label: "Technical drawing", detail: "JPG · PNG · PDF", color: "bg-surface border-border" },
  { label: "Detected measurements", detail: "OCR + CV extraction", color: "bg-primary-soft border-primary/20" },
  { label: "Mapped variables", detail: "L, W, H → inputs", color: "bg-surface border-border" },
  { label: "Deterministic calc", detail: "Verified formulas", color: "bg-primary-soft border-primary/20" },
  { label: "Audited result", detail: "m³ · with steps", color: "bg-success-bg border-success-border" },
];

export function ProductFlowVisual() {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" aria-hidden />
      <div className="relative rounded-2xl border border-border bg-surface p-5 shadow-elevated">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">
          Product pipeline
        </p>
        <div className="mt-4 space-y-2">
          {STEPS.map((step, i) => (
            <div key={step.label}>
              <div className={`rounded-xl border px-4 py-3 ${step.color}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                    <p className="text-xs text-foreground-muted">{step.detail}</p>
                  </div>
                  {i === 0 && (
                    <div className="h-10 w-14 rounded border border-border-strong bg-[var(--color-image-canvas)]" />
                  )}
                  {i === 1 && (
                    <div className="flex gap-1">
                      <span className="h-2 w-8 rounded bg-primary/30" />
                      <span className="h-2 w-6 rounded bg-primary/50" />
                    </div>
                  )}
                  {i === 4 && (
                    <span className="font-mono text-sm font-semibold text-success">142.5 m³</span>
                  )}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg className="h-4 w-4 text-foreground-placeholder" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
