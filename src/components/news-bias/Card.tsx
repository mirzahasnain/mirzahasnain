import type { ReactNode } from "react";

interface CardProps {
  title: string;
  hint?: string;
  /** Optional control rendered on the right of the title. */
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ title, hint, action, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1119]/70 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-200">
            {title}
          </h2>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
