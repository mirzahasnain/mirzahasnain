"use client";

import { Check, X } from "lucide-react";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { ChecklistItem } from "@/lib/news-bias/modules/types";

interface NewsChecklistProps {
  items: ChecklistItem[];
}

export function NewsChecklist({ items }: NewsChecklistProps) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {TERMINAL_COPY.checklist.title}
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-xl bg-nb-elevated/40 px-3 py-2.5"
          >
            <span
              className={[
                "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
                item.ok ? "bg-nb-up/20 text-nb-up" : "bg-nb-down/20 text-nb-down",
              ].join(" ")}
            >
              {item.ok ? (
                <Check aria-hidden className="size-3.5" />
              ) : (
                <X aria-hidden className="size-3.5" />
              )}
            </span>
            <div>
              <p className="text-sm font-semibold text-nb-text">{item.label}</p>
              <p className="text-xs text-nb-muted">{item.hint}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
