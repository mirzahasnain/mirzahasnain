import type { SurpriseSign } from "../types/interfaces";

/** Decimals kept when subtracting, enough to absorb float noise. */
const PRECISION = 4;
/** Decimals shown to the trader. */
const DISPLAY_PRECISION = 2;

export function calculateSurprise(actual: number, forecast: number): number {
  return round(actual - forecast, PRECISION);
}

export function getSurpriseSign(surprise: number): SurpriseSign {
  if (surprise > 0) return "positive";
  if (surprise < 0) return "negative";
  return "flat";
}

/** Signed and trimmed, e.g. `+1.6`, `-0.35`, `0`. */
export function formatSurprise(surprise: number): string {
  const trimmed = formatNumber(surprise);
  return surprise > 0 ? `+${trimmed}` : trimmed;
}

export function formatNumber(value: number): string {
  return String(round(value, DISPLAY_PRECISION));
}

/** Parses a text field into a number, treating blank or partial input as empty. */
export function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
