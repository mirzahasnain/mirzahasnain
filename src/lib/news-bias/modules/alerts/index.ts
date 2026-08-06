import type { UserPreferences } from "../types";

/** Alerts module — local notification preferences (no push yet). */
export function shouldRemind(
  prefs: UserPreferences,
  minutesUntil: number,
): boolean {
  if (!prefs.notifications.enabled) return false;
  return prefs.notifications.minutesBefore.some(
    (m) => Math.abs(minutesUntil - m) < 0.51,
  );
}

export function describeAlertSettings(prefs: UserPreferences): string {
  if (!prefs.notifications.enabled) return "Alerts off";
  return `Alerts ${prefs.notifications.minutesBefore.join("/")} min before`;
}
