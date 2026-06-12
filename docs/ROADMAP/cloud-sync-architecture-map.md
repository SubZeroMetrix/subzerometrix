# Cloud Sync Architecture Map (Account-2A)

**Status:** Architecture / contracts only. **No cloud sync is wired. No migration created.**
Pairs with `src/lib/syncContracts.ts` (the developer-facing contract) and
`cloud-sync-migration-plan.md` (the build order). Part of **Account-2 — Cloud Sync
Activation Layer** (`account-cloud-sync-activation-layer.md`).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™**.

> **Honesty rule:** the sync-status labels below (incl. "Synced to your account") are a
> future product standard. They may only be **shown** after a real, confirmed cloud
> write. Today every entity is **Saved on this device**.

## Sync entity map

| Entity | Local key | Owning feature | Record type | Free text? | May contain PII? | Future Supabase table | Sync priority | Privacy risk | Status label needed | Local fallback rule |
|---|---|---|---|---|---|---|---|---|---|---|
| Assessment history | `szm_metrix_profile` | MetrixProfile™ / assessment (`metrixStorage`) | `MetrixProfileSnapshot` | No | No | `cloud_sync_assessment_history` *(002, schema+RLS only)* | High | Low | Yes | Local-first; cloud is additive backup |
| MetrixScore™ history | `szm_metrix_history` | MetrixScore™ history (`metrixHistory`) | `MetrixScoreSnapshot[]` + `ReassessmentEvent[]` | No | No | `cloud_sync_score_history` *(002)* | High | Low | Yes | Local stays authoritative until confirmed write |
| Roadmap action progress | `szm_path_complete` | Roadmap progress (`roadmapProgress`) | `string[]` → `ActionProgressSnapshot` | No | No | `cloud_sync_roadmap_action_progress` *(002)* | High | Low | Yes | Written locally first; upsert by `local_id` |
| KPI entries | `szm_metrix_history` | Manual KPI tracking (`kpiProgress`) | `ManualKpiSnapshot` | Yes *(note)* | No | `cloud_sync_kpi_entries` *(002)* | High | Low | Yes | Only user-entered numbers + optional note |
| Customer feedback / proof | `szm_customer_feedback` | Customer proof (`customerProof`) | `CustomerFeedbackRecord` | **Yes** *(comment)* | **Yes** *(free text)* | `cloud_sync_customer_feedback` *(002)* | Medium | **Moderate** | Yes | Local-first; never public; consent flags travel with it |
| Partner interest | `szm_partner_interest` | Partner distribution (`partnerDistribution`) | `PartnerInterestSubmission` | **Yes** *(note)* | **Yes** *(name/company/email/website)* | `cloud_sync_partner_interest` *(002)* | Low *(defer)* | **High** | Yes | Local-first; explicit consent required before sync |
| Growth / activation events | `szm_growth_events` | Acquisition analytics (`growthAnalytics`) | `GrowthActivationRecord` | No | No *(non-PII by design)* | `cloud_sync_growth_events` *(002, non-PII)* | Medium | Low | No *(background)* | Device-local; only non-PII aggregate may sync |
| Foundation Builder progress | *(not built)* | Guided Foundation Builder (Product-5) | `FoundationChecklistItem` *(future)* | Yes *(notes)* | No | `cloud_sync_foundation_builder_progress` *(002)* | High | Low | Yes | Local fallback OK, **not** final destination |
| Vendor / tool tracker | *(not built)* | Foundation Builder tracker *(future)* | `VendorToolItem` *(future)* | Yes *(notes)* | No | `cloud_sync_vendor_tool_tracker` *(002)* | Medium | Low | Yes | Local-first; **never** store secrets/credentials |
| Launch readiness progress | *(not built)* | Foundation Builder launch *(future)* | `LaunchReadinessItem` *(future)* | Yes *(notes)* | No | `cloud_sync_launch_readiness_progress` *(002)* | Medium | Low | Yes | Local-first; back up to account when wired |

### Not sync targets (intentionally excluded)

- `szm_score`, `szm_intake`, `szm_assessment_id` — latest-result conveniences, superseded
  by the history rows above; not synced as their own records.
- `szm_install_dismissed`, `szm_proof_dismissed`, `szm_path_complete` UI flags that are
  pure device-session state.
- Reminder preferences sync via the existing `metrix_reminder_preferences` table (001) and
  are tracked in `account-sync-schema-plan.md`, not duplicated here.

## Status labels (the four-label standard)

| Code (`SyncStatus`) | Label | When |
|---|---|---|
| `saved_on_device` | **Saved on this device** | Local only; no confirmed cloud write (today) |
| `synced_to_account` | **Synced to your account** | ONLY after a confirmed successful write |
| `sync_unavailable` | **Sync unavailable** | Supabase off, offline, or write failed |
| `sign_in_to_back_up` | **Sign in to back up progress** | Signed-out with local data present |

## Privacy / free-text / PII summary

- **No PII, no free text** → safe to sync first: assessment history, MetrixScore™ history,
  roadmap action progress. (Tables created in migration `002`, schema + RLS only.)
- **Free text, no PII** → low risk: KPI note, Foundation Builder / vendor / launch notes.
- **Free text + possible PII** → **privacy review required before sync**: customer
  feedback (`comment`), partner interest (`name`/`company`/`email`/`website`/`note`).
- **Analytics** → must stay **non-PII and aggregate**; privacy/non-invasive review before
  any sync; never becomes third-party-style tracking.
- **Never synced:** secrets, credentials, passwords, full URLs/query strings, raw referrer
  URLs. Vendor/tool tracker stores references only — never login material.

## What already exists vs. what is new

- **Account-2B tables (migration `002`, schema + RLS only — no writer wired):** all ten
  `cloud_sync_*` tables above. This is the unified, payload-first activation-layer schema.
- **Earlier structured schema (migration `001` + `metrixCloudSync.ts`, not applied/wired):**
  the Mega-Phase 3C `metrix_*` tables (profiles, score snapshots, action progress, KPI,
  reassessments, reminder preferences). Kept as-is; reconciling the 3C writer with the
  `cloud_sync_*` schema is a later wiring phase (2D onward) — **no writer is wired now.**
