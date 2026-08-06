import { CALENDAR_CONFIG } from "../config";
import type { CalendarProvider, LiveNewsProvider, ProviderId } from "../types";
import { financialModelingPrepProvider } from "./financialModelingPrep";
import {
  financialModelingPrepLiveProvider,
  marketAuxLiveProvider,
  mockLiveNewsProvider,
  tradingEconomicsLiveProvider,
} from "./liveProviders";
import { marketAuxProvider } from "./marketAux";
import { mockCalendarProvider } from "./mockProvider";
import { tradingEconomicsProvider } from "./tradingEconomics";

const CALENDAR_PROVIDERS: Record<ProviderId, CalendarProvider> = {
  mock: mockCalendarProvider,
  "trading-economics": tradingEconomicsProvider,
  "financial-modeling-prep": financialModelingPrepProvider,
  marketaux: marketAuxProvider,
};

const LIVE_PROVIDERS: Record<ProviderId, LiveNewsProvider> = {
  mock: mockLiveNewsProvider,
  "trading-economics": tradingEconomicsLiveProvider,
  "financial-modeling-prep": financialModelingPrepLiveProvider,
  marketaux: marketAuxLiveProvider,
};

export function getCalendarProvider(
  id: ProviderId = CALENDAR_CONFIG.calendarProvider,
): CalendarProvider {
  return CALENDAR_PROVIDERS[id] ?? mockCalendarProvider;
}

export function getLiveNewsProvider(
  id: ProviderId = CALENDAR_CONFIG.liveNewsProvider,
): LiveNewsProvider {
  return LIVE_PROVIDERS[id] ?? mockLiveNewsProvider;
}

export { CALENDAR_PROVIDERS, LIVE_PROVIDERS };
