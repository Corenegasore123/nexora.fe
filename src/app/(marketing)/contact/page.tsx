import Link from "next/link";
import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { ScrollReveal, Tilt3D } from "@/components/marketing/lazy-motion";

const CHANNELS = [
  {
    icon: "building" as IconName,
    title: "Enterprise & deployment",
    desc: "Private cloud, on-premise installs, volume licensing, and custom methodology packages for institutions.",
    action: "enterprise@quantscope.local",
    cta: "Contact sales",
  },
  {
    icon: "monitor" as IconName,
    title: "Product demo",
    desc: "See the full workflow — upload a drawing, review extracted measurements, and run verified calculations live.",
    action: "/sign-up",
    cta: "Start free trial",
    internal: true,
  },
  {
    icon: "mail" as IconName,
    title: "Technical support",
    desc: "Questions about OCR accuracy, formula rules, exports, or workspace configuration — our team responds within 1–2 business days.",
    action: "support@quantscope.local",
    cta: "Email support",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="marketing-mesh-dark pb-20 pt-32 text-white md:pb-24 md:pt-36">
        <MarketingContainer className="text-center">
          <ScrollReveal animation="blur-up" immediate className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Contact</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Let&apos;s talk about your quantity workflow
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
              Whether you need a demo, enterprise deployment, or technical guidance — choose the channel
              that fits your needs.
            </p>
          </ScrollReveal>
        </MarketingContainer>
      </section>

      <section className="relative pb-24">
        <MarketingContainer>
          <div className="-mt-12 grid gap-6 md:grid-cols-3">
            {CHANNELS.map((ch, i) => (
              <ScrollReveal key={ch.title} animation="fade-up" delay={i * 80}>
                <Tilt3D intensity={8}>
                  <div className="card-3d flex h-full flex-col p-8 text-center shadow-elevated">
                    <IconCircle name={ch.icon} size={20} className="mx-auto" />
                    <h2 className="mt-5 text-lg font-bold text-foreground">{ch.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-secondary">{ch.desc}</p>
                    {ch.internal ? (
                      <Link href={ch.action} className="btn-primary mx-auto mt-8 inline-flex gap-2">
                        {ch.cta}
                        <Icon name="arrow-right" size={16} />
                      </Link>
                    ) : (
                      <a
                        href={`mailto:${ch.action}`}
                        className="btn-secondary mx-auto mt-8 inline-flex gap-2"
                      >
                        <Icon name="mail" size={16} />
                        {ch.cta}
                      </a>
                    )}
                  </div>
                </Tilt3D>
              </ScrollReveal>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-background py-20">
        <MarketingContainer>
          <ScrollReveal animation="scale" className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-foreground">What to expect</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { icon: "history" as IconName, label: "Response time", value: "1–2 business days" },
                { icon: "map-pin" as IconName, label: "Coverage", value: "Remote-first · Global" },
                { icon: "shield" as IconName, label: "Enterprise SLA", value: "Available on request" },
              ].map((item, i) => (
                <ScrollReveal key={item.label} animation="fade-up" delay={i * 70}>
                  <div className="glass-stat">
                    <Icon name={item.icon} size={22} className="mx-auto text-primary" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 font-medium text-foreground">{item.value}</p>
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
