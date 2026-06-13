# Pre-Launch Audit-1C — Visual UX, Usability, Conversion & Cross-Device

**Date:** 2026-06-13 · **Checkpoint:** `acaf420` (after Builds 1–3). Method: code/markup
inspection. Live device/visual review is **manual-required** (no screenshots taken). Does not
re-run Audit-1A/1B. Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™).

## Executive verdict

**PASS WITH REQUIRED FIXES — 0 blockers.** Layout patterns are consistent (mobile-first
`max-w-md`/`max-w-2xl` containers, `glass` cards, `touch-target` classes, disabled-button
opacity, JSON-LD on public pages). The remaining items are minor accessibility/copy fixes and
a set of cross-device/visual checks that require human review on real devices.

## Route / page matrix (markup inspection)

| Surface | Container | Labels/a11y | CTA clarity | Notes |
|---|---|---|---|---|
| `/` homepage | responsive | semantic headings | strong free-assessment CTA | AI-coaching copy future-framed (Fix-2) |
| `/start` intake | `max-w` form | `Field` label per input | continue CTA | OK |
| `/assessment` | form | labelled inputs | progress + submit | OK |
| `/results` | `max-w` | — | "Unlock Full Roadmap" | clear next step |
| `/unlock`, checkout | — | — | pay CTA | manual Stripe test |
| `/report` | gated | — | roadmap/action links | "coming soon" footnotes (deferred) |
| `/dashboard` | `max-w` | icon cards | **many cards/CTAs** | CTA density — should-fix |
| `/foundation-builder` | `max-w-2xl` | stage buttons, note inputs (placeholder) | export + CTA | OK |
| `/growth` (new) | `max-w-2xl` | **inputs use placeholder, no `<label>`** | grouped actions + CTA | a11y should-fix |
| `/account/privacy` (new hub) | `max-w-2xl` | `sr-only` labels (auth + email) | sign-in / export / delete | OK; destructive actions confirmed |
| `/learn`, `/learn/[slug]`, `/trades` | `max-w-2xl` | semantic | single primary CTA + email capture | OK |
| email capture | form | `sr-only` labels | consent-gated submit | OK |

## Mobile findings (markup-level; verify on devices)

- Containers are width-capped and use responsive `grid-cols-2`; buttons carry `touch-target`.
- **Manual-required:** verify no horizontal overflow on the long `/report` and `/dashboard`
  pages at 360–390px; verify the Foundation Builder stage-button rows and the Growth Roadmap
  2-column number grid don't clip or crowd tap targets on small screens; verify export buttons
  work on mobile (CSV download / print window).

## Desktop findings

- Content is centered in narrow columns (mobile-first); on wide desktops the single-column
  layout leaves large side margins (acceptable for this product style). No code-evident
  desktop breakage. **Manual:** confirm long pages read well at desktop width.

## Accessibility findings

- **Should-fix:** `src/components/GrowthRoadmap.tsx` number/select inputs use `placeholder`
  only with no associated `<label>`/`sr-only` — add labels for screen-reader users.
- Good: `EmailCaptureForm` and `AccountAuthPanel` use `sr-only` labels; destructive actions
  (cloud delete, device clear) require explicit confirmation checkboxes; buttons expose
  `disabled` states; external links use `rel="noopener noreferrer"`; JSON-LD matches visible
  content; FAQ schema only where visible FAQs exist.
- **Manual:** keyboard focus-visibility, color-contrast ratios, and error-announcement
  (aria-live) need human/AT verification.

## Conversion findings

- Clear value ladder: free assessment → score/band → unlock paid roadmap. Results page has a
  single clear "Unlock Full Roadmap" CTA. Public learn/trades pages each own one primary intent
  with one email-capture form.
- **Should-fix:** `/dashboard` now shows several entry cards (Foundation Builder, Growth
  Roadmap, sync badges, account link, footer links) — ensure the single most important next
  action is visually dominant so first-time users aren't overwhelmed (Audit-1B echo).
- **Should-fix:** the free → paid boundary and the free post-score path into Foundation Builder
  / Growth Roadmap could be made more prominent on `/results`.

## Account / auth findings

- `/account/privacy` is now the account hub: `AccountAuthPanel` (magic-link, honest unavailable/
  link-sent/signed-in states, doesn't fake sign-in), then export/delete controls. Dashboard
  links to it ("Account & data (sign in to back up)"). Local-only use not forced.
- **Manual:** verify the magic-link round-trip and post-auth redirect on production Supabase.

## Growth-engine findings (Product-6)

- `/growth` renders diagnosis → grouped Do-now/next/later actions → channels → cross-sell →
  social rhythm → KPIs; honest "no guarantees" footer; local-first inputs. **Should-fix:** add
  input labels (a11y, above); consider a brief empty/first-run hint before any numbers entered
  (currently shows the form by default — acceptable).

## MetrixScore™ presentation findings

- Score/band shown on results/report/dashboard; categories explained; "not a credit score"
  stated (overview + privacy). Audit-1B/Build-3 noted the assessment is startup-biased
  (growth-stage needs discovered via Product-6) — a future scoring phase item, not a 1C visual
  blocker.

## Screenshots / manual review still required

Real-device responsive sweep (iOS/Android phones, tablet, desktop) of: homepage, intake,
assessment, results, unlock/checkout, report, dashboard, Foundation Builder, Growth Roadmap,
account hub, learn, trades, email capture, and all error/empty/blocked/complete states; keyboard
+ screen-reader pass; color-contrast check; human visual QA of the paid report.

## Classified findings

**BLOCKERS:** none.

**SHOULD FIX BEFORE LAUNCH:**
1. Add `<label>`/`sr-only` to Growth Roadmap inputs (a11y).
2. Make the dashboard's single primary next action visually dominant (reduce competing CTAs).
3. Strengthen the free → Foundation Builder / Growth path prominence on `/results`.
4. (Carried) resolve/replace paid-report "coming soon" sections.

**NICE TO HAVE:** desktop wide-layout polish; first-run hint on `/growth`; consistent icon-only
control aria-labels; motion-reduction respect.

## Pre-Launch Fix-3 plan

- **Accessibility:** Growth Roadmap input labels; aria-labels on icon-only controls; verify
  focus-visible + contrast.
- **Conversion/activation:** dashboard primary-CTA hierarchy; `/results` next-step prominence.
- **Report:** address "coming soon" paid sections.
- **Manual/visual:** the device sweep + screenshot QA (this audit's manual list).

## Final manual launch checklist

See `manual-launch-verification-checklist.md` (DB/RLS/migration `003`, Supabase auth round-trip,
Stripe test checkout → paid unlock, public email insert, export/delete, state-link click tests,
`RESEND_API_KEY` unset/consent reconciled, attorney review) **plus** the Audit-1C device/
accessibility sweep above.

## Fix-3 resolution (2026-06-13)

- **(1) Growth Roadmap a11y → RESOLVED.** Added `aria-label` to the stage `<select>` and all 8
  number inputs; checkboxes were already wrapped in `<label>`. Touch targets unchanged.
- **(2) Dashboard CTA hierarchy → RESOLVED.** Added one dominant, full-width primary CTA derived
  from reliable state: no result → "Start Assessment" (existing); foundation incomplete →
  "Continue your business foundation" → `/foundation-builder`; foundation complete **with real
  Product-6 progress** → "Continue your customer growth roadmap" → `/growth`; foundation complete
  **without** growth progress → "Open your customer growth roadmap" → `/growth` (we do not infer
  "growth-stage" from a completed Foundation checklist alone). Existing cards/links retained as
  secondary; sign-in not made primary.
- **(3) `/results` next-path prominence → RESOLVED.** Added a prominent "Your next step (free)"
  section after the score explanation: Foundation (primary) + Growth (secondary), each with a
  brief why. No scoring/historical-results change.
- **(4) Paid-report "coming soon" → RESOLVED.** Removed the dead "Unlock the Full Execution
  Module" button, the secondary 🔒 preview box, and the three "coming soon" footnotes; relabeled
  the remaining 🔒 preview to neutral "What deeper execution work covers" (no purchase CTA, no
  timing promise, no waitlist/fake preview). Report no longer invites a purchase it can't deliver.

**Status:** all 4 should-fix items resolved. Remaining = the manual device/accessibility sweep +
the launch checklist. Next: manual verification → **Launch Readiness Final Pass**.
