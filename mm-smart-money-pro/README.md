# MM Smart Money PRO

Institutional-grade **Smart Money Concepts** engine for TradingView — original Pine Script v6 implementation.

> Not affiliated with, and not derived from, LuxAlgo, Photon, ICT Toolkit, or other commercial SMC products.

## Build progress

| Module | Name | Status |
|--------|------|--------|
| 1 | Structure Engine | **Done — awaiting confirmation** |
| 2 | Liquidity Engine | Pending |
| 3 | Order Blocks | Pending |
| 4 | Fair Value Gap | Pending |
| 5 | Market Maker Models | Pending |
| 6 | Trade Engine | Pending |
| 7 | Dashboard | Pending |
| 8 | Alerts | Partial (structure alerts in M1) |

## Quick start

1. Open `MM_Smart_Money_PRO.pine` in TradingView Pine Editor
2. Add to chart
3. Verify **0 compile errors**

## Design principles

- Pine Script **v6** only
- **No repaint** — confirmed bars only (`barstate.isconfirmed`)
- **No lookahead** — no `request.security()` in Module 1; future HTF uses `lookahead_off`
- Arrays + UDTs for modular, memory-aware architecture
- Event labels drawn once on the break candle — never moved

## Project layout

```
mm-smart-money-pro/
├── MM_Smart_Money_PRO.pine          # Main indicator (paste into TradingView)
├── modules/
│   └── 01_structure_engine.pine     # Module 1 snapshot
└── docs/
    └── MODULE_01_STRUCTURE.md       # Module 1 notes
```

## Module 1 summary

Detects internal + external structure: swings, HH/HL/LH/LL, protected high/low, BOS, CHoCH, MSS. Color-coded lines and break-candle labels. See `docs/MODULE_01_STRUCTURE.md`.
