import { createStore } from "./createStore";
import type { AnalysisRequest } from "@/types";

export interface AnalysisState {
  request: AnalysisRequest | null;
  /** Opaque result payload from engines — typed loosely at foundation layer. */
  result: Record<string, unknown> | null;
  isComputing: boolean;
  lastError: string | null;
  modelVersion: string;
}

const initial: AnalysisState = {
  request: null,
  result: null,
  isComputing: false,
  lastError: null,
  modelVersion: "scoreWeights.v1",
};

export const analysisStore = createStore<AnalysisState>(initial);

export const analysisActions = {
  setRequest(request: AnalysisRequest): void {
    analysisStore.setState({ request, lastError: null });
  },
  setComputing(isComputing: boolean): void {
    analysisStore.setState({ isComputing });
  },
  setResult(result: Record<string, unknown> | null): void {
    analysisStore.setState({ result, isComputing: false, lastError: null });
  },
  setError(lastError: string): void {
    analysisStore.setState({ lastError, isComputing: false });
  },
  clear(): void {
    analysisStore.replace({ ...initial });
  },
};
