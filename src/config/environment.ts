/**
 * Typed environment accessors.
 * Secrets stay server-side — never expose vendor keys via NEXT_PUBLIC_*.
 */
export type NodeEnv = "development" | "production" | "test";

export type EconomicProviderId = "mock" | "trading-economics";

function readEnv(key: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env[key];
}

export function getNodeEnv(): NodeEnv {
  const raw = readEnv("NODE_ENV") ?? "development";
  if (raw === "production" || raw === "test") return raw;
  return "development";
}

export function isDevelopment(): boolean {
  return getNodeEnv() === "development";
}

export function isProduction(): boolean {
  return getNodeEnv() === "production";
}

export function isTest(): boolean {
  return getNodeEnv() === "test";
}

/** Public app URL (safe for client). */
export function getPublicAppUrl(): string {
  return readEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
}

export function getEconomicProviderId(): EconomicProviderId {
  const raw = (readEnv("ECONOMIC_PROVIDER") ?? "mock").toLowerCase().trim();
  if (raw === "tradingeconomics" || raw === "trading-economics") {
    return "trading-economics";
  }
  return "mock";
}

/** Server-only credentials — call only from Route Handlers / server modules. */
export function getTradingEconomicsCredentials(): {
  key: string;
  secret: string;
} {
  return {
    key: readEnv("TRADING_ECONOMICS_KEY") ?? "",
    secret: readEnv("TRADING_ECONOMICS_SECRET") ?? "",
  };
}

export function getCalendarRefreshMs(): number {
  const raw = Number(readEnv("ECONOMIC_CALENDAR_REFRESH_MS") ?? 60_000);
  return Number.isFinite(raw) && raw >= 5_000 ? raw : 60_000;
}

export function getCalendarMaxRetries(): number {
  const raw = Number(readEnv("ECONOMIC_CALENDAR_MAX_RETRIES") ?? 3);
  return Number.isFinite(raw) && raw >= 0 ? Math.min(5, Math.floor(raw)) : 3;
}

export function isDevLoggingEnabled(): boolean {
  return isDevelopment() && !isTest();
}

export const environment = {
  getNodeEnv,
  isDevelopment,
  isProduction,
  isTest,
  getPublicAppUrl,
  getEconomicProviderId,
  getTradingEconomicsCredentials,
  getCalendarRefreshMs,
  getCalendarMaxRetries,
  isDevLoggingEnabled,
} as const;
