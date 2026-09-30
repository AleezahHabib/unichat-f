"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setLocalTheme] = React.useState<Theme>("system");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setLocalTheme(getStoredTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    // If system or light -> dark, if dark -> light
    const isDark =
      document.documentElement.dataset.theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const nextTheme: Theme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    setLocalTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-[10px] bg-surface-2 border border-border" />
    );
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-[10px] bg-surface-2 text-ink border border-border hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-5 h-5 hidden [data-theme='dark']_&:block dark:[data-theme='light']_&:hidden" />
      <Moon className="w-5 h-5 block [data-theme='dark']_&:hidden dark:[data-theme='light']_&:block" />
    </button>
  );
}
