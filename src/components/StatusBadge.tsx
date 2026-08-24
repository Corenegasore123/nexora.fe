const STATUS_CLASS: Record<string, string> = {
  AVAILABLE: "bg-success-bg text-success border-success-border",
  OCCUPIED: "bg-error-bg text-error border-error-border",
  RESERVED: "bg-warning-bg text-warning border-warning-border",
  CLEANING: "bg-info-bg text-info border-info-border",
  PENDING: "bg-pending-bg text-pending border-pending-border",
  CONFIRMED: "bg-success-bg text-success border-success-border",
  SEATED: "bg-info-bg text-info border-info-border",
  COMPLETED: "bg-success-bg text-success border-success-border",
  CANCELLED: "bg-pending-bg text-pending border-pending-border",
  NO_SHOW: "bg-error-bg text-error border-error-border",
  OPEN: "bg-pending-bg text-pending border-pending-border",
  SENT: "bg-info-bg text-info border-info-border",
  PREPARING: "bg-warning-bg text-warning border-warning-border",
  READY: "bg-info-bg text-info border-info-border",
  SERVED: "bg-success-bg text-success border-success-border",
  PAID: "bg-success-bg text-success border-success-border",
  ACTIVE: "bg-success-bg text-success border-success-border",
  SUSPENDED: "bg-error-bg text-error border-error-border",
  ARRIVED: "bg-info-bg text-info border-info-border",
  NEW: "bg-accent-soft text-accent border-warning-border",
  CRITICAL: "bg-error-bg text-error border-error-border",
  LOW: "bg-warning-bg text-warning border-warning-border",
  HEALTHY: "bg-success-bg text-success border-success-border",
  STAR: "bg-accent-soft text-accent border-warning-border",
  PLOW_HORSE: "bg-info-bg text-info border-info-border",
  PUZZLE: "bg-processing-bg text-processing border-processing-border",
  DOG: "bg-pending-bg text-pending border-pending-border",
  GOLD: "bg-accent-soft text-accent border-warning-border",
  SILVER: "bg-pending-bg text-pending border-pending-border",
  BRONZE: "bg-warning-bg text-warning border-warning-border",
  PENDING_APPROVAL: "bg-warning-bg text-warning border-warning-border",
  LATE: "bg-warning-bg text-warning border-warning-border",
  ABSENT: "bg-error-bg text-error border-error-border",
  PRESENT: "bg-success-bg text-success border-success-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_CLASS[status] ?? "bg-pending-bg text-pending border-pending-border"}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
