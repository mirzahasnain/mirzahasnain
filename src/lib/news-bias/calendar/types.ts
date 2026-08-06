import type { NewsEventId } from "../types/interfaces";

/** Currencies (and Crypto) the calendar filter supports. */
export type CalendarCurrency =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD"
  | "CHF"
  | "NZD"
  | "CRYPTO";

export type CalendarFilter = "ALL" | CalendarCurrency;

export type ImpactLevel = "high" | "medium" | "low";

export type DataMode = "manual" | "live";

export type ReminderOffset = 15 | 5 | 0;

/** Stable catalogue key shared across releases (e.g. "cpi", "nfp"). */
export type EventKey = NewsEventId | (string & {});

/** Raw row from calendar.json — times are offsets so mocks stay fresh. */
export interface CalendarMockRow {
  id: string;
  eventKey: EventKey;
  country: string;
  currency: CalendarCurrency;
  name: string;
  impact: ImpactLevel;
  /** Minutes from "now" when this mock is loaded. Negative = already released. */
  offsetMinutes: number;
  forecast: number | null;
  previous: number | null;
  /** Present when the release is already out in the mock timeline. */
  actual: number | null;
  unit?: string;
}

/** Resolved upcoming / recent calendar release shown in the UI. */
export interface CalendarEvent {
  id: string;
  eventKey: EventKey;
  country: string;
  /** ISO 3166-1 alpha-2 used for the flag emoji. */
  countryCode: string;
  currency: CalendarCurrency;
  name: string;
  impact: ImpactLevel;
  /** Absolute ISO release timestamp. */
  releaseAt: string;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
  unit?: string;
  /** True when actual is available (released). */
  isReleased: boolean;
}

export interface EventDetail {
  eventKey: EventKey;
  name: string;
  description: string;
  historicalImportance: string;
  marketsAffected: string[];
  typicalMarketReaction: string;
  /** Pair symbols most sensitive to this release (may include pairs outside the analysis tool). */
  pairsMostSensitive: string[];
  /** Maps onto the analysis tool when this is a USD release we support. */
  newsEventId: NewsEventId | null;
}

export interface HistoricalResult {
  id: string;
  eventKey: EventKey;
  name: string;
  currency: CalendarCurrency;
  date: string;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
  surprise: number | null;
  impact: ImpactLevel;
}

export interface LiveNewsUpdate {
  calendarId: string;
  actual: number | null;
  updatedAt: string;
  /** Provider could not fetch live data. */
  unavailable?: boolean;
}

export interface CalendarReminder {
  calendarId: string;
  eventKey: EventKey;
  name: string;
  releaseAt: string;
  offsets: ReminderOffset[];
  createdAt: number;
}

export interface CalendarProviderMeta {
  id: string;
  label: string;
  /** True when this provider is a local mock / stub. */
  isMock: boolean;
}

/**
 * Pluggable calendar source. Swap implementations via config without touching UI.
 */
export interface CalendarProvider {
  readonly meta: CalendarProviderMeta;
  listHighImpact(): Promise<CalendarEvent[]>;
  getEvent(id: string): Promise<CalendarEvent | null>;
  getEventDetail(eventKey: EventKey): Promise<EventDetail | null>;
  listHistory(eventKey?: EventKey): Promise<HistoricalResult[]>;
  searchHistory(query: string): Promise<HistoricalResult[]>;
}

/**
 * Live actuals feed. Stubbed until a paid API is wired.
 */
export interface LiveNewsProvider {
  readonly meta: CalendarProviderMeta;
  getActual(calendarId: string): Promise<LiveNewsUpdate>;
  subscribe?(
    calendarId: string,
    onUpdate: (update: LiveNewsUpdate) => void,
  ): () => void;
}

export type ProviderId =
  | "mock"
  | "trading-economics"
  | "financial-modeling-prep"
  | "marketaux";
