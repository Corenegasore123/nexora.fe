import Link from "next/link";
import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";

const VALUES = [
  { icon: "target" as IconName, title: "Precision over automation theater", desc: "We build tools that produce defensible numbers, not impressive demos." },
  { icon: "scale" as IconName, title: "Separation of concerns", desc: "AI handles perception. Rules handle arithmetic. Humans handle validation." },
  { icon: "shield" as IconName, title: "Security by default", desc: "Session auth, role-based access, and strict data isolation on every endpoint." },
  { icon: "git-branch" as IconName, title: "Full traceability", desc: "Every quantity links back to a source measurement, formula version, and audit step." },
];

const STATS = [
  { value: "5", label: "Workflow steps" },
  { value: "3+", label: "Export formats" },
  { value: "100%", label: "Audit coverage" },
  { value: "3", label: "Team roles" },
];

export default function AboutPage() {
  return (
    <>
      <section className="marketing-page-hero">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">About</p>
          <h1 className="page-title mt-3">Built for engineering precision</h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground-secondary">
            QuantScope is a professional platform for extracting measurements from technical diagrams
            and performing deterministic quantity calculations. We combine OCR, computer vision, and a
            verified rules engine — so every number in your report is traceable, auditable, and
            defensible.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Our mission</h2>
            <p className="mt-4 leading-relaxed text-foreground-secondary">
              Engineering teams spend hours manually reading diagrams, transcribing measurements into
              spreadsheets, and running formulas that are impossible to audit. QuantScope automates
              the tedious parts while keeping calculation logic transparent and verifiable.
            </p>
            <p className="mt-4 leading-relaxed text-foreground-secondary">
              Our team builds tools for engineers, researchers, and technical institutions who need
              accuracy over automation theater. AI handles image understanding; calculation logic
              handles arithmetic.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">What we believe</h2>
            <ul className="mt-6 space-y-5">
              {[
                "Quantities must be traceable from source diagram to final report.",
                "AI should assist perception, not invent calculations.",
                "Audit trails are not optional in professional engineering work.",
                "Teams need shared workspaces with clear roles and permissions.",
              ].map((belief) => (
                <li key={belief} className="flex items-start gap-3 text-foreground-secondary">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary" />
                  {belief}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="page-title text-center">Our values</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card-raised">
                <IconCircle name={v.icon} size={18} />
                <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-foreground-secondary">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-primary-soft/30 px-6 py-20 dark:bg-primary-soft/10">
        <div className="mx-auto max-w-4xl">
          <h2 className="page-title text-center">Platform at a glance</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-surface p-6 text-center">
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="page-title">Ready to work with precision?</h2>
          <p className="mt-4 text-foreground-secondary">
            Create a free account and start uploading diagrams in minutes.
          </p>
          <Link href="/sign-up" className="btn-primary mt-8 inline-flex gap-2">
            Get Started
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
