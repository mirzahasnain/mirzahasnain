import type { HistoryAssetMeta } from "../engine/historyTypes";

/** Markets exposed by the historical intelligence UI and engines. */
export const HISTORY_ASSETS: HistoryAssetMeta[] = [
  { key: "gold", field: "gold_move", label: "Gold", unit: "points", pairId: "XAUUSD" },
  { key: "silver", field: "silver_move", label: "Silver", unit: "points", pairId: "XAGUSD" },
  { key: "btc", field: "btc_move", label: "BTC", unit: "percent", pairId: "BTCUSD" },
  { key: "eth", field: "eth_move", label: "ETH", unit: "percent", pairId: "ETHUSD" },
  { key: "eurusd", field: "eurusd_move", label: "EURUSD", unit: "pips", pairId: "EURUSD" },
  { key: "gbpusd", field: "gbpusd_move", label: "GBPUSD", unit: "pips", pairId: "GBPUSD" },
  { key: "nasdaq", field: "nasdaq_move", label: "NAS100", unit: "points", pairId: "NAS100" },
  { key: "us30", field: "us30_move", label: "US30", unit: "points", pairId: "US30" },
];

export const SIMILARITY_DEFAULTS = {
  /** Max similar events returned. */
  limit: 10,
  /** Minimum absolute padding around today's surprise. */
  minPadding: 0.15,
  /** Relative padding as a fraction of |surprise|. */
  relativePadding: 0.2,
  /** Weights for the similarity confidence score. */
  weights: {
    sameNews: 40,
    sameDirection: 30,
    surpriseProximity: 30,
  },
} as const;
