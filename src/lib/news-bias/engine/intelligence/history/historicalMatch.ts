import type { HistoricalIntelligence } from "../../historyTypes";
import type { PairId } from "../../../types/interfaces";
import type { HistoricalMatchSnapshot } from "../types";

const PRIMARY_ASSETS = [
  { key: "gold", pairId: "XAUUSD", fallbackLabel: "Gold", fallbackUnit: "points" },
  { key: "eurusd", pairId: "EURUSD", fallbackLabel: "EURUSD", fallbackUnit: "pips" },
  { key: "silver", pairId: "XAGUSD", fallbackLabel: "Silver", fallbackUnit: "points" },
  { key: "btc", pairId: "BTCUSD", fallbackLabel: "BTC", fallbackUnit: "%" },
] as const;

/**
 * Historical match adapter — similar releases + average asset moves.
 */
export function buildHistoricalMatch(
  intel: HistoricalIntelligence | null,
  selectedPairId: PairId,
): HistoricalMatchSnapshot {
  const similarOf = 10;
  if (!intel || intel.sampleSize === 0) {
    return {
      similarFound: 0,
      similarOf,
      averageMoves: [],
      winRatePct: null,
    };
  }

  const similarFound = Math.min(similarOf, intel.matches.length || intel.sampleSize);

  const averageMoves = PRIMARY_ASSETS.map((meta) => {
    const asset = intel.assets.find((a) => a.key === meta.key);
    return {
      pairId: meta.pairId,
      label: asset?.label ?? meta.fallbackLabel,
      averageMove: Math.round(Math.abs(asset?.averageAbsMove ?? asset?.averageMove ?? 0)),
      unit: asset?.unit ?? meta.fallbackUnit,
    };
  }).filter((row) => row.averageMove > 0);

  const selectedKey =
    PRIMARY_ASSETS.find((a) => a.pairId === selectedPairId)?.key ?? "gold";
  const selected = intel.assets.find((a) => a.key === selectedKey);
  const winRatePct = selected
    ? Math.max(selected.bearishProbability, selected.bullishProbability)
    : intel.confidenceScore;

  return {
    similarFound,
    similarOf,
    averageMoves,
    winRatePct,
  };
}

export function historicalMatchScore(
  match: HistoricalMatchSnapshot,
  cohortConfidence: number | null,
): number {
  if (match.similarFound === 0) return cohortConfidence ?? 35;
  const coverage = (match.similarFound / match.similarOf) * 100;
  const win = match.winRatePct ?? 50;
  const cohort = cohortConfidence ?? win;
  return Math.round(coverage * 0.35 + win * 0.35 + cohort * 0.3);
}
