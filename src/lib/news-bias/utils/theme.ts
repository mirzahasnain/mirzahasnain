import { DEFAULT_THEME, THEME_STORAGE_KEY } from "../constants";
import type { Theme } from "../types/interfaces";

const THEME_ATTRIBUTE = "nbTheme";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * The theme already on the document, which a blocking script in the route
 * layout sets before first paint so there is no flash.
 */
export function readAppliedTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;

  const applied = document.documentElement.dataset[THEME_ATTRIBUTE];
  return isTheme(applied) ? applied : DEFAULT_THEME;
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset[THEME_ATTRIBUTE] = theme;
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked; the theme still applies for this session.
  }
}

/**
 * Runs before hydration, so it is written as a plain string rather than
 * imported: it has to execute in the document, not in the React tree. Only a
 * stored choice moves it off the default, which keeps the first paint
 * predictable.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){var d=${JSON.stringify(DEFAULT_THEME)};var t=d;try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s==="light"||s==="dark"){t=s;}}catch(e){}document.documentElement.dataset.nbTheme=t;})();`;
