"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/news-bias/ThemeToggle";

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
    <main className="relative isolate mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-14">
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
              className="text-xs font-semibold uppercase tracking-[0.18em] text-nb-muted hover:text-nb-accent focus:outline-none focus-visible:underline"
            >
              ← {backLabel ?? "Back"}
            </Link>
          </div>
        ) : null}
        <h1 className="text-3xl font-black tracking-tight text-nb-text sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-nb-muted sm:text-base">{subtitle}</p>
        ) : null}
        <nav className="mt-4 flex justify-center gap-4 text-xs font-semibold uppercase tracking-[0.18em]">
          <Link href="/calendar" className="text-nb-accent hover:underline">
            Calendar
          </Link>
          <Link href="/news-bias" className="text-nb-muted hover:text-nb-accent">
            Analysis
          </Link>
        </nav>
      </header>

      {children}
    </main>
  );
}
