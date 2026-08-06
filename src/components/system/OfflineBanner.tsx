"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="status"
      className="w-full border-b border-[var(--nb-wait)]/40 bg-[var(--nb-wait)]/15 px-3 py-2 text-center text-xs text-[var(--nb-wait)]"
    >
      You are offline. Showing cached data where available.
    </div>
  );
}
