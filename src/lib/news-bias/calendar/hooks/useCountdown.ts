"use client";

import { useEffect, useState } from "react";
import { getCountdown, type CountdownState } from "../utils/countdown";

/**
 * Ticks once per second against a release timestamp.
 * Ready to later sync from a server clock if needed.
 */
export function useCountdown(releaseAt: string | null | undefined): CountdownState {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!releaseAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [releaseAt]);

  if (!releaseAt) {
    return {
      remainingMs: 0,
      isReleased: false,
      label: "—",
      phrase: "—",
    };
  }

  return getCountdown(releaseAt, now);
}
