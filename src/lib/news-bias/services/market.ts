/**
 * Live price feed for the tracked pairs. Wired up in Version 4; today it
 * resolves empty so the UI can call it without special casing.
 */
import type { PairId } from "../types/interfaces";

export interface Quote {
  pairId: PairId;
  price: number;
  /** Percentage change on the session. */
  changePercent: number;
  /** ISO timestamp of the quote. */
  quotedAt: string;
}

export interface MarketService {
  getQuote(pairId: PairId): Promise<Quote | null>;
  getQuotes(pairIds: PairId[]): Promise<Quote[]>;
}

export const marketService: MarketService = {
  getQuote: async () => null,
  getQuotes: async () => [],
};
