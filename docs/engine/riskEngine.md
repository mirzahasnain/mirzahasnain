# Risk Engine

## Purpose

Frame downside risk and suggested risk %.

## Inputs

`RiskInput` — see `src/engine/riskEngine/types.ts`.

## Outputs

`RiskResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/riskEngine/process.ts`.

## Configuration

JSON under `src/engine/riskEngine/data/`.

## Tests

`src/engine/riskEngine/__tests__/`

## Future Improvements

- Prop caps; fake-spike window object
