/**
 * Economic calendar facade for the existing UI.
 * Delegates to ProviderFactory-backed EconomicCalendarApi and adapts
 * standard EconomicEvent models into CalendarEvent for React.
 */
import type {
  CalendarEvent,
  EventDetail,
  EventKey,
  HistoricalResult,
} from "../calendar/types";
import eventDetails from "../calendar/data/events.json";
import { economicCalendarApi } from "./economicCalendarApi";
import {
  toCalendarEvent,
  toHistoricalResult,
} from "../utils/eventAdapter";

export interface EconomicCalendarService {
  listHighImpact(): Promise<CalendarEvent[]>;
  getEvent(id: string): Promise<CalendarEvent | null>;
  getEventDetail(eventKey: EventKey): Promise<EventDetail | null>;
  listHistory(eventKey?: EventKey): Promise<HistoricalResult[]>;
  searchHistory(query: string): Promise<HistoricalResult[]>;
}

export const economicCalendar: EconomicCalendarService = {
  async listHighImpact() {
    const events = await economicCalendarApi.getUpcomingEvents();
    return events
      .filter((e) => e.impact === "high")
      .map(toCalendarEvent)
      .sort(
        (a, b) =>
          new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime(),
      );
  },

  async getEvent(id) {
    const event = await economicCalendarApi.getEvent(id);
    return event ? toCalendarEvent(event) : null;
  },

  async getEventDetail(eventKey) {
    // Details remain local catalogue content (not provider-specific).
    const detail = (eventDetails as EventDetail[]).find(
      (d) => d.eventKey === eventKey,
    );
    return detail ?? null;
  },

  async listHistory(eventKey) {
    const newsId = eventKey ?? "";
    const rows = await economicCalendarApi.getHistoricalEvents(newsId);
    return rows.map(toHistoricalResult);
  },

  async searchHistory(query) {
    const events = await economicCalendarApi.searchEvents(query);
    // Prefer historical-shaped rows when searching history surfaces.
    return events.map((e) =>
      toHistoricalResult({
        ...e,
        surprise:
          e.actual !== null && e.forecast !== null
            ? e.actual - e.forecast
            : null,
      }),
    );
  },
};

/** @deprecated Prefer `economicCalendar`. Kept for older call sites. */
export const calendarService = {
  listUpcoming: () => economicCalendar.listHighImpact(),
  findLatest: async (eventId: string) => {
    const latest = await economicCalendarApi.getLatestResult(eventId);
    if (latest) return toCalendarEvent(latest);
    const events = await economicCalendar.listHighImpact();
    return (
      events.find((e) => e.eventKey === eventId || e.id === eventId) ?? null
    );
  },
};
