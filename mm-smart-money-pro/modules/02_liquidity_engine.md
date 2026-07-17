# Module 2 snapshot

Module 2 lives inside the main indicator (Pine is single-script):

`../MM_Smart_Money_PRO.pine`

Search for the section header:

```
// MODULE 2 — LIQUIDITY ENGINE
```

Types: `LiquidityZone`, `LiquidityEngine` (also under `MODULE 2 — LIQUIDITY TYPES`).

Entrypoint called from the confirmed-bar main loop:

```
f_liqOnConfirmed(liqEng, stInternal, stExternal, f_atr)
ctx.liquidity := liqEng
```

Full documentation: `../docs/MODULE_02_LIQUIDITY.md`
