import dynamic from "next/dynamic";

function FaqSkeleton() {
  return <div className="h-48 animate-pulse rounded-2xl bg-pending-bg/50" aria-hidden />;
}

export const FaqAccordionLazy = dynamic(
  () => import("./FaqAccordion").then((m) => m.FaqAccordion),
  { loading: () => <FaqSkeleton /> }
);
