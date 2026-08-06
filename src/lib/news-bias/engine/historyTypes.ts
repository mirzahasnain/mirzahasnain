import type { NewsEventId, SurpriseSign } from "../types/interfaces";

/** USD bias implied by a historical release. */
export type HistoricalUsdDirection = "usd_bullish" | "usd_bearish" | "neutral";

/** One past release row from /data/history/*.json */
export interface HistoricalReleaseRecord {
  date: string;
  forecast: number;
  actual: number;
  previous: number;
  surprise: number;
  gold_move: number;
  silver_move: number;
  eurusd_move: number;
  gbpusd_move: number;
  btc_move: number;
  eth_move: number;
  nasdaq_move: number;
  us30_move: number;
  direction: HistoricalUsdDirection;
}

/** Tracked markets in the historical database. */
export type HistoryAssetKey =
  | "gold"
  | "silver"
  | "eurusd"
  | "gbpusd"
  | "btc"
  | "eth"
  | "nasdaq"
  | "us30";

export interface HistoryAssetMeta {
  key: HistoryAssetKey;
  /** Field on HistoricalReleaseRecord */
  field: keyof HistoricalReleaseRecord;
  label: string;
  unit: "points" | "pips" | "percent";
  /** Pair id in the analysis tool when applicable. */
  pairId?: string;
}

export interface SimilarMatch {
  record: HistoricalReleaseRecord;
  /** 0-100 similarity confidence. */
  score: number;
  surpriseDelta: number;
}

export interface AssetVoteStats {
  key: HistoryAssetKey;
  label: string;
  unit: string;
  down: number;
  up: number;
  flat: number;
  /** Bearish probability 0-100 (down moves). */
  bearishProbability: number;
  /** Bullish probability 0-100 (up moves). */
  bullishProbability: number;
  averageMove: number;
  averageAbsMove: number;
}

export interface HistoricalIntelligence {
  newsId: NewsEventId;
  newsLabel: string;
  sampleSize: number;
  surprise: number | null;
  surpriseSign: SurpriseSign;
  /** Band used for the similar-event search. */
  band: { min: number; max: number } | null;
  matches: SimilarMatch[];
  assets: AssetVoteStats[];
  /** Newest → oldest timeline (full series, not only matches). */
  timeline: HistoricalReleaseRecord[];
  /** Chart series for forecast / previous / actual / surprise. */
  chart: {
    dates: string[];
    forecast: number[];
    previous: number[];
    actual: number[];
    surprise: number[];
  };
  summary: string[];
  /** Overall similarity confidence for the cohort. */
  confidenceScore: number;
}

export interface SimilarityQuery {
  newsId: NewsEventId;
  surprise: number | null;
  surpriseSign: SurpriseSign;
  /** Optional override; defaults to adaptive band around |surprise|. */
  bandPadding?: number;
  limit?: number;
}

export interface HistoryApi {
  listNewsIds(): Promise<NewsEventId[]>;
  getReleases(newsId: NewsEventId): Promise<HistoricalReleaseRecord[]>;
  findSimilar(query: SimilarityQuery): Promise<SimilarMatch[]>;
}
