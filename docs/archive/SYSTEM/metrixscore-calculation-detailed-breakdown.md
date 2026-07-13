# MetrixScore™ Calculation — Detailed Breakdown

**Checkpoint:** `948c9cc` · Method: code inspection + hand-traced sample users. Evidence **[code]**.

> **Read this first:** The number on `/results`, `/dashboard`, and `/report` is **Engine 2**
> (`metrixEngine.ts:scoreAssessment` via `metrixReport.ts:buildStarterScore`). **Engine 1**
> (`scoring.ts:calculateScores`) computes a *different* number that is stored in `szm_score` and
> Supabase but is **not the displayed headline**. Both are documented below.

---

## ENGINE 1 — `scoring.ts:calculateScores` (stored, not displayed as headline)

### Inputs → 7 raw category points
| Category | Source | Max |
|---|---|---|
| businessClarity | Q1 option score | 10 |
| locationClarity | derived: state+city 10 / state 7 / city 3 / none 0 | 10 |
| stageReadiness | Q3 option score | 15 |
| setupReadiness | sum of Q4 checks, capped, `none_yet`→0 | 20 |
| financialReadiness | Q5 option score | 20 |
| customerReadiness | Q6 option score | 15 |
| blockerSeverity | Q7 option score | 10 |
| (emailScore bonus) | +10 if name+email present | +10 |

### Formula [code] `scoring.ts:212-214`
```
rawSum  = sum(7 category points) + emailScore        // emailScore ∈ {0,10}
maxRaw  = 110
overall = min(100, round( rawSum / 110 × 100 ))
```
- **Min:** 0 · **Max:** 100 (clamped). · **Method:** simple **sum normalized to a fixed 110-point max**, then ×100. NOT a weighted average. All categories contribute by their raw point ceilings (so `setupReadiness`/`financialReadiness` at max 20 each carry the most weight; `blocker` 10 the least).
- **Missing answers:** `?? 0` per category → unanswered behaves as 0.
- **Bands** [code] `scoring.ts:74-108`: 0–39 **High Risk**, 40–59 **Foundation Stage**, 60–79 **Launch Ready**, 80–100 **Growth Ready**.

> A "complete this question" answer never *lowers* the score; the email bonus means finishing the
> lead step is worth +10 raw (~+9 points). Because `maxRaw` is 110 and email is only 10 of it, a
> user who maxes the 7 questions but skips email tops out at `round(100/110×100)=91`.

---

## ENGINE 2 — `metrixEngine.ts:scoreAssessment` (the displayed Starter MetrixScore™)

### Step A — map 7 answers + intake → partial 21-criterion Likert response
`metrixReport.ts:buildStarterResponse` builds `answers: { criterionId → choice }` where choice ∈
`not_started / started_inconsistent / needs_improvement / strong_documented / not_sure`. Only the
criteria it can infer are set; the rest stay **unanswered** (excluded from scoring). [code]

Answer → credit fraction (`metrixEngine.ts:32-38`):
```
not_started 0.0 · started_inconsistent 0.34 · needs_improvement 0.67 · strong_documented 1.0 · not_sure 0.0
```

### Step B — per-category score (`metrixEngine.ts:248-273`)
```
categoryScore = round( (sum of answered fractions / number answered) × 100 )   // 0 if none answered
```
Each of the 7 categories has 3 criteria (21 total). **Only answered criteria count** — an
unanswered criterion neither helps nor hurts.

### Step C — overall (stage-weighted average over ANSWERED categories) (`:275-279`)
```
group        = stageGroup(stage)            // early / establishing / growth / reset
weights      = STAGE_WEIGHTS[group]         // per-category multipliers
weightTotal  = Σ weight over answered cats
weightedSum  = Σ (categoryScore × weight) over answered cats
overall      = round( weightedSum / weightTotal )    // 0 if weightTotal 0
```

### Stage groups & weights (`metrixEngine.ts:111-141`)
- thinking/planning → **early**; launched_u6/months_6_12 → **establishing**; over_1yr → **growth**; reset → **reset**; default → establishing.

| group | bus_found | fin_ctrl | sales_mkt | ops | cust_exp | people | growth_risk |
|---|---|---|---|---|---|---|---|
| early | 2.0 | 1.5 | 1.2 | 0.8 | 0.8 | 0.5 | 1.0 |
| establishing | 1.3 | 1.5 | 1.5 | 1.3 | 1.2 | 0.8 | 1.0 |
| growth | 0.8 | 1.3 | 1.4 | 1.3 | 1.2 | 1.4 | 1.5 |
| reset | 1.5 | 1.6 | 1.2 | 1.2 | 1.0 | 0.9 | 1.3 |

### Risk level (`:214-219`)
`<40 high · <60 elevated · <75 moderate · ≥75 low`.

### Risk severity per category (`:221-225`): `<34 high · <60 moderate · else low`.

### Recommended path (`:233-238`) — **stage group ONLY**
`early→foundation` · `establishing→stabilize` · `growth→scale` · `reset→rebuild`.
Focus category = lowest-scoring answered category (`:315`), with a **challenge/goal tiebreak**
(`metrixReport.ts:153-179`) that promotes the tied category matching intake `biggestChallenge` then
`mainGoal`.

### Profile completion / confidence (`:296-311`)
```
completion = round(answeredCriteria / 21 × 100)
confidence = round((answered − notSure) / 21 × 100)
```
Because Engine 2 can only infer a subset, completion is **always partial** (typically ~45–67%) even
after the user "finishes" the assessment. The UI frames this as "your profile grows over time."

### Solo-operator guard (`metrixReport.ts:121-132`) [code]
If intake `teamSize === 'just_me'` and `mainGoal !== 'hire_scale'`, the 3 People & Leadership
criteria are **left unanswered** (so a solo owner is not punished for having no team). Documented in
memory as the resolved false-negative ([[task-solo-people-leadership-false-negative]]).

---

## Worked sample users (hand-traced through Engine 2 — the displayed score)

> Assumptions are stated; exact selections drive the math. These reproduce the live formula.

### Persona A — New contractor (planning, low capital, nothing set up)
Answers: business_type hvac · location TX/Austin · stage **planning** · setup **none_yet** ·
financial **under_2k** · customer_plan **no_plan** · blocker **pricing** · intake stage planning,
team just_me, goal launch, challenge pricing, confidence low.

Mapped criteria → categories (answered only):
- business_foundation: entity/licensing/banking all `not_started` → **0**
- financial_control: cash_flow 0, pricing_strategy 0 → **0**
- sales_marketing: lead_generation 0, online_presence 0 → **0**
- growth_risk: runway 0, risk_contingency 0, growth_strategy 0.34 → **11**
- operations / customer_experience / people_leadership → unanswered (excluded)

Stage **early** weights → answered cats bf(0×2.0) fc(0×1.5) sm(0×1.2) gr(11×1.0); weightTotal 5.7;
weightedSum 11 → **overall = round(11/5.7) = 2**.
- Risk **high** · Path **Foundation Builder** · focus (challenge=pricing tiebreak) → **Financial Control** → first action "Set up simple bookkeeping and a basic pricing and cash-flow plan."
- Profile completion = 10/21 = **48%**.
- **Finding:** the displayed Starter score is ~**2/100** — alarmingly low for a legitimate
  pre-launch user, because Engine 2 scores only the few inferable criteria (all 0) and excludes the
  favorable-by-default unanswered ones. (Engine 1 for the same user ≈ `round((10+7+8+0+4+0+6)/110×100)=32`, "High Risk" — also low but different.)

### Persona B — Operating but struggling (6–12 mo, set up, weak leads/pricing)
Answers: electrical · stage **months_6_12** · setup biz_name+entity_reg+ein+bank+insurance+license_res ·
financial **k2_10** · customer_plan **word_of_mouth** · blocker **customers** · intake team 2_3,
goal more_leads, challenge leads, confidence moderate.

- business_foundation: all strong → **100**
- financial_control: cash_flow 0.34 only → **34**
- sales_marketing: lead_generation 0.34, online_presence 0 → **17**
- people_leadership: team 2_3 → 0.34 ×3 → **34**
- growth_risk: runway 0.34, risk 0.67, growth 0.34 → **45**

Stage **establishing** weights → bf(100×1.3) fc(34×1.5) sm(17×1.5) pl(34×0.8) gr(45×1.0);
weightTotal 6.1; weightedSum 278.7 → **overall = round(45.7) = 46**.
- Risk **elevated** · Path **Stabilize & Systemize** · focus **Sales & Marketing** (lowest 17) → first action "Claim your Google Business Profile and set up one reliable lead source."
- Profile completion = 12/21 = **57%**. (Correctly steers to lead/sales before more ads.)

### Persona C — Established (1yr+, fully set up, ops bottleneck)
Answers: plumbing · stage **over_1yr** · setup all 8 · financial **over_25k** · customer_plan
**existing_base** · blocker **software** · intake team 4_10, goal systematize, challenge systems,
confidence high.

- business_foundation: all strong → **100**
- financial_control: cash_flow 1.0 → **100**
- sales_marketing: lead 1.0, online 1.0, brand 0.34 → **78**
- operations: scheduling_workflow `not_started` (blocker=software) → **0**
- people_leadership: team 4_10 → 0.67 ×3 → **67**
- growth_risk: runway 1.0, risk 0.67, growth 0.67 → **78**

Stage **growth** weights → bf(100×0.8) fc(100×1.3) sm(78×1.4) ops(0×1.3) pl(67×1.4) gr(78×1.5);
weightTotal 7.7; weightedSum 530 → **overall = round(68.8) = 69**.
- Risk **moderate** · Path **Scale & Optimize** · focus **Operations** (lowest 0) → first action "Put one repeatable scheduling and job-tracking workflow in place."
- Profile completion = 14/21 = **67%**. (Correctly flags the ops bottleneck, not "buy more leads.")

---

## What the displayed score actually measures (honest summary)

It measures **inferred readiness across 7 business categories, stage-weighted**, but built from a
**partial inference** of 21 criteria off 7 startup-flavored questions + a little intake. In practice
it most strongly reflects:
1. **Business setup completion** (Q4 checkboxes dominate 5 criteria).
2. **Self-reported stage** (sets the entire weight table + path).
3. **Financial comfort** (one answer drives two criteria).

It does **not** measure real business *performance* (no revenue/close/lead/retention inputs reach
it), nor momentum, nor benchmarked risk. Those live in the Growth Engine (separate) or are unmeasured
gaps. The UI's own copy ("not a final, benchmarked, or predictive score — a starting point")
matches this. [code] `results/page.tsx:330-334`

### Cross-file consistency note
A given user has **two different "overall" numbers**: Engine 1 in `szm_score`/Supabase
(`overall_score`, with bands like "Foundation Stage") and Engine 2 on screen (with risk levels like
"Elevated Risk"). Any analytics or support that reads the Supabase `overall_score` will not match
what the user saw. Flagged in the consistency audit.
