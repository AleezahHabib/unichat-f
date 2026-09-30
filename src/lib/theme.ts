export type Theme = "light" | "dark" | "system";

const THEME_KEY = "unichat_theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "dark" : "light";
  } else {
    root.dataset.theme = theme;
  }
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function initTheme(): Theme {
  const current = getStoredTheme();
  applyTheme(current);
  return current;
}
