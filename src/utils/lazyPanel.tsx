/**
 * Performance helpers — lazy boundaries for heavy TradeImpact panels.
 * Prefer these over importing heavy modules into the first paint path.
 */
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { LoadingState } from "@/components/system/LoadingState";

export function lazyClientPanel<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  label = "Loading panel…",
) {
  return dynamic(loader, {
    ssr: false,
    loading: () => <LoadingState label={label} />,
  });
}
