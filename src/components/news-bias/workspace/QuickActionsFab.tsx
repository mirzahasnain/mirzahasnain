"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  History,
  Sparkles,
} from "lucide-react";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";

const ACTIONS = [
  {
    href: "/news-bias",
    label: WORKSPACE_COPY.quick.analyze,
    icon: Sparkles,
  },
  {
    href: "/calendar",
    label: WORKSPACE_COPY.quick.calendar,
    icon: CalendarDays,
  },
  {
    href: "/news-bias#recent",
    label: WORKSPACE_COPY.quick.history,
    icon: History,
  },
  {
    href: "/workspace#journal",
    label: WORKSPACE_COPY.quick.journal,
    icon: BookOpen,
  },
] as const;

export function QuickActionsFab() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <nav
        aria-label="Quick actions"
        className="pointer-events-auto flex max-w-md items-center gap-1 rounded-full border border-nb-border bg-nb-surface/95 p-1.5 shadow-lg backdrop-blur"
      >
        {ACTIONS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href + label}
            href={href}
            className="inline-flex min-h-11 min-w-11 flex-col items-center justify-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-wider text-nb-muted hover:bg-nb-elevated hover:text-nb-text"
          >
            <Icon aria-hidden className="size-4" />
            <span className="mt-0.5">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
