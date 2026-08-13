import Link from "next/link";
import { ProductFlowVisual } from "./ProductFlowVisual";

const WORKFLOW = [
  { step: "01", title: "Upload", desc: "Drop JPG, PNG, WEBP, or PDF drawings with dimension labels." },
  { step: "02", title: "Analyze", desc: "OCR and computer vision extract measurements and map variables." },
  { step: "03", title: "Calculate", desc: "Deterministic rules engine computes quantities with full audit trail." },
  { step: "04", title: "Verify", desc: "Review confidence scores, correct values, and validate results." },
  { step: "05", title: "Export", desc: "Generate professional PDF, CSV, or JSON reports." },
];

const USE_CASES = [
  "Engineering", "Construction", "Architecture", "Education", "Research", "Quantity estimation",
];

export function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">Intelligent Quantity Platform</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              From Diagram
              <br />
              to Quantity.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground-secondary">
              QuantScope transforms technical diagrams and measurement documents into structured
              measurements and verified calculations using OCR, computer vision, and deterministic
              calculation logic — never LLM-invented numbers.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/sign-up" className="btn-primary">Get Started</Link>
              <Link href="/how-it-works" className="btn-secondary">See How It Works</Link>
            </div>
          </div>
          <ProductFlowVisual />
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow text-center">Product Workflow</p>
          <h2 className="page-title mt-3 text-center">Five steps to verified quantities</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW.map((w) => (
              <div key={w.step} className="card-raised">
                <p className="font-mono text-xs text-primary">{w.step}</p>
                <h3 className="mt-2 font-semibold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-foreground-secondary">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Product Preview</p>
              <h2 className="page-title mt-3">A workspace built for engineers</h2>
              <p className="page-subtitle mt-4">
                Projects, calculations, measurement review, and report export — in one professional
                application with full auditability.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-elevated">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex gap-2 border-b border-border pb-3">
                  <SkeletonBar w="w-20" /><SkeletonBar w="w-16" /><SkeletonBar w="w-24" />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {["12", "4", "87", "31"].map((v, i) => (
                    <div key={i} className="rounded-lg border border-border bg-surface p-3">
                      <p className="text-[10px] uppercase text-foreground-muted">{["Projects", "Active", "Calcs", "Reports"][i]}</p>
                      <p className="mt-1 text-xl font-bold text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between rounded-lg border border-border px-3 py-2 text-xs">
                      <span className="text-foreground-secondary">Project {String.fromCharCode(64 + i)}</span>
                      <span className="text-foreground-muted">Today</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Measurement + AI + Deterministic */}
      <section className="border-y border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <FeatureBlock
              title="Measurement Extraction"
              body="Computer vision detects dimension labels and bounding regions on technical drawings. Every value carries a confidence score for human review."
            />
            <FeatureBlock
              title="AI + Computer Vision"
              body="OCR and CV handle image understanding — reading text, locating measurements, and mapping them to calculation variables. AI never performs final arithmetic."
            />
            <FeatureBlock
              title="Deterministic Calculations"
              body="All numerical results come from a verified rules engine with auditable formula steps. No LLM generates or modifies quantities."
            />
          </div>
        </div>
      </section>

      {/* Auditability + Projects + Reporting */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureBlock
              title="Full Auditability"
              body="Every calculation links back to source measurements, formula inputs, intermediate steps, and methodology version."
            />
            <FeatureBlock
              title="Project Management"
              body="Organize documents and analyses into workspaces. Share projects with editors and viewers with role-based access."
            />
            <FeatureBlock
              title="Professional Reporting"
              body="Export full, summary, audit, or client report templates in PDF, CSV, or JSON — ready for stakeholders and compliance."
            />
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-border bg-primary-soft/30 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="eyebrow">Use Cases</p>
          <h2 className="page-title mt-3">Built for technical professionals</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {USE_CASES.map((u) => (
              <span key={u} className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-foreground-secondary">
                {u}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Security</p>
          <h2 className="page-title mt-3">Enterprise-grade data isolation</h2>
          <p className="mt-4 text-foreground-secondary">
            Session-based authentication, role-based authorization, and strict user-scoped data
            isolation. Your projects, documents, and calculations are accessible only to you and
            explicitly invited collaborators.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Turn your technical diagrams into verified quantities.
          </h2>
          <Link href="/sign-up" className="btn-primary mt-8 inline-flex">
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{body}</p>
    </div>
  );
}

function SkeletonBar({ w }: { w: string }) {
  return <div className={`h-2 rounded bg-border ${w}`} />;
}
