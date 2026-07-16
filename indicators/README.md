# SMC ICT Pro — TradingView Indicator

Professional Smart Money Concepts (SMC / ICT) indicator for TradingView, written in **Pine Script v6**.

**File:** [`indicators/SMC_ICT_Pro.pine`](indicators/SMC_ICT_Pro.pine)

## Install

1. Open the **raw Pine file** (not this README):  
   [`SMC_ICT_Pro.pine`](./SMC_ICT_Pro.pine)  
   On GitHub: open the file → click **Raw** → select all → copy
2. TradingView → **Pine Editor** → delete any old text → paste
3. Confirm the editor shows `//@version=6` on line 1 and is **~600+ lines** ending with `alertcondition` / `alert(` calls
4. Click **Save** → **Add to chart**

Do **not** paste this README (Markdown). That causes `Script could not be translated from: null`.

If you see **CE10246**, the paste was incomplete — copy the full `.pine` file again from Raw view.

## What it does

| Feature | Behavior |
|--------|----------|
| **Break of Structure** | Bullish = close above confirmed swing high; Bearish = close below confirmed swing low |
| **Swing detection** | After BOS, locates impulse swing high/low for Fibonacci |
| **Auto Fibonacci** | Levels `0, 0.236, 0.382, 0.5, 0.618, 0.705, 0.786, 1, 1.5` — **latest only** |
| **Premium / Discount** | Red above 0.5, green below 0.5 |
| **Pullback** | Waits for the **first** pullback into discount/premium or 50% only |
| **Fair Value Gap** | ICT 3-candle FVG; unmitigated; buy FVGs in discount, sell FVGs in premium |
| **Entry** | 50% midpoint of the FVG |
| **Stop Loss** | Fibonacci **1.5** (not candle high/low) |
| **Take Profit** | Risk:Reward (default **1:3**) |
| **Trade box** | Long/Short-style risk & reward boxes with Entry / SL / TP / Risk% / Reward% / RR |
| **Filters** | Doji ignore, min body %, ATR-based FVG size, min FVG size, one trade & one FVG per BOS, cancel if structure breaks before entry |

## Fib orientation

- **Bullish BOS:** Fib `0` = swing high, `1` = swing low, `1.5` = extension below low (stop)
- **Bearish BOS:** Fib `0` = swing low, `1` = swing high, `1.5` = extension above high (stop)

## Inputs

- Swing Length, Pivot Length  
- Show Fibonacci / FVG / Premium·Discount / BOS / Trade Box  
- ATR Length, Minimum Body %, Minimum FVG Size, ATR FVG Mult  
- Risk Reward (default 3)  
- Colors, Alerts ON/OFF  

## Alerts

- Bullish BOS / Bearish BOS  
- Bullish FVG / Bearish FVG  
- Buy Entry Ready / Sell Entry Ready  
- Take Profit Hit / Stop Loss Hit  

## Design notes

- Indicator only (not a strategy) — no order simulation  
- Confirmed pivots + `barstate.isconfirmed` to avoid repainting  
- Old Fib / zones / trade drawings are deleted when a new BOS forms  
- Modular helpers for candles, Fib math, FVG checks, and drawing cleanup  
