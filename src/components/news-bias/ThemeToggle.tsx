"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { DEFAULT_THEME, THEME_COPY } from "@/lib/news-bias/constants";
import type { Theme } from "@/lib/news-bias/types/interfaces";
import {
  applyTheme,
  readAppliedTheme,
  storeTheme,
} from "@/lib/news-bias/utils/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readAppliedTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    storeTheme(next);
  };

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? THEME_COPY.toLight : THEME_COPY.toDark}
      className="inline-flex size-11 items-center justify-center rounded-full border border-nb-border bg-nb-surface text-nb-muted hover:border-nb-border-strong hover:text-nb-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
    >
      <Icon aria-hidden className="size-5" />
    </button>
  );
}
