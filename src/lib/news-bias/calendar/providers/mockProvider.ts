import type {
  CalendarEvent,
  CalendarMockRow,
  CalendarProvider,
  EventDetail,
  HistoricalResult,
} from "../types";
import { countryToCode } from "../utils/format";
import calendarRows from "../data/calendar.json";
import eventDetails from "../data/events.json";
import historicalRows from "../data/historical.json";

const MOCK_LATENCY_MS = 280;

function delay(ms: number = MOCK_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveRow(row: CalendarMockRow, now: number): CalendarEvent {
  const releaseAt = new Date(now + row.offsetMinutes * 60_000).toISOString();
  const isReleased = row.offsetMinutes <= 0;
  return {
    id: row.id,
    eventKey: row.eventKey,
    country: row.country,
    countryCode: countryToCode(row.country),
    currency: row.currency,
    name: row.name,
    impact: row.impact,
    releaseAt,
    forecast: row.forecast,
    previous: row.previous,
    actual: isReleased ? row.actual : null,
    unit: row.unit,
    isReleased,
  };
}

export const mockCalendarProvider: CalendarProvider = {
  meta: {
    id: "mock",
    label: "MockProvider",
    isMock: true,
  },

  async listHighImpact() {
    await delay();
    const now = Date.now();
    return (calendarRows as CalendarMockRow[])
      .filter((row) => row.impact === "high")
      .map((row) => resolveRow(row, now))
      .sort(
        (a, b) =>
          new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime(),
      );
  },

  async getEvent(id) {
    await delay();
    const now = Date.now();
    const row = (calendarRows as CalendarMockRow[]).find((r) => r.id === id);
    return row ? resolveRow(row, now) : null;
  },

  async getEventDetail(eventKey) {
    await delay(120);
    const detail = (eventDetails as EventDetail[]).find(
      (d) => d.eventKey === eventKey,
    );
    return detail ?? null;
  },

  async listHistory(eventKey) {
    await delay(120);
    const rows = historicalRows as HistoricalResult[];
    const filtered = eventKey
      ? rows.filter((r) => r.eventKey === eventKey)
      : rows;
    return [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  },

  async searchHistory(query) {
    await delay(120);
    const q = query.trim().toLowerCase();
    const rows = historicalRows as HistoricalResult[];
    if (!q) return [...rows].sort((a, b) => b.date.localeCompare(a.date));
    return rows
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.eventKey.toLowerCase().includes(q) ||
          r.currency.toLowerCase().includes(q) ||
          r.date.includes(q),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  },
};
