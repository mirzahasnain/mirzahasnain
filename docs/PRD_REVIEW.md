# TradeImpact PRD — Senior Review & Prioritized Action Plan

| Field | Value |
|---|---|
| **Reviewed document** | `docs/PRD.md` v1.1 |
| **Cross-checked** | `docs/ENGINE.md`, `docs/API.md` |
| **Reviewers (roles)** | Senior Product Manager · Senior Software Architect |
| **Date** | 2026-08-06 |
| **Verdict** | **Not yet development-ready without clarification.** Strong vision and coverage; blocked by normative contradictions, MVP overload, and unresolved architecture/product decisions. |
| **Code** | **Do not write product code** until P0 actions below are closed in the PRD. |

---

## Executive verdict

The PRD successfully frames TradeImpact as a **decision layer** (not a calendar or charting clone). Score weights, Why?, playbook, and provider-agnostic calendar are the right wedge.

It is **not** yet a single source of truth. Part I and Part II both claim to be *normative* while disagreeing on enums, thresholds, APIs, pricing, alert timings, accessibility standard, and MVP scope. Engineering cannot implement “without asking questions” until those conflicts are resolved into one locked MVP slice.

**Bottom line:** Freeze a thin **MVP Decision Loop**, reconcile contradictions, cut scope creep, then code.

---

## 1. Critical inconsistencies (must resolve)

These will produce wrong builds or conflicting QA if left open.

| ID | Conflict | Part I / ENGINE | Part II / other | Risk if ignored |
|---|---|---|---|---|
| C1 | **Reliability bands** | Very Low → Very High (5) | Low / Medium / High (3) | UI, tests, copy diverge |
| C2 | **Risk bands** | Low → Very High | Low / Med / High / **Extreme** | Decision gates mismatch |
| C3 | **Decision score gates** | §20: Avoid ≤34, Wait 35–49, Conservative 50–77, Aggressive 78+ | App. X: Avoid `<40`, Conservative `≥60`, Aggressive `≥85` | Golden tests conflict |
| C4 | **Score pillar scale** | Pillars 0–100 then weighted | Pillars [0..1] × 100 | Implementation bugs |
| C5 | **Alert schedule** | 15 / 5 / 0 min; types Upcoming/Released/Analysis Ready | T-30 / T-5 / Actual | Wrong notification product |
| C6 | **API surface** | `/api/economic-calendar/*` + `{ok,error}` (matches `API.md`) | `/api/v1/calendar/*`, `/analyze`, nested error object | Broken contracts |
| C7 | **DDL / entities** | App. H (`saved_analyses`, JSON watchlist) | App. BJ (`analyses`, `watchlist_items`) | Schema thrash |
| C8 | **Pricing / Free limits** | Free: 10 analyses/day; Pro $19–29; Team $49–99 | Free: watchlist 5; Pro **$29**; Team **$79**; App. D default **$24** | Billing & paywall logic |
| C9 | **Export priority** | FR-PB-008 **P0** PDF/TXT/Copy | TI-F-04 **P1** | Scope / sprint planning |
| C10 | **WCAG** | 2.2 AA | 2.1 AA | A11y acceptance |
| C11 | **Perf / availability SLOs** | Decision ≤50ms; cal cache ≤200ms; avail 99.5% | Engine <100ms; cal <400ms; avail 99.9% | False CI/ops failures |
| C12 | **Design tokens** | Existing `nb-*` stack (§34) | New `--ti-*` system (App. W) | Redesign vs preserve conflict |
| C13 | **Personas** | Amina, Marcus, Yuki, Elena | Maya, Jordan, Alex, Sam | Story mapping noise |
| C14 | **Document authority** | “End of PRD v1.0” mid-file | Part II also “normative” | Nobody knows which wins |

**Resolution rule (proposed):** Part I + `ENGINE.md` + `API.md` win for shipping code **after** Part I is patched with a single Decision Contract addendum. Part II becomes non-normative “expanded notes” until merged cleanly.

---

## 2. Missing requirements (gaps)

| ID | Gap | Why it matters |
|---|---|---|
| M1 | **Live News** called out in original product brief; PRD only covers calendar Actual polling | Scope ambiguity with investors/users |
| M2 | **Pre-release analysis contract** under-specified in Part I (App. X invents `pre_release` modes) | Primary journey is pre-CPI; MVP unclear |
| M3 | **Historical data acquisition & labeling** (source, windows, asset move definition, QA) | Moat claim (B3) has no build plan |
| M4 | **Server-side enforcement** of Free limits while engines are client-side | “10 analyses/day” is unenforceable as specified |
| M5 | **Auth boundary for MVP** vs paywall features | Sync/limits/push need identity |
| M6 | **Actual freshness SLA** + wrong/revised Actual user flow | Trust-critical at T+0 |
| M7 | **Decision quality / calibration KPI** (did bias align with next N minutes?) | Engagement KPIs only → can ship a confident wrong product |
| M8 | **Symbol canonicalization** (Gold vs XAUUSD vs `gold`; NAS100 vs US100 vs nasdaq) | Matrix/watchlist bugs |
| M9 | **FOMC qualitative mode** inputs (hawkish/dovish) UX + data | Listed in catalog; no FR for tone entry |
| M10 | **Legal review checklist** for Score™ marketing + jurisdiction | Compliance risk |
| M11 | **Single navigation IA** for Workspace vs Analysis (`/news-bias`) vs Event Detail | Three doors to same job |
| M12 | **Out of scope for Terminal `/terminal`** — named in nav, no FRs | Engineering will invent scope |

---

## 3. Duplicate / overlapping features

| Cluster | Overlap | Recommendation |
|---|---|---|
| **Score vs Confidence vs Reliability** | Three “how sure” signals | Ship **Score + Reliability** only; retire “confidence %” in UI copy |
| **Bias vs Decision vs Legacy Buy/Sell/Wait** | Dual action models | One public enum: Avoid/Wait/Agg|Cons Buy|Sell; keep bias as secondary chip |
| **Historical Intelligence vs History Module vs Journal** | Three “past” concepts | Rename clearly: *Similar Releases* / *My Analyses* / *Trade Journal* |
| **Playbook Before-phase vs Trade Checklist** | Same job | Merge checklist into Playbook; one module |
| **Watchlist vs Favorites (news/pairs/strategies)** | Two pin systems | MVP: Watchlist assets + starred calendar events only |
| **One-click matrix vs Impact Matrix vs Correlation chips** | Three multi-asset UIs | One **Watchlist Impact** table; defer Pro matrix polish |
| **Analysis route vs Event Detail analyze** | Split funnel | Event-centric primary path; Analysis as power tool P1 |
| **Story backlogs** §9 / App. F / App. U | Triple backlog | One ID scheme (`TI-*`); delete or mark others historical |

---

## 4. Scope creep (cut or defer before coding)

### Cut from MVP (move to V1+)

| Item | Reason |
|---|---|
| `/terminal` Pro desk | No FRs; duplicates Workspace densification |
| Global search across strategies | FR-WS-004 too broad |
| PDF export | Heavy; keep Copy/TXT first |
| Breakout/Pullback strategies | Aggressive/Conservative enough |
| Team seats / SSO | No auth foundation yet |
| Multi-currency calendar expansion | USD high-impact beachhead first |
| LLM narrative | Explicitly optional; keep templates |
| `--ti-*` redesign | Conflicts with “preserve `nb-*`” product reality |
| PWA/offline service worker depth | Banner + cache enough |
| Impact filter by “asset class” + country + date (full TI-B-01) | Start High + currency + search |

### Keep in MVP (true core)

Calendar (High USD) → Event → Decision (Score, Reliability, Why?) → Risk → Playbook (Before/During/After + Cons/Agg) → Watchlist one-click → Local history/journal stub → Provider fallback.

---

## 5. Technical risks

| Risk | Severity | Notes | Mitigation |
|---|---|---|---|
| **T1 Static correlation as truth** | High | Crypto/indices ≠ always USD-inverse | Reliability↓ + narrative caveat when regime ambiguous; don’t oversell |
| **T2 Curated history quality** | High | Wrong “8/10” destroys trust | Document sample size, window, move definition; show `n` always |
| **T3 Client engines + paid limits** | High | Trivial to bypass | Analyze API or signed quota when monetizing; local unlimited OK for beta |
| **T4 Provider Actual latency** | High | Polling 15–60s may miss edge | Release-window poll; later websocket; set user expectation copy |
| **T5 Dual normative specs** | High | Part I vs II | Authority rule + PRD patch |
| **T6 Trademark / advice liability** | Med-High | Score™ + Buy/Sell language | Legal pass; soft verbs in beginner mode |
| **T7 Auth TBD** | Medium | Blocks sync, billing, push | Decide Auth.js vs Clerk before V1; MVP stays local |
| **T8 Monolith route debt** | Medium | `/news-bias` naming vs TradeImpact brand | Rename plan; don’t dual-maintain forever |
| **T9 Burst QPS at NFP** | Medium | Acknowledged but under-designed | Analyze result cache by `(event,asset,actual,modelVersion)` |
| **T10 Design system fork** | Medium | `nb-*` vs `ti-*` | One token set per release |

---

## 6. UX / product design issues

| ID | Issue | Impact |
|---|---|---|
| U1 | §16.2 workspace lists **13+ sections** vs “one composition / hero budget” | Cluttered first viewport; contradicts design philosophy |
| U2 | Event Detail stacks Score + Matrix + History + AI + Playbook | Cognitive overload; beginners bounce |
| U3 | Playbook shows “91% **or** 91/100” | Confidence/Score confusion |
| U4 | Primary nav has 4 destinations for one job | Decision latency ↑ |
| U5 | Pre-release Score without clear “provisional” labeling | Users treat Wait Score as trade signal |
| U6 | Countdown 1s tick vs a11y (announce every second = noise) | Partial conflict already noted; needs one rule |
| U7 | Mobile “≤3 taps to Why?” vs real journey (open → analyze → why) | Acceptance criteria fuzzy |
| U8 | Fake-spike warning timing vs Avoid/Wait | Overlapping guidance; prioritize one primary CTA |
| U9 | Prop “Extreme → Avoid” may fire too often on NFP | Product feels useless on biggest days unless Wait/plan-flat is excellent |
| U10 | Brand tokens propose new visual system while codebase is `nb-*` | Redesign risk if treated as MVP requirement |

**UX direction (proposed):**  
Home = Next event + countdown + Analyze CTA + watchlist strip.  
Detail = Numbers → Score/Decision → Why? → Playbook. Everything else progressive disclosure.

---

## 7. What the PRD gets right (preserve)

- Clear non-goals (no broker, no full charting, no guaranteed P&L).
- Deterministic engines + AI as narrator (not second brain).
- TradeImpact Score™ weight model aligned with `ENGINE.md`.
- Provider factory / fallback story aligned with `API.md` (Part I).
- Why? as trust mechanism vs signal services.
- Prop-aware risk framing as a wedge.
- Educational disclaimer posture.

---

## 8. Prioritized action plan (before any more code)

### P0 — Blockers this week (doc-only)

| # | Action | Owner | Output |
|---|---|---|---|
| 1 | **Declare document authority:** Part I + ENGINE + API are normative; annotate Part II conflicts as “draft until merged.” | PM | PRD header + App. authority note |
| 2 | **Publish Decision Contract v1** (single page): Reliability enum, Risk enum, score gates, pillar scale, pre vs post release behavior, public decision enum. | PM + Arch | New `docs/DECISION_CONTRACT.md` or PRD §18 replace |
| 3 | **Define MVP cut line** explicitly (keep list + cut list from §4). Remove Terminal, PDF, global search, Breakout/Pullback, Team from MVP tables. | PM | Updated §11 / §12 priorities |
| 4 | **Freeze API to existing** `/api/economic-calendar/*` envelope; mark `/api/v1` as future. | Arch | PRD §31 patch; strike App. AD or mark Future |
| 5 | **Unify symbols & personas** (one catalog, one persona set). | PM | App. K + §8 |
| 6 | **Resolve Free tier:** for public beta = unlimited local analyses; paid limits only after auth. Remove “10/day” until server quota exists. | PM | §49 + monetization |
| 7 | **IA: three surfaces → two:** Workspace + Calendar/Event (Analysis embedded). Terminal = V2. | PM + Design | §14–16 |
| 8 | **Dashboard diet:** rewrite §16.2 to match App. W hero budget (max 5 first-viewport elements). | Design + PM | §16 |
| 9 | **Live News decision:** either specify a thin “Actual ticker / release feed” FR or strike from marketing/core feature lists. | PM | §11 |
| 10 | **Historical data spec:** minimum fields, move window (e.g. M1–M15), sample policy, display of `n`. | Data + PM | New subsection under §19 |

### P1 — Before monetization / accounts

| # | Action | Owner |
|---|---|---|
| 11 | Choose auth vendor; design sync model for watchlist/journal. | Eng |
| 12 | Single DDL (merge H + BJ); migration plan from localStorage. | Eng |
| 13 | Pricing single schedule (pick Pro $29 or $24; one Team price). | PM |
| 14 | Alert taxonomy final: recommend **T-30 / T-5 / Actual** + optional Analysis Ready. | PM |
| 15 | Calibration metric design (offline backtest of bias vs realized move). | Data |
| 16 | Legal pass on Buy/Sell language + Score™. | Legal |
| 17 | A11y standard lock: **WCAG 2.2 AA** (align Part II). | Design |
| 18 | Token decision: extend `nb-*` for TradeImpact; do not fork `--ti-*` in MVP. | Design + Eng |

### P2 — After MVP soft launch

| # | Action |
|---|---|
| 19 | Regime-aware correlation (crypto/indices). |
| 20 | Release-window websockets for Actual. |
| 21 | Impact Matrix Pro UX. |
| 22 | LLM narrative polish behind flag. |
| 23 | Collapse duplicate appendices into one maintained backlog. |
| 24 | B2B/prop seats. |

---

## 9. Suggested Decision Contract (proposed defaults)

Use these as the **single** defaults when patching the PRD (debate once, then lock):

| Topic | Lock |
|---|---|
| Reliability | **Very Low / Low / Medium / High / Very High** (match ENGINE) |
| Risk | **Low / Medium / High / Very High** (map Part II “Extreme” → Very High) |
| Score pillars | Normalize **0–100**, then apply 30/25/20/15/10 |
| Gates | Avoid if risk=Very High **or** score≤34; Wait if pre-release **or** score≤49 **or** neutral bias; Aggressive if score≥78 **and** reliability≥High **and** risk≤Medium; else Conservative if score≥50 and directional |
| Alerts MVP | T-15 / T-5 / T-0 (Released) — align §17; add T-30 in V1 |
| Export MVP | Copy + TXT; PDF = V1 |
| API | Keep `API.md` paths |
| Free beta | Unlimited local; no fake client-side quotas |
| Pre-release | Allowed; UI must label **Provisional**; default decision Wait |

---

## 10. Definition of “ready to code again”

Engineering may resume implementation only when:

1. [ ] Decision Contract locked and reflected in PRD §18/§20/§21 + ENGINE.md  
2. [ ] MVP feature table matches cut list (no Terminal/PDF/Team/LLM)  
3. [ ] One API + one error envelope documented  
4. [ ] One symbol catalog  
5. [ ] Dashboard IA matches mobile-first hero budget  
6. [ ] Historical sample/`n` rules written  
7. [ ] Part II marked non-normative **or** fully reconciled (no duplicate truths)

---

## 11. Recommended next artifact (still no product code)

1. Patch `docs/PRD.md` with P0 edits (short Decision Contract section + MVP cut).  
2. Add `docs/DECISION_CONTRACT.md` (1–2 pages, engineer-facing).  
3. Sync `docs/ENGINE.md` risk/reliability naming if needed.  
4. Only then plan the next implementation spike (e.g. pre-release provisional Score UX).

---

**Review complete.**  
Do not expand PRD with more appendices until contradictions are removed — more pages without authority makes the document *less* buildable.
