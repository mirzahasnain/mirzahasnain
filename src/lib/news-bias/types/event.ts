/**
 * Standard economic calendar event — the only shape React may consume.
 * Provider-specific payloads are mapped into this model before leaving /services.
 */
export type EventImpact = "high" | "medium" | "low";

export interface EconomicEvent {
  id: string;
  country: string;
  currency: string;
  title: string;
  impact: EventImpact;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
  /** ISO date YYYY-MM-DD (UTC). */
  date: string;
  /** Time of day HH:mm (UTC) or local wall clock from the provider. */
  time: string;
  /** Absolute ISO timestamp for sorting / countdowns. */
  datetime: string;
  unit: string | null;
  revised: number | null;
  source: string;
  /** Optional catalogue key used by the analysis tool (e.g. "cpi"). */
  newsId: string | null;
}

export type EconomicProviderId = "mock" | "trading-economics";

export interface ProviderConfig {
  id: EconomicProviderId;
  label: string;
  isMock: boolean;
}

export interface HistoricalEconomicEvent extends EconomicEvent {
  surprise: number | null;
}
