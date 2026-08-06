"use client";

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

export function WorkspaceDashboard() {
  const desk = useWorkspaceDashboard();

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
