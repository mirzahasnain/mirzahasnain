import correlationJson from "./data/correlationRules.json";
import type { Direction, PairId } from "../../../types/interfaces";
import type {
  CorrelationLink,
  CorrelationMove,
  CorrelationSnapshot,
} from "../types";

interface CorrelationConfig {
  whenUsdRises: Record<string, CorrelationMove>;
  whenUsdFalls: Record<string, CorrelationMove>;
  displayOrder: string[];
  labels: Record<string, string>;
  alignmentBonus: number;
  misalignmentPenalty: number;
}

const CONFIG = correlationJson as CorrelationConfig;

/**
 * Correlation engine — configurable USD → asset relationship map.
 */
export function buildCorrelationSnapshot(
  usdDirection: Direction,
  selectedPairId: PairId,
): CorrelationSnapshot {
  const map =
    usdDirection === "bullish"
      ? CONFIG.whenUsdRises
      : usdDirection === "bearish"
        ? CONFIG.whenUsdFalls
        : null;

  const links: CorrelationLink[] = CONFIG.displayOrder.map((pairId) => ({
    pairId,
    label: CONFIG.labels[pairId] ?? pairId,
    move: map?.[pairId] ?? "flat",
  }));

  const selectedMove = map?.[selectedPairId] ?? "flat";
  let alignmentScore = 50;
  if (usdDirection === "neutral") {
    alignmentScore = 45;
  } else if (selectedMove === "down" || selectedMove === "up") {
    alignmentScore = CONFIG.alignmentBonus;
  } else {
    alignmentScore = CONFIG.misalignmentPenalty;
  }

  return {
    usdDirection,
    links,
    alignmentScore,
  };
}

export function expectedPairDirectionFromCorrelation(
  usdDirection: Direction,
  pairId: PairId,
): Direction {
  if (usdDirection === "neutral") return "neutral";
  const map =
    usdDirection === "bullish" ? CONFIG.whenUsdRises : CONFIG.whenUsdFalls;
  const move = map[pairId];
  if (move === "up") return "bullish";
  if (move === "down") return "bearish";
  return "neutral";
}

export { CONFIG as correlationConfig };
