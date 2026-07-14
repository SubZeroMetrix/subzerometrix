# Customer Zero — The Internal Operating Loop

*Governed by [`COMPANY_CONSTITUTION.md`](./COMPANY_CONSTITUTION.md), [`PRODUCT_PHILOSOPHY.md`](./PRODUCT_PHILOSOPHY.md)'s Customer Zero philosophy, and [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md). Cross-referenced against a read-only audit of `command-center` (the Metrix Command Center product repository) performed this pass — every system referenced below as "real" was directly confirmed in that codebase, not assumed from memory. See [`CUSTOMER_ZERO_METRICS.md`](./CUSTOMER_ZERO_METRICS.md) and [`MORNING_BRIEF_AND_DAILY_WRAPUP.md`](./MORNING_BRIEF_AND_DAILY_WRAPUP.md) for the rest of this system. Documentation only — nothing in this document is new code.*

## The Objective

Use Metrix Command Center to operate Metrix Command Center. SubZeroMetrix (this repo, the public marketing/lead-capture surface) and `command-center` (the product, where the founder runs the actual business) together form one real, closed loop — not a demo, not a future plan, the actual current operating reality of this company.

## The Complete Loop — status of each stage, verified this pass

| Stage | Status | Evidence |
|---|---|---|
| **Visitor** | REAL | Live homepage at `www.subzerometrix.com`, Vercel Analytics installed and live (see `LAUNCH_READINESS.md` — no meaningful traffic volume yet, too new to evaluate) |
| **Lead** | REAL | `mcc_leads` table (isolated Supabase project `sskgceffpkiuxjhlyjjr`), live end-to-end tested this session — currently 0 real rows (test data cleaned up, no fabricated leads) |
| **Qualification** | PARTIAL | No automated qualification scoring confirmed in `command-center`'s CRM this pass — leads land in `mcc_leads` but qualification is a manual founder step today, not yet a defined system stage |
| **CRM** | REAL | `command-center`'s `/crm` area — confirmed real: `crm/customers`, `crm/estimates`, `crm/jobs`, `crm/recovery`, `crm/relationships`, `crm/follow-ups`, all linked live from the real "Business Command Bar" on `/runtime` |
| **Opportunity** | REAL | `crm/relationships` and `crm/recovery` (recovery cases) confirmed as real, linked, populated-by-real-data pages |
| **Buster** | REAL | `ask-buster` route confirmed real; Buster's actual current behavior (morning/EOD reports) documented in `MORNING_BRIEF_AND_DAILY_WRAPUP.md` |
| **Follow-up** | REAL | `crm/follow-ups`, and the real "Overdue Follow-Ups" tile on the Business Command Bar, confirmed live |
| **Trial** | REAL (product-side) | 7-day trial is real, live, billed via Stripe checkout (`command-center`'s `create-checkout-action.ts`, confirmed real in an earlier pass this session) |
| **Customer** | REAL (product-side) | `crm/customers` confirmed real; entitlement/billing-portal flow confirmed real code (see `LAUNCH_RISK_REGISTER.md` L-5) |
| **Product Feedback** | PARTIAL | No dedicated customer-feedback-intake system confirmed this pass beyond the general CRM/communication surfaces — not a defined, separate stage yet |
| **Roadmap** | REAL | `known-gaps` route exists in `command-center`; this repo's own `30-60-90_DAY_PLAN.md` and `TRAFFIC_ENGINE_ROADMAP.md` are real roadmap artifacts |
| **Release** | REAL | `command-center`'s own extensive build history (per its `BUILD_HISTORY.md`, referenced in earlier sessions) and this repo's own `DEPLOYMENT.md` five-stage release process |
| **Marketing** | REAL | `command-center`'s `marketing` route exists; this repo's entire traffic-engine documentation set (`SEO_CONTENT_ARCHITECTURE.md` etc.) |
| **Referral** | NOT YET BUILT | No referral system found in either repo this pass — not documented as if it exists |

**Honest summary**: the loop is real from Visitor through Customer, with two explicitly informal/manual stages (Qualification, Product Feedback) and one stage (Referral) that does not exist yet. This document does not pretend those gaps are filled.

## Customer Feedback Loop

`Customer → CRM → Opportunity → Product → Release → Customer`

Real today: Customer and CRM stages are real (see table above). Opportunity (via `crm/recovery`/`crm/relationships`) is real. **Product and Release feedback-integration is informal** — no confirmed system routes real customer feedback into a tracked product-change pipeline automatically; this happens through the founder's own judgment today, consistent with the company's current single-operator stage. Documented as the real current state, not idealized.

## Product Learning Loop

`Feature → Usage → Feedback → Improvement → Measurement`

Real today: Feature (real, shipped capability) and Measurement (via `agent-scorecard`, `traction`, `daily-reports` — all confirmed real routes in `command-center`) exist. **Usage and Feedback tracking at the individual-feature level is not confirmed as a distinct system** — `agent-scorecard` exists but its exact scope wasn't verified in this read-only pass beyond confirming the route is real. This loop is directionally real but not fully instrumented yet.

## Agent Responsibilities & Handoffs

- **Buster** — daily reporting (see `MORNING_BRIEF_AND_DAILY_WRAPUP.md`), `ask-buster` Q&A, recommends next actions. Every recommendation requires human approval before executing, per `CUSTOMER_PROMISE.md` — confirmed architecturally real via the `approvals` route and `emergency-stop` (kill switch) route in `command-center`.
- **Other agents** — this read-only pass confirmed the *routes* for `agent-runs`, `agent-scorecard`, `trace-spans`, `evidence-library`, `execution-requests`, `n8n-bridge`, `memory-review` exist in `command-center`, consistent with the multi-agent architecture referenced in prior build history. This document does not re-verify each individual agent's current internal behavior — that would require a deeper audit than this pass performed, and is not claimed here.
- **Handoffs** — the real, confirmed handoff points are: lead → CRM (via `mcc_leads`/`lead_signups` → CRM ingestion, not independently re-verified this pass whether that ingestion is automated or manual), CRM → Buster (via `ask-buster` and the recommendation surfaces on `/runtime`), Buster → human (via `approvals`).
- **Approvals** — `approvals` and `emergency-stop` routes confirmed real in `command-center`, consistent with the governance-gated AI principle in `COMPANY_CONSTITUTION.md` and `CUSTOMER_PROMISE.md`.

## Implementation Plan

**Phase 1 (already real — nothing to build)**: Visitor → Lead → CRM → Opportunity → Buster → Follow-up → Trial → Customer → Roadmap → Release → Marketing, all confirmed real this pass. This phase is documentation of existing reality, not new work.

**Phase 2 (partial systems needing definition, not yet full builds)**: formalize Qualification as a distinct, defined stage (criteria, not yet specified); formalize Product Feedback as a distinct, tracked pipeline rather than informal founder judgment.

**Phase 3 (does not exist yet)**: Referral system. Not scoped further here — per this task's explicit instruction not to invent unfinished systems, Phase 3 is named but not designed in this pass.
