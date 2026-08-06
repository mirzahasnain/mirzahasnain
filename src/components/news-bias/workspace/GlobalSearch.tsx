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
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {WORKSPACE_COPY.sections.search}
      </h2>
      <label className="mt-3 flex min-h-11 items-center gap-2 rounded-xl border border-nb-border bg-nb-input px-3">
        <Search aria-hidden className="size-4 text-nb-faint" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={WORKSPACE_COPY.search.placeholder}
          className="w-full bg-transparent text-sm text-nb-text outline-none placeholder:text-nb-faint"
        />
      </label>
      {query.trim() ? (
        hits.length === 0 ? (
          <p className="mt-3 text-xs text-nb-muted">{WORKSPACE_COPY.search.empty}</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {hits.map((hit) => (
              <li key={hit.id}>
                <Link
                  href={hit.href}
                  className="flex min-h-10 items-center justify-between gap-2 rounded-xl px-3 text-sm hover:bg-nb-elevated/60"
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
