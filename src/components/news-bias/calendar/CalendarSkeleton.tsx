export function EventCardSkeleton() {
  return (
    <div className="animate-pulse border-b border-nb-border py-4" aria-hidden>
      <div className="flex gap-3">
        <div className="size-8 rounded-full bg-nb-elevated" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-nb-elevated" />
          <div className="h-5 w-48 rounded bg-nb-elevated" />
          <div className="h-3 w-40 rounded bg-nb-elevated" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-12 rounded-lg bg-nb-elevated" />
            <div className="h-12 rounded-lg bg-nb-elevated" />
            <div className="h-12 rounded-lg bg-nb-elevated" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-busy="true" aria-label="Loading calendar">
      {Array.from({ length: count }, (_, i) => (
        <EventCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading calendar…</span>
    </div>
  );
}
