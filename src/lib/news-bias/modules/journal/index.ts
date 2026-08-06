import type { PairId } from "../../types/interfaces";
import type { TradeJournalEntry, TradeJournalResult } from "../types";

export const JOURNAL_STORAGE_KEY = "news-bias:trade-journal:v1";
export const JOURNAL_LIMIT = 100;

export type JournalDraft = {
  pairId: PairId;
  newsLabel?: string | null;
  entry?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  result?: TradeJournalResult;
  profitLoss?: number | null;
  notes?: string;
};

export function loadJournal(): TradeJournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isJournalEntry).slice(0, JOURNAL_LIMIT);
  } catch {
    return [];
  }
}

export function saveJournal(entries: TradeJournalEntry[]): TradeJournalEntry[] {
  const next = entries.slice(0, JOURNAL_LIMIT);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function addJournalEntry(draft: JournalDraft): TradeJournalEntry[] {
  const now = Date.now();
  const entry: TradeJournalEntry = {
    id: `tj-${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
    pairId: draft.pairId,
    newsLabel: draft.newsLabel ?? null,
    entry: draft.entry ?? null,
    stopLoss: draft.stopLoss ?? null,
    takeProfit: draft.takeProfit ?? null,
    result: draft.result ?? "open",
    profitLoss: draft.profitLoss ?? null,
    notes: draft.notes?.trim() ?? "",
  };
  return saveJournal([entry, ...loadJournal()]);
}

export function updateJournalEntry(
  id: string,
  patch: Partial<JournalDraft>,
): TradeJournalEntry[] {
  const next = loadJournal().map((row) => {
    if (row.id !== id) return row;
    return {
      ...row,
      pairId: patch.pairId ?? row.pairId,
      newsLabel:
        patch.newsLabel !== undefined ? patch.newsLabel : row.newsLabel,
      entry: patch.entry !== undefined ? patch.entry : row.entry,
      stopLoss: patch.stopLoss !== undefined ? patch.stopLoss : row.stopLoss,
      takeProfit:
        patch.takeProfit !== undefined ? patch.takeProfit : row.takeProfit,
      result: patch.result ?? row.result,
      profitLoss:
        patch.profitLoss !== undefined ? patch.profitLoss : row.profitLoss,
      notes: patch.notes !== undefined ? patch.notes.trim() : row.notes,
      updatedAt: Date.now(),
    };
  });
  return saveJournal(next);
}

export function deleteJournalEntry(id: string): TradeJournalEntry[] {
  return saveJournal(loadJournal().filter((row) => row.id !== id));
}

function isJournalEntry(value: unknown): value is TradeJournalEntry {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.createdAt === "number" &&
    typeof row.pairId === "string" &&
    typeof row.result === "string"
  );
}
