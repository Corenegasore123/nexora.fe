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
  const stored = localStorage.getItem("nexora-theme");
  if (stored === "dark" || stored === "light" || stored === "system") return stored;
  return "system";
}

const THEME_ICON: Record<Theme, IconName> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

export function ThemeToggle({ variant = "compact" }: { variant?: "compact" | "settings" | "header" }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial = getStoredTheme();
    setTheme(initial);
    applyTheme(initial);
    setIsDark(resolveDark(initial));

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getStoredTheme() === "system") {
        applyTheme("system");
        setIsDark(resolveDark("system"));
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const select = (next: Theme) => {
    setTheme(next);
    localStorage.setItem("nexora-theme", next);
    applyTheme(next);
    setIsDark(resolveDark(next));
  };

  const toggleLightDark = () => select(isDark ? "light" : "dark");

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

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={toggleLightDark}
        className="theme-toggle-header"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <Icon name={isDark ? "sun" : "moon"} size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLightDark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-pending-bg hover:text-foreground"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Icon name={isDark ? "sun" : "moon"} size={18} />
    </button>
  );
}
