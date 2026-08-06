# Confidence Engine

## Purpose

Blend importance, surprise size, reliability.

## Inputs

`ConfidenceInput` — see `src/engine/confidenceEngine/types.ts`.

## Outputs

`ConfidenceResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/confidenceEngine/process.ts`.

## Configuration

JSON under `src/engine/confidenceEngine/data/`.

## Tests

`src/engine/confidenceEngine/__tests__/`

## Future Improvements

- Liquidity modifiers; separate from Reliability meter
