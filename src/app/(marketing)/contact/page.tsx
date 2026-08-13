"use client";

import Link from "next/link";
import { Icon, IconCircle, type IconName } from "@/components/icons/Icon";

const INQUIRY_TYPES = [
  { icon: "building" as IconName, title: "Enterprise deployment", desc: "On-premise or private cloud setups for institutions and large teams." },
  { icon: "book-open" as IconName, title: "Methodology customization", desc: "Custom formula sets, rule libraries, and domain-specific calculations." },
  { icon: "users" as IconName, title: "Partnership & integration", desc: "API access, data pipeline integration, and co-development opportunities." },
  { icon: "microscope" as IconName, title: "Research collaboration", desc: "Academic partnerships for OCR/CV research and quantity estimation studies." },
];

const FAQ = [
  { q: "What is the typical response time?", a: "We respond to all inquiries within 1–2 business days." },
  { q: "Do you offer demos?", a: "Yes. Create a free account to explore the platform, or contact us for a guided walkthrough." },
  { q: "Is there enterprise pricing?", a: "Contact us for volume licensing, on-premise deployment, and custom methodology packages." },
];

export default function ContactPage() {
  return (
    <>
      <section className="marketing-page-hero">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title mt-3">Get in touch</h1>
          <p className="mt-4 text-lg text-foreground-secondary">
            For enterprise deployments, methodology customization, partnership inquiries, or general
            questions — our team is here to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INQUIRY_TYPES.map((item) => (
            <div key={item.title} className="card-raised">
              <IconCircle name={item.icon} size={18} />
              <h2 className="mt-4 font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm text-foreground-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Send a message</h2>
            <p className="mt-3 text-foreground-secondary">
              Fill out the form and we&apos;ll get back to you as soon as possible.
            </p>
            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="auth-label">Full name</label>
                <input id="name" className="input-field w-full" placeholder="Jane Engineer" />
              </div>
              <div>
                <label htmlFor="email" className="auth-label">Email address</label>
                <input id="email" type="email" className="input-field w-full" placeholder="you@company.com" />
              </div>
              <div>
                <label htmlFor="subject" className="auth-label">Subject</label>
                <select id="subject" className="input-field w-full">
                  <option>General inquiry</option>
                  <option>Enterprise deployment</option>
                  <option>Methodology customization</option>
                  <option>Partnership</option>
                  <option>Research collaboration</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="auth-label">Message</label>
                <textarea id="message" rows={5} className="input-field w-full resize-none" placeholder="Tell us about your project or question…" />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5">
                Send message
              </button>
              <p className="text-xs text-foreground-placeholder">
                Contact form integration coming soon. For now,{" "}
                <Link href="/sign-up" className="inline-link">create an account</Link> to explore the platform.
              </p>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Other ways to reach us</h2>
            <div className="mt-8 space-y-6">
              <div className="card">
                <div className="flex items-center gap-3">
                  <Icon name="mail" size={20} className="text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground-muted">Email</p>
                    <p className="font-medium text-foreground">support@quantscope.local</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-3">
                  <Icon name="map-pin" size={20} className="text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground-muted">Location</p>
                    <p className="font-medium text-foreground">Remote-first · Global</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-3">
                  <Icon name="monitor" size={20} className="text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground-muted">Platform</p>
                    <p className="font-medium text-foreground">
                      <Link href="/sign-up" className="inline-link">Create a free account</Link> to get started immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-12 text-lg font-semibold text-foreground">Common questions</h3>
            <div className="mt-4 space-y-4">
              {FAQ.map((item) => (
                <div key={item.q} className="rounded-xl border border-border bg-background p-4">
                  <p className="font-medium text-foreground">{item.q}</p>
                  <p className="mt-1 text-sm text-foreground-secondary">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
