# Decision Engine

## Purpose

Resolve the final trading recommendation from Score, Risk, Reliability, and bias.

## Inputs

`DecisionInput` — pair direction, score, reliability, risk, strength, mode.

## Outputs

`DecisionResult` — decisionId, label, action, aggression, reasons[].

## Future Improvements

- Prop persona hard caps
- Multi-asset portfolio conflict checks
