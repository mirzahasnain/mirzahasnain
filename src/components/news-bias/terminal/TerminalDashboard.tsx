"use client";

import Link from "next/link";
import { CalendarState } from "@/components/news-bias/calendar/CalendarState";
import { AiTradingCoach } from "@/components/news-bias/terminal/AiTradingCoach";
import { DeskCharts } from "@/components/news-bias/terminal/DeskCharts";
import { ImpactMeter } from "@/components/news-bias/terminal/ImpactMeter";
import { LiveNewsFeed } from "@/components/news-bias/terminal/LiveNewsFeed";
import { MarketHeatmap } from "@/components/news-bias/terminal/MarketHeatmap";
import { NewsChecklist } from "@/components/news-bias/terminal/NewsChecklist";
import { PreferencesPanel } from "@/components/news-bias/terminal/PreferencesPanel";
import { SessionVolatilityRow } from "@/components/news-bias/terminal/SessionVolatility";
import { SmartBiasStrip } from "@/components/news-bias/terminal/SmartBiasStrip";
import { TerminalShell } from "@/components/news-bias/terminal/TerminalShell";
import { TopCards } from "@/components/news-bias/terminal/TopCards";
import { TradePlaybookPhases } from "@/components/news-bias/terminal/TradePlaybookPhases";
import { WatchlistPanel } from "@/components/news-bias/terminal/WatchlistPanel";
import { Footer } from "@/components/news-bias/Footer";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import { useTerminalDashboard } from "@/lib/news-bias/modules/dashboard/useTerminalDashboard";

export function TerminalDashboard() {
  const desk = useTerminalDashboard();

  return (
    <TerminalShell offline={desk.offline}>
      {desk.error ? (
        <CalendarState
          title="Unavailable"
          message={TERMINAL_COPY.unavailable}
          actionLabel={TERMINAL_COPY.retry}
          onAction={() => void desk.refresh()}
        />
      ) : null}

      {desk.isLoading && desk.events.length === 0 ? (
        <div className="space-y-3" aria-busy>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-nb-elevated" />
          ))}
        </div>
      ) : null}

      <TopCards
        cards={desk.topCards}
        countdownReleaseAt={desk.focusEvent?.releaseAt ?? null}
      />

      <SmartBiasStrip bias={desk.bias} />

      <div className="grid gap-3 lg:grid-cols-2">
        <ImpactMeter level={desk.impactLevel} />
        <SessionVolatilityRow
          session={desk.session}
          volatility={desk.volatility}
        />
      </div>

      <MarketHeatmap cells={desk.heatmap} />

      <LiveNewsFeed items={desk.feed} />

      <div className="grid gap-3 lg:grid-cols-2">
        <TradePlaybookPhases playbook={desk.playbook} />
        <AiTradingCoach coach={desk.coach} />
      </div>

      <NewsChecklist items={desk.checklist} />

      <WatchlistPanel
        pinned={desk.prefs?.watchlist ?? []}
        onToggle={desk.toggleWatch}
      />

      <DeskCharts series={desk.miniCharts} />

      {desk.prefs ? (
        <PreferencesPanel
          prefs={desk.prefs}
          onChange={desk.updatePrefs}
          onToggleNews={desk.toggleNewsFavorite}
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/news-bias"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-nb-accent px-5 text-sm font-bold text-white"
        >
          {TERMINAL_COPY.analyze}
        </Link>
        <Link
          href="/calendar"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-nb-border px-5 text-sm font-semibold text-nb-text"
        >
          {TERMINAL_COPY.calendar}
        </Link>
      </div>

      <Footer />
    </TerminalShell>
  );
}
