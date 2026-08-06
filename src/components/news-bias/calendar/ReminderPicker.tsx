"use client";

import { Bell } from "lucide-react";
import {
  CALENDAR_COPY,
  REMINDER_OPTIONS,
  type ReminderOffset,
} from "@/lib/news-bias/calendar";

interface ReminderPickerProps {
  selected: ReminderOffset[];
  onChange: (offsets: ReminderOffset[]) => void;
}

export function ReminderPicker({ selected, onChange }: ReminderPickerProps) {
  const toggle = (offset: ReminderOffset) => {
    if (selected.includes(offset)) {
      onChange(selected.filter((o) => o !== offset));
    } else {
      onChange([...selected, offset].sort((a, b) => b - a) as ReminderOffset[]);
    }
  };

  return (
    <fieldset className="space-y-3">
      <legend className="flex items-center gap-2 text-sm font-semibold text-nb-text">
        <Bell aria-hidden className="size-4 text-nb-accent" />
        {CALENDAR_COPY.remind}
      </legend>
      <div className="space-y-2">
        {REMINDER_OPTIONS.map((option) => {
          const checked = selected.includes(option.offset);
          return (
            <label
              key={option.offset}
              className={[
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm transition-colors",
                checked
                  ? "border-nb-accent/50 bg-nb-accent/10 text-nb-text"
                  : "border-nb-border text-nb-muted hover:border-nb-border-strong",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option.offset)}
                className="size-4 accent-[var(--nb-accent)]"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
