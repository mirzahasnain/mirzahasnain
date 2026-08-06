/**
 * Canonical economic calendar provider architecture (PRD §32 / API.md).
 * Legacy V6 stubs under lib/news-bias/calendar/providers remain for compatibility
 * and are tracked as Sprint 1 technical debt.
 */
export { BaseProvider } from "./BaseProvider";
export { MockProvider } from "./MockProvider";
export { ProviderFactory } from "./ProviderFactory";
export type {
  IEconomicCalendarProvider,
  EconomicEvent,
  HistoricalEconomicEvent,
  ProviderConfig,
} from "./types";
