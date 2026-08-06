import { HISTORY_LIMIT, HISTORY_STORAGE_KEY } from "../constants";
import { NEWS_EVENTS } from "../news";
import { TRADING_PAIRS } from "../pairs";
import type { HistoryEntry, HistoryValues } from "../types/interfaces";

export function loadHistory(): HistoryEntry[] {
  const raw = read();
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

/** Prepends an entry, skipping an exact repeat of the newest one. */
export function saveToHistory(values: HistoryValues): HistoryEntry[] {
  const existing = loadHistory();
  const newest = existing[0];
  if (newest && isSameRelease(newest, values)) return existing;

  const entry: HistoryEntry = {
    ...values,
    id: createId(),
    savedAt: Date.now(),
  };
  const next = [entry, ...existing].slice(0, HISTORY_LIMIT);

  write(JSON.stringify(next));
  return next;
}

export function clearHistory(): HistoryEntry[] {
  remove();
  return [];
}

function isSameRelease(entry: HistoryEntry, values: HistoryValues): boolean {
  return (
    entry.eventId === values.eventId &&
    entry.pairId === values.pairId &&
    entry.outcome === values.outcome &&
    entry.forecast === values.forecast &&
    entry.previous === values.previous &&
    entry.actual === values.actual
  );
}

const OUTCOMES = ["positive", "negative", "flat"];

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  const hasShape =
    typeof record.id === "string" &&
    typeof record.savedAt === "number" &&
    NEWS_EVENTS.some((event) => event.id === record.eventId) &&
    TRADING_PAIRS.some((pair) => pair.id === record.pairId) &&
    isNullableNumber(record.forecast) &&
    isNullableNumber(record.previous) &&
    isNullableNumber(record.actual) &&
    (record.outcome === null ||
      (typeof record.outcome === "string" && OUTCOMES.includes(record.outcome)));

  if (!hasShape) return false;

  // An entry is only reopenable if it still carries enough to rebuild a result.
  return (
    record.outcome !== null ||
    (record.forecast !== null && record.actual !== null)
  );
}

function isNullableNumber(value: unknown): boolean {
  return value === null || typeof value === "number";
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function read(): string | null {
  try {
    return window.localStorage.getItem(HISTORY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function write(value: string): void {
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, value);
  } catch {
    // Storage can be full or blocked; history is a convenience, not a feature.
  }
}

function remove(): void {
  try {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // Ignore: nothing to clean up if storage is unavailable.
  }
}
