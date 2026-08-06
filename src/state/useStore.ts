"use client";

import { useSyncExternalStore } from "react";
import type { StoreApi } from "./createStore";

export function useStore<T extends object, S>(
  store: StoreApi<T>,
  selector: (state: T) => S,
): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}
