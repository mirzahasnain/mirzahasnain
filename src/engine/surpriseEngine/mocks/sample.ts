import type { SurpriseInput } from "../types";

export const mockHotCpiSurpriseInput: SurpriseInput = {
  forecast: 3.2,
  actual: 3.5,
  outcome: null,
};

export const mockInlineSurpriseInput: SurpriseInput = {
  forecast: 3.2,
  actual: 3.2,
  outcome: null,
};

export const mockEstimateBeatInput: SurpriseInput = {
  forecast: null,
  actual: null,
  outcome: "beat",
};
