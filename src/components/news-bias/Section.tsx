import type { ReactNode } from "react";

type SectionProps = {
  step: string;
  title: string;
  hint?: string;
  children: ReactNode;
};

export function Section({ step, title, hint, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1119]/70 p-4 sm:p-6">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-xs font-bold tabular-nums text-sky-400">
          {step}
        </span>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-200">
            {title}
          </h2>
          {hint ? (
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
