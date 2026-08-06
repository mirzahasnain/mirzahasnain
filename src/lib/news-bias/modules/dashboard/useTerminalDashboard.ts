"use client";

import { useEffect, useMemo, useState } from "react";
import { useCountdown, useEconomicCalendar } from "../../calendar";
import { decisionEngine } from "../../engine";
import { buildHistoricalIntelligence } from "../../engine/historicalIntelligence";
import { buildCoachBriefing } from "../alerts/coach";
import {
  buildNewsChecklist,
  buildMiniChart,
  estimateVolatility,
  getSessionStatus,
  toImpactMeterLevel,
} from "../analytics";
import {
  buildHeatmap,
  buildLiveFeed,
  buildMarketBias,
  buildTopCards,
} from "../dashboard";
import { buildEventPlaybook } from "../playbook";
import {
  loadPreferences,
  savePreferences,
  toggleFavoriteNews,
  toggleWatchAsset,
} from "../preferences";
import { getPinnedAssets } from "../watchlist";
import type { NewsEventId } from "../../types/interfaces";
import type { UserPreferences, WatchAssetId } from "../types";

/**
 * Composition hook for the Version 9 terminal.
 * Keeps UI free of business logic; works offline from cached SWR/calendar data.
 */
export function useTerminalDashboard() {
  const { events, isLoading, error, offline, refresh } =
    useEconomicCalendar("ALL");
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setPrefs(loadPreferences());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const pinned = useMemo(
    () => (prefs ? getPinnedAssets(prefs) : []),
    [prefs],
  );

  const topCards = useMemo(() => buildTopCards(events, now), [events, now]);
  const bias = useMemo(() => buildMarketBias(events, now), [events, now]);
  const heatmap = useMemo(() => buildHeatmap(bias), [bias]);
  const feed = useMemo(
    () => buildLiveFeed(events, pinned, now),
    [events, pinned, now],
  );

  const focusEvent = useMemo(() => {
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
  }, [events, now]);

  const countdown = useCountdown(focusEvent?.releaseAt ?? null);
  const session = useMemo(() => getSessionStatus(new Date(now)), [now]);

  const decision = useMemo(() => {
    if (!focusEvent) return null;
    const newsId = (focusEvent.eventKey || "cpi") as NewsEventId;
    // Only run decision for known USD news ids; fall back to CPI mapping.
    try {
      return decisionEngine.decide({
        newsId: isKnownNews(newsId) ? newsId : "cpi",
        currency: focusEvent.currency,
        forecast: focusEvent.forecast,
        previous: focusEvent.previous,
        actual: focusEvent.actual,
        outcome:
          focusEvent.actual === null && focusEvent.forecast === null
            ? "positive"
            : null,
        pairId: "XAUUSD",
      });
    } catch {
      return null;
    }
  }, [focusEvent]);

  const impactLevel = toImpactMeterLevel(decision?.surprise.impact ?? "high");
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
      buildNewsChecklist({
        session,
        impact: impactLevel,
        isHighImpact: true,
        minutesToRelease,
      }),
    [session, impactLevel, minutesToRelease],
  );

  const playbook = useMemo(() => {
    if (!decision) return null;
    return buildEventPlaybook({
      pairId: "XAUUSD",
      action: decision.action,
      pairDirection: decision.pairDirection,
      strength: decision.surprise.strength,
      impact: decision.surprise.impact,
    });
  }, [decision]);

  const historical = useMemo(() => {
    if (!decision || !focusEvent) return null;
    const newsId = isKnownNews(focusEvent.eventKey as NewsEventId)
      ? (focusEvent.eventKey as NewsEventId)
      : "cpi";
    const intel = buildHistoricalIntelligence({
      newsId,
      surprise: decision.surprise.difference,
      surpriseSign: decision.surprise.sign,
      newsLabel: focusEvent.name,
    });
    if (!intel) return null;
    return {
      newsId: intel.newsId,
      newsLabel: intel.newsLabel,
      sampleSize: intel.sampleSize,
      surprise: intel.surprise,
      surpriseSign: intel.surpriseSign,
      band: intel.band,
      confidenceScore: intel.confidenceScore,
      summary: intel.summary,
      assets: intel.assets,
      matches: [],
      timeline: [],
      chart: intel.chart,
    };
  }, [decision, focusEvent]);

  const coach = useMemo(
    () =>
      buildCoachBriefing({
        bias,
        volatility,
        historical,
        eventLabel: focusEvent?.name ?? null,
        isReleased: Boolean(focusEvent?.isReleased),
      }),
    [bias, volatility, historical, focusEvent],
  );

  const miniCharts = useMemo(
    () =>
      pinned.map((asset) =>
        buildMiniChart(
          asset.id,
          asset.label,
          asset.id === "gold"
            ? bias.gold
            : asset.id === "silver"
              ? bias.silver
              : asset.id === "btc"
                ? bias.crypto
                : asset.id === "nasdaq"
                  ? bias.indices
                  : bias.usd === "bullish"
                    ? "bearish"
                    : bias.usd === "bearish"
                      ? "bullish"
                      : "neutral",
        ),
      ),
    [pinned, bias],
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
    isLoading,
    error: error as Error | undefined,
    offline,
    refresh,
    events,
    topCards,
    bias,
    heatmap,
    feed,
    focusEvent,
    countdown,
    session,
    impactLevel,
    volatility,
    checklist,
    playbook,
    coach,
    miniCharts,
    decision,
    historical,
    pinned,
  };
}

const KNOWN_NEWS = new Set([
  "cpi",
  "core-cpi",
  "ppi",
  "core-ppi",
  "nfp",
  "unemployment-rate",
  "interest-rate-decision",
  "fomc-statement",
  "ism-manufacturing-pmi",
  "ism-services-pmi",
  "gdp",
  "retail-sales",
  "core-pce",
]);

function isKnownNews(id: NewsEventId): boolean {
  return KNOWN_NEWS.has(id);
}
