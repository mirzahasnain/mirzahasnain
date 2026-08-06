/**
 * Local-only notification inbox for the TradeImpact workspace.
 * Prepared for upcoming / released / analysis-ready events — no push yet.
 */
import type { CalendarEvent } from "../../calendar/types";
import type {
  UserPreferences,
  WorkspaceNotification,
  WorkspaceNotificationKind,
} from "../types";

export const NOTIFICATIONS_STORAGE_KEY = "news-bias:notifications:v1";
export const NOTIFICATIONS_LIMIT = 40;

export function loadNotifications(): WorkspaceNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isNotification)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, NOTIFICATIONS_LIMIT);
  } catch {
    return [];
  }
}

export function saveNotifications(
  items: WorkspaceNotification[],
): WorkspaceNotification[] {
  const next = items
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, NOTIFICATIONS_LIMIT);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(next),
    );
  }
  return next;
}

export function markNotificationRead(id: string): WorkspaceNotification[] {
  return saveNotifications(
    loadNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  );
}

export function markAllNotificationsRead(): WorkspaceNotification[] {
  return saveNotifications(
    loadNotifications().map((n) => ({ ...n, read: true })),
  );
}

export function clearNotifications(): WorkspaceNotification[] {
  return saveNotifications([]);
}

/**
 * Sync local inbox from calendar state + prefs.
 * Idempotent per eventId + kind so reloads do not spam duplicates.
 */
export function syncNotificationsFromCalendar(
  events: CalendarEvent[],
  prefs: UserPreferences,
  now = Date.now(),
): WorkspaceNotification[] {
  if (!prefs.notifications.enabled) return loadNotifications();

  const existing = loadNotifications();
  const keys = new Set(existing.map((n) => `${n.kind}:${n.eventId ?? n.id}`));
  const additions: WorkspaceNotification[] = [];

  const upcoming = [...events]
    .filter((e) => !e.isReleased)
    .sort(
      (a, b) =>
        new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime(),
    );

  const nextUp = upcoming[0];
  if (nextUp && prefs.notifications.upcoming) {
    const minutes =
      (new Date(nextUp.releaseAt).getTime() - now) / 60_000;
    const shouldAlert = prefs.notifications.minutesBefore.some(
      (m) => minutes <= m && minutes > m - 1,
    );
    const key = `upcoming:${nextUp.id}`;
    if ((shouldAlert || minutes <= 60) && !keys.has(key)) {
      additions.push(
        makeNotification({
          kind: "upcoming",
          title: "Upcoming News",
          body: `${nextUp.name} releases soon (${nextUp.currency}).`,
          eventId: nextUp.id,
        }),
      );
      keys.add(key);
    }
  }

  if (prefs.notifications.released) {
    for (const event of events.filter((e) => e.isReleased).slice(0, 3)) {
      const key = `released:${event.id}`;
      if (keys.has(key)) continue;
      additions.push(
        makeNotification({
          kind: "released",
          title: "Released",
          body: `${event.name} is out${
            event.actual !== null ? ` — actual ${event.actual}` : ""
          }.`,
          eventId: event.id,
        }),
      );
      keys.add(key);
    }
  }

  if (prefs.notifications.analysisReady && nextUp) {
    const key = `analysis-ready:${nextUp.id}`;
    if (!keys.has(key)) {
      additions.push(
        makeNotification({
          kind: "analysis-ready",
          title: "Analysis Ready",
          body: `One-click bias is ready for ${nextUp.name}.`,
          eventId: nextUp.id,
        }),
      );
    }
  }

  if (additions.length === 0) return existing;
  return saveNotifications([...additions, ...existing]);
}

export function unreadCount(items: WorkspaceNotification[]): number {
  return items.filter((n) => !n.read).length;
}

function makeNotification(input: {
  kind: WorkspaceNotificationKind;
  title: string;
  body: string;
  eventId?: string;
}): WorkspaceNotification {
  const now = Date.now();
  return {
    id: `wn-${now.toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    kind: input.kind,
    title: input.title,
    body: input.body,
    createdAt: now,
    read: false,
    eventId: input.eventId,
  };
}

function isNotification(value: unknown): value is WorkspaceNotification {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.kind === "string" &&
    typeof row.title === "string" &&
    typeof row.createdAt === "number"
  );
}
