# Playbook Engine

## Purpose

Structured before/during/after trade plan.

## Inputs

`PlaybookInput` — see `src/engine/playbookEngine/types.ts`.

## Outputs

`PlaybookResult` — structured object (never a plain string primary return).

## Process API

`process*` in `src/engine/playbookEngine/process.ts`.

## Configuration

JSON under `src/engine/playbookEngine/data/`.

## Tests

`src/engine/playbookEngine/__tests__/`

## Future Improvements

- Numeric TP/SL when prices available
