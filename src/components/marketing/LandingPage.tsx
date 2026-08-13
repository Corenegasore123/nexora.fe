import Link from "next/link";
import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";
import { ProductFlowVisual } from "./ProductFlowVisual";
import { MarketingContainer } from "./MarketingContainer";
import { MarketingCta } from "./MarketingCta";

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
      {/* Hero */}
      <section className="marketing-hero marketing-hero-grid relative min-h-[88vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/60 via-background to-accent-soft/40" />

        <MarketingContainer className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-36 md:pb-20 md:pt-40">
          <div className="grid w-full items-center gap-12 text-center lg:grid-cols-2 lg:gap-16 lg:text-left">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Icon name="sparkles" size={14} />
                Intelligent Quantity Platform
              </span>
              <h1 className="mt-6 text-4xl font-bold uppercase leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                From Diagram
                <br />
                to Quantity.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-foreground-secondary md:text-lg">
                QuantScope transforms technical diagrams into structured measurements and verified
                calculations using OCR, computer vision, and deterministic logic — never
                LLM-invented numbers.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link href="/sign-up" className="btn-marketing-primary">
                  Get Started
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link href="/how-it-works" className="btn-marketing-outline">
                  See How It Works
                </Link>
              </div>
            </div>
            <div className="mx-auto hidden w-full max-w-sm lg:block lg:max-w-none">
              <ProductFlowVisual variant="light" drawingOnly />
            </div>
          </div>

          <div className="mt-14 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass-stat text-center">
                <div className="flex items-center justify-center gap-2 text-foreground-muted">
                  <Icon name={s.icon} size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
                <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>

      {/* Workflow */}
      <section className="border-b border-border bg-surface py-24">
        <MarketingContainer className="text-center">
          <p className="eyebrow">Product Workflow</p>
          <h2 className="page-title mx-auto mt-3 max-w-2xl">Five steps to verified quantities</h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground-secondary">
            A structured pipeline from upload to export — every step auditable and deterministic.
          </p>
          <div className="mt-14 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW.map((w) => (
              <div key={w.step} className="card-raised group transition-all hover:border-primary/30 hover:shadow-elevated">
                <IconCircle name={w.icon} size={18} className="mx-auto h-11 w-11 sm:mx-0" />
                <p className="mt-4 text-center font-mono text-xs font-bold text-primary sm:text-left">{w.step}</p>
                <h3 className="mt-1 text-center font-bold text-foreground sm:text-left">{w.title}</h3>
                <p className="mt-2 text-center text-sm leading-relaxed text-foreground-secondary sm:text-left">{w.desc}</p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>

      {/* Platform spotlight */}
      <section className="bg-[#354554] py-24 text-white">
        <MarketingContainer>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Analysis Workspace</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Measurement extraction. Verified calculation.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Upload technical drawings, review detected measurements with confidence scores, and
              run deterministic earthwork and quantity formulas with a complete audit trail.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <ul className="space-y-4 text-left">
                {PLATFORM_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Icon name="check" size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 text-center lg:text-left">
                <Link href="/sign-up" className="btn-marketing-primary inline-flex gap-2">
                  Open Workspace
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>
            <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
              <div className="overflow-hidden rounded-3xl border border-white/10 shadow-modal">
                <div className="bg-[#fafbfc] p-4">
                  <ProductFlowVisual variant="light" drawingOnly compact />
                </div>
                <div className="border-t border-white/10 bg-[#2a3844] p-5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Sample output</p>
                  <p className="mt-1 text-lg font-bold text-white">Cut volume: 142.5 m³</p>
                  <p className="text-sm text-white/60">Chapter 3 earthwork · Full audit trail attached</p>
                </div>
              </div>
            </div>
          </div>
        </MarketingContainer>
      </section>

      {/* Why choose */}
      <section className="bg-background py-24">
        <MarketingContainer>
          <div className="text-center">
            <p className="eyebrow">The QuantScope difference</p>
            <h2 className="page-title mt-3">Why choose us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground-secondary">
              We don&apos;t just extract text from images. We deliver a complete engineering workflow
              designed around accuracy, auditability, and team collaboration.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {WHY.map((item) => (
              <div key={item.title} className="card-raised flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                <IconCircle name={item.icon} size={18} className="shrink-0" />
                <div className="mt-4 sm:ml-4 sm:mt-0">
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-foreground-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-border bg-gradient-to-br from-primary-soft/40 to-surface p-8 shadow-elevated">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Projects", value: "12", icon: "folder" as IconName },
                { label: "Calculations", value: "87", icon: "calculator" as IconName },
                { label: "Reports", value: "31", icon: "file-text" as IconName },
                { label: "Accuracy", value: "99%", icon: "target" as IconName },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
                  <Icon name={m.icon} size={18} className="mx-auto text-primary" />
                  <p className="mt-3 text-2xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs font-medium text-foreground-muted">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-foreground-muted">
              Illustrative dashboard metrics from a typical workspace
            </p>
          </div>
        </MarketingContainer>
      </section>

      {/* Use cases + Security (merged) */}
      <section className="border-y border-border bg-surface py-24">
        <MarketingContainer className="text-center">
          <IconCircle name="shield" size={22} className="mx-auto h-14 w-14" />
          <p className="eyebrow mt-6">Industries & Trust</p>
          <h2 className="page-title mt-3">Built for technical professionals</h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground-secondary">
            From engineering firms to research labs — with enterprise-grade data isolation, session
            authentication, role-based authorization, and strict user-scoped access on every project.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
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

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Session auth", icon: "lock" as IconName },
              { label: "Role-based access", icon: "users" as IconName },
              { label: "Data isolation", icon: "shield" as IconName },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-background px-4 py-5">
                <Icon name={item.icon} size={20} className="mx-auto text-primary" />
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <MarketingCta />
    </>
  );
}
