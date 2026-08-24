import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: ["var(--nx-text-xs)", { lineHeight: "var(--nx-leading-normal)" }],
        sm: ["var(--nx-text-sm)", { lineHeight: "var(--nx-leading-normal)" }],
        base: ["var(--nx-text-md)", { lineHeight: "var(--nx-leading-normal)" }],
        lg: ["var(--nx-text-lg)", { lineHeight: "var(--nx-leading-snug)" }],
        xl: ["var(--nx-text-xl)", { lineHeight: "var(--nx-leading-snug)" }],
        "2xl": ["var(--nx-text-2xl)", { lineHeight: "var(--nx-leading-tight)" }],
        "3xl": ["var(--nx-text-3xl)", { lineHeight: "var(--nx-leading-tight)" }],
        "4xl": ["var(--nx-text-4xl)", { lineHeight: "var(--nx-leading-tight)" }],
      },
      colors: {
        background: "var(--color-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
        },
        foreground: {
          DEFAULT: "var(--color-foreground)",
          secondary: "var(--color-foreground-secondary)",
          muted: "var(--color-foreground-muted)",
          placeholder: "var(--color-foreground-placeholder)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          soft: "var(--color-primary-soft)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          active: "var(--color-accent-active)",
          soft: "var(--color-accent-soft)",
        },
        selected: "var(--color-selected)",
        success: {
          DEFAULT: "var(--color-success)",
          bg: "var(--color-success-bg)",
          border: "var(--color-success-border)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          bg: "var(--color-warning-bg)",
          border: "var(--color-warning-border)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          bg: "var(--color-error-bg)",
          border: "var(--color-error-border)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          bg: "var(--color-info-bg)",
          border: "var(--color-info-border)",
        },
        processing: {
          DEFAULT: "var(--color-processing)",
          bg: "var(--color-processing-bg)",
          border: "var(--color-processing-border)",
        },
        pending: {
          DEFAULT: "var(--color-pending)",
          bg: "var(--color-pending-bg)",
          border: "var(--color-pending-border)",
        },
        confidence: {
          high: "var(--color-confidence-high)",
          medium: "var(--color-confidence-medium)",
          low: "var(--color-confidence-low)",
        },
        "ai-processing": "var(--color-ai-processing)",
        "ai-warning": "var(--color-ai-warning)",
        "user-correction": "var(--color-user-correction)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
          6: "var(--chart-6)",
          7: "var(--chart-7)",
          8: "var(--chart-8)",
        },
        ink: {
          DEFAULT: "var(--nx-ink-900)",
          muted: "var(--nx-ink-700)",
          faint: "var(--nx-ink-400)",
        },
        coral: {
          DEFAULT: "var(--nx-coral-500)",
          hover: "var(--nx-coral-600)",
          soft: "var(--nx-coral-50)",
        },
        teal: {
          DEFAULT: "var(--nx-teal-500)",
          soft: "var(--nx-teal-50)",
        },
        violet: {
          DEFAULT: "var(--nx-violet-500)",
        },
        gold: {
          DEFAULT: "var(--nx-gold-500)",
        },
      },
      ringColor: {
        DEFAULT: "var(--color-focus-ring)",
      },
      boxShadow: {
        elevated: "0 8px 24px rgba(17, 24, 39, 0.12)",
        modal: "0 24px 48px rgba(17, 24, 39, 0.20)",
      },
      letterSpacing: {
        widest: "0.2em",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
