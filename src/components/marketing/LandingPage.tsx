import Link from "next/link";
import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";
import { ProductFlowVisual } from "./ProductFlowVisual";

const STATS = [
  { label: "Workflow steps", value: "5", icon: "layers" as IconName },
  { label: "Report formats", value: "3+", icon: "file-text" as IconName },
  { label: "Audit coverage", value: "100%", icon: "clipboard-check" as IconName },
  { label: "Team roles", value: "3", icon: "users" as IconName },
];

const WORKFLOW = [
  { step: "01", title: "Upload", desc: "Drop JPG, PNG, WEBP, or PDF drawings.", icon: "upload" as IconName },
  { step: "02", title: "Analyze", desc: "OCR and CV extract measurements.", icon: "scan" as IconName },
  { step: "03", title: "Calculate", desc: "Deterministic rules engine runs formulas.", icon: "calculator" as IconName },
  { step: "04", title: "Verify", desc: "Review confidence and correct values.", icon: "clipboard-check" as IconName },
  { step: "05", title: "Export", desc: "PDF, CSV, or JSON reports.", icon: "file-text" as IconName },
];

const WHY = [
  { icon: "target" as IconName, title: "Precision-first platform", desc: "Built for engineers who need traceable quantities, not black-box AI answers." },
  { icon: "users" as IconName, title: "Team-ready workspaces", desc: "Projects, roles, and shared analyses with editor and viewer permissions." },
  { icon: "shield" as IconName, title: "Secure by design", desc: "Session auth, scoped data isolation, and role-based access on every endpoint." },
  { icon: "git-branch" as IconName, title: "Scenario comparison", desc: "Compare baselines, versions, and what-if scenarios with delta reporting." },
];

const PLATFORM_FEATURES = [
  "Professional OCR and computer vision pipeline",
  "Deterministic calculation engine — no LLM arithmetic",
  "Confidence scoring on every extracted measurement",
  "Human correction with full revision history",
  "Auditable formula steps and methodology versioning",
  "Export-ready reports for stakeholders",
];

const USE_CASES: { label: string; icon: IconName }[] = [
  { label: "Engineering", icon: "building" },
  { label: "Construction", icon: "hard-hat" },
  { label: "Research", icon: "microscope" },
  { label: "Quantity estimation", icon: "scale" },
  { label: "Architecture", icon: "layers" },
  { label: "Education", icon: "book-open" },
];

export function LandingPage() {
  return (
    <>
      {/* Cinematic hero */}
      <section className="marketing-hero marketing-hero-grid relative min-h-[92vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#0a1628] to-ink-deep" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:min-h-[92vh] md:pb-20 md:pt-36">
          <div className="grid items-end gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm">
                <Icon name="sparkles" size={14} className="text-primary" />
                Intelligent Quantity Platform
              </span>
              <h1 className="mt-6 text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                From Diagram
                <br />
                to Quantity.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                QuantScope transforms technical diagrams into structured measurements and verified
                calculations using OCR, computer vision, and deterministic logic — never
                LLM-invented numbers.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/sign-up" className="btn-marketing-primary">
                  Get Started
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link href="/how-it-works" className="btn-marketing-outline">
                  See How It Works
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <ProductFlowVisual variant="dark" />
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass-stat">
                <div className="flex items-center gap-2 text-white/50">
                  <Icon name={s.icon} size={16} className="text-primary" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">{s.label}</span>
                </div>
                <p className="mt-2 text-3xl font-bold tabular-nums text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow text-center">Product Workflow</p>
          <h2 className="page-title mt-3 text-center">Five steps to verified quantities</h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW.map((w) => (
              <div key={w.step} className="card-raised group">
                <IconCircle name={w.icon} size={18} className="h-11 w-11" />
                <p className="mt-4 font-mono text-xs text-primary">{w.step}</p>
                <h3 className="mt-1 font-semibold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-foreground-secondary">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform spotlight — split dark section */}
      <section className="bg-ink py-24 text-[#f8fafc]">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Analysis Workspace</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Measurement extraction.
              <br />
              Verified calculation.
            </h2>
            <p className="mt-4 text-white/65">
              Upload technical drawings, review detected measurements with confidence scores, and
              run deterministic earthwork and quantity formulas with a complete audit trail.
            </p>
            <ul className="mt-8 space-y-4">
              {PLATFORM_FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Icon name="check" size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="btn-marketing-primary mt-10">
              Open Workspace
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-modal">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#1e293b] via-ink to-[#0a1628] p-6">
                <ProductFlowVisual variant="dark" compact />
              </div>
              <div className="border-t border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Sample output</p>
                <p className="mt-1 text-lg font-bold text-white">Cut volume: 142.5 m³</p>
                <p className="text-sm text-white/60">Chapter 3 earthwork · Full audit trail attached</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">The QuantScope difference</p>
            <h2 className="page-title mt-3">Why choose us.</h2>
            <p className="mt-4 text-foreground-secondary">
              We don&apos;t just extract text from images. We deliver a complete engineering workflow
              designed around accuracy, auditability, and team collaboration.
            </p>
            <ul className="mt-10 space-y-6">
              {WHY.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <IconCircle name={item.icon} size={18} />
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-foreground-secondary">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-surface p-8 shadow-elevated">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Projects", value: "12", icon: "folder" as IconName },
                { label: "Calculations", value: "87", icon: "calculator" as IconName },
                { label: "Reports", value: "31", icon: "file-text" as IconName },
                { label: "Accuracy", value: "99%", icon: "target" as IconName },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-border bg-surface p-4">
                  <Icon name={m.icon} size={18} className="text-primary" />
                  <p className="mt-3 text-2xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-foreground-muted">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-foreground-muted">
              Illustrative dashboard metrics from a typical workspace
            </p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="eyebrow">Use Cases</p>
          <h2 className="page-title mt-3">Built for technical professionals</h2>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {USE_CASES.map((u) => (
              <span
                key={u.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground-secondary"
              >
                <Icon name={u.icon} size={16} className="text-primary" />
                {u.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <IconCircle name="shield" size={22} className="mx-auto h-14 w-14" />
          <h2 className="page-title mt-6">Enterprise-grade data isolation</h2>
          <p className="mt-4 text-foreground-secondary">
            Session-based authentication, role-based authorization, and strict user-scoped data
            isolation across projects, documents, and calculations.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-soft/40 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Turn your technical diagrams into verified quantities.
          </h2>
          <Link href="/sign-up" className="btn-primary mt-8 inline-flex gap-2">
            Get Started Free
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
