import type { CalendarProvider } from "../types";

/** Stub for Financial Modeling Prep. Not connected yet. */
export const financialModelingPrepProvider: CalendarProvider = {
  meta: {
    id: "financial-modeling-prep",
    label: "FinancialModelingPrep",
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
