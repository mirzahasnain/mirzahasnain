"use client";

import { VOLATILITY_LABELS } from "@/lib/news-bias/modules/analytics";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { SessionStatus, VolatilityReading } from "@/lib/news-bias/modules/types";

interface SessionVolatilityProps {
  session: SessionStatus;
  volatility: VolatilityReading;
}

export function SessionStatusCard({ session }: { session: SessionStatus }) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {TERMINAL_COPY.session.title}
      </h2>
      <p className="mt-2 text-xl font-black text-nb-accent">{session.label}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-nb-faint">
        Liquidity · {session.liquidity}
      </p>
      <p className="mt-2 text-sm text-nb-text-soft">{session.description}</p>
      <p className="mt-2 text-[11px] text-nb-muted">UTC hour {session.utcHour}</p>
    </section>
  );
}

export function VolatilityMeter({ volatility }: { volatility: VolatilityReading }) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {TERMINAL_COPY.volatility.title}
      </h2>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-nb-elevated">
        <div
          className="h-full rounded-full bg-nb-accent transition-all duration-700"
          style={{ width: `${volatility.score}%` }}
        />
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <MeterStat label="Current" value={VOLATILITY_LABELS[volatility.current]} />
        <MeterStat label="Expected" value={VOLATILITY_LABELS[volatility.expected]} />
        <MeterStat label="Post News" value={VOLATILITY_LABELS[volatility.postNews]} />
      </dl>
    </section>
  );
}

export function SessionVolatilityRow({
  session,
  volatility,
}: SessionVolatilityProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <SessionStatusCard session={session} />
      <VolatilityMeter volatility={volatility} />
    </div>
  );
}

function MeterStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-nb-elevated/50 px-2 py-2">
      <dt className="text-[9px] uppercase tracking-wider text-nb-faint">{label}</dt>
      <dd className="mt-0.5 font-semibold text-nb-text">{value}</dd>
    </div>
  );
}
