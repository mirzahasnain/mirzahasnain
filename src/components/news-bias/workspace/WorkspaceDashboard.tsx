"use client";

import { AiTradePlaybookCard } from "@/components/news-bias/AiTradePlaybookCard";
import { CalendarState } from "@/components/news-bias/calendar/CalendarState";
import { Footer } from "@/components/news-bias/Footer";
import { FavoritesPanel } from "@/components/news-bias/workspace/FavoritesPanel";
import { GlobalSearch } from "@/components/news-bias/workspace/GlobalSearch";
import { HomeDashboardCards } from "@/components/news-bias/workspace/HomeDashboardCards";
import { MarketStatusPanel } from "@/components/news-bias/workspace/MarketStatusPanel";
import { NotificationsPanel } from "@/components/news-bias/workspace/NotificationsPanel";
import { OneClickAnalysis } from "@/components/news-bias/workspace/OneClickAnalysis";
import { QuickActionsFab } from "@/components/news-bias/workspace/QuickActionsFab";
import { RecentAnalysisSection } from "@/components/news-bias/workspace/RecentAnalysisSection";
import { SettingsPanel } from "@/components/news-bias/workspace/SettingsPanel";
import { TradeChecklistPanel } from "@/components/news-bias/workspace/TradeChecklistPanel";
import { TradeJournalPanel } from "@/components/news-bias/workspace/TradeJournalPanel";
import { WatchlistSection } from "@/components/news-bias/workspace/WatchlistSection";
import { WorkspaceShell } from "@/components/news-bias/workspace/WorkspaceShell";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import { useWorkspaceDashboard } from "@/lib/news-bias/modules/dashboard/useWorkspaceDashboard";
import { buildAnalysis } from "@/lib/news-bias/logic";
import { pairIdForWatchAsset } from "@/lib/news-bias/modules/preferences";
import type { NewsEventId, PairId } from "@/lib/news-bias/types/interfaces";
import { useMemo } from "react";

export function WorkspaceDashboard() {
  const desk = useWorkspaceDashboard();

  const playbookAnalysis = useMemo(() => {
    const focus = desk.focusEvent;
    if (!focus) return null;
    const newsId = focus.eventKey as NewsEventId;
    const pairId: PairId =
      desk.prefs?.defaultPair ??
      (desk.pinned[0] ? pairIdForWatchAsset(desk.pinned[0].id) : "XAUUSD");
    const known = [
      "cpi",
      "core-cpi",
      "ppi",
      "core-ppi",
      "nfp",
      "unemployment-rate",
      "interest-rate-decision",
      "fomc-statement",
      "ism-manufacturing-pmi",
      "ism-services-pmi",
      "gdp",
      "retail-sales",
      "core-pce",
    ].includes(newsId);
    if (!known) return null;
    const hasNumbers = focus.forecast !== null && focus.actual !== null;
    return buildAnalysis({
      eventId: newsId,
      pairId,
      outcome: hasNumbers ? null : "positive",
      forecast: focus.forecast,
      previous: focus.previous,
      actual: focus.actual,
    });
  }, [desk.focusEvent, desk.prefs?.defaultPair, desk.pinned]);

  return (
    <>
      <WorkspaceShell offline={desk.offline}>
        {desk.error ? (
          <CalendarState
            title="Unavailable"
            message={WORKSPACE_COPY.unavailable}
            actionLabel={WORKSPACE_COPY.retry}
            onAction={() => void desk.refresh()}
          />
        ) : null}

        {desk.isLoading && desk.events.length === 0 ? (
          <div className="space-y-3" aria-busy>
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-nb-elevated"
              />
            ))}
          </div>
        ) : null}

        <GlobalSearch
          query={desk.searchQuery}
          onQueryChange={desk.setSearchQuery}
          hits={desk.searchHits}
        />

        <MarketStatusPanel
          rows={desk.marketStatus.rows}
          marketOpen={desk.marketStatus.marketOpen}
          activeLabel={desk.marketStatus.activeLabel}
        />

        <HomeDashboardCards
          cards={desk.topCards}
          bias={desk.bias}
          focusEvent={desk.focusEvent}
          countdownReleaseAt={desk.focusEvent?.releaseAt ?? null}
          onSelectEvent={desk.selectEvent}
          todayEvents={desk.todayEvents}
        />

        <WatchlistSection
          pinned={desk.pinned}
          pinnedIds={desk.prefs?.watchlist ?? []}
          onToggle={desk.toggleWatch}
        />

        <TradeChecklistPanel items={desk.checklist} />

        <OneClickAnalysis
          eventLabel={desk.oneClick.eventLabel}
          confidence={desk.oneClick.confidence}
          rows={desk.oneClick.rows}
        />

        {playbookAnalysis ? (
          <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
            <h2 className="text-sm font-semibold text-nb-text">AI Trade Playbook</h2>
            <div className="mt-3">
              <AiTradePlaybookCard analysis={playbookAnalysis} />
            </div>
          </section>
        ) : null}

        <RecentAnalysisSection entries={desk.recentAnalysis} />

        <TradeJournalPanel
          entries={desk.journal}
          defaultPair={desk.prefs?.defaultPair ?? "XAUUSD"}
          newsLabel={desk.focusEvent?.name ?? null}
          onAdd={desk.addJournal}
          onDelete={desk.removeJournal}
        />

        {desk.prefs ? (
          <>
            <FavoritesPanel
              prefs={desk.prefs}
              onToggleNews={desk.toggleNewsFavorite}
              onToggleAsset={desk.toggleAssetFavorite}
              onToggleStrategy={desk.toggleStrategyFavorite}
            />
            <NotificationsPanel
              items={desk.notifications}
              unread={desk.unread}
              onMarkRead={desk.markRead}
              onMarkAll={desk.markAllRead}
            />
            <SettingsPanel prefs={desk.prefs} onChange={desk.updatePrefs} />
          </>
        ) : null}

        <Footer />
      </WorkspaceShell>

      <QuickActionsFab />
    </>
  );
}
