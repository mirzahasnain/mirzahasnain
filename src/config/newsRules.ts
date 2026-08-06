/**
 * Configurable news-rule catalog (IDs). Full rule payloads remain in engine JSON.
 */
export const NEWS_SERIES_IDS = [
  "cpi",
  "core-cpi",
  "ppi",
  "core-ppi",
  "nfp",
  "unemployment-rate",
  "interest-rate-decision",
  "fomc-statement",
  "ism-manufacturing-pmi",
  "ism-services-pmi",
  "gdp",
  "retail-sales",
  "core-pce",
] as const;

export type NewsSeriesId = (typeof NEWS_SERIES_IDS)[number];

export const NEWS_SERIES_META: Record<
  NewsSeriesId,
  { label: string; higherIsUsdBullish: boolean | "tone" }
> = {
  cpi: { label: "CPI", higherIsUsdBullish: true },
  "core-cpi": { label: "Core CPI", higherIsUsdBullish: true },
  ppi: { label: "PPI", higherIsUsdBullish: true },
  "core-ppi": { label: "Core PPI", higherIsUsdBullish: true },
  nfp: { label: "Nonfarm Payrolls", higherIsUsdBullish: true },
  "unemployment-rate": {
    label: "Unemployment Rate",
    higherIsUsdBullish: false,
  },
  "interest-rate-decision": {
    label: "Interest Rate Decision",
    higherIsUsdBullish: "tone",
  },
  "fomc-statement": { label: "FOMC Statement", higherIsUsdBullish: "tone" },
  "ism-manufacturing-pmi": {
    label: "ISM Manufacturing PMI",
    higherIsUsdBullish: true,
  },
  "ism-services-pmi": {
    label: "ISM Services PMI",
    higherIsUsdBullish: true,
  },
  gdp: { label: "GDP", higherIsUsdBullish: true },
  "retail-sales": { label: "Retail Sales", higherIsUsdBullish: true },
  "core-pce": { label: "Core PCE", higherIsUsdBullish: true },
};
