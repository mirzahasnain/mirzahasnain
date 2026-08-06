"use client";

/**
 * Calendar-package hooks — thin wrappers over the V10 provider architecture.
 * Existing UI imports stay stable; no component changes required.
 */
import useSWR from "swr";
import {
  useEconomicCalendar as useEconomicCalendarV10,
  useHistoricalNews,
  useLatestRelease,
  useUpcomingEvents,
} from "../../hooks/useEconomicCalendar";
import { economicCalendar } from "../../services/economicCalendar";
import { CALENDAR_CONFIG } from "../config";
import type {
  CalendarFilter,
  EventDetail,
  EventKey,
  HistoricalResult,
} from "../types";
import {
  loadLocalHistorical,
  mergeHistorical,
  searchHistorical,
} from "../utils/historicalStore";

const REFRESH = CALENDAR_CONFIG.refreshIntervalMs;

export function useEconomicCalendar(filter: CalendarFilter = "ALL") {
  return useEconomicCalendarV10(filter);
}

export function useCalendarEvent(id: string | null) {
  const swr = useSWR(
    id ? `economic-calendar:event:${id}` : null,
    () => economicCalendar.getEvent(id!),
    { refreshInterval: REFRESH, keepPreviousData: true },
  );

  return {
    event: swr.data ?? null,
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    refresh: swr.mutate,
  };
}

export function useEventDetail(eventKey: EventKey | null) {
  const swr = useSWR(
    eventKey ? `economic-calendar:detail:${eventKey}` : null,
    () => economicCalendar.getEventDetail(eventKey!),
    { refreshInterval: REFRESH * 5, keepPreviousData: true },
  );

  return {
    detail: swr.data ?? null,
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
  };
}

export function useEventHistory(eventKey?: EventKey | null, query = "") {
  const swr = useSWR(
    `economic-calendar:history:${eventKey ?? "all"}`,
    async () => {
      const seed = await economicCalendar.listHistory(eventKey ?? undefined);
      return mergeHistorical(seed, loadLocalHistorical());
    },
    { refreshInterval: REFRESH * 5, keepPreviousData: true },
  );

  const results = searchHistorical(swr.data ?? [], query);

  return {
    results,
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    refresh: swr.mutate,
  };
}

export { useUpcomingEvents, useHistoricalNews, useLatestRelease };
export type { HistoricalResult, EventDetail };
