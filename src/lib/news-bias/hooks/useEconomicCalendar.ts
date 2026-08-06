"use client";

import useSWR from "swr";
import { economicCalendarApi } from "../services/economicCalendarApi";
import type { EconomicEvent, HistoricalEconomicEvent } from "../types/event";
import { getCalendarRefreshMs } from "../utils/env";
import { toCalendarEvent } from "../utils/eventAdapter";
import type { CalendarEvent, CalendarFilter } from "../calendar/types";

const REFRESH = getCalendarRefreshMs();

/**
 * Primary calendar hook — components never call providers/APIs directly.
 * Returns UI-compatible CalendarEvent[] (adapted from the standard model).
 */
export function useEconomicCalendar(filter: CalendarFilter = "ALL") {
  const swr = useSWR(
    "v10:economic-calendar:upcoming",
    async () => {
      const events = await economicCalendarApi.getUpcomingEvents();
      return events.map(toCalendarEvent);
    },
    {
      refreshInterval: REFRESH,
      revalidateOnFocus: true,
      keepPreviousData: true,
      shouldRetryOnError: true,
      errorRetryCount: 2,
    },
  );

  const events = (swr.data ?? []).filter((e) =>
    filter === "ALL" ? true : e.currency === filter,
  );

  return {
    events,
    allEvents: swr.data ?? [],
    isLoading: swr.isLoading,
    isValidating: swr.isValidating,
    error: swr.error as Error | undefined,
    offline: typeof navigator !== "undefined" ? !navigator.onLine : false,
    refresh: swr.mutate,
    providerId: economicCalendarApi.getProviderId(),
  };
}

export function useUpcomingEvents() {
  const swr = useSWR(
    "v10:economic-calendar:upcoming-raw",
    () => economicCalendarApi.getUpcomingEvents(),
    { refreshInterval: REFRESH, keepPreviousData: true },
  );

  return {
    events: (swr.data ?? []) as EconomicEvent[],
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    refresh: swr.mutate,
  };
}

export function useHistoricalNews(newsId: string | null) {
  const swr = useSWR(
    newsId ? `v10:economic-calendar:historical:${newsId}` : null,
    () => economicCalendarApi.getHistoricalEvents(newsId!),
    { refreshInterval: REFRESH * 5, keepPreviousData: true },
  );

  return {
    events: (swr.data ?? []) as HistoricalEconomicEvent[],
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    refresh: swr.mutate,
  };
}

export function useLatestRelease(newsId: string | null) {
  const swr = useSWR(
    newsId ? `v10:economic-calendar:latest:${newsId}` : null,
    () => economicCalendarApi.getLatestResult(newsId!),
    { refreshInterval: REFRESH, keepPreviousData: true },
  );

  return {
    event: (swr.data ?? null) as EconomicEvent | null,
    calendarEvent: swr.data ? toCalendarEvent(swr.data) : null,
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    refresh: swr.mutate,
  };
}

export type { CalendarEvent };
