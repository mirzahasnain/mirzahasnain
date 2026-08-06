"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { CalendarShell } from "@/components/news-bias/calendar/CalendarShell";
import { CalendarSkeleton } from "@/components/news-bias/calendar/CalendarSkeleton";
import { CalendarState } from "@/components/news-bias/calendar/CalendarState";
import { CountdownBadge } from "@/components/news-bias/calendar/CountdownBadge";
import { DataModeToggle } from "@/components/news-bias/calendar/DataModeToggle";
import { HistorySearch } from "@/components/news-bias/calendar/HistorySearch";
import { ReminderPicker } from "@/components/news-bias/calendar/ReminderPicker";
import {
  CALENDAR_COPY,
  useCalendarEvent,
  useEventDetail,
  useEventHistory,
  useLiveNews,
  type DataMode,
  type ReminderOffset,
} from "@/lib/news-bias/calendar";
import { loadDataMode, saveDataMode } from "@/lib/news-bias/calendar/utils/dataMode";
import {
  ensureDefaultFavorites,
  toggleFavoriteEvent,
} from "@/lib/news-bias/calendar/utils/favorites";
import {
  flagEmoji,
  formatCalendarNumber,
} from "@/lib/news-bias/calendar/utils/format";
import {
  getReminder,
  setReminderOffsets,
} from "@/lib/news-bias/calendar/utils/reminders";
import { Footer } from "@/components/news-bias/Footer";

interface EventDetailPageProps {
  eventId: string;
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const { event, isLoading, error, refresh } = useCalendarEvent(eventId);
  const { detail } = useEventDetail(event?.eventKey ?? null);
  const [mode, setMode] = useState<DataMode>("manual");
  const [favorited, setFavorited] = useState(false);
  const [reminderOffsets, setLocalReminders] = useState<ReminderOffset[]>([]);
  const [historyQuery, setHistoryQuery] = useState("");

  const live = useLiveNews(event?.id ?? null, mode, Boolean(event));
  const history = useEventHistory(event?.eventKey ?? null, historyQuery);

  useEffect(() => {
    setMode(loadDataMode());
    const favs = ensureDefaultFavorites();
    if (event) setFavorited(favs.includes(event.eventKey));
  }, [event]);

  useEffect(() => {
    if (!event) return;
    const reminder = getReminder(event.id);
    setLocalReminders(reminder?.offsets ?? []);
  }, [event]);

  const displayActual = useMemo(() => {
    if (mode === "live" && live.actual !== null) return live.actual;
    return event?.actual ?? null;
  }, [mode, live.actual, event?.actual]);

  const analysisHref = useMemo(() => {
    if (!event) return "/news-bias";
    const params = new URLSearchParams();
    const newsId = detail?.newsEventId ?? null;
    if (newsId) params.set("event", newsId);
    else params.set("newsName", event.name);
    if (event.forecast !== null) params.set("forecast", String(event.forecast));
    if (event.previous !== null) params.set("previous", String(event.previous));
    if (displayActual !== null) params.set("actual", String(displayActual));
    params.set("mode", mode);
    params.set("calendarId", event.id);
    return `/news-bias?${params.toString()}`;
  }, [event, detail, displayActual, mode]);

  const onModeChange = (next: DataMode) => {
    setMode(saveDataMode(next));
  };

  const onToggleFavorite = () => {
    if (!event) return;
    const next = toggleFavoriteEvent(event.eventKey);
    setFavorited(next.includes(event.eventKey));
  };

  const onRemindersChange = (offsets: ReminderOffset[]) => {
    if (!event) return;
    setLocalReminders(offsets);
    setReminderOffsets({
      calendarId: event.id,
      eventKey: event.eventKey,
      name: event.name,
      releaseAt: event.releaseAt,
      offsets,
    });
  };

  return (
    <CalendarShell
      title={event?.name ?? "Event"}
      subtitle={event ? `${event.currency} · ${CALENDAR_COPY.impact}` : undefined}
      backHref="/calendar"
      backLabel={CALENDAR_COPY.back}
    >
      {isLoading && !event ? <CalendarSkeleton count={2} /> : null}

      {error ? (
        <CalendarState
          title="Unavailable"
          message={CALENDAR_COPY.unavailable}
          actionLabel={CALENDAR_COPY.retry}
          onAction={() => void refresh()}
        />
      ) : null}

      {!isLoading && !event && !error ? (
        <CalendarState title="Not found" message="This event could not be found." />
      ) : null}

      {event ? (
        <div className="nb-fade space-y-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {flagEmoji(event.countryCode)}
              </span>
              <div>
                <p className="text-xs text-nb-muted">{event.country}</p>
                <CountdownBadge releaseAt={event.releaseAt} className="mt-1 text-sm" />
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-label={favorited ? CALENDAR_COPY.unstar : CALENDAR_COPY.star}
              aria-pressed={favorited}
              className="inline-flex size-11 items-center justify-center rounded-full border border-nb-border text-nb-faint hover:text-nb-wait focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
            >
              <Star
                aria-hidden
                className="size-4"
                fill={favorited ? "currentColor" : "none"}
                style={favorited ? { color: "var(--nb-wait)" } : undefined}
              />
            </button>
          </div>

          <dl className="grid grid-cols-3 gap-2 text-center">
            <ValueStat
              label={CALENDAR_COPY.forecast}
              value={formatCalendarNumber(event.forecast, event.unit)}
            />
            <ValueStat
              label={CALENDAR_COPY.previous}
              value={formatCalendarNumber(event.previous, event.unit)}
            />
            <ValueStat
              label={CALENDAR_COPY.actual}
              value={formatCalendarNumber(displayActual, event.unit)}
              emphasize
            />
          </dl>

          {mode === "live" && live.unavailable ? (
            <CalendarState title="Live feed" message={CALENDAR_COPY.unavailable} />
          ) : null}

          <DataModeToggle value={mode} onChange={onModeChange} />

          {detail ? (
            <div className="space-y-5 text-sm leading-relaxed text-nb-text-soft">
              <DetailBlock title="Description" body={detail.description} />
              <DetailBlock
                title="Historical Importance"
                body={detail.historicalImportance}
              />
              <DetailBlock
                title="Markets Affected"
                body={detail.marketsAffected.join(" · ")}
              />
              <DetailBlock
                title="Typical Market Reaction"
                body={detail.typicalMarketReaction}
              />
              <DetailBlock
                title="Pairs Most Sensitive"
                body={detail.pairsMostSensitive.join(" · ")}
              />
            </div>
          ) : null}

          <ReminderPicker
            selected={reminderOffsets}
            onChange={onRemindersChange}
          />

          <Link
            href={analysisHref}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-nb-accent px-5 text-sm font-bold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
          >
            {CALENDAR_COPY.analyze}
          </Link>

          <HistorySearch
            query={historyQuery}
            onQueryChange={setHistoryQuery}
            results={history.results}
            isLoading={history.isLoading}
          />
        </div>
      ) : null}

      <div className="mt-auto pt-4">
        <Footer />
      </div>
    </CalendarShell>
  );
}

function ValueStat({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-xl bg-nb-elevated/60 px-2 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
        {label}
      </dt>
      <dd
        className={[
          "mt-1 font-mono text-base tabular-nums",
          emphasize ? "font-bold text-nb-text" : "text-nb-text-soft",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
        {title}
      </h2>
      <p className="mt-2">{body}</p>
    </section>
  );
}
