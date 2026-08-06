"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import type { SearchHit } from "@/lib/news-bias/modules/types";

interface GlobalSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  hits: SearchHit[];
}

export function GlobalSearch({ query, onQueryChange, hits }: GlobalSearchProps) {
  const trimmed = query.trim();
  const listId = "workspace-search-results";

  return (
    <section
      aria-label={WORKSPACE_COPY.sections.search}
      className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4"
    >
      <h2 className="text-sm font-semibold text-nb-text">
        {WORKSPACE_COPY.sections.search}
      </h2>
      <p className="mt-1 text-xs text-nb-muted">{WORKSPACE_COPY.search.hint}</p>
      <div role="search" className="mt-3">
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-nb-border bg-nb-input px-3 focus-within:ring-2 focus-within:ring-nb-accent/70">
          <Search aria-hidden className="size-4 shrink-0 text-nb-faint" />
          <span className="sr-only">{WORKSPACE_COPY.search.placeholder}</span>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={WORKSPACE_COPY.search.placeholder}
            autoComplete="off"
            aria-controls={trimmed ? listId : undefined}
            className="w-full bg-transparent text-sm text-nb-text outline-none placeholder:text-nb-faint"
          />
        </label>
      </div>
      {trimmed ? (
        hits.length === 0 ? (
          <p role="status" className="mt-3 text-xs text-nb-muted">
            {WORKSPACE_COPY.search.empty}
          </p>
        ) : (
          <ul id={listId} className="mt-3 space-y-1">
            {hits.map((hit) => (
              <li key={hit.id}>
                <Link
                  href={hit.href}
                  className="flex min-h-11 items-center justify-between gap-2 rounded-xl px-3 text-sm hover:bg-nb-elevated/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
                >
                  <span className="font-semibold text-nb-text">{hit.label}</span>
                  <span className="text-[11px] uppercase tracking-wider text-nb-faint">
                    {hit.kind}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </section>
  );
}
