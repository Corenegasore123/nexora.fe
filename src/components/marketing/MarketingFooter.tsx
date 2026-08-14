import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { BrandMark } from "@/components/BrandMark";
import { MarketingContainer } from "./MarketingContainer";

const PRODUCT_LINKS = [
  { href: "/how-it-works", label: "How It Works", icon: "git-branch" as const },
  { href: "/features", label: "Features", icon: "sparkles" as const },
  { href: "/sign-up", label: "Get Started", icon: "arrow-right" as const },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About", icon: "building" as const },
  { href: "/contact", label: "Contact", icon: "mail" as const },
  { href: "/sign-in", label: "Sign In", icon: "lock" as const },
];

export function MarketingFooter() {
  return (
    <footer className="marketing-footer-wrap">
      <MarketingContainer>
        <div className="marketing-footer-shell">
          <div className="marketing-footer-grid">
            <div className="marketing-footer-brand">
              <Link href="/" className="marketing-footer-logo">
                <span className="marketing-footer-logo-mark">
                  <BrandMark size={18} />
                </span>
                <span className="marketing-footer-logo-text">QuantaScope</span>
              </Link>
              <p className="marketing-footer-desc">
                Intelligent quantity platform for engineers — OCR, computer vision, and deterministic
                calculations with full auditability.
              </p>
              <div className="marketing-footer-tags">
                <span>Verified quantities</span>
                <span>Full audit trail</span>
                <span>Team workspaces</span>
              </div>
            </div>

            <div className="marketing-footer-nav">
              <div className="marketing-footer-col">
                <p className="marketing-footer-heading">Product</p>
                <ul className="marketing-footer-links">
                  {PRODUCT_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="marketing-footer-link">
                        <Icon name={link.icon} size={14} />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="marketing-footer-col">
                <p className="marketing-footer-heading">Company</p>
                <ul className="marketing-footer-links">
                  {COMPANY_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="marketing-footer-link">
                        <Icon name={link.icon} size={14} />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
