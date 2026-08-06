/**
 * Switch calendar / live-news providers.
 * Prefer ECONOMIC_PROVIDER env (see .env.local); this object remains for
 * refresh intervals and live-news stubs used by the UI.
 */
import { getEconomicProviderId, getCalendarRefreshMs } from "../utils/env";
import type { ProviderId } from "./types";

const envProvider = getEconomicProviderId();

export const CALENDAR_CONFIG = {
  /** Active economic calendar provider (env-driven). */
  calendarProvider: (envProvider === "trading-economics"
    ? "trading-economics"
    : "mock") as ProviderId,
  /** Active live actuals provider. */
  liveNewsProvider: "mock" as ProviderId,
  /** How often SWR revalidates calendar data (ms). */
  refreshIntervalMs: getCalendarRefreshMs(),
  /** How often live mode polls for actuals (ms). */
  livePollIntervalMs: 15_000,
} as const;

export const CALENDAR_FILTERS = [
  "ALL",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "NZD",
  "CRYPTO",
] as const;

export const REMINDER_OPTIONS: {
  offset: 15 | 5 | 0;
  label: string;
}[] = [
  { offset: 15, label: "15 minutes before" },
  { offset: 5, label: "5 minutes before" },
  { offset: 0, label: "At release" },
];

export const CALENDAR_STORAGE = {
  favorites: "news-bias:calendar-favorites:v1",
  reminders: "news-bias:calendar-reminders:v1",
  historical: "news-bias:calendar-historical:v1",
  dataMode: "news-bias:data-mode:v1",
} as const;

export const CALENDAR_COPY = {
  title: "Economic Calendar",
  subtitle: "High-impact releases traders watch.",
  impact: "High",
  empty: "No high-impact events match this filter.",
  offline: "You appear to be offline. Showing cached calendar data when available.",
  unavailable: "Live data is temporarily unavailable.",
  error: "Could not load the economic calendar. Try again shortly.",
  retry: "Retry",
  historyTitle: "Historical results",
  historySearch: "Search history",
  historyEmpty: "No historical results match that search.",
  favorites: "Favorites",
  upcoming: "Upcoming",
  analyze: "Open in analysis",
  remind: "Reminders",
  manual: "Manual Mode",
  live: "Live Mode",
  liveHint: "Actual updates automatically when live data is available.",
  manualHint: "Enter the Actual yourself when the print is released.",
  startsIn: "Starts in",
  releasedAgo: "Released",
  ago: "ago",
  forecast: "Forecast",
  previous: "Previous",
  actual: "Actual",
  surprise: "Surprise",
  impactLabel: "Impact",
  date: "Date",
  back: "Back to calendar",
  star: "Star event",
  unstar: "Unstar event",
} as const;
