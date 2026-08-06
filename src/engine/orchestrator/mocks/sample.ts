import type { BrainInput } from "../runBrain";

export const mockHotCpiGoldBrainInput: BrainInput = {
  newsId: "cpi",
  currency: "USD",
  forecast: 3.2,
  previous: 3.1,
  actual: 3.5,
  pairId: "XAUUSD",
  mode: "post_release",
};

export const mockPreReleaseCpiInput: BrainInput = {
  newsId: "cpi",
  currency: "USD",
  forecast: 3.2,
  previous: 3.1,
  actual: null,
  pairId: "XAUUSD",
  mode: "pre_release",
};
