import type { IEconomicCalendarProvider } from "../interfaces/IEconomicCalendarProvider";
import type { EconomicProviderId } from "../types/event";
import {
  getEconomicProviderId,
  getTradingEconomicsCredentials,
} from "../utils/env";
import { calendarLogger } from "../utils/logger";
import { MockProvider } from "./MockProvider";
import { TradingEconomicsProvider } from "./TradingEconomicsProvider";

export type { IEconomicCalendarProvider };

/**
 * Resolves the active economic calendar provider from environment config.
 * Unknown ids, missing credentials, and construction failures fall back to MockProvider.
 */
export class ProviderFactory {
  private static mockSingleton: MockProvider | null = null;

  static create(
    id: EconomicProviderId = getEconomicProviderId(),
  ): IEconomicCalendarProvider {
    try {
      switch (id) {
        case "trading-economics": {
          const { key } = getTradingEconomicsCredentials();
          if (!key) {
            calendarLogger.warn(
              "TradingEconomics key missing — using MockProvider",
              { requested: id },
            );
            return ProviderFactory.getMock();
          }
          calendarLogger.info("ProviderFactory.create", { provider: id });
          return new TradingEconomicsProvider();
        }
        case "mock":
        default:
          calendarLogger.info("ProviderFactory.create", { provider: "mock" });
          return ProviderFactory.getMock();
      }
    } catch (error) {
      calendarLogger.warn("ProviderFactory falling back to mock", {
        requested: id,
        error: error instanceof Error ? error.message : String(error),
      });
      return ProviderFactory.getMock();
    }
  }

  static getMock(): MockProvider {
    if (!ProviderFactory.mockSingleton) {
      ProviderFactory.mockSingleton = new MockProvider();
    }
    return ProviderFactory.mockSingleton;
  }

  /** Resolve by free-form env string (e.g. "TradingEconomics"). */
  static fromName(name: string): IEconomicCalendarProvider {
    const normalized = name.toLowerCase().trim();
    if (
      normalized === "tradingeconomics" ||
      normalized === "trading-economics"
    ) {
      return ProviderFactory.create("trading-economics");
    }
    return ProviderFactory.create("mock");
  }
}
