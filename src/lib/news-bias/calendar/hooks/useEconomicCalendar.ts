"use client";

import useSWR from "swr";
import { CALENDAR_CONFIG } from "../config";
import type {
  CalendarEvent,
  CalendarFilter,
  EventDetail,
  EventKey,
  HistoricalResult,
} from "../types";
import { economicCalendar } from "../../services/economicCalendar";
import {
  loadLocalHistorical,
  mergeHistorical,
  searchHistorical,
} from "../utils/historicalStore";

const REFRESH = CALENDAR_CONFIG.refreshIntervalMs;

async function fetchCalendar(): Promise<CalendarEvent[]> {
  return economicCalendar.listHighImpact();
}

async function fetchEvent(id: string): Promise<CalendarEvent | null> {
  return economicCalendar.getEvent(id);
}

async function fetchDetail(eventKey: EventKey): Promise<EventDetail | null> {
  return economicCalendar.getEventDetail(eventKey);
}

async function fetchHistory(eventKey?: EventKey): Promise<HistoricalResult[]> {
  const seed = await economicCalendar.listHistory(eventKey);
  return mergeHistorical(seed, loadLocalHistorical());
}

export function useEconomicCalendar(filter: CalendarFilter = "ALL") {
  const swr = useSWR("economic-calendar:high-impact", fetchCalendar, {
    refreshInterval: REFRESH,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });

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
  };
}

export function useCalendarEvent(id: string | null) {
  const swr = useSWR(
    id ? `economic-calendar:event:${id}` : null,
    () => fetchEvent(id!),
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
    () => fetchDetail(eventKey!),
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
    () => fetchHistory(eventKey ?? undefined),
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
