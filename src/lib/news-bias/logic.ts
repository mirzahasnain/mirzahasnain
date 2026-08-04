import { findEvent } from "./news";
import { findPair } from "./pairs";
import {
  decisionEngine,
  listPairDirections,
  type DecisionResult,
} from "./engine";
import type {
  Analysis,
  AnalysisRequest,
  ReleaseValues,
  SurpriseReading,
} from "./types/interfaces";

/**
 * Composition root for the analysis UI.
 * Delegates all intelligence to the Version 7 Smart Decision Engine.
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

  return {
    event,
    pair,
    values,
    surprise: toSurpriseReading(decision),
    usdDirection: decision.usdDirection,
    pairDirection: decision.pairDirection,
    action: decision.action,
    affectedAssets: listPairDirections(decision.usdDirection, pair.id),
    playbook: decision.playbook,
    historical: decision.historical,
    riskWarning: decision.riskWarning,
    summary: decision.summary,
    reason: decision.summary.reason,
    analysisLines: decision.explanation,
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
