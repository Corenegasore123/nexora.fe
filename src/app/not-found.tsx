import Link from "next/link";
import { Icon } from "@/components/icons/Icon";

export default function NotFound() {
  return (
    <div className="not-found-page flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="not-found-card animate-fade-in text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-primary-soft">
          <Icon name="map-pin" size={28} className="text-primary" />
        </div>

        <p className="mt-8 font-mono text-7xl font-bold tabular-nums tracking-tighter text-primary/25 md:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground-secondary md:text-base">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or you don&apos;t have access to it.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary inline-flex gap-2">
            <Icon name="home" size={16} />
            Back to home
          </Link>
          <Link href="/sign-in" className="btn-secondary inline-flex gap-2">
            Sign in
          </Link>
        </div>

        <p className="mt-10 text-xs text-foreground-muted">
          Need help?{" "}
          <Link href="/contact" className="inline-link">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
