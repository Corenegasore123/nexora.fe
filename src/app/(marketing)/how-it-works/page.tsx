import Link from "next/link";
import { ProductFlowVisual } from "@/components/marketing/ProductFlowVisual";

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-start gap-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">How It Works</p>
          <h1 className="page-title mt-3">From upload to verified quantity</h1>
          <ol className="mt-8 space-y-6">
            {[
              ["Upload", "Add JPG, PNG, WEBP, or PDF technical drawings to a project."],
              ["Analyze", "OCR and CV detect dimension labels, values, and bounding regions."],
              ["Calculate", "Variables map to deterministic formulas from your methodology rules."],
              ["Verify", "Review confidence scores, correct measurements, and validate steps."],
              ["Export", "Generate stakeholder-ready reports with full audit trails."],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-foreground-secondary">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/sign-up" className="btn-primary mt-10 inline-flex">
            Start Free
          </Link>
        </div>
        <ProductFlowVisual />
      </div>
    </div>
  );
}
