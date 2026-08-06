import type {
  EconomicEvent,
  EventImpact,
} from "../../types/event";

/**
 * TradingEconomics calendar payload (subset).
 * Real responses vary — keep this mapper defensive.
 */
export interface TradingEconomicsRawEvent {
  CalendarId?: string | number;
  id?: string | number;
  Country?: string;
  country?: string;
  Category?: string;
  Event?: string;
  event?: string;
  Reference?: string;
  Source?: string;
  SourceURL?: string;
  Actual?: string | number | null;
  Previous?: string | number | null;
  Forecast?: string | number | null;
  TEForecast?: string | number | null;
  Date?: string;
  date?: string;
  Importance?: number | string;
  currency?: string;
  Currency?: string;
  Unit?: string;
  Revised?: string | number | null;
}

export function mapTradingEconomicsEvent(
  raw: TradingEconomicsRawEvent,
): EconomicEvent | null {
  const title = String(raw.Event ?? raw.event ?? raw.Category ?? "").trim();
  const datetimeRaw = raw.Date ?? raw.date;
  if (!title || !datetimeRaw) return null;

  const datetime = normalizeDateTime(String(datetimeRaw));
  const id = String(raw.CalendarId ?? raw.id ?? `${title}-${datetime}`);
  const country = String(raw.Country ?? raw.country ?? "");
  const currency = String(
    raw.Currency ?? raw.currency ?? inferCurrency(country),
  );

  return {
    id,
    country,
    currency,
    title,
    impact: mapImportance(raw.Importance),
    forecast: toNumber(raw.Forecast ?? raw.TEForecast),
    previous: toNumber(raw.Previous),
    actual: toNumber(raw.Actual),
    date: datetime.slice(0, 10),
    time: datetime.slice(11, 16),
    datetime,
    unit: raw.Unit ? String(raw.Unit) : null,
    revised: toNumber(raw.Revised),
    source: "trading-economics",
    newsId: inferNewsId(title),
  };
}

function mapImportance(value: number | string | undefined): EventImpact {
  const n = typeof value === "string" ? Number(value) : value;
  if (n === 3 || n === 2.5) return "high";
  if (n === 2) return "medium";
  return "low";
}

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[%,]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function normalizeDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.includes("T") ? value : `${value}T00:00:00.000Z`;
  }
  return parsed.toISOString();
}

function inferCurrency(country: string): string {
  const map: Record<string, string> = {
    "United States": "USD",
    "Euro Area": "EUR",
    Eurozone: "EUR",
    "United Kingdom": "GBP",
    Japan: "JPY",
    Australia: "AUD",
    Canada: "CAD",
    Switzerland: "CHF",
    "New Zealand": "NZD",
  };
  return map[country] ?? "USD";
}

function inferNewsId(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("nonfarm") || t.includes("non-farm") || t.includes("nfp"))
    return "nfp";
  if (t.includes("core cpi")) return "core-cpi";
  if (t.includes("cpi")) return "cpi";
  if (t.includes("core pce")) return "core-pce";
  if (t.includes("unemployment")) return "unemployment-rate";
  if (t.includes("fomc")) return "fomc-statement";
  if (t.includes("interest rate") || t.includes("fed funds"))
    return "interest-rate-decision";
  if (t.includes("ism manufacturing") || t.includes("manufacturing pmi"))
    return "ism-manufacturing-pmi";
  if (t.includes("gdp")) return "gdp";
  if (t.includes("retail sales")) return "retail-sales";
  if (t.includes("core ppi")) return "core-ppi";
  if (t.includes("ppi")) return "ppi";
  return null;
}
