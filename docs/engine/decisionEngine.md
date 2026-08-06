# Decision Engine

## Purpose

Final Avoid/Wait/Buy/Sell recommendation.

## Inputs

`DecisionInput` — see `src/engine/decisionEngine/types.ts`.

## Outputs

`DecisionResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/decisionEngine/process.ts`.

## Configuration

JSON under `src/engine/decisionEngine/data/`.

## Tests

`src/engine/decisionEngine/__tests__/`

## Future Improvements

- Portfolio conflict checks
