import type { IEconomicCalendarProvider } from "../interfaces/IEconomicCalendarProvider";
import type {
  EconomicEvent,
  HistoricalEconomicEvent,
  ProviderConfig,
} from "../types/event";
import { getTradingEconomicsCredentials } from "../utils/env";
import { calendarLogger } from "../utils/logger";
import { NonRetryableError } from "../utils/retry";
import { BaseProvider } from "./BaseProvider";
import {
  mapTradingEconomicsEvent,
  type TradingEconomicsRawEvent,
} from "./mappers/tradingEconomicsMapper";

const TE_CALENDAR_URL = "https://api.tradingeconomics.com/calendar";

/**
 * TradingEconomics calendar provider.
 * Requires TRADING_ECONOMICS_KEY (+ optional SECRET) in the environment.
 * Throws a friendly error when credentials are missing so the factory can
 * fall back to MockProvider.
 */
export class TradingEconomicsProvider
  extends BaseProvider
  implements IEconomicCalendarProvider
{
  readonly config: ProviderConfig = {
    id: "trading-economics",
    label: "TradingEconomics",
    isMock: false,
  };

  async fetchUpcomingEvents(): Promise<EconomicEvent[]> {
    const rows = await this.fetchCalendar();
    const now = Date.now();
    return rows
      .filter((e) => new Date(e.datetime).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      );
  }

  async fetchTodayEvents(): Promise<EconomicEvent[]> {
    const rows = await this.fetchCalendar();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return rows.filter((e) => {
      const t = new Date(e.datetime).getTime();
      return t >= start.getTime() && t < end.getTime();
    });
  }

  async fetchHistoricalEvents(
    newsId: string,
  ): Promise<HistoricalEconomicEvent[]> {
    const rows = await this.fetchCalendar();
    return rows
      .filter((e) => e.newsId === newsId && e.actual !== null)
      .map((e) => ({
        ...e,
        surprise:
          e.actual !== null && e.forecast !== null
            ? e.actual - e.forecast
            : null,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async fetchEvent(eventId: string): Promise<EconomicEvent | null> {
    const rows = await this.fetchCalendar();
    return rows.find((e) => e.id === eventId) ?? null;
  }

  async fetchLatestResult(newsId: string): Promise<EconomicEvent | null> {
    const history = await this.fetchHistoricalEvents(newsId);
    return history[0] ?? null;
  }

  async fetchSearchEvents(query: string): Promise<EconomicEvent[]> {
    const q = query.trim().toLowerCase();
    const rows = await this.fetchCalendar();
    if (!q) return rows;
    return rows.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.currency.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q),
    );
  }

  private assertCredentials(): { key: string; secret: string } {
    const creds = getTradingEconomicsCredentials();
    if (!creds.key) {
      throw new NonRetryableError(
        "TradingEconomics credentials missing. Set TRADING_ECONOMICS_KEY.",
      );
    }
    return creds;
  }

  private async fetchCalendar(): Promise<EconomicEvent[]> {
    const { key, secret } = this.assertCredentials();
    const auth = secret ? `${key}:${secret}` : key;
    const url = `${TE_CALENDAR_URL}?c=${encodeURIComponent(auth)}&f=json`;

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      // Edge/runtime friendly; Next may cache separately.
      cache: "no-store",
    });

    if (!response.ok) {
      calendarLogger.error("TradingEconomics HTTP error", {
        status: response.status,
      });
      throw new Error(
        `Live data is temporarily unavailable. (HTTP ${response.status})`,
      );
    }

    const payload = (await response.json()) as TradingEconomicsRawEvent[];
    if (!Array.isArray(payload)) {
      throw new Error("Live data is temporarily unavailable. (Invalid payload)");
    }

    return payload
      .map(mapTradingEconomicsEvent)
      .filter((e): e is EconomicEvent => e !== null);
  }
}
