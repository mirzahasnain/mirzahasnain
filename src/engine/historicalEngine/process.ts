import historicalJson from "./data/historicalMoves.json";
import { toBrainEventId } from "../shared/eventIdAliases";
import { clamp } from "../shared/math";
import type { HistoricalInput, HistoricalResult } from "./types";

interface PairStat {
  averageMove: number;
  unit: string;
  winRate: number;
}

interface NewsStats {
  sampleSize: number;
  label: string;
  pairs: Record<string, PairStat>;
}

const DATA = historicalJson as Record<string, NewsStats>;

export function processHistorical(input: HistoricalInput): HistoricalResult {
  const newsId = toBrainEventId(input.newsId);
  const news = DATA[newsId] ?? DATA[input.newsId];
  if (!news) {
    return {
      newsId: input.newsId,
      pairId: input.pairId,
      sampleSize: 0,
      label: "Limited history",
      matchCount: 0,
      winRate: 0.5,
      averageMove: 0,
      unit: "points",
      historicalMatchScore: 35,
      cohortConfidence: 30,
      summary: {
        similarReleases: 0,
        favorableMoves: 0,
        directionHint: "flat",
      },
    };
  }

  const pair = news.pairs[input.pairId] ?? {
    averageMove: 0,
    unit: "points",
    winRate: 50,
  };

  // Config stores winRate as 0–100 percentage.
  const winRatePct = pair.winRate > 1 ? pair.winRate : pair.winRate * 100;
  const winRateFraction = winRatePct / 100;
  const matchCount = news.sampleSize;
  const favorableMoves = Math.round(winRateFraction * matchCount);
  const historicalMatchScore = clamp(
    Math.round(winRatePct * 0.7 + Math.min(matchCount, 10) * 3),
    0,
    100,
  );
  const cohortConfidence = clamp(
    Math.round(40 + Math.min(matchCount, 12) * 4 + winRateFraction * 20),
    0,
    100,
  );

  const directionHint: HistoricalResult["summary"]["directionHint"] =
    input.surpriseSign === "flat" ? "flat" : pair.averageMove >= 0 ? "up" : "down";

  return {
    newsId: input.newsId,
    pairId: input.pairId,
    sampleSize: news.sampleSize,
    label: news.label,
    matchCount,
    winRate: winRateFraction,
    averageMove: pair.averageMove,
    unit: pair.unit,
    historicalMatchScore,
    cohortConfidence,
    summary: {
      similarReleases: matchCount,
      favorableMoves,
      directionHint,
    },
  };
}
