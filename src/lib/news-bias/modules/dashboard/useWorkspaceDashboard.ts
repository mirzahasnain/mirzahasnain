"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useCountdown, useEconomicCalendar } from "../../calendar";
import { loadHistory } from "../../utils/history";
import {
  estimateVolatility,
  getSessionStatus,
  toImpactMeterLevel,
} from "../analytics";
import {
  buildMarketBias,
  buildMarketStatus,
  buildOneClickAnalysis,
  buildTradeChecklist,
  buildTopCards,
} from "../dashboard";
import {
  addJournalEntry,
  deleteJournalEntry,
  loadJournal,
  type JournalDraft,
} from "../journal";
import {
  clearNotifications,
  loadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  syncNotificationsFromCalendar,
  unreadCount,
} from "../notifications";
import {
  loadPreferences,
  savePreferences,
  toggleFavoriteAsset,
  toggleFavoriteNews,
  toggleFavoriteStrategy,
  toggleWatchAsset,
} from "../preferences";
import { searchWorkspace } from "../search";
import { getPinnedAssets } from "../watchlist";
import type { NewsEventId } from "../../types/interfaces";
import type {
  TradeJournalEntry,
  UserPreferences,
  WatchAssetId,
  WorkspaceNotification,
} from "../types";

/**
 * TradeImpact workspace composition hook (Version 11).
 * Components stay free of storage / decision wiring.
 */
export function useWorkspaceDashboard() {
  const { events, isLoading, error, offline, refresh } =
    useEconomicCalendar("ALL");
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [journal, setJournal] = useState<TradeJournalEntry[]>([]);
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [, startTransition] = useTransition();

  useEffect(() => {
    setPrefs(loadPreferences());
    setJournal(loadJournal());
    setNotifications(loadNotifications());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!prefs || events.length === 0) return;
    setNotifications(syncNotificationsFromCalendar(events, prefs, now));
  }, [prefs, events, now]);

  const pinned = useMemo(
    () => (prefs ? getPinnedAssets(prefs) : []),
    [prefs],
  );

  const topCards = useMemo(() => buildTopCards(events, now), [events, now]);
  const bias = useMemo(() => buildMarketBias(events, now), [events, now]);

  const focusEvent = useMemo(() => {
    if (selectedEventId) {
      return events.find((e) => e.id === selectedEventId) ?? null;
    }
    const upcoming = events
      .filter((e) => new Date(e.releaseAt).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime(),
      )[0];
    return (
      upcoming ??
      [...events]
        .filter((e) => e.isReleased)
        .sort(
          (a, b) =>
            new Date(b.releaseAt).getTime() - new Date(a.releaseAt).getTime(),
        )[0] ??
      null
    );
  }, [events, now, selectedEventId]);

  const todayEvents = useMemo(() => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return events
      .filter((e) => {
        const t = new Date(e.releaseAt).getTime();
        return t >= start.getTime() && t < end.getTime();
      })
      .sort(
        (a, b) =>
          new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime(),
      );
  }, [events, now]);

  const countdown = useCountdown(focusEvent?.releaseAt ?? null);
  const session = useMemo(() => getSessionStatus(new Date(now)), [now]);
  const marketStatus = useMemo(() => buildMarketStatus(session), [session]);

  const oneClick = useMemo(
    () => buildOneClickAnalysis(focusEvent, pinned),
    [focusEvent, pinned],
  );

  const impactLevel = toImpactMeterLevel(
    focusEvent?.impact === "high"
      ? "high"
      : focusEvent?.impact === "medium"
        ? "medium"
        : "low",
  );

  const minutesToRelease = focusEvent
    ? (new Date(focusEvent.releaseAt).getTime() - now) / 60_000
    : null;

  const volatility = useMemo(
    () =>
      estimateVolatility({
        impact: impactLevel,
        minutesToRelease,
        isReleased: Boolean(focusEvent?.isReleased),
        session,
      }),
    [impactLevel, minutesToRelease, focusEvent?.isReleased, session],
  );

  const checklist = useMemo(
    () =>
      buildTradeChecklist({
        session,
        volatility,
        isHighImpact: (focusEvent?.impact ?? "high") === "high",
        minutesToRelease,
        isReleased: Boolean(focusEvent?.isReleased),
      }),
    [session, volatility, focusEvent, minutesToRelease],
  );

  const [recentAnalysis, setRecentAnalysis] = useState(() =>
    typeof window === "undefined" ? [] : loadHistory().slice(0, 6),
  );

  useEffect(() => {
    setRecentAnalysis(loadHistory().slice(0, 6));
  }, [journal.length, now]);

  const searchHits = useMemo(
    () => searchWorkspace(searchQuery),
    [searchQuery],
  );

  const updatePrefs = (next: UserPreferences) => {
    setPrefs(savePreferences(next));
  };

  return {
    prefs,
    updatePrefs,
    toggleWatch: (id: WatchAssetId) => {
      if (!prefs) return;
      setPrefs(toggleWatchAsset(prefs, id));
    },
    toggleNewsFavorite: (id: NewsEventId) => {
      if (!prefs) return;
      setPrefs(toggleFavoriteNews(prefs, id));
    },
    toggleAssetFavorite: (id: WatchAssetId) => {
      if (!prefs) return;
      setPrefs(toggleFavoriteAsset(prefs, id));
    },
    toggleStrategyFavorite: (strategy: string) => {
      if (!prefs) return;
      setPrefs(toggleFavoriteStrategy(prefs, strategy));
    },
    isLoading,
    error: error as Error | undefined,
    offline,
    refresh,
    events,
    todayEvents,
    topCards,
    bias,
    focusEvent,
    selectEvent: (id: string) => {
      startTransition(() => setSelectedEventId(id));
    },
    countdown,
    session,
    marketStatus,
    oneClick,
    checklist,
    volatility,
    pinned,
    recentAnalysis,
    journal,
    addJournal: (draft: JournalDraft) => {
      setJournal(addJournalEntry(draft));
    },
    removeJournal: (id: string) => {
      setJournal(deleteJournalEntry(id));
    },
    notifications,
    unread: unreadCount(notifications),
    markRead: (id: string) => setNotifications(markNotificationRead(id)),
    markAllRead: () => setNotifications(markAllNotificationsRead()),
    clearNotes: () => setNotifications(clearNotifications()),
    searchQuery,
    setSearchQuery,
    searchHits,
  };
}
