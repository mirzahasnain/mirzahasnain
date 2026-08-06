"use client";

import { useCountdown } from "@/lib/news-bias/calendar";

interface CountdownBadgeProps {
  releaseAt: string;
  className?: string;
}

export function CountdownBadge({ releaseAt, className = "" }: CountdownBadgeProps) {
  const countdown = useCountdown(releaseAt);

  return (
    <p
      className={[
        "font-mono text-xs tabular-nums",
        countdown.isReleased ? "text-nb-muted" : "text-nb-accent",
        className,
      ].join(" ")}
      aria-live="polite"
    >
      {countdown.phrase}
    </p>
  );
}
