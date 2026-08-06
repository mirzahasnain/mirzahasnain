import type { CalendarEvent } from "../../calendar/types";
import type { Direction, ExpectedImpact } from "../../types/interfaces";
import { getPairBias } from "../../engine/pairMapping";
import type {
  BiasTone,
  DashboardTopCards,
  HeatmapCell,
  LiveFeedItem,
  MarketBiasSnapshot,
  WatchAsset,
} from "../types";

function toBias(direction: Direction): BiasTone {
  return direction;
}

/** Derive USD + asset biases from the nearest high-impact release. */
export function buildMarketBias(
  events: CalendarEvent[],
  now = Date.now(),
): MarketBiasSnapshot {
  const released = [...events]
    .filter((e) => e.isReleased && e.actual !== null && e.forecast !== null)
    .sort(
      (a, b) =>
        new Date(b.releaseAt).getTime() - new Date(a.releaseAt).getTime(),
    );

  const upcoming = [...events]
    .filter((e) => !e.isReleased)
    .sort(
      (a, b) =>
        new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime(),
    );

  const anchor = released[0] ?? upcoming[0] ?? null;
  if (!anchor || anchor.forecast === null) {
    return {
      usd: "neutral",
      gold: "neutral",
      silver: "neutral",
      crypto: "neutral",
      indices: "neutral",
      updatedAt: new Date(now).toISOString(),
      sourceEventLabel: null,
    };
  }

  let usd: BiasTone = "neutral";
  if (anchor.actual !== null) {
    const surprise = anchor.actual - anchor.forecast;
    // Unemployment-style inverse is handled in decision engine; dashboard uses
    // currency heuristic: positive surprise on USD prints → USD bullish.
    if (anchor.eventKey === "unemployment-rate") {
      usd = surprise > 0 ? "bearish" : surprise < 0 ? "bullish" : "neutral";
    } else if (anchor.currency === "USD" || anchor.currency === "CRYPTO") {
      usd = surprise > 0 ? "bullish" : surprise < 0 ? "bearish" : "neutral";
    } else {
      // Non-USD hot print → USD relatively softer
      usd = surprise > 0 ? "bearish" : surprise < 0 ? "bullish" : "neutral";
    }
  } else {
    usd = "neutral";
  }

  return {
    usd,
    gold: toBias(getPairBias("XAUUSD", usd)),
    silver: toBias(getPairBias("XAGUSD", usd)),
    crypto: toBias(getPairBias("BTCUSD", usd)),
    indices: toBias(getPairBias("NAS100", usd)),
    updatedAt: new Date(now).toISOString(),
    sourceEventLabel: anchor.name,
  };
}

export function buildTopCards(
  events: CalendarEvent[],
  now = Date.now(),
): DashboardTopCards {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const todayHighImpact = events.filter((e) => {
    const t = new Date(e.releaseAt).getTime();
    return t >= start.getTime() && t < end.getTime();
  }).length;

  const upcoming = [...events]
    .filter((e) => new Date(e.releaseAt).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime(),
    )[0];

  const bias = buildMarketBias(events, now);
  const sentimentLabel =
    bias.usd === "bullish"
      ? "Risk-off / USD bid"
      : bias.usd === "bearish"
        ? "Risk-on / USD offered"
        : "Balanced / waiting";

  return {
    todayHighImpact,
    upcomingEvent: upcoming
      ? {
          id: upcoming.id,
          name: upcoming.name,
          releaseAt: upcoming.releaseAt,
          currency: upcoming.currency,
        }
      : null,
    marketSentiment: bias.usd,
    sentimentLabel,
  };
}

export function buildLiveFeed(
  events: CalendarEvent[],
  pinned: WatchAsset[],
  now = Date.now(),
): LiveFeedItem[] {
  const biasSnap = buildMarketBias(events, now);
  const pinnedLabels = pinned.map((p) => ({
    label: p.label,
    bias:
      p.id === "gold"
        ? biasSnap.gold
        : p.id === "silver"
          ? biasSnap.silver
          : p.id === "btc"
            ? biasSnap.crypto
            : p.id === "nasdaq"
              ? biasSnap.indices
              : toBias(getPairBias(p.pairId, biasSnap.usd)),
  }));

  return [...events]
    .sort(
      (a, b) =>
        new Date(b.releaseAt).getTime() - new Date(a.releaseAt).getTime(),
    )
    .slice(0, 12)
    .map((event) => {
      const surprise =
        event.actual !== null && event.forecast !== null
          ? event.actual - event.forecast
          : null;
      return {
        id: event.id,
        timeLabel: new Date(event.releaseAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
        releaseAt: event.releaseAt,
        name: event.name,
        status: event.isReleased ? "released" : "upcoming",
        forecast: event.forecast,
        previous: event.previous,
        actual: event.actual,
        surprise,
        assetBiases: pinnedLabels,
      };
    });
}

export function buildHeatmap(bias: MarketBiasSnapshot): HeatmapCell[] {
  const tone = (b: BiasTone, invert = false): HeatmapCell["tone"] => {
    const d = invert ? (b === "bullish" ? "bearish" : b === "bearish" ? "bullish" : "neutral") : b;
    if (d === "bullish") return "strong";
    if (d === "bearish") return "weak";
    return "neutral";
  };

  return [
    { id: "usd", label: "USD", tone: tone(bias.usd), bias: bias.usd },
    { id: "eur", label: "EUR", tone: tone(bias.usd, true), bias: toBias(getPairBias("EURUSD", bias.usd)) },
    { id: "jpy", label: "JPY", tone: tone(getPairBias("USDJPY", bias.usd) === "bullish" ? "bearish" : getPairBias("USDJPY", bias.usd) === "bearish" ? "bullish" : "neutral"), bias: toBias(getPairBias("USDJPY", bias.usd) === "bullish" ? "bearish" : getPairBias("USDJPY", bias.usd) === "bearish" ? "bullish" : "neutral") },
    { id: "gold", label: "Gold", tone: tone(bias.gold), bias: bias.gold },
    { id: "btc", label: "BTC", tone: tone(bias.crypto), bias: bias.crypto },
    { id: "nasdaq", label: "NASDAQ", tone: tone(bias.indices), bias: bias.indices },
  ];
}

export function impactToMeter(impact: ExpectedImpact | null): import("../types").ImpactMeterLevel {
  if (!impact) return "medium";
  if (impact === "very-low") return "very-low";
  if (impact === "low") return "low";
  if (impact === "medium") return "medium";
  if (impact === "high") return "high";
  return "extreme";
}
