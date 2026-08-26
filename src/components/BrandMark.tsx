import { UtensilsCrossed } from "lucide-react";

/** Nexora brand mark — crossed fork & knife (plate service). */
export function BrandMark({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <UtensilsCrossed
      size={size}
      strokeWidth={2.1}
      className={className}
      aria-hidden
    />
  );
}
