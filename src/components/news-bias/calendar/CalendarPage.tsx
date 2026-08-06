"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarShell } from "@/components/news-bias/calendar/CalendarShell";
import { CalendarSkeleton } from "@/components/news-bias/calendar/CalendarSkeleton";
import { CalendarState } from "@/components/news-bias/calendar/CalendarState";
import { CurrencyFilter } from "@/components/news-bias/calendar/CurrencyFilter";
import { EventCard } from "@/components/news-bias/calendar/EventCard";
import { HistorySearch } from "@/components/news-bias/calendar/HistorySearch";
import {
  CALENDAR_COPY,
  useEconomicCalendar,
  useEventHistory,
  type CalendarEvent,
  type CalendarFilter,
  type EventKey,
} from "@/lib/news-bias/calendar";
import {
  ensureDefaultFavorites,
  toggleFavoriteEvent,
} from "@/lib/news-bias/calendar/utils/favorites";
import { Footer } from "@/components/news-bias/Footer";

export function CalendarPage() {
  const [filter, setFilter] = useState<CalendarFilter>("ALL");
  const [favorites, setFavorites] = useState<EventKey[]>([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const [offline, setOffline] = useState(false);

  const { events, isLoading, error, refresh } = useEconomicCalendar(filter);
  const history = useEventHistory(undefined, historyQuery);

  useEffect(() => {
    setFavorites(ensureDefaultFavorites());
  }, []);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const { favoriteEvents, otherEvents } = useMemo(() => {
    const favSet = new Set(favorites);
    const fav: CalendarEvent[] = [];
    const rest: CalendarEvent[] = [];
    for (const event of events) {
      if (favSet.has(event.eventKey)) fav.push(event);
      else rest.push(event);
    }
    return { favoriteEvents: fav, otherEvents: rest };
  }, [events, favorites]);

  const onToggleFavorite = (eventKey: string) => {
    setFavorites(toggleFavoriteEvent(eventKey));
  };

  return (
    <CalendarShell title={CALENDAR_COPY.title} subtitle={CALENDAR_COPY.subtitle}>
      <CurrencyFilter value={filter} onChange={setFilter} />

      {offline ? (
        <CalendarState
          title="Offline"
          message={CALENDAR_COPY.offline}
        />
      ) : null}

      {error ? (
        <CalendarState
          title="Unavailable"
          message={
            error.message.includes("unavailable")
              ? CALENDAR_COPY.unavailable
              : CALENDAR_COPY.error
          }
          actionLabel={CALENDAR_COPY.retry}
          onAction={() => void refresh()}
        />
      ) : null}

      {isLoading && events.length === 0 ? <CalendarSkeleton /> : null}

      {!isLoading && !error && events.length === 0 ? (
        <CalendarState title="No events" message={CALENDAR_COPY.empty} />
      ) : null}

      {favoriteEvents.length > 0 ? (
        <section>
          <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-nb-faint">
            {CALENDAR_COPY.favorites}
          </h2>
          <div className="divide-y-0">
            {favoriteEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                favorited
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      ) : null}

      {otherEvents.length > 0 ? (
        <section>
          {favoriteEvents.length > 0 ? (
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-nb-faint">
              {CALENDAR_COPY.upcoming}
            </h2>
          ) : null}
          {otherEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              favorited={favorites.includes(event.eventKey)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </section>
      ) : null}

      <HistorySearch
        query={historyQuery}
        onQueryChange={setHistoryQuery}
        results={history.results}
        isLoading={history.isLoading}
      />

      <div className="mt-auto pt-4">
        <Footer />
      </div>
    </CalendarShell>
  );
}
