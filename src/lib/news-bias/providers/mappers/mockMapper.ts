import type { CalendarMockRow, HistoricalResult } from "../../calendar/types";
import type {
  EconomicEvent,
  EventImpact,
  HistoricalEconomicEvent,
} from "../../types/event";

/** Map a mock calendar.json row into the standard EconomicEvent model. */
export function mapMockRowToEvent(
  row: CalendarMockRow,
  now: number = Date.now(),
): EconomicEvent {
  const datetime = new Date(now + row.offsetMinutes * 60_000).toISOString();
  const released = row.offsetMinutes <= 0;
  return {
    id: row.id,
    country: row.country,
    currency: row.currency,
    title: row.name,
    impact: row.impact as EventImpact,
    forecast: row.forecast,
    previous: row.previous,
    actual: released ? row.actual : null,
    date: datetime.slice(0, 10),
    time: datetime.slice(11, 16),
    datetime,
    unit: row.unit ?? null,
    revised: null,
    source: "mock",
    newsId: typeof row.eventKey === "string" ? row.eventKey : null,
  };
}

export function mapHistoricalResultToEvent(
  row: HistoricalResult,
): HistoricalEconomicEvent {
  const datetime = `${row.date}T12:00:00.000Z`;
  return {
    id: row.id,
    country: "",
    currency: row.currency,
    title: row.name,
    impact: row.impact,
    forecast: row.forecast,
    previous: row.previous,
    actual: row.actual,
    date: row.date,
    time: "12:00",
    datetime,
    unit: null,
    revised: null,
    source: "mock",
    newsId: row.eventKey,
    surprise: row.surprise,
  };
}
