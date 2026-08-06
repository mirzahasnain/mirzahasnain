/**
 * Canonical app routes (PRD §15 — Analysis remains event-centric; Terminal kept for existing route).
 */
export const routes = {
  home: "/",
  workspace: "/workspace",
  calendar: "/calendar",
  analysis: "/news-bias",
  terminal: "/terminal",
  event: (id: string) => `/event/${encodeURIComponent(id)}` as const,
  play: "/play",
  api: {
    economicCalendar: (action: string) =>
      `/api/economic-calendar/${encodeURIComponent(action)}` as const,
  },
} as const;

export type AppRouteKey = keyof Omit<typeof routes, "event" | "api">;
