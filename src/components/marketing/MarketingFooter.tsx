import Link from "next/link";
import { Icon } from "@/components/icons/Icon";

export function MarketingFooter() {
  return (
    <footer className="px-4 py-12 md:px-6">
      <div className="marketing-footer-shell">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                QS
              </span>
              <p className="text-lg font-bold">QuantScope</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Intelligent quantity platform for engineers — OCR, computer vision, and deterministic
              calculations with full auditability.
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/40">
              One platform · Verified quantities · Full audit trail
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Product</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><Link href="/how-it-works" className="inline-flex items-center gap-2 hover:text-primary"><Icon name="layers" size={14} />How It Works</Link></li>
              <li><Link href="/features" className="inline-flex items-center gap-2 hover:text-primary"><Icon name="sparkles" size={14} />Features</Link></li>
              <li><Link href="/sign-up" className="inline-flex items-center gap-2 hover:text-primary"><Icon name="arrow-right" size={14} />Get Started</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Company</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-primary">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/sign-in" className="hover:text-primary">Sign In</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-foreground-placeholder">
        © {new Date().getFullYear()} QuantScope · Deterministic engineering calculations
      </p>
    </footer>
  );
}
