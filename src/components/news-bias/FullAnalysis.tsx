import { Card } from "@/components/news-bias/Card";
import { CARD_COPY } from "@/lib/news-bias/constants";

interface FullAnalysisProps {
  lines: string[];
}

export function FullAnalysis({ lines }: FullAnalysisProps) {
  return (
    <Card title={CARD_COPY.analysis.title}>
      <ul className="space-y-3">
        {lines.map((line) => (
          <li key={line} className="flex gap-3">
            <span
              aria-hidden
              className="mt-1.5 h-3 w-0.5 shrink-0 rounded-full bg-sky-400"
            />
            <span className="text-sm leading-relaxed text-slate-300">
              {line}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
