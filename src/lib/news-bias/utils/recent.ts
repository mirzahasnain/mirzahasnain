import { RECENT_COPY, RECENT_LIMIT } from "../constants";
import type { HistoryEntry, RecentGroup } from "../types/interfaces";

const DAY_MS = 86_400_000;
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

/** The newest few analyses, grouped under Today / Yesterday / a date. */
export function groupRecent(
  entries: HistoryEntry[],
  now: number = Date.now(),
): RecentGroup[] {
  const groups: RecentGroup[] = [];

  for (const entry of entries.slice(0, RECENT_LIMIT)) {
    const label = describeDay(entry.savedAt, now);
    const current = groups.at(-1);

    if (current && current.label === label) {
      current.entries.push(entry);
    } else {
      groups.push({ label, entries: [entry] });
    }
  }

  return groups;
}

function describeDay(timestamp: number, now: number): string {
  const days = daysApart(timestamp, now);
  if (days <= 0) return RECENT_COPY.today;
  if (days === 1) return RECENT_COPY.yesterday;

  return new Date(timestamp).toLocaleDateString(undefined, DATE_FORMAT);
}

function daysApart(from: number, to: number): number {
  return Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);
}

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
