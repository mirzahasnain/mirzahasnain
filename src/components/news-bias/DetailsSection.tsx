import type { ReactNode } from "react";

interface DetailsSectionProps {
  title: string;
  hint?: string;
  /** Optional control rendered on the right of the title. */
  action?: ReactNode;
  children: ReactNode;
}

export function DetailsSection({
  title,
  hint,
  action,
  children,
}: DetailsSectionProps) {
  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {title}
          </h3>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
