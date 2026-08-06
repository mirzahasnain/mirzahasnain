import type { HistoricalIntelligenceView } from "../../types/interfaces";
import type { VolatilityReading } from "../types";
import type { CoachBriefing, MarketBiasSnapshot } from "../types";
import { VOLATILITY_LABELS } from "../analytics";

/**
 * AI Trading Coach — explains conditions instead of barking BUY/SELL.
 */
export function buildCoachBriefing(input: {
  bias: MarketBiasSnapshot;
  volatility: VolatilityReading;
  historical: HistoricalIntelligenceView | null;
  eventLabel: string | null;
  isReleased: boolean;
}): CoachBriefing {
  const event = input.eventLabel ?? "the next high-impact release";
  const usd =
    input.bias.usd === "bullish"
      ? "USD is in a bid tone"
      : input.bias.usd === "bearish"
        ? "USD is offered"
        : "USD bias is balanced";

  const marketCondition = input.isReleased
    ? `Post-release: ${usd} after ${event}. Gold ${input.bias.gold}, crypto ${input.bias.crypto}, indices ${input.bias.indices}.`
    : `Pre-release: market is positioning around ${event}. ${usd}; gold sits ${input.bias.gold} vs that USD tone.`;

  const risk =
    input.volatility.expected === "extreme" ||
    input.volatility.expected === "elevated"
      ? "Risk is elevated into/through the print — cut size and widen invalidation."
      : "Risk is manageable if size respects session liquidity and spread.";

  const fakeMove =
    "Expect a possible fake spike both ways in the first seconds. Do not chase the opening tick.";

  const expectedVolatility = `Expected volatility: ${VOLATILITY_LABELS[input.volatility.expected]}. Post-news: ${VOLATILITY_LABELS[input.volatility.postNews]}.`;

  const historicalBehavior = input.historical && input.historical.sampleSize > 0
    ? input.historical.summary[0] ??
      `Historically, ${input.historical.sampleSize} similar releases informed this bias.`
    : "Historical sample is thin for this surprise profile — lean on risk controls.";

  return {
    marketCondition,
    risk,
    fakeMove,
    expectedVolatility,
    historicalBehavior,
    lines: [
      marketCondition,
      risk,
      fakeMove,
      expectedVolatility,
      historicalBehavior,
    ],
  };
}
