# TradeImpact
## Product Requirements Document (PRD)

| Field | Value |
|---|---|
| **Product** | TradeImpact |
| **Tagline** | Know the Impact Before You Trade. |
| **Document type** | Product Requirements Document (PRD) |
| **Status** | Development-ready / Investor-ready |
| **Version** | 1.1 |
| **Classification** | Confidential — Internal & Investor Use |
| **Audience** | Product, Design, Engineering, Data, Growth, Leadership, Investors |
| **Related docs** | `docs/API.md`, `docs/ENGINE.md` |
| **Length** | ~3,600+ lines / ~21k words — approximately 70–85 pages exported to PDF |

---

### Document control

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-08-06 | Product / Architecture | Initial complete PRD covering MVP through Intelligence Engine |
| 1.1 | 2026-08-06 | Product / Architecture | Part II extended specs: full backlog, algorithms, UX wireframes, API/DDL, GTM, QA |

### How to use this document

1. **Investors** — Sections 1–8, 47–49, Success Metrics, Appendix BP.
2. **Design** — Sections 14–16, Appendix W / BX, Design philosophy, 38–39.
3. **Engineering** — Sections 12–13, 17–33, 34–46, Appendices X–BJ.
4. **QA** — Sections 12, 40–41, 45, Appendices AP / AZ / BO.
5. **Go-to-market** — Sections 7–10, 48–50, Appendices AS–AW.

---

# 1. Executive Summary

**TradeImpact** is an AI-powered **News Trading Decision Platform**. It transforms macroeconomic releases (CPI, NFP, FOMC, PMI, GDP, and related high-impact events) into clear, explainable trading decisions for Forex, metals, crypto, and index traders.

Economic calendars already exist. Bloomberg, Investing.com, Forex Factory, and TradingView already display *when* news prints and *what* the numbers were. Traders still ask:

> **What should I trade — and why?**

TradeImpact answers that question in seconds.

### What TradeImpact is

- A decision layer on top of economic news.
- A system that converts Forecast / Previous / Actual + history + correlation into a **TradeImpact Score™**, a directional bias, a confidence/reliability reading, a risk assessment, a scenario range, and a trade playbook.
- A workspace for watchlists, alerts, history, and a trade journal — optimized for speed before and after a release.

### What TradeImpact is not

- Not a charting platform (it does not replace TradingView).
- Not a raw news wire (it does not replace Investing.com or Dow Jones).
- Not a broker or execution venue.
- Not financial advice; outputs are educational decision-support tools.

### Product thesis

> **Raw macro data is abundant. Actionable intelligence is scarce.**  
> TradeImpact industrializes the mental model of a professional news trader: surprise → USD bias → correlated assets → historical confirmation → risk → playbook.

### Strategic positioning

| Competitor class | Gap | TradeImpact wedge |
|---|---|---|
| Economic calendars | Show schedule, not decisions | Decision Engine + Score |
| Charting platforms | Charts without macro reasoning | News → bias → playbook |
| ChatGPT / generic AI | Unstructured, non-deterministic trading advice | Deterministic engines + explainable AI narrative |
| Signal services | Opaque “buy/sell” alerts | Full **Why?** trail |

### North-star outcome

A trader opens TradeImpact 15 minutes before CPI, pins Gold and EURUSD, sees:

- TradeImpact Score **91 / 100**
- Decision: **Conservative Sell Gold**
- Reliability: **High**
- Historical match: Gold down **8 / 10** similar prints
- Playbook: wait for spike → confirmation → risk 0.5–1%

…and knows *exactly why* — without opening five tabs.

---

# 2. Problem Statement

### 2.1 The market problem

High-impact economic news moves gold, FX, crypto, and indices within seconds. The industry tools that surround this moment are fragmented:

1. **Calendars** list events and consensus numbers.
2. **Charts** show price after the move has started.
3. **Social / Telegram / Discord** flood traders with conflicting takes.
4. **AI chatbots** invent plausible but non-reproducible explanations.

None of these reliably answer the trader’s real question at T−5 minutes:

> Given this release, for *my* watchlist, what is the bias, how strong is it, how often has history agreed, what is the risk, and what is the plan?

### 2.2 User pain points

| Pain | Consequence |
|---|---|
| Too many tabs at release time | Slow decisions, missed or late entries |
| No unified “impact → asset” map | Traders mis-apply USD logic to gold/crypto |
| No historical confirmation at a glance | Overconfidence or hesitation |
| No risk framing | Oversizing into extreme volatility |
| Opaque signal services | No trust, no learning |
| Beginners copy headlines | Wrong direction on inverted news (e.g. unemployment) |

### 2.3 Opportunity

Build the **decision OS for news trading**: deterministic engines for scoring and correlation, historical intelligence for reliability, and AI narrative for explanation — delivered in a mobile-first trading terminal UX.

### 2.4 Problem statement (one sentence)

**Economic calendars show the news; TradeImpact turns the news into an explainable trading decision.**

---

# 3. Vision

**Vision:** Become the default decision layer traders open before every high-impact release — the place where macro becomes a clear, trusted trade plan.

In five years, TradeImpact is:

- The standard pre-news checklist for retail and prop traders.
- Recognized for **TradeImpact Score™** as a category-defining metric.
- Provider-agnostic for calendar data, with a proprietary intelligence layer.
- Trusted because every recommendation is explainable and historically grounded.

---

# 4. Mission

**Mission:** Convert macroeconomic news into fast, transparent, actionable trading intelligence — so traders know the impact before they trade.

We do this by:

1. Ingesting high-impact economic events from pluggable providers.
2. Measuring surprise and mapping it through configurable news rules.
3. Confirming with historical similar releases.
4. Propagating bias through a correlation engine.
5. Scoring confidence, reliability, risk, and scenarios.
6. Packaging the result as a playbook with a human-readable **Why?**.

---

# 5. Goals

### 5.1 Product goals

| ID | Goal | Horizon |
|---|---|---|
| G1 | Ship a complete news → decision → playbook loop | MVP |
| G2 | Make TradeImpact Score™ the primary decision metric | MVP |
| G3 | Explain every recommendation (Why?) | MVP |
| G4 | Support Forex, metals, crypto, indices watchlists | MVP |
| G5 | Provider-agnostic calendar architecture | MVP |
| G6 | Mobile-first terminal UX under 2s interactive path | MVP |
| G7 | Prop-firm friendly risk framing (sizing reminders) | V1 |
| G8 | Retention via journal, history, alerts | V1 |

### 5.2 Business goals

| ID | Goal |
|---|---|
| B1 | Validate willingness to pay for decision intelligence (not calendar data) |
| B2 | Achieve activation: first full analysis within 3 minutes of signup |
| B3 | Build a defensible dataset of historical releases + outcome labels |
| B4 | Partner-ready API for calendar providers and future B2B embeds |

### 5.3 Non-goals (explicit)

- Live order execution / brokerage.
- Full tick charting suite.
- Social copy-trading network (future consideration only).
- Guaranteed P&L or “sure-fire” signals marketing.

---

# 6. Success Metrics

### 6.1 Product KPIs

| Metric | Definition | Target (12 months) |
|---|---|---|
| **Activation rate** | % of new users who complete one analysis with Actual/Forecast | ≥ 55% |
| **Time-to-first-decision** | Signup → first scored recommendation | ≤ 3 minutes |
| **Weekly active traders (WAT)** | Users with ≥1 analysis or calendar session / week | Growth MoM ≥ 8% |
| **Analyses per WAT** | Mean analyses / week | ≥ 4 |
| **Why? engagement** | % of result views that open Why? or intelligence panel | ≥ 35% |
| **Playbook export rate** | Exports / analyses | ≥ 10% |
| **Alert CTR** | Opens from local/push alerts | ≥ 25% |
| **Journal adoption** | Users with ≥1 journal entry in 14 days | ≥ 20% |

### 6.2 Quality KPIs

| Metric | Target |
|---|---|
| Decision engine unit test coverage (core) | ≥ 90% |
| Calendar API p95 latency (cached) | ≤ 200 ms |
| Calendar API p95 latency (live provider) | ≤ 1.5 s |
| Error rate (5xx) | < 0.5% |
| Crash-free sessions | ≥ 99.5% |

### 6.3 Business KPIs

| Metric | Target |
|---|---|
| Free → paid conversion (90 days) | ≥ 4% |
| Monthly churn (paid) | ≤ 6% |
| NPS | ≥ 40 |
| Gross margin (SaaS) | ≥ 75% |

### 6.4 North-star metric

**Weekly Decision Sessions** — number of sessions where a user views a scored recommendation for a high-impact event within ±2 hours of release.

---

# 7. Target Audience

### 7.1 Primary segments

| Segment | Markets | Motivation |
|---|---|---|
| Forex traders | EURUSD, GBPUSD, USDJPY, etc. | USD-driven pairs around US data |
| Gold / silver traders | XAUUSD, XAGUSD | Inverse-USD + risk sentiment |
| Crypto traders | BTC, ETH | Macro risk-on/off around Fed/CPI |
| Index traders | NAS100, US30, SPX500 | Rate & inflation sensitivity |
| Prop firm traders | Multi-asset | Strict risk rules; need process |

### 7.2 Experience levels

| Level | Needs |
|---|---|
| **Beginner** | Plain language, defaults, guardrails, Avoid/Wait recommendations |
| **Intermediate** | Score + history + playbook; customizable watchlist |
| **Professional** | Full Why? trail, exports, journal, provider choice, scenarios |

### 7.3 Geographic / session focus

Global, session-aware (Asian / London / New York / Overlap). Primary content initially **USD high-impact** releases; architecture supports multi-currency expansion.

---

# 8. User Personas

### Persona A — “Amina” · Intermediate Gold Trader

- **Age:** 29 · Part-time trader · Africa / remote
- **Stack:** TradingView + Forex Factory
- **Pain:** Misses the first gold spike; unsure whether to fade or follow
- **Goal:** Clear Gold bias + wait-for-confirmation playbook before CPI
- **Success:** Conservative Sell with High reliability; journals the trade

### Persona B — “Marcus” · Prop Firm Forex Trader

- **Age:** 34 · Full-time · FTMO-style rules
- **Pain:** Risk of violating daily loss limits on news
- **Goal:** Risk level + sizing reminder + Avoid when score is weak
- **Success:** Avoids low-score setups; exports playbook for review

### Persona C — “Yuki” · Beginner Crypto Trader

- **Age:** 22 · Mobile-first
- **Pain:** Reads “hot CPI” headlines; buys BTC into USD strength
- **Goal:** Simple narrative: why BTC bias is bearish today
- **Success:** Understands correlation; uses Wait on extreme volatility

### Persona D — “Elena” · Professional Multi-Asset Desk

- **Age:** 41 · Hedge fund junior / prop desk
- **Pain:** Needs explainability for post-trade review
- **Goal:** Full decision tree + historical match + scenario ranges
- **Success:** Uses Why? and intelligence panel in daily process

---

# 9. User Stories

Format: *As a [persona], I want [capability], so that [outcome].*

### 9.1 Calendar & news

1. As a trader, I want a high-impact economic calendar with countdown, so that I never miss the next release.
2. As a trader, I want Forecast / Previous / Actual on one card, so that I can judge surprise instantly.
3. As a trader, I want historical results for an event, so that I can see how markets reacted before.
4. As a mobile trader, I want offline cached calendar data, so that I still see the schedule if the API fails.

### 9.2 Decision & intelligence

5. As a gold trader, I want a TradeImpact Score™ for CPI vs Gold, so that I know how strong the setup is.
6. As a prop trader, I want Avoid / Wait / Aggressive|Conservative Buy|Sell, so that my action matches risk appetite.
7. As any trader, I want a Why? explanation, so that I trust and learn from the recommendation.
8. As a professional, I want best / expected / worst scenarios, so that I plan targets and invalidation.
9. As a beginner, I want a plain-language AI narrative, so that I understand USD → asset logic.

### 9.3 Playbook & risk

10. As a trader, I want a before / during / after plan, so that I do not enter blindly into the spike.
11. As a prop trader, I want recommended risk percentages, so that I size correctly.
12. As a trader, I want fake-spike warnings when history is mixed, so that I wait for confirmation.

### 9.4 Workspace

13. As a trader, I want a pin-able watchlist, so that the dashboard only shows my markets.
14. As a trader, I want one-click analysis for today’s event across my watchlist, so that I skip multi-step forms.
15. As a trader, I want a trade journal, so that I review process quality.
16. As a trader, I want alerts for upcoming / released / analysis-ready, so that I show up on time.

### 9.5 Platform

17. As an admin/operator, I want provider switching via env config, so that we are not locked to one data vendor.
18. As a paying user, I want export (PDF/TXT/Copy), so that I archive decisions.

*(Full backlog: 80+ stories in Appendix A style — core MVP stories above are P0.)*

### 9.6 Priority legend

| Priority | Meaning |
|---|---|
| P0 | MVP blockers |
| P1 | V1 differentiators |
| P2 | Post-PMF enhancements |

---

# 10. User Journey

### 10.1 Primary journey — Pre-news decision (happy path)

```text
Open TradeImpact
    → Home / Workspace dashboard
    → See Next High-Impact News + Countdown
    → Confirm Watchlist (Gold, EURUSD, …)
    → Tap event (or wait for Actual)
    → Decision Engine runs
    → View TradeImpact Score + Decision + Reliability
    → Open Why? / Intelligence panel
    → Review Trade Playbook + Risk
    → Optional: set alert / save journal stub
    → Execute externally (broker / TradingView)
    → Return to journal result
```

### 10.2 Journey map

| Stage | User thinking | Product moment |
|---|---|---|
| Discover | “Calendars don’t tell me what to trade” | Landing / tagline |
| Activate | “Show me CPI → Gold in 30 seconds” | First analysis |
| Prepare | “What’s next and when?” | Calendar + countdown |
| Decide | “Is this strong enough?” | Score + decision |
| Plan | “How do I enter?” | Playbook |
| Protect | “How much can I lose?” | Risk engine |
| Review | “Did I follow process?” | Journal + history |
| Retain | “Alert me next time” | Notifications |

### 10.3 Critical UX constraint

**Maximum three taps** from home to a scored recommendation for a pinned asset when Actual is available (or outcome is tapped).

---

# 11. Feature List

### 11.1 MVP (P0)

| Feature | Description |
|---|---|
| Economic Calendar | High-impact events, filters, countdown |
| Event Detail | Forecast / Previous / Actual, history search |
| Decision Engine | Surprise → bias → action |
| TradeImpact Score™ | 0–100 weighted score |
| Reliability Meter | Very Low → Very High |
| Historical Intelligence | Similar releases + asset votes |
| Correlation Engine | USD → multi-asset map |
| Risk Engine | Level + why |
| Scenario Engine | Best / Expected / Worst |
| AI Narrative | Why-focused summary |
| Trade Playbook | Setup, plan, entries, TP/SL guides |
| Why? | Factor breakdown |
| Watchlist | Pin assets for dashboard |
| Workspace Dashboard | Next news, bias, one-click |
| History | Local analysis history |
| Trade Journal | Entry / SL / TP / P&L / notes |
| Settings | Theme, defaults, notification prefs |
| Provider Architecture | Mock + TradingEconomics + factory |
| Export / Share | PDF, TXT, Copy |

### 11.2 V1 (P1)

| Feature | Description |
|---|---|
| Push notifications | Optional web push |
| Multi-currency calendars | EUR / GBP / JPY primaries |
| Strategy favorites | Named playbooks |
| CSV analytics export | Journal + history |
| Team / prop seats | Shared templates (light) |

### 11.3 Future (P2)

See Section 50.

---

# 12. Functional Requirements

### 12.1 Conventions

| ID format | `FR-<MODULE>-<NNN>` |
| Priority | P0 / P1 / P2 |
| MoSCoW | Must / Should / Could / Won’t (MVP) |

### 12.2 Calendar

| ID | Requirement | Priority |
|---|---|---|
| FR-CAL-001 | System SHALL list upcoming high-impact economic events with country, currency, title, impact, forecast, previous, actual, datetime | P0 |
| FR-CAL-002 | System SHALL provide a countdown to release time | P0 |
| FR-CAL-003 | System SHALL allow filtering by currency (ALL, USD, EUR, …) | P0 |
| FR-CAL-004 | System SHALL show event detail including historical results search | P0 |
| FR-CAL-005 | System SHALL support Manual vs Live actual entry modes | P0 |
| FR-CAL-006 | System SHALL deep-link an event into analysis with prefilled values | P0 |
| FR-CAL-007 | System SHALL fall back to mock/cached data if live provider fails | P0 |

### 12.3 Decision / Intelligence

| ID | Requirement | Priority |
|---|---|---|
| FR-DEC-001 | System SHALL compute surprise from Actual − Forecast (or tapped outcome) | P0 |
| FR-DEC-002 | System SHALL map surprise through news rules (including inverted series) | P0 |
| FR-DEC-003 | System SHALL compute USD direction and pair direction via correlation map | P0 |
| FR-DEC-004 | System SHALL produce TradeImpact Score™ 0–100 with published weights | P0 |
| FR-DEC-005 | System SHALL produce Reliability meter band | P0 |
| FR-DEC-006 | System SHALL produce decision ∈ {Avoid, Wait, Aggressive Buy, Conservative Buy, Aggressive Sell, Conservative Sell} | P0 |
| FR-DEC-007 | System SHALL expose a Why? factor list for every decision | P0 |
| FR-DEC-008 | System SHALL generate AI narrative explaining WHY, not only WHAT | P0 |
| FR-DEC-009 | System SHALL compute Best / Expected / Worst scenarios per selected asset | P0 |
| FR-DEC-010 | System SHALL compute Risk level with textual rationale | P0 |

### 12.4 Playbook

| ID | Requirement | Priority |
|---|---|---|
| FR-PB-001 | System SHALL generate Trade Setup card (asset, bias, confidence/score, risk) | P0 |
| FR-PB-002 | System SHALL generate Before / During / After plan phases | P0 |
| FR-PB-003 | System SHALL list entry strategies with explanations from config | P0 |
| FR-PB-004 | System SHALL show risk % options and position sizing reminder | P0 |
| FR-PB-005 | System SHALL show TP1–TP3 and trail placeholders (no live price calc in MVP) | P0 |
| FR-PB-006 | System SHALL show SL placement guides (liquidity / spike / swing) | P0 |
| FR-PB-007 | System SHALL warn on high fake-spike probability when configured thresholds hit | P0 |
| FR-PB-008 | System SHALL allow export PDF / TXT / Copy and share summary | P0 |

### 12.5 Workspace

| ID | Requirement | Priority |
|---|---|---|
| FR-WS-001 | System SHALL provide dashboard: next news, countdown, today’s bias, watchlist, recent analysis | P0 |
| FR-WS-002 | System SHALL persist watchlist pins in local storage (MVP) / user DB (V1) | P0 |
| FR-WS-003 | System SHALL support one-click multi-asset bias for focus event | P0 |
| FR-WS-004 | System SHALL provide global search (news, pairs, assets, strategies) | P0 |
| FR-WS-005 | System SHALL display market session status (Asian/London/NY/Overlap) | P0 |

### 12.6 Journal / History / Alerts / Settings

| ID | Requirement | Priority |
|---|---|---|
| FR-JRN-001 | Journal SHALL store Entry, SL, TP, Result, P/L, Notes | P0 |
| FR-HIS-001 | History SHALL store last N analyses reopenable with inputs | P0 |
| FR-ALT-001 | Notifications SHALL support Upcoming / Released / Analysis Ready (local MVP) | P0 |
| FR-SET-001 | Settings SHALL include theme, language, default pair, default news, notification prefs | P0 |

### 12.7 Platform

| ID | Requirement | Priority |
|---|---|---|
| FR-PLT-001 | Calendar providers SHALL implement a shared interface | P0 |
| FR-PLT-002 | Secrets SHALL never ship to the client bundle | P0 |
| FR-PLT-003 | System SHALL retry provider calls (max 3) and serve stale cache on failure | P0 |

---

# 13. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-001 | Performance | Time-to-interactive for workspace ≤ 2.5s on mid-tier mobile (4G) |
| NFR-002 | Performance | Decision computation (client or edge) ≤ 50 ms for warm data |
| NFR-003 | Availability | 99.5% monthly for web app; degrade gracefully if calendar provider down |
| NFR-004 | Scalability | Support 50k MAU on horizontal web tier; DB later for accounts |
| NFR-005 | Security | HTTPS only; no secrets in client; CSP; dependency scanning |
| NFR-006 | Privacy | Local-first MVP data; clear policy when accounts ship |
| NFR-007 | Accessibility | WCAG 2.2 AA for core flows |
| NFR-008 | i18n | English MVP; language setting stub for ES/DE/FR/JA |
| NFR-009 | Observability | Structured logs for API duration, provider, retries (dev + prod sampled) |
| NFR-010 | Testability | Unit tests for all engines; contract tests for providers |
| NFR-011 | Compliance | Educational disclaimer on all decision surfaces |
| NFR-012 | Offline | Cached calendar + last intelligence view readable offline |

---

# 14. Information Architecture

```text
TradeImpact
├── Marketing Landing (public)
├── App Shell (authenticated or local profile)
│   ├── Workspace (Home Dashboard)
│   ├── Calendar
│   │   └── Event Detail
│   ├── Analysis (Decision)
│   │   ├── Result
│   │   ├── Intelligence (Why / Score / Scenarios)
│   │   └── Playbook
│   ├── Terminal (Pro desk view)
│   ├── History
│   ├── Journal
│   ├── Watchlist (embedded + manage)
│   ├── Notifications Inbox
│   └── Settings
└── Legal
    ├── Disclaimer
    ├── Privacy
    └── Terms
```

### Primary objects

| Object | Description |
|---|---|
| EconomicEvent | Calendar release |
| Analysis | Scored decision for event × pair × inputs |
| IntelligenceReport | Score, reliability, tree, scenarios, narrative |
| Playbook | Actionable plan derived from analysis |
| WatchAsset | Pinned instrument |
| JournalEntry | User trade log |
| Notification | Local/push inbox item |
| UserPreferences | Theme, defaults, alerts |

---

# 15. Navigation

### 15.1 Primary nav (app)

| Item | Route (logical) | Purpose |
|---|---|---|
| Workspace | `/workspace` | Home dashboard |
| Calendar | `/calendar` | Economic calendar |
| Analysis | `/news-bias` or `/analyze` | Decision tool |
| Terminal | `/terminal` | Dense pro desk |
| Journal | `/workspace#journal` or `/journal` | Trade log |
| Settings | `/workspace#settings` or `/settings` | Preferences |

### 15.2 Quick actions (FAB)

Analyze · Calendar · History · Journal

### 15.3 Cross-links

- Event Detail → Analysis (prefill)
- Analysis → Playbook / Intelligence
- Workspace one-click → Intelligence + Playbook
- Notification → Event or Analysis

### 15.4 Nav principles

- Persistent top identity + theme toggle
- Active route accent
- Mobile: bottom quick actions + simplified top nav
- Never bury **Why?** more than one interaction from the result

---

# 16. Dashboard Layout

### 16.1 Philosophy

One composition, not a widget junkyard. First viewport:

1. Brand / product name (hero-level)
2. One headline context (next release)
3. Countdown
4. Primary CTA (Analyze / Open event)
5. Dominant status (session / score if live)

Secondary sections scroll: bias, watchlist, one-click, checklist, playbook, journal, settings.

### 16.2 Section inventory (Workspace)

| Section | Purpose |
|---|---|
| Global Search | Find news/assets fast |
| Market Status | Asian / London / NY / Overlap + Open/Closed |
| Next High Impact News | Focus event |
| Countdown | Time to release |
| Today’s Bias | Snapshot for pinned majors |
| Watchlist | Pins only |
| Trade Checklist | Pre-trade gates |
| One Click Analysis | Multi-asset bias |
| AI Trade Playbook | Plan (when analysis ready) |
| TradeImpact Intelligence | Score / scenarios (when ready) |
| Recent Analysis | Reopen |
| Journal | Log |
| Favorites | News / pairs / strategies |
| Notifications | Inbox |
| Settings | Prefs |

### 16.3 Layout rules

- Max content width ~3xl for readability on desktop
- Cards only for interactive containers
- Dense but breathable trading-terminal spacing
- Dark theme default; light optional

---


# 17. Economic Calendar Module

### 17.1 Purpose

Provide a trustworthy, fast schedule of high-impact releases and the numeric inputs the Decision Engine needs.

### 17.2 Capabilities

| Capability | Details |
|---|---|
| Event list | Sorted by datetime; high-impact default |
| Fields | id, country, currency, title, impact, forecast, previous, actual, date, time, unit, revised, source |
| Countdown | Live relative timer |
| Filters | Currency + ALL |
| Favorites | Star events locally |
| Reminders | 15 / 5 / 0 minutes before (local) |
| Detail page | Description, importance, markets affected, history search |
| Modes | Manual Actual entry · Live Actual polling (when provider supports) |
| Deep link | Prefill analysis query params |

### 17.3 States

| State | UI |
|---|---|
| Loading | Skeletons |
| Empty filter | Empty copy + clear filters |
| Error | Error card + Retry |
| Offline | Banner + cached rows |
| Provider fallback | Silent mock/cache; optional subtle “using cached data” |

### 17.4 Business rules

- Impact levels: high / medium / low (provider mapped).
- MVP calendar focus: high-impact.
- Actual may be null pre-release.
- Revised values supported in model; display when present.

### 17.5 Acceptance criteria

1. User can open calendar and see next USD high-impact event with countdown.
2. User can open detail and navigate to analysis with forecast/previous/actual prefilled.
3. Killing the network still shows last cached events.

---

# 18. Decision Engine

### 18.1 Purpose

Convert release inputs into a directional trading decision for a selected instrument, with strength, confidence, and explainability.

### 18.2 Inputs

| Input | Type | Source |
|---|---|---|
| News (event id) | enum / id | Calendar or picker |
| Forecast | number \| null | Calendar / user |
| Previous | number \| null | Calendar / user |
| Actual | number \| null | Calendar / user / live |
| Outcome tap | beat / miss / in-line | UI fallback if numbers absent |
| Pair / asset | id | Watchlist / picker |
| Historical cohort | series | Historical DB |
| Correlation map | config | JSON |
| News rules | config | JSON |

### 18.3 Processing pipeline (normative)

```text
News Rule Lookup
      ↓
Surprise Engine  (Actual − Forecast or tapped outcome)
      ↓
USD Direction  (interpretation: higher_is_usd_bullish | higher_is_usd_bearish)
      ↓
Correlation Engine  (USD → selected asset + related assets)
      ↓
Historical Intelligence  (similar releases, win rates, avg moves)
      ↓
Volatility + Risk assessment
      ↓
TradeImpact Score™ + Reliability
      ↓
Decision Tree  → Avoid / Wait / Aggressive|Conservative Buy|Sell
      ↓
AI Narrative + Why? factors + Playbook
```

### 18.4 Surprise model

| Concept | Definition |
|---|---|
| Difference | Actual − Forecast |
| Sign | positive / negative / flat |
| Strength | neutral / weak / moderate / strong / extreme (threshold JSON) |
| Impact | very-low → very-high (mapped from strength + news importance) |
| Estimate flag | true when outcome tapped without numbers |

**Inverted news:** e.g. Unemployment — higher print → USD bearish (rule `higher_is_usd_bearish`).

**Hawkish/dovish tone mode:** FOMC-style qualitative mapping via rules.

### 18.5 Outputs

| Output | Description |
|---|---|
| USD bias | Bullish / Bearish / Neutral |
| Pair bias | Bullish / Bearish / Neutral |
| Legacy action | Buy / Sell / Wait |
| **Trade decision** | Avoid / Wait / Aggressive Buy / Conservative Buy / Aggressive Sell / Conservative Sell |
| Confidence / Score | TradeImpact Score™ 0–100 |
| Reliability | Very Low → Very High |
| Risk | Low → Very High + why |
| Expected move | Band label from config |
| Explanation lines | Deterministic + historical |
| Why? factors | Score formula, news, history, correlation, risk, recommendation |

### 18.6 Decision tree gates (summary)

| Gate | Question |
|---|---|
| News | What printed? How important? |
| Surprise | How large vs forecast? |
| History | Do similar releases agree? |
| Correlation | Does asset mapping align? |
| Volatility | How violent is the expected tape? |
| Confidence | What is the TradeImpact Score™? |
| Recommendation | Avoid / Wait / Aggressive / Conservative side |

### 18.7 Determinism requirement

Given the same inputs + same config JSON + same historical snapshot, outputs MUST be identical. AI narrative uses templates; it must not call non-deterministic LLMs for the core decision in MVP (optional LLM polish is P2 and must not change scores).

---

# 19. Historical Intelligence

### 19.1 Purpose

Answer: *What usually happened after similar surprises?*

### 19.2 Data

Per-news historical release files (date, forecast, actual, previous, surprise, asset moves, USD direction label).

### 19.3 Similarity

- Band around current surprise magnitude / sign.
- Return top N matches (default display 10).
- Cohort confidence score 0–100.

### 19.4 Statistics

For each tracked asset (Gold, Silver, EURUSD, GBPUSD, BTC, ETH, NAS100, US30, …):

| Stat | Meaning |
|---|---|
| Up / Down / Flat counts | Directional votes |
| Bullish / Bearish probability | % |
| Average move / average abs move | Magnitude |
| Unit | points / pips / percent |

### 19.5 UI expressions

- “Similar Releases **8 / 10**”
- “Gold moved down **8 out of 10** times”
- “Average Gold Move **34 points**”
- “Average EURUSD Move **26 pips**”

### 19.6 Acceptance

Changing historical JSON changes match counts without code changes.

---

# 20. TradeImpact Score™

### 20.1 Definition

A single **0–100** proprietary score expressing how strong and coherent the current news-trading setup is for the selected asset.

### 20.2 Formula (MVP weights)

| Pillar | Weight | Source |
|---|---|---|
| Historical Match | **30%** | Similarity coverage + win rate + cohort confidence |
| Surprise Strength | **25%** | Strength band → numeric score |
| News Importance | **20%** | News rule importance 0–100 |
| Market Correlation | **15%** | Alignment of selected pair with USD map |
| Volatility | **10%** | Expected volatility band from impact |

```text
Score = 0.30·H + 0.25·S + 0.20·I + 0.15·C + 0.10·V
```

All pillar scores normalized 0–100 before weighting.

### 20.3 Display

```text
TradeImpact Score
94 / 100
```

Also show Reliability separately (not identical to Score).

### 20.4 Interpretation guide (educational)

| Score | Guidance |
|---|---|
| 0–34 | Prefer **Avoid** |
| 35–49 | Prefer **Wait** |
| 50–77 | Conservative side if direction clear |
| 78–100 | Aggressive side only if strength + reliability also high |

Exact thresholds live in decision-tree JSON.

### 20.5 Branding

- Always render as **TradeImpact Score™** in user-facing copy.
- Breakdown available in Why? and Intelligence panel.

---

# 21. Risk Engine

### 21.1 Purpose

Frame downside and process risk *before* the trader sizes a position.

### 21.2 Risk level

| Level | Typical drivers |
|---|---|
| Low | Mild surprise, liquid session, high reliability |
| Medium | Standard high-impact release |
| High | Strong surprise and/or elevated volatility |
| Very High | Extreme surprise, low reliability, estimate-only, thin session |

### 21.3 Outputs

- Level label
- Numeric internal score (0–100)
- **Why** sentence (config templates)
- Feeds playbook risk % recommendation (0.5% / 1% / max 2%)

### 21.4 Prop-firm emphasis

Always show position sizing reminder: risk a fixed equity fraction; size from stop distance, not conviction.

---

# 22. Correlation Engine

### 22.1 Purpose

Encode professional USD transmission into configurable maps so asset bias is never guessed in UI code.

### 22.2 Canonical MVP map (when USD rises)

| Asset | Expected move |
|---|---|
| Gold | ↓ |
| Silver | ↓ |
| BTC | ↓ |
| ETH | ↓ |
| EURUSD | ↓ |
| GBPUSD | ↓ |
| NASDAQ | ↓ |
| US30 | ↓ |
| SPX500 | ↓ |
| USDJPY | ↑ |
| USDCHF | ↑ |
| USDCAD | ↑ |

When USD falls, invert. When USD neutral, flat/neutral.

### 22.3 Requirements

- Entire map in JSON.
- Alignment score contributes to TradeImpact Score™.
- UI may render correlation chips with ↑ / ↓.
- Future: regime overlays (risk-on crypto divergence) as optional modifiers (P2).

---

# 23. AI Analysis

### 23.1 Role of AI in TradeImpact

AI **explains** decisions. Engines **compute** decisions.

MVP AI Analysis = deterministic narrative templates filled with engine outputs (news label, surprise direction, USD effect, historical win rate, confidence language).

### 23.2 Narrative requirements

Must explain **WHY**, not only WHAT:

| Must include | Example |
|---|---|
| What happened vs expectations | “Today's ISM PMI significantly exceeded market expectations.” |
| Macro transmission | “Historically this type of surprise has strengthened USD.” |
| Asset history | “Gold has moved lower in 82% of similar releases.” |
| Confidence posture | “Confidence remains high.” |

### 23.3 Why? button

One tap from result reveals:

1. Score formula with pillar values  
2. News + surprise strength  
3. Historical match summary  
4. Correlation alignment  
5. Risk rationale  
6. Final recommendation leaf  

### 23.4 Future LLM layer (P2)

Optional LLM rewrite of narrative **after** engines run, with constraints:

- Cannot change Score, decision id, or numbers.
- Must cite engine facts.
- Fail closed to templates if LLM unavailable.

---

# 24. Trade Playbook

### 24.1 Purpose

Turn intelligence into an actionable plan.

### 24.2 Trade Setup card

| Field | Example |
|---|---|
| Asset | XAUUSD |
| Bias / Decision | SELL / Conservative Sell |
| Confidence / Score | 91% or 91/100 |
| Risk | Medium |

### 24.3 Trading plan phases

| Phase | Example copy |
|---|---|
| Before News | Avoid entering positions. |
| During Release | Wait for initial spike. |
| After Confirmation | Enter only after confirmation candle. |

### 24.4 Entry strategies

Aggressive · Conservative · Breakout · Pullback — each with short explanation from JSON.

### 24.5 Risk management

Recommended risk options: **0.5%**, **1%**, **Maximum 2%** + sizing reminder.

### 24.6 Take profit

TP1 · TP2 · TP3 · Trail Stop — placeholders in MVP (no broker prices required).

### 24.7 Stop loss guide

Suggested placement concepts (not calculated prices in MVP):

- Above liquidity  
- Above news spike  
- Previous swing  

### 24.8 Fake spike warning

If historical probability mixed / thresholds hit → warning card: wait for confirmation.

### 24.9 Export / Share

PDF · TXT · Copy · Share summary card text.

---

# 25. History Module

### 25.1 Analysis history

- Store last N analyses (MVP: local; V1: cloud per user).
- Fields: event, pair, forecast, previous, actual, outcome, timestamp.
- Reopen restores inputs and recomputes with current engines.
- Clear history action.

### 25.2 Event historical results

- Searchable table for a given event key.
- Used by Historical Intelligence and calendar detail.

### 25.3 Retention

MVP local device; document migration path to synced history on signup.

---

# 26. Watchlist

### 26.1 Purpose

Focus the product on *the trader’s* markets.

### 26.2 Behaviors

| Behavior | Rule |
|---|---|
| Pin / unpin | Persisted |
| Dashboard filter | Only pinned assets drive one-click + desk widgets |
| Defaults | Gold, Silver, BTC, EURUSD |
| Catalog | Gold, Silver, BTC, EURUSD, GBPUSD, NASDAQ (+ expandable) |

### 26.3 One-click analysis

Tapping today’s event shows bias + confidence/score per pinned asset without additional steps.

---

# 27. Notifications

### 27.1 Types (MVP local inbox)

| Type | Trigger |
|---|---|
| Upcoming News | Approaching release (15/5/0 min prefs) |
| Released | Actual available / release time passed |
| Analysis Ready | Intelligence available for focus event |

### 27.2 V1

Web Push / mobile push opt-in; quiet hours; per-type toggles (already in settings model).

### 27.3 Principles

- No spam: idempotent per event+type.
- Deep link into event/analysis.
- Respect OS permission; settings master switch.

---

# 28. Settings

| Setting | MVP |
|---|---|
| Theme | Dark (default) / Light |
| Language | EN (+ stubs) |
| Default Pair | e.g. XAUUSD |
| Default News | e.g. CPI |
| Notification preferences | Master + Upcoming/Released/Analysis Ready |
| Favorites | News, pairs, strategies |

Settings MUST NOT require an account in MVP (local preferences).

---

# 29. Data Flow

```text
[Provider API] → Provider Mapper → EconomicEvent
        ↓
 Calendar Cache (TTL 60s, stale-on-error)
        ↓
 UI Calendar / Event Detail
        ↓ (user selects pair + numbers)
 Decision Engine + Historical DB + Correlation Config
        ↓
 Intelligence Report (Score, Reliability, Decision, Why, Scenarios, Risk)
        ↓
 Playbook Builder (JSON strategies/risk/TP/SL)
        ↓
 Result UI + Export + Journal (optional)
```

### Client vs server

| Concern | MVP |
|---|---|
| Provider secrets | Server only (`/api/economic-calendar/*`) |
| Decision engines | Client-capable (pure functions) for instant UX |
| Historical JSON | Bundled or CDN; later API |
| Preferences / journal | localStorage → later user API |

---

# 30. Database Design

### 30.1 MVP (local-first)

No mandatory cloud DB. Persistence via browser localStorage keys (versioned).

### 30.2 V1 relational model (target)

**users**  
id, email, password_hash, created_at, plan_tier, locale, theme

**user_preferences**  
user_id, default_pair, default_news, notification_json, watchlist_json

**saved_analyses**  
id, user_id, news_id, pair_id, forecast, previous, actual, score, decision_id, payload_json, created_at

**journal_entries**  
id, user_id, pair_id, news_label, entry, sl, tp, result, pnl, notes, created_at

**notifications**  
id, user_id, kind, title, body, event_id, read_at, created_at

**provider_cache** (optional server)  
cache_key, payload_json, expires_at, source

### 30.3 Historical market DB (intelligence)

**economic_releases**  
id, news_id, date, forecast, actual, previous, surprise, direction

**release_asset_moves**  
release_id, asset_key, move, unit

Indexes: `(news_id, date DESC)`, `(news_id, surprise)`.

---

# 31. API Architecture

### 31.1 Public app API (MVP)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/economic-calendar/upcoming` | Upcoming events |
| GET | `/api/economic-calendar/today` | Today |
| GET | `/api/economic-calendar/historical?newsId=` | History |
| GET | `/api/economic-calendar/event?eventId=` | Single event |
| GET | `/api/economic-calendar/latest?newsId=` | Latest result |
| GET | `/api/economic-calendar/search?q=` | Search |

Envelope:

```json
{ "ok": true, "provider": "mock", "fallback": false, "data": [/* EconomicEvent */] }
```

### 31.2 Future user API

REST or tRPC: auth, preferences sync, analyses, journal, push tokens.

### 31.3 Principles

- Versioned contracts
- Idempotent GETs
- Server-side provider keys
- Uniform error shape `{ ok: false, error: "…" }`

---

# 32. Provider Architecture

### 32.1 Goal

**Never depend on one API.**

### 32.2 Interface (logical)

`IEconomicCalendarProvider`

- getUpcomingEvents()
- getTodayEvents()
- getHistoricalEvents(newsId)
- getEvent(eventId)
- getLatestResult(newsId)
- searchEvents(query)

### 32.3 Implementations

| Provider | Role |
|---|---|
| MockProvider | Default + fallback |
| TradingEconomicsProvider | Live calendar |
| Future | FMP, custom DB, etc. |

### 32.4 Factory

`ECONOMIC_PROVIDER` env → factory → provider; missing keys / errors → MockProvider.

### 32.5 Mapping

Provider JSON → **standard EconomicEvent** via mappers. React never sees vendor shapes.

### 32.6 Resilience

- Retry max 3  
- Cache TTL 60s  
- Stale cache on failure  
- Automatic mock fallback  
- Dev-only structured logs (duration, provider, retries)

---

# 33. Folder Structure

Logical target architecture (application code):

```text
src/
  app/                          # routes (workspace, calendar, analyze, terminal, api)
  components/news-bias/         # UI (presentational)
  lib/news-bias/
    engine/                     # pure intelligence
      intelligenceEngine.ts
      intelligence/
        scoring/
        history/
        correlation/
        risk/
        scenario/
      decisionEngine.ts
      surpriseEngine.ts
      ...
      data/*.json
    modules/                    # feature facades
      dashboard/ watchlist/ journal/ settings/
      notifications/ playbook/ strategy/ risk/ ...
    providers/                  # calendar providers + mappers
    interfaces/
    services/
    hooks/
    types/
    utils/
docs/
  PRD.md
  API.md
  ENGINE.md
```

Principles: engines pure; UI dumb; JSON for business rules; SOLID boundaries.

---

# 34. Tech Stack

| Layer | Choice (recommended) | Notes |
|---|---|---|
| Framework | Next.js (App Router) | SSR/CSR hybrid |
| Language | TypeScript (strict) | No implicit any |
| UI | React 19 | Existing design system tokens |
| Styling | Tailwind + CSS variables | `nb-*` tokens |
| Data fetching | SWR | 60s refresh calendar |
| Validation | Zod (V1 APIs) | Runtime contracts |
| Auth (V1) | Auth.js / Clerk / Supabase Auth | TBD |
| DB (V1) | Postgres | User data |
| Hosting | Vercel / Fly / AWS | CDN edge |
| Observability | OpenTelemetry + logs | Sampled prod |
| Testing | Vitest + Playwright | Unit + e2e |
| Package manager | npm / pnpm | Lockfile required |

---

# 35. Security

| Area | Requirement |
|---|---|
| Transport | TLS everywhere |
| Secrets | Server env only; never `NEXT_PUBLIC` for vendor keys |
| XSS | React escaping; sanitize any markdown |
| CSP | Strict default-src; tighten over time |
| Auth (V1) | Secure cookies, CSRF, rate limit login |
| Abuse | Rate limit calendar API per IP |
| Dependencies | Automated CVE scanning in CI |
| Privacy | Minimal PII; local-first MVP |
| Disclaimer | Persistent educational disclaimer |

---

# 36. Performance

| Target | Value |
|---|---|
| LCP (workspace) | ≤ 2.5s p75 mobile |
| Decision compute | ≤ 50ms warm |
| Bundle discipline | Route-level code splitting; lazy details/playbook |
| Images | None required for core loop |
| Re-renders | Prefer pure engines outside React; memo result cards |

Performance budget reviewed each release.

---

# 37. Scalability

| Stage | Strategy |
|---|---|
| MVP | Static/SSR web + serverless API gateway to providers |
| Growth | CDN cache for historical JSON; Redis for provider cache |
| Scale | Horizontal web; Postgres read replicas; queue for push |
| Data | Partition release history by news_id |

Stateless app servers; engines are CPU-light.

---

# 38. Accessibility

- WCAG 2.2 AA for core flows  
- Keyboard: full analysis path, calendar list, Why? toggle  
- Focus rings on all interactive elements  
- `aria-live` for result updates  
- Color not sole indicator (icons + labels for bullish/bearish)  
- Respect `prefers-reduced-motion`  
- Minimum tap target 44×44 CSS px  

---

# 39. Responsive Design

| Breakpoint | Behavior |
|---|---|
| Mobile first | Single column; FAB quick actions; sticky countdown optional |
| Tablet | 2-column bias/playbook where helpful |
| Desktop | max-width readable terminal (~3xl), denser grids |

UI philosophy: **Minimal · Professional · Trading Terminal · Dark Theme · Mobile First · Fast.**

---

# 40. Error Handling

| Layer | Behavior |
|---|---|
| Provider errors | Retry → stale cache → mock fallback → user-safe message |
| Decision input incomplete | Prompt for news + pair + outcome/numbers |
| Partial history | Score uses lower historical pillar; narrative says limited sample |
| Export failure | Non-blocking toast; offer Copy fallback |
| Unhandled | Error boundary with Retry + link home |

User-facing copy never exposes stack traces or vendor errors.

---

# 41. Offline Mode

| Data | Offline behavior |
|---|---|
| Calendar | Show cached events; banner “offline” |
| Engines | Work if bundles + history JSON cached |
| Live Actual | Unavailable; Manual mode remains |
| Sync prefs (V1) | Queue locally; flush when online |

---

# 42. Caching Strategy

| Cache | TTL | Notes |
|---|---|---|
| Provider response | 60s | Stale-while-revalidate / stale-on-error |
| SWR client | 60s | Focus revalidate |
| Historical JSON | App versioned | Bundle or long CDN cache |
| Preferences | Immediate local write | |

Cache keys include provider + action + params.

---

# 43. Analytics

Track product analytics (privacy-aware):

| Event | Properties |
|---|---|
| `analysis_completed` | news_id, pair_id, score, decision_id |
| `why_opened` | score, decision_id |
| `playbook_exported` | format |
| `calendar_event_opened` | event_id |
| `watchlist_toggled` | asset_id |
| `journal_saved` | result |
| `alert_opened` | kind |

No raw API keys; scrub PII; aggregate dashboards for activation & north-star.

---

# 44. Logging

| Log | Env |
|---|---|
| Provider duration, name, retry count, errors | Dev always; Prod sampled |
| API 5xx | Prod always |
| Auth failures (V1) | Prod |

PII-free structured JSON logs.

---

# 45. Testing Strategy

| Layer | Scope |
|---|---|
| Unit | Surprise, decision, score, correlation, risk, scenario, tree, mappers, factory |
| Integration | `buildAnalysis` → intelligence view; API route fallback |
| Contract | Provider mapper fixtures |
| E2E | Calendar → analyze → Why? → export |
| Visual | Critical result card states (optional) |
| Load | Calendar API cache hit/miss |

CI gate: unit + typecheck + lint must pass.

---

# 46. Deployment Strategy

| Item | Approach |
|---|---|
| Environments | Preview / Staging / Production |
| CI | Lint, typecheck, unit tests, build |
| CD | Preview deploys per PR; prod on main |
| Config | Env vars for provider + feature flags |
| Migrations | Forward-only SQL when DB introduced |
| Rollback | Instant previous deploy |
| Feature flags | Score v2, LLM narrative, push |

---

# 47. Roadmap

### Phase 0 — Foundation (complete / in progress)

Calendar · Analysis · Engines · Workspace · Playbook · TIE · Provider architecture

### Phase 1 — MVP Launch

- Polish UX copy & empty states  
- Onboarding (first CPI→Gold path)  
- Legal pages + disclaimer  
- Basic analytics  
- Soft launch to waitlist  

### Phase 2 — V1 Growth

- Accounts + sync  
- Push notifications  
- Billing  
- Expanded news coverage (EUR/GBP)  
- Journal insights  

### Phase 3 — Moat

- Larger proprietary history DB  
- Regime-aware correlation  
- Optional LLM narrative polish  
- B2B embed / prop firm seats  
- Mobile native shell  

```text
Q1: MVP public beta
Q2: Paid plans + accounts
Q3: Multi-region news + push
Q4: B2B / prop pilots
```

---

# 48. Monetization

### 48.1 Model

**SaaS subscription** for decision intelligence (not for raw calendar data alone).

### 48.2 Value metrics

- Analyses per month  
- Advanced intelligence (scenarios, exports, journal sync)  
- Alerts  
- Multi-device sync  

### 48.3 Principles

- Free tier must demonstrate Score + Why? (aha moment).  
- Paid tier removes friction (history sync, alerts, exports, more events).  
- Never paywall safety (risk warnings remain free).

---

# 49. Pricing

*Indicative; validate with waitlist interviews.*

| Plan | Price (USD) | Includes |
|---|---|---|
| **Free** | $0 | Calendar, 10 analyses/day, Score, Why?, basic playbook, local journal |
| **Pro** | $19–29 / month | Unlimited analyses, exports, synced history/journal, push alerts, full scenarios |
| **Prop / Team** | $49–99 / seat / month | Shared templates, admin, priority data, SSO (later) |

Annual discount 20%.  
Founding member lifetime deal optional for first 500 users.

---

# 50. Future Features

| Feature | Description |
|---|---|
| LLM narrative co-pilot | Constrained rewrite of Why? |
| Live price overlays | TP/SL numeric suggestions |
| Broker webhooks | Post-trade journal autofill |
| Community anonymized stats | “Traders following Conservative Sell hit X% process adherence” |
| Options / futures calendars | Beyond FX/metals/crypto/indices |
| Custom rule studio | Power users edit personal news rules |
| Native iOS/Android | Wrap app shell |
| Institutional API | Score as a service |
| Backtesting lab | Replay historical prints through TIE |
| Education mode | Guided modules for beginners |

---

# Design Philosophy (cross-cutting)

| Principle | Application |
|---|---|
| Minimal | One job per section; no widget sprawl |
| Professional | Institutional tone; no hype signals |
| Trading Terminal | Dense, status-rich, keyboard friendly |
| Dark Theme | Default; light available |
| Mobile First | Core loop perfect on phone |
| Fast | Instant engines; cached calendar |
| Explainable | Why? always available |
| Honest | Educational disclaimer; no guaranteed profits |

---

# Appendix A — Decision Engine detailed I/O contract

### A.1 Request

```text
AnalysisRequest {
  newsId, pairId,
  forecast?, previous?, actual?,
  outcome?  // if numbers incomplete
}
```

### A.2 Response (logical)

```text
Analysis {
  surprise, usdDirection, pairDirection,
  intelligence {
    scoreTotal, scoreBreakdown,
    reliabilityLabel,
    decisionLabel, decisionId,
    narrative[], why[], decisionTree[],
    historicalSimilar, averageMoves[],
    scenarios[], riskLabel, riskWhy,
    correlation[], volatilityLabel
  },
  playbook, riskWarning, summary
}
```

### A.3 Score weights table (normative MVP)

See Section 20 — changes require version bump `TradeImpact Score™ vN` in UI changelog.

---

# Appendix B — Glossary

| Term | Meaning |
|---|---|
| Surprise | Actual − Forecast (signed) |
| TIE | TradeImpact Intelligence Engine |
| Playbook | Actionable plan derived from analysis |
| Reliability | Historical accuracy band |
| Correlation map | USD transmission config |
| Provider | External calendar data source |
| Why? | Explainability panel/factors |

---

# Appendix C — Compliance & disclaimer (required copy)

> Educational reference only. Not financial advice. Trading involves substantial risk of loss. Past performance of similar releases does not guarantee future results. TradeImpact provides decision-support tools, not investment recommendations.

Must appear on result surfaces and marketing site footer.

---

# Appendix D — Open questions (non-blocking)

| # | Question | Owner | Default until decided |
|---|---|---|---|
| 1 | Auth vendor | Eng | Local-first MVP |
| 2 | First paid price point | Product | $24/mo Pro |
| 3 | LLM narrative in V1? | Product | No — templates only |
| 4 | Primary launch market | GTM | Global English |

---

# Appendix E — Traceability matrix (sample)

| User story | FR | Engine |
|---|---|---|
| Score for CPI vs Gold | FR-DEC-004 | scoring |
| Why? explanation | FR-DEC-007 | intelligenceEngine |
| Calendar countdown | FR-CAL-002 | calendar module |
| Provider failover | FR-PLT-003 | ProviderFactory |

---

**End of Product Requirements Document — TradeImpact v1.0**

*Know the Impact Before You Trade.*


---

# Appendix F — Expanded User Stories (P0–P2 Backlog)

### F.1 Onboarding & first value

| ID | Story | Priority |
|---|---|---|
| US-ONB-01 | As a new user, I want a 3-step guided path (pick CPI → pick Gold → see Score), so that I reach the aha moment in under 3 minutes | P0 |
| US-ONB-02 | As a new user, I want sample prefilled numbers for a recent CPI, so that I can experience the engine without waiting for a live print | P0 |
| US-ONB-03 | As a new user, I want a persistent disclaimer I can dismiss for the session, so that legal clarity does not block learning | P0 |
| US-ONB-04 | As a returning user, I want my watchlist and theme restored instantly, so that the workspace feels like mine | P0 |

### F.2 Calendar advanced

| ID | Story | Priority |
|---|---|---|
| US-CAL-10 | As a trader, I want to filter high-impact only with one control, so that noise stays low | P0 |
| US-CAL-11 | As a trader, I want country flags / codes, so that I scan faster | P1 |
| US-CAL-12 | As a trader, I want revised values labeled, so that I do not confuse first print vs revision | P1 |
| US-CAL-13 | As a trader, I want week view grouping by day, so that I plan the week | P1 |
| US-CAL-14 | As a trader, I want timezone display in my local TZ with UTC secondary, so that I do not miss releases | P0 |
| US-CAL-15 | As a desk trader, I want to compare two events the same day, so that I avoid overlapping risk | P2 |

### F.3 Intelligence advanced

| ID | Story | Priority |
|---|---|---|
| US-INT-01 | As a pro, I want pillar breakdown of TradeImpact Score™, so that I see whether history or surprise dominates | P0 |
| US-INT-02 | As a prop trader, I want Avoid when risk is Very High even if direction is clear, so that I protect the account | P0 |
| US-INT-03 | As a trader, I want scenario numbers signed in my asset’s unit, so that I can plan TP ranges | P0 |
| US-INT-04 | As a trader, I want correlation chips for my watchlist subset, so that I am not overwhelmed | P1 |
| US-INT-05 | As a trader, I want to pin a Why? screenshot/export, so that I can review after the trade | P1 |

### F.4 Journal & coaching

| ID | Story | Priority |
|---|---|---|
| US-JRN-10 | As a trader, I want to attach an analysis id to a journal entry, so that I compare plan vs execution | P1 |
| US-JRN-11 | As a trader, I want weekly process stats (followed Wait vs entered early), so that I improve discipline | P2 |
| US-JRN-12 | As a prop trader, I want risk% suggested vs actual risk logged, so that I audit rule compliance | P2 |

---

# Appendix G — Detailed Functional Requirements (supplement)

### G.1 Analysis tool

| ID | Requirement | Priority |
|---|---|---|
| FR-AN-001 | User SHALL select news from searchable list with presets | P0 |
| FR-AN-002 | User SHALL select pair from favorites + full list + search | P0 |
| FR-AN-003 | User SHALL tap Beat / Miss / In-line OR enter numeric Actual/Forecast | P0 |
| FR-AN-004 | Result SHALL update immediately when inputs change | P0 |
| FR-AN-005 | Result SHALL show decision label, asset, Score, Reliability, Risk, Impact | P0 |
| FR-AN-006 | Result SHALL provide Why? disclosure without leaving the page | P0 |
| FR-AN-007 | More details SHALL include Surprise, Intelligence, Playbook, History, Assets, Export | P0 |
| FR-AN-008 | System SHALL autosave completed analyses to history after a short debounce | P0 |

### G.2 Score governance

| ID | Requirement | Priority |
|---|---|---|
| FR-SCR-001 | Weights SHALL be loaded from configuration, not UI code | P0 |
| FR-SCR-002 | Any weight change SHALL bump a visible score version in changelog | P1 |
| FR-SCR-003 | Score SHALL clamp to integer 0–100 | P0 |
| FR-SCR-004 | Pillar contributions SHALL be auditable in Why? | P0 |

### G.3 Accessibility specifics

| ID | Requirement | Priority |
|---|---|---|
| FR-A11Y-001 | Countdown SHALL announce updates politely without flooding screen readers | P1 |
| FR-A11Y-002 | Decision color SHALL be accompanied by text label | P0 |
| FR-A11Y-003 | Charts (if any) SHALL have text alternative summaries | P1 |

---

# Appendix H — Database DDL (target V1)

```sql
-- users
CREATE TABLE users (
  id              UUID PRIMARY KEY,
  email           CITEXT UNIQUE NOT NULL,
  password_hash   TEXT,
  name            TEXT,
  plan_tier       TEXT NOT NULL DEFAULT 'free',
  locale          TEXT NOT NULL DEFAULT 'en',
  theme           TEXT NOT NULL DEFAULT 'dark',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_preferences (
  user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  default_pair    TEXT NOT NULL DEFAULT 'XAUUSD',
  default_news    TEXT NOT NULL DEFAULT 'cpi',
  watchlist       JSONB NOT NULL DEFAULT '["gold","silver","btc","eurusd"]',
  favorite_news   JSONB NOT NULL DEFAULT '[]',
  favorite_strategies JSONB NOT NULL DEFAULT '[]',
  notifications   JSONB NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE saved_analyses (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  news_id         TEXT NOT NULL,
  pair_id         TEXT NOT NULL,
  forecast        DOUBLE PRECISION,
  previous        DOUBLE PRECISION,
  actual          DOUBLE PRECISION,
  outcome         TEXT,
  score           INT NOT NULL,
  decision_id     TEXT NOT NULL,
  payload         JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX saved_analyses_user_created_idx ON saved_analyses(user_id, created_at DESC);

CREATE TABLE journal_entries (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_id     UUID REFERENCES saved_analyses(id) ON DELETE SET NULL,
  pair_id         TEXT NOT NULL,
  news_label      TEXT,
  entry_price     DOUBLE PRECISION,
  stop_loss       DOUBLE PRECISION,
  take_profit     DOUBLE PRECISION,
  result          TEXT NOT NULL DEFAULT 'open',
  profit_loss     DOUBLE PRECISION,
  notes           TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE economic_releases (
  id              UUID PRIMARY KEY,
  news_id         TEXT NOT NULL,
  release_date    DATE NOT NULL,
  forecast        DOUBLE PRECISION,
  actual          DOUBLE PRECISION,
  previous        DOUBLE PRECISION,
  surprise        DOUBLE PRECISION,
  direction       TEXT NOT NULL,
  UNIQUE (news_id, release_date)
);

CREATE TABLE release_asset_moves (
  release_id      UUID NOT NULL REFERENCES economic_releases(id) ON DELETE CASCADE,
  asset_key       TEXT NOT NULL,
  move            DOUBLE PRECISION NOT NULL,
  unit            TEXT NOT NULL,
  PRIMARY KEY (release_id, asset_key)
);
```

---

# Appendix I — API Schemas (MVP Calendar)

### I.1 EconomicEvent

| Field | Type | Required |
|---|---|---|
| id | string | yes |
| country | string | yes |
| currency | string | yes |
| title | string | yes |
| impact | high\|medium\|low | yes |
| forecast | number\|null | yes |
| previous | number\|null | yes |
| actual | number\|null | yes |
| date | YYYY-MM-DD | yes |
| time | HH:mm | yes |
| datetime | ISO-8601 | yes |
| unit | string\|null | yes |
| revised | number\|null | yes |
| source | string | yes |
| newsId | string\|null | no |

### I.2 Error envelope

```json
{ "ok": false, "error": "Live data is temporarily unavailable." }
```

HTTP 503 when no cache and no mock recovery (should be rare).

### I.3 Rate limiting (V1)

| Surface | Limit |
|---|---|
| Anonymous calendar GET | 60 req / min / IP |
| Authenticated | 120 req / min / user |
| Export endpoints | 20 req / min / user |

---

# Appendix J — Event catalog (MVP news coverage)

| newsId | Label | Interpretation |
|---|---|---|
| cpi | CPI | higher → USD bullish |
| core-cpi | Core CPI | higher → USD bullish |
| ppi | PPI | higher → USD bullish |
| core-ppi | Core PPI | higher → USD bullish |
| nfp | Nonfarm Payrolls | higher → USD bullish |
| unemployment-rate | Unemployment Rate | higher → USD bearish |
| interest-rate-decision | Interest Rate Decision | hawkish/dovish mode |
| fomc-statement | FOMC Statement | hawkish/dovish mode |
| ism-manufacturing-pmi | ISM Manufacturing PMI | higher → USD bullish |
| ism-services-pmi | ISM Services PMI | higher → USD bullish |
| gdp | GDP | higher → USD bullish |
| retail-sales | Retail Sales | higher → USD bullish |
| core-pce | Core PCE | higher → USD bullish |

Expansion list maintained in `newsRules.json`.

---

# Appendix K — Asset catalog (MVP)

| Asset id | Label | Pair id | Category | USD relation |
|---|---|---|---|---|
| gold | Gold | XAUUSD | metal | inverse |
| silver | Silver | XAGUSD | metal | inverse |
| btc | BTC | BTCUSD | crypto | inverse (risk) |
| eth | ETH | ETHUSD | crypto | inverse (risk) |
| eurusd | EURUSD | EURUSD | forex | inverse |
| gbpusd | GBPUSD | GBPUSD | forex | inverse |
| usdjpy | USDJPY | USDJPY | forex | direct |
| usdchf | USDCHF | USDCHF | forex | direct |
| usdcad | USDCAD | USDCAD | forex | direct |
| nasdaq | NASDAQ | NAS100 | index | inverse |
| us30 | US30 | US30 | index | inverse |
| spx | SPX500 | SPX500 | index | inverse |

---

# Appendix L — End-to-end scenarios (QA scripts)

### L.1 Hot CPI → Gold

1. Open Workspace  
2. Confirm Gold pinned  
3. Open CPI event with Actual > Forecast  
4. Expect USD bullish, Gold bearish  
5. Expect TradeImpact Score elevated when history agrees  
6. Expect decision Conservative or Aggressive Sell (not Buy)  
7. Open Why? — correlation and history mention Gold down  
8. Export playbook TXT succeeds  

### L.2 Soft unemployment → Gold

1. Unemployment Actual > Forecast (bad for labor / USD bearish per rules)  
2. Expect Gold bullish bias  
3. Risk may still be elevated if volatility high  
4. Beginner narrative explains inversion  

### L.3 Provider outage

1. Force TradingEconomics 500  
2. API responds ok with mock/cache fallback  
3. UI shows data; no crash  
4. Optional banner for degraded mode  

### L.4 Offline

1. Load calendar once online  
2. Go offline  
3. Calendar still lists cached events  
4. Analysis still runs for bundled history  

---

# Appendix M — Content & UX writing guidelines

| Do | Don't |
|---|---|
| Use precise verbs: Wait, Avoid, Sell | Promise profits |
| Show units (pips/points/%) | Invent prices without data |
| Prefer short sentences in narratives | Dump jargon without definition |
| Keep disclaimer visible | Hide risk warnings behind paywall |
| Label estimates clearly | Present estimates as measured surprise |

Tone: calm, institutional, direct — “Bloomberg clarity, not crypto Twitter hype.”

---

# Appendix N — Competitive positioning matrix

| Capability | Forex Factory | Investing.com | TradingView | ChatGPT | TradeImpact |
|---|---|---|---|---|---|
| Economic calendar | Strong | Strong | Medium | Weak | Strong |
| Surprise math | Weak | Medium | Weak | Ad hoc | Strong |
| Asset correlation map | Weak | Weak | Weak | Ad hoc | **Strong** |
| Historical similar prints | Weak | Medium | Weak | Ad hoc | **Strong** |
| Single Score metric | No | No | No | No | **TradeImpact Score™** |
| Explainable Why? | No | No | No | Unstable | **Strong** |
| Trade playbook | No | No | No | Ad hoc | **Strong** |
| Charts | No | Medium | **Best** | No | Not a goal |
| Execution | No | No | Broker hooks | No | Not a goal |

---

# Appendix O — Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Provider dependency | High | Factory + mock + multi-provider |
| Users treat outputs as financial advice | High | Disclaimer, Avoid/Wait emphasis, education |
| Score mistrust after wrong-direction day | High | Why? transparency, history sample sizes, estimate labels |
| LLM hallucination (if enabled) | High | Templates-first; LLM cannot change numbers |
| Low willingness to pay for “calendar” | Medium | Market Score/Playbook, not calendar |
| Prop firm branding sensitivity | Medium | Risk-first messaging |

---

# Appendix P — Launch checklist

- [ ] PRD approved by Product + Eng + Design  
- [ ] ENGINE.md + API.md aligned with PRD  
- [ ] Legal disclaimer reviewed  
- [ ] Analytics events instrumented  
- [ ] Provider keys in secure env  
- [ ] E2E scripts L.1–L.4 green  
- [ ] Status page / incident channel  
- [ ] Waitlist → invite flow  
- [ ] Pricing page draft  
- [ ] Support email / docs FAQ (10 questions)

---

# Appendix Q — FAQ (customer-facing draft)

1. **Is TradeImpact financial advice?** No. Educational decision support only.  
2. **Does it replace TradingView?** No. Use TradeImpact for the decision, TradingView for charts/execution.  
3. **What is TradeImpact Score™?** A 0–100 blend of history, surprise, importance, correlation, and volatility.  
4. **Why did I get Avoid?** Score/risk gates failed — open Why? for factors.  
5. **Can I use it on mobile?** Yes — mobile-first.  
6. **Where does calendar data come from?** Pluggable providers; automatic fallback if a vendor fails.  
7. **Do you execute trades?** No.  
8. **Is history live-updated?** MVP ships curated historical datasets; expanding continuously.  
9. **Will there be a free plan?** Yes — enough to experience Score + Why?.  
10. **Can prop firms get seats?** Planned on Team plan.

---

# Appendix R — Metrics dictionary

| Metric | SQL / event definition (logical) |
|---|---|
| Activation | User completed `analysis_completed` within 24h of first visit |
| WAT | Distinct users with `analysis_completed` or `calendar_event_opened` in last 7 days |
| Decision Session | Session with Score view within ±2h of a high-impact release timestamp |
| Why rate | `why_opened` / result views |
| Conversion | free→paid in 30/90 day cohorts |

---

# Appendix S — Permissions & roles (V1)

| Role | Capabilities |
|---|---|
| Anonymous / Local | Full MVP engines, local storage only |
| Free user | Sync limited history |
| Pro user | Unlimited sync, exports, push |
| Team admin | Manage seats, shared templates |
| Internal admin | Provider diagnostics, feature flags |

---

# Appendix T — Versioning policy

| Artifact | Policy |
|---|---|
| App semver | Marketing versions (V6 calendar … V13 TIE) communicated in product |
| Score weights | `scoreWeights.json` + changelog entry |
| Provider contract | Additive fields OK; breaking changes require `/v2` |
| PRD | This document; bump 1.x for material scope changes |

---

**End of Part I.** Continued in Part II — Extended Specifications below.



---

# PART II — Extended Specifications
## Development & Design Deep Dive

This Part expands every critical module so that product, design, engineering, QA, and data teams can implement without ambiguity. It is normative: where Part I states intent, Part II states acceptance criteria, edge cases, algorithms, and UI composition rules.

---

# Appendix U — Complete User Story Backlog (MVP → V1)

Stories use format **TI-{Epic}-{NN}**. Priority: P0 must ship MVP; P1 = V1; P2 = later.

### Epic A — Onboarding & Trust

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-A-01 | New trader | to see a clear product promise on first open | I understand TradeImpact is decision support, not a broker | P0 | Landing/workspace hero shows tagline + disclaimer; no execution CTAs |
| TI-A-02 | New trader | a 60-second guided tour | I know where Calendar, Score, Why?, Playbook live | P0 | Tour 4 steps; skippable; persisted `tour_done` |
| TI-A-03 | Beginner | plain-language definitions for Forecast/Previous/Actual/Surprise | I am not blocked by jargon | P0 | Tooltips on all four fields; glossary link |
| TI-A-04 | Any user | a persistent risk disclaimer | I never confuse output with advice | P0 | Footer + first-analysis modal; cannot dismiss permanently without checkbox |
| TI-A-05 | Returning user | resume last watchlist and last event | I save time before a release | P1 | Last event id + watchlist restored from storage |

### Epic B — Economic Calendar

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-B-01 | Forex trader | a filterable calendar of high-impact events | I focus on tradable releases | P0 | Filter by impact, country, asset class, date range |
| TI-B-02 | Any trader | countdown to next high-impact event | I prepare timing | P0 | Live countdown; updates every 1s; timezone aware |
| TI-B-03 | Any trader | Forecast / Previous / Actual columns | I can compute surprise mentally | P0 | Columns always visible on desktop; stacked on mobile |
| TI-B-04 | Any trader | Actual updates in near-real-time after print | I react quickly | P0 | Poll ≤15s during T-5→T+15; badge “Just updated” |
| TI-B-05 | Gold trader | filter events that historically move XAUUSD | I ignore noise | P1 | “Relevant to watchlist” toggle |
| TI-B-06 | Prop trader | see only High impact by default | I avoid low-signal clutter | P0 | Default impact = High; persisted preference |
| TI-B-07 | Any trader | open event detail from calendar row | I start Decision Engine | P0 | Row click → detail with Score pipeline |
| TI-B-08 | Any trader | historical results for the same event series | I judge reliability | P0 | Last N prints table with surprise + asset outcomes |
| TI-B-09 | Any trader | timezone selection | my session matches my desk | P0 | UTC / local / custom; stored |
| TI-B-10 | Any trader | search events by name | I find CPI/NFP fast | P0 | Debounced search ≥2 chars |
| TI-B-11 | Any trader | empty/error/loading states | I trust the system under failure | P0 | Skeleton, retry CTA, mock fallback banner |
| TI-B-12 | Power user | keyboard navigation of calendar rows | I move without mouse | P1 | ↑↓ Enter; ARIA grid |

### Epic C — Decision Engine & Score

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-C-01 | Any trader | a Bullish / Bearish / Neutral bias for a selected asset | I know direction | P0 | Exactly one of three + optional Avoid/Wait action layer |
| TI-C-02 | Any trader | TradeImpact Score™ 0–100 | I rank opportunity quality | P0 | Integer score; formula documented; weights visible in Why? |
| TI-C-03 | Any trader | Confidence / Reliability band | I size risk appropriately | P0 | Low / Medium / High mapped from score + history n |
| TI-C-04 | Any trader | Why? explanation of every factor | I understand reasoning | P0 | Factor list with contribution ± and plain text |
| TI-C-05 | Intermediate | surprise magnitude vs forecast | I know if print is meaningful | P0 | Surprise % and z-score when σ available |
| TI-C-06 | Pro | decision flips when Actual arrives | I update bias post-print | P0 | Recompute on Actual change; animate delta |
| TI-C-07 | Beginner | Avoid / Wait when risk is high | I do not force a trade | P0 | Gates documented in §18 / Risk Engine |
| TI-C-08 | Any trader | multi-asset matrix for one news event | I pick best instrument | P1 | Table: asset × bias × score × risk |
| TI-C-09 | Any trader | deterministic results for same inputs | I can audit | P0 | Same inputs → same score/decision (AI narrative may vary stylistically but not contradict) |
| TI-C-10 | QA | fixture-based golden tests | regressions are caught | P0 | ≥20 golden scenarios in CI |

### Epic D — Historical Intelligence

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-D-01 | Any trader | N similar historical prints | I see pattern frequency | P0 | Similarity rules documented; show n and win-rate |
| TI-D-02 | Gold trader | average move of XAU after similar CPI | I set expectations | P0 | Avg / median / p25–p75 range |
| TI-D-03 | Pro | filter history by surprise bucket | I compare apples-to-apples | P1 | Buckets: miss / inline / beat by thresholds |
| TI-D-04 | Beginner | plain summary “Gold fell 8 of 10 times” | I grasp odds | P0 | Sentence template; no jargon |
| TI-D-05 | Any trader | link from history row to that past event | I dig deeper | P2 | Deep link if archived |

### Epic E — Correlation & Risk

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-E-01 | Multi-asset trader | correlated assets list for USD news | I see cross-market impact | P0 | At least FX majors, XAU, XAG, US100, BTC tiers |
| TI-E-02 | Any trader | risk level Low/Med/High/Extreme | I know when to stand down | P0 | Driven by volatility + event importance + session |
| TI-E-03 | Prop trader | suggested risk % of account | I stay within firm rules | P0 | Caps by plan/persona; never exceeds configured max |
| TI-E-04 | Any trader | fake-spike warning when applicable | I avoid stop hunts | P0 | Shown for High impact ≤ T+5 min when configured |
| TI-E-05 | Crypto trader | session/liquidity caveat for off-hours crypto | I adjust expectations | P1 | Banner when liquidity flag low |

### Epic F — AI Analysis & Playbook

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-F-01 | Any trader | AI narrative that explains WHY | I learn the logic | P0 | Must include surprise, history, correlation, risk; must not invent numbers contradicting engines |
| TI-F-02 | Any trader | structured Trade Playbook | I have a plan before/during/after | P0 | Sections: Setup, Before, During, After, Entry, TP/SL, Invalidation |
| TI-F-03 | Intermediate | conservative vs aggressive entry modes | I match style | P0 | Two strategies minimum when decision ≠ Avoid |
| TI-F-04 | Any trader | export playbook PDF/TXT/Copy | I keep records | P1 | Export includes disclaimer + timestamp + event id |
| TI-F-05 | Beginner | short AI mode (≤120 words) | I am not overwhelmed | P1 | Setting: short / standard / detailed |
| TI-F-06 | Compliance-minded user | AI refuses to promise profits | I stay safe | P0 | Forbidden phrases list enforced in post-processor |

### Epic G — Watchlist, Alerts, Journal, History

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-G-01 | Any trader | pin assets to watchlist | Score matrix focuses on them | P0 | Add/remove; persist; max Free=5 / Pro=50 |
| TI-G-02 | Any trader | alert T-30 / T-5 / Actual print | I never miss setup | P0 | In-app; Pro: push/email |
| TI-G-03 | Journaling trader | log trade outcome vs prediction | I improve over time | P1 | Link analysis id; R multiple; notes |
| TI-G-04 | Any trader | history of past analyses | I review decisions | P0 | List + filter by date/asset/event |
| TI-G-05 | Pro | search journal | I find lessons | P1 | Full-text on notes |

### Epic H — Settings, Account, Billing

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-H-01 | Any trader | dark theme default | eyes comfortable | P0 | Dark default; light optional V1 |
| TI-H-02 | Any trader | notification preferences | I control noise | P0 | Per channel toggles |
| TI-H-03 | Paid user | manage subscription | I upgrade/downgrade | P1 | Stripe portal |
| TI-H-04 | Team admin | invite seats | prop desk can share | P2 | Email invite + role |

### Epic I — Platform Quality

| ID | As a… | I want… | So that… | Priority | Acceptance criteria |
|---|---|---|---|---|---|
| TI-I-01 | Mobile trader | usable one-thumb flows | I trade on phone | P0 | Calendar → Detail → Why? ≤3 taps |
| TI-I-02 | Any trader | sub-2s perceived analysis | I stay in flow | P0 | Cached history; engines <100ms CPU |
| TI-I-03 | Any trader | graceful provider outage | I still get decisions on mock/cached | P0 | Banner + fallback; no blank screen |
| TI-I-04 | Screen-reader user | accessible Score and Why? | I can use product | P0 | WCAG 2.1 AA for critical paths |

---

# Appendix V — Detailed User Journeys (Step Scripts)

## Journey V1 — Pre-CPI Gold Setup (Primary Happy Path)

**Persona:** Maya (Intermediate Gold trader)  
**Context:** Tuesday, CPI in 25 minutes. Maya opens TradeImpact on phone.

| Step | Screen | User action | System response | Data |
|---|---|---|---|---|
| 1 | Dashboard | Opens app | Shows next High event: US CPI YoY, countdown 00:24:12; watchlist XAU, EURUSD | Calendar cache |
| 2 | Dashboard | Taps CPI card | Event Detail opens with Forecast/Previous; Actual = — | Event entity |
| 3 | Detail | Taps “Analyze impact on Gold” | Decision Engine runs pre-release mode (uses forecast scenario + history) | Engines |
| 4 | Result | Views Score 78, Wait, Reliability Medium | Why? collapsed preview 2 lines | Score |
| 5 | Result | Expands Why? | Factors: History + Importance high; Surprise pending; Correlation Gold↔USD inverse | Narrative |
| 6 | Playbook | Opens Playbook | Before: reduce size; During: ignore first 60s; After: confirm direction | Playbook JSON |
| 7 | Alerts | Enables T-5 + Actual alerts | Confirmation toast | Notifications |
| 8 | Journal | Pins checklist “No trade until confirmation” | Saved locally | Journal |
| 9 | (T+0) | Actual prints hotter than forecast | Push/in-app; Score recomputes to 91 Bearish Gold Conservative Sell | Actual ingest |
| 10 | Result | Follows conservative entry notes | Does not auto-trade | — |

**Exit criteria:** Maya can explain in one sentence why Gold is favored short and what would invalidate.

## Journey V2 — Prop Firm NFP Avoid Path

**Persona:** Jordan (Prop firm, rules-heavy)

| Step | Action | Outcome |
|---|---|---|
| 1 | Filters High impact US only | NFP visible |
| 2 | Analyzes EURUSD | Risk Engine = Extreme; Decision = Avoid |
| 3 | Why? shows volatility + prop risk cap | Suggested risk 0%; playbook “flat through release” |
| 4 | Journals “sat out” | Counts as disciplined win in journaling metrics |

## Journey V3 — Beginner Education Path

**Persona:** Alex (Beginner)

| Step | Action | Outcome |
|---|---|---|
| 1 | Opens tour | Learns Score ≠ certainty |
| 2 | Taps glossary on Surprise | Definition + example |
| 3 | Runs analysis | Short AI mode |
| 4 | Sees Neutral + Wait | No pressure to trade |
| 5 | Saves to History | Review later |

## Journey V4 — Multi-Asset Matrix (Pro)

**Persona:** Sam (Pro multi-asset)

| Step | Action | Outcome |
|---|---|---|
| 1 | Selects FOMC | Event detail |
| 2 | Opens Impact Matrix | Rows: DXY, EURUSD, XAU, US100, BTC |
| 3 | Sorts by Score | XAU 88, EURUSD 84, BTC 61 |
| 4 | Opens XAU playbook + sets alerts | Done in <90 seconds |

## Journey V5 — Provider Failure Resilience

| Step | Failure | UX |
|---|---|---|
| 1 | Primary calendar API 503 | Retry ×3 with backoff |
| 2 | Still failing | Switch Mock/cache; amber banner “Live calendar delayed — using cached schedule” |
| 3 | User still analyzes known event | Engines work on cached Forecast/Previous |
| 4 | Provider recovers | Banner clears; silent refresh |

---

# Appendix W — Screen-by-Screen UX Specification

UI philosophy (normative): **Minimal · Professional · Trading Terminal · Dark Theme · Mobile First · Fast.**  
No card clutter in hero. Brand “TradeImpact” is a primary signal on first viewport. One job per section.

## Design tokens (required)

| Token | Role | Guidance |
|---|---|---|
| `--ti-bg-0` | App background | Deep charcoal/navy gradient atmosphere, not flat black only |
| `--ti-bg-1` | Panels | Slightly elevated surface |
| `--ti-text-0` | Primary text | High contrast off-white |
| `--ti-text-1` | Secondary | Muted gray |
| `--ti-bull` | Bullish | Green (accessible contrast) |
| `--ti-bear` | Bearish | Red/orange (not pure neon) |
| `--ti-neutral` | Neutral | Amber/gray |
| `--ti-score` | Score accent | Single brand accent — not purple-default cliché; prefer sharp teal/steel or gold-steel for trading |
| `--ti-font-display` | Brand/headings | Expressive non-default (e.g. distinguished grotesque/serif pair) |
| `--ti-font-mono` | Numbers | Tabular lining figures for prices/scores |
| `--ti-radius` | Radius | Small (4–8px); terminal feel, not soft SaaS pills |
| Motion | Presence | Countdown tick, score count-up, bias color fade — 2–3 intentional motions max per view |

## W1 — Dashboard (first viewport budget)

**One composition.** Contains only:

1. Brand: **TradeImpact**
2. One headline line (e.g. next event context)
3. One supporting sentence (countdown + impact)
4. One CTA group: Analyze / Open calendar
5. Dominant atmosphere (subtle market/news visual plane — full-bleed background, not inset card collage)

**Below fold / secondary:** watchlist strip, notifications bell, market status — not competing with hero.

### Desktop wireframe (text)

```
┌─────────────────────────────────────────────────────────────┐
│ TRADEIMPACT          [Search]        [Alerts] [Settings]   │
│═════════════════════════════════════════════════════════════│
│  NEXT HIGH IMPACT                                           │
│  US CPI YoY · 00:24:12                                      │
│  Know the impact before you trade.                          │
│  [ Analyze Gold ]  [ Open Calendar ]                        │
│·····························································│
│  Watchlist: XAU · EURUSD · US100                            │
│  Market: London open · Volatility: Elevated                 │
└─────────────────────────────────────────────────────────────┘
```

### Mobile wireframe

```
┌──────────────────┐
│ TRADEIMPACT   ☰  │
│ NEXT: US CPI     │
│ 00:24:12         │
│ [Analyze Gold]   │
│ [Calendar]       │
│—— Watchlist ——   │
│ XAU  EUR  US100  │
└──────────────────┘
```

## W2 — Economic Calendar

| Region | Content | Rules |
|---|---|---|
| Filter bar | Impact, country, date, search | Sticky on scroll |
| Table/list | Time, flag, event, forecast, previous, actual, countdown | Actual emphasizes on update |
| Row states | Upcoming / Live / Released | Live row subtle pulse (motion #1) |
| Empty | “No high-impact events in range” | Suggest widen filters |

**Density:** Professional terminal — compact rows, mono numbers, no large marketing cards.

## W3 — Event Detail

Order of sections (fixed):

1. Event identity (name, country, impact, time)
2. Forecast / Previous / Actual / Surprise
3. TradeImpact Score™ + Decision + Reliability
4. Why? (collapsed by default on mobile)
5. Impact matrix (watchlist assets)
6. Historical intelligence summary
7. AI Analysis
8. Trade Playbook
9. Actions: Alert · Journal · Share · Export

## W4 — Result / Decision panel

| Element | Spec |
|---|---|
| Score | Large tabular number 0–100; count-up 400ms |
| Decision | Aggressive/Conservative Buy/Sell · Wait · Avoid |
| Bias chip | Bullish/Bearish/Neutral color |
| Reliability | Low/Med/High |
| Primary CTA | Why? |
| Secondary | Playbook |

**Never** show detached promo badges over the score.

## W5 — Why? drawer/panel

Must list factors as rows:

| Factor | Direction | Weight | Contribution | Human text |
|---|---|---|---|---|

Footer: “Engines are deterministic. AI restates; it does not override.”

## W6 — Playbook

Single-purpose sections with one H2 each. Checklist interactive (local). Export bar at bottom.

## W7 — Watchlist manager

Simple list + add asset search. No card grid of marketing tiles.

## W8 — Journal

Table/list: Date · Event · Asset · Decision · Outcome · Notes · R.

## W9 — Settings

Groups: Profile · Trading defaults (risk %) · Notifications · Appearance · Data/providers (Pro) · Legal.

## W10 — Notifications center

Chronological; types: countdown, actual, score change, system. Mark read / clear.

---

# Appendix X — Decision Engine Specification (Normative Algorithm)

## X.1 Modes

| Mode | When | Actual used? | Surprise |
|---|---|---|---|
| `pre_release` | Before official print | No | Scenario: beat / inline / miss simulations optional |
| `post_release` | After Actual | Yes | (Actual − Forecast) / scale |
| `revision` | Data revised | Yes (revised) | Recompute; flag “Revised” |

## X.2 Inputs (canonical)

```text
EventInput {
  eventId, seriesId, country, title, impact[low|med|high],
  scheduledAt, timezone,
  forecast, previous, actual?, unit, higherIs,
  assetFocus[]  // user watchlist subset
}
HistoryInput {
  samples[] // prior prints with outcomes per asset
  similarityMethod, windowCount
}
CorrelationInput {
  edges[] // asset↔USD or asset↔event factor strengths [-1,1]
}
RiskInput {
  session, expectedVolatility, spreadRiskCapPct, fakeSpikeWindow
}
```

## X.3 Surprise

Let `F` = forecast, `A` = actual, `P` = previous.

1. **Raw surprise** `S_raw = A - F` (if units allow).
2. **Scaled surprise** `S = S_raw / σ` where `σ` is historical stdev of (Actual−Forecast) for series; if `σ` missing, use domain scale table (e.g. CPI 0.1pp).
3. **Sign interpretation** via `higherIs` + country macro map (e.g. higher US CPI → USD bullish bias factor).
4. **Buckets:**  
   - `|S| < 0.5` → Inline  
   - `0.5 ≤ |S| < 1.5` → Moderate  
   - `|S| ≥ 1.5` → Large

Pre-release: Surprise factor weight redistributed proportionally to History + Importance OR run three scenario scores.

## X.4 Directional bias per asset

```text
usd_factor = f(surprise_bucket, series_sensitivity)
asset_bias_score = usd_factor * correlation(asset, USD_event_factor) * history_align
map asset_bias_score → Bullish | Bearish | Neutral
```

Neutral if `|asset_bias_score| < θ_neutral` (default 0.15).

## X.5 TradeImpact Score™

```text
Score = 100 * (
  0.30 * H +   // Historical alignment [0..1]
  0.25 * S +   // Surprise significance [0..1]
  0.20 * I +   // Importance [0..1]
  0.15 * C +   // Correlation clarity [0..1]
  0.10 * V     // Volatility opportunity (non-linear; extreme may reduce actionable score)
)
```

Clamp to [0,100]. Round half-up to integer.

**Volatility note:** V is “actionable volatility,” not raw chaos. If Risk Engine = Extreme, V contribution collapses and Decision gate → Avoid/Wait.

### Weight change policy

- Weights versioned (`scoreWeights.v1`).
- Any change requires changelog + golden test updates + in-app “Score model vX” footnote.

## X.6 Decision tree (action layer)

```text
if risk == Extreme OR score < 40: Avoid
else if mode == pre_release OR reliability == Low: Wait
else if bias == Neutral: Wait
else if score >= 85 AND reliability == High AND risk <= Medium:
    Aggressive {Buy|Sell} per bias
else if score >= 60:
    Conservative {Buy|Sell} per bias
else:
    Wait
```

Buy/Sell maps from Bullish/Bearish relative to **quoted asset** (not USD necessarily). Example: USD bullish + Gold inverse → Sell Gold.

## X.7 Confidence / Reliability

| Condition | Reliability |
|---|---|
| n_history ≥ 8 AND score ≥ 75 AND surprise bucket ≥ Moderate | High |
| n_history ≥ 4 AND score ≥ 55 | Medium |
| else | Low |

## X.8 Worked example — Hot US CPI → Gold

| Input | Value |
|---|---|
| Forecast | 3.2% |
| Actual | 3.5% |
| σ | 0.15pp |
| S | (3.5−3.2)/0.15 = 2.0 → Large |
| USD factor | +1 (hawkish) |
| Corr(XAU, USD_factor) | −0.8 |
| History | 8/10 Gold down on large hot CPI |
| Importance | High = 1.0 |
| Session | London/NY overlap; vol elevated but not extreme |

**Component scores (illustrative):** H=0.90, S=0.95, I=1.0, C=0.85, V=0.70  
**Score** = 100*(0.27+0.2375+0.20+0.1275+0.07) = **90.5 → 91**  
**Bias** Bearish Gold → **Conservative Sell Gold** (if risk Medium) or Aggressive if gates pass.

## X.9 Output contract (API/UI)

```json
{
  "eventId": "us-cpi-yoy-2026-08-06",
  "asset": "XAUUSD",
  "mode": "post_release",
  "bias": "Bearish",
  "decision": "ConservativeSell",
  "score": 91,
  "reliability": "High",
  "confidence": 0.86,
  "factors": [
    {"id":"history","weight":0.30,"value":0.90,"text":"Gold fell in 8 of 10 similar hot CPI prints."},
    {"id":"surprise","weight":0.25,"value":0.95,"text":"Actual 3.5% vs 3.2% forecast — large upside surprise (~2σ)."},
    {"id":"importance","weight":0.20,"value":1.0,"text":"High-impact US inflation release."},
    {"id":"correlation","weight":0.15,"value":0.85,"text":"Gold typically inverse to USD hawkish shocks."},
    {"id":"volatility","weight":0.10,"value":0.70,"text":"Actionable volatility; fake-spike window active 5m."}
  ],
  "risk": {"level":"High","suggestedRiskPct":0.75,"fakeSpikeWarning":true},
  "modelVersion": "scoreWeights.v1"
}
```

---

# Appendix Y — AI Analysis Contract (Explain WHY)

## Y.1 Role

AI is a **narrator and teacher**, not a second decision engine. Numeric bias, score, and decision come from deterministic modules. AI must:

1. Restate the decision accurately.
2. Explain **why** using the factor list.
3. State what would invalidate the view.
4. Remind user of risk and non-advice status.

## Y.2 Required narrative sections

| Section | Must include |
|---|---|
| Verdict | Asset + bias + decision + score |
| Surprise | Actual vs Forecast in plain language |
| History | Win-rate style sentence with n |
| Transmission | How news → USD/factor → asset |
| Risk | Level + fake-spike / size notes |
| Invalidation | What data/price behavior kills setup |
| Disclaimer | Educational only |

## Y.3 Forbidden

- Guaranteed profit language
- “All-in”, “risk-free”, “sure thing”
- Inventing historical counts not in factors
- Overriding Avoid to Buy/Sell
- Broker-specific entry prices unless user-provided

## Y.4 Tone

Professional trading desk. Concise. No emojis. No hype. Mobile-short mode ≤120 words; standard ≤220; detailed ≤400.

## Y.5 Example narrative (standard)

> **Verdict:** Conservative Sell XAUUSD — TradeImpact Score 91/100 (High reliability).  
> **Why:** CPI printed 3.5% vs 3.2% forecast — a large upside surprise. Across 10 similar hot prints, Gold finished lower in 8. The transmission path is straightforward: hotter inflation raises odds of tighter USD policy, and Gold’s inverse correlation to that shock is strong in our model.  
> **Risk:** High event volatility — treat the first minutes as noise; suggested risk ~0.75% of account with confirmation entry.  
> **Invalidation:** A swift reclaim and hold above the pre-release range after the spike window, or a sharp USD reversal on secondary headlines.  
> *Educational decision support only — not financial advice.*

## Y.6 Generation pipeline

1. Build `NarrativeContext` from engine outputs (structured).  
2. Template fill (deterministic) → baseline string.  
3. Optional LLM polish with schema guard.  
4. Validator: numbers in text must match context (±0).  
5. If validation fails → serve template only.

---

# Appendix Z — Trade Playbook Schema & Rules

## Z.1 JSON schema (logical)

```text
Playbook {
  meta: { eventId, asset, decision, score, generatedAt, modelVersion }
  setup: { bias, thesis[], marketContext }
  before: { checklist[], positionGuidance }
  during: { firstSecondsRule, fakeSpikeRule, doList[], dontList[] }
  after: { confirmationRules[], managementRules[] }
  entries: [
    { style: Conservative|Aggressive, trigger, invalidation, notes }
  ]
  risk: { suggestedPct, maxPct, rMultipleTips }
  levels: { stopGuide, tpGuide, method: ATR|Structure|EventRange }
  historyNote: string
  volatilityNote: string
  aiNotes: string
  disclaimer: string
}
```

## Z.2 Business rules

| Rule | Detail |
|---|---|
| Avoid decision | Playbook collapses to “Stay flat” plan; no entry strategies |
| Wait decision | Before/During emphasis; entries marked provisional |
| Prop persona | Max risk capped (e.g. 0.5%) regardless of score |
| Export | Always prepend/append disclaimer |

---

# Appendix AA — Functional Requirements Traceability Matrix

| FR ID | Requirement | Module | Stories | Test |
|---|---|---|---|---|
| FR-CAL-001 | Display calendar with F/P/A | Calendar | TI-B-03 | Unit+E2E |
| FR-CAL-002 | Countdown | Calendar | TI-B-02 | Unit |
| FR-CAL-003 | Impact filter default High | Calendar | TI-B-06 | E2E |
| FR-CAL-004 | Provider fallback | Providers | TI-I-03 | Integration |
| FR-DEC-001 | Emit bias enum | Decision | TI-C-01 | Golden |
| FR-DEC-002 | Emit Score 0–100 | Score | TI-C-02 | Golden |
| FR-DEC-003 | Why factors sum logic | Decision | TI-C-04 | Unit |
| FR-DEC-004 | Avoid gate on Extreme risk | Risk | TI-C-07 | Golden |
| FR-HIS-001 | Similar prints n≥1 display | History Intel | TI-D-01 | Unit |
| FR-COR-001 | Correlation matrix ≥ core assets | Correlation | TI-E-01 | Unit |
| FR-RSK-001 | Risk levels 4-tier | Risk | TI-E-02 | Unit |
| FR-AI-001 | WHY narrative validation | AI | TI-F-01 | Unit |
| FR-PB-001 | Playbook sections complete | Playbook | TI-F-02 | Unit |
| FR-WL-001 | Pin assets persist | Watchlist | TI-G-01 | E2E |
| FR-AL-001 | T-30/T-5/Actual alerts | Notifications | TI-G-02 | Integration |
| FR-JN-001 | Journal CRUD local | Journal | TI-G-03 | E2E |
| FR-HZ-001 | Analysis history list | History | TI-G-04 | E2E |
| FR-SET-001 | Risk % default setting | Settings | TI-H-02 | E2E |
| FR-A11Y-001 | Score announced to AT | A11y | TI-I-04 | Manual+a11y |

---

# Appendix AB — Non-Functional Requirements (Expanded SLOs)

| ID | Category | Target | Measurement |
|---|---|---|---|
| NFR-P-01 | Decision compute | p95 < 100ms server/local engine | APM |
| NFR-P-02 | Calendar API p95 | < 400ms cached; < 1.2s uncached | APM |
| NFR-P-03 | LCP mobile | < 2.5s on mid-tier | Lighthouse CI |
| NFR-P-04 | INP | < 200ms | RUM |
| NFR-A-01 | Availability | 99.9% monthly API | Status |
| NFR-A-02 | Calendar freshness | During release window, Actual visible < 20s after provider | Synthetic |
| NFR-S-01 | Secrets | No keys in client bundle | CI scan |
| NFR-S-02 | Auth | JWT/session httpOnly; CSRF on mutations | Security review |
| NFR-D-01 | Durability | Pro journal sync durable | Backups |
| NFR-C-01 | Privacy | No sale of PII; analytics minimize PII | Policy |
| NFR-I-01 | WCAG | 2.1 AA critical paths | Audit |
| NFR-R-01 | Resilience | Provider fail → cache/mock | Chaos test |

---

# Appendix AC — Data Dictionary (Core Entities)

## AC.1 EconomicEvent

| Field | Type | Required | Notes |
|---|---|---|---|
| id | string | yes | Stable opaque id |
| seriesId | string | yes | e.g. `US_CPI_YOY` |
| name | string | yes | Display |
| country | string | yes | ISO country |
| currency | string | no | Affected currency |
| impact | enum | yes | low/medium/high |
| scheduledAt | ISO datetime | yes | UTC stored |
| forecast | number\|null | no | |
| previous | number\|null | no | |
| actual | number\|null | no | |
| unit | string | no | %, k, index |
| higherIs | enum | no | good_for_currency / bad / context |
| source | string | yes | provider name |
| updatedAt | ISO datetime | yes | |

## AC.2 AnalysisResult

| Field | Type | Notes |
|---|---|---|
| id | string | |
| userId | string\|null | null if local |
| eventId | string | |
| asset | string | Symbol |
| bias | enum | Bullish/Bearish/Neutral |
| decision | enum | | 
| score | int | 0–100 |
| reliability | enum | |
| factors | json | |
| risk | json | |
| playbookId | string\|null | |
| modelVersion | string | |
| createdAt | datetime | |

## AC.3 WatchlistItem

| Field | Type |
|---|---|
| userId | string |
| symbol | string |
| sortOrder | int |
| createdAt | datetime |

## AC.4 AlertSubscription

| Field | Type |
|---|---|
| userId | string |
| eventId | string |
| types | enum[] | T30, T5, ACTUAL, SCORE_CHANGE |
| channels | enum[] | inapp, push, email |
| active | bool |

## AC.5 JournalEntry

| Field | Type |
|---|---|
| id | string |
| userId | string\|null |
| analysisId | string\|null |
| eventId | string |
| asset | string |
| direction | enum |
| outcome | enum | win/loss/be/scratch/skipped |
| rMultiple | number\|null |
| notes | text |
| createdAt | datetime |

---

# Appendix AD — API Endpoint Catalog (Expanded)

Base: `/api/v1`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/calendar/events` | optional | Query: from,to,impact,country,q |
| GET | `/calendar/events/:id` | optional | Event detail |
| GET | `/calendar/next-high` | optional | Next high-impact |
| POST | `/analyze` | optional | Body: eventId, asset, mode |
| GET | `/analyze/:id` | user | Fetch saved analysis |
| GET | `/history/series/:seriesId` | optional | Historical prints |
| GET | `/correlation/:eventId` | optional | Correlation pack |
| GET | `/playbook/:analysisId` | optional | Playbook JSON |
| GET | `/watchlist` | user | List |
| PUT | `/watchlist` | user | Replace/update |
| POST | `/alerts` | user | Create |
| GET | `/alerts` | user | List |
| DELETE | `/alerts/:id` | user | Delete |
| GET | `/journal` | user | List |
| POST | `/journal` | user | Create |
| PATCH | `/journal/:id` | user | Update |
| GET | `/me` | user | Profile/settings |
| PATCH | `/me/settings` | user | Settings |
| POST | `/billing/checkout` | user | Stripe |
| POST | `/billing/portal` | user | Portal |
| GET | `/health` | public | Health |
| GET | `/ready` | public | Readiness |

### Error envelope

```json
{ "error": { "code": "PROVIDER_UNAVAILABLE", "message": "...", "retryable": true, "requestId": "..." } }
```

---

# Appendix AE — Provider Architecture Details

## AE.1 Interface obligations

Every `IEconomicCalendarProvider` must:

1. Map to canonical `EconomicEvent`
2. Support date-range fetch
3. Support single-event fetch if available (else filter)
4. Surface rate-limit errors distinctly
5. Never throw raw vendor payloads to client

## AE.2 Priority & fallback

```text
Primary (env) → retry 3× exponential → Secondary (if configured) → Cache snapshot → MockProvider
```

## AE.3 Caching

| Key | TTL | Invalidate |
|---|---|---|
| `cal:range:{from}:{to}` | 60s | Manual/provider webhook |
| `cal:event:{id}` | 30s in release window; 300s otherwise | Actual update |
| `hist:{seriesId}` | 24h | Pipeline |

## AE.4 MockProvider

Must include realistic CPI/NFP/FOMC/GDP/PMI fixtures with Forecast/Previous and toggleable Actual for demos.

---

# Appendix AF — Security Requirements (Expanded)

| Area | Requirement |
|---|---|
| Transport | TLS 1.2+ |
| Secrets | Server-only provider keys; KMS/env |
| Auth | Email magic link / OAuth; session rotation |
| Authz | User can only access own journal/alerts |
| Input | Zod/schema validation all POST bodies |
| Output | HTML escape user notes; CSP headers |
| Abuse | Rate limit analyze & auth endpoints |
| Privacy | GDPR/CCPA deletion endpoint P1 |
| Audit | Admin access logged |
| Dependency | Automated CVE scanning |
| Legal | Prominent non-advice disclaimer |

---

# Appendix AG — Performance Budgets

| Surface | Budget |
|---|---|
| JS shared bundle (gzip) | < 180KB initial route |
| Workspace route | Prefer code-split heavy panels |
| Images | Lazy; hero CSS/gradient preferred over heavy photo |
| Fonts | Subset; swap; max 2 families |
| Analysis interaction | Optimistic UI with local engines when data present |
| Calendar poll | Only in release window; backoff otherwise |

---

# Appendix AH — Scalability Model

| Dimension | MVP | Growth |
|---|---|---|
| Users | Single region | Multi-region edge |
| Analyze QPS | Burst around NFP/CPI | Queue + cache identical queries |
| Identical analyze | Cache key `hash(event,asset,actual,modelVersion)` TTL 10–30s | |
| Websocket (future) | — | Actual prints fanout |
| Data | Postgres + Redis | Read replicas |

**Burst pattern:** Macro releases create sharp concurrency spikes. Design for 10–20× median QPS for 3 minutes.

---

# Appendix AI — Accessibility Spec

| Control | Requirement |
|---|---|
| Score | `aria-live="polite"` on update |
| Countdown | Announce at T-5 and T-0, not every second |
| Color | Bias never color-only; include text label |
| Focus | Visible focus rings; logical order Detail sections |
| Contrast | AA for text/icons |
| Motions | Respect `prefers-reduced-motion` (disable count-up/pulse) |
| Targets | Min 44px interactive on mobile |

---

# Appendix AJ — Responsive Breakpoints

| Name | Width | Layout |
|---|---|---|
| xs | 0–399 | Single column; bottom sheets for Why?/Playbook |
| sm | 400–767 | Single column denser |
| md | 768–1023 | Optional split list/detail |
| lg | 1024–1439 | Calendar + detail pane |
| xl | 1440+ | Terminal 3-zone: nav · list · intelligence |

---

# Appendix AK — Error Catalog

| Code | User message | Retry | Log level |
|---|---|---|---|
| PROVIDER_UNAVAILABLE | Live data delayed. Using cached/demo schedule. | yes | error |
| EVENT_NOT_FOUND | That event is unavailable. | no | warn |
| ANALYSIS_INVALID_INPUT | Missing forecast/previous for this mode. | no | warn |
| RATE_LIMITED | Too many requests — wait a moment. | yes | warn |
| AUTH_REQUIRED | Sign in to sync watchlist. | no | info |
| PAYWALL | Upgrade to unlock exports. | no | info |
| INTERNAL | Something went wrong. Reference {requestId}. | yes | error |

---

# Appendix AL — Offline Mode Behavior

| Feature | Offline |
|---|---|
| Cached calendar | Read-only last snapshot |
| Analyze | Allowed if event+history cached |
| Alerts | Queue locally; flush later |
| Journal | Local-first; sync on reconnect |
| Live Actual | Unavailable — banner |

Service worker optional P1; MVP = best-effort cache + clear offline banner.

---

# Appendix AM — Caching Strategy Matrix

| Layer | What | Tool |
|---|---|---|
| CDN/Edge | Static assets | Platform CDN |
| HTTP cache | Public calendar GETs short TTL | Cache-Control |
| Redis/Memory | Provider responses | Server cache |
| Client memory | React query / SWR | Hooks |
| localStorage | Watchlist, journal (MVP), settings | Client |
| Golden analyze cache | Identical post-release queries | Server |

---

# Appendix AN — Analytics Event Dictionary (Expanded)

| Event | Props | Why |
|---|---|---|
| `app_opened` | platform, theme | Retention |
| `tour_completed` | skipped | Onboarding |
| `calendar_viewed` | filters | Engagement |
| `calendar_event_opened` | eventId, impact | Funnel |
| `analysis_requested` | eventId, asset, mode | Core |
| `analysis_completed` | score, decision, reliability, ms | Core |
| `why_opened` | analysisId | Understanding |
| `playbook_opened` | analysisId | Monetization value |
| `playbook_exported` | format | Pro feature |
| `alert_created` | types | Retention |
| `journal_saved` | outcome | Habit |
| `paywall_hit` | feature | Conversion |
| `checkout_started` | plan | Revenue |
| `provider_fallback` | from,to | Reliability |

PII policy: no full IP in product analytics; no note text content.

---

# Appendix AO — Logging & Observability

| Stream | Content |
|---|---|
| App logs | requestId, route, latency, error code |
| Provider logs | vendor, attempt, status, latency (no payloads with keys) |
| Engine logs | modelVersion, score, decision (sampled) |
| Audit | login, billing, admin |
| Metrics | QPS, p95, fallback rate, analyze cache hit |
| Tracing | Optional OpenTelemetry on API |

Retention: 30 days app logs; 90 days audit.

---

# Appendix AP — Testing Strategy (Detailed)

## AP.1 Unit

- Surprise math, score weights, decision tree gates, correlation mapping, risk caps, narrative validator, adapters.

## AP.2 Golden scenarios (minimum set)

| ID | Case | Expected decision family |
|---|---|---|
| G01 | Hot CPI large → XAU | Sell / Bearish |
| G02 | Cold CPI large → XAU | Buy / Bullish |
| G03 | Inline CPI → XAU | Wait/Neutral |
| G04 | Hot NFP → EURUSD | Sell EUR bias typical |
| G05 | Extreme risk override | Avoid |
| G06 | Pre-release high importance | Wait |
| G07 | Low history n | Reliability Low |
| G08 | Missing forecast | Controlled error |
| G09 | BTC weak correlation | Lower score |
| G10 | Prop cap | Risk pct ≤ cap |

## AP.3 Integration

Provider factory, retry, cache TTL, authz on journal.

## AP.4 E2E

L.1 Calendar load · L.2 Analyze Gold · L.3 Why? visible · L.4 Avoid path · L.5 Watchlist persist · L.6 Mobile detail.

## AP.5 Non-functional tests

Lighthouse CI, a11y axe on Detail, k6 burst around mocked “release”.

---

# Appendix AQ — Deployment & Environments

| Env | Purpose | Data |
|---|---|---|
| Local | Dev | MockProvider default |
| Preview | PR apps | Mock or sandbox keys |
| Staging | QA | Sandbox providers |
| Production | Live | Primary+fallback providers |

Pipeline: lint → unit → build → e2e smoke → deploy.  
Migrations gated. Feature flags for Score model and AI polish.

Rollback: previous immutable deploy < 5 minutes.

---

# Appendix AR — Product Roadmap (Expanded)

### Phase 0 — Foundations (done / in progress in codebase lineage)

Calendar architecture, workspace shell, playbook, intelligence engine.

### Phase 1 — MVP Public (launch)

| Workstream | Deliverables |
|---|---|
| Product | Journeys V1–V3 polished; disclaimer; tour |
| Eng | Auth optional → accounts; analyze API; caching |
| Growth | Landing, waitlist, docs FAQ |
| QA | Golden G01–G10 green |

### Phase 2 — Pro

Push alerts, exports, unlimited history sync, impact matrix, billing.

### Phase 3 — Intelligence Expansion

More series coverage, live Actual websockets, scenario simulator (beat/inline/miss), broker risk templates for prop firms.

### Phase 4 — Platform

Team seats, shared playbooks, API access for partners, mobile native shells if warranted.

---

# Appendix AS — Monetization & Packaging Detail

| Value metric | Why users pay |
|---|---|
| Time-to-decision | Seconds not minutes |
| Explainability | Why? trail trust |
| Playbook | Actionable plan |
| Alerts | Never miss window |
| History sync | Compounding journal edge |

**Not monetizing:** vanity social features, NFT gimmicks, opaque signals without Why?.

### Packaging principles

1. Free must demonstrate Score + Why? on real High-impact events.  
2. Pro unlocks speed/scale (alerts, exports, matrix, sync).  
3. Team unlocks governance (seats, shared templates, prop risk caps).

---

# Appendix AT — Pricing Schedule (Normative Proposal)

| Plan | Price (USD) | Includes | Limits |
|---|---|---|---|
| Free | $0 | Calendar, Score, Why?, basic playbook, local journal | 5 watchlist; 3 alerts; no export |
| Pro | $29/mo or $249/yr | Push/email alerts, exports, matrix, sync, short+detailed AI | 50 watchlist; unlimited alerts |
| Team | $79/user/mo (3 seat min) | Shared templates, admin, prop risk profiles | SSO P2 |

Trials: 7-day Pro trial once per account.  
Student/prop discounts: manual coupon P2.

---

# Appendix AU — Future Features (Prioritized Backlog)

| Theme | Feature | Priority |
|---|---|---|
| Intelligence | Pre-release scenario triad scores | P1 |
| Intelligence | Central bank speech sentiment add-on | P2 |
| Data | Tick-level post-news move charts (embed partner) | P2 |
| Alerts | SMS critical only | P2 |
| Journal | Auto-score user calibration (“were you aligned?”) | P1 |
| Education | Interactive “read the print” tutorials | P1 |
| Platform | Public API for Score | P2 |
| Platform | Discord/Telegram bot alerts | P2 |
| Markets | Options IV crush context for indices | P3 |
| Markets | Bonds / 2Y-10Y transmission | P2 |
| Compliance | Region-specific disclaimer packs | P1 |
| Mobile | PWA install | P1 |
| AI | Multilingual narratives | P2 |
| AI | Voice brief “30-sec desk read” | P3 |

---

# Appendix AV — Competitive Positioning Deep Dive

| Capability | Forex Factory | Investing.com | TradingView | Bloomberg | Generic ChatGPT | TradeImpact |
|---|---|---|---|---|---|---|
| Calendar | Strong | Strong | Good | Strong | Weak | Good (enough) |
| Charts | Weak | Medium | Best-in-class | Strong | None | Out of scope |
| Decision bias | No | No | Limited | Human analyst | Unstructured | **Core** |
| Historical pattern stats | Manual | Partial | Manual | Powerful $$ | Hallucination risk | **Productized** |
| Explainability | N/A | N/A | Low | High $$ | Variable | **Why? trail** |
| Playbook | No | No | No | Notes | Ad hoc | **Structured** |
| Price | Free | Freemium | Freemium | Expensive | Sub | Freemium decision layer |

**Positioning statement:**  
TradeImpact is the decision layer between the economic calendar and the charting platform.

---

# Appendix AW — Go-To-Market

## AW.1 Beachhead

1. Gold + US macro traders (CPI/FOMC/NFP)  
2. Prop firm evaluation students needing risk discipline  
3. EURUSD news traders

## AW.2 Channels

| Channel | Motion |
|---|---|
| Content | “Hot CPI → Gold” public teardown threads |
| SEO | Event pages educational (careful with advice laws) |
| Communities | Prop firm Discords (value-first, no spam signals) |
| Product-led | Free Score + Why? share cards (disclaimer included) |
| Partners | Educator affiliates; non-exclusive |

## AW.3 Launch narrative

> Calendars tell you when. Charts tell you what price did.  
> TradeImpact tells you **what the print means for your market — and why.**

---

# Appendix AX — Legal & Compliance Notes (Product Constraints)

1. Outputs are **educational decision-support**, not recommendations to buy/sell securities.  
2. No performance guarantees; no simulated performance presented as live returns without clear labeling.  
3. Marketing must not claim “AI beats the market.”  
4. Maintain auditability of Score model versions.  
5. Support jurisdiction blocking if required later.  
6. User-generated journal content moderated only for abuse, not trading advice approval.

---

# Appendix AY — Ops Runbooks (Brief)

### AY.1 Calendar provider outage

1. Alert on fallback rate > 10% / 5m  
2. Confirm retry exhaustion  
3. Status page: Investigating  
4. Ensure Mock/cache not empty for next High event  
5. Switch secondary provider via flag  
6. Postmortem within 48h

### AY.2 Incorrect Actual displayed

1. Freeze analyze cache for event  
2. Correct via provider refresh  
3. Recompute analyses or mark stale  
4. Notify users with alerts on that event

### AY.3 Score model regression

1. Feature-flag revert to previous weights  
2. Re-run golden suite  
3. Notify Pro users if decisions differ materially

---

# Appendix AZ — QA Test Scripts (Manual)

### Script QA-01 Pre-release analyze

1. Set system time mock to T-30 for fixture CPI.  
2. Open event → Analyze XAU.  
3. Expect Wait or scenario UI; Score may be provisional.  
4. Why? mentions surprise pending or scenario.  
5. Enable T-5 alert.

### Script QA-02 Post-release recompute

1. Inject Actual hot.  
2. Expect Score ≥ prior; decision may upgrade Wait→Sell.  
3. Verify aria-live update.  
4. Playbook entries unlocked.

### Script QA-03 Avoid

1. Fixture Extreme risk.  
2. Expect Avoid; playbook stay flat; no aggressive entry.

### Script QA-04 Mobile

1. iPhone width 390.  
2. Complete Journey V1 in ≤3 taps to Score.  
3. Why? in sheet; scroll performance acceptable.

### Script QA-05 A11y

1. Keyboard only through calendar to Why?.  
2. Screen reader announces decision and score.

---

# Appendix BA — Content & Microcopy Deck (Core)

| Key | Copy |
|---|---|
| Tagline | Know the Impact Before You Trade. |
| CTA analyze | Analyze impact |
| Score label | TradeImpact Score™ |
| Why CTA | Why? |
| Avoid title | Avoid — capital preservation first |
| Wait title | Wait — let the print confirm |
| Disclaimer short | Educational decision support. Not financial advice. |
| Fallback banner | Live calendar delayed — using cached schedule. |
| Empty calendar | No high-impact events in this range. |
| Fake spike | First minutes are noise — wait for confirmation. |

---

# Appendix BB — Asset Coverage Matrix (MVP)

| Asset | Class | USD news sensitivity | MVP |
|---|---|---|---|
| EURUSD | FX | High | Yes |
| GBPUSD | FX | High | Yes |
| USDJPY | FX | High | Yes |
| XAUUSD | Metal | High | Yes |
| XAGUSD | Metal | High | Yes |
| US100 | Index | High | Yes |
| US500 | Index | Medium-High | Yes |
| BTCUSD | Crypto | Medium | Yes |
| ETHUSD | Crypto | Medium | Yes |
| USOIL | Energy | Medium | P1 |
| DXY | Dollar index | High | P1 |

---

# Appendix BC — Event Series Coverage (MVP)

| Series ID | Name | Impact default |
|---|---|---|
| US_CPI_YOY | CPI YoY | High |
| US_CPI_MOM | CPI MoM | High |
| US_CORE_CPI_MOM | Core CPI MoM | High |
| US_NFP | Non-Farm Payrolls | High |
| US_UNEMP | Unemployment Rate | High |
| US_FOMC_RATE | FOMC Rate Decision | High |
| US_GDP_QOQ | GDP QoQ | High |
| US_ISM_MFG | ISM Manufacturing PMI | High |
| US_PCE_CORE | Core PCE MoM | High |
| US_RETAIL | Retail Sales MoM | Medium/High |
| EU_CPI | Eurozone CPI | High |
| UK_CPI | UK CPI | High |

---

# Appendix BD — Correlation Seed Table (Illustrative)

| Event factor | EURUSD | GBPUSD | USDJPY | XAU | XAG | US100 | BTC |
|---|---|---|---|---|---|---|---|
| USD hawkish shock | − | − | + | − | − | −/+* | −/+* |
| USD dovish shock | + | + | − | + | + | + | + |

\*Equity/crypto conditional on risk-on narrative; model reduces weight when ambiguous → lower C component.

---

# Appendix BE — Risk Engine Matrices

| Importance | Session vol | Resulting risk floor |
|---|---|---|
| High | Elevated | High |
| High | Extreme (NFP open) | Extreme |
| Medium | Normal | Medium |
| Low | Normal | Low |

| Risk level | Max suggested risk % (retail) | Prop default |
|---|---|---|
| Low | 1.5% | 0.5% |
| Medium | 1.0% | 0.5% |
| High | 0.75% | 0.25% |
| Extreme | 0% (Avoid) | 0% |

---

# Appendix BF — Notification Rules Engine

```text
IF user subscribed T-30 AND now == scheduledAt - 30m → send
IF user subscribed T-5 AND now == scheduledAt - 5m → send
IF Actual transitions null→value → send ACTUAL (include surprise bucket)
IF score changes by ≥10 after revision → send SCORE_CHANGE (Pro)
Dedupe key: userId+eventId+type
Quiet hours: optional user setting
```

---

# Appendix BG — Settings Schema

```text
Settings {
  timezone: string
  theme: dark|light
  defaultImpactFilter: high|medium|all
  defaultAssets: string[]
  riskProfile: retail|prop
  maxRiskPct: number
  aiVerbosity: short|standard|detailed
  notifications: { inapp, push, email, quietHours? }
  reduceMotion: bool
}
```

---

# Appendix BH — Folder Structure (Target SaaS Monorepo)

```text
apps/
  web/                 # Next.js web app
  api/                 # optional separate API
packages/
  engine/              # Decision, Score, Risk, Correlation, History
  providers/           # Calendar providers
  schemas/             # Zod/JSON schemas
  ui/                  # design system (terminal)
  config/              # eslint, tsconfig
docs/
  PRD.md
  API.md
  ENGINE.md
infra/
  terraform/ or pulumi/
  monitoring/
```

---

# Appendix BI — Tech Stack (Normative Recommendation)

| Layer | Choice | Rationale |
|---|---|---|
| Web | Next.js + TypeScript | SSR/edge, mature |
| UI | Tailwind + custom terminal tokens | Speed + control |
| Engines | Pure TS package | Deterministic, testable |
| API | Route handlers / Node | Simplicity MVP |
| DB | PostgreSQL | Relational journal/billing |
| Cache | Redis | Calendar + analyze |
| Auth | Clerk/Auth.js/Cognito | Speed to market |
| Billing | Stripe | Standard |
| AI | Optional LLM + template guard | WHY narrator |
| Observability | OpenTelemetry + Axiom/Datadog | Ops |
| Mobile | Responsive web PWA first | Cost |

---

# Appendix BJ — Database DDL (Logical)

```sql
-- Logical DDL (PostgreSQL)

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email CITEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  settings_json JSONB NOT NULL
);

CREATE TABLE economic_events_cache (
  id TEXT PRIMARY KEY,
  series_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY,
  user_id UUID NULL REFERENCES users(id),
  event_id TEXT NOT NULL,
  asset TEXT NOT NULL,
  result_json JSONB NOT NULL,
  model_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE watchlist_items (
  user_id UUID NOT NULL REFERENCES users(id),
  symbol TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, symbol)
);

CREATE TABLE alert_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  event_id TEXT NOT NULL,
  types TEXT[] NOT NULL,
  channels TEXT[] NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  analysis_id UUID NULL,
  event_id TEXT NOT NULL,
  asset TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX analyses_user_created ON analyses(user_id, created_at DESC);
CREATE INDEX events_sched ON economic_events_cache(scheduled_at);
```

---

# Appendix BK — Sequence Diagrams (Text)

### BK.1 Analyze (post-release)

```text
User → Web: Analyze(event, asset)
Web → API: POST /analyze
API → Cache: get event + history + corr
Cache → API: data
API → Engine: compute(inputs)
Engine → API: AnalysisResult
API → AI: narrate(context) [optional]
AI → API: text (validated)
API → DB: store analysis (if authed)
API → Web: result JSON
Web → User: Score / Why? / Playbook
```

### BK.2 Actual print fan-in

```text
Provider → Ingest: Actual update
Ingest → Cache: invalidate event
Ingest → AlertBus: ACTUAL
AlertBus → Users: push/inapp
User → Web: open / recompute
```

---

# Appendix BL — Information Architecture (Expanded Sitemap)

```text
/                       Marketing landing
/app                    Dashboard (auth optional)
/app/calendar           Economic calendar
/app/event/:id          Event detail + intelligence
/app/matrix/:id         Multi-asset impact matrix
/app/watchlist          Watchlist manager
/app/alerts             Alerts center
/app/history            Analysis history
/app/journal            Trade journal
/app/settings           Settings
/app/billing            Plan management
/docs/*                 Help / FAQ / glossary
/legal/disclaimer       Legal
/status                 Status page
```

---

# Appendix BM — Dashboard Widgets (Post-hero)

After first viewport composition, secondary modules (scroll):

1. **Watchlist scores** for next event (compact rows, not card grid)  
2. **Today’s High-impact timeline**  
3. **Recent analyses**  
4. **Discipline strip** — skipped trades count (prop narrative)

Each module: one purpose, one headline, one sentence.

---

# Appendix BN — Edge Cases Catalog

| # | Edge case | Expected behavior |
|---|---|---|
| 1 | Forecast null | Block post-release surprise; show incomplete state |
| 2 | Actual equals Forecast | Inline; likely Wait/Neutral unless history strong |
| 3 | Duplicate alerts | Dedupe |
| 4 | Event rescheduled | Update countdown; notify subscribers |
| 5 | Series rename | seriesId stable; name display changes |
| 6 | Crypto 24/7 vs FX session closed | Risk flag liquidity |
| 7 | User risk 0% | Always Avoid entries |
| 8 | LLM timeout | Template narrative fallback |
| 9 | Clock skew | Server scheduledAt authoritative |
| 10 | Two assets opposite bias | Allowed; matrix shows both |
| 11 | Revision of Actual | Recompute + “Revised” badge |
| 12 | Very small history n=1 | Reliability Low; confidence language softened |

---

# Appendix BO — Acceptance Criteria per Launch Milestone

### Milestone M1 — Decision Core

- [ ] G01–G10 golden tests pass  
- [ ] Why? shows all five weight factors  
- [ ] Avoid/Wait/Buy/Sell decisions match tree  
- [ ] Disclaimer visible

### Milestone M2 — Calendar Trust

- [ ] Countdown correct across TZ  
- [ ] Fallback banner on provider failure  
- [ ] High filter default

### Milestone M3 — Playbook & AI

- [ ] Playbook schema valid for Sell/Buy/Wait/Avoid  
- [ ] AI validator rejects number hallucinations  
- [ ] Export includes disclaimer

### Milestone M4 — Retention Loop

- [ ] Alerts T-5 fire in staging synthetic  
- [ ] Journal save/reload  
- [ ] History list

### Milestone M5 — Monetization Ready

- [ ] Paywall on export  
- [ ] Stripe checkout sandbox  
- [ ] Plan limits enforced server-side

---

# Appendix BP — Investor Narrative (1-pager)

**Problem:** Macro calendars create information, not decisions.  
**Solution:** TradeImpact converts Forecast/Previous/Actual + history + correlation into Score, bias, risk, and playbook — with a full Why? trail.  
**Why now:** Retail/prop news trading is huge; LLMs made “explanation UX” expected; yet traders need deterministic risk-aware systems, not chatbot guesses.  
**Product:** SaaS freemium decision layer (not charts, not broker).  
**Moat:** Proprietary historical intelligence + calibrated Score + workflow (alerts/journal) + explainability trust.  
**Model:** Free → Pro $29 → Team.  
**Ask usage:** Build the category “News Trading Decision Platform.”

---

# Appendix BQ — Glossary (Extended)

| Term | Definition |
|---|---|
| Actual | Official printed value |
| Forecast | Consensus expectation |
| Previous | Prior period value |
| Surprise | Deviation of Actual from Forecast |
| TradeImpact Score™ | 0–100 opportunity quality score |
| Bias | Bullish / Bearish / Neutral for an asset |
| Decision | Actionable layer incl. Avoid/Wait/Buy/Sell styles |
| Reliability | Confidence band from data quality + score |
| Transmission path | News → macro factor → asset |
| Fake spike | Early stop-hunt move post-print |
| Playbook | Structured trade plan |
| Why? | Factor-level explanation UI |
| Series | Recurring event type (e.g. US CPI YoY) |
| Release window | T-5m to T+15m around print |
| Prop risk cap | Max % risk for prop personas |

---

# Appendix BR — Open Questions (Closed for MVP)

| Question | Decision |
|---|---|
| Build charts? | No — integrate mentally with TradingView |
| Auto-execution? | No |
| Social copy-trading? | No for MVP |
| Light theme? | Optional V1; dark default |
| Which provider? | Pluggable; mock always available |
| LLM required? | Optional polish; templates sufficient for MVP |

---

# Appendix BS — RACI (Core Workstreams)

| Workstream | Product | Design | Eng | Data | QA | Legal |
|---|---|---|---|---|---|---|
| Score model | A | C | R | R | C | C |
| Calendar UX | A | R | R | C | C | I |
| AI narrative | A | C | R | C | C | A |
| Billing | A | C | R | I | C | C |
| Disclaimers | A | C | I | I | I | R |

R=Responsible A=Accountable C=Consulted I=Informed

---

# Appendix BT — Definition of Done (Product Increment)

A feature is Done when:

1. Spec in PRD/ENGINE satisfied  
2. Unit/golden tests updated  
3. A11y critical path checked if UI  
4. Analytics events emitted  
5. Error states handled  
6. Disclaimer not weakened  
7. Docs updated (API/ENGINE if contracts change)  
8. Feature flag plan documented if risky

---

# Appendix BU — Sample Day-in-the-Life (Pro User)

05:45 — Alert T-30 for CPI; opens Dashboard on mobile.  
05:50 — Reviews matrix; Gold Score provisional Wait.  
05:55 — T-5 alert; reduces other exposure per playbook.  
06:00 — Actual hot; Score 91 Conservative Sell; reads Why? 20s.  
06:01 — Waits fake-spike window.  
06:04 — Executes on charting broker (external); journals plan.  
06:30 — Logs outcome + R; reviews history calibration weekly.

---

# Appendix BV — Support Playbook (Tier 1)

| Ticket | Response |
|---|---|
| “Wrong direction” | Explain model inputs; ask eventId/asset; check Actual; share Why? factors; not advice |
| “Calendar missing event” | Check provider status; fallback; escalate Data |
| “Charged twice” | Billing runbook / Stripe |
| “Push not received” | Check permissions, quiet hours, plan |

---

# Appendix BW — Success Metrics Instrumentation Plan

| Metric | Source | Dashboard |
|---|---|---|
| WAT | analytics | Growth |
| Analysis/WAT | analytics | Product |
| Why rate | analytics | Product |
| Alert attach rate | analytics | Retention |
| Free→Pro | Stripe+auth | Revenue |
| Fallback rate | logs | Reliability |
| p95 analyze | APM | Eng |

Review cadence: weekly product metrics; daily reliability during first 30 days post-launch.

---

# Appendix BX — Brand & UI Philosophy (Consolidated)

**TradeImpact** must feel like a precision instrument:

- Minimal chrome, maximum signal  
- Dark terminal atmosphere with depth (gradients/patterns), not flat void  
- Brand name hero-level on first viewport  
- Typography expressive and intentional; mono for numbers  
- Motion only for hierarchy (countdown, score, live row)  
- No purple-glow cliché; no cream-serif terracotta cliché; no emoji  
- Cards avoided unless interactive container requires  
- Mobile first: thumb reach, ≤3 taps to decision  
- Fast: perceived performance is part of the brand  

Design test: *If you remove the nav, does the first viewport still say TradeImpact?* If not, branding is too weak.

---

# Appendix BY — Document Revision Plan

| Trigger | Action |
|---|---|
| Score weight change | PRD §20 + Appendix X + ENGINE.md |
| New asset class | BB matrix + Correlation seeds |
| Pricing change | §49 + AT |
| Legal change | AX + in-app copy |

---

# Appendix BZ — Final Delivery Checklist for Build Teams

**Product**

- [ ] All P0 stories in Appendix U accepted  
- [ ] Journeys V1–V5 validated in staging  

**Design**

- [ ] Tokens + W1–W10 implemented  
- [ ] Motion + a11y reviewed  

**Engineering**

- [ ] Engines deterministic + golden CI  
- [ ] Provider fallback  
- [ ] API envelopes  
- [ ] Limits enforced server-side  

**QA**

- [ ] QA-01…05 + G01…G10  

**Go-to-market**

- [ ] Pricing page + FAQ + disclaimer  

**Leadership / Investors**

- [ ] Appendix BP narrative aligned with metrics in §6  

---

**End of Part II.**  
TradeImpact PRD v1.0 — Extended Specifications  
*Know the Impact Before You Trade.*
