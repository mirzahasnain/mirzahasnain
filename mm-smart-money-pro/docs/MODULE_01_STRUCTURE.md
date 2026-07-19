# Module 1 — Fractal Structure Engine

## Status

**Complete (refactored)** — fractal-based, awaiting confirmation before Module 2.

## File

- `mm-smart-money-pro/MM_Smart_Money_PRO.pine`
- Snapshot: `mm-smart-money-pro/modules/01_structure_engine.pine`

## What changed from pivot version

| Before | After |
|--------|--------|
| `ta.pivothigh` / `ta.pivotlow` | Confirmed Williams-style **fractals** |
| Left/right bar inputs | Internal / External **fractal length** |
| Ad-hoc PH/PL | **Trend-protection** PH/PL (HL in bull, LH in bear) |
| Flat helpers | Reusable **UDT classes** + `MarketContext` bridge |
| Unbounded drawings | **DrawPool** ownership + budgets |

## Fractal confirmation (non-repaint)

A fractal of length `L` confirms on the current **closed** bar when the bar at offset `L` is strictly higher/lower than the `L` bars on both sides. Right-side bars are already closed — no lookahead.

## Internal vs External

| Layer | Default length | Role | Opposing break |
|-------|----------------|------|----------------|
| Internal | 2 (5-bar fractal) | Micro structure | `iCHoCH` |
| External | 5+ (forced `> internal`) | Macro / bias | `MSS` |
| Either | — | Continuation | `BOS` |

Optional **alternating swing filter** rejects consecutive same-side fractals unless more extreme (keeps structure clean).

## Protected High / Low (trend protection)

- **Bullish bias** → protect demand → **PL** = newest unbroken **HL** (fallback: newest unbroken low)
- **Bearish bias** → protect supply → **PH** = newest unbroken **LH** (fallback: newest unbroken high)
- Stamps are one-shot on the swing bar — never moved

## Reusable architecture

```
Fractal → SwingPoint → StructureState (Internal | External)
                              ↓
                        StructureEvent
                              ↓
                        MarketContext  ← Modules 2–5 read only from here
                              ↓
                        DrawPool (line/label budgets)
```

### Types

- `Fractal`, `SwingPoint`, `StructureEvent`, `StructureState`
- `DrawPool`, `MarketContext`

### Context accessors (for future modules)

- `f_ctxBias()`, `f_ctxAtr()`
- `f_ctxInternalTrend()`, `f_ctxExternalTrend()`
- `f_ctxProtHigh()`, `f_ctxProtLow()`
- `f_ctxActiveExtHigh()`, `f_ctxActiveExtLow()`

Future modules must commit only when `barstate.isconfirmed` and prefer `ctx.confirmedBar`.

## Object management

- Swing owns its line / class label / PH-PL label
- Trim disposes drawings and nulls refs (no use-after-delete)
- Event labels tracked separately; oldest retired only under label budget pressure
- Broken swing lines frozen at break bar, eligible for budget reclaim

## Alerts

Internal BOS/CHoCH, External BOS, MSS (bullish & bearish).
