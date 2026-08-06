import { ACTION_LABELS, DIRECTION_LABELS } from "../constants";
import type { Direction, SurpriseSign } from "../types/interfaces";
import type {
  ConfidenceResult,
  HistoricalSnapshot,
  NewsRule,
  SurpriseResult,
  TradePlaybook,
} from "./types";
import { formatConfidence } from "../utils/calculateConfidence";
import { formatNumber, formatSurprise } from "../utils/calculateSurprise";

/** Builds the 3–5 sentence AI-style explanation. No external API. */
export function buildExplanation(input: {
  rule: NewsRule;
  surprise: SurpriseResult;
  usdDirection: Direction;
  playbook: TradePlaybook;
  confidence: ConfidenceResult;
  forecast: number | null;
  actual: number | null;
}): string[] {
  const { rule, surprise, usdDirection, playbook, confidence, forecast, actual } = input;
  const lines: string[] = [];

  lines.push(buildLead(rule, surprise, forecast, actual));
  lines.push(buildPolicyLine(rule, surprise, usdDirection));
  lines.push(buildPairLine(playbook, usdDirection));

  if (playbook.expectedMove && playbook.direction !== "wait") {
    lines.push(
      `Expected reaction for ${playbook.displayName}: ${playbook.expectedMove.label}${playbook.expectedMove.isExtreme ? " (extreme)" : ""}.`,
    );
  }

  lines.push(
    `Confidence is ${confidenceBucket(confidence.score)} at ${formatConfidence(confidence.score)}.`,
  );

  return lines.slice(0, 5);
}

function buildLead(
  rule: NewsRule,
  surprise: SurpriseResult,
  forecast: number | null,
  actual: number | null,
): string {
  if (surprise.sign === "flat") {
    return `Today's ${rule.label} matched market expectations.`;
  }

  if (rule.toneMode === "hawkish_dovish") {
    const tone = surprise.sign === "positive" ? "hawkish" : "dovish";
    return `Today's ${rule.label} was interpreted as ${tone} relative to expectations.`;
  }

  const verb = surprise.sign === "positive" ? "exceeded" : "fell short of";

  if (forecast !== null && actual !== null) {
    return `Today's ${rule.label} ${verb} market expectations (${formatNumber(actual)} vs ${formatNumber(forecast)}${surprise.difference !== null ? `, surprise ${formatSurprise(surprise.difference)}` : ""}).`;
  }

  return `Today's ${rule.label} ${verb} market expectations.`;
}

function buildPolicyLine(
  rule: NewsRule,
  surprise: SurpriseResult,
  usdDirection: Direction,
): string {
  if (surprise.sign === "flat" || usdDirection === "neutral") {
    return "With no clear surprise, rate-path expectations are largely unchanged.";
  }

  if (rule.interpretation === "higher_is_usd_bearish") {
    return surprise.sign === "positive"
      ? "A higher reading typically softens growth expectations and weighs on the US Dollar."
      : "A lower reading typically supports growth expectations and strengthens the US Dollar.";
  }

  if (rule.toneMode === "hawkish_dovish") {
    return surprise.sign === "positive"
      ? "Hawkish guidance strengthens expectations of tighter monetary policy, which supports the US Dollar."
      : "Dovish guidance strengthens expectations of easier policy, which weighs on the US Dollar.";
  }

  return surprise.sign === "positive"
    ? "The stronger print strengthens expectations of tighter monetary policy, which is generally supportive of the US Dollar."
    : "The softer print strengthens expectations of easier monetary policy, which is generally negative for the US Dollar.";
}

function buildPairLine(playbook: TradePlaybook, usdDirection: Direction): string {
  if (playbook.direction === "wait") {
    return `${playbook.displayName} has no actionable edge from this release.`;
  }

  const pressure =
    playbook.bias === "bearish"
      ? "remain under bearish pressure"
      : "remain under bullish pressure";

  return `${playbook.displayName} is therefore expected to ${pressure} while the USD stays ${DIRECTION_LABELS[usdDirection].toLowerCase()}. Recommendation: ${ACTION_LABELS[playbook.direction]} ${playbook.displayName}.`;
}

function confidenceBucket(score: number): string {
  if (score >= 85) return "High";
  if (score >= 70) return "Elevated";
  if (score >= 55) return "Moderate";
  return "Low";
}

export function buildSummaryReason(input: {
  rule: NewsRule;
  surprise: SurpriseResult;
  usdDirection: Direction;
  playbook: TradePlaybook;
}): string {
  if (input.playbook.direction === "wait") return input.playbook.reason;

  const usd = input.usdDirection === "bullish" ? "Strong USD" : "Soft USD";
  const tone =
    input.surprise.sign === "positive"
      ? input.rule.higherLabel.toLowerCase()
      : input.rule.lowerLabel.toLowerCase();

  if (input.rule.toneMode === "hawkish_dovish") {
    return `${usd} after ${tone} ${input.rule.label}.`;
  }

  const surpriseWord = input.surprise.sign === "positive" ? "positive" : "negative";
  return `${usd} after ${surpriseWord} ${input.rule.label} surprise.`;
}

export function formatRecommendation(playbook: TradePlaybook): string {
  if (playbook.direction === "wait") {
    return `WAIT ${playbook.displayName.toUpperCase()}`;
  }
  return `${ACTION_LABELS[playbook.direction]} ${playbook.displayName.toUpperCase()}`;
}

export function describeHistorical(
  historical: HistoricalSnapshot | null,
  displayName: string,
): string | null {
  if (!historical || historical.averageMove === null) return null;
  return `${historical.label}: average ${displayName} move ${historical.averageMove} ${historical.unit}, win rate ${historical.winRate}%.`;
}

/** Maps a raw surprise sign through the news rule into USD direction. */
export function usdDirectionFromRule(rule: NewsRule, sign: SurpriseSign): Direction {
  if (sign === "flat") return "neutral";

  const bullishOnPositive =
    rule.interpretation === "higher_is_usd_bullish" ||
    rule.interpretation === "hawkish_is_usd_bullish";

  if (bullishOnPositive) {
    return sign === "positive" ? "bullish" : "bearish";
  }

  // higher_is_usd_bearish (e.g. Unemployment Rate)
  return sign === "positive" ? "bearish" : "bullish";
}
