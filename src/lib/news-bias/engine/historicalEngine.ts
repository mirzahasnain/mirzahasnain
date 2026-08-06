import historicalMovesJson from "./data/historicalMoves.json";
import { TRADING_PAIRS } from "../pairs";
import type { NewsEventId, PairId } from "../types/interfaces";
import type {
  HistoricalMovesConfig,
  HistoricalSnapshot,
} from "./types";

const HISTORICAL = historicalMovesJson as HistoricalMovesConfig;

const HIGHLIGHT_ORDER: PairId[] = [
  "XAUUSD",
  "XAGUSD",
  "BTCUSD",
  "EURUSD",
  "USDJPY",
];

export function getHistoricalMoves(
  config: HistoricalMovesConfig = HISTORICAL,
): HistoricalMovesConfig {
  return config;
}

export function getHistoricalSnapshot(
  newsId: NewsEventId,
  pairId: PairId,
  config: HistoricalMovesConfig = HISTORICAL,
): HistoricalSnapshot | null {
  const row = config[newsId];
  if (!row) return null;

  const selected = row.pairs[pairId] ?? null;
  const highlights = HIGHLIGHT_ORDER.flatMap((id) => {
    const stat = row.pairs[id];
    if (!stat) return [];
    const pair = TRADING_PAIRS.find((p) => p.id === id);
    return [
      {
        pairId: id,
        name: pair?.displayName ?? id,
        averageMove: stat.averageMove,
        unit: stat.unit,
        winRate: stat.winRate,
      },
    ];
  });

  return {
    label: row.label,
    sampleSize: row.sampleSize,
    averageMove: selected?.averageMove ?? null,
    unit: selected?.unit ?? null,
    winRate: selected?.winRate ?? null,
    highlights,
  };
}

export { HISTORICAL as defaultHistoricalMoves };
