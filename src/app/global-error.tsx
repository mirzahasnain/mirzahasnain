"use client";

/**
 * Root global-error must define its own html/body (Next.js requirement).
 * Treat as the 500-class fallback for the App Router.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500">500</p>
          <h1 className="text-2xl font-semibold">Server error</h1>
          <p className="text-sm text-slate-400">{error.message}</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
