import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-black font-sans text-white antialiased">
        <AppHeader />
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
