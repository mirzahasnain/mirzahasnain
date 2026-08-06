/**
 * Calendar feature barrel — UI stays in components/news-bias/calendar.
 * Business logic must not live in presentational components.
 */
export { routes } from "@/config/routes";
export { economicCalendarApi } from "@/services/economicCalendar";
export { useCalendarDomain } from "@/hooks/useCalendarDomain";
