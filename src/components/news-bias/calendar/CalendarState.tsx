"use client";

interface CalendarStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CalendarState({
  title,
  message,
  actionLabel,
  onAction,
}: CalendarStateProps) {
  return (
    <div className="nb-fade rounded-xl border border-dashed border-nb-border px-5 py-10 text-center">
      <p className="text-sm font-semibold text-nb-text">{title}</p>
      <p className="mt-2 text-sm text-nb-muted">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-nb-border px-5 text-sm font-semibold text-nb-text hover:border-nb-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
