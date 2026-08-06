"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/news-bias/ThemeToggle";
import { AppNav } from "@/components/news-bias/AppNav";

interface CalendarShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function CalendarShell({
  title,
  subtitle,
  children,
  backHref,
  backLabel,
}: CalendarShellProps) {
  return (
    <main className="relative isolate mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-14">
      <a
        href="#calendar-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-nb-surface focus:px-3 focus:py-2 focus:text-sm focus:text-nb-text"
      >
        Skip to content
      </a>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--nb-accent)_18%,transparent),transparent_65%)]"
      />

      <header className="relative text-center">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        {backHref ? (
          <div className="mb-4 text-left">
            <Link
              href={backHref}
              className="inline-flex min-h-9 items-center text-xs font-semibold uppercase tracking-[0.18em] text-nb-muted hover:text-nb-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
            >
              ← {backLabel ?? "Back"}
            </Link>
          </div>
        ) : null}
        <h1 className="pr-10 text-3xl font-black tracking-tight text-nb-text sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-nb-muted sm:text-base">{subtitle}</p>
        ) : null}
        <AppNav align="center" />
      </header>

      <div id="calendar-main" className="flex flex-col gap-6">
        {children}
      </div>
    </main>
  );
}
