import { findEvent } from "./news";
import { findPair, TRADING_PAIRS } from "./pairs";
import type {
  AffectedAsset,
  Bias,
  BiasAnalysis,
  BiasVerdict,
  Confidence,
  DeviationSize,
  ImpactStrength,
  NewsEvent,
  NewsEventId,
  PairId,
  ReleaseOutcome,
  TradingPair,
} from "./types";

/**
 * V1 rule set: every listed release is a USD indicator, so a beat is dollar
 * positive and a miss is dollar negative. Pair direction then follows the
 * pair's relationship to the dollar.
 */
export function getUsdBias(outcome: ReleaseOutcome): Bias {
  return outcome === "above" ? "bullish" : "bearish";
}

export function getPairBias(pair: TradingPair, outcome: ReleaseOutcome): Bias {
  const usdBias = getUsdBias(outcome);
  const followsUsd = pair.usdRelation === "direct";
  const isBullish = followsUsd ? usdBias === "bullish" : usdBias === "bearish";
  return isBullish ? "bullish" : "bearish";
}

export const DEVIATION_SIZES: DeviationSize[] = [
  "inline",
  "small",
  "medium",
  "large",
];

const STRENGTH_BY_DEVIATION: Record<DeviationSize, ImpactStrength> = {
  inline: "weak",
  small: "moderate",
  medium: "strong",
  large: "very-strong",
};

const CONFIDENCE_BY_STRENGTH: Record<ImpactStrength, Confidence> = {
  weak: "low",
  moderate: "medium",
  strong: "high",
  "very-strong": "very-high",
};

/**
 * How far the actual landed from the forecast drives how hard the market is
 * expected to react. V2 takes the deviation from a manual selection; a later
 * version can derive it from real actual and forecast values.
 */
export function getImpactStrength(deviation: DeviationSize): ImpactStrength {
  return STRENGTH_BY_DEVIATION[deviation];
}

export function getConfidence(strength: ImpactStrength): Confidence {
  return CONFIDENCE_BY_STRENGTH[strength];
}

export function getBiasVerdict(
  eventId: NewsEventId | null,
  pairId: PairId | null,
  outcome: ReleaseOutcome | null,
): BiasVerdict | null {
  const event = findEvent(eventId);
  const pair = findPair(pairId);
  if (!event || !pair || !outcome) return null;

  return {
    event,
    pair,
    outcome,
    usdBias: getUsdBias(outcome),
    pairBias: getPairBias(pair, outcome),
    rationale: buildRationale(event, pair, outcome),
  };
}

export function getBiasAnalysis(
  eventId: NewsEventId | null,
  pairId: PairId | null,
  outcome: ReleaseOutcome | null,
  deviation: DeviationSize,
): BiasAnalysis | null {
  const verdict = getBiasVerdict(eventId, pairId, outcome);
  if (!verdict) return null;

  const strength = getImpactStrength(deviation);

  return {
    ...verdict,
    deviation,
    strength,
    confidence: getConfidence(strength),
    reason: buildReason(verdict.event, verdict.outcome),
    explanation: buildExplanation(verdict.event, verdict.pair, verdict.outcome),
    affectedAssets: getAffectedAssets(verdict.outcome, verdict.pair.id),
  };
}

/** Every tracked market, inverse pairs first so the two blocks read together. */
export function getAffectedAssets(
  outcome: ReleaseOutcome,
  selectedId: PairId | null,
): AffectedAsset[] {
  const toAsset = (pair: TradingPair): AffectedAsset => ({
    id: pair.id,
    name: pair.displayName,
    bias: getPairBias(pair, outcome),
    isSelected: pair.id === selectedId,
  });

  return [
    ...TRADING_PAIRS.filter((pair) => pair.usdRelation === "inverse"),
    ...TRADING_PAIRS.filter((pair) => pair.usdRelation === "direct"),
  ].map(toAsset);
}

export function buildReason(
  event: NewsEvent,
  outcome: ReleaseOutcome,
): string {
  return outcome === "above"
    ? `USD is expected to strengthen after a stronger-than-forecast ${event.label} release.`
    : `USD is expected to weaken after a weaker-than-forecast ${event.label} release.`;
}

export function buildExplanation(
  event: NewsEvent,
  pair: TradingPair,
  outcome: ReleaseOutcome,
): string[] {
  const dollar = outcome === "above" ? "A stronger USD" : "A weaker USD";
  const pairBias = getPairBias(pair, outcome);
  const effect =
    pairBias === "bullish" ? "lifts" : "pressures";
  const direction = pairBias === "bullish" ? "higher" : "lower";

  return [
    event.explanation[outcome],
    `${dollar} normally ${effect} ${pair.displayName} ${direction}.`,
  ];
}

function buildRationale(
  event: NewsEvent,
  pair: TradingPair,
  outcome: ReleaseOutcome,
): string {
  const release =
    outcome === "above"
      ? `A stronger-than-forecast ${event.label} print is dollar positive.`
      : `A weaker-than-forecast ${event.label} print is dollar negative.`;

  return `${release} ${describeRelation(pair)}`;
}

function describeRelation(pair: TradingPair): string {
  if (pair.usdRelation === "direct") {
    return `${pair.label} has USD as its base currency, so it moves with the dollar.`;
  }
  if (pair.category === "crypto" || pair.category === "index") {
    return `${pair.label} is a dollar-priced risk asset, so it moves against the dollar.`;
  }
  return `${pair.label} is quoted against USD, so it moves against the dollar.`;
}
