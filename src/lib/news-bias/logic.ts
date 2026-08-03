import { findEvent } from "./news";
import { findPair } from "./pairs";
import type {
  Analysis,
  AnalysisContext,
  AnalysisRequest,
  ReleaseValues,
  SurpriseReading,
} from "./types/interfaces";
import { calculateConfidence } from "./utils/calculateConfidence";
import { calculateStrength, getExpectedImpact } from "./utils/calculateStrength";
import {
  calculateSurprise,
  getSurpriseSign,
} from "./utils/calculateSurprise";
import {
  buildAnalysisLines,
  buildReason,
} from "./utils/analysisGenerator";
import {
  getAffectedAssets,
  getPairDirection,
  getTradeAction,
  getUsdDirection,
} from "./utils/marketLogic";

/**
 * Composition root of the decision engine: turns a news event, a pair and the
 * three release numbers into a complete analysis. Returns null while the
 * selection is incomplete, so the UI has a single truth for "no result yet".
 */
export function buildAnalysis(request: AnalysisRequest): Analysis | null {
  const event = findEvent(request.eventId);
  const pair = findPair(request.pairId);
  if (!event || !pair) return null;
  if (request.forecast === null || request.actual === null) return null;

  const values: ReleaseValues = {
    forecast: request.forecast,
    previous: request.previous,
    actual: request.actual,
  };

  const surprise = readSurprise(values);
  const usdDirection = getUsdDirection(surprise.sign);
  const pairDirection = getPairDirection(pair, usdDirection);

  const context: AnalysisContext = {
    event,
    pair,
    values,
    surprise,
    usdDirection,
    pairDirection,
    action: getTradeAction(pairDirection, surprise.strength),
    affectedAssets: getAffectedAssets(usdDirection, pair.id),
  };

  return {
    ...context,
    reason: buildReason(context),
    analysisLines: buildAnalysisLines(context),
  };
}

export function readSurprise(values: ReleaseValues): SurpriseReading {
  const value = calculateSurprise(values.actual, values.forecast);
  const strength = calculateStrength(value);

  return {
    value,
    magnitude: Math.abs(value),
    sign: getSurpriseSign(value),
    strength,
    impact: getExpectedImpact(strength),
    confidence: calculateConfidence(strength),
  };
}
