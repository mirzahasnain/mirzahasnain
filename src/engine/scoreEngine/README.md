# Score Engine (TradeImpact Score™)

## Purpose

Compute the proprietary 0–100 TradeImpact Score™ and Reliability meter.

## Inputs

`ScoreInput` — pillar inputs + reliability ingredients.

## Outputs

`ScoreResult` — total, breakdown, weights, modelVersion, reliability.

## Weights (configurable)

History 30% · Surprise 25% · Importance 20% · Correlation 15% · Volatility 10%.

## Future Improvements

- Pre-release provisional scoring mode
- Piecewise actionable-volatility curve
