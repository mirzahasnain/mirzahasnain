import { Card } from "@/components/news-bias/Card";
import {
  BIAS_LABELS,
  CONFIDENCE_LABELS,
  STRENGTH_LABELS,
} from "@/lib/news-bias/constants";
import type { BiasAnalysis } from "@/lib/news-bias/types";

interface TradeBiasCardProps {
  analysis: BiasAnalysis;
}

export function TradeBiasCard({ analysis }: TradeBiasCardProps) {
  const directionClass =
    analysis.pairBias === "bullish" ? "text-emerald-400" : "text-red-400";

  return (
    <Card title="Trade Bias">
      <dl className="grid gap-3 sm:grid-cols-3">
        <Field label="Pair" value={analysis.pair.label} />
        <Field
          label="Direction"
          value={BIAS_LABELS[analysis.pairBias].toUpperCase()}
          valueClass={directionClass}
        />
        <Field
          label="Confidence"
          value={CONFIDENCE_LABELS[analysis.confidence].toUpperCase()}
        />
      </dl>

      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field
          label="Impact"
          value={STRENGTH_LABELS[analysis.strength].toUpperCase()}
        />
        <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 sm:col-span-2">
          <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Reason
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-slate-300">
            {analysis.reason}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

function Field({
  label,
  value,
  valueClass = "text-slate-100",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </dt>
      <dd className={`mt-1 text-sm font-bold ${valueClass}`}>{value}</dd>
    </div>
  );
}
