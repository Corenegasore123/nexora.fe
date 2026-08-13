import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { MarketingSectionHeader } from "@/components/marketing/MarketingSectionHeader";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { Tilt3D } from "@/components/marketing/Tilt3D";

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
        <MarketingContainer>
          <ScrollReveal animation="blur-up" immediate className="mx-auto max-w-3xl">
            <p className="eyebrow">About</p>
            <h1 className="page-title mt-3">Built for engineering precision</h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground-secondary">
              QuantScope is a professional platform for extracting measurements from technical diagrams
              and performing deterministic quantity calculations. We combine OCR, computer vision, and a
              verified rules engine — so every number in your report is traceable, auditable, and
              defensible.
            </p>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      <section className="border-b border-border bg-surface py-20">
        <MarketingContainer>
          <div className="grid gap-16 lg:grid-cols-2">
            <ScrollReveal animation="fade-right">
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
            </ScrollReveal>
            <ScrollReveal animation="fade-left">
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
            </ScrollReveal>
          </div>
        </MarketingContainer>
      </section>

      <section className="py-20">
        <MarketingContainer>
          <MarketingSectionHeader title="Our values" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} animation="fade-up" delay={i * 70}>
                <Tilt3D intensity={6}>
                  <div className="card-3d-lift h-full">
                    <IconCircle name={v.icon} size={18} />
                    <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                    <p className="mt-2 text-sm text-foreground-secondary">{v.desc}</p>
                  </div>
                </Tilt3D>
              </ScrollReveal>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-primary-soft/30 py-20">
        <MarketingContainer>
          <ScrollReveal animation="scale" className="mx-auto max-w-4xl">
            <h2 className="page-title text-center">Platform at a glance</h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {STATS.map((s, i) => (
                <ScrollReveal key={s.label} animation="fade-up" delay={i * 60}>
                  <div className="glass-stat text-center">
                    <p className="text-3xl font-bold text-primary">{s.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">{s.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      <MarketingCta />
    </>
  );
}
