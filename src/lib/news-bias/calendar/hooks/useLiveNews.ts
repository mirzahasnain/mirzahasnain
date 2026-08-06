"use client";

import useSWR from "swr";
import { CALENDAR_CONFIG } from "../config";
import type { DataMode, LiveNewsUpdate } from "../types";
import { liveNews } from "../../services/liveNews";

async function fetchLive(calendarId: string): Promise<LiveNewsUpdate> {
  return liveNews.getActual(calendarId);
}

/**
 * Polls live actuals when mode === "live". No-ops in manual mode.
 * Ready to swap onto a websocket later via LiveNewsProvider.subscribe.
 */
export function useLiveNews(
  calendarId: string | null,
  mode: DataMode,
  enabled = true,
) {
  const active = Boolean(calendarId) && mode === "live" && enabled;

  const swr = useSWR(
    active ? `live-news:${calendarId}` : null,
    () => fetchLive(calendarId!),
    {
      refreshInterval: CALENDAR_CONFIG.livePollIntervalMs,
      revalidateOnFocus: true,
      keepPreviousData: true,
    },
  );

  const update = swr.data;
  const unavailable = Boolean(update?.unavailable) || Boolean(swr.error);

  return {
    actual: update?.actual ?? null,
    updatedAt: update?.updatedAt ?? null,
    unavailable,
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    refresh: swr.mutate,
  };
}
