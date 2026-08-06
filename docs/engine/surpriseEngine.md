# Surprise Engine

## Purpose

Measure Actual vs Forecast surprise.

## Inputs

`SurpriseInput` — see `src/engine/surpriseEngine/types.ts`.

## Outputs

`SurpriseResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/surpriseEngine/process.ts`.

## Configuration

JSON under `src/engine/surpriseEngine/data/`.

## Tests

`src/engine/surpriseEngine/__tests__/`

## Future Improvements

- Series σ / z-score; revision-aware surprise
