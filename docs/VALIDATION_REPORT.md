# TradeImpact — Product & Financial Validation Report

| Field               | Value                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Document**        | Pre-release Validation / QA Gate                                                                                     |
| **Roles**           | Product Owner · QA Lead · Senior Trader · FinTech QA                                                                 |
| **Date**            | 2026-08-06                                                                                                           |
| **Scope**           | Code & rules as built (Brain, Rules Engine, legacy `lib/news-bias`)                                                  |
| **Code changes**    | **None** — validation only                                                                                           |
| **Overall verdict** | **CONDITIONAL FAIL for production trading use** — architecture is promising; financial reliability is not yet proven |

---

## Executive summary

TradeImpact correctly positions itself as a **decision layer** (Score → Why? → Risk → Playbook). The Brain pipeline and Rules Engine JSON corpus are directionally sound for USD macro.

However, validation finds **blocking inconsistencies**:

1. The **Rules Engine is not wired into the Brain** — recommendations do not originate from `src/rules` today.
2. **Event ID mismatches** between Rules Engine and Brain news rules (e.g. `fomc` vs `fomc-statement`).
3. **AUDUSD and NZDUSD are missing** from the Brain correlation map — they resolve to neutral/misaligned.
4. **Historical “evidence” is curated JSON**, not measured post-release distributions with a defined time window.
5. **Crypto/indices static inverse-USD** mapping is financially oversimplified and can be wrong in risk-on regimes.
6. **FOMC hawkish/dovish** bias in Rules (`hawkish_is_usd_bullish`) is **not supported** by Brain `resolveUsdBias`.
7. Explainability is **partial** — Decision has reasons, but cannot yet answer “which Rules Engine rule?” end-to-end in the live UI path.

**Product gate:** Do **not** market outputs as reliable trading decisions until Critical items are fixed and golden financial scenarios are signed off by a trader + quant.

---

# 1. Full product audit

## 1.1 What is solid

| Area                 | Assessment                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| Pipeline shape       | News → Surprise → USD → Correlation → History → Confidence → Vol → Score → Risk → Decision → Playbook |
| Determinism intent   | Pure functions + JSON configs                                                                         |
| Score weights        | 30/25/20/15/10 matches ENGINE.md / PRD                                                                |
| Decision gates       | Avoid &lt;35, Wait &lt;50, Aggressive ≥78 (ENGINE tree) — internally consistent                       |
| Inverse labor logic  | Unemployment `higher_is_usd_bearish` correctly modeled in Rules + Brain newsRules                     |
| Pre-release Wait     | Brain forces Wait before Actual — correct trader behavior                                             |
| Risk → Avoid         | Very High risk forces Avoid — good safety posture                                                     |
| Rules corpus breadth | Required events present in `src/rules` with market logic matrix                                       |

## 1.2 Critical inconsistencies (system)

| ID   | Issue                                                                                                                                                                | Impact                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| I-01 | **Dual intelligence sources:** Brain reads `src/engine/shared/data/newsRules.json`; Rules Engine is `src/rules/**`. **Zero imports** from `@/rules` into `@/engine`. | IP layer does not power decisions                 |
| I-02 | **ID drift:** Brain uses `fomc-statement`, `interest-rate-decision`, `ism-*-pmi`; Rules use `fomc`, `interest-rate`, `ism-manufacturing/services`.                   | Same economic event cannot resolve across systems |
| I-03 | Rules modifiers (`confidenceModifier`, `tradeImpactScoreModifier`, `riskModifier`) **never applied** in Brain scoring/risk                                           | Rules are documentation, not runtime              |
| I-04 | Legacy UI still runs on `lib/news-bias/engine` (TIE), not necessarily `runTradeImpactBrain`                                                                          | Users may not be on the validated Brain path      |
| I-05 | PRD Part I vs Part II threshold conflicts remain in docs (prior review)                                                                                              | Spec ambiguity for QA goldens                     |
| I-06 | Confidence vs Score vs Reliability still three overlapping “certainty” signals                                                                                       | Trader confusion; explainability dilution         |

## 1.3 Module-by-module

| Module             | Status                       | Notes                                                         |
| ------------------ | ---------------------------- | ------------------------------------------------------------- |
| Decision Engine    | Mostly OK                    | Gates clear; does not know simultaneous-news conflicts        |
| Rules Engine       | Schema OK / Integration FAIL | Rich JSON; unused by Brain                                    |
| Correlation Engine | **FAIL for AUD/NZD**         | Missing pairs; static regime                                  |
| Confidence Engine  | Weak                         | Formula explained but not calibrated; ignores Rules modifiers |
| Risk Engine        | OK directionally             | Does not use Rules `riskModifier` / fakeSpikeProbability      |
| Playbook Engine    | OK templates                 | Not personalized by Rules playbook JSON automatically         |
| Historical Engine  | **Weak evidence**            | Lookup table; surprise-agnostic win rates                     |
| Surprise Engine    | OK for numeric               | No revision handling; no series σ                             |
| Score Engine       | OK math                      | Not fed Rules score modifiers                                 |
| Volatility Engine  | OK                           | Band ≠ realized vol                                           |

---

# 2. Rule validation (financial correctness)

Legend: **Pass** = directionally correct for standard USD desk interpretation · **Warn** = usable with caveats · **Fail** = incorrect or unusable in runtime Brain.

| Event             | Rules JSON bias                | Brain newsRules                                    | Financial verdict  | Notes                                                                                                                                     |
| ----------------- | ------------------------------ | -------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| CPI               | higher → USD bullish           | Present (`cpi`)                                    | **Pass**           | Hot CPI → USD↑ → Gold↓ is standard short-horizon desk map                                                                                 |
| Core CPI          | higher → USD bullish           | Present                                            | **Pass**           | Core can dominate headline — playbook notes this; Brain does not compare dual prints                                                      |
| PPI               | higher → USD bullish           | Present                                            | **Warn**           | Often fades into CPI; importance/modifiers OK; still treated like primary FX driver if selected alone                                     |
| Core PCE          | higher → USD bullish           | Present                                            | **Pass**           | Fed preferred gauge — high importance correct                                                                                             |
| NFP               | higher → USD bullish           | Present                                            | **Warn**           | Headline NFP frequently overridden by Unemployment/Wages — Brain analyzes one series at a time unless conflict resolver used (Rules only) |
| GDP               | higher → USD bullish           | Present                                            | **Warn**           | Vintage (advance/second/third) not modeled                                                                                                |
| Retail Sales      | higher → USD bullish           | Present                                            | **Warn**           | Control group / ex-auto not modeled                                                                                                       |
| FOMC              | `hawkish_is_usd_bullish`       | Brain id `fomc-statement` + numeric interpretation | **Fail (runtime)** | Tone mode not implemented in `resolveUsdBias`; ID mismatch                                                                                |
| Interest Rate     | higher → USD bullish           | Brain id `interest-rate-decision`                  | **Warn**           | Rate decision without statement is incomplete; ID mismatch                                                                                |
| ISM Manufacturing | higher → USD bullish           | Brain id `ism-manufacturing-pmi`                   | **Warn**           | 50-threshold regime not coded; ID mismatch                                                                                                |
| ISM Services      | higher → USD bullish           | Brain id `ism-services-pmi`                        | **Warn**           | Same as above                                                                                                                             |
| ADP               | higher → USD bullish           | **Missing in Brain**                               | **Fail (Brain)**   | Rules exist; Brain falls back to generic 50/50 rule                                                                                       |
| JOLTS             | higher → USD bullish           | **Missing in Brain**                               | **Fail (Brain)**   | Same                                                                                                                                      |
| Unemployment Rate | higher → USD bearish (inverse) | Present + inverse                                  | **Pass**           | Correct inversion                                                                                                                         |

### Financial correctness notes (Senior Trader)

- **USD-centric transmission is acceptable for MVP beachhead**, but must be labeled as a _short-horizon USD impulse model_, not a universal truth.
- **Inflation surprises** can be risk-positive for equities if they imply soft-landing narratives — static “USD↑ → NAS100↓” will be wrong on some prints.
- **Metals** inverse-USD is the strongest map in the set; still fails when real rates and USD diverge.
- **Commodity currencies (AUD/NZD)** deserve commodity beta — currently worse: **absent from correlation map entirely**.

---

# 3. Correlation validation

Brain map (`correlationRules.json`) when **USD rises**:

| Asset           | Mapped move | Why this mapping exists (desk rationale)                                           | Validation                                          |
| --------------- | ----------- | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| Gold (XAUUSD)   | down        | USD up / tighter financial conditions typically pressure USD-priced gold           | **Pass** (classic)                                  |
| Silver (XAGUSD) | down        | High beta to gold + industrial risk; usually follows gold on USD shocks            | **Pass** with higher noise                          |
| BTC             | down        | Treated as liquidity/risk asset; USD strength / higher rates often weigh on crypto | **Warn** — regime-dependent; frequently diverges    |
| ETH             | down        | Crypto beta to BTC / liquidity                                                     | **Warn** — same regime risk                         |
| EURUSD          | down        | USD is quote; USD↑ → pair↓                                                         | **Pass**                                            |
| GBPUSD          | down        | Same quote structure                                                               | **Pass**                                            |
| AUDUSD          | **missing** | Should be USD quote inverse + commodity beta                                       | **Fail** — resolves poorly                          |
| NZDUSD          | **missing** | Same                                                                               | **Fail**                                            |
| USDJPY          | up          | USD is base                                                                        | **Pass**                                            |
| USDCHF          | up          | USD is base                                                                        | **Pass**                                            |
| USDCAD          | up          | USD is base (CAD oil beta ignored)                                                 | **Warn** — oil shocks can dominate                  |
| NAS100          | down        | Duration/rate sensitivity to hawkish impulse                                       | **Warn** — can rally on “good inflation” narratives |
| US30            | down        | Equity risk-off vs USD strength stereotype                                         | **Warn**                                            |
| SPX500          | down        | Broad equity risk proxy                                                            | **Warn**                                            |

### Correlation conclusion

FX majors with explicit USD base/quote geometry are mostly correct.  
**AUDUSD/NZDUSD gap is a shipping blocker.**  
Crypto/indices need regime flags or reduced correlation weight (Rules already soft-pedal crypto reliability; Brain correlation still assigns full inverse).

---

# 4. Historical validation

## What the Historical Engine actually does

- Looks up curated `historicalMoves.json` by `newsId` + `pairId`.
- Uses `sampleSize`, unsigned `averageMove`, and `winRate` (0–100).
- Builds a match score from win rate + sample size.
- `directionHint` uses **sign of averageMove**, largely **independent of whether the current surprise is hot or cold**.

## Realistic?

| Assumption                                     | Realistic?                                                    | Flag                                |
| ---------------------------------------------- | ------------------------------------------------------------- | ----------------------------------- |
| “Past 20 CPI releases” aggregate win rate      | Partially — only if window, side, and surprise bucket defined | **Unsupported without methodology** |
| Win rate applies to current surprise direction | **No** — not surprise-conditional                             | **Unsupported**                     |
| Average move magnitude reusable for scenarios  | Weak — no T+1m / T+15m / T+1h definition                      | **Unsupported**                     |
| BTC “points” averages                          | Ambiguous units vs %                                          | **Weak**                            |
| Missing history → score 35 / confidence 30     | Conservative-ish fallback                                     | Acceptable                          |
| History exists for Brain IDs only              | ADP/JOLTS/etc. missing; Rules IDs diverge                     | **Gap**                             |

**Senior Trader verdict:** Historical module is a **plausible placeholder**, not evidentiary “8/10 similar prints” quality until similarity is defined (surprise bucket + horizon + signed outcomes).

---

# 5. Edge cases

| Scenario                                                 | Expected trader behavior        | Current system                                                                          | Result                           |
| -------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| Actual == Forecast                                       | Neutral / Wait                  | Surprise flat → USD neutral → pair neutral → **Wait**                                   | **Pass**                         |
| Forecast missing                                         | Estimate or block               | Outcome tap → estimate surprise; confidence ×0.92                                       | **Pass** (with lower confidence) |
| Previous revised                                         | Recompute / flag Revised        | `previous` accepted in input but **unused** in Surprise/Brain                           | **Fail**                         |
| Two major releases together (NFP+Unemp)                  | Conflict policy / combined read | Rules `resolveConflicts` exists; **Brain ignores**                                      | **Fail (integration)**           |
| Conflicting USD signals (hot CPI + dovish FOMC same day) | Wait or scenario matrix         | Single-event Brain only                                                                 | **Fail**                         |
| Unexpected CB statement / tone                           | Hawkish/dovish mode             | Rules declare tone; Brain `resolveUsdBias` **does not accept** `hawkish_is_usd_bullish` | **Fail**                         |
| Pre-release                                              | Wait                            | Forced Wait                                                                             | **Pass**                         |
| Extreme vol + high score                                 | Prefer Avoid/Wait               | Very High risk → Avoid                                                                  | **Pass**                         |
| Unknown newsId                                           | Safe degrade                    | Generic rule importance 50                                                              | **Warn**                         |

---

# 6. Confidence validation

## Formula (Brain)

```text
confidence =
  importance × 0.35
+ surpriseSize(strength) × 0.40
+ historicalReliability × 0.25
(× 0.92 if estimate)
```

Surprise size table (config): neutral 35 → extreme 98.

## Is it arbitrary?

**Not random** — it is a transparent weighted blend of three observable inputs.  
**Not calibrated** — weights are expert-chosen, not fit to out-of-sample decision quality.

### Strengths

- Explainable pillars
- Penalizes estimates
- Config-driven (not hardcoded in React)

### Weaknesses

- Ignores Rules `confidenceModifier`
- Overlaps Score™ (which already includes surprise, history, importance)
- Does not use sample size `n` directly (Reliability meter does partially)
- Does not know quote quality, session, or dual-print conflict
- Can remain “high” on bad crypto correlation regimes

**QA stance:** Keep Confidence as an internal factor or merge into Reliability; do not show three competing meters to beginners.

---

# 7. Explainability

### Requirement: every recommendation answers Why? / Which rule? / Which history? / Which correlations?

| Question                   | Brain today                                                    | Rules Engine             | Live UI (legacy path)           |
| -------------------------- | -------------------------------------------------------------- | ------------------------ | ------------------------------- |
| Why?                       | Decision `reasons[]` + factor ingredients available            | Rich `marketLogic` text  | Why? panel exists in TIE UI     |
| Which rule?                | Brain `newsRule.id` from **engine newsRules**, not `src/rules` | Full rule id             | May not show Rules Engine id    |
| Which historical evidence? | `historical.summary` counts                                    | `historicalNotes` prose  | Shows similar releases if wired |
| Which correlations?        | `correlation.links`                                            | `marketLogic` narratives | Correlation chips in TIE        |

**Gap:** Explainability is **structurally possible** but **not unified**. A trader cannot audit “Rule `src/rules/macro/cpi.json` v1.0.0 → Brain Score 91 → Conservative Sell” as one chain today.

**Pass condition for launch:** Single provenance object on every result:

`ruleId + ruleVersion + modelVersion + historical n/window + correlation map version + decision reasons`.

---

# 8. Risk review — when WAIT (or Avoid) is mandatory

TradeImpact should recommend **WAIT** (or **Avoid**) when:

| Situation                                 | Recommended          | Currently                                |
| ----------------------------------------- | -------------------- | ---------------------------------------- |
| Pre-release / Actual not out              | Wait                 | **Implemented**                          |
| Actual ≈ Forecast (inline)                | Wait                 | **Implemented** (neutral path)           |
| Reliability low / thin `n`                | Wait                 | Partially (decision tree)                |
| Risk Very High (NFP open, extreme spike)  | Avoid                | **Implemented**                          |
| Fake-spike window (first 30–90s)          | Wait                 | Playbook text only — **not a hard gate** |
| Dual conflicting prints                   | Wait / combined      | **Not in Brain**                         |
| Crypto/indices with ambiguous risk regime | Wait or reduce score | **Not gated**                            |
| FOMC tone unresolved                      | Wait                 | **Not implemented**                      |
| AUD/NZD with missing correlation          | Wait / error         | Currently may mis-score alignment        |
| Prop daily loss near limit                | Avoid                | Persona caps not enforced in Brain       |

**Product rule (PO):** Prefer false WAIT over false BUY/SELL. That matches the Avoid/Wait gates — keep them strict.

---

# 9. QA report

## 9.1 Bugs

| ID   | Severity     | Bug                                                                   |
| ---- | ------------ | --------------------------------------------------------------------- |
| B-01 | **Critical** | AUDUSD & NZDUSD absent from Brain correlation map                     |
| B-02 | **Critical** | Rules Engine not connected to Brain decisions                         |
| B-03 | **Critical** | Event ID mismatch (fomc / interest-rate / ism-*) across systems       |
| B-04 | **High**     | `hawkish_is_usd_bullish` unsupported in `resolveUsdBias`              |
| B-05 | **High**     | `previous` / revisions unused                                         |
| B-06 | **High**     | Historical direction not surprise-conditional                         |
| B-07 | **Medium**   | ADP/JOLTS etc. missing from Brain newsRules → silent generic fallback |
| B-08 | **Medium**   | Simultaneous-news resolver unused by Brain                            |
| B-09 | **Medium**   | Rules playbooks/modifiers unused at runtime                           |
| B-10 | **Low**      | Correlation displayOrder omits AUD/NZD even in Rules markets list     |

## 9.2 Weak logic

- Static USD→crypto/indices inverse
- Unsigned historical win rates
- Confidence overlapping Score
- USDCAD ignores oil
- Single-series analysis on NFP morning

## 9.3 Missing rules / coverage holes

- Brain coverage ≠ Rules coverage (ADP, JOLTS, durable goods, consumer confidence, PMI naming)
- No wage growth / average hourly earnings companion to NFP
- No dual-print composite rule object
- No revision event type

## 9.4 Unsupported assumptions

1. Historical JSON equals empirical edge
2. Same correlation regime always holds
3. Higher print always maps cleanly without components (core vs headline, wages vs NFP)
4. “Points” moves are comparable across assets/time
5. Importance integers are scientifically calibrated

## 9.5 Technical risks

- Dual engines (Brain vs legacy TIE) diverge silently
- Spec contradictions in PRD appendices
- Client-side logic without calibration monitoring
- No golden financial acceptance suite signed by trading desk

## 9.6 Financial risks

- Users may size into **wrong AUD/NZD bias**
- Crypto “Sell on hot CPI” can be opposite of risk-on tape
- Overconfident Score from placeholder history
- Advice/compliance risk if marketed as reliable signals before wiring/explainability complete

---

# 10. Improvement plan (prioritized)

## Critical (block any “reliable decisions” claim)

1. **Wire Rules Engine → Brain** (single source of truth for event intelligence).
2. **Normalize event IDs** across Rules, Brain, Historical, Calendar.
3. **Add AUDUSD & NZDUSD** to correlation maps (and display order).
4. **Implement FOMC/tone mode** or remove hawkish bias until supported.
5. **Publish provenance on every result** (ruleId, versions, n, reasons).

## High

6. Surprise-conditional historical matches + define T+N window.
7. Apply Rules modifiers (score/risk/confidence) in Brain.
8. Dual-print conflict path (NFP+Unemp, CPI+Core, Rate+FOMC).
9. Revision-aware Actual/Previous handling.
10. Regime flag for crypto/indices (or force Wait when ambiguous).
11. Unify UI path onto `runTradeImpactBrain` (no dual engines).
12. Golden financial scenario pack signed by Senior Trader.

## Medium

13. Collapse Confidence into Reliability for UX.
14. Component fields (core vs headline, wages).
15. USDCAD oil overlay.
16. Fake-spike hard Wait window gate.
17. Recalibrate importance/reliability with desk review.

## Low

18. Extra series (claims, house starts) after beachhead stable.
19. Multilingual rule notes.
20. Cosmetic ID aliases layer.

---

## Validation scorecard

| Domain                         | Score (0–100) | Gate                                    |
| ------------------------------ | ------------- | --------------------------------------- |
| Architecture completeness      | 82            | Pass for continued build                |
| Rules JSON financial direction | 78            | Pass with caveats                       |
| Runtime correctness (Brain)    | 55            | **Fail**                                |
| Correlation completeness       | 60            | **Fail** (AUD/NZD)                      |
| Historical rigor               | 40            | **Fail** for “evidence” claims          |
| Explainability end-to-end      | 58            | **Fail** for auditability               |
| Risk safety (Wait/Avoid)       | 75            | Conditional Pass                        |
| **Overall release readiness**  | **52**        | **No-Go for trusted trading decisions** |

---

## Sign-off recommendation

| Role          | Recommendation                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Product Owner | Keep building; **do not** market “reliable decisions” yet                                                       |
| QA Lead       | **Fail** release gate until Critical #1–5 closed + regression goldens                                           |
| Senior Trader | Logic direction OK for USD FX/metals MVP; **not trustworthy** for AUD/NZD, crypto, FOMC tone, or history claims |
| FinTech QA    | Compliance/explainability chain incomplete — block external claims                                              |

**Next work (docs/engineering, still no feature sprawl):** fix Critical integration + correlation holes, then re-run this validation checklist.

---

_Validation only — no application code was generated for this report._  
_Know the Impact Before You Trade._
