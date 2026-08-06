import { decisionEngine } from "../../engine";
import type { CalendarEvent } from "../../calendar/types";
import type { NewsEventId } from "../../types/interfaces";
import { pairIdForWatchAsset } from "../preferences";
import type { WatchAsset, WatchBiasRow } from "../types";

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

/**
 * One-click analysis for pinned watchlist assets against today's focus event.
 * No extra taps — returns bias + confidence per asset.
 */
export function buildOneClickAnalysis(
  event: CalendarEvent | null,
  pinned: WatchAsset[],
): { rows: WatchBiasRow[]; confidence: number; eventLabel: string | null } {
  if (!event || pinned.length === 0) {
    return { rows: [], confidence: 0, eventLabel: null };
  }

  const newsId = resolveNewsId(event.eventKey);
  const outcome =
    event.actual === null && event.forecast === null ? "positive" : null;

  try {
    const primary = decisionEngine.decide({
      newsId,
      currency: event.currency,
      forecast: event.forecast,
      previous: event.previous,
      actual: event.actual,
      outcome,
      pairId: pairIdForWatchAsset(pinned[0].id),
    });

    const rows: WatchBiasRow[] = pinned.map((asset) => {
      const pairId = pairIdForWatchAsset(asset.id);
      const bias = primary.pairBiases[pairId] ?? "neutral";
      const action =
        bias === "bullish" ? "buy" : bias === "bearish" ? "sell" : "wait";
      return {
        assetId: asset.id,
        label: asset.label,
        bias,
        confidence: primary.confidence.score,
        action,
      };
    });

    return {
      rows,
      confidence: primary.confidence.score,
      eventLabel: event.name,
    };
  } catch {
    return { rows: [], confidence: 0, eventLabel: event.name };
  }
}

function resolveNewsId(eventKey: string): NewsEventId {
  return KNOWN_NEWS.has(eventKey) ? (eventKey as NewsEventId) : "cpi";
}
