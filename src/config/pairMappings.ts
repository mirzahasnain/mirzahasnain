/**
 * Canonical pair / asset catalog (PRD Appendix K).
 */
export const PAIR_IDS = [
  "XAUUSD",
  "XAGUSD",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "NZDUSD",
  "USDCAD",
  "USDCHF",
  "BTCUSD",
  "ETHUSD",
  "NAS100",
  "US30",
  "SPX500",
] as const;

export type ConfigPairId = (typeof PAIR_IDS)[number];

export type UsdRelation = "direct" | "inverse";
export type PairCategory = "metal" | "forex" | "crypto" | "index";

export interface PairMapping {
  id: ConfigPairId;
  label: string;
  displayName: string;
  category: PairCategory;
  usdRelation: UsdRelation;
  assetKey: string;
}

export const PAIR_MAPPINGS: readonly PairMapping[] = [
  {
    id: "XAUUSD",
    label: "XAUUSD",
    displayName: "Gold",
    category: "metal",
    usdRelation: "inverse",
    assetKey: "gold",
  },
  {
    id: "XAGUSD",
    label: "XAGUSD",
    displayName: "Silver",
    category: "metal",
    usdRelation: "inverse",
    assetKey: "silver",
  },
  {
    id: "EURUSD",
    label: "EURUSD",
    displayName: "EURUSD",
    category: "forex",
    usdRelation: "inverse",
    assetKey: "eurusd",
  },
  {
    id: "GBPUSD",
    label: "GBPUSD",
    displayName: "GBPUSD",
    category: "forex",
    usdRelation: "inverse",
    assetKey: "gbpusd",
  },
  {
    id: "USDJPY",
    label: "USDJPY",
    displayName: "USDJPY",
    category: "forex",
    usdRelation: "direct",
    assetKey: "usdjpy",
  },
  {
    id: "AUDUSD",
    label: "AUDUSD",
    displayName: "AUDUSD",
    category: "forex",
    usdRelation: "inverse",
    assetKey: "audusd",
  },
  {
    id: "NZDUSD",
    label: "NZDUSD",
    displayName: "NZDUSD",
    category: "forex",
    usdRelation: "inverse",
    assetKey: "nzdusd",
  },
  {
    id: "USDCAD",
    label: "USDCAD",
    displayName: "USDCAD",
    category: "forex",
    usdRelation: "direct",
    assetKey: "usdcad",
  },
  {
    id: "USDCHF",
    label: "USDCHF",
    displayName: "USDCHF",
    category: "forex",
    usdRelation: "direct",
    assetKey: "usdchf",
  },
  {
    id: "BTCUSD",
    label: "BTCUSD",
    displayName: "Bitcoin",
    category: "crypto",
    usdRelation: "inverse",
    assetKey: "btc",
  },
  {
    id: "ETHUSD",
    label: "ETHUSD",
    displayName: "Ethereum",
    category: "crypto",
    usdRelation: "inverse",
    assetKey: "eth",
  },
  {
    id: "NAS100",
    label: "NAS100",
    displayName: "NASDAQ",
    category: "index",
    usdRelation: "inverse",
    assetKey: "nasdaq",
  },
  {
    id: "US30",
    label: "US30",
    displayName: "US30",
    category: "index",
    usdRelation: "inverse",
    assetKey: "us30",
  },
  {
    id: "SPX500",
    label: "SPX500",
    displayName: "S&P 500",
    category: "index",
    usdRelation: "inverse",
    assetKey: "spx",
  },
] as const;

export const DEFAULT_WATCHLIST: ConfigPairId[] = ["XAUUSD", "XAGUSD", "BTCUSD", "EURUSD"];

export function getPairMapping(id: string): PairMapping | undefined {
  return PAIR_MAPPINGS.find((p) => p.id === id);
}
