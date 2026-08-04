import { FAVORITE_PAIR_IDS, GROUP_LABELS } from "./constants";
import type {
  DropdownOption,
  OptionSection,
  PairId,
  TradingPair,
} from "./types/interfaces";

export const TRADING_PAIRS: TradingPair[] = [
  {
    id: "XAUUSD",
    label: "XAUUSD",
    displayName: "Gold",
    category: "metal",
    usdRelation: "inverse",
    description: "Gold vs US Dollar",
    keywords: ["gold", "metal", "bullion"],
  },
  {
    id: "XAGUSD",
    label: "XAGUSD",
    displayName: "Silver",
    category: "metal",
    usdRelation: "inverse",
    description: "Silver vs US Dollar",
    keywords: ["silver", "metal"],
  },
  {
    id: "EURUSD",
    label: "EURUSD",
    displayName: "EURUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "Euro vs US Dollar",
    keywords: ["euro", "eur", "fiber"],
  },
  {
    id: "GBPUSD",
    label: "GBPUSD",
    displayName: "GBPUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "British Pound vs US Dollar",
    keywords: ["pound", "sterling", "gbp", "cable"],
  },
  {
    id: "USDJPY",
    label: "USDJPY",
    displayName: "USDJPY",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Japanese Yen",
    keywords: ["yen", "jpy", "japan"],
  },
  {
    id: "AUDUSD",
    label: "AUDUSD",
    displayName: "AUDUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "Australian Dollar vs US Dollar",
    keywords: ["aussie", "aud", "australia"],
  },
  {
    id: "NZDUSD",
    label: "NZDUSD",
    displayName: "NZDUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "New Zealand Dollar vs US Dollar",
    keywords: ["kiwi", "nzd", "new zealand"],
  },
  {
    id: "USDCAD",
    label: "USDCAD",
    displayName: "USDCAD",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Canadian Dollar",
    keywords: ["loonie", "cad", "canada"],
  },
  {
    id: "USDCHF",
    label: "USDCHF",
    displayName: "USDCHF",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Swiss Franc",
    keywords: ["franc", "chf", "swiss", "swissy"],
  },
  {
    id: "BTCUSD",
    label: "BTCUSD",
    displayName: "BTC",
    category: "crypto",
    usdRelation: "inverse",
    description: "Bitcoin vs US Dollar",
    keywords: ["bitcoin", "btc", "crypto"],
  },
  {
    id: "ETHUSD",
    label: "ETHUSD",
    displayName: "ETH",
    category: "crypto",
    usdRelation: "inverse",
    description: "Ethereum vs US Dollar",
    keywords: ["ethereum", "ether", "eth", "crypto"],
  },
  {
    id: "NAS100",
    label: "NAS100",
    displayName: "NASDAQ",
    category: "index",
    usdRelation: "inverse",
    description: "Nasdaq 100 index",
    keywords: ["nasdaq", "nas", "tech", "index"],
  },
  {
    id: "US30",
    label: "US30",
    displayName: "US30",
    category: "index",
    usdRelation: "inverse",
    description: "Dow Jones 30 index",
    keywords: ["dow", "dow jones", "index"],
  },
  {
    id: "SPX500",
    label: "SPX500",
    displayName: "SPX500",
    category: "index",
    usdRelation: "inverse",
    description: "S&P 500 index",
    keywords: ["s&p", "sp500", "spx", "index"],
  },
];

export function findPair(id: PairId | null): TradingPair | null {
  return TRADING_PAIRS.find((pair) => pair.id === id) ?? null;
}

export const tradingPairOptions: DropdownOption<PairId>[] = TRADING_PAIRS.map(
  toOption,
);

/** Matches ticker, trader-facing name, description and keywords. */
export function searchPairs(query: string): TradingPair[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return TRADING_PAIRS;

  return TRADING_PAIRS.filter((pair) =>
    [pair.label, pair.displayName, pair.description, ...pair.keywords].some(
      (term) => term.toLowerCase().includes(needle),
    ),
  );
}

/**
 * Favourites first when browsing; a flat list of matches when searching, since
 * grouping a short result list only adds noise.
 */
export function getPairSections(query: string): OptionSection<PairId>[] {
  const matches = searchPairs(query);

  if (query.trim()) {
    return [{ id: "results", options: matches.map(toOption) }];
  }

  const favorites = matches
    .filter((pair) => FAVORITE_PAIR_IDS.includes(pair.id))
    .sort((a, b) => FAVORITE_PAIR_IDS.indexOf(a.id) - FAVORITE_PAIR_IDS.indexOf(b.id));
  const rest = matches.filter((pair) => !FAVORITE_PAIR_IDS.includes(pair.id));

  return [
    {
      id: "favorites",
      label: GROUP_LABELS.favorites,
      options: favorites.map(toOption),
    },
    {
      id: "all",
      label: GROUP_LABELS.allPairs,
      options: rest.map(toOption),
    },
  ];
}

function toOption(pair: TradingPair): DropdownOption<PairId> {
  return {
    value: pair.id,
    label: pair.label,
    description: pair.description,
  };
}
