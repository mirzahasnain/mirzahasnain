# TradeImpact Rules Engine

**Intellectual property layer** for TradeImpact financial intelligence.

No UI. No React. No network APIs. Rules live as JSON and are loaded, validated,
resolved, and prioritized in pure TypeScript.

## Location

```text
src/rules/
  macro/ forex/ commodities/ crypto/ indices/ central-banks/
  types/ loader/ validator/ registry/ resolver/ priority/ coverage/
  manifest.json
```

## How rules are loaded

1. Each economic event / profile is a JSON file under its category folder.
2. `loader/loadRules.ts` statically imports every JSON module (bundler-safe).
3. `loadAllRules({ validate: true })` runs the **Rule Validator** on each file.
4. `RuleRegistry` indexes rules by id, category, and priority.

```ts
import { getRuleRegistry, resolveRule, resolveConflicts } from "@/rules";

const registry = getRuleRegistry();
const cpi = resolveRule(registry, "cpi");
```

## Priority levels

| Level    | Rank |
| -------- | ---- |
| Critical | 100  |
| High     | 75   |
| Medium   | 50   |
| Low      | 25   |

## Inheritance

- Event rules may set `inheritsFrom` to a **profile** id (e.g. `metals-profile`).
- `resolveRule` merges parent → child.
- Child fields always win.
- `overrides` deep-merges last for surgical patches without editing base JSON.

## Overrides

```json
{
  "overrides": {
    "riskModifier": 1.35,
    "playbook": { "during": ["Custom desk note"] }
  }
}
```

## Conflict resolution

When two releases print together, `resolveConflicts({ ruleIds })` ranks by:

1. Priority level
2. Importance
3. Correlation weight
4. Stable id tie-break

Optional `context.preferCurrency` boosts matching `affectedCurrency`.

Field-level differences are recorded in `conflicts[]` for auditability.

Example: **NFP + Unemployment** → NFP wins on importance while inverse logic on unemployment remains available if selected explicitly.

## Rule schema (required fields)

- News Description
- Importance
- Affected Currency
- Primary Bias
- Inverse Logic
- Typical Volatility
- Historical Reliability
- Fake Spike Probability
- Typical Delay
- Markets Affected
- Asset Priority
- Correlation Weight
- Confidence Modifier
- TradeImpact Score Modifier
- Risk Modifier
- Playbook (before / during / after)
- Historical Notes
- Market Logic (Bullish / Bearish / Neutral per market)

## Markets covered

Gold · Silver · BTC · ETH · EURUSD · GBPUSD · AUDUSD · NZDUSD · USDJPY · USDCHF · USDCAD · US30 · NAS100 · SPX500

## Integration with the Brain

The Rules Engine is the **intelligence database**.  
The Brain (`src/engine`) should eventually consume resolved rules for modifiers
(score/risk/confidence) instead of hardcoding thresholds in UI.

This package does **not** call the Brain and does not render UI.

## Testing

```bash
npm test -- src/rules
```

## Related docs

- `docs/rules/RULE_COVERAGE_REPORT.md`
- `docs/engine/BRAIN_ARCHITECTURE_REPORT.md`
- `docs/PRD.md` / `docs/ENGINE.md`
