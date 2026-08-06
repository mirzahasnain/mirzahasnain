"use client";

import { CALENDAR_COPY, type DataMode } from "@/lib/news-bias/calendar";

interface DataModeToggleProps {
  value: DataMode;
  onChange: (mode: DataMode) => void;
}

export function DataModeToggle({ value, onChange }: DataModeToggleProps) {
  return (
    <div className="space-y-2">
      <div
        role="group"
        aria-label="Data mode"
        className="grid grid-cols-2 gap-2 rounded-xl border border-nb-border bg-nb-elevated/40 p-1"
      >
        {(["manual", "live"] as const).map((mode) => {
          const active = value === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(mode)}
              className={[
                "min-h-11 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
                active
                  ? "bg-nb-surface text-nb-text shadow-sm"
                  : "text-nb-muted hover:text-nb-text",
              ].join(" ")}
            >
              {mode === "manual" ? CALENDAR_COPY.manual : CALENDAR_COPY.live}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-nb-faint">
        {value === "live" ? CALENDAR_COPY.liveHint : CALENDAR_COPY.manualHint}
      </p>
    </div>
  );
}
