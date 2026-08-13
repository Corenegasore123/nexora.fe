import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "QuantScope — Intelligent Building Quantity Platform",
  description:
    "Upload building diagrams for automatic measurement extraction and auditable quantity calculations",
};

const NAV = [
  { href: "/calculator", label: "Calculator" },
  { href: "/calculations", label: "History" },
  { href: "/rules", label: "Rules" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-black font-sans text-white antialiased">
        <header className="sticky top-0 z-50 border-b border-border bg-black/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-lg font-bold tracking-tight text-white">
              QuantScope
            </Link>
            <nav className="flex items-center gap-8">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="animate-fade-in">{children}</main>
        <footer className="mt-auto border-t border-border py-8">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs uppercase tracking-widest text-neutral-600">
              QuantScope · Deterministic Calculations · v1.0.0
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
