"use client";

import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { CoachBriefing } from "@/lib/news-bias/modules/types";

interface AiTradingCoachProps {
  coach: CoachBriefing;
}

export function AiTradingCoach({ coach }: AiTradingCoachProps) {
  const blocks = [
    { title: "Current Market Condition", body: coach.marketCondition },
    { title: "Risk", body: coach.risk },
    { title: "Possible Fake Move", body: coach.fakeMove },
    { title: "Expected Volatility", body: coach.expectedVolatility },
    { title: "Historical Behavior", body: coach.historicalBehavior },
  ];

  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">{TERMINAL_COPY.coach.title}</h2>
      <ul className="mt-3 space-y-3">
        {blocks.map((block) => (
          <li key={block.title}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
              {block.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-nb-text-soft">
              {block.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
