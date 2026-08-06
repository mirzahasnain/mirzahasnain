import { cn } from "@/utils/cn";

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-32 items-center justify-center gap-3 text-sm text-[var(--nb-muted)]",
        className,
      )}
    >
      <span
        className="h-4 w-4 animate-pulse rounded-full bg-[var(--nb-accent)]"
        aria-hidden
      />
      {label}
    </div>
  );
}
