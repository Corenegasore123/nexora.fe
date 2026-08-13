import { ReactNode } from "react";

/** Matches header/footer horizontal bounds: px-4 + max-w-6xl */
export function MarketingContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`marketing-wrap ${className}`}>
      <div className="marketing-inner">{children}</div>
    </div>
  );
}
