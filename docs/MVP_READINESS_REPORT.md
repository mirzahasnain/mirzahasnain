# TradeImpact — MVP Readiness Report

| Field        | Value                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Document** | MVP Launch Readiness Gate                                                                          |
| **Role**     | CTO                                                                                                |
| **Date**     | 2026-08-06                                                                                         |
| **Scope**    | Brain + Rules wiring, UX polish, docs/structure, no new product features                           |
| **Verdict**  | **Conditional Go** for educational MVP — **No-Go** for marketing as trusted live trading decisions |

---

## Scores

| Dimension                    |   Score | Notes                                                                                   |
| ---------------------------- | ------: | --------------------------------------------------------------------------------------- |
| **Product Score**            |  **78** | Decision-layer story clear; still dual intelligence paths in UI                         |
| **Engineering Score**        |  **84** | Critical debt closed on Brain path; tests expanded                                      |
| **Performance Score**        |  **76** | Lazy panels + skeletons; root/game assets still weigh first paint                       |
| **UX Score**                 |  **81** | Empty/loading/error/onboarding/nav/search/watchlist/history/settings polished           |
| **Architecture Score**       |  **82** | Rules→Brain bridge + aliases; legacy TIE remains until full cutover                     |
| **Security Score**           |  **72** | No auth product surface; secrets stay server-side for calendar BFF; client-only storage |
| **Documentation Score**      |  **86** | PRD, reviews, Brain, Rules, Validation, this report aligned                             |
| **Overall Launch Readiness** | **79%** | Educational / soft-launch ready with blockers below                                     |

### Overall: **79%** — Conditional Go

Ship as **decision-support MVP** with disclaimer prominence. Do **not** claim calibrated live alpha until remaining blockers clear.

---

## What this sprint fixed (debt only — no new features)

1. **AUDUSD / NZDUSD** added to Brain + legacy correlation maps.
2. **Event ID aliases** (`fomc` ↔ `fomc-statement`, rates, ISM).
3. **Rules Engine wired into Brain** via `rulesBridge` — modifiers + provenance on `meta.rules`.
4. **Hawkish FOMC** (`hawkish_is_usd_bullish`) supported in `resolveUsdBias` + news rules.
5. **ADP / JOLTS** Brain newsRules coverage (Rules-aligned).
6. Legacy TIE score path applies Rules score modifiers; FOMC interpretation synced.
7. UX polish: shared `AppNav`, skip links, empty states, skeletons, errors, search a11y, watchlist unpin, settings pairs, history empty, onboarding tip, invalid `text-nb-text0` tokens, TradeImpact root metadata.

---

## Prioritized blockers

### P0 — Must clear before “trusted decisions” marketing

| ID       | Blocker                                                                                                                                 | Owner lens          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **B-01** | **Analyze UI still primarily runs legacy TIE** (`lib/news-bias/engine`), not exclusively `runTradeImpactBrain`. Dual paths can diverge. | Engineering         |
| **B-02** | **Historical evidence is curated JSON**, not surprise-conditional measured windows (T+N undefined).                                     | Quant / Product     |
| **B-03** | **PRD Part I vs Part II** threshold conflicts remain in docs — freeze Decision Contract for QA goldens.                                 | Product / Architect |

### P1 — Soft-launch acceptable with labels

| ID       | Blocker                                                   | Mitigation                                      |
| -------- | --------------------------------------------------------- | ----------------------------------------------- |
| **B-04** | Crypto / indices static inverse-USD oversimplified        | Label as short-horizon USD impulse model        |
| **B-05** | Confidence / Score / Reliability overlap confuses traders | UI copy already distinguishes; full unify later |
| **B-06** | No end-user auth / multi-device sync                      | Expected for device-local MVP                   |
| **B-07** | Legacy NIBBO `/play` surface still in repo                | Keep out of TradeImpact nav; do not market      |

### P2 — Post-MVP hardening

| ID       | Item                                                   |
| -------- | ------------------------------------------------------ |
| **B-08** | Live vendor calendar credentials + SLA                 |
| **B-09** | Realized-vol calibration vs band heuristics            |
| **B-10** | Bundle audit (game/Phaser not on TradeImpact routes)   |
| **B-11** | WCAG full audit pass with automated + manual checklist |

---

## Dimension detail

### Product (78)

Solid: Score → Why → Risk → Playbook; Wait pre-release; Avoid on very-high risk.  
Gap: Marketing must stay educational until B-01–B-03 closed.

### Engineering (84)

Solid: Pure Brain modules, Rules registry, aliases, modifiers, expanded unit tests.  
Gap: UI cutover to Brain orchestrator.

### Performance (76)

Solid: `lazyClientPanel`, calendar/workspace skeletons, `display: swap` fonts.  
Gap: Unused game weight in monorepo; no dedicated Lighthouse gate in CI yet.

### UX (81)

Solid: Empty/loading/error/onboarding/nav/search/watchlist/history/settings improvements; mobile wrap + min touch targets; skip links.  
Gap: Full screen-by-screen WCAG sign-off.

### Architecture (82)

Solid: `src/engine` + `src/rules` + facades; documented structure.  
Gap: Dual engines until TIE deprecation.

### Security (72)

Solid: Calendar API secrets server-side; client sanitization helpers; no secrets in Rules/Brain.  
Gap: No auth, CSP hardening, dependency audit gate as release ritual.

### Documentation (86)

Solid: PRD, reviews, ENGINE, Brain report, Rules coverage, Validation, Architecture, Structure, this report.  
Gap: Freeze conflicting thresholds (B-03).

---

## Screen review (MVP polish pass)

| Screen                                  | Status                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Workspace                               | Onboarding tip, search a11y, watchlist unpin, settings pairs, skeletons |
| Calendar                                | Shared nav, skeleton a11y, mobile padding                               |
| Terminal                                | Shared nav, offline status                                              |
| Analyze (`/news-bias`)                  | History empty state; branding metadata; token typo fixes                |
| Event detail                            | Existing patterns preserved                                             |
| System 404 / error                      | nb-* tokens + clearer copy                                              |
| Settings / History / Search / Watchlist | Improved empty + a11y                                                   |

---

## Folder & naming

- Canonical intelligence: `src/rules/**`, Brain: `src/engine/**`.
- Aliases live in `src/engine/shared/eventIdAliases.ts`.
- Prefer `@/engine`, `@/rules`, `@/config` for new code; avoid new `lib/news-bias` business logic.
- Naming: `process*` engines, `runTradeImpactBrain`, `lookupRulesEngine` — consistent.

---

## Launch recommendation

| Audience                              | Recommendation                  |
| ------------------------------------- | ------------------------------- |
| Internal / beta traders (educational) | **Go** with disclaimer          |
| Public “trusted decision engine”      | **Hold** until B-01, B-02, B-03 |
| Paid Live data tier                   | **Hold** until B-08             |

**Overall Launch Readiness: 79% — Conditional Go.**
