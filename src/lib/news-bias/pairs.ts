import type {
  DropdownOption,
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
  },
  {
    id: "XAGUSD",
    label: "XAGUSD",
    displayName: "Silver",
    category: "metal",
    usdRelation: "inverse",
    description: "Silver vs US Dollar",
  },
  {
    id: "EURUSD",
    label: "EURUSD",
    displayName: "EURUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "Euro vs US Dollar",
  },
  {
    id: "GBPUSD",
    label: "GBPUSD",
    displayName: "GBPUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "British Pound vs US Dollar",
  },
  {
    id: "USDJPY",
    label: "USDJPY",
    displayName: "USDJPY",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Japanese Yen",
  },
  {
    id: "AUDUSD",
    label: "AUDUSD",
    displayName: "AUDUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "Australian Dollar vs US Dollar",
  },
  {
    id: "NZDUSD",
    label: "NZDUSD",
    displayName: "NZDUSD",
    category: "forex",
    usdRelation: "inverse",
    description: "New Zealand Dollar vs US Dollar",
  },
  {
    id: "USDCAD",
    label: "USDCAD",
    displayName: "USDCAD",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Canadian Dollar",
  },
  {
    id: "USDCHF",
    label: "USDCHF",
    displayName: "USDCHF",
    category: "forex",
    usdRelation: "direct",
    description: "US Dollar vs Swiss Franc",
  },
  {
    id: "BTCUSD",
    label: "BTCUSD",
    displayName: "BTC",
    category: "crypto",
    usdRelation: "inverse",
    description: "Bitcoin vs US Dollar",
  },
  {
    id: "ETHUSD",
    label: "ETHUSD",
    displayName: "ETH",
    category: "crypto",
    usdRelation: "inverse",
    description: "Ethereum vs US Dollar",
  },
  {
    id: "NAS100",
    label: "NAS100",
    displayName: "NASDAQ",
    category: "index",
    usdRelation: "inverse",
    description: "Nasdaq 100 index",
  },
  {
    id: "US30",
    label: "US30",
    displayName: "US30",
    category: "index",
    usdRelation: "inverse",
    description: "Dow Jones 30 index",
  },
  {
    id: "SPX500",
    label: "SPX500",
    displayName: "SPX500",
    category: "index",
    usdRelation: "inverse",
    description: "S&P 500 index",
  },
];

export function findPair(id: PairId | null): TradingPair | null {
  return TRADING_PAIRS.find((pair) => pair.id === id) ?? null;
}

export const tradingPairOptions: DropdownOption<PairId>[] = TRADING_PAIRS.map(
  (pair) => ({
    value: pair.id,
    label: pair.label,
    description: pair.description,
  }),
);
