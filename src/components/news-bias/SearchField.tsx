"use client";

import { Search, X } from "lucide-react";
import { useId } from "react";
import type { KeyboardEvent } from "react";
import { SEARCH_COPY } from "@/lib/news-bias/constants";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Arrowing down out of the box moves into the results. */
  onArrowDown: () => void;
  onCancel: () => void;
}

export function SearchField({
  value,
  onChange,
  onArrowDown,
  onCancel,
}: SearchFieldProps) {
  const inputId = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      onArrowDown();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        {SEARCH_COPY.label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-nb-faint"
      />
      <input
        id={inputId}
        type="search"
        value={value}
        placeholder={SEARCH_COPY.placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-12 w-full rounded-2xl border border-nb-border bg-nb-input pl-11 pr-11 text-base text-nb-text placeholder:text-nb-faint focus:border-nb-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={SEARCH_COPY.clear}
          className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-nb-muted hover:text-nb-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
        >
          <X aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
