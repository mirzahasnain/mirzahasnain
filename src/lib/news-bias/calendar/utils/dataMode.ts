import { CALENDAR_STORAGE } from "../config";
import type { DataMode } from "../types";

export function loadDataMode(): DataMode {
  if (typeof window === "undefined") return "manual";
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE.dataMode);
    return raw === "live" ? "live" : "manual";
  } catch {
    return "manual";
  }
}

export function saveDataMode(mode: DataMode): DataMode {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CALENDAR_STORAGE.dataMode, mode);
  }
  return mode;
}
