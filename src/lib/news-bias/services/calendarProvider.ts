/**
 * Calendar provider registry — V6 live stubs + V10 economic calendar factory.
 */
export {
  getCalendarProvider,
  getLiveNewsProvider,
  CALENDAR_PROVIDERS,
  LIVE_PROVIDERS,
} from "../calendar/providers";

export { ProviderFactory } from "../providers/ProviderFactory";
export { economicCalendarApi } from "./economicCalendarApi";
export {
  getEconomicProviderId as getActiveEconomicProviderId,
} from "../utils/env";
