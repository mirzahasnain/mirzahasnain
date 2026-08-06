"use client";

import { useCallback } from "react";
import { calendarStore, calendarActions, useStore } from "@/state";
import type { CalendarState } from "@/state";

export function useCalendarDomain(): CalendarState & {
  selectEvent: (id: string | null) => void;
  setFilters: typeof calendarActions.setFilters;
} {
  const state = useStore(calendarStore, (s) => s);
  const selectEvent = useCallback((id: string | null) => {
    calendarActions.selectEvent(id);
  }, []);
  return {
    ...state,
    selectEvent,
    setFilters: calendarActions.setFilters,
  };
}
