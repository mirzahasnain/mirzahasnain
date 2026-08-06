/**
 * Economic calendar logger — wraps central TradeImpact logger (dev-only).
 */
import { createLogger } from "@/utils/logger";

const log = createLogger("economic-calendar");

export const calendarLogger = {
  info: (message: string, meta?: Record<string, unknown>) => log.info(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log.warn(message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log.error(message, meta),
  timed<T>(
    label: string,
    meta: Record<string, unknown>,
    fn: () => Promise<T>,
  ): Promise<T> {
    return log.timed(label, meta, fn);
  },
};
