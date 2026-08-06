import calendarRows from "../calendar/data/calendar.json";
import historicalRows from "../calendar/data/historical.json";
import type { CalendarMockRow, HistoricalResult } from "../calendar/types";
import type { IEconomicCalendarProvider } from "../interfaces/IEconomicCalendarProvider";
import type {
  EconomicEvent,
  HistoricalEconomicEvent,
  ProviderConfig,
} from "../types/event";
import { BaseProvider } from "./BaseProvider";
import {
  mapHistoricalResultToEvent,
  mapMockRowToEvent,
} from "./mappers/mockMapper";

const LATENCY_MS = 200;

/**
 * Local JSON-backed provider. Always available — used as default and fallback.
 */
export class MockProvider extends BaseProvider implements IEconomicCalendarProvider {
  readonly config: ProviderConfig = {
    id: "mock",
    label: "MockProvider",
    isMock: true,
  };

  async fetchUpcomingEvents(): Promise<EconomicEvent[]> {
    await delay();
    const now = Date.now();
    return (calendarRows as CalendarMockRow[])
      .map((row) => mapMockRowToEvent(row, now))
      .filter((e) => new Date(e.datetime).getTime() >= now - 6 * 60 * 60_000)
      .filter((e) => e.impact === "high")
      .sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      );
  }

  async fetchTodayEvents(): Promise<EconomicEvent[]> {
    await delay();
    const now = Date.now();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return (calendarRows as CalendarMockRow[])
      .map((row) => mapMockRowToEvent(row, now))
      .filter((e) => {
        const t = new Date(e.datetime).getTime();
        return t >= start.getTime() && t < end.getTime();
      })
      .sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      );
  }

  async fetchHistoricalEvents(
    newsId: string,
  ): Promise<HistoricalEconomicEvent[]> {
    await delay(120);
    return (historicalRows as HistoricalResult[])
      .filter((row) => !newsId || row.eventKey === newsId)
      .map(mapHistoricalResultToEvent)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async fetchEvent(eventId: string): Promise<EconomicEvent | null> {
    await delay();
    const now = Date.now();
    const row = (calendarRows as CalendarMockRow[]).find((r) => r.id === eventId);
    return row ? mapMockRowToEvent(row, now) : null;
  }

  async fetchLatestResult(newsId: string): Promise<EconomicEvent | null> {
    await delay();
    const now = Date.now();
    const released = (calendarRows as CalendarMockRow[])
      .filter((r) => r.eventKey === newsId && r.offsetMinutes <= 0)
      .map((r) => mapMockRowToEvent(r, now))
      .sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
      );
    if (released[0]) return released[0];

    const history = await this.fetchHistoricalEvents(newsId);
    return history[0] ?? null;
  }

  async fetchSearchEvents(query: string): Promise<EconomicEvent[]> {
    await delay(120);
    const q = query.trim().toLowerCase();
    const now = Date.now();
    const all = (calendarRows as CalendarMockRow[]).map((row) =>
      mapMockRowToEvent(row, now),
    );
    if (!q) return all;
    return all.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.currency.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        (e.newsId ?? "").toLowerCase().includes(q),
    );
  }
}

function delay(ms: number = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
