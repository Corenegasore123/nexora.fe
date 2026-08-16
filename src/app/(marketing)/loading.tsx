import { MarketingContainer } from "@/components/marketing/MarketingContainer";

export default function MarketingLoading() {
  return (
    <div className="marketing-page-loading min-h-[70vh] animate-pulse">
      <div className="marketing-page-hero">
        <MarketingContainer className="mx-auto max-w-3xl space-y-4">
          <div className="mx-auto h-3 w-24 rounded-full bg-pending-bg" />
          <div className="mx-auto h-10 w-4/5 max-w-lg rounded-xl bg-pending-bg" />
          <div className="mx-auto h-4 w-full max-w-md rounded bg-pending-bg" />
          <div className="mx-auto h-4 w-3/4 max-w-sm rounded bg-pending-bg" />
        </MarketingContainer>
      </div>
      <MarketingContainer className="py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl border border-border bg-surface" />
          ))}
        </div>
      </MarketingContainer>
    </div>
  );
}
