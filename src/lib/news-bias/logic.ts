import { NEWS_EVENTS, TRADING_PAIRS } from "./constants";
import type {
  Bias,
  BiasVerdict,
  DropdownOption,
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

export function findEvent(id: NewsEventId | null): NewsEvent | null {
  return NEWS_EVENTS.find((event) => event.id === id) ?? null;
}

export function findPair(id: PairId | null): TradingPair | null {
  return TRADING_PAIRS.find((pair) => pair.id === id) ?? null;
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

export const newsEventOptions: DropdownOption<NewsEventId>[] = NEWS_EVENTS.map(
  (event) => ({
    value: event.id,
    label: event.label,
    description: event.description,
  }),
);

export const tradingPairOptions: DropdownOption<PairId>[] = TRADING_PAIRS.map(
  (pair) => ({
    value: pair.id,
    label: pair.label,
    description: pair.description,
  }),
);
