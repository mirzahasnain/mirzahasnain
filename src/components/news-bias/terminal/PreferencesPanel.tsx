"use client";

import { NEWS_EVENTS } from "@/lib/news-bias/news";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import { describeAlertSettings } from "@/lib/news-bias/modules/alerts";
import type { UserPreferences } from "@/lib/news-bias/modules/types";
import type { NewsEventId, Theme } from "@/lib/news-bias/types/interfaces";
import { applyTheme, storeTheme } from "@/lib/news-bias/utils/theme";

interface PreferencesPanelProps {
  prefs: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
  onToggleNews: (id: NewsEventId) => void;
}

export function PreferencesPanel({
  prefs,
  onChange,
  onToggleNews,
}: PreferencesPanelProps) {
  const setTheme = (theme: Theme) => {
    applyTheme(theme);
    storeTheme(theme);
    onChange({ ...prefs, theme });
  };

  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {TERMINAL_COPY.preferences.title}
      </h2>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
            Theme
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["dark", "light"] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                aria-pressed={prefs.theme === theme}
                onClick={() => setTheme(theme)}
                className={[
                  "min-h-10 rounded-xl border text-sm font-semibold capitalize",
                  prefs.theme === theme
                    ? "border-nb-accent bg-nb-accent/10 text-nb-text"
                    : "border-nb-border text-nb-muted",
                ].join(" ")}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
            Favorite News
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {NEWS_EVENTS.slice(0, 8).map((event) => {
              const active = prefs.favoriteNews.includes(event.id);
              return (
                <button
                  key={event.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleNews(event.id)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    active
                      ? "border-nb-accent/50 bg-nb-accent/10 text-nb-text"
                      : "border-nb-border text-nb-muted",
                  ].join(" ")}
                >
                  {event.shortLabel ?? event.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
            Notifications
          </p>
          <label className="mt-2 flex min-h-11 items-center gap-3 text-sm text-nb-text-soft">
            <input
              type="checkbox"
              checked={prefs.notifications.enabled}
              onChange={(e) =>
                onChange({
                  ...prefs,
                  notifications: {
                    ...prefs.notifications,
                    enabled: e.target.checked,
                  },
                })
              }
              className="size-4 accent-[var(--nb-accent)]"
            />
            {describeAlertSettings(prefs)}
          </label>
        </div>
      </div>
    </section>
  );
}
