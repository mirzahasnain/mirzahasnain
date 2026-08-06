import { ACTION_LABELS, DIRECTION_LABELS } from "../constants";
import { TRADING_PAIRS } from "../pairs";
import type {
  Direction,
  PairId,
  SurpriseStrength,
  TradeAction,
} from "../types/interfaces";
import { getImpactLevels } from "./surpriseEngine";
import type {
  ExpectedMoveResult,
  ImpactLevelsConfig,
  NewsRule,
  SurpriseResult,
  TradePlaybook,
} from "./types";

export function resolveExpectedMove(
  pairId: PairId,
  strength: SurpriseStrength,
  impactLevels: ImpactLevelsConfig = getImpactLevels(),
): ExpectedMoveResult | null {
  if (strength === "neutral") {
    return {
      label: "Limited",
      min: 0,
      max: 0,
      unit: impactLevels.expectedMoves[pairId]?.unit ?? "points",
      isExtreme: false,
    };
  }

  const bands = impactLevels.expectedMoves[pairId];
  if (!bands) return null;

  const band = bands[strength];
  const isExtreme = strength === "extreme";

  return {
    label: isExtreme && band.extremeLabel ? band.extremeLabel : band.label,
    min: band.min,
    max: band.max,
    unit: bands.unit,
    isExtreme,
  };
}

export function buildPlaybook(input: {
  pairId: PairId;
  pairDirection: Direction;
  action: TradeAction;
  confidence: number;
  rule: NewsRule;
  surprise: SurpriseResult;
  usdDirection: Direction;
  impactLevels?: ImpactLevelsConfig;
}): TradePlaybook {
  const pair = TRADING_PAIRS.find((p) => p.id === input.pairId);
  const displayName = pair?.displayName ?? input.pairId;
  const expectedMove = resolveExpectedMove(
    input.pairId,
    input.surprise.strength,
    input.impactLevels,
  );

  return {
    pairId: input.pairId,
    pairLabel: pair?.label ?? input.pairId,
    displayName,
    direction: input.action,
    bias: input.pairDirection,
    confidence: input.confidence,
    reason: buildPlaybookReason({
      displayName,
      rule: input.rule,
      surprise: input.surprise,
      usdDirection: input.usdDirection,
      pairDirection: input.pairDirection,
      action: input.action,
    }),
    expectedMove,
  };
}

function buildPlaybookReason(input: {
  displayName: string;
  rule: NewsRule;
  surprise: SurpriseResult;
  usdDirection: Direction;
  pairDirection: Direction;
  action: TradeAction;
}): string {
  const { rule, surprise, usdDirection, pairDirection, action, displayName } =
    input;

  if (action === "wait") {
    if (surprise.sign === "flat") {
      return `${rule.label} matched the forecast, so there is no edge to trade on ${displayName}.`;
    }
    return `The ${rule.label} surprise is too small to act on — waiting on ${displayName} is preferred.`;
  }

  const tone =
    surprise.sign === "positive" ? rule.higherLabel : rule.lowerLabel;
  const usd =
    usdDirection === "bullish"
      ? "supports the US Dollar"
      : "weighs on the US Dollar";

  if (rule.toneMode === "hawkish_dovish") {
    return `A ${tone.toLowerCase()} ${rule.label} ${usd}. ${displayName} is therefore ${DIRECTION_LABELS[pairDirection].toLowerCase()} — ${ACTION_LABELS[action]} bias.`;
  }

  if (surprise.sign === "positive") {
    const qualifier =
      surprise.strength === "strong" || surprise.strength === "extreme"
        ? "Stronger-than-expected"
        : surprise.strength === "weak"
          ? "Slightly higher-than-expected"
          : "Higher-than-expected";
    return `${qualifier} ${rule.label} ${usd}. ${displayName} leans ${DIRECTION_LABELS[pairDirection].toLowerCase()}.`;
  }

  const qualifier =
    surprise.strength === "strong" || surprise.strength === "extreme"
      ? "Weaker-than-expected"
      : surprise.strength === "weak"
        ? "Slightly lower-than-expected"
        : "Lower-than-expected";
  return `${qualifier} ${rule.label} ${usd}. ${displayName} leans ${DIRECTION_LABELS[pairDirection].toLowerCase()}.`;
}
