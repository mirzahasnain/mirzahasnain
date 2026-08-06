# TradeImpact — Architecture & Design Review

**Pre-Development Gate Review**  
**Classification:** Confidential — Leadership / Engineering / Product  
**Date:** 2026-08-06  
**Subject document:** `docs/PRD.md` v1.1 (cross-checked with `docs/ENGINE.md`, `docs/API.md`, `docs/PRD_REVIEW.md`)  
**Review board (roles):** CTO · Principal Software Architect · Senior Product Manager · Senior UX Designer · FinTech Architect · Security Engineer  

| Field | Value |
|---|---|
| **Recommendation** | **CONDITIONAL GO** — do not begin net-new feature development until Critical actions are closed |
| **Overall readiness** | Vision: Strong · Spec coherence: Weak · MVP clarity: Insufficient · Architecture direction: Sound with gaps |
| **Code instruction** | **No application code** in this review. Documentation and decisions only. |

---

## 0. Executive brief (for leadership)

TradeImpact’s positioning is correct: a **news → decision** layer between economic calendars and charting platforms, with a proprietary **TradeImpact Score™**, explainability (**Why?**), risk framing, and a trade playbook. That is a real user job and a credible SaaS wedge.

The PRD is **investor-impressive** and **too contradictory to build from**. Part I and Part II both claim normative authority while disagreeing on decision gates, risk/reliability enums, API shapes, pricing, alerts, accessibility standard, and design tokens. MVP scope includes a Terminal product, PDF export, global search, multi-asset matrices, and monetization limits that the proposed local-first architecture cannot enforce.

**CTO decision:**  
1. Freeze a **Decision Contract** and **MVP Cut**.  
2. Demote Part II to non-normative until reconciled.  
3. Require the **missing documents** listed in §13.  
4. Only then authorize implementation sprints.

```text
                    ┌─────────────────────┐
                    │   GO / NO-GO GATE   │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
   Spec authority        Decision Contract      MVP surface
   (one PRD truth)       (enums + gates)        (cut Terminal,
                                                 PDF, Team, LLM)
```

---

# 1. Product review

## 1.1 User value (what must not be diluted)

| Job-to-be-done | Value | MVP status |
|---|---|---|
| “What should I trade on this print — and why?” | Core | Present but over-wrapped |
| Fast pre-release prep + post-print update | Core | Pre-release under-specified |
| Risk / Avoid when tape is extreme | Differentiator for prop | Present; enums conflict |
| Process memory (journal) | Retention | Present; secondary |
| Calendar as schedule | Commodity | Over-weighted in feature lists |

**Product thesis holds.** Feature density threatens the thesis.

## 1.2 Missing features (real gaps)

| Gap | Severity | Notes |
|---|---|---|
| Live News (brief promised; PRD thin) | High | Decide: Actual ticker only vs headline feed |
| Pre-release provisional Score UX | Critical | Primary journey is T−25 CPI |
| Historical labeling methodology | Critical | Moat claim without data ops plan |
| FOMC hawkish/dovish input UX | High | In catalog; no FR |
| Wrong/revised Actual recovery | High | Trust at T+0 |
| Decision calibration metric | High | Engagement-only KPIs are dangerous in FinTech |
| Symbol canonicalization | High | `gold` / XAUUSD / XAU |
| Account/auth MVP boundary | High | Monetization & sync blocked |
| Empty-state education for Neutral/Wait | Medium | Beginners need “doing nothing is valid” |
| Multi-event same-day risk | Medium | Overlapping NFP+CPI weeks |

## 1.3 Scope creep

| Item in PRD as near-term | Verdict |
|---|---|
| `/terminal` Pro desk | **Out of MVP** — undefined FRs |
| PDF export P0 | **Defer** — Copy/TXT first |
| Global search (news/pairs/strategies) | **Defer** |
| Breakout / Pullback entries | **Defer** — Cons/Agg enough |
| Team seats / SSO | **V2+** |
| Multi-currency calendars | **V1+** after USD beachhead |
| LLM narrative | **Flagged future** |
| `--ti-*` design system fork | **Reject for MVP** — extend `nb-*` |
| Impact Matrix as separate Pro surface | **Defer polish**; one watchlist table OK |
| Offline service worker depth | **Defer** |

## 1.4 Duplicate features

| Duplicate cluster | Keep | Merge / kill |
|---|---|---|
| Score / Confidence / Reliability | Score + Reliability | Kill “confidence %” in UI |
| Bias / Decision / Legacy Buy·Sell·Wait | Decision enum + bias chip | Kill legacy public action |
| Similar Releases / My Analyses / Journal | Three clear names | Stop calling all “History” |
| Playbook Before / Trade Checklist | Playbook | Kill separate checklist module |
| Watchlist / Favorites | Watchlist + starred events | Kill strategy favorites MVP |
| One-click / Matrix / Correlation chips | One Watchlist Impact table | Kill parallel UIs |
| Workspace Analyze / `/news-bias` / Event Detail | Event-centric path | Demote standalone Analysis to P1 |
| Story IDs §9 / F / U | `TI-*` only | Archive others |

## 1.5 MVP vs Future (recommended freeze)

### MVP — Decision Loop (ship this)

```text
Calendar (High-impact USD)
  → Event Detail (F/P/A + countdown)
  → Decision (Score, Reliability, Decision, Why?)
  → Risk + Playbook (Before/During/After, Cons/Agg)
  → Watchlist one-click biases
  → Local My Analyses + Journal stub
  → Provider fallback + disclaimer
```

### V1 — Accounts & retention

Auth, sync, push (T-30/T-5/Actual), billing, Copy/TXT→PDF, expanded series, calibration dashboard (internal).

### V2+ — Moat & platform

Regime correlation, Actual websockets, Team/prop, LLM polish, Terminal density, B2B Score API, Live News feed (if defined).

## 1.6 Product recommendation

**Narrow to prove the aha moment:** CPI → Gold Score + Why? in under three minutes on mobile. Everything else is supporting cast.

---

# 2. UX review

## 2.1 Flow audit

| Flow | Beginner | Pro | Issues |
|---|---|---|---|
| Land → Workspace | Confusing if 13 sections | Tolerable | Hero budget violated (§16.2 vs App. W) |
| Calendar → Event | Good | Good | Filters over-specified for MVP |
| Pre-release Analyze | Risky | Essential | Must label **Provisional** |
| Post-print recompute | Good | Good | Need clear “Actual updated” affordance |
| Why? | Excellent teaching | Required | Keep ≤1 tap from result |
| Playbook | Long for beginners | Valuable | Progressive disclosure |
| Watchlist one-click | Good | Good | Best multi-asset UX — keep |
| Journal | Optional | Important | Don’t force in first session |
| Terminal | N/A | Undefined | **Remove from nav** |
| Standalone Analysis | Duplicate door | Power users | Hide behind Event for MVP |
| Alerts setup | Easy to spam | Needed | One taxonomy |
| Settings | Fine | Fine | Provider settings Pro-only OK |
| Billing | N/A until auth | — | Don’t fake client paywalls |

## 2.2 Beginner usability

**Can a beginner use it today (as specified)? Partially — with friction.**

Risks:
- Buy/Sell language without education → advice confusion  
- Three “certainty” metrics  
- Event Detail content wall  
- Pre-release Score looks actionable  
- Jargon (surprise, σ, transmission) without progressive glossary  

**Required beginner path:** Tour (4 steps) → sample CPI→Gold → Wait/Avoid normalized → Short AI mode → no PDF/export pressure.

## 2.3 Professional trader usability

**Pros can use it if densification is right** — but they need:
- Keyboard calendar  
- Multi-asset table  
- Model version footnote  
- Fast Actual refresh  
- Export for review  
- Prop risk caps  

They do **not** need a separate Terminal route if Workspace densifies well.

## 2.4 Unnecessary screens / surfaces

| Surface | Verdict |
|---|---|
| `/terminal` | Unnecessary MVP |
| Standalone `/news-bias` as primary | Unnecessary primary (keep deep link) |
| Separate Favorites manager | Unnecessary |
| Separate Checklist page | Unnecessary |
| Marketing-like card grids in app | Unnecessary |
| Light theme as MVP work | Optional V1 |

## 2.5 Missing screens / states

| Missing | Why |
|---|---|
| Provisional pre-release result state | Core journey |
| Degraded provider banner (mandatory, not optional) | Trust |
| Revised Actual state | Data reality |
| “Sitting out” journal outcome celebrated | Prop discipline |
| Paywall preview (V1) | Monetization |
| Empty watchlist onboarding | Activation |
| Model changelog / Score vN viewer | Pro trust |
| Incident / status deep link | Ops |

## 2.6 Simplification plan (UX)

```text
BEFORE (bloated)                         AFTER (MVP)
─────────────────                        ──────────
Workspace: 13 modules        →           Hero + watchlist + recent
Nav: WS / Cal / Analyze / Terminal →     Home / Calendar
Event: 9 stacked sections    →           Numbers → Score → Why? → Playbook (rest collapsed)
Signals: Score+Conf+Rel      →           Score + Reliability
Pins: Watchlist+Favorites    →           Watchlist + star on events
```

**One-hand mobile target:** thumb-reach CTA; Score visible without landscape; Why? as bottom sheet; Playbook secondary tab.

## 2.7 UX recommendation

Approve design only against **App. W hero rules**, not §16.2 inventory. Rewrite §16.2 before any UI sprint.

---

# 3. Technical architecture review

## 3.1 Target architecture (endorsed direction)

```text
┌──────────────┐     HTTPS      ┌──────────────────────────┐
│  Next.js Web │ ─────────────► │ API Gateway (Route Handlers)
│  (App Router)│◄────────────── │  /api/economic-calendar/*
└──────┬───────┘   JSON+cache   └────────────┬─────────────┘
       │                                     │
       │ pure TS engines                     ▼
       │ (Score, Decision,          ┌─────────────────┐
       │  Risk, History,            │ Provider Factory│
       │  Playbook templates)       │ Mock | TE | …   │
       ▼                            └────────┬────────┘
  localStorage (MVP)                         │
  Postgres (V1+)                     Vendor APIs (secrets server-only)
```

**Sound choices:** provider abstraction, pure engines, server-only secrets, local-first MVP, JSON-configured rules.

## 3.2 Frontend

| Topic | Assessment | Action |
|---|---|---|
| Next.js + TS + Tailwind | Fit | Keep |
| `nb-*` tokens vs `--ti-*` | Conflict | **Extend `nb-*`**; reject fork in MVP |
| Engines in client bundle | Good for latency | OK; keep packages tree-shakeable |
| State | Underspecified | Mandate: server cache (SWR) for calendar; local store for prefs/journal; **no Redux unless justified** |
| Routes | Legacy `/news-bias` | Migration plan; brand routes |
| Component boundaries | “UI dumb / engines pure” | Enforce in lint/review |

**State management recommendation:**

| State | Store |
|---|---|
| Calendar events | SWR/React Query + HTTP cache |
| Active event + analysis result | Route/search params + derived engine output |
| Watchlist / settings / journal | Versioned localStorage → synced API V1 |
| Notifications inbox | Local queue MVP; server V1 |
| Auth session | HTTP-only cookies V1 |

Avoid duplicating engine outputs in global client stores; **derive**.

## 3.3 Backend

| Topic | Assessment |
|---|---|
| Calendar BFF | Correct |
| Analyze as client-only | Fine for beta; **insufficient for quotas/billing** |
| No auth MVP | Acceptable if Free = local unlimited |
| Dual API proposals | **Reject** `/api/v1` until versioned migration |
| Error envelope | Lock Part I `{ ok, error }` |

**Future backend services (when earned):**

1. Calendar BFF (exists)  
2. Analyze service (optional; caching + quota)  
3. User sync API  
4. Alert dispatcher  
5. Billing webhooks  
6. Historical intelligence API (replace bundled JSON)

## 3.4 Folder structure

PRD §33 is directionally right. Issues:

- `news-bias` naming is legacy brand debt  
- Monorepo App. BH vs single-app §33 — pick one for 12 months  
- Engines should be importable without React  

**Recommendation (12-month):** stay single Next app; extract `packages/engine` only when a second client appears.

## 3.5 API design

See §6. Summary: **freeze to `API.md`**. Add analyze/user APIs as additive later.

## 3.6 Database

See §7. Summary: local-first MVP OK; one V1 DDL; normalize watchlist; separate market data from user data.

## 3.7 Caching

| Layer | Verdict |
|---|---|
| 60s provider TTL | Good default |
| Release-window shorter TTL / faster poll | Required (specify) |
| Stale-on-error | Good |
| Analyze cache key `(event, asset, actual, modelVersion)` | Add for burst |
| Historical JSON immutable by app version | Good |

## 3.8 Scalability

Burst around NFP/CPI is the real load shape — not MAU averages.

| Concern | Readiness |
|---|---|
| Stateless web | Ready |
| Provider rate limits | Risk — need secondary provider + cache |
| Identical analyze storms | Need result cache |
| Postgres at V1 | Fine with indexes |
| Multi-region | Premature |

## 3.9 Architecture recommendation

**Approve** local-first + BFF + pure engines.  
**Reject** premature microservices, dual API standards, and design-system rewrite.

---

# 4. Decision Engine review

## 4.1 Pipeline (endorsed)

```text
News rules → Surprise → USD factor → Correlation → History →
Vol/Risk → Score + Reliability → Decision tree → Why? + Playbook
```

Determinism requirement is **mandatory** and correctly stated.

## 4.2 Conflicting logic (blockers)

| Conflict | Detail |
|---|---|
| Score gates | §20 (34/49/77/78) vs App. X (40/60/85) |
| Risk enum | Very High vs Extreme |
| Reliability | 5-band ENGINE vs 3-band App. X.7 |
| Pillar scale | 0–100 vs 0–1 |
| Pre-release | Weight redistribute **or** scenario triad — both mentioned, neither locked |
| Reliability uses score | Circular: reliability depends on score which depends on history; decision depends on reliability |

## 4.3 Missing edge cases

| Edge case | Required behavior |
|---|---|
| Forecast null | Block surprise; Manual/estimate path only |
| Actual = Forecast | Inline → usually Wait |
| Actual revised | Recompute + Revised badge + alert |
| Estimate-only (Beat/Miss tap) | Cap Reliability ≤ Medium; flag Estimate |
| n_history < 3 | Reliability Very Low; prefer Wait |
| Conflicting history vs surprise | Show disagreement in Why?; lower Score |
| USD-neutral surprise | Neutral bias; Wait |
| Non-USD event (EU CPI) on XAU | Transmission path must not assume USD-only forever |
| Session closed (FX) vs crypto 24/7 | Risk/liquidity modifiers |
| Simultaneous high-impact events | Portfolio risk note |
| User maxRiskPct = 0 | Force Avoid entries |
| Correlation ambiguous (BTC) | Lower C pillar; narrative caveat |
| Hawkish statement without number | Qualitative mode required |
| Unit mismatch / scale error | Validate units per series |
| Provider Actual differs from user Manual | Precedence rule |

## 4.4 Assumptions (call out explicitly in PRD)

1. US macro → USD factor is the primary transmission for MVP.  
2. Gold/silver inverse-USD holds in the sample window.  
3. Crypto/indices inverse-USD is a **simplification** (must disclose).  
4. Historical “move” direction is well-defined (window & threshold unspecified — **gap**).  
5. Consensus Forecast is the right anchor (not whisper/Bloomberg).  
6. Traders accept Avoid/Wait as valuable (product must celebrate discipline).  
7. Template AI is sufficient for trust (LLM optional).  

## 4.5 Suggested improvements

1. **Lock Decision Contract** (see proposed defaults in `PRD_REVIEW.md` §9).  
2. Compute Reliability **before** final Score blend, or from history/`n`/estimate only — avoid circular dependence on total Score.  
3. Split **Opportunity Score** vs **Actionability Gate** (risk can force Avoid even if Score high).  
4. Always show `n`, sample window, modelVersion.  
5. Pre-release: default **Wait** + optional scenario chips (Beat/Inline/Miss) — don’t fake a single “real” Score.  
6. Add golden tests for every edge case above.  
7. Retire legacy Buy/Sell/Wait from public API.

---

# 5. Historical Engine / Score / Risk review

## 5.1 Similarity Engine

| Topic | Finding |
|---|---|
| Band-by-surprise | Reasonable |
| Top N default 10 | OK |
| Missing | Explicit distance metric, date decay, regime filter, outlier rejection |
| Missing | Definition of “similar” across series revisions |
| Risk | Small `n` presented as strong probability |

**Improve:** similarity = sign match + magnitude bucket + optional recency weight; never hide `n`.

## 5.2 Probability presentation

“Gold down 8/10” is excellent UX **if** statistically honest.

Require:
- Exact fraction  
- Time window of moves (e.g. close T+0 to T+15m — **must specify**)  
- Flat threshold  
- Disclaimer: sample ≠ prediction  

## 5.3 Confidence vs Reliability vs Score

Current PRD overloads three concepts. **Ship two:**

| Metric | Meaning |
|---|---|
| TradeImpact Score™ | Setup strength / coherence 0–100 |
| Reliability | Data/history quality band |

Internal `computeConfidence` may remain for legacy engines but must not appear as a third user-facing number.

## 5.4 TradeImpact Score™

Weights 30/25/20/15/10 are fine and aligned with `ENGINE.md`.

Issues:
- V (volatility) both rewards opportunity and collapses on Extreme — specify piecewise function  
- Pillar formulas for H, S, I, C, V are illustrative, not normative equations  
- Versioning policy exists — good; enforce in UI footnote  

**Improve:** publish exact pillar functions in `DECISION_CONTRACT.md`.

## 5.5 Risk Model

| Topic | Finding |
|---|---|
| Levels | Resolve Extreme → Very High |
| Prop caps | Good wedge |
| Fake-spike | Good; define window config |
| Gap | No explicit mapping table from (importance × surprise × session × estimate × reliability) → level in one place |
| Gap | Interaction with Score gates duplicated in tree |

**Improve:** Risk engine is pure function → level; Decision tree consumes level; no second risk logic in UI.

---

# 6. API review

## 6.1 Provider abstraction

**Strength:** `IEconomicCalendarProvider` + factory + mappers + mock fallback — production-minded.

**Gaps:**

| Gap | Action |
|---|---|
| No webhook/inbound Actual push | Future interface method |
| Historical from vendor vs proprietary DB | Clarify ownership |
| Rate-limit error typing | Distinct error class |
| Secondary provider failover order | Config matrix |
| Contract tests per mapper | Required in CI |

## 6.2 Future API support

Version strategy: additive fields OK; breaking → `/v2`. Good.

Do **not** introduce parallel `/api/v1` now. When user APIs land:

```text
/api/economic-calendar/*     # exists
/api/analyze                 # optional
/api/me, /api/watchlist, /api/journal, /api/alerts, /api/billing/*
```

## 6.3 Error handling

Lock one envelope:

```json
{ "ok": false, "error": "…", "code": "PROVIDER_UNAVAILABLE", "retryable": true, "requestId": "…" }
```

(Extend Part I; don’t replace with a different nested-only shape without migration.)

## 6.4 Offline mode

MVP: cached calendar + engines with bundled history + banner.  
Not a full offline-first PWA. Be honest in marketing.

## 6.5 Rate limiting

Specified for V1 — bring forward for calendar BFF even in beta (IP limits) to protect provider keys.

## 6.6 Caching

See §3.7. Add `Cache-Control` / ETag guidance for GET calendar.

---

# 7. Database review

## 7.1 MVP

localStorage versioned keys — acceptable for beta. Require schema version + migration helpers.

## 7.2 Normalize V1 (single DDL — proposed)

Separate **user domain** from **market domain**.

**User domain**

| Table | Purpose |
|---|---|
| `users` | Identity (prefer auth-provider subject; avoid storing password_hash if using Clerk/Auth.js) |
| `subscriptions` | Stripe customer/status/plan |
| `user_settings` | JSONB settings |
| `watchlist_items` | `(user_id, symbol, sort_order)` normalized |
| `saved_analyses` | Immutable snapshot + `model_version` |
| `journal_entries` | FK to analysis optional |
| `alert_subscriptions` | Event + types + channels |
| `audit_logs` | Security/compliance |

**Market domain**

| Table | Purpose |
|---|---|
| `event_series` | `series_id`, rules metadata |
| `economic_releases` | Prints |
| `release_asset_moves` | Outcomes |
| `provider_cache` | Optional operational |

**Reject** dual App. H vs App. BJ — merge before coding V1.

## 7.3 Indexes (minimum)

```text
saved_analyses (user_id, created_at DESC)
saved_analyses (event_id, asset)
journal_entries (user_id, created_at DESC)
alert_subscriptions (user_id, event_id)
economic_releases (series_id, release_at DESC)
economic_releases (series_id, surprise)  -- if querying similarity in DB
release_asset_moves (release_id, asset_key)
subscriptions (stripe_customer_id)
audit_logs (user_id, created_at DESC)
```

## 7.4 Future scalability

- Partition `economic_releases` by time when large  
- Read replica for historical similarity  
- Object storage for export blobs  
- Don’t put vendor raw payloads in hot user DB  

---

# 8. Security review

## 8.1 Current posture

PRD correctly requires: TLS, server-only vendor keys, CSP direction, disclaimer, dependency scanning.

## 8.2 Gaps (OWASP-aligned)

| Area | Finding | Priority |
|---|---|---|
| Authentication | TBD vendor; password_hash in DDL conflicts with hosted auth | Critical to decide before V1 |
| Authorization | “own journal only” stated; need IDOR test plan | High |
| API keys / secrets | Good; add secret scanning in CI | High |
| Rate limiting | Calendar abuse can burn vendor $ | High |
| Injection | Zod on all writes; parameterized SQL | High |
| XSS | Sanitize notes/markdown exports | High |
| CSRF | Cookie auth must use SameSite + CSRF strategy | High |
| SSRF | Provider URLs must be allowlisted | Medium |
| Sensitive data exposure | Don’t log Forecast/Actual PII aggregates with user email carelessly | Medium |
| Broken access control on exports | Pro-only features server-enforced | High |
| Security misconfiguration | CSP, headers baseline checklist missing as doc | Medium |
| Supply chain | Lockfile + audit in CI | High |
| FinTech-specific | Advice disclaimer not enough alone; avoid “guaranteed” copy; audit Score model changes | Critical |
| Mobile WebView | If later wrappers, deep-link validation | Low now |

## 8.3 Secrets

| Secret | Storage |
|---|---|
| TradingEconomics key/secret | Server env / KMS — never `NEXT_PUBLIC_*` |
| Stripe keys | Server |
| Auth secrets | Server |
| Push VAPID | Server |

## 8.4 Security recommendation

Add `docs/SECURITY.md` with threat model (STRIDE light), authn/z matrix, and secret handling before V1 coding. MVP local-first reduces auth attack surface — keep it that way until accounts ship.

---

# 9. Performance review

| Topic | PRD | Review |
|---|---|---|
| LCP ≤2.5s mobile | Stated | Keep; measure on mid-tier Android |
| Decision ≤50ms vs <100ms | Conflict | Lock **p95 ≤100ms** warm |
| SSR | Next hybrid | SSR shell + CSR engines OK |
| CSR engines | Instant UX | Prefer | 
| Lazy load | Playbook/details | Enforce |
| Images | Minimal | Prefer CSS atmosphere over heavy hero bitmaps |
| Bundle | Budget vague | Set route budgets; code-split intelligence panels |
| Calendar poll | 60s default | Faster only in release window |
| Fonts | Expressive fonts risk | Subset + `font-display: swap`; max 2 families |
| Countdown 1Hz | UX motion | Don’t re-render entire tree |

**SSR/CSR split recommendation:**

- SSR: shell, disclaimer, next-event skeleton  
- CSR: engines, interactive Why?/Playbook  
- Edge cache: public calendar GETs  

---

# 10. Mobile review

| Topic | Assessment |
|---|---|
| Mobile-first claim | Correct strategically |
| One-hand | Threatened by dense Event Detail |
| Navigation | Bottom quick actions good; 4-tab primary nav bad |
| Tap targets 44px | Stated — enforce |
| Accessibility | Lock WCAG **2.2 AA** |
| Screen sizes | xs→xl breakpoints OK; test 360×640 and 390×844 |
| Reduced motion | Required for score count-up / pulse |
| Orientation | Portrait primary; don’t require landscape |
| Safe areas | Not specified — add for notched devices |
| Offline banner | Required |

**Mobile simplification:** bottom nav **Home | Calendar | Alerts(badge) | More**; Analyze is not a tab — it’s an action on Event.

---

# 11. SaaS readiness

| Capability | MVP | V1 | Gap |
|---|---|---|---|
| Subscriptions | No | Yes | Pick Stripe; one price book |
| Roles | Anonymous local | Free/Pro/Team later | Don’t invent Team early |
| Billing | — | Checkout + portal | Server webhooks + idempotency |
| Entitlements | — | Export, push, sync | **Server enforce** |
| Analytics | Events listed | Dashboards | Privacy policy; no note text |
| Audit logs | Mentioned lightly | Admin/billing/auth | Schema + retention |
| Feature flags | Score v2, LLM | Needed | LaunchDarkly/config |
| Quotas | “10/day” premature | After auth | Remove until enforceable |
| Customer support tools | Missing | Needed | Admin event/provider status |
| Tax/VAT | Missing | Needed for paid | Stripe Tax consideration |
| Data export/delete | GDPR gap | P1 | Rights endpoints |

**SaaS verdict:** Product can soft-launch **without** billing. Do not implement cosmetic paywalls on client-only engines.

---

# 12. Risks register

## 12.1 Technical risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| T1 | Normative PRD contradictions | Certain | High | Decision Contract + authority |
| T2 | Bad historical labels → wrong Score | High | Critical | Data spec + show `n` |
| T3 | Static correlation misleads crypto/indices | High | High | Caveats + lower C |
| T4 | Provider outage / rate limit at print | High | High | Cache, mock, secondary |
| T5 | Actual latency too slow for edge traders | High | High | Expectation copy + faster poll window |
| T6 | Client quota bypass | High | Med | No quotas until server |
| T7 | Bundle bloat (engines+history JSON) | Med | Med | Split by series packs |
| T8 | localStorage data loss | Med | Med | Export + later sync |
| T9 | Auth vendor lock-in | Med | Med | Abstract identity |
| T10 | Dual design systems | Med | Med | `nb-*` only |
| T11 | Circular reliability/score logic | Med | High | Reorder pipeline |
| T12 | Burst QPS | Med | High | Analyze cache |

## 12.2 Business risks

| ID | Risk | Mitigation |
|---|---|---|
| B1 | Users treat output as financial advice | Disclaimer + Avoid/Wait education + legal |
| B2 | Competing with free calendars on price | Sell decision, not calendar |
| B3 | Low WTP if Score feels wrong once | Calibration + humility UX |
| B4 | Prop firms ban “signal” tools | Market as process/risk education |
| B5 | Provider cost/margin | Cache; mock; negotiated tiers |
| B6 | Trademark/Score™ claims | Legal clearance |
| B7 | Premature Team SKU distracts | Beachhead retail/prop individuals |
| B8 | Scope sprawl delays launch | MVP cut freeze |

## 12.3 UX risks

| ID | Risk | Mitigation |
|---|---|---|
| U1 | Dashboard clutter | Hero budget rewrite |
| U2 | Beginner overload on Event Detail | Progressive disclosure |
| U3 | Pre-release Score misread as signal | Provisional label + default Wait |
| U4 | Metric confusion (3 certainty numbers) | Score + Reliability only |
| U5 | Avoid on NFP feels useless | Excellent flat playbook + journal credit |
| U6 | Multiple entry doors | Event-centric IA |
| U7 | Alert fatigue | Sensible defaults; quiet hours V1 |

---

# 13. Missing documents (required before development)

Create these **before** authorizing build sprints. PRD alone is not enough.

| # | Document | Owner | Purpose |
|---|---|---|---|
| 1 | **Decision Contract** (`docs/DECISION_CONTRACT.md`) | PM + Arch | Enums, gates, pillar math, pre/post modes |
| 2 | **MVP Scope Freeze** (`docs/MVP_SCOPE.md`) | PM | In/out list signed by CTO/PM |
| 3 | **PRD Authority Addendum** | PM | Part I normative; Part II draft |
| 4 | **Historical Data Spec** | Data | Sources, windows, labeling, QA |
| 5 | **Symbol & Series Catalog** (single) | PM + Eng | Canonical IDs |
| 6 | **API Contract** (freeze `API.md` + changelog) | Eng | Envelope, errors, caching |
| 7 | **UX IA & Wireframe Pack** (Figma or text W1–W6 only) | Design | Hero + Event + Result |
| 8 | **Design Token Spec** (`nb-*` extension) | Design | No `--ti-*` fork |
| 9 | **Threat Model / SECURITY.md** | Security | Authn/z, secrets, OWASP |
| 10 | **Privacy Policy + Disclaimer legal pack** | Legal | Before public beta |
| 11 | **Analytics Spec** | Product | Event dictionary + PII rules |
| 12 | **SLO / Error Budget doc** | Eng | One latency/availability table |
| 13 | **QA Golden Scenario Pack** | QA | G01–Gxx locked to Decision Contract |
| 14 | **Runbooks** (provider outage, bad Actual) | Eng/Ops | Already sketched — formalize |
| 15 | **Pricing one-pager** | PM | Single price book |
| 16 | **Auth & Entitlements design** (V1) | Arch | Before monetization code |
| 17 | **Data Retention & GDPR** | Legal + Eng | Delete/export |
| 18 | **Model Changelog** | PM | Score weight history |

**Optional but recommended:** ADR log (`docs/adr/`) for auth vendor, monorepo vs single app, analyze client vs server.

---

# 14. Complete action plan

## Critical (P0) — gate; no feature coding

| ID | Action | Owner | Done when |
|---|---|---|---|
| C-01 | Declare PRD Part I + ENGINE + API as sole normative sources; mark Part II draft | PM | Header updated |
| C-02 | Write & approve Decision Contract (enums, gates, pillars, pre/post) | PM + Arch | Doc merged; ENGINE aligned |
| C-03 | Publish MVP Scope Freeze (cut Terminal, PDF, Team, LLM, global search, token fork) | PM + CTO | Signed list |
| C-04 | Resolve Risk/Reliability/Score gate conflicts in PRD body | PM | Single tables in §18–21 |
| C-05 | Freeze API to `/api/economic-calendar/*` envelope | Arch | Part II `/api/v1` demoted |
| C-06 | Historical Data Spec (move window, similarity, `n` policy) | Data | Doc reviewed |
| C-07 | Rewrite Workspace IA to hero budget; remove Terminal from MVP nav | Design + PM | §14–16 patched |
| C-08 | Canonical symbol/series catalog | PM + Eng | One table |
| C-09 | Legal disclaimer pack for beta | Legal | Approved copy |
| C-10 | Remove unenforceable Free “10 analyses/day” until auth+server quota | PM | Pricing patched |

## High (P1) — before public beta / accounts

| ID | Action | Owner |
|---|---|---|
| H-01 | UX wireframe pack W1–W6 only; progressive disclosure on Event | Design |
| H-02 | State management ADR (SWR + local store) | Arch |
| H-03 | Security.md threat model + rate limits on calendar BFF | Security |
| H-04 | Single V1 DDL (merge H/BJ); indexes listed | Arch |
| H-05 | Alert taxonomy lock (recommend T-15/T-5/T-0; T-30 in V1) | PM |
| H-06 | Golden scenario suite mapped to Decision Contract | QA |
| H-07 | SLO single table (latency/availability) | Eng |
| H-08 | Analytics + privacy event dictionary | Product |
| H-09 | Provider secondary failover config | Eng |
| H-10 | Pre-release Provisional UX acceptance criteria | PM + Design |
| H-11 | Extend `nb-*` tokens — reject `--ti-*` MVP | Design |
| H-12 | Calibration metric design (internal) | Data + PM |

## Medium (P2) — V1 monetization readiness

| ID | Action | Owner |
|---|---|---|
| M-01 | Auth vendor decision + entitlements matrix | Arch |
| M-02 | Stripe pricing one-pager + webhook idempotency design | PM + Eng |
| M-03 | Audit log schema | Security |
| M-04 | GDPR export/delete endpoints design | Eng + Legal |
| M-05 | PDF export as Pro | Eng |
| M-06 | Push notifications design | Eng |
| M-07 | FOMC qualitative input FR + UX | PM |
| M-08 | Analyze API + quota (if paid limits) | Arch |
| M-09 | Collapse duplicate PRD appendices | PM |
| M-10 | Status page + runbooks productionized | Ops |

## Low (P3) — post-PMF

| ID | Action | Owner |
|---|---|---|
| L-01 | Terminal densified workspace (not separate product) | Design |
| L-02 | Regime-aware correlation | Data |
| L-03 | Actual websockets | Eng |
| L-04 | LLM narrative behind flag | Eng + Legal |
| L-05 | Team seats / SSO | Eng |
| L-06 | Live News feed (only if product-defined) | PM |
| L-07 | Native shells / PWA install | Eng |
| L-08 | B2B Score API | Arch |
| L-09 | Monorepo extract `packages/engine` | Eng |
| L-10 | Multi-region active-active | Eng |

---

## Go / No-Go checklist

| Checkpoint | Status |
|---|---|
| Product wedge clear | **GO** |
| Spec single source of truth | **NO-GO** |
| MVP cut signed | **NO-GO** |
| Decision math locked | **NO-GO** |
| API frozen | **Partial (API.md exists; PRD conflicts)** |
| UX IA simplified | **NO-GO** |
| Security baseline for MVP local | **Conditional GO** |
| SaaS billing required for beta | **Not required** |
| Historical data honesty rules | **NO-GO** |

**Final CTO recommendation:**  
**Conditional Go** to a **documentation sprint** (Critical + selected High).  
**No-Go** to feature development until C-01…C-10 are closed.

---

## Appendix — Proposed Decision Contract defaults (for immediate debate)

| Topic | Default lock |
|---|---|
| Reliability | Very Low → Very High (5) |
| Risk | Low / Medium / High / Very High (“Extreme” alias = Very High) |
| Pillars | 0–100 × weights 30/25/20/15/10 |
| Gates | Avoid if risk=Very High OR score≤34; Wait if pre-release OR score≤49 OR neutral; Aggressive if score≥78 AND reliability≥High AND risk≤Medium; else Conservative if score≥50 & directional |
| UX metrics | Score + Reliability only |
| Alerts MVP | T-15 / T-5 / T-0 |
| API | `docs/API.md` |
| Tokens | `nb-*` |
| Free beta | Unlimited local analyses |

---

**End of Architecture & Design Review**  
TradeImpact — *Know the Impact Before You Trade.*  
*No code was produced as part of this review.*
