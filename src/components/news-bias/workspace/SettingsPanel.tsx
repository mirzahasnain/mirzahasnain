"use client";

import { NEWS_EVENTS } from "@/lib/news-bias/news";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import { LANGUAGE_OPTIONS } from "@/lib/news-bias/modules/settings";
import type {
  UserPreferences,
  WorkspaceLanguage,
} from "@/lib/news-bias/modules/types";
import type { NewsEventId, PairId, Theme } from "@/lib/news-bias/types/interfaces";
import { applyTheme, storeTheme } from "@/lib/news-bias/utils/theme";

interface SettingsPanelProps {
  prefs: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
}

const PAIRS: PairId[] = [
  "XAUUSD",
  "XAGUSD",
  "BTCUSD",
  "EURUSD",
  "GBPUSD",
  "NAS100",
];

export function SettingsPanel({ prefs, onChange }: SettingsPanelProps) {
  const setTheme = (theme: Theme) => {
    applyTheme(theme);
    storeTheme(theme);
    onChange({ ...prefs, theme });
  };

  return (
    <section
      id="settings"
      className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4"
    >
      <h2 className="text-sm font-semibold text-nb-text">
        {WORKSPACE_COPY.sections.settings}
      </h2>

      <div className="mt-4 space-y-4">
        <Block title={WORKSPACE_COPY.settings.theme}>
          <div className="grid grid-cols-2 gap-2">
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
        </Block>

        <Block title={WORKSPACE_COPY.settings.language}>
          <select
            value={prefs.language}
            onChange={(e) =>
              onChange({
                ...prefs,
                language: e.target.value as WorkspaceLanguage,
              })
            }
            className="min-h-10 w-full rounded-xl border border-nb-border bg-nb-input px-3 text-sm text-nb-text"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </Block>

        <Block title={WORKSPACE_COPY.settings.defaultPair}>
          <select
            value={prefs.defaultPair}
            onChange={(e) =>
              onChange({ ...prefs, defaultPair: e.target.value as PairId })
            }
            className="min-h-10 w-full rounded-xl border border-nb-border bg-nb-input px-3 text-sm text-nb-text"
          >
            {PAIRS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Block>

        <Block title={WORKSPACE_COPY.settings.defaultNews}>
          <select
            value={prefs.defaultNews}
            onChange={(e) =>
              onChange({
                ...prefs,
                defaultNews: e.target.value as NewsEventId,
              })
            }
            className="min-h-10 w-full rounded-xl border border-nb-border bg-nb-input px-3 text-sm text-nb-text"
          >
            {NEWS_EVENTS.map((event) => (
              <option key={event.id} value={event.id}>
                {event.label}
              </option>
            ))}
          </select>
        </Block>

        <Block title={WORKSPACE_COPY.settings.notificationPrefs}>
          <div className="space-y-2">
            {(
              [
                ["enabled", "Enable notifications"],
                ["upcoming", WORKSPACE_COPY.notifications.upcoming],
                ["released", WORKSPACE_COPY.notifications.released],
                ["analysisReady", WORKSPACE_COPY.notifications.analysisReady],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex min-h-10 items-center gap-3 text-sm text-nb-text-soft"
              >
                <input
                  type="checkbox"
                  checked={Boolean(prefs.notifications[key])}
                  onChange={(e) =>
                    onChange({
                      ...prefs,
                      notifications: {
                        ...prefs.notifications,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="size-4 accent-[var(--nb-accent)]"
                />
                {label}
              </label>
            ))}
          </div>
        </Block>
      </div>
    </section>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
