import { findEvent } from "./news";
import { findPair } from "./pairs";
import {
  decisionEngine,
  listPairDirections,
  type DecisionResult,
} from "./engine";
import { buildHistoricalIntelligence } from "./engine/historicalIntelligence";
import type {
  Analysis,
  AnalysisRequest,
  HistoricalIntelligenceView,
  ReleaseValues,
  SurpriseReading,
} from "./types/interfaces";

/**
 * Composition root for the analysis UI.
 * Delegates to the Smart Decision Engine + Historical Intelligence Engine.
 */
export function buildAnalysis(request: AnalysisRequest): Analysis | null {
  const event = findEvent(request.eventId);
  const pair = findPair(request.pairId);
  if (!event || !pair) return null;

  const hasNumbers = request.forecast !== null && request.actual !== null;
  if (!hasNumbers && request.outcome === null) return null;

  const decision = decisionEngine.decide({
    newsId: event.id,
    currency: "USD",
    forecast: request.forecast,
    previous: request.previous,
    actual: request.actual,
    outcome: request.outcome,
    pairId: pair.id,
  });

  const values = readValues(request);
  const surprise = toSurpriseReading(decision);
  const historicalIntelligence = toHistoricalView(
    buildHistoricalIntelligence({
      newsId: event.id,
      surprise: surprise.value,
      surpriseSign: surprise.sign,
      newsLabel: event.label,
    }),
  );

  return {
    event,
    pair,
    values,
    surprise,
    usdDirection: decision.usdDirection,
    pairDirection: decision.pairDirection,
    action: decision.action,
    affectedAssets: listPairDirections(decision.usdDirection, pair.id),
    playbook: decision.playbook,
    historical: decision.historical,
    historicalIntelligence,
    riskWarning: decision.riskWarning,
    summary: decision.summary,
    reason: decision.summary.reason,
    analysisLines: mergeExplanations(
      decision.explanation,
      historicalIntelligence?.summary ?? [],
    ),
  };
}

function readValues(request: AnalysisRequest): ReleaseValues | null {
  if (request.forecast === null || request.actual === null) return null;

  return {
    forecast: request.forecast,
    previous: request.previous,
    actual: request.actual,
  };
}

function toSurpriseReading(decision: DecisionResult): SurpriseReading {
  return {
    value: decision.surprise.difference,
    percentage: decision.surprise.percentageSurprise,
    sign: decision.surprise.sign,
    strength: decision.surprise.strength,
    impact: decision.surprise.impact,
    confidence: decision.confidence.score,
    isEstimate: decision.surprise.isEstimate,
  };
}

function toHistoricalView(
  intel: ReturnType<typeof buildHistoricalIntelligence>,
): HistoricalIntelligenceView | null {
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
    matches: intel.matches.map((m) => ({
      date: m.record.date,
      forecast: m.record.forecast,
      actual: m.record.actual,
      previous: m.record.previous,
      surprise: m.record.surprise,
      score: m.score,
      gold_move: m.record.gold_move,
      silver_move: m.record.silver_move,
      eurusd_move: m.record.eurusd_move,
      gbpusd_move: m.record.gbpusd_move,
      btc_move: m.record.btc_move,
      eth_move: m.record.eth_move,
      nasdaq_move: m.record.nasdaq_move,
      us30_move: m.record.us30_move,
      direction: m.record.direction,
    })),
    timeline: intel.timeline,
    chart: intel.chart,
  };
}

/** Prefer decision lines, then append unique historical lines (cap 6). */
function mergeExplanations(decision: string[], historical: string[]): string[] {
  const seen = new Set(decision);
  const extra = historical.filter((line) => !seen.has(line));
  return [...decision, ...extra].slice(0, 6);
}

/** @deprecated Prefer decisionEngine.decide — kept for older call sites / tests. */
export function measureSurprise(values: ReleaseValues): SurpriseReading {
  const decision = decisionEngine.decide({
    newsId: "cpi",
    currency: "USD",
    forecast: values.forecast,
    previous: values.previous,
    actual: values.actual,
    outcome: null,
    pairId: "XAUUSD",
  });
  return toSurpriseReading(decision);
}

/** @deprecated Prefer decisionEngine.decide */
export function estimateSurprise(
  sign: AnalysisRequest["outcome"],
): SurpriseReading | null {
  if (!sign) return null;
  const decision = decisionEngine.decide({
    newsId: "cpi",
    currency: "USD",
    forecast: null,
    previous: null,
    actual: null,
    outcome: sign,
    pairId: "XAUUSD",
  });
  return toSurpriseReading(decision);
}
