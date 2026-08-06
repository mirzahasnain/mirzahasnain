import { CALENDAR_STORAGE } from "../config";
import type { EventKey } from "../types";

function read(): EventKey[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE.favorites);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function write(keys: EventKey[]): EventKey[] {
  if (typeof window === "undefined") return keys;
  window.localStorage.setItem(CALENDAR_STORAGE.favorites, JSON.stringify(keys));
  return keys;
}

export function loadFavoriteEventKeys(): EventKey[] {
  return read();
}

export function isFavoriteEvent(eventKey: EventKey): boolean {
  return read().includes(eventKey);
}

export function toggleFavoriteEvent(eventKey: EventKey): EventKey[] {
  const current = read();
  const next = current.includes(eventKey)
    ? current.filter((k) => k !== eventKey)
    : [...current, eventKey];
  return write(next);
}

/** Default starred catalogue keys for first visit. */
export const DEFAULT_FAVORITE_KEYS: EventKey[] = ["cpi", "nfp", "fomc-statement"];

export function ensureDefaultFavorites(): EventKey[] {
  const current = read();
  if (current.length > 0) return current;
  return write([...DEFAULT_FAVORITE_KEYS]);
}
