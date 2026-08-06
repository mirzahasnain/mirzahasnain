# Brain Orchestrator

## Purpose

Execute the full TradeImpact decision pipeline in a fixed order.

## API

`runTradeImpactBrain(input: BrainInput): BrainResult`

## Execution order

1. newsRule
2. surprise
3. usdBias
4. correlation
5. historical
6. confidence
7. volatility
8. score
9. risk
10. scenario
11. decision
12. playbook

## Outputs

`BrainResult` — aggregate of all structured engine results + meta.

## Future Improvements

- Optional analyze caching key `(event, asset, actual, modelVersion)`
- Server-side quota wrapper (post-auth)
