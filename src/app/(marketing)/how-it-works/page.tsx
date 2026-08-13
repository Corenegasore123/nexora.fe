import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";
import { FaqAccordionLazy } from "@/components/marketing/FaqAccordionLazy";
import { ProductFlowVisualLazy } from "@/components/marketing/ProductFlowVisualLazy";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { MarketingSectionHeader } from "@/components/marketing/MarketingSectionHeader";
import { ScrollReveal, Tilt3D } from "@/components/marketing/lazy-motion";

const STEPS = [
  {
    title: "Upload",
    icon: "upload" as IconName,
    summary: "Add technical drawings to a project workspace.",
    details: [
      "Supports JPG, PNG, WEBP, and PDF formats up to 20 MB per file.",
      "Organize uploads by project with team-scoped access controls.",
      "Batch upload multiple sheets from a single drawing set.",
      "Automatic document versioning keeps every revision traceable.",
    ],
  },
  {
    title: "Analyze",
    icon: "scan" as IconName,
    summary: "OCR and computer vision extract measurements from diagrams.",
    details: [
      "Detects dimension labels, numeric values, and bounding regions.",
      "Confidence scores flag low-certainty readings for human review.",
      "Variable mapping links extracted values to calculation inputs.",
      "CV pipeline handles rotated text, scale bars, and annotations.",
    ],
  },
  {
    title: "Calculate",
    icon: "calculator" as IconName,
    summary: "Deterministic rules engine runs verified formulas.",
    details: [
      "Methodology rules are versioned and auditable — no LLM arithmetic.",
      "Chapter 3 earthwork formulas included out of the box.",
      "Every intermediate step is recorded with inputs and outputs.",
      "Custom rule sets can be configured per project or organization.",
    ],
  },
  {
    title: "Verify",
    icon: "clipboard-check" as IconName,
    summary: "Review, correct, and validate every measurement and result.",
    details: [
      "Side-by-side view of source diagram and extracted values.",
      "Inline editing with full revision history on every correction.",
      "Validation checks catch unit mismatches and out-of-range values.",
      "Approval workflow for team leads before results are finalized.",
    ],
  },
  {
    title: "Export",
    icon: "file-text" as IconName,
    summary: "Generate stakeholder-ready reports with audit trails.",
    details: [
      "Export as PDF, CSV, or JSON with configurable templates.",
      "Reports include methodology version, inputs, and formula steps.",
      "Batch export for multi-calculation project summaries.",
      "Share read-only report links with external stakeholders.",
    ],
  },
];

const FAQ = [
  {
    q: "Does QuantScope use AI for calculations?",
    a: "No. AI is used only for image understanding (OCR and computer vision). All arithmetic runs through a deterministic rules engine with full audit trails.",
  },
  {
    q: "What file formats are supported?",
    a: "JPG, PNG, WEBP, and PDF technical drawings. Multi-page PDFs are processed page by page.",
  },
  {
    q: "Can multiple team members work on the same project?",
    a: "Yes. Projects support owner, editor, and viewer roles with scoped permissions on documents and calculations.",
  },
  {
    q: "How long does analysis take?",
    a: "Most single-page drawings are processed in under 30 seconds. Complex multi-page sets may take a few minutes.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="marketing-page-hero">
        <MarketingContainer className="text-center">
          <ScrollReveal animation="blur-up" immediate className="mx-auto max-w-3xl">
            <p className="eyebrow">How It Works</p>
            <h1 className="page-title mt-3">From upload to verified quantity</h1>
            <p className="page-subtitle mx-auto mt-4">
              QuantScope follows a structured five-step pipeline designed for engineering accuracy.
              Every measurement, formula, and result is traceable from source diagram to final report.
            </p>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      <section className="py-12 md:py-20">
        <MarketingContainer>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-16">
            <div className="order-2 space-y-8 lg:order-1 lg:space-y-10">
              {STEPS.map((step, i) => (
                <ScrollReveal key={step.title} animation="fade-up" delay={i * 50}>
                  <div className="flex gap-4 sm:gap-5">
                    <IconCircle name={step.icon} size={18} className="mt-1 h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-primary">Step {String(i + 1).padStart(2, "0")}</p>
                      <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">{step.title}</h2>
                      <p className="mt-2 text-sm text-foreground-secondary sm:text-base">{step.summary}</p>
                      <ul className="mt-3 space-y-2 sm:mt-4">
                        {step.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-sm text-foreground-secondary">
                            <Icon name="check" size={14} className="mt-0.5 shrink-0 text-primary" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal animation="fade-up" className="order-1 mx-auto w-full max-w-md lg:order-2 lg:sticky lg:top-28 lg:max-w-none">
              <Tilt3D intensity={10} className="float-3d">
                <ProductFlowVisualLazy />
              </Tilt3D>
            </ScrollReveal>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-surface py-20">
        <MarketingContainer>
          <MarketingSectionHeader
            title="Why deterministic logic matters"
            subtitle="Engineering quantities must be defensible. QuantScope separates AI perception from calculation logic so every number in your report can be traced to a formula and source."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: "scan" as IconName, title: "AI for perception", desc: "OCR and CV read diagrams — they never compute quantities." },
              { icon: "calculator" as IconName, title: "Rules for arithmetic", desc: "Deterministic engine applies verified formulas with step-by-step output." },
              { icon: "clipboard-check" as IconName, title: "Humans for validation", desc: "Engineers review, correct, and approve before export." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} animation="fade-up" delay={i * 80}>
                <Tilt3D intensity={6}>
                  <div className="card-3d-lift h-full text-center">
                    <IconCircle name={item.icon} size={20} className="mx-auto" />
                    <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-foreground-secondary">{item.desc}</p>
                  </div>
                </Tilt3D>
              </ScrollReveal>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <section className="py-20">
        <MarketingContainer>
          <ScrollReveal animation="blur-up" className="mx-auto max-w-3xl">
            <h2 className="page-title text-center">Frequently asked questions</h2>
            <div className="mt-10">
              <FaqAccordionLazy items={FAQ} />
            </div>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      <MarketingCta />
    </>
  );
}
