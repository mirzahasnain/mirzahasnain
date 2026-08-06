import { HISTORY_ASSETS } from "./historyConfig";
import type {
  AssetVoteStats,
  HistoricalReleaseRecord,
  HistoryAssetKey,
  SimilarMatch,
} from "./historyTypes";

/**
 * Statistics engine — average moves and up/down tallies from similar releases.
 */
export function computeAssetStatistics(
  matches: SimilarMatch[],
): AssetVoteStats[] {
  const records = matches.map((m) => m.record);
  return HISTORY_ASSETS.map((asset) => {
    const moves = records.map((r) => Number(r[asset.field]));
    let up = 0;
    let down = 0;
    let flat = 0;
    let sum = 0;
    let absSum = 0;

    for (const move of moves) {
      sum += move;
      absSum += Math.abs(move);
      if (move > 0) up += 1;
      else if (move < 0) down += 1;
      else flat += 1;
    }

    const n = moves.length || 1;
    return {
      key: asset.key,
      label: asset.label,
      unit: unitLabel(asset.unit),
      up,
      down,
      flat,
      bearishProbability: 0, // filled by probabilityEngine
      bullishProbability: 0,
      averageMove: round(sum / n, asset.unit === "percent" ? 2 : 1),
      averageAbsMove: round(absSum / n, asset.unit === "percent" ? 2 : 1),
    };
  });
}

export function formatAverageMove(stat: {
  averageMove: number;
  unit: string;
}): string {
  const abs = Math.abs(stat.averageMove);
  if (stat.unit === "%") return `${abs.toFixed(1)}%`;
  if (stat.unit === "pips") return `${abs} Pips`;
  return `${abs} Points`;
}

function unitLabel(unit: "points" | "pips" | "percent"): string {
  if (unit === "percent") return "%";
  return unit;
}

function round(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

export function getAssetMove(
  record: HistoricalReleaseRecord,
  key: HistoryAssetKey,
): number {
  const meta = HISTORY_ASSETS.find((a) => a.key === key);
  if (!meta) return 0;
  return Number(record[meta.field]);
}
