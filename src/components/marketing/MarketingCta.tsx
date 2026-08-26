import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { MarketingContainer } from "./MarketingContainer";
import { ScrollReveal, Tilt3D } from "@/components/marketing/lazy-motion";

export function MarketingCta() {
  return (
    <section className="bg-background pb-16 pt-4">
      <MarketingContainer>
        <ScrollReveal animation="scale">
          <Tilt3D intensity={5}>
            <div className="marketing-cta-card">
              <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
                <div className="max-w-xl text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Get started</p>
                  <h2 className="mt-3 text-2xl font-bold leading-snug text-white md:text-[1.75rem]">
                    Start managing your restaurant.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    One platform for reservations, tables, POS, kitchen, inventory, staff, and analytics - across every
                    branch.
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-white/50">
                    <li className="inline-flex items-center gap-2">
                      <Icon name="check" size={14} className="text-accent" />
                      Multi-branch
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <Icon name="check" size={14} className="text-accent" />
                      Live kitchen
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <Icon name="check" size={14} className="text-accent" />
                      Inventory linked to recipes
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[208px] lg:flex-col">
                  <Link href="/sign-in" className="btn-marketing-primary justify-center whitespace-nowrap">
                    Open workspace
                    <Icon name="arrow-right" size={16} />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:border-white/40 hover:text-white"
                  >
                    See the flow
                  </Link>
                </div>
              </div>
            </div>
          </Tilt3D>
        </ScrollReveal>
      </MarketingContainer>
    </section>
  );
}
