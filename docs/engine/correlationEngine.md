# Correlation Engine

## Purpose

Map USD bias to pair bias and affected assets.

## Inputs

`CorrelationInput` — see `src/engine/correlationEngine/types.ts`.

## Outputs

`CorrelationResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/correlationEngine/process.ts`.

## Configuration

JSON under `src/engine/correlationEngine/data/`.

## Tests

`src/engine/correlationEngine/__tests__/`

## Future Improvements

- Regime overlays for crypto/indices
