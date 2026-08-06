import { DEFAULT_WATCHLIST, type ConfigPairId } from "@/config/pairMappings";
import { STORAGE_KEYS } from "@/config/constants";
import { createStore } from "./createStore";
import { readJsonStorage, writeJsonStorage } from "@/utils/storage";

export interface WatchlistState {
  pins: ConfigPairId[];
}

function loadInitial(): WatchlistState {
  const pins = readJsonStorage<ConfigPairId[]>(STORAGE_KEYS.watchlist, [
    ...DEFAULT_WATCHLIST,
  ]);
  return { pins };
}

export const watchlistStore = createStore<WatchlistState>(loadInitial());

function persist(pins: ConfigPairId[]): void {
  writeJsonStorage(STORAGE_KEYS.watchlist, pins);
}

export const watchlistActions = {
  pin(id: ConfigPairId): void {
    const pins = watchlistStore.getState().pins;
    if (pins.includes(id)) return;
    const next = [...pins, id];
    watchlistStore.setState({ pins: next });
    persist(next);
  },
  unpin(id: ConfigPairId): void {
    const next = watchlistStore.getState().pins.filter((p) => p !== id);
    watchlistStore.setState({ pins: next });
    persist(next);
  },
  toggle(id: ConfigPairId): void {
    const pins = watchlistStore.getState().pins;
    if (pins.includes(id)) watchlistActions.unpin(id);
    else watchlistActions.pin(id);
  },
  replace(pins: ConfigPairId[]): void {
    watchlistStore.setState({ pins });
    persist(pins);
  },
};
