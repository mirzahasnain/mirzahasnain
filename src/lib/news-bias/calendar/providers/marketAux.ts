import type { CalendarProvider } from "../types";

/** Stub for MarketAux. Not connected yet. */
export const marketAuxProvider: CalendarProvider = {
  meta: {
    id: "marketaux",
    label: "MarketAux",
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
