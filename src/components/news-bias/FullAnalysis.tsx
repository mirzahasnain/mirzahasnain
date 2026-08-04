interface FullAnalysisProps {
  lines: string[];
}

export function FullAnalysis({ lines }: FullAnalysisProps) {
  return (
    <ul className="space-y-3">
      {lines.map((line) => (
        <li key={line} className="flex gap-3">
          <span
            aria-hidden
            className="mt-1.5 h-3 w-0.5 shrink-0 rounded-full bg-nb-accent"
          />
          <span className="text-sm leading-relaxed text-nb-text-soft">{line}</span>
        </li>
      ))}
    </ul>
  );
}
