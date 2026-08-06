"use client";

import { CountdownBadge } from "@/components/news-bias/calendar/CountdownBadge";
import { DIRECTION_LABELS } from "@/lib/news-bias/constants";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import type {
  DashboardTopCards,
  MarketBiasSnapshot,
} from "@/lib/news-bias/modules/types";
import type { CalendarEvent } from "@/lib/news-bias/calendar/types";

interface HomeDashboardCardsProps {
  cards: DashboardTopCards;
  bias: MarketBiasSnapshot;
  focusEvent: CalendarEvent | null;
  countdownReleaseAt: string | null;
  onSelectEvent: (id: string) => void;
  todayEvents: CalendarEvent[];
}

export function HomeDashboardCards({
  cards,
  bias,
  focusEvent,
  countdownReleaseAt,
  onSelectEvent,
  todayEvents,
}: HomeDashboardCardsProps) {
  return (
    <div className="space-y-3">
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-nb-border bg-nb-surface px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
            {WORKSPACE_COPY.sections.nextNews}
          </p>
          <p className="mt-2 text-sm font-bold text-nb-text">
            {focusEvent?.name ?? cards.upcomingEvent?.name ?? "—"}
          </p>
          <p className="mt-1 text-[11px] text-nb-muted">
            {focusEvent?.currency ?? cards.upcomingEvent?.currency ?? ""}
          </p>
        </div>
        <div className="rounded-2xl border border-nb-border bg-nb-surface px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
            {WORKSPACE_COPY.sections.countdown}
          </p>
          {countdownReleaseAt ? (
            <div className="mt-2">
              <CountdownBadge releaseAt={countdownReleaseAt} className="text-sm" />
            </div>
          ) : (
            <p className="mt-2 text-sm text-nb-muted">—</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
        <h2 className="text-sm font-semibold text-nb-text">
          {WORKSPACE_COPY.sections.todaysBias}
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["Gold", bias.gold],
              ["Silver", bias.silver],
              ["BTC", bias.crypto],
              ["USD", bias.usd],
            ] as const
          ).map(([label, tone]) => (
            <li
              key={label}
              className="rounded-xl bg-nb-elevated/60 px-3 py-2.5 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
                {label}
              </p>
              <p
                className={[
                  "mt-1 text-sm font-bold",
                  tone === "bullish"
                    ? "text-nb-up"
                    : tone === "bearish"
                      ? "text-nb-down"
                      : "text-nb-flat",
                ].join(" ")}
              >
                {DIRECTION_LABELS[tone]}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {todayEvents.length > 0 ? (
        <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
          <h2 className="text-sm font-semibold text-nb-text">Today&apos;s events</h2>
          <ul className="mt-3 space-y-2">
            {todayEvents.map((event) => {
              const active = focusEvent?.id === event.id;
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => onSelectEvent(event.id)}
                    className={[
                      "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
                      active
                        ? "border-nb-accent/50 bg-nb-accent/10 text-nb-text"
                        : "border-nb-border text-nb-muted hover:border-nb-border-strong",
                    ].join(" ")}
                  >
                    <span>{event.name}</span>
                    <span className="text-[11px] text-nb-faint">{event.currency}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
