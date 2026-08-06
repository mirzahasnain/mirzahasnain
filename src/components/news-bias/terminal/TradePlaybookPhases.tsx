"use client";

import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { EventTradePlaybook } from "@/lib/news-bias/modules/types";

interface TradePlaybookPhasesProps {
  playbook: EventTradePlaybook | null;
}

export function TradePlaybookPhases({ playbook }: TradePlaybookPhasesProps) {
  if (!playbook) {
    return (
      <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
        <h2 className="text-sm font-semibold text-nb-text">
          {TERMINAL_COPY.playbook.title}
        </h2>
        <p className="mt-2 text-sm text-nb-muted">
          Waiting for a focus event to build the playbook.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-nb-text">
          {TERMINAL_COPY.playbook.title}
        </h2>
        <p className="text-xs font-semibold text-nb-accent">{playbook.assetLabel}</p>
      </div>
      <ol className="mt-3 space-y-2">
        {playbook.phases.map((phase) => (
          <li
            key={phase.id}
            className="rounded-xl bg-nb-elevated/50 px-3 py-2.5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
              {phase.title}
            </p>
            <p className="mt-1 text-sm text-nb-text-soft">{phase.action}</p>
          </li>
        ))}
      </ol>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-nb-border px-3 py-2">
          <dt className="text-[10px] uppercase tracking-wider text-nb-faint">
            Target
          </dt>
          <dd className="mt-0.5 font-semibold text-nb-text">{playbook.target}</dd>
        </div>
        <div className="rounded-xl border border-nb-border px-3 py-2">
          <dt className="text-[10px] uppercase tracking-wider text-nb-faint">
            Risk
          </dt>
          <dd className="mt-0.5 font-semibold text-nb-text">{playbook.risk}</dd>
        </div>
      </dl>
    </section>
  );
}
