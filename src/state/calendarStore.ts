import { createStore } from "./createStore";
import type { EconomicEvent } from "@/types";

export interface CalendarState {
  events: EconomicEvent[];
  selectedEventId: string | null;
  filterCurrency: string;
  filterImpact: "high" | "medium" | "low" | "all";
  isLoading: boolean;
  isOffline: boolean;
  usingFallback: boolean;
  error: string | null;
  lastProvider: string | null;
}

const initial: CalendarState = {
  events: [],
  selectedEventId: null,
  filterCurrency: "ALL",
  filterImpact: "high",
  isLoading: false,
  isOffline: false,
  usingFallback: false,
  error: null,
  lastProvider: null,
};

export const calendarStore = createStore<CalendarState>(initial);

export const calendarActions = {
  setLoading(isLoading: boolean): void {
    calendarStore.setState({ isLoading });
  },
  setEvents(
    events: EconomicEvent[],
    meta?: { provider?: string; fallback?: boolean },
  ): void {
    calendarStore.setState({
      events,
      isLoading: false,
      error: null,
      lastProvider: meta?.provider ?? calendarStore.getState().lastProvider,
      usingFallback: meta?.fallback ?? false,
    });
  },
  setError(error: string): void {
    calendarStore.setState({ error, isLoading: false });
  },
  selectEvent(selectedEventId: string | null): void {
    calendarStore.setState({ selectedEventId });
  },
  setFilters(
    partial: Partial<Pick<CalendarState, "filterCurrency" | "filterImpact">>,
  ): void {
    calendarStore.setState(partial);
  },
  setOffline(isOffline: boolean): void {
    calendarStore.setState({ isOffline });
  },
  reset(): void {
    calendarStore.replace({ ...initial });
  },
};
