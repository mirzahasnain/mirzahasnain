import type { LiveNewsProvider } from "../types";
import calendarRows from "../data/calendar.json";
import type { CalendarMockRow } from "../types";

/**
 * Mock live feed: returns actual once the mock release time has passed.
 */
export const mockLiveNewsProvider: LiveNewsProvider = {
  meta: {
    id: "mock",
    label: "MockProvider",
    isMock: true,
  },

  async getActual(calendarId) {
    await new Promise((r) => setTimeout(r, 180));
    const row = (calendarRows as CalendarMockRow[]).find(
      (r) => r.id === calendarId,
    );
    if (!row) {
      return {
        calendarId,
        actual: null,
        updatedAt: new Date().toISOString(),
        unavailable: true,
      };
    }
    const released = row.offsetMinutes <= 0;
    return {
      calendarId,
      actual: released ? row.actual : null,
      updatedAt: new Date().toISOString(),
    };
  },
};

/** Stubs for future paid live providers. */
export const tradingEconomicsLiveProvider: LiveNewsProvider = {
  meta: {
    id: "trading-economics",
    label: "TradingEconomics",
    isMock: false,
  },
  async getActual(calendarId) {
    return {
      calendarId,
      actual: null,
      updatedAt: new Date().toISOString(),
      unavailable: true,
    };
  },
};

export const financialModelingPrepLiveProvider: LiveNewsProvider = {
  meta: {
    id: "financial-modeling-prep",
    label: "FinancialModelingPrep",
    isMock: false,
  },
  async getActual(calendarId) {
    return {
      calendarId,
      actual: null,
      updatedAt: new Date().toISOString(),
      unavailable: true,
    };
  },
};

export const marketAuxLiveProvider: LiveNewsProvider = {
  meta: {
    id: "marketaux",
    label: "MarketAux",
    isMock: false,
  },
  async getActual(calendarId) {
    return {
      calendarId,
      actual: null,
      updatedAt: new Date().toISOString(),
      unavailable: true,
    };
  },
};
