/**
 * Extension points for versions after the MVP. Everything here is an
 * unimplemented stub so later versions can plug in a calendar feed, API,
 * or model output without reshaping the V1 UI or bias logic.
 */
import type { BiasVerdict, NewsEventId, PairId } from "./types";

export type CalendarEntry = {
  eventId: NewsEventId;
  releaseAt: string;
  forecast?: number;
  previous?: number;
  actual?: number;
};

export type BiasInsight = {
  /** Confidence that the bias plays out, 0-1. */
  probability?: number;
  /** Expected move for the pair, e.g. "35-60 pips". */
  expectedMove?: string;
  /** Narrative written by a model. */
  analysis?: string;
};

export type NewsBiasProvider = {
  fetchCalendar?: () => Promise<CalendarEntry[]>;
  fetchInsight?: (verdict: BiasVerdict) => Promise<BiasInsight>;
  fetchQuote?: (pairId: PairId) => Promise<number>;
};

export const newsBiasProvider: NewsBiasProvider = {};

export const ROADMAP = [
  "Live economic calendar",
  "Market data API",
  "AI analysis",
  "Probability score",
  "Expected move",
] as const;
