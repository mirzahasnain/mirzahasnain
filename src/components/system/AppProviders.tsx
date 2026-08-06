"use client";

import type { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { OfflineBanner } from "./OfflineBanner";

/** Client providers for TradeImpact surfaces — keep root layout thin. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <OfflineBanner />
      {children}
    </ErrorBoundary>
  );
}
