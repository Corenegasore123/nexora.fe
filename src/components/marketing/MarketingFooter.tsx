import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { MarketingContainer } from "./MarketingContainer";

export function MarketingFooter() {
  return (
    <footer className="marketing-footer-wrap">
      <MarketingContainer>
        <div className="marketing-footer-shell">
          <div className="marketing-footer-grid">
            <div className="marketing-footer-brand">
              <div className="marketing-footer-logo">
                <span className="marketing-footer-logo-mark">Qa</span>
                <p className="text-lg font-bold text-white">QuantaScope</p>
              </div>
              <p className="marketing-footer-desc">
                Intelligent quantity platform for engineers — OCR, computer vision, and deterministic
                calculations with full auditability.
              </p>
              <p className="marketing-footer-tagline">
                One platform · Verified quantities · Full audit trail
              </p>
            </div>

            <div className="marketing-footer-col">
              <p className="marketing-footer-heading">Product</p>
              <ul className="marketing-footer-links">
                <li>
                  <Link href="/how-it-works" className="marketing-footer-link">
                    <Icon name="layers" size={14} />
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="marketing-footer-link">
                    <Icon name="sparkles" size={14} />
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="marketing-footer-link">
                    <Icon name="arrow-right" size={14} />
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div className="marketing-footer-col">
              <p className="marketing-footer-heading">Company</p>
              <ul className="marketing-footer-links">
                <li>
                  <Link href="/about" className="marketing-footer-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="marketing-footer-link">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="marketing-footer-link">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="marketing-footer-copy">
          © {new Date().getFullYear()} QuantaScope · Deterministic engineering calculations
        </p>
      </MarketingContainer>
    </footer>
  );
}
