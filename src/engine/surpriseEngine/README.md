# Surprise Engine

## Purpose

Measure how the Actual print compares to Forecast (or an outcome tap) and classify strength.

## Inputs

`SurpriseInput` — forecast, actual, optional outcome tap.

## Outputs

`SurpriseResult` — difference, %, strength, sign, impact, estimate flag, bucket.

## Future Improvements

- Series-specific σ / z-score scaling
- Revision-aware surprise (first print vs revised)
