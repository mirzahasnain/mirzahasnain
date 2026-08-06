"use client";

import { useEffect } from "react";
import { createLogger } from "@/utils/logger";
import { application } from "@/config/application";

const log = createLogger("app/error");

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    log.error("Route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center text-nb-text">
      <p className="text-sm uppercase tracking-widest text-nb-faint">Error</p>
      <h1 className="text-2xl font-semibold text-nb-text">Something went wrong</h1>
      <p className="text-sm text-nb-muted">
        {error.message ||
          "We could not load this screen. Your data on this device is unchanged."}
      </p>
      <p className="text-xs text-nb-faint">{application.disclaimer}</p>
      <button
        type="button"
        onClick={reset}
        className="min-h-11 rounded-full bg-nb-accent px-5 text-sm font-semibold text-nb-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
      >
        Try again
      </button>
    </main>
  );
}
