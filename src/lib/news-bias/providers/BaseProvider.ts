import type { IEconomicCalendarProvider } from "../interfaces/IEconomicCalendarProvider";
import type {
  EconomicEvent,
  HistoricalEconomicEvent,
  ProviderConfig,
} from "../types/event";
import { withRetry } from "../utils/retry";
import { calendarLogger } from "../utils/logger";
import { getCalendarMaxRetries } from "../utils/env";

/**
 * Abstract base — shared retry + logging for every concrete provider.
 * Subclasses implement fetch* hooks; public methods never skip the base path.
 */
export abstract class BaseProvider implements IEconomicCalendarProvider {
  abstract readonly config: ProviderConfig;

  abstract fetchUpcomingEvents(): Promise<EconomicEvent[]>;
  abstract fetchTodayEvents(): Promise<EconomicEvent[]>;
  abstract fetchHistoricalEvents(
    newsId: string,
  ): Promise<HistoricalEconomicEvent[]>;
  abstract fetchEvent(eventId: string): Promise<EconomicEvent | null>;
  abstract fetchLatestResult(newsId: string): Promise<EconomicEvent | null>;
  abstract fetchSearchEvents(query: string): Promise<EconomicEvent[]>;

  getUpcomingEvents(): Promise<EconomicEvent[]> {
    return this.run("getUpcomingEvents", () => this.fetchUpcomingEvents());
  }

  getTodayEvents(): Promise<EconomicEvent[]> {
    return this.run("getTodayEvents", () => this.fetchTodayEvents());
  }

  getHistoricalEvents(newsId: string): Promise<HistoricalEconomicEvent[]> {
    return this.run("getHistoricalEvents", () =>
      this.fetchHistoricalEvents(newsId),
    );
  }

  getEvent(eventId: string): Promise<EconomicEvent | null> {
    return this.run("getEvent", () => this.fetchEvent(eventId));
  }

  getLatestResult(newsId: string): Promise<EconomicEvent | null> {
    return this.run("getLatestResult", () => this.fetchLatestResult(newsId));
  }

  searchEvents(query: string): Promise<EconomicEvent[]> {
    return this.run("searchEvents", () => this.fetchSearchEvents(query));
  }

  protected run<T>(method: string, fn: () => Promise<T>): Promise<T> {
    const provider = this.config.id;
    return calendarLogger.timed(
      method,
      { provider },
      () =>
        withRetry(fn, {
          maxAttempts: getCalendarMaxRetries(),
          label: method,
          provider,
        }),
    );
  }
}
