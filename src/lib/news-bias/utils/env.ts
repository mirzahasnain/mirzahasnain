/**
 * Environment accessors for economic calendar providers.
 * Never hardcode API keys — read from process.env only.
 */

export type EconomicProviderEnvId = "mock" | "trading-economics";

export function getEconomicProviderId(): EconomicProviderEnvId {
  const raw = (process.env.ECONOMIC_PROVIDER ?? "mock").toLowerCase().trim();
  if (raw === "tradingeconomics" || raw === "trading-economics") {
    return "trading-economics";
  }
  return "mock";
}

export function getTradingEconomicsCredentials(): {
  key: string;
  secret: string;
} {
  return {
    key: process.env.TRADING_ECONOMICS_KEY ?? "",
    secret: process.env.TRADING_ECONOMICS_SECRET ?? "",
  };
}

export function getCalendarRefreshMs(): number {
  const raw = Number(process.env.ECONOMIC_CALENDAR_REFRESH_MS ?? 60_000);
  return Number.isFinite(raw) && raw >= 5_000 ? raw : 60_000;
}

export function getCalendarMaxRetries(): number {
  const raw = Number(process.env.ECONOMIC_CALENDAR_MAX_RETRIES ?? 3);
  return Number.isFinite(raw) && raw >= 0 ? Math.min(5, Math.floor(raw)) : 3;
}

export function isDevLoggingEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}
