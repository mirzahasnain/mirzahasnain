import type { CalendarCurrency, CalendarEvent, ImpactLevel } from "../calendar/types";
import { countryToCode } from "../calendar/utils/format";
import type { EconomicEvent, HistoricalEconomicEvent } from "../types/event";
import type { HistoricalResult } from "../calendar/types";

const CURRENCIES = new Set([
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "NZD",
  "CRYPTO",
]);

/**
 * Adapt the standard provider Event model into the UI CalendarEvent shape.
 * React components keep using CalendarEvent — never provider JSON.
 */
export function toCalendarEvent(event: EconomicEvent): CalendarEvent {
  const currency = CURRENCIES.has(event.currency)
    ? (event.currency as CalendarCurrency)
    : "USD";
  const impact = (["high", "medium", "low"].includes(event.impact)
    ? event.impact
    : "medium") as ImpactLevel;

  return {
    id: event.id,
    eventKey: event.newsId ?? event.id,
    country: event.country,
    countryCode: countryToCode(event.country || "United States"),
    currency,
    name: event.title,
    impact,
    releaseAt: event.datetime,
    forecast: event.forecast,
    previous: event.previous,
    actual: event.actual,
    unit: event.unit ?? undefined,
    isReleased:
      event.actual !== null || new Date(event.datetime).getTime() <= Date.now(),
  };
}

export function toHistoricalResult(
  event: HistoricalEconomicEvent,
): HistoricalResult {
  const currency = CURRENCIES.has(event.currency)
    ? (event.currency as CalendarCurrency)
    : "USD";

  return {
    id: event.id,
    eventKey: event.newsId ?? event.id,
    name: event.title,
    currency,
    date: event.date,
    forecast: event.forecast,
    previous: event.previous,
    actual: event.actual,
    surprise: event.surprise,
    impact: event.impact,
  };
}
