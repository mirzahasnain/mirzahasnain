import { Card } from "@/components/news-bias/Card";

interface MarketExplanationProps {
  lines: string[];
}

export function MarketExplanation({ lines }: MarketExplanationProps) {
  return (
    <Card title="Why?">
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
