/**
 * Rule Loader — loads all TradeImpact JSON rules (no network).
 */
import adp_rule from "../macro/adp.json";
import consumer_confidence_rule from "../macro/consumer-confidence.json";
import core_cpi_rule from "../macro/core-cpi.json";
import core_pce_rule from "../macro/core-pce.json";
import cpi_rule from "../macro/cpi.json";
import durable_goods_rule from "../macro/durable-goods.json";
import gdp_rule from "../macro/gdp.json";
import ism_manufacturing_rule from "../macro/ism-manufacturing.json";
import ism_services_rule from "../macro/ism-services.json";
import jolts_rule from "../macro/jolts.json";
import nfp_rule from "../macro/nfp.json";
import pmi_rule from "../macro/pmi.json";
import ppi_rule from "../macro/ppi.json";
import retail_sales_rule from "../macro/retail-sales.json";
import unemployment_rate_rule from "../macro/unemployment-rate.json";
import trade_balance_rule from "../forex/trade-balance.json";
import usd_majors_profile_rule from "../forex/usd-majors-profile.json";
import crude_inventories_rule from "../commodities/crude-inventories.json";
import metals_profile_rule from "../commodities/metals-profile.json";
import crypto_etf_flows_rule from "../crypto/crypto-etf-flows.json";
import crypto_risk_profile_rule from "../crypto/crypto-risk-profile.json";
import michigan_sentiment_rule from "../indices/michigan-sentiment.json";
import us_indices_profile_rule from "../indices/us-indices-profile.json";
import fomc_rule from "../central-banks/fomc.json";
import interest_rate_rule from "../central-banks/interest-rate.json";
import manifestJson from "../manifest.json";
import { assertValidRule } from "../validator";
import type { RulesManifest, TradeImpactRule } from "../types";

const RAW_ENTRIES: [string, unknown][] = [
  ["adp", adp_rule],
  ["consumer-confidence", consumer_confidence_rule],
  ["core-cpi", core_cpi_rule],
  ["core-pce", core_pce_rule],
  ["cpi", cpi_rule],
  ["durable-goods", durable_goods_rule],
  ["gdp", gdp_rule],
  ["ism-manufacturing", ism_manufacturing_rule],
  ["ism-services", ism_services_rule],
  ["jolts", jolts_rule],
  ["nfp", nfp_rule],
  ["pmi", pmi_rule],
  ["ppi", ppi_rule],
  ["retail-sales", retail_sales_rule],
  ["unemployment-rate", unemployment_rate_rule],
  ["trade-balance", trade_balance_rule],
  ["usd-majors-profile", usd_majors_profile_rule],
  ["crude-inventories", crude_inventories_rule],
  ["metals-profile", metals_profile_rule],
  ["crypto-etf-flows", crypto_etf_flows_rule],
  ["crypto-risk-profile", crypto_risk_profile_rule],
  ["michigan-sentiment", michigan_sentiment_rule],
  ["us-indices-profile", us_indices_profile_rule],
  ["fomc", fomc_rule],
  ["interest-rate", interest_rate_rule],
];

export function loadManifest(): RulesManifest {
  return manifestJson as RulesManifest;
}

export function loadAllRules(options?: { validate?: boolean }): TradeImpactRule[] {
  const validate = options?.validate ?? true;
  return RAW_ENTRIES.map(([id, raw]) => {
    const rule = validate ? assertValidRule(raw) : (raw as TradeImpactRule);
    if (rule.id !== id) {
      throw new Error(`Rule file id mismatch: file=${id} json.id=${rule.id}`);
    }
    return rule;
  });
}

export function loadRuleById(
  id: string,
  options?: { validate?: boolean },
): TradeImpactRule | null {
  return loadAllRules(options).find((r) => r.id === id) ?? null;
}
