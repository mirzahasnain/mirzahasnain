import type { Direction, NewsEventId, PairId, Theme } from "../types/interfaces";

export type BiasTone = Direction;

export type SessionId = "asian" | "london" | "newyork" | "overlap" | "off";

export type LiquidityLevel = "low" | "medium" | "high" | "very-high";

export type HeatTone = "strong" | "weak" | "neutral";

export type ImpactMeterLevel =
  | "very-low"
  | "low"
  | "medium"
  | "high"
  | "extreme";

export type VolatilityBand = "low" | "moderate" | "elevated" | "extreme";

export type WatchAssetId =
  | "gold"
  | "silver"
  | "btc"
  | "eurusd"
  | "gbpusd"
  | "nasdaq";

export interface WatchAsset {
  id: WatchAssetId;
  label: string;
  pairId: PairId;
  category: "metal" | "crypto" | "forex" | "index";
}

export interface UserPreferences {
  favoriteAssets: WatchAssetId[];
  favoriteNews: NewsEventId[];
  theme: Theme;
  notifications: {
    enabled: boolean;
    minutesBefore: number[];
  };
  watchlist: WatchAssetId[];
}

export interface MarketBiasSnapshot {
  usd: BiasTone;
  gold: BiasTone;
  silver: BiasTone;
  crypto: BiasTone;
  indices: BiasTone;
  updatedAt: string;
  sourceEventLabel: string | null;
}

export interface HeatmapCell {
  id: string;
  label: string;
  tone: HeatTone;
  bias: BiasTone;
}

export interface SessionStatus {
  session: SessionId;
  label: string;
  liquidity: LiquidityLevel;
  description: string;
  utcHour: number;
}

export interface VolatilityReading {
  current: VolatilityBand;
  expected: VolatilityBand;
  postNews: VolatilityBand;
  score: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  ok: boolean;
  hint: string;
}

export interface PlaybookPhase {
  id: "before" | "release" | "confirmation";
  title: string;
  action: string;
}

export interface EventTradePlaybook {
  assetLabel: string;
  phases: PlaybookPhase[];
  target: string;
  risk: "Low" | "Medium" | "High";
  waitSeconds: number;
}

export interface CoachBriefing {
  marketCondition: string;
  risk: string;
  fakeMove: string;
  expectedVolatility: string;
  historicalBehavior: string;
  lines: string[];
}

export interface LiveFeedItem {
  id: string;
  timeLabel: string;
  releaseAt: string;
  name: string;
  status: "upcoming" | "released";
  forecast: number | null;
  previous: number | null;
  actual: number | null;
  surprise: number | null;
  assetBiases: { label: string; bias: BiasTone }[];
}

export interface DashboardTopCards {
  todayHighImpact: number;
  upcomingEvent: {
    id: string;
    name: string;
    releaseAt: string;
    currency: string;
  } | null;
  marketSentiment: BiasTone;
  sentimentLabel: string;
}

export interface MiniChartPoint {
  t: number;
  v: number;
}

export interface MiniChartSeries {
  assetId: WatchAssetId;
  label: string;
  points: MiniChartPoint[];
  changePct: number;
}
