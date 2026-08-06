import type {
  EconomicEvent,
  HistoricalEconomicEvent,
  ProviderConfig,
} from "../types/event";

/**
 * Contract every economic calendar provider must implement.
 * UI / hooks never import a concrete provider — only this interface.
 */
export interface IEconomicCalendarProvider {
  readonly config: ProviderConfig;

  getUpcomingEvents(): Promise<EconomicEvent[]>;
  getTodayEvents(): Promise<EconomicEvent[]>;
  getHistoricalEvents(newsId: string): Promise<HistoricalEconomicEvent[]>;
  getEvent(eventId: string): Promise<EconomicEvent | null>;
  getLatestResult(newsId: string): Promise<EconomicEvent | null>;
  searchEvents(query: string): Promise<EconomicEvent[]>;
}
