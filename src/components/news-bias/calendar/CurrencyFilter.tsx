"use client";

import type { CalendarFilter } from "@/lib/news-bias/calendar";
import { CALENDAR_FILTERS } from "@/lib/news-bias/calendar";

interface CurrencyFilterProps {
  value: CalendarFilter;
  onChange: (filter: CalendarFilter) => void;
}

const LABELS: Record<CalendarFilter, string> = {
  ALL: "All",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  JPY: "JPY",
  AUD: "AUD",
  CAD: "CAD",
  CHF: "CHF",
  NZD: "NZD",
  CRYPTO: "Crypto",
};

export function CurrencyFilter({ value, onChange }: CurrencyFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by currency"
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {CALENDAR_FILTERS.map((filter) => {
        const active = filter === value;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter)}
            className={[
              "min-h-10 shrink-0 rounded-full border px-3.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
              active
                ? "border-nb-accent bg-nb-accent/15 text-nb-text"
                : "border-nb-border text-nb-muted hover:border-nb-border-strong hover:text-nb-text",
            ].join(" ")}
          >
            {LABELS[filter]}
          </button>
        );
      })}
    </div>
  );
}
