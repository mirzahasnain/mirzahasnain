# Module 1 — Structure Engine

## Status

**Complete** — awaiting confirmation before Module 2 (Liquidity Engine).

## File

- Working copy: `mm-smart-money-pro/MM_Smart_Money_PRO.pine`
- Module snapshot: `mm-smart-money-pro/modules/01_structure_engine.pine`

## How to load in TradingView

1. Open TradingView → Pine Editor
2. Paste contents of `MM_Smart_Money_PRO.pine`
3. Save → Add to chart
4. Confirm compile: **0 errors**

## What it detects

| Feature | Internal | External |
|---------|----------|----------|
| Swing High / Swing Low | Yes | Yes |
| HH / HL / LH / LL | Yes | Yes |
| Protected High / Low | Yes | Yes |
| BOS | `iBOS` | `BOS` |
| CHoCH | `iCHoCH` | — |
| MSS | — | `MSS` |

## Event model (original)

- **BOS** — continuation break in the direction of the current layer bias
- **CHoCH** — first opposing break on the **internal** layer (early character change)
- **MSS** — first opposing break on the **external** layer (major market structure shift)

## Non-repaint rules enforced

- State updates only when `barstate.isconfirmed`
- Pivots via `ta.pivothigh` / `ta.pivotlow` (emit after `rightBars`)
- Breaks evaluated on the closed bar only (`Close` or closed-bar `Wick`)
- Event labels created once on the break candle — never moved
- Structure lines extend right until broken, then freeze at the break bar
- No `request.security()` (no lookahead path)

## Note on `calc_on_every_tick`

That flag exists on `strategy()`, not `indicator()`. Closed-bar gating via `barstate.isconfirmed` provides the equivalent non-repaint behavior for this indicator module.

## Inputs

- Internal / External left & right pivot lengths
- Show/hide layers, swing markers, BOS / CHoCH / MSS / HHLL / PH-PL
- Break confirmation mode
- Colors, line widths, swing memory cap, HUD toggle

## Alerts included

- Internal Bullish/Bearish BOS
- Internal Bullish/Bearish CHoCH
- External Bullish/Bearish BOS
- Bullish/Bearish MSS

## Next module (after your confirmation)

**Module 2 — Liquidity Engine**
Equal Highs/Lows, BSL/SSL, sweeps, strong/weak highs & lows.
