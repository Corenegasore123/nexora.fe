import { Icon } from "@/components/icons/Icon";

export function RatingStars({
  value,
  count,
  size = 14,
  showValue = true,
  compact = false,
}: {
  value: number;
  count?: number;
  size?: number;
  showValue?: boolean;
  compact?: boolean;
}) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="nx-rating inline-flex items-center gap-1">
      {compact ? (
        <Icon name="star" size={size} filled className="nx-star-fill" />
      ) : (
        <span className="inline-flex items-center" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <Icon
              key={i}
              name="star"
              size={size}
              filled={i < filled}
              className={i < filled ? "nx-star-fill" : "nx-star-empty"}
            />
          ))}
        </span>
      )}
      {showValue && <span className="tabular-nums font-semibold">{value.toFixed(1)}</span>}
      {typeof count === "number" && <span className="font-normal text-foreground-muted">({count})</span>}
    </span>
  );
}
