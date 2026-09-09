export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "group-strategy-theme";

export function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function resolveTheme(stored: ThemeMode | null): ThemeMode {
  return stored ?? getSystemTheme();
}

export function applyThemeToDocument(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

export function writeStoredTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export const THEME_INIT_SCRIPT = `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var stored=localStorage.getItem(key);var theme=stored==="light"||stored==="dark"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var root=document.documentElement;root.classList.toggle("dark",theme==="dark");root.dataset.theme=theme;}catch(e){}})();`;
