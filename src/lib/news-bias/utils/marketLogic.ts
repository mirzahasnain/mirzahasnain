import { TRADING_PAIRS } from "../pairs";
import type {
  AffectedAsset,
  Direction,
  PairId,
  SurpriseSign,
  SurpriseStrength,
  TradeAction,
  TradingPair,
} from "../types/interfaces";

const OPPOSITE: Record<Direction, Direction> = {
  bullish: "bearish",
  bearish: "bullish",
  neutral: "neutral",
};

export function getUsdDirection(sign: SurpriseSign): Direction {
  if (sign === "positive") return "bullish";
  if (sign === "negative") return "bearish";
  return "neutral";
}

/**
 * The asset mapping engine. Each pair declares its relationship to the dollar
 * in `pairs.ts` (`direct` for USD-base pairs, `inverse` for everything quoted
 * in or priced in dollars), so a new market is a data row, not a code change.
 */
export function getPairDirection(
  pair: TradingPair,
  usdDirection: Direction,
): Direction {
  return pair.usdRelation === "direct" ? usdDirection : OPPOSITE[usdDirection];
}

/** Every tracked market, inverse pairs first so the two blocks read together. */
export function getAffectedAssets(
  usdDirection: Direction,
  selectedId: PairId | null,
): AffectedAsset[] {
  const toAsset = (pair: TradingPair): AffectedAsset => ({
    id: pair.id,
    name: pair.displayName,
    direction: getPairDirection(pair, usdDirection),
    isSelected: pair.id === selectedId,
  });

  return [
    ...TRADING_PAIRS.filter((pair) => pair.usdRelation === "inverse"),
    ...TRADING_PAIRS.filter((pair) => pair.usdRelation === "direct"),
  ].map(toAsset);
}

/**
 * A direction alone is not a trade: a surprise inside the neutral band is too
 * small to act on, so the engine recommends waiting.
 */
export function getTradeAction(
  pairDirection: Direction,
  strength: SurpriseStrength,
): TradeAction {
  if (pairDirection === "neutral" || strength === "neutral") return "wait";
  return pairDirection === "bullish" ? "buy" : "sell";
}

export function getAssetsByDirection(
  assets: AffectedAsset[],
  direction: Direction,
): AffectedAsset[] {
  return assets.filter((asset) => asset.direction === direction);
}
