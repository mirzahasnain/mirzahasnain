/** Calendar module facade — re-exports calendar hooks/services for isolation. */
export {
  useEconomicCalendar,
  useCalendarEvent,
  useEventDetail,
  useCountdown,
  useLiveNews,
  CALENDAR_CONFIG,
  CALENDAR_COPY,
} from "../../calendar";
export type { CalendarEvent, CalendarFilter } from "../../calendar";
