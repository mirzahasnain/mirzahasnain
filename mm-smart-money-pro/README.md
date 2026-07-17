# MM Smart Money PRO

Institutional-grade **Smart Money Concepts** engine for TradingView — original Pine Script v6.

> Not affiliated with, and not derived from, LuxAlgo, Photon, ICT Toolkit, or other commercial SMC products.

## Build progress

| Module | Name | Status |
|--------|------|--------|
| 1 | Fractal Structure Engine | **Done — awaiting confirmation** |
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
- **Fractal-based** structure (not pivot-based)
- **No repaint** — confirmed bars only (`barstate.isconfirmed`)
- **No lookahead** — no `request.security()` in Module 1
- Reusable UDTs + `MarketContext` bus for Modules 2–5
- Owned drawings via `DrawPool` budgets

## Project layout

```
mm-smart-money-pro/
├── MM_Smart_Money_PRO.pine
├── modules/
│   └── 01_structure_engine.pine
└── docs/
    ├── ARCHITECTURE.md
    └── MODULE_01_STRUCTURE.md
```

See `docs/MODULE_01_STRUCTURE.md` for Module 1 details.
