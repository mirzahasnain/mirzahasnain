/**
 * Extension points for versions after V2. Everything here is an unimplemented
 * stub so later versions can plug in a calendar feed, API, or model output
 * without reshaping the UI or the bias logic.
 */
import type { BiasAnalysis, DeviationSize, NewsEventId, PairId } from "./types";

export interface CalendarEntry {
  eventId: NewsEventId;
  releaseAt: string;
  forecast?: number;
  previous?: number;
  actual?: number;
}

export interface BiasInsight {
  /** Confidence that the bias plays out, 0-1. */
  probability?: number;
  /** Expected move for the pair, e.g. "35-60 pips". */
  expectedMove?: string;
  /** Narrative written by a model. */
  analysis?: string;
}

export interface NewsBiasProvider {
  fetchCalendar?: () => Promise<CalendarEntry[]>;
  fetchInsight?: (analysis: BiasAnalysis) => Promise<BiasInsight>;
  fetchQuote?: (pairId: PairId) => Promise<number>;
  /**
   * Impact strength is picked manually today. Once a release carries real
   * actual and forecast numbers, this turns the surprise into a deviation
   * bucket and the rest of the logic stays unchanged.
   */
  gradeDeviation?: (entry: CalendarEntry) => DeviationSize;
}

export const newsBiasProvider: NewsBiasProvider = {};

export const ROADMAP = [
  "Live economic calendar",
  "Market data API",
  "AI analysis",
  "Probability score",
  "Expected move",
] as const;
