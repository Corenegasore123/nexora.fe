import { formatDuration, type SlaState } from "@/lib/api";

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "bg-pending-bg text-pending border-pending-border",
  SUBMITTED: "bg-info-bg text-info border-info-border",
  UNDER_REVIEW: "bg-processing-bg text-processing border-processing-border",
  PENDING_APPROVAL: "bg-accent-soft text-[var(--color-on-accent)] border-warning-border",
  APPROVED: "bg-success-bg text-success border-success-border",
  REJECTED: "bg-error-bg text-error border-error-border",
  COMPLETED: "bg-success-bg text-success border-success-border",
  CANCELLED: "bg-pending-bg text-pending border-pending-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_CLASS[status] ?? STATUS_CLASS.DRAFT}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function SlaBadge({ sla }: { sla: SlaState }) {
  if (sla.breached) {
    return <span className="inline-flex items-center rounded-full border border-error-border bg-error-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-error">SLA breached</span>;
  }
  if (sla.warning) {
    return (
      <span className="inline-flex rounded-full border border-warning-border bg-warning-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning">
        {formatDuration(sla.remainingMs)} left
      </span>
    );
  }
  if (sla.remainingMs === null) return <span className="text-xs text-foreground-muted">No SLA</span>;
  return <span className="text-xs text-foreground-secondary">{formatDuration(sla.remainingMs)} remaining</span>;
}
