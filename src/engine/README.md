# TradeImpact Brain

The Brain is the **complete business logic layer** for TradeImpact.

React components must **never** contain trading decision rules.
All decisions flow through `runTradeImpactBrain`.

## Modules

| Module              | Process API           |
| ------------------- | --------------------- |
| `surpriseEngine`    | `processSurprise`     |
| `confidenceEngine`  | `processConfidence`   |
| `correlationEngine` | `processCorrelation`  |
| `historicalEngine`  | `processHistorical`   |
| `volatilityEngine`  | `processVolatility`   |
| `riskEngine`        | `processRisk`         |
| `scoreEngine`       | `processScore`        |
| `scenarioEngine`    | `processScenario`     |
| `playbookEngine`    | `processPlaybook`     |
| `decisionEngine`    | `processDecision`     |
| `orchestrator`      | `runTradeImpactBrain` |

## Decision flow

```text
Economic News → News Rule → Forecast/Actual → Surprise → USD Bias
  → Correlation → Affected Assets → Historical Match → Confidence
  → Volatility → Risk → TradeImpact Score → Recommendation → Playbook
```

## Usage

```ts
import { runTradeImpactBrain } from "@/engine";

const result = runTradeImpactBrain({
  newsId: "cpi",
  forecast: 3.2,
  previous: 3.1,
  actual: 3.5,
  pairId: "XAUUSD",
});
```

## Configuration

Every numeric threshold and map lives under each module's `data/*.json`.

## Docs

- Per-engine README in each folder
- `docs/engine/` — detailed docs + Brain Architecture Report
