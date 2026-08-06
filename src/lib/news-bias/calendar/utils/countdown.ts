export interface CountdownState {
  /** Milliseconds until release (negative after release). */
  remainingMs: number;
  isReleased: boolean;
  /** e.g. "02h 15m 33s" */
  label: string;
  /** Full phrase: "Starts in 02h 15m 33s" or "Released 03m ago" */
  phrase: string;
}

function pad(n: number): string {
  return String(Math.floor(n)).padStart(2, "0");
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(Math.abs(ms) / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (hours > 0) return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  if (minutes > 0) return `${pad(minutes)}m ${pad(seconds)}s`;
  return `${pad(seconds)}s`;
}

export function getCountdown(
  releaseAt: string,
  now: number = Date.now(),
): CountdownState {
  const target = new Date(releaseAt).getTime();
  const remainingMs = target - now;
  const isReleased = remainingMs <= 0;
  const label = formatDuration(remainingMs);

  return {
    remainingMs,
    isReleased,
    label,
    phrase: isReleased ? `Released ${label} ago` : `Starts in ${label}`,
  };
}
