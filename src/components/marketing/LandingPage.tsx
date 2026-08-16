"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const STEPS = [
  { title: "Submit", body: "Students and staff open a request type. The workflow engine, not hardcoded routes, decides the first step." },
  { title: "Review", body: "The right officer receives a task. Approvals, finance checks, and fulfilment are configured steps." },
  { title: "Advance", body: "Each decision fires the next transition, writes an event, notifies people, and updates SLA." },
  { title: "Complete", body: "Documents generate, the requester is notified, and every action remains in the audit trail." },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="page-shell pt-28">
          <p className="eyebrow">Nexora Campus</p>
          <h1 className="page-title max-w-3xl">One platform for university requests, approvals, and operations.</h1>
          <p className="page-subtitle">
            Digitise transcript requests, clearance, letters, accommodation, equipment, and any other approval-heavy campus process — with a configurable workflow engine, SLA tracking, and a full audit trail.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-in" className="btn-primary">
              Open campus workspace
            </Link>
            <Link href="/how-it-works" className="btn-secondary">
              See the workflow engine
            </Link>
          </div>
        </section>
        <section className="page-shell grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <article key={step.title} className="card-raised">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">0{i + 1}</p>
              <h2 className="mt-3 text-lg font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm text-foreground-secondary">{step.body}</p>
            </article>
          ))}
        </section>
        <section className="page-shell">
          <div className="card flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="app-sidebar-logo-mark !bg-accent">
                <BrandMark size={18} />
              </span>
              <div>
                <p className="eyebrow">Demo accounts</p>
                <p className="mt-1 font-semibold">student@nexora.campus · registrar@nexora.campus · admin@nexora.campus</p>
                <p className="mt-1 text-sm text-foreground-muted">Password: Campus#2026</p>
              </div>
            </div>
            <Link href="/sign-in" className="btn-primary">
              Sign in
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
