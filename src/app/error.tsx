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
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm uppercase tracking-widest text-slate-500">Error</p>
      <h1 className="text-2xl font-semibold text-slate-100">Something went wrong</h1>
      <p className="text-sm text-slate-400">{error.message}</p>
      <p className="text-xs text-slate-500">{application.disclaimer}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950"
      >
        Try again
      </button>
    </main>
  );
}
