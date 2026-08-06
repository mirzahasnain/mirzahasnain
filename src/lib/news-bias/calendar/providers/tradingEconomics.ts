import type { CalendarProvider } from "../types";

/**
 * Stub for TradingEconomics. Swap CALENDAR_CONFIG.calendarProvider to use it
 * once credentials are available — currently throws a friendly unavailable error.
 */
export const tradingEconomicsProvider: CalendarProvider = {
  meta: {
    id: "trading-economics",
    label: "TradingEconomics",
    isMock: false,
  },
  async listHighImpact() {
    throw new Error("Live data is temporarily unavailable.");
  },
  async getEvent() {
    throw new Error("Live data is temporarily unavailable.");
  },
  async getEventDetail() {
    throw new Error("Live data is temporarily unavailable.");
  },
  async listHistory() {
    throw new Error("Live data is temporarily unavailable.");
  },
  async searchHistory() {
    throw new Error("Live data is temporarily unavailable.");
  },
};
