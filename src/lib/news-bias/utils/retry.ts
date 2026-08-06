import { calendarLogger } from "./logger";

export interface RetryOptions {
  maxAttempts: number;
  /** Base delay in ms; doubles each attempt. */
  baseDelayMs?: number;
  label?: string;
  provider?: string;
}

/** Config / auth failures that should not be retried. */
export class NonRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NonRetryableError";
  }
}

/**
 * Retries an async operation up to maxAttempts times (default 3).
 * Throws the last error when all attempts fail.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const maxAttempts = Math.max(1, options.maxAttempts);
  const baseDelayMs = options.baseDelayMs ?? 250;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      calendarLogger.warn("retry", {
        label: options.label ?? "operation",
        provider: options.provider,
        attempt,
        maxAttempts,
        error: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof NonRetryableError) break;
      if (attempt < maxAttempts) {
        await sleep(baseDelayMs * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError ?? "Unknown retry failure"));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
