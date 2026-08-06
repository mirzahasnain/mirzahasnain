# Volatility Engine

## Purpose

Estimate expected release volatility band.

## Inputs

`VolatilityInput` — see `src/engine/volatilityEngine/types.ts`.

## Outputs

`VolatilityResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/volatilityEngine/process.ts`.

## Configuration

JSON under `src/engine/volatilityEngine/data/`.

## Tests

`src/engine/volatilityEngine/__tests__/`

## Future Improvements

- Session/liquidity overlays
