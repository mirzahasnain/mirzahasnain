/**
 * TradeImpact application metadata.
 * PRD: product identity — not financial advice; decision-support SaaS.
 */
export const application = {
  name: "TradeImpact",
  tagline: "Know the Impact Before You Trade.",
  version: "1.0.0-sprint1",
  marketingVersion: "13.0",
  scoreTrademark: "TradeImpact Score™",
  disclaimer:
    "Educational reference only. Not financial advice. Trading involves substantial risk of loss.",
  repositoryLayout: "foundation",
} as const;

export type ApplicationConfig = typeof application;
