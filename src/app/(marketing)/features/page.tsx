import Link from "next/link";

const FEATURES = [
  { title: "Measurement extraction", desc: "OCR + computer vision on technical drawings with confidence scoring." },
  { title: "Deterministic engine", desc: "Verified formulas — no LLM-generated arithmetic." },
  { title: "Project workspaces", desc: "Organize documents, team access, and calculation history." },
  { title: "Scenario comparison", desc: "Compare baselines, versions, and what-if scenarios." },
  { title: "Audit trail", desc: "Full chain from source measurement to final result." },
  { title: "Report export", desc: "PDF, CSV, JSON with multiple template types." },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="eyebrow text-center">Features</p>
      <h1 className="page-title mt-3 text-center">Everything you need for quantity workflows</h1>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card-raised">
            <h2 className="font-semibold text-foreground">{f.title}</h2>
            <p className="mt-2 text-sm text-foreground-secondary">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link href="/sign-up" className="btn-primary">Get Started</Link>
      </div>
    </div>
  );
}
