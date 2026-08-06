# TradeImpact Rules Engine — Coverage Report

| Field             | Value                             |
| ----------------- | --------------------------------- |
| **Date**          | 2026-08-06                        |
| **Schema**        | `tradeimpact.rules.v1`            |
| **Total rules**   | 25                                |
| **Event rules**   | 21                                |
| **Profile rules** | 4                                 |
| **Readiness**     | **100%** (required event catalog) |

---

## By category

| Category      | Count |
| ------------- | ----- |
| macro         | 15    |
| forex         | 2     |
| commodities   | 2     |
| crypto        | 2     |
| indices       | 2     |
| central-banks | 2     |

## By priority

| Priority | Count |
| -------- | ----- |
| Critical | 7     |
| High     | 10    |
| Medium   | 7     |
| Low      | 1     |

---

## Missing rules

**None** for the required economic-event catalog:

cpi · core-cpi · ppi · core-pce · nfp · adp · jolts · retail-sales · gdp · interest-rate · fomc · ism-manufacturing · ism-services · durable-goods · consumer-confidence · pmi · unemployment-rate

Additional packs present: trade-balance, crude-inventories, crypto-etf-flows, michigan-sentiment, plus 4 inheritance profiles.

---

## Duplicate rules

**None.** Registry construction fails closed on duplicate ids.

---

## Conflicting rules (simultaneous-release pairs)

Conflicts are **expected** and handled by the Priority System (`resolveConflicts`).

| Pair                             | Differing fields                                | Typical winner                                  |
| -------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| nfp + unemployment-rate          | primaryBias, inverseLogic, score/risk modifiers | **nfp** (higher importance)                     |
| cpi + core-cpi                   | score/risk modifiers                            | **cpi** or core depending on importance/weights |
| interest-rate + fomc             | primaryBias, modifiers                          | **interest-rate** (slightly higher importance)  |
| ism-manufacturing + ism-services | modifiers                                       | higher importance / correlationWeight           |

These conflicts are recorded in the resolution audit trail; they are not schema errors.

---

## Market logic coverage

**Missing market logic cells:** 0

Every rule defines Bullish / Bearish / Neutral logic for:

Gold · Silver · BTC · ETH · EURUSD · GBPUSD · AUDUSD · NZDUSD · USDJPY · USDCHF · USDCAD · US30 · NAS100 · SPX500

---

## Readiness %

| Gate                                    | Status                                         |
| --------------------------------------- | ---------------------------------------------- |
| Required events present                 | Pass                                           |
| Validator green on all JSON             | Pass                                           |
| No duplicate ids                        | Pass                                           |
| Full market logic matrix                | Pass                                           |
| Loader / Registry / Resolver / Priority | Pass                                           |
| Docs (`RULE_ENGINE.md`)                 | Pass                                           |
| **Overall Rules Engine readiness**      | **100%** (catalog) / production IP layer ready |

**Note:** Wiring modifiers into `runTradeImpactBrain` is a later integration step — out of scope for this Rules Engine deliverable (no UI / no API work here).

---

## Regenerating

```ts
import { generateCoverageReport, RuleRegistry } from "@/rules";
generateCoverageReport(new RuleRegistry());
```

Or:

```bash
npm test -- src/rules
```
