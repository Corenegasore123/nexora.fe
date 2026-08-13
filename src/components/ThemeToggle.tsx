"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";

type Theme = "light" | "dark" | "system";

function resolveDark(theme: Theme): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", resolveDark(theme));
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("quantscope-theme");
  if (stored === "dark" || stored === "light" || stored === "system") return stored;
  return "system";
}

const THEME_ICON: Record<Theme, IconName> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

export function ThemeToggle({ variant = "compact" }: { variant?: "compact" | "settings" }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const initial = getStoredTheme();
    setTheme(initial);
    applyTheme(initial);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getStoredTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const select = (next: Theme) => {
    setTheme(next);
    localStorage.setItem("quantscope-theme", next);
    applyTheme(next);
  };

  if (variant === "settings") {
    return (
      <div className="flex flex-wrap gap-2">
        {(["light", "dark", "system"] as Theme[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => select(t)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm capitalize transition-colors ${
              theme === t
                ? "border-primary bg-primary-soft text-primary"
                : "border-border text-foreground-secondary hover:border-border-strong"
            }`}
          >
            <Icon name={THEME_ICON[t]} size={16} />
            {t}
          </button>
        ))}
      </div>
    );
  }

  const cycle = () => select(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground-muted hover:bg-pending-bg hover:text-foreground"
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      <Icon name={THEME_ICON[theme]} size={16} />
      <span className="hidden sm:inline capitalize">{theme}</span>
    </button>
  );
}
