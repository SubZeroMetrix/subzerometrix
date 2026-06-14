# SubZeroMetrix — Curated 108 Link Verification & Activation Audit (Wave 7 Build A)

> **Purpose.** Records the automated liveness test of all 108 curated launch URLs, the activation
> decision, the outbound-path audit, the provider-traffic measurement decision, and the legal/
> compliance stop-gate outcome. Machine-readable evidence: `src/lib/metrix/resourceLinkAudit.ts`
> (`RESOURCE_LINK_AUDIT`). Test-enforced by `wave7-builda-link-activation.test.ts`.

- **Branch:** `feature/metrix-wave7-full-site-ux-discovery`
- **Catalog state after Build A:** published ecosystem catalog **EMPTY**; public-eligible **0**;
  activated **0**; resource flags **default OFF**. The 2,063-item backlog was **not** imported.

---

## A. Link testing (all 108)

Read-only HTTP liveness only — bounded concurrency (6), 9s timeout, 1 retry on network/5xx,
descriptive user agent, manual redirect follow (≤6 hops). **No** auth/CAPTCHA bypass, **no** page
bodies retained (only `<title>`), **no** cookies/auth headers logged, blocked providers not hammered.

Per record (in `RESOURCE_LINK_AUDIT`): workbookResourceId, canonicalResourceId, provider identity,
original URL, final resolved URL, normalized + final domain, HTTP status, redirect count, HTTPS
result, response time, content type, page title (safely derived), tested timestamp, classification,
failure reason, manual-review flag.

### Classification (each of 108 classified exactly once)
| Classification | Count |
| --- | ---: |
| healthy | 77 |
| healthy_with_redirect | 11 |
| blocked_or_rate_limited (403/429) | 14 |
| permanent_failure (404/410) | 4 |
| domain_mismatch | 2 |
| temporary_failure / authentication_required / unexpected_content / manual_review_required | 0 |
| **Total** | **108** |

- **Healthy (incl. redirect): 88 — all HTTPS.**
- **Blocked/manual review: 16** (14 × 403/429 + 2 domain_mismatch). Per the rule, 401/403/429 are
  **not** classified as broken — automation cannot safely establish identity, so they are held.
- **Permanent failures (404): 4** — `VER-008`, `VER-013` (Ohio CILB), `VER-041`, `VER-076`.
- **Domain mismatch: 2** — `VER-063` → `fieldedge.com`, `VER-100` → `quo.com`.

---

## B. Activation decision — **HELD at the legal/compliance + architectural gate**

**No record was activated. Zero public activations.** Among the 88 healthy records, **16** are
free/educational (government / nonprofit / official / association / standards) — the natural launch
candidates — and **72** are commercial.

Activation is **held** for the following reasons:

1. **Legal/compliance stop gate (Section H).** Publishing a live external resource directory and
   measuring provider traffic materially involves advertising/endorsement framing, consumer
   protection (the set includes regulated **banking / insurance / lending / legal-formation**
   categories), professional-licensing / unauthorized-practice (licensing-authority listings),
   privacy law (the measurement layer), data retention/export, and accessibility. These require
   **authoritative-source verification or qualified legal review** — they are not engineering
   determinations. Unresolved legal uncertainty must remain blocked.
2. **Non-consented measurement is unresolved** (Section D / risk register) — a core part of the
   stated business objective (measuring traffic) cannot be implemented for non-consented users
   without clearing the privacy gate.
3. **Architectural safety invariant.** The published catalog being **empty** is enforced across
   four test suites as a deliberate guardrail; flipping it is a reviewed, owner-gated step.
4. **Stop condition** "any failed or uncertain resource becomes active" — 20 records (4 fail + 14
   blocked + 2 mismatch) are plainly not activatable, and the 88 healthy still require the legal
   clearance above.

**Prepared launch set (held).** The 16 free/educational healthy records are the recommended first
candidates once legal review clears publication and the owner authorizes flipping the catalog. On
activation each must (per Section B) receive `verificationStatus = live_link_confirmed`,
`publicationStatus = approved_for_publication`, `active = true`, `launchEligible = true`, preserving
final URL, result, testedAt, provenance, limitations, and a truthful **non-commercial** relationship
status — described **only** as a listed educational resource (never endorsed/preferred/affiliated),
with "use another provider" retained. The `publicationApproved()` gate (fail-closed on missing
disclosure) added in this build is the gate that step must use.

Nothing in this audit changed the CP5 import map: all 108 remain `publicationStatus = held_for_review`.

---

## C. Outbound-path audit

| Surface | Outbound mechanism | Verdict |
| --- | --- | --- |
| New directory card — primary action | `ResourceOutboundLink` → `/resources/go/<id>` (canonical, server re-gated, consent-aware) | ✅ canonical routing |
| New directory card — official/free alternative | direct `<a rel="noopener noreferrer" target="_blank">` to the free/official authority | ⚠️ **documented exception** — a direct link to the free/official alternative authority (a different canonical/regulatory destination), not a measured commercial placement |
| Wave 5 recommendation cards | raw `officialUrl` anchor + existing `/api/track-click` sink + consent-gated funnel | ⚠️ **documented limitation** — predates the Wave 6 redirect; migrating to `/resources/go` is **blocked on ecosystem-catalog population** (held). The existing `/api/track-click` is the established canonical outbound sink (not duplicated) |
| Legacy `/resources` fallback (flag OFF) | existing raw external links | out of scope — unchanged pre-existing production surface |

No commercial destination in the **new** directory bypasses canonical routing. The two documented
exceptions are (a) free/official-alternative direct links and (b) the pre-existing Wave 5
recommendation surface whose redirect migration is gated on catalog population.

---

## D. Provider-traffic measurement

**Consented analytics** (existing canonical funnel, CP7): emits only approved fields — resourceId,
vendorId, category, placement, originatingRoute (query stripped), trade, lifecycleStage,
priorityCategory, relationshipStatus, disclosureRequired, timestamp. Never raw answers, email,
notes, financial, licensing, free-text evidence, profile snapshots, or unnecessary identifiers.
A click is **not** a lead/customer/sale; provider selection is **not** a transaction; unreported
outcomes are **not** revenue — these are kept as separate, voluntarily-reported signals.

**Non-consented aggregate measurement: BLOCKED at the legal gate.** No non-consented click counter
was implemented. Navigation works without analytics consent (no event fires). Reports therefore
cover **consented (tracked) clicks only** and must be **labeled as tracked traffic, not total
traffic.** The measurement gap is recorded in `docs/LAUNCH-RISK-REGISTER.md`. No second consent or
analytics system was created.

---

## E. Disclosure gate

`publicationApproved(r) = isPublicEligible(r) && disclosureRenderable(r)` — **fail-closed**: a record
that requires a disclosure but has no renderable disclosure text is **not** publication-approved.
This is separate from `isPublicEligible` so eligibility stays commercial-neutral. At launch all
candidate resources have a truthful non-commercial status; the gate guarantees future compensated
relationships cannot publish without a rendering disclosure.

---

## F. Feedback export/delete

Resource feedback is **device-local** (`szm_resource_feedback`): export representation =
`getResourceFeedback()`; delete/reset = `clearResourceFeedback()`. Preservation inventory:
`localCovered: true`, `cloudCovered: false`. Feedback **does not** modify MetrixScore, generate
testimonials, or infer provider outcomes (test-enforced). **Interim limitation:** no cloud sync
yet; the planned cloud-sync destination is preserved for a later wave.

---

## G/H. Flags & legal stop gate

Resource flags (`verified_launch_resources`, `expanded_resource_catalog`,
`tracked_resource_redirects`, `public_resource_directory`) remain **default OFF**. No production
configuration was modified; nothing was deployed publicly. Unresolved legal items (non-consented
measurement; publication of regulated/commercial listings) remain **blocked pending qualified legal
review** — see the launch-risk register. This document is informational and is **not** legal advice.
