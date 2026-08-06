# Historical Engine

## Purpose

Similar-release statistics for the selected asset.

## Inputs

`HistoricalInput` — see `src/engine/historicalEngine/types.ts`.

## Outputs

`HistoricalResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/historicalEngine/process.ts`.

## Configuration

JSON under `src/engine/historicalEngine/data/`.

## Tests

`src/engine/historicalEngine/__tests__/`

## Future Improvements

- Surprise-bucket similarity; T+N move windows
