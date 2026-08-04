"use client";

import { Check } from "lucide-react";
import { memo, useRef } from "react";
import type { ReactNode } from "react";
import {
  handleOptionKeyDown,
  OPTION_ATTRIBUTE,
} from "@/components/news-bias/optionKeyboard";
import { SEARCH_COPY } from "@/lib/news-bias/constants";
import type { OptionSection } from "@/lib/news-bias/types/interfaces";

interface StepPickerProps<TValue extends string> {
  step: string;
  title: string;
  sections: OptionSection<TValue>[];
  value: TValue | null;
  onChange: (value: TValue) => void;
  /** Short labels fit two per row on a phone; long ones need the full width. */
  columns?: 1 | 2;
  /** Rendered above the options, e.g. quick picks or a search box. */
  header?: ReactNode;
  /** Escape backs out of the step. */
  onCancel?: () => void;
}

function StepPickerComponent<TValue extends string>({
  step,
  title,
  sections,
  value,
  onChange,
  columns = 1,
  header,
  onCancel,
}: StepPickerProps<TValue>) {
  const listRef = useRef<HTMLDivElement>(null);
  const isEmpty = sections.every((section) => section.options.length === 0);

  return (
    <section className="nb-fade rounded-3xl border border-nb-border bg-nb-surface p-5 sm:p-6">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold tabular-nums text-nb-accent">
          {step}
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-nb-muted">
          {title}
        </h2>
      </div>

      {header ? <div className="mt-4">{header}</div> : null}

      <div
        ref={listRef}
        data-nb-options
        onKeyDown={(event) => handleOptionKeyDown(event, onCancel)}
        className="mt-4 space-y-4"
      >
        {isEmpty ? (
          <p className="py-4 text-center text-sm text-nb-muted">
            {SEARCH_COPY.empty}
          </p>
        ) : null}

        {sections.map((section) =>
          section.options.length === 0 ? null : (
            <div key={section.id}>
              {section.label ? (
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-nb-faint">
                  {section.label}
                </p>
              ) : null}

              <div
                role="group"
                aria-label={section.label ?? title}
                className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {section.options.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      {...{ [OPTION_ATTRIBUTE]: "" }}
                      aria-pressed={isSelected}
                      onClick={() => onChange(option.value)}
                      className={`flex min-h-14 items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70 ${
                        isSelected
                          ? "border-nb-accent/60 bg-nb-accent/10"
                          : "border-nb-border bg-nb-elevated hover:border-nb-border-strong"
                      }`}
                    >
                      <span className="min-w-0">
                        <span
                          className={`block truncate text-base font-semibold ${
                            isSelected ? "text-nb-accent" : "text-nb-text"
                          }`}
                        >
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="block truncate text-xs text-nb-faint">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                      {isSelected ? (
                        <Check
                          aria-hidden
                          className="size-4 shrink-0 text-nb-accent"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export const StepPicker = memo(StepPickerComponent) as typeof StepPickerComponent;
