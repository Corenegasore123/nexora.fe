import Link from "next/link";

const STEPS = [
  {
    title: "Upload",
    desc: "Drop a JPG, PNG, WEBP, or PDF drawing with dimension labels.",
  },
  {
    title: "Analyze",
    desc: "OCR and computer vision extract measurements and map variables automatically.",
  },
  {
    title: "Verify",
    desc: "Review auditable calculation steps, confidence scores, and export reports.",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Intelligent Quantity Platform</p>
        <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl md:leading-[1.08]">
          From Diagram
          <br />
          to Quantity.
        </h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-neutral-400">
          Upload a building diagram. QuantScope extracts measurements via OCR and computer
          vision, maps them to variables, and performs deterministic quantity calculations
          with a full auditable breakdown.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/calculator" className="btn-primary">
            Upload &amp; Calculate
          </Link>
          <Link href="/rules" className="btn-secondary">
            View Rules
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {STEPS.map((item, i) => (
          <div key={item.title} className="card-raised">
            <p className="eyebrow">Step {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-neutral-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 card">
        <p className="eyebrow">Built for accuracy</p>
        <ul className="mt-6 space-y-4">
          {[
            "AI handles image understanding — never final arithmetic",
            "Deterministic formula engine with verified calculation rules",
            "Full audit trail from measurement to final result",
            "Confidence scoring on every extracted value",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm font-light text-neutral-300">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong text-xs text-white">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
