import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { DIRECTION_LABELS } from "@/lib/news-bias/constants";
import type {
  AffectedAsset,
  Direction,
} from "@/lib/news-bias/types/interfaces";

interface AffectedAssetsGridProps {
  assets: AffectedAsset[];
}

const BADGE_CLASS: Record<Direction, string> = {
  bullish: "bg-nb-up/10 text-nb-up ring-nb-up/30",
  bearish: "bg-nb-down/10 text-nb-down ring-nb-down/30",
  neutral: "bg-nb-flat/10 text-nb-flat ring-nb-flat/30",
};

const ARROWS: Record<Direction, LucideIcon> = {
  bullish: ArrowUp,
  bearish: ArrowDown,
  neutral: Minus,
};

function AffectedAssetsGridComponent({ assets }: AffectedAssetsGridProps) {
  return (
    <div className="space-y-4">
      {groupByDirection(assets).map(([direction, group]) => {
        const Arrow = ARROWS[direction];

        return (
          <ul key={direction} className="grid gap-2 sm:grid-cols-2">
            {group.map((asset) => (
              <li
                key={asset.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                  asset.isSelected
                    ? "border-nb-accent/40 bg-nb-accent/10"
                    : "border-nb-border bg-nb-elevated"
                }`}
              >
                <span className="truncate text-sm font-semibold text-nb-text">
                  {asset.name}
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider ring-1 ${
                    BADGE_CLASS[asset.direction]
                  }`}
                >
                  <Arrow aria-hidden className="size-3" />
                  {DIRECTION_LABELS[asset.direction]}
                </span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

/**
 * Each direction gets its own grid so a row never mixes two colours, which is
 * easy to misread at a glance.
 */
function groupByDirection(
  assets: AffectedAsset[],
): [Direction, AffectedAsset[]][] {
  const order = [...new Set(assets.map((asset) => asset.direction))];
  return order.map((direction) => [
    direction,
    assets.filter((asset) => asset.direction === direction),
  ]);
}

export const AffectedAssetsGrid = memo(AffectedAssetsGridComponent);
