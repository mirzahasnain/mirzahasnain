# MM Smart Money PRO — Architecture

## Principles

1. **Confirmed bars only** — every module commits inside `barstate.isconfirmed`
2. **No lookahead** — no `request.security()` until HTF is added (then `lookahead_off`)
3. **Single context bus** — `MarketContext` is the only cross-module state bridge
4. **Owned drawings** — every line/label has an owner; delete → null ref
5. **Original logic** — no ports from commercial SMC indicators

## Layer map

```
CORE
  constants · Fractal · SwingPoint · StructureEvent
  StructureState · DrawPool · MarketContext · helpers
        │
        ▼
MODULE 1  Fractal Structure Engine (Internal + External)
  f_fractalHigh/Low · f_acceptSwing · f_detectBreaks
  f_applyTrendProtection
        │
        │  ctx (MarketContext)
        ▼
   ┌────────────┬────────────┬────────────┐
   ▼            ▼            ▼            ▼
 M2 Liquidity  M3 OB      M4 FVG      M5 MM Models
   └────────────┴────────────┴────────────┘
                      │
                      ▼
              M6 Trade Engine
                      │
                      ▼
              M7 Dashboard + M8 Alerts
```

## MarketContext contract

Future modules **read** from `ctx` after Module 1 updates it on the confirmed bar:

| Field | Use |
|-------|-----|
| `ctx.internal` / `ctx.external` | Trends, active levels, swings, PH/PL |
| `ctx.lastIntEvent` / `ctx.lastExtEvent` | Fresh BOS/CHoCH/MSS |
| `ctx.bias` | Institutional bias (= external trend) |
| `ctx.atr` | Size filters (FVG, OB, liquidity tolerance) |
| `ctx.confirmedBar` | Commit alignment guard |

Modules must **not** re-detect pivots/fractals independently for structure — they consume Module 1 output.

## Non-repaint checklist per module

- [ ] Gate on `barstate.isconfirmed`
- [ ] No intrabar mutation of confirmed objects
- [ ] Labels/lines created once; never `set_xy` on signals
- [ ] Breaks/sweeps use closed bar only
- [ ] HTF via `request.security(..., lookahead = barmerge.lookahead_off)` when added
