/**
 * Live actuals facade. Manual mode ignores this; Live mode polls it.
 */
import { getLiveNewsProvider } from "./calendarProvider";
import type { LiveNewsUpdate } from "../calendar/types";

export interface LiveNewsService {
  getActual(calendarId: string): Promise<LiveNewsUpdate>;
}

export const liveNews: LiveNewsService = {
  getActual: (calendarId) => getLiveNewsProvider().getActual(calendarId),
};
