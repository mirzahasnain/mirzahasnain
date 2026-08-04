"use client";

import { memo } from "react";
import { STEP_COPY } from "@/lib/news-bias/constants";

export interface SelectionChip {
  id: string;
  label: string;
  onEdit: () => void;
}

interface SelectionBarProps {
  chips: SelectionChip[];
}

/**
 * Completed steps shrink to one row of chips, so the result card is the only
 * card on screen once the three taps are done. Tapping a chip reopens it.
 */
function SelectionBarComponent({ chips }: SelectionBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onEdit}
          aria-label={`${STEP_COPY.change}: ${chip.label}`}
          className="min-h-11 rounded-full border border-nb-border bg-nb-surface px-4 text-sm font-semibold text-nb-text-soft hover:border-nb-border-strong hover:text-nb-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export const SelectionBar = memo(SelectionBarComponent);
