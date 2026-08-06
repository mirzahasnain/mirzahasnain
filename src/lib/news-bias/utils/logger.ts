import { isDevLoggingEnabled } from "./env";

type LogLevel = "info" | "warn" | "error";

function emit(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>,
): void {
  if (!isDevLoggingEnabled()) return;
  const payload = meta ? { ...meta } : undefined;
  // Development-only diagnostics — silent in production builds.
  console[level](`[economic-calendar] ${message}`, payload ?? "");
}

export const calendarLogger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    emit("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    emit("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    emit("error", message, meta),
  timed<T>(
    label: string,
    meta: Record<string, unknown>,
    fn: () => Promise<T>,
  ): Promise<T> {
    const started = Date.now();
    return fn()
      .then((result) => {
        emit("info", label, {
          ...meta,
          durationMs: Date.now() - started,
          ok: true,
        });
        return result;
      })
      .catch((error: unknown) => {
        emit("error", label, {
          ...meta,
          durationMs: Date.now() - started,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      });
  },
};
