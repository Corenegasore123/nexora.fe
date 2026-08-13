import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { MarketingContainer } from "./MarketingContainer";
import { ScrollReveal } from "./ScrollReveal";

export function MarketingFooter() {
  return (
    <footer className="marketing-footer-wrap">
      <MarketingContainer>
        <ScrollReveal animation="fade-up">
          <div className="marketing-footer-shell">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="md:col-span-2">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-xs font-bold text-[var(--color-on-accent)]">
                  QS
                </span>
                <p className="text-lg font-bold text-white">QuantScope</p>
              </div>
              <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-white/65 md:text-left">
                Intelligent quantity platform for engineers — OCR, computer vision, and deterministic
                calculations with full auditability.
              </p>
              <p className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-white/35 md:text-left">
                One platform · Verified quantities · Full audit trail
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-white/45">Product</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 transition-colors hover:text-accent md:justify-start">
                    <Icon name="layers" size={14} />
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="inline-flex items-center justify-center gap-2 transition-colors hover:text-accent md:justify-start">
                    <Icon name="sparkles" size={14} />
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 transition-colors hover:text-accent md:justify-start">
                    <Icon name="arrow-right" size={14} />
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-white/45">Company</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/about" className="transition-colors hover:text-accent">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition-colors hover:text-accent">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="transition-colors hover:text-accent">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </ScrollReveal>
        <p className="mt-8 text-center text-xs text-white/40">
          © {new Date().getFullYear()} QuantScope · Deterministic engineering calculations
        </p>
      </MarketingContainer>
    </footer>
  );
}
