import dynamic from "next/dynamic";

function ProductFlowSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-border bg-pending-bg/60 ${compact ? "h-48" : "h-72 md:h-80"}`}
      aria-hidden
    />
  );
}

export const ProductFlowVisualLazy = dynamic(
  () => import("./ProductFlowVisual").then((m) => m.ProductFlowVisual),
  {
    loading: () => <ProductFlowSkeleton />,
  }
);

export const ProductFlowVisualCompactLazy = dynamic(
  () => import("./ProductFlowVisual").then((m) => m.ProductFlowVisual),
  {
    loading: () => <ProductFlowSkeleton compact />,
  }
);
