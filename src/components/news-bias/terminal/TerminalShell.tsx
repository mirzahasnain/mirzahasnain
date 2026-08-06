"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/news-bias/ThemeToggle";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";

interface TerminalShellProps {
  children: React.ReactNode;
  offline?: boolean;
}

export function TerminalShell({ children, offline }: TerminalShellProps) {
  return (
    <main className="relative isolate mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--nb-accent)_16%,transparent),transparent_70%)]"
      />

      <header className="relative">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-nb-faint">
          {TERMINAL_COPY.version}
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-nb-text sm:text-4xl">
          {TERMINAL_COPY.title}
        </h1>
        <p className="mt-1 text-sm text-nb-muted">{TERMINAL_COPY.subtitle}</p>
        <nav className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
          <Link href="/terminal" className="text-nb-accent">
            Terminal
          </Link>
          <Link href="/calendar" className="text-nb-muted hover:text-nb-accent">
            {TERMINAL_COPY.calendar}
          </Link>
          <Link href="/news-bias" className="text-nb-muted hover:text-nb-accent">
            {TERMINAL_COPY.analyze}
          </Link>
        </nav>
        {offline ? (
          <p className="mt-3 rounded-lg border border-nb-wait/40 bg-nb-wait/10 px-3 py-2 text-xs text-nb-wait">
            {TERMINAL_COPY.offline}
          </p>
        ) : null}
      </header>

      {children}
    </main>
  );
}
