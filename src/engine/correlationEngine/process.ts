import correlationJson from "./data/correlationRules.json";
import type { BiasDirection } from "../shared/types";
import type {
  CorrelationInput,
  CorrelationLink,
  CorrelationMove,
  CorrelationResult,
} from "./types";

interface CorrelationConfig {
  whenUsdRises: Record<string, CorrelationMove>;
  whenUsdFalls: Record<string, CorrelationMove>;
  displayOrder: string[];
  labels: Record<string, string>;
  alignmentBonus: number;
  misalignmentPenalty: number;
}

const CONFIG = correlationJson as CorrelationConfig;

function mapForUsd(usd: BiasDirection): Record<string, CorrelationMove> | null {
  if (usd === "bullish") return CONFIG.whenUsdRises;
  if (usd === "bearish") return CONFIG.whenUsdFalls;
  return null;
}

function moveToBias(move: CorrelationMove): BiasDirection {
  if (move === "up") return "bullish";
  if (move === "down") return "bearish";
  return "neutral";
}

export function processCorrelation(input: CorrelationInput): CorrelationResult {
  const map = mapForUsd(input.usdDirection);
  const links: CorrelationLink[] = CONFIG.displayOrder.map((pairId) => ({
    pairId,
    label: CONFIG.labels[pairId] ?? pairId,
    move: map?.[pairId] ?? "flat",
  }));

  const selectedMove = map?.[input.selectedPairId] ?? "flat";
  let alignmentScore = 50;
  if (input.usdDirection === "neutral") alignmentScore = 45;
  else if (selectedMove === "up" || selectedMove === "down") {
    alignmentScore = CONFIG.alignmentBonus;
  } else {
    alignmentScore = CONFIG.misalignmentPenalty;
  }

  const pairDirection =
    input.usdDirection === "neutral" ? "neutral" : moveToBias(selectedMove);

  return {
    usdDirection: input.usdDirection,
    pairDirection,
    links,
    alignmentScore,
    affectedAssets: links.filter((l) => l.move !== "flat"),
  };
}

/** USD bias from news rule + surprise sign. */
export function resolveUsdBias(
  interpretation: "higher_is_usd_bullish" | "higher_is_usd_bearish",
  surpriseSign: "positive" | "negative" | "flat",
): BiasDirection {
  if (surpriseSign === "flat") return "neutral";
  const higherBullish = interpretation === "higher_is_usd_bullish";
  if (surpriseSign === "positive") return higherBullish ? "bullish" : "bearish";
  return higherBullish ? "bearish" : "bullish";
}
