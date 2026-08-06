"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { CountdownBadge } from "@/components/news-bias/calendar/CountdownBadge";
import { CALENDAR_COPY, type CalendarEvent } from "@/lib/news-bias/calendar";
import { flagEmoji, formatCalendarNumber } from "@/lib/news-bias/calendar/utils/format";

interface EventCardProps {
  event: CalendarEvent;
  favorited: boolean;
  onToggleFavorite: (eventKey: string) => void;
}

export function EventCard({ event, favorited, onToggleFavorite }: EventCardProps) {
  const releaseDate = new Date(event.releaseAt);

  return (
    <article className="nb-fade relative border-b border-nb-border py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-2xl leading-none" aria-hidden>
          {flagEmoji(event.countryCode)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
                {event.currency}
                <span className="mx-1.5 text-nb-border-strong">·</span>
                {CALENDAR_COPY.impact}
              </p>
              <Link
                href={`/event/${event.id}`}
                className="mt-1 block text-base font-bold text-nb-text hover:text-nb-accent focus:outline-none focus-visible:underline"
              >
                {event.name}
              </Link>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorite(event.eventKey)}
              aria-label={favorited ? CALENDAR_COPY.unstar : CALENDAR_COPY.star}
              aria-pressed={favorited}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-nb-faint hover:text-nb-wait focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
            >
              <Star
                aria-hidden
                className="size-4"
                fill={favorited ? "currentColor" : "none"}
                strokeWidth={favorited ? 0 : 2}
                style={favorited ? { color: "var(--nb-wait)" } : undefined}
              />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-nb-muted">
            <time dateTime={event.releaseAt}>
              {releaseDate.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {releaseDate.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
            <CountdownBadge releaseAt={event.releaseAt} />
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-3">
            <Stat label={CALENDAR_COPY.forecast} value={formatCalendarNumber(event.forecast, event.unit)} />
            <Stat label={CALENDAR_COPY.previous} value={formatCalendarNumber(event.previous, event.unit)} />
            <Stat
              label={CALENDAR_COPY.actual}
              value={formatCalendarNumber(event.actual, event.unit)}
              emphasize={event.actual !== null}
            />
          </dl>
        </div>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-lg bg-nb-elevated/60 px-2 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
        {label}
      </dt>
      <dd
        className={[
          "mt-0.5 font-mono text-sm tabular-nums",
          emphasize ? "font-bold text-nb-text" : "text-nb-text-soft",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}
