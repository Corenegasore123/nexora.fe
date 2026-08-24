import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { MarketingContainer } from "./MarketingContainer";
import { FooterAccountLinks } from "./FooterAccountLinks";
import { fetchCities } from "@/lib/public";

const EXPLORE = [
  { href: "/", label: "Discover" },
  { href: "/restaurants", label: "All restaurants" },
  { href: "/cities", label: "Cities" },
  { href: "/search", label: "Search" },
];

export async function MarketingFooter() {
  const cities = await fetchCities().catch(() => []);

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
                <span className="marketing-footer-logo-text">Nexora</span>
              </Link>
              <p className="marketing-footer-desc">
                Discover where to eat. Book your table. Enjoy the experience. Find restaurants across Rwanda and reserve a table in a few taps.
              </p>
              <div className="marketing-footer-tags">
                <span>Find a table</span>
                <span>Open tonight</span>
                <span>Highly rated</span>
              </div>
            </div>

            <div className="marketing-footer-nav">
              <div className="marketing-footer-col">
                <p className="marketing-footer-heading">Explore</p>
                <ul className="marketing-footer-links">
                  {EXPLORE.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="marketing-footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="marketing-footer-col">
                <p className="marketing-footer-heading">Cities</p>
                <ul className="marketing-footer-links">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link href={`/cities/${city.slug}`} className="marketing-footer-link">
                        {city.name}
                      </Link>
                    </li>
                  ))}
                  {!cities.length && (
                    <li>
                      <Link href="/cities" className="marketing-footer-link">
                        Browse cities
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <div className="marketing-footer-col">
                <p className="marketing-footer-heading">Account</p>
                <FooterAccountLinks />
              </div>
            </div>
          </div>
        </div>
        <p className="marketing-footer-copy">
          © {new Date().getFullYear()} Nexora · Rwanda
        </p>
      </MarketingContainer>
    </footer>
  );
}
