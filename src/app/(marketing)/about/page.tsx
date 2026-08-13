import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="eyebrow">About</p>
      <h1 className="page-title mt-3">Built for engineering precision</h1>
      <p className="mt-6 text-lg leading-relaxed text-foreground-secondary">
        QuantScope is a professional platform for extracting measurements from technical diagrams
        and performing deterministic quantity calculations. We combine OCR, computer vision, and a
        verified rules engine — so every number in your report is traceable, auditable, and
        defensible.
      </p>
      <p className="mt-4 text-foreground-secondary">
        Our team builds tools for engineers, researchers, and technical institutions who need
        accuracy over automation theater. AI handles image understanding; calculation logic handles
        arithmetic.
      </p>
      <Link href="/sign-up" className="btn-primary mt-10 inline-flex">
        Get Started
      </Link>
    </div>
  );
}
