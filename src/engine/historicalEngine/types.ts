export interface HistoricalInput {
  newsId: string;
  pairId: string;
  surpriseSign: "positive" | "negative" | "flat";
}

export interface HistoricalAssetStat {
  averageMove: number;
  unit: string;
  winRate: number;
  sampleSize: number;
}

export interface HistoricalResult {
  newsId: string;
  pairId: string;
  sampleSize: number;
  label: string;
  matchCount: number;
  winRate: number;
  averageMove: number;
  unit: string;
  historicalMatchScore: number;
  cohortConfidence: number;
  summary: {
    similarReleases: number;
    favorableMoves: number;
    directionHint: "up" | "down" | "flat";
  };
}
