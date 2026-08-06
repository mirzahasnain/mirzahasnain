/**
 * Central logging utility — development only.
 * Prefer this over scattered console.log calls.
 */
import { isDevLoggingEnabled } from "@/config/environment";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogMeta {
  readonly [key: string]: unknown;
}

function emit(level: LogLevel, scope: string, message: string, meta?: LogMeta): void {
  if (!isDevLoggingEnabled()) return;
  const prefix = `[${scope}]`;
  const fn = level === "debug" ? "log" : level;
  if (meta) {
    console[fn](prefix, message, meta);
  } else {
    console[fn](prefix, message);
  }
}

export function createLogger(scope: string) {
  return {
    debug: (message: string, meta?: LogMeta) => emit("debug", scope, message, meta),
    info: (message: string, meta?: LogMeta) => emit("info", scope, message, meta),
    warn: (message: string, meta?: LogMeta) => emit("warn", scope, message, meta),
    error: (message: string, meta?: LogMeta) => emit("error", scope, message, meta),
    timed: async <T>(label: string, meta: LogMeta, fn: () => Promise<T>): Promise<T> => {
      const started = Date.now();
      try {
        const result = await fn();
        emit("info", scope, label, {
          ...meta,
          durationMs: Date.now() - started,
          ok: true,
        });
        return result;
      } catch (error: unknown) {
        emit("error", scope, label, {
          ...meta,
          durationMs: Date.now() - started,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  };
}

export const logger = createLogger("tradeimpact");
