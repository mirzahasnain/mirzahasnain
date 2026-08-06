/**
 * Environment accessors for economic calendar providers.
 * Canonical implementation: `@/config/environment`.
 * This module re-exports for backward compatibility.
 */
export {
  getEconomicProviderId,
  getTradingEconomicsCredentials,
  getCalendarRefreshMs,
  getCalendarMaxRetries,
  isDevLoggingEnabled,
  type EconomicProviderId as EconomicProviderEnvId,
} from "@/config/environment";
