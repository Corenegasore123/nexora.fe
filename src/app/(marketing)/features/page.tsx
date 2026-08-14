import Link from "next/link";
import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { ScrollReveal } from "@/components/marketing/lazy-motion";

const HIGHLIGHTS = [
  { value: "4", label: "Core capability areas", icon: "layers" as IconName },
  { value: "16+", label: "Production features", icon: "sparkles" as IconName },
  { value: "100%", label: "Audit traceability", icon: "clipboard-check" as IconName },
  { value: "3", label: "Export formats", icon: "file-text" as IconName },
];

const CATEGORIES = [
  {
    label: "Extraction",
    step: "01",
    icon: "scan" as IconName,
    summary: "Turn drawings into structured measurements your team can trust — with confidence on every value.",
    features: [
      {
        title: "OCR dimension detection",
        desc: "Reads numeric labels, units, and annotations from technical drawings with high accuracy.",
        tag: "Perception",
        icon: "scan" as IconName,
      },
      {
        title: "Computer vision pipeline",
        desc: "Identifies bounding regions, scale references, and structural elements in diagrams.",
        tag: "CV",
        icon: "target" as IconName,
      },
      {
        title: "Confidence scoring",
        desc: "Every extracted value carries a score so reviewers know what to prioritize first.",
        tag: "Quality",
        icon: "clipboard-check" as IconName,
      },
      {
        title: "Multi-format support",
        desc: "Process JPG, PNG, WEBP, and multi-page PDF documents in a single workflow.",
        tag: "Input",
        icon: "upload" as IconName,
      },
    ],
  },
  {
    label: "Calculation",
    step: "02",
    icon: "calculator" as IconName,
    summary: "Deterministic formulas replace spreadsheet guesswork — every result is reproducible and defensible.",
    features: [
      {
        title: "Deterministic rules engine",
        desc: "Verified formulas with no LLM-generated arithmetic. Every step is reproducible.",
        tag: "Engine",
        icon: "calculator" as IconName,
      },
      {
        title: "Methodology versioning",
        desc: "Rules are versioned so you always know which formula set produced a result.",
        tag: "Governance",
        icon: "history" as IconName,
      },
      {
        title: "Earthwork quantities",
        desc: "Built-in support for cut/fill volume, area, and related quantity formulas.",
        tag: "Domain",
        icon: "scale" as IconName,
      },
      {
        title: "Scenario comparison",
        desc: "Compare baselines, revisions, and what-if scenarios with delta reporting.",
        tag: "Analysis",
        icon: "git-branch" as IconName,
      },
    ],
  },
  {
    label: "Collaboration",
    step: "03",
    icon: "users" as IconName,
    summary: "Keep engineers aligned with scoped workspaces, roles, and a shared record of every change.",
    features: [
      {
        title: "Project workspaces",
        desc: "Organize documents, calculations, and team members in scoped project containers.",
        tag: "Workspace",
        icon: "folder" as IconName,
      },
      {
        title: "Role-based access",
        desc: "Owner, editor, and viewer roles with granular permissions on every resource.",
        tag: "Security",
        icon: "shield" as IconName,
      },
      {
        title: "Revision history",
        desc: "Full audit trail on measurement corrections and calculation reruns.",
        tag: "Audit",
        icon: "history" as IconName,
      },
      {
        title: "Team chat & tasks",
        desc: "Coordinate reviews and assignments without leaving the project context.",
        tag: "Team",
        icon: "users" as IconName,
      },
    ],
  },
  {
    label: "Reporting",
    step: "04",
    icon: "file-text" as IconName,
    summary: "Deliver stakeholder-ready outputs that link every quantity back to source data and methodology.",
    features: [
      {
        title: "PDF export",
        desc: "Professional reports with methodology, inputs, steps, and final quantities.",
        tag: "Deliverable",
        icon: "file-text" as IconName,
      },
      {
        title: "CSV & JSON export",
        desc: "Structured data for downstream systems, spreadsheets, and integrations.",
        tag: "Data",
        icon: "layers" as IconName,
      },
      {
        title: "Audit trail attachment",
        desc: "Every report links back to source measurements and formula versions.",
        tag: "Traceability",
        icon: "clipboard-check" as IconName,
      },
      {
        title: "Report templates",
        desc: "Summary, detailed, and comparison templates tailored to different audiences.",
        tag: "Templates",
        icon: "book-open" as IconName,
      },
    ],
  },
];

const COMPARE = [
  { label: "Traceable source measurements", manual: false, quantscope: true },
  { label: "Automated OCR extraction", manual: false, quantscope: true },
  { label: "Deterministic formula engine", manual: "Partial", quantscope: true },
  { label: "Team collaboration & roles", manual: false, quantscope: true },
  { label: "Confidence scoring on inputs", manual: false, quantscope: true },
  { label: "Export-ready audit reports", manual: "Partial", quantscope: true },
  { label: "Manual spreadsheet workflow", manual: true, quantscope: false },
];

function CompareCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="features-compare-yes">
        <Icon name="check" size={14} />
      </span>
    );
  }
  if (value === false) {
    return <span className="features-compare-no">—</span>;
  }
  return <span className="features-compare-partial">{value}</span>;
}

export default function FeaturesPage() {
  return (
    <>
      <section className="marketing-page-hero features-hero">
        <MarketingContainer className="text-center">
          <ScrollReveal animation="blur-up" immediate>
            <p className="eyebrow">Platform capabilities</p>
            <h1 className="page-title mt-3">Built for engineering quantity workflows</h1>
            <p className="page-subtitle mx-auto mt-4 max-w-2xl">
              QuantaScope connects measurement extraction, verified calculation, team collaboration,
              and reporting in one professional workspace — without black-box arithmetic.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/sign-up" className="btn-marketing-primary inline-flex gap-2">
                Start free
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link href="/how-it-works" className="btn-marketing-outline">
                See the pipeline
              </Link>
            </div>
          </ScrollReveal>

          <div className="features-highlight-grid">
            {HIGHLIGHTS.map((item, i) => (
              <ScrollReveal key={item.label} animation="fade-up" delay={i * 60}>
                <div className="features-highlight-card">
                  <Icon name={item.icon} size={18} className="mx-auto text-primary" />
                  <p className="features-highlight-value">{item.value}</p>
                  <p className="features-highlight-label">{item.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </MarketingContainer>
      </section>

      {CATEGORIES.map((cat, idx) => (
        <section
          key={cat.label}
          className={`features-category-section ${idx % 2 === 0 ? "bg-background" : "border-y border-border bg-surface"}`}
        >
          <MarketingContainer>
            <div className="features-category-layout">
              <ScrollReveal animation="fade-up" className="features-category-intro">
                <p className="features-category-step">{cat.step}</p>
                <div className="features-category-heading">
                  <IconCircle name={cat.icon} size={20} />
                  <h2 className="text-2xl font-bold text-foreground">{cat.label}</h2>
                </div>
                <p className="features-category-summary">{cat.summary}</p>
              </ScrollReveal>

              <div className="features-category-grid">
                {cat.features.map((f, i) => (
                  <ScrollReveal key={f.title} animation="fade-up" delay={i * 50}>
                    <article className="features-card">
                      <div className="features-card-icon">
                        <Icon name={f.icon} size={16} />
                      </div>
                      <div className="features-card-top">
                        <span className="features-card-tag">{f.tag}</span>
                        <Icon name="check" size={14} className="features-card-check" />
                      </div>
                      <h3 className="features-card-title">{f.title}</h3>
                      <p className="features-card-desc">{f.desc}</p>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </MarketingContainer>
        </section>
      ))}

      <section className="features-compare-section">
        <MarketingContainer>
          <ScrollReveal animation="fade-up" className="text-center">
            <p className="eyebrow">Why teams switch</p>
            <h2 className="page-title mt-3">QuantaScope vs manual workflows</h2>
            <p className="page-subtitle mx-auto mt-4 max-w-xl">
              Replace fragmented spreadsheets with a single auditable platform your team can defend
              in review meetings.
            </p>
          </ScrollReveal>

          <div className="features-compare-cards md:hidden">
            {COMPARE.filter((row) => row.quantscope || row.manual === "Partial").map((row) => (
              <ScrollReveal key={row.label} animation="fade-up">
                <div className="features-compare-card">
                  <p className="features-compare-card-title">{row.label}</p>
                  <div className="features-compare-card-row">
                    <span>Manual</span>
                    <CompareCell value={row.manual} />
                  </div>
                  <div className="features-compare-card-row">
                    <span>QuantaScope</span>
                    <CompareCell value={row.quantscope} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="scale" className="features-compare-table-wrap hidden md:block">
            <table className="data-table features-compare-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th className="text-center">Manual</th>
                  <th className="text-center">QuantaScope</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label}>
                    <td className="font-medium text-foreground">{row.label}</td>
                    <td className="text-center">
                      <CompareCell value={row.manual} />
                    </td>
                    <td className="text-center">
                      <CompareCell value={row.quantscope} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      <MarketingCta />
    </>
  );
}
