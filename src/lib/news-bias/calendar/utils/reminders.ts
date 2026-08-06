import { CALENDAR_STORAGE } from "../config";
import type { CalendarReminder, EventKey, ReminderOffset } from "../types";

function read(): CalendarReminder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE.reminders);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CalendarReminder[]) : [];
  } catch {
    return [];
  }
}

function write(items: CalendarReminder[]): CalendarReminder[] {
  if (typeof window === "undefined") return items;
  window.localStorage.setItem(CALENDAR_STORAGE.reminders, JSON.stringify(items));
  return items;
}

export function loadReminders(): CalendarReminder[] {
  return read();
}

export function getReminder(calendarId: string): CalendarReminder | null {
  return read().find((r) => r.calendarId === calendarId) ?? null;
}

export function setReminderOffsets(
  input: {
    calendarId: string;
    eventKey: EventKey;
    name: string;
    releaseAt: string;
    offsets: ReminderOffset[];
  },
): CalendarReminder[] {
  const current = read().filter((r) => r.calendarId !== input.calendarId);
  if (input.offsets.length === 0) return write(current);

  const next: CalendarReminder = {
    calendarId: input.calendarId,
    eventKey: input.eventKey,
    name: input.name,
    releaseAt: input.releaseAt,
    offsets: [...input.offsets].sort((a, b) => b - a),
    createdAt: Date.now(),
  };
  return write([...current, next]);
}

export function clearReminder(calendarId: string): CalendarReminder[] {
  return write(read().filter((r) => r.calendarId !== calendarId));
}
