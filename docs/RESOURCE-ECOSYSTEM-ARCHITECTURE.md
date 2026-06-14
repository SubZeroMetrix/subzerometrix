# SubZeroMetrix — Contractor Business Resource Ecosystem Architecture (Wave 6)

> **Purpose.** Define the architecture for the full Contractor Business Resource Ecosystem
> **without publishing hundreds of unverified providers.** Wave 6 ships the types, verification
> model, redirect pattern, and directory/recommendation contracts. The public launch set
> (~50–100 verified records) and the directory UI are **Wave 7** data + UI tasks.

- **Ecosystem version:** 1
- **Code:** `src/lib/metrix/resourceEcosystem.ts`, `resourceVerification.ts`,
  `resourceRedirects.ts`, `resourceDirectory.ts`, `ecosystemCatalog.ts`
- **Built on** the Wave 5 canonical resource model (`resourceTypes.ts`, `resourceRegistry.ts`) —
  **extends, never duplicates.**

---

## 1. Two-tier strategy

- The full ecosystem is the **master internal catalog**.
- **Only `verified` + `active` records are publicly clickable** (recommendations, directory,
  redirects). Everything else stays internal.
- The first public launch targets **~50–100 verified, high-value resources.**
- Free **government / nonprofit / association / direct-provider** alternatives are always
  preserved, and users can **always complete an action with a provider of their choice**.

## 2. Master record (`EcosystemResource`)

`EcosystemResource extends CanonicalResource` (Wave 5) with four metadata blocks:

- **`review`** — `verificationStatus`, `verificationOwner`, `verificationNotes`,
  `reviewedDate`, `nextReviewDate`, `verificationPriority`.
- **`launch`** — `launchEligible`, `launchCategory`, `launchSequence`.
- **`relationship`** — `referralStatus`, `resellerStatus`, `integrationStatus`
  (software/API/embedded), `compensationDisclosure`. **Disclosure + ops metadata only.**
- **`operations`** — `businessNeed`, `eligibility`, `limitations`, `regionsServed`,
  `lifecycleStagesServed`, `supportContact`, `officialAlternativeUrl`,
  `useAnotherProviderOption` (always `true`).

The Wave 5 base already carries `resourceId`, `vendorId`, `category`, `tradeApplicability`,
`stateApplicability`, `officialUrl`/`destinationPath`, commercial status, `provenance`,
`active`/`stale`/`broken`, and `disclosureText`.

`defaultEcosystemExtension()` lifts any Wave 5 record into the ecosystem shape with
`verificationStatus: 'draft'` — **unverified by default; never auto-`verified`.**

## 3. Verification lifecycle

```
draft → pending_verification → verified
                  ↑                 ↓
            needs_review ← stale / broken / inactive / archived
```

- **Public-eligible** = `verified` **and** `active` **and** not `broken` **and** not `stale`
  (`evaluatePublicEligibility` / `isPublicEligible`).
- A record **cannot be marked verified without evidence** — a reviewer, notes, and a reviewed
  date (`hasVerificationEvidence`). *Do not invent verification results.*
- **Commercial neutrality (test-enforced):** eligibility reads **zero** commercial fields. Two
  fit-identical records that differ only in relationship/affiliate/referral/reseller/sponsorship
  status have **identical** eligibility.

## 4. Category architecture

`ECOSYSTEM_CATEGORIES` (29) covers the full taxonomy: banking; business credit & expense;
insurance & bonding; pricing & estimating; CRM/proposals/sales/financing; HVAC / electrical /
plumbing supply; construction & roofing materials; tools/safety/industrial; fleet/fuel/vehicles/
equipment; accounting/bookkeeping/payroll; payments & merchant; lending/SBA/finance; legal/
formation/licensing/compliance; hiring & workforce; training & certifications; marketing/websites/
local search/content; lead-gen/reviews/acquisition; phones & communication; scheduling/dispatch/
project/document; inventory/warehouse/purchasing; cybersecurity; employee benefits & retention;
uniforms/printing/signs/branding; associations & communities; government & free resources;
continuity/disaster/succession; specialty contractor. **No bulk publication in this wave.**

## 5. Verified launch set

`launchEligible` + `launchCategory` (`LaunchCategory`) + `launchSequence` + `verificationPriority`
support curating ~50–100 records, prioritizing: official government/licensing authorities; free
government/nonprofit; formation/compliance; banking; accounting/bookkeeping; insurance/bonding;
field-service software; pricing/estimating; trade suppliers; marketing/acquisition; hiring/payroll;
training/certifications. `launchReadyResources()` returns only those that are **also**
public-eligible.

## 6. Tracked outbound redirects

Stable pattern: **`/resources/go/[resourceId]`** (`buildRedirectPath`, `resolveRedirect`,
route `src/app/resources/go/[resourceId]/route.ts`).

- Resolves **only verified + active** destinations; stale/broken/inactive/unverified **fail safe**
  (404 — never a redirect to an unverified provider).
- **Privacy-safe payload (allow-list, test-enforced):** `resourceId`, `vendorId`, `placement`,
  `originatingRoute` (query string stripped), `trade`, `lifecycleStage`, `priorityCategory`,
  `relationshipStatus`, `disclosureRequired`. **Never** raw answers, emails, notes, financial,
  licensing, or profile data — and none of it ever appears in the URL.
- Outbound analytics emit **only when host consent is granted.**
- **Regulatory / licensing authorities** get a direct official link even when not commercially
  verified (reference data, not a placement).
- **Disclosures** shown when required, but disclosure **never gates** resolution.
- **Dormant in Wave 6:** flag `tracked_resource_redirects` defaults OFF **and** the published
  catalog (`getPublishedEcosystemCatalog()`) is **empty** — two independent guards.

## 7. Directory vs. Recommendations (two distinct surfaces)

**A. Resource Directory** (`buildDirectoryView` + `DirectoryEntry`): browse the **verified** catalog
by category / trade / region / lifecycle stage / business need / relationship type; shows verified
status, reviewed date, disclosures, official/free alternative, and "use another provider."

**B. Recommended Resources** (`toRecommendationCard` + `RecommendationCardView`): **bounded,
profile-aware** cards built from the existing `deriveResourceRecommendations` adapter (Wave 5) —
**not a second ranking engine.** One official/free option where relevant, a small set of provider
options, the action set (`view_more_options`, `already_completed`, `not_relevant`,
`using_another_provider`, `broken_or_outdated`), and disclosures. **No link-dump.** Both surfaces
return **only public-eligible** records.

> Wave 6 ships these as **contracts**. The full public directory UI is **Wave 7**.

## 8. Canonical presentation adapter

`buildCanonicalPresentation` (`canonicalPresentation.ts`) exposes one presentation-safe view of
MetrixScore, Metrix Priority, actions/progress, confidence/freshness, lifecycle, trade, licensing,
foundation/growth summaries, recommendations, sync state, disclosures, and unsupported/incomplete
states — by **reading** the canonical snapshot (via `readModel`) and **passing through** already-
derived intelligence. **It recomputes nothing** (test: presentation score === `toMetrixScore`).

## 9. Invariants (test-enforced)

- No provider is published without evidence-backed verification.
- No commercial relationship affects eligibility, ranking, licensing guidance, pathway ordering,
  or recommendation relevance.
- Free/official alternatives are preserved; provider choice is never forced.
- No PII in redirect URLs or analytics.
- The published catalog is **empty** at Wave 6 close.
