import { NEWS_PRESET_IDS } from "./constants";
import type {
  DropdownOption,
  NewsEvent,
  NewsEventId,
} from "./types/interfaces";

export const NEWS_EVENTS: NewsEvent[] = [
  {
    id: "cpi",
    label: "CPI",
    description: "Headline consumer inflation",
    dollarEffect: {
      positive:
        "Higher-than-expected CPI points to hotter inflation, which usually strengthens the US Dollar.",
      negative:
        "Lower-than-expected CPI points to cooling inflation, which usually weakens the US Dollar.",
    },
  },
  {
    id: "core-cpi",
    label: "Core CPI",
    description: "Consumer inflation excluding food & energy",
    dollarEffect: {
      positive:
        "Higher-than-expected Core CPI shows underlying inflation running hot, which usually strengthens the US Dollar.",
      negative:
        "Lower-than-expected Core CPI shows underlying inflation easing, which usually weakens the US Dollar.",
    },
  },
  {
    id: "ppi",
    label: "PPI",
    description: "Headline producer inflation",
    dollarEffect: {
      positive:
        "Higher-than-expected PPI signals rising cost pressure at the producer level, which usually strengthens the US Dollar.",
      negative:
        "Lower-than-expected PPI signals easing cost pressure at the producer level, which usually weakens the US Dollar.",
    },
  },
  {
    id: "core-ppi",
    label: "Core PPI",
    description: "Producer inflation excluding food & energy",
    dollarEffect: {
      positive:
        "Higher-than-expected Core PPI points to sticky producer costs, which usually strengthens the US Dollar.",
      negative:
        "Lower-than-expected Core PPI points to fading producer costs, which usually weakens the US Dollar.",
    },
  },
  {
    id: "nfp",
    label: "NFP",
    description: "Non-farm payrolls job growth",
    dollarEffect: {
      positive:
        "A higher-than-expected NFP print shows a stronger labour market, which usually strengthens the US Dollar.",
      negative:
        "A lower-than-expected NFP print shows a softer labour market, which usually weakens the US Dollar.",
    },
  },
  {
    id: "unemployment-rate",
    label: "Unemployment Rate",
    description: "Share of the labour force out of work",
    dollarEffect: {
      positive:
        "The Unemployment Rate came in above forecast, and an above-forecast release is treated as US Dollar positive.",
      negative:
        "The Unemployment Rate came in below forecast, and a below-forecast release is treated as US Dollar negative.",
    },
  },
  {
    id: "interest-rate-decision",
    shortLabel: "Interest Rate",
    label: "Interest Rate Decision",
    description: "Federal funds rate announcement",
    dollarEffect: {
      positive:
        "A higher-than-expected rate decision is hawkish, which usually strengthens the US Dollar.",
      negative:
        "A lower-than-expected rate decision is dovish, which usually weakens the US Dollar.",
    },
  },
  {
    id: "fomc-statement",
    shortLabel: "FOMC",
    label: "FOMC Statement",
    description: "Policy tone from the Fed committee",
    dollarEffect: {
      positive:
        "A more hawkish-than-expected FOMC statement usually strengthens the US Dollar.",
      negative:
        "A more dovish-than-expected FOMC statement usually weakens the US Dollar.",
    },
  },
  {
    id: "ism-manufacturing-pmi",
    shortLabel: "ISM PMI",
    label: "ISM Manufacturing PMI",
    description: "Factory sector activity survey",
    dollarEffect: {
      positive:
        "Higher-than-expected ISM Manufacturing PMI signals expanding factory activity, which usually strengthens the US Dollar.",
      negative:
        "Lower-than-expected ISM Manufacturing PMI signals slowing factory activity, which usually weakens the US Dollar.",
    },
  },
  {
    id: "ism-services-pmi",
    label: "ISM Services PMI",
    description: "Services sector activity survey",
    dollarEffect: {
      positive:
        "Higher-than-expected ISM Services PMI signals a resilient services sector, which usually strengthens the US Dollar.",
      negative:
        "Lower-than-expected ISM Services PMI signals a cooling services sector, which usually weakens the US Dollar.",
    },
  },
  {
    id: "gdp",
    label: "GDP",
    description: "Gross domestic product growth",
    dollarEffect: {
      positive:
        "Stronger-than-expected GDP growth points to a resilient economy, which usually strengthens the US Dollar.",
      negative:
        "Weaker-than-expected GDP growth points to a slowing economy, which usually weakens the US Dollar.",
    },
  },
  {
    id: "retail-sales",
    label: "Retail Sales",
    description: "Consumer spending at retail level",
    dollarEffect: {
      positive:
        "Stronger-than-expected Retail Sales show healthy consumer demand, which usually strengthens the US Dollar.",
      negative:
        "Weaker-than-expected Retail Sales show softer consumer demand, which usually weakens the US Dollar.",
    },
  },
  {
    id: "core-pce",
    label: "Core PCE",
    description: "The Fed's preferred inflation gauge",
    dollarEffect: {
      positive:
        "Higher-than-expected Core PCE keeps pressure on the Fed to stay restrictive, which usually strengthens the US Dollar.",
      negative:
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

/** The handful of releases traders reach for most, labelled compactly. */
export const newsPresetOptions: DropdownOption<NewsEventId>[] =
  NEWS_PRESET_IDS.flatMap((id) => {
    const event = findEvent(id);
    return event
      ? [{ value: event.id, label: event.shortLabel ?? event.label }]
      : [];
  });
