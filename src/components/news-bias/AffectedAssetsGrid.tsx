import { DIRECTION_LABELS } from "@/lib/news-bias/constants";
import type {
  AffectedAsset,
  Direction,
} from "@/lib/news-bias/types/interfaces";

interface AffectedAssetsGridProps {
  assets: AffectedAsset[];
}

const BADGE_CLASS: Record<Direction, string> = {
  bullish: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  bearish: "bg-red-400/10 text-red-300 ring-red-400/30",
  neutral: "bg-slate-400/10 text-slate-300 ring-slate-400/30",
};

export function AffectedAssetsGrid({ assets }: AffectedAssetsGridProps) {
  return (
    <div className="space-y-4">
      {groupByDirection(assets).map(([direction, group]) => (
        <ul key={direction} className="grid gap-2 sm:grid-cols-2">
          {group.map((asset) => (
            <li
              key={asset.id}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                asset.isSelected
                  ? "border-sky-400/40 bg-sky-400/[0.06]"
                  : "border-white/5 bg-white/[0.03]"
              }`}
            >
              <span className="truncate text-sm font-semibold text-slate-100">
                {asset.name}
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider ring-1 ${
                  BADGE_CLASS[asset.direction]
                }`}
              >
                {DIRECTION_LABELS[asset.direction]}
              </span>
            </li>
          ))}
        </ul>
      ))}
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
