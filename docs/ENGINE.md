# TradeImpact Intelligence Engine (TIE)

Version 13 core intelligence. The app no longer stops at Bullish / Bearish —
it explains **why**, **how strong**, **how reliable**, and **what to expect**.

## Pipeline

```
News → Surprise → History → Correlation → Volatility → Confidence → Recommendation
```

Implemented by `decisionTree.ts` and orchestrated by
`engine/intelligenceEngine.ts` (`runIntelligenceEngine`).

## Modules

```
engine/
  intelligenceEngine.ts          # orchestrator
  intelligence/
    scoring/                     # TradeImpact Score™
    history/                     # similar releases adapter
    correlation/                 # USD → asset map
    risk/                        # risk level + why
    scenario/                    # best / expected / worst
    decisionTree.ts
    narrative.ts
    data/*.json                  # all tunable rules
```

Every number and label comes from JSON. Components never hardcode business logic.

## TradeImpact Score™

Weighted blend (see `scoring/data/scoreWeights.json`):

| Pillar | Weight |
|---|---|
| Historical Match | 30% |
| Surprise Strength | 25% |
| News Importance | 20% |
| Market Correlation | 15% |
| Volatility | 10% |

Displayed as `94 / 100` on the result card.

## Confidence & Reliability

- **Reliability Meter** — Very Low → Very High from news-rule historical
  reliability blended with cohort confidence.
- **TradeImpact Score** is the primary confidence signal shown to traders.
- Classic engine `computeConfidence` still feeds the decision engine; TIE
  re-scores for the final recommendation.

## Decisions

Instead of only Bullish / Bearish, the tree resolves to:

- Avoid
- Wait
- Aggressive Buy / Conservative Buy
- Aggressive Sell / Conservative Sell

Rules (JSON): low score → Avoid; mid score / neutral → Wait; high score +
strong surprise + high reliability → Aggressive; otherwise Conservative.

## Correlation

`correlation/data/correlationRules.json` encodes:

```
USD ↑  →  Gold ↓ Silver ↓ BTC ↓ ETH ↓ EURUSD ↓ …  USDJPY ↑ USDCHF ↑ USDCAD ↑
```

Alignment of the selected pair vs this map contributes to the score.

## Scenarios

Best / Expected / Worst case moves are scaled from historical average absolute
move (or JSON fallbacks) and signed by pair bias.

## Risk

Risk engine blends impact, surprise strength, reliability, estimate flag, and
volatility band into Low / Medium / High / Very High with a written **why**.

## Why?

Every analysis includes a factor list (score formula, news, history,
correlation, risk, recommendation). The result card exposes a **Why?** toggle;
More details shows the full intelligence panel (score breakdown, historical
match, scenarios, correlation grid, decision tree, narrative).

## How to change behaviour

1. Edit the relevant JSON under `engine/intelligence/**/data/`.
2. Keep TypeScript modules as pure adapters.
3. Add / update unit tests in `engine/__tests__/intelligenceEngine.test.ts`.

## Testing

```bash
npm test
```

Covers scoring, history, correlation, scenario, risk, decision tree, and the
full orchestrator + `buildAnalysis` integration.
