import type { NewsEvent, TradingPair } from "./types";

export const APP = {
  title: "News Bias Tool",
  subtitle: "Select a News Event, Trading Pair and Result",
  version: "Version 1.0 MVP",
  tagline:
    "Instant directional bias for high-impact USD economic releases.",
} as const;

export const NEWS_EVENTS: NewsEvent[] = [
  { id: "cpi", label: "CPI", description: "Headline consumer inflation" },
  {
    id: "core-cpi",
    label: "Core CPI",
    description: "Consumer inflation excluding food & energy",
  },
  { id: "ppi", label: "PPI", description: "Headline producer inflation" },
  {
    id: "core-ppi",
    label: "Core PPI",
    description: "Producer inflation excluding food & energy",
  },
  { id: "nfp", label: "NFP", description: "Non-farm payrolls job growth" },
  {
    id: "unemployment-rate",
    label: "Unemployment Rate",
    description: "Share of the labour force out of work",
  },
  {
    id: "interest-rate-decision",
    label: "Interest Rate Decision",
    description: "Federal funds rate announcement",
  },
  {
    id: "fomc-statement",
    label: "FOMC Statement",
    description: "Policy tone from the Fed committee",
  },
  {
    id: "ism-manufacturing-pmi",
    label: "ISM Manufacturing PMI",
    description: "Factory sector activity survey",
  },
  {
    id: "ism-services-pmi",
    label: "ISM Services PMI",
    description: "Services sector activity survey",
  },
  { id: "gdp", label: "GDP", description: "Gross domestic product growth" },
  {
    id: "retail-sales",
    label: "Retail Sales",
    description: "Consumer spending at retail level",
  },
  {
    id: "core-pce",
    label: "Core PCE",
    description: "The Fed's preferred inflation gauge",
  },
];

export const TRADING_PAIRS: TradingPair[] = [
  {
    id: "XAUUSD",
    label: "XAUUSD",
    category: "metal",
    usdRelation: "inverse",
    description: "Gold vs US Dollar",
  },
  {
    id: "XAGUSD",
    label: "XAGUSD",
    category: "metal",
    usdRelation: "inverse",
    description: "Silver vs US Dollar",
  },
  {
    id: "EURUSD",
    label: "EURUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "Euro vs US Dollar",
  },
  {
    id: "GBPUSD",
    label: "GBPUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "British Pound vs US Dollar",
  },
  {
    id: "USDJPY",
    label: "USDJPY",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Japanese Yen",
  },
  {
    id: "AUDUSD",
    label: "AUDUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "Australian Dollar vs US Dollar",
  },
  {
    id: "NZDUSD",
    label: "NZDUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "New Zealand Dollar vs US Dollar",
  },
  {
    id: "USDCAD",
    label: "USDCAD",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Canadian Dollar",
  },
  {
    id: "USDCHF",
    label: "USDCHF",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Swiss Franc",
  },
  {
    id: "BTCUSD",
    label: "BTCUSD",
    category: "crypto",
    usdRelation: "inverse",
    description: "Bitcoin vs US Dollar",
  },
  {
    id: "ETHUSD",
    label: "ETHUSD",
    category: "crypto",
    usdRelation: "inverse",
    description: "Ethereum vs US Dollar",
  },
  {
    id: "NAS100",
    label: "NAS100",
    category: "index",
    usdRelation: "inverse",
    description: "Nasdaq 100 index",
  },
  {
    id: "US30",
    label: "US30",
    category: "index",
    usdRelation: "inverse",
    description: "Dow Jones 30 index",
  },
  {
    id: "SPX500",
    label: "SPX500",
    category: "index",
    usdRelation: "inverse",
    description: "S&P 500 index",
  },
];

export const OUTCOME_LABELS = {
  above: "Actual > Forecast",
  below: "Actual < Forecast",
} as const;

export const BIAS_LABELS = {
  bullish: "Bullish",
  bearish: "Bearish",
} as const;
