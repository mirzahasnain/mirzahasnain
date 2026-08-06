import indexJson from "../data/history/index.json";
import cpi from "../data/history/cpi.json";
import coreCpi from "../data/history/core-cpi.json";
import nfp from "../data/history/nfp.json";
import unemployment from "../data/history/unemployment-rate.json";
import pmi from "../data/history/pmi.json";
import ismServices from "../data/history/ism-services-pmi.json";
import interestRate from "../data/history/interest-rate.json";
import fomc from "../data/history/fomc-statement.json";
import gdp from "../data/history/gdp.json";
import retail from "../data/history/retail-sales.json";
import ppi from "../data/history/ppi.json";
import corePpi from "../data/history/core-ppi.json";
import corePce from "../data/history/core-pce.json";
import type { NewsEventId } from "../types/interfaces";
import type { HistoricalReleaseRecord } from "./historyTypes";

const FILE_MAP = indexJson as Record<string, string>;

/**
 * Static registry — Vite/Next bundles JSON at build time.
 * Replacing this map with a DB fetch is the only change needed later.
 */
const DATA: Record<string, HistoricalReleaseRecord[]> = {
  "cpi.json": cpi as HistoricalReleaseRecord[],
  "core-cpi.json": coreCpi as HistoricalReleaseRecord[],
  "nfp.json": nfp as HistoricalReleaseRecord[],
  "unemployment-rate.json": unemployment as HistoricalReleaseRecord[],
  "pmi.json": pmi as HistoricalReleaseRecord[],
  "ism-services-pmi.json": ismServices as HistoricalReleaseRecord[],
  "interest-rate.json": interestRate as HistoricalReleaseRecord[],
  "fomc-statement.json": fomc as HistoricalReleaseRecord[],
  "gdp.json": gdp as HistoricalReleaseRecord[],
  "retail-sales.json": retail as HistoricalReleaseRecord[],
  "ppi.json": ppi as HistoricalReleaseRecord[],
  "core-ppi.json": corePpi as HistoricalReleaseRecord[],
  "core-pce.json": corePce as HistoricalReleaseRecord[],
};

const cache = new Map<string, HistoricalReleaseRecord[]>();

export function listHistoryNewsIds(): NewsEventId[] {
  return Object.keys(FILE_MAP) as NewsEventId[];
}

export function resolveHistoryFile(newsId: NewsEventId): string | null {
  return FILE_MAP[newsId] ?? null;
}

/** Loads and caches historical releases for a news id (newest first). */
export function loadHistoryReleases(
  newsId: NewsEventId,
): HistoricalReleaseRecord[] {
  const hit = cache.get(newsId);
  if (hit) return hit;

  const file = resolveHistoryFile(newsId);
  if (!file) {
    cache.set(newsId, []);
    return [];
  }

  const rows = [...(DATA[file] ?? [])].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  cache.set(newsId, rows);
  return rows;
}

/** Test helper — clears the in-memory cache. */
export function clearHistoryCache(): void {
  cache.clear();
}

export function buildChartSeries(records: HistoricalReleaseRecord[]) {
  // Chart reads oldest → newest for a natural left-to-right timeline.
  const chronological = [...records].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  return {
    dates: chronological.map((r) => r.date),
    forecast: chronological.map((r) => r.forecast),
    previous: chronological.map((r) => r.previous),
    actual: chronological.map((r) => r.actual),
    surprise: chronological.map((r) => r.surprise),
  };
}
