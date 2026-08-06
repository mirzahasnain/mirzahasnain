import type { AnalysisRequest } from "@/types";
import { NEWS_SERIES_IDS } from "@/config/newsRules";
import { PAIR_IDS } from "@/config/pairMappings";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateAnalysisRequest(input: AnalysisRequest): ValidationResult {
  const errors: string[] = [];
  if (!input.newsId) errors.push("newsId is required");
  else if (!(NEWS_SERIES_IDS as readonly string[]).includes(input.newsId)) {
    errors.push("newsId is not a known series");
  }
  if (!input.pairId) errors.push("pairId is required");
  else if (!(PAIR_IDS as readonly string[]).includes(input.pairId)) {
    errors.push("pairId is not a known pair");
  }
  const hasNumbers =
    input.actual !== undefined &&
    input.actual !== null &&
    input.forecast !== undefined &&
    input.forecast !== null;
  const hasOutcome = Boolean(input.outcome);
  if (!hasNumbers && !hasOutcome) {
    errors.push("Provide Actual/Forecast numbers or an outcome tap");
  }
  return { ok: errors.length === 0, errors };
}
