import type { DropdownOption, NewsEvent, NewsEventId } from "./types";

export const NEWS_EVENTS: NewsEvent[] = [
  {
    id: "cpi",
    label: "CPI",
    description: "Headline consumer inflation",
    explanation: {
      above:
        "Higher-than-expected CPI points to hotter inflation, which usually strengthens the US Dollar.",
      below:
        "Lower-than-expected CPI points to cooling inflation, which usually weakens the US Dollar.",
    },
  },
  {
    id: "core-cpi",
    label: "Core CPI",
    description: "Consumer inflation excluding food & energy",
    explanation: {
      above:
        "Higher-than-expected Core CPI shows underlying inflation running hot, which usually strengthens the US Dollar.",
      below:
        "Lower-than-expected Core CPI shows underlying inflation easing, which usually weakens the US Dollar.",
    },
  },
  {
    id: "ppi",
    label: "PPI",
    description: "Headline producer inflation",
    explanation: {
      above:
        "Higher-than-expected PPI signals rising cost pressure at the producer level, which usually strengthens the US Dollar.",
      below:
        "Lower-than-expected PPI signals easing cost pressure at the producer level, which usually weakens the US Dollar.",
    },
  },
  {
    id: "core-ppi",
    label: "Core PPI",
    description: "Producer inflation excluding food & energy",
    explanation: {
      above:
        "Higher-than-expected Core PPI points to sticky producer costs, which usually strengthens the US Dollar.",
      below:
        "Lower-than-expected Core PPI points to fading producer costs, which usually weakens the US Dollar.",
    },
  },
  {
    id: "nfp",
    label: "NFP",
    description: "Non-farm payrolls job growth",
    explanation: {
      above:
        "A higher-than-expected NFP print shows a stronger labour market, which usually strengthens the US Dollar.",
      below:
        "A lower-than-expected NFP print shows a softer labour market, which usually weakens the US Dollar.",
    },
  },
  {
    id: "unemployment-rate",
    label: "Unemployment Rate",
    description: "Share of the labour force out of work",
    explanation: {
      above:
        "The Unemployment Rate came in above forecast, and an above-forecast release is treated as US Dollar positive.",
      below:
        "The Unemployment Rate came in below forecast, and a below-forecast release is treated as US Dollar negative.",
    },
  },
  {
    id: "interest-rate-decision",
    label: "Interest Rate Decision",
    description: "Federal funds rate announcement",
    explanation: {
      above:
        "A higher-than-expected rate decision is hawkish, which usually strengthens the US Dollar.",
      below:
        "A lower-than-expected rate decision is dovish, which usually weakens the US Dollar.",
    },
  },
  {
    id: "fomc-statement",
    label: "FOMC Statement",
    description: "Policy tone from the Fed committee",
    explanation: {
      above:
        "A more hawkish-than-expected FOMC statement usually strengthens the US Dollar.",
      below:
        "A more dovish-than-expected FOMC statement usually weakens the US Dollar.",
    },
  },
  {
    id: "ism-manufacturing-pmi",
    label: "ISM Manufacturing PMI",
    description: "Factory sector activity survey",
    explanation: {
      above:
        "Higher-than-expected ISM Manufacturing PMI signals expanding factory activity, which usually strengthens the US Dollar.",
      below:
        "Lower-than-expected ISM Manufacturing PMI signals slowing factory activity, which usually weakens the US Dollar.",
    },
  },
  {
    id: "ism-services-pmi",
    label: "ISM Services PMI",
    description: "Services sector activity survey",
    explanation: {
      above:
        "Higher-than-expected ISM Services PMI signals a resilient services sector, which usually strengthens the US Dollar.",
      below:
        "Lower-than-expected ISM Services PMI signals a cooling services sector, which usually weakens the US Dollar.",
    },
  },
  {
    id: "gdp",
    label: "GDP",
    description: "Gross domestic product growth",
    explanation: {
      above:
        "Stronger-than-expected GDP growth points to a resilient economy, which usually strengthens the US Dollar.",
      below:
        "Weaker-than-expected GDP growth points to a slowing economy, which usually weakens the US Dollar.",
    },
  },
  {
    id: "retail-sales",
    label: "Retail Sales",
    description: "Consumer spending at retail level",
    explanation: {
      above:
        "Stronger-than-expected Retail Sales show healthy consumer demand, which usually strengthens the US Dollar.",
      below:
        "Weaker-than-expected Retail Sales show softer consumer demand, which usually weakens the US Dollar.",
    },
  },
  {
    id: "core-pce",
    label: "Core PCE",
    description: "The Fed's preferred inflation gauge",
    explanation: {
      above:
        "Higher-than-expected Core PCE keeps pressure on the Fed to stay restrictive, which usually strengthens the US Dollar.",
      below:
        "Lower-than-expected Core PCE gives the Fed room to ease, which usually weakens the US Dollar.",
    },
  },
];

export function findEvent(id: NewsEventId | null): NewsEvent | null {
  return NEWS_EVENTS.find((event) => event.id === id) ?? null;
}

export const newsEventOptions: DropdownOption<NewsEventId>[] = NEWS_EVENTS.map(
  (event) => ({
    value: event.id,
    label: event.label,
    description: event.description,
  }),
);
