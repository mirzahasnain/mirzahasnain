"use client";

import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import type { WorkspaceNotification } from "@/lib/news-bias/modules/types";

interface NotificationsPanelProps {
  items: WorkspaceNotification[];
  unread: number;
  onMarkRead: (id: string) => void;
  onMarkAll: () => void;
}

export function NotificationsPanel({
  items,
  unread,
  onMarkRead,
  onMarkAll,
}: NotificationsPanelProps) {
  return (
    <section
      id="notifications"
      className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-nb-text">
          {WORKSPACE_COPY.sections.notifications}
          {unread > 0 ? (
            <span className="ml-2 rounded-full bg-nb-accent/20 px-2 py-0.5 text-[11px] text-nb-accent">
              {unread}
            </span>
          ) : null}
        </h2>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={onMarkAll}
            className="text-xs font-semibold text-nb-muted hover:text-nb-accent"
          >
            {WORKSPACE_COPY.notifications.markAll}
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-nb-muted">
          {WORKSPACE_COPY.notifications.empty}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.slice(0, 8).map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onMarkRead(item.id)}
                className={[
                  "w-full rounded-xl px-3 py-2.5 text-left",
                  item.read ? "bg-nb-elevated/30" : "bg-nb-elevated/60",
                ].join(" ")}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
                  {labelForKind(item.kind)}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-nb-text">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-nb-muted">{item.body}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function labelForKind(kind: WorkspaceNotification["kind"]): string {
  switch (kind) {
    case "upcoming":
      return WORKSPACE_COPY.notifications.upcoming;
    case "released":
      return WORKSPACE_COPY.notifications.released;
    case "analysis-ready":
      return WORKSPACE_COPY.notifications.analysisReady;
  }
}
