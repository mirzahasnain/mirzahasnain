# Module 2 — Liquidity Engine

## Status

**Complete** — integrated with Module 1 Structure Engine. Ready for Module 3 (Order Blocks).

## Integration

- Does **not** rewrite Module 1
- Consumes Structure Engine swing arrays via `liqSource` (`External` / `Internal` / `Both`)
- Mirrors state into `ctx.liquidity` (`MarketContext`) for Modules 3–5

## Features

| Feature | Detail |
|---------|--------|
| Equal Highs / Lows | ATR / Tick / Percentage tolerance (user selectable) |
| BSL / SSL | Equal highs → Buy Side Liquidity; equal lows → Sell Side |
| Liquidity Pools | Nearby equals merged; one drawing per pool |
| Sweeps | Closed bar + wick through + close back + min wick % |
| Strong / Weak | Strong = not swept; Weak = swept (`S` / `W` on labels) |
| Liquidity Score | Strength / touches / age → composite 0–100 score |
| Alerts | Bullish sweep, Bearish sweep, New EQH, New EQL |
| HUD | BSL, SSL, Nearest Liquidity, Liq Score, Last Sweep |

## Sweep rules (non-repaint)

Valid only when `barstate.isconfirmed`:

1. Wick breaks liquidity (`high > BSL top` or `low < SSL bottom`)
2. Close returns inside / beyond zone (`close < BSL bottom` or `close > SSL top`)
3. Wick % of candle range ≥ `Minimum Wick %`

## Score model (original)

- Touch points (up to 40)
- Age points (up to 20)
- Active / unswept bonus (30)
- Cluster bonus (up to 10)

Label example: `BSL·S 92%×4 a18` → Buy Side, Strong, score 92, 4 touches, age 18 bars.

## Key types

- `LiquidityZone`
- `LiquidityEngine`

## Key functions

| Area | Functions |
|------|-----------|
| Calculations | `f_liqTolerance`, `f_liqWickPct`, `f_liqCalcScore` |
| Detection | `f_liqIngestState`, `f_liqFindPool`, `f_liqCreateZone`, `f_liqMergeInto` |
| Sweeps | `f_liqDetectSweeps` |
| Drawing / objects | `f_liqEnsureDraw`, `f_liqDisposeZone`, `f_liqTrim` |
| Entrypoint | `f_liqOnConfirmed` |
