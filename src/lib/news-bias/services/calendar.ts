/**
 * Economic calendar feed. Wired up in Version 4; today it resolves empty so the
 * UI can call it without special casing.
 */
import type { NewsEventId } from "../types/interfaces";

export interface CalendarRelease {
  eventId: NewsEventId;
  /** ISO timestamp of the release. */
  releaseAt: string;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
}

export interface CalendarService {
  listUpcoming(): Promise<CalendarRelease[]>;
  findLatest(eventId: NewsEventId): Promise<CalendarRelease | null>;
}

export const calendarService: CalendarService = {
  listUpcoming: async () => [],
  findLatest: async () => null,
};
