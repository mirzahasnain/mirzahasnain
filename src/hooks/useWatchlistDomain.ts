"use client";

import { useCallback } from "react";
import type { ConfigPairId } from "@/config/pairMappings";
import { watchlistStore, watchlistActions, useStore } from "@/state";

export function useWatchlistDomain() {
  const pins = useStore(watchlistStore, (s) => s.pins);
  const toggle = useCallback((id: ConfigPairId) => watchlistActions.toggle(id), []);
  const pin = useCallback((id: ConfigPairId) => watchlistActions.pin(id), []);
  const unpin = useCallback((id: ConfigPairId) => watchlistActions.unpin(id), []);
  return { pins, toggle, pin, unpin };
}
