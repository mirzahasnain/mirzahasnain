import { STORAGE_KEYS } from "@/config/constants";
import { createStore } from "./createStore";
import { readJsonStorage, writeJsonStorage } from "@/utils/storage";
import type { Theme } from "@/types";

export interface SettingsState {
  theme: Theme;
  defaultPairId: string;
  defaultNewsId: string;
  notificationsEnabled: boolean;
  reduceMotion: boolean;
}

const defaults: SettingsState = {
  theme: "dark",
  defaultPairId: "XAUUSD",
  defaultNewsId: "cpi",
  notificationsEnabled: true,
  reduceMotion: false,
};

function loadInitial(): SettingsState {
  return {
    ...defaults,
    ...readJsonStorage<Partial<SettingsState>>(STORAGE_KEYS.settings, {}),
  };
}

export const settingsStore = createStore<SettingsState>(loadInitial());

function persist(): void {
  writeJsonStorage(STORAGE_KEYS.settings, settingsStore.getState());
}

export const settingsActions = {
  patch(partial: Partial<SettingsState>): void {
    settingsStore.setState(partial);
    persist();
  },
  setTheme(theme: Theme): void {
    settingsActions.patch({ theme });
  },
};
