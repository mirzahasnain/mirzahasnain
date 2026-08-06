/**
 * Version 9 module barrel — isolated domains for the trading terminal.
 * UI imports from here; never reaches into sibling module internals.
 */
export * as dashboard from "./dashboard";
export * as calendar from "./calendar";
export * as decision from "./decision";
export * as history from "./history";
export * as playbook from "./playbook";
export * as watchlist from "./watchlist";
export * as alerts from "./alerts";
export * as analytics from "./analytics";
export * as preferences from "./preferences";
export { buildCoachBriefing } from "./alerts/coach";
export { buildMiniChart } from "./analytics/miniCharts";
export type * from "./types";
