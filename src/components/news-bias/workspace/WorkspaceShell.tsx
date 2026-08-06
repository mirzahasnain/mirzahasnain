"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/news-bias/ThemeToggle";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";

interface WorkspaceShellProps {
  children: React.ReactNode;
  offline?: boolean;
}

export function WorkspaceShell({ children, offline }: WorkspaceShellProps) {
  return (
    <main className="relative isolate mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col gap-6 px-4 py-6 pb-28 sm:px-6 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--nb-accent)_16%,transparent),transparent_70%)]"
      />

      <header className="relative">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-nb-faint">
          {WORKSPACE_COPY.version}
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-nb-text sm:text-4xl">
          {WORKSPACE_COPY.title}
        </h1>
        <p className="mt-1 text-sm text-nb-muted">{WORKSPACE_COPY.subtitle}</p>
        <nav className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
          <Link href="/workspace" className="text-nb-accent">
            Workspace
          </Link>
          <Link href="/calendar" className="text-nb-muted hover:text-nb-accent">
            {WORKSPACE_COPY.calendar}
          </Link>
          <Link href="/terminal" className="text-nb-muted hover:text-nb-accent">
            {WORKSPACE_COPY.terminal}
          </Link>
          <Link href="/news-bias" className="text-nb-muted hover:text-nb-accent">
            {WORKSPACE_COPY.analyze}
          </Link>
        </nav>
        {offline ? (
          <p className="mt-3 rounded-lg border border-nb-wait/40 bg-nb-wait/10 px-3 py-2 text-xs text-nb-wait">
            {WORKSPACE_COPY.offline}
          </p>
        ) : null}
      </header>

      {children}
    </main>
  );
}
