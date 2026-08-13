import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-bold text-foreground">QuantScope</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground-secondary">
            Transform technical diagrams into structured measurements and verified calculations
            using OCR, computer vision, and deterministic calculation logic.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Product</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
            <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
            <li><Link href="/features" className="hover:text-primary">Features</Link></li>
            <li><Link href="/sign-up" className="hover:text-primary">Get Started</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/sign-in" className="hover:text-primary">Sign In</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6">
        <p className="text-center text-xs text-foreground-placeholder">
          © {new Date().getFullYear()} QuantScope · Deterministic engineering calculations
        </p>
      </div>
    </footer>
  );
}
