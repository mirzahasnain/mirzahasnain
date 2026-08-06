"use client";

import { CountdownBadge } from "@/components/news-bias/calendar/CountdownBadge";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { DashboardTopCards } from "@/lib/news-bias/modules/types";
import { DIRECTION_LABELS } from "@/lib/news-bias/constants";

interface TopCardsProps {
  cards: DashboardTopCards;
  countdownReleaseAt: string | null;
}

export function TopCards({ cards, countdownReleaseAt }: TopCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card label={TERMINAL_COPY.top.today} value={String(cards.todayHighImpact)} />
      <Card
        label={TERMINAL_COPY.top.upcoming}
        value={cards.upcomingEvent?.name ?? "—"}
        sub={cards.upcomingEvent?.currency}
      />
      <div className="rounded-2xl border border-nb-border bg-nb-surface px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
          {TERMINAL_COPY.top.countdown}
        </p>
        {countdownReleaseAt ? (
          <div className="mt-2">
            <CountdownBadge releaseAt={countdownReleaseAt} className="text-sm" />
          </div>
        ) : (
          <p className="mt-2 text-sm text-nb-muted">—</p>
        )}
      </div>
      <Card
        label={TERMINAL_COPY.top.sentiment}
        value={DIRECTION_LABELS[cards.marketSentiment]}
        sub={cards.sentimentLabel}
        tone={cards.marketSentiment}
      />
    </section>
  );
}

function Card({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "bullish" | "bearish" | "neutral";
}) {
  const toneClass =
    tone === "bullish"
      ? "text-nb-up"
      : tone === "bearish"
        ? "text-nb-down"
        : "text-nb-text";
  return (
    <div className="rounded-2xl border border-nb-border bg-nb-surface px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
        {label}
      </p>
      <p className={`mt-2 text-sm font-bold leading-snug ${toneClass}`}>{value}</p>
      {sub ? <p className="mt-1 text-[11px] text-nb-muted">{sub}</p> : null}
    </div>
  );
}
