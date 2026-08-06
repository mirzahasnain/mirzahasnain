import { CALENDAR_STORAGE } from "../config";
import type { HistoricalResult } from "../types";

/**
 * User-saved historical prints (from live/manual releases).
 * Seed data still comes from the provider's historical.json.
 */
function read(): HistoricalResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE.historical);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as HistoricalResult[]) : [];
  } catch {
    return [];
  }
}

function write(items: HistoricalResult[]): HistoricalResult[] {
  if (typeof window === "undefined") return items;
  window.localStorage.setItem(CALENDAR_STORAGE.historical, JSON.stringify(items));
  return items;
}

export function loadLocalHistorical(): HistoricalResult[] {
  return read();
}

export function saveHistoricalResult(entry: HistoricalResult): HistoricalResult[] {
  const current = read().filter((h) => h.id !== entry.id);
  return write([entry, ...current]);
}

export function mergeHistorical(
  seed: HistoricalResult[],
  local: HistoricalResult[] = read(),
): HistoricalResult[] {
  const map = new Map<string, HistoricalResult>();
  for (const row of seed) map.set(row.id, row);
  for (const row of local) map.set(row.id, row);
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function searchHistorical(
  rows: HistoricalResult[],
  query: string,
): HistoricalResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.eventKey.toLowerCase().includes(q) ||
      r.currency.toLowerCase().includes(q) ||
      r.date.includes(q),
  );
}
