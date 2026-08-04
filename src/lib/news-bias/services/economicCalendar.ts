/**
 * Economic calendar facade. UI and hooks call this — never a concrete provider.
 */
import { getCalendarProvider } from "./calendarProvider";
import type {
  CalendarEvent,
  EventDetail,
  EventKey,
  HistoricalResult,
} from "../calendar/types";

export interface EconomicCalendarService {
  listHighImpact(): Promise<CalendarEvent[]>;
  getEvent(id: string): Promise<CalendarEvent | null>;
  getEventDetail(eventKey: EventKey): Promise<EventDetail | null>;
  listHistory(eventKey?: EventKey): Promise<HistoricalResult[]>;
  searchHistory(query: string): Promise<HistoricalResult[]>;
}

function provider() {
  return getCalendarProvider();
}

export const economicCalendar: EconomicCalendarService = {
  listHighImpact: () => provider().listHighImpact(),
  getEvent: (id) => provider().getEvent(id),
  getEventDetail: (eventKey) => provider().getEventDetail(eventKey),
  listHistory: (eventKey) => provider().listHistory(eventKey),
  searchHistory: (query) => provider().searchHistory(query),
};

/** @deprecated Prefer `economicCalendar`. Kept for older call sites. */
export const calendarService = {
  listUpcoming: () => economicCalendar.listHighImpact(),
  findLatest: async (eventId: string) => {
    const events = await economicCalendar.listHighImpact();
    return (
      events.find((e) => e.eventKey === eventId || e.id === eventId) ?? null
    );
  },
};
