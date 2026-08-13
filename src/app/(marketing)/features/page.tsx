import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { MarketingSectionHeader } from "@/components/marketing/MarketingSectionHeader";
import { ScrollReveal, Tilt3D } from "@/components/marketing/lazy-motion";

const CATEGORIES = [
  {
    label: "Extraction",
    icon: "scan" as IconName,
    features: [
      { title: "OCR dimension detection", desc: "Reads numeric labels, units, and annotations from technical drawings with high accuracy." },
      { title: "Computer vision pipeline", desc: "Identifies bounding regions, scale references, and structural elements in diagrams." },
      { title: "Confidence scoring", desc: "Every extracted value carries a confidence score so reviewers know what to prioritize." },
      { title: "Multi-format support", desc: "Process JPG, PNG, WEBP, and multi-page PDF documents in a single workflow." },
    ],
  },
  {
    label: "Calculation",
    icon: "calculator" as IconName,
    features: [
      { title: "Deterministic rules engine", desc: "Verified formulas with no LLM-generated arithmetic — every step is reproducible." },
      { title: "Methodology versioning", desc: "Rules are versioned so you always know which formula set produced a result." },
      { title: "Chapter 3 earthwork", desc: "Built-in support for cut/fill volume, area, and related quantity formulas." },
      { title: "Scenario comparison", desc: "Compare baselines, revisions, and what-if scenarios with delta reporting." },
    ],
  },
  {
    label: "Collaboration",
    icon: "users" as IconName,
    features: [
      { title: "Project workspaces", desc: "Organize documents, calculations, and team members in scoped project containers." },
      { title: "Role-based access", desc: "Owner, editor, and viewer roles with granular permissions on every resource." },
      { title: "Revision history", desc: "Full audit trail on measurement corrections and calculation reruns." },
      { title: "Notifications", desc: "Stay informed when analyses complete, fail, or require review." },
    ],
  },
  {
    label: "Reporting",
    icon: "file-text" as IconName,
    features: [
      { title: "PDF export", desc: "Professional reports with methodology, inputs, steps, and final quantities." },
      { title: "CSV & JSON export", desc: "Structured data for downstream systems, spreadsheets, and integrations." },
      { title: "Audit trail attachment", desc: "Every report links back to source measurements and formula versions." },
      { title: "Template types", desc: "Summary, detailed, and comparison report templates for different audiences." },
    ],
  },
];

const COMPARE = [
  { label: "Manual spreadsheet workflow", manual: true, quantscope: false },
  { label: "Traceable source measurements", manual: false, quantscope: true },
  { label: "Automated OCR extraction", manual: false, quantscope: true },
  { label: "Deterministic formula engine", manual: "Partial", quantscope: true },
  { label: "Team collaboration & roles", manual: false, quantscope: true },
  { label: "Confidence scoring", manual: false, quantscope: true },
  { label: "Export-ready audit reports", manual: "Partial", quantscope: true },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="marketing-page-hero">
        <MarketingContainer className="text-center">
          <ScrollReveal animation="blur-up" immediate>
            <p className="eyebrow">Features</p>
            <h1 className="page-title mt-3">Everything you need for quantity workflows</h1>
            <p className="page-subtitle mx-auto mt-4">
              From automated measurement extraction to verified calculations and professional reports —
              QuantScope covers the full engineering quantity pipeline.
            </p>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      {CATEGORIES.map((cat, idx) => (
        <section
          key={cat.label}
          className={`py-16 ${idx % 2 === 0 ? "bg-background" : "border-y border-border bg-surface"}`}
        >
          <MarketingContainer>
            <ScrollReveal animation="fade-up">
              <div className="mb-10 flex items-center gap-3">
                <IconCircle name={cat.icon} size={20} />
                <h2 className="text-2xl font-bold text-foreground">{cat.label}</h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {cat.features.map((f, i) => (
                <ScrollReveal key={f.title} animation="fade-up" delay={i * 60}>
                  <Tilt3D intensity={5}>
                    <div className="card-3d-lift h-full">
                      <h3 className="font-semibold text-foreground">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{f.desc}</p>
                    </div>
                  </Tilt3D>
                </ScrollReveal>
              ))}
            </div>
          </MarketingContainer>
        </section>
      ))}

      <section className="py-20">
        <MarketingContainer>
          <ScrollReveal animation="scale" className="mx-auto max-w-4xl">
            <MarketingSectionHeader title="QuantScope vs manual workflows" />
            <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-elevated">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th className="text-center">Manual</th>
                    <th className="text-center">QuantScope</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.label}>
                      <td className="font-medium text-foreground">{row.label}</td>
                      <td className="text-center">
                        {row.manual === true ? (
                          <Icon name="check" size={16} className="mx-auto text-foreground-muted" />
                        ) : row.manual === false ? (
                          <span className="text-foreground-placeholder">—</span>
                        ) : (
                          <span className="text-xs text-foreground-muted">{row.manual}</span>
                        )}
                      </td>
                      <td className="text-center">
                        {row.quantscope ? (
                          <Icon name="check" size={16} className="mx-auto text-primary" />
                        ) : (
                          <span className="text-foreground-placeholder">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      <MarketingCta />
    </>
  );
}
