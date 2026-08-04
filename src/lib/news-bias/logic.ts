import { QUICK_STRENGTH } from "./constants";
import { findEvent } from "./news";
import { findPair } from "./pairs";
import type {
  Analysis,
  AnalysisContext,
  AnalysisRequest,
  ReleaseValues,
  SurpriseReading,
  SurpriseSign,
} from "./types/interfaces";
import { buildAnalysisLines, buildReason } from "./utils/analysisGenerator";
import { calculateConfidence } from "./utils/calculateConfidence";
import { calculateStrength, getExpectedImpact } from "./utils/calculateStrength";
import { calculateSurprise, getSurpriseSign } from "./utils/calculateSurprise";
import {
  getAffectedAssets,
  getPairDirection,
  getTradeAction,
  getUsdDirection,
} from "./utils/marketLogic";

/**
 * Composition root of the decision engine. A tapped outcome is enough for a
 * result; entering the release numbers upgrades that estimate to a measured
 * surprise. Returns null while the selection is incomplete, so the UI has a
 * single truth for "no result yet".
 */
export function buildAnalysis(request: AnalysisRequest): Analysis | null {
  const event = findEvent(request.eventId);
  const pair = findPair(request.pairId);
  if (!event || !pair) return null;

  const values = readValues(request);
  const surprise = values
    ? measureSurprise(values)
    : estimateSurprise(request.outcome);
  if (!surprise) return null;

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

function readValues(request: AnalysisRequest): ReleaseValues | null {
  if (request.forecast === null || request.actual === null) return null;

  return {
    forecast: request.forecast,
    previous: request.previous,
    actual: request.actual,
  };
}

export function measureSurprise(values: ReleaseValues): SurpriseReading {
  const value = calculateSurprise(values.actual, values.forecast);
  return toReading(value, getSurpriseSign(value), calculateStrength(value), false);
}

/** Direction is known from the tap; strength is assumed until numbers arrive. */
export function estimateSurprise(
  sign: SurpriseSign | null,
): SurpriseReading | null {
  if (!sign) return null;
  return toReading(null, sign, sign === "flat" ? "neutral" : QUICK_STRENGTH, true);
}

function toReading(
  value: number | null,
  sign: SurpriseReading["sign"],
  strength: SurpriseReading["strength"],
  isEstimate: boolean,
): SurpriseReading {
  return {
    value,
    sign,
    strength,
    impact: getExpectedImpact(strength),
    confidence: calculateConfidence(strength),
    isEstimate,
  };
}
