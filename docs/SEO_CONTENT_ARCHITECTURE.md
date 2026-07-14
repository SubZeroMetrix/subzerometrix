# SEO Content Architecture

*Governed by [`PRODUCT_PHILOSOPHY.md`](./PRODUCT_PHILOSOPHY.md) (Customer Zero, who we serve) and [`BRAND_CONSTITUTION.md`](./BRAND_CONSTITUTION.md) (claims policy — every content page below must describe only real, shipped capability; no fabricated stats, no invented case studies). Planning document only — no pages built. See [`CONTENT_CALENDAR.md`](./CONTENT_CALENDAR.md), [`AI_DISCOVERABILITY_AUDIT.md`](./AI_DISCOVERABILITY_AUDIT.md), [`LINK_AND_DISTRIBUTION_STRATEGY.md`](./LINK_AND_DISTRIBUTION_STRATEGY.md), and [`TRAFFIC_ENGINE_ROADMAP.md`](./TRAFFIC_ENGINE_ROADMAP.md) for the rest of this system.*

## Site Structure Today (real, verified)

`www.subzerometrix.com` currently serves two things: the Metrix Command Center marketing homepage (`/`) and an existing affiliate software-comparison platform (`/tools`, `/compare`, `/reviews`, `/guides`, `/tool-finder`). This architecture proposes a **third content area** — a contractor-focused resource/authority section — that shares the domain's existing authority without competing with either existing area's intent.

## URL Hierarchy (proposed, not built)

```
/resources/                          -- resource center hub
/resources/hvac/                     -- pillar: HVAC
/resources/electrical/               -- pillar: Electrical
/resources/plumbing/                 -- pillar: Plumbing
/resources/mechanical/               -- pillar: Mechanical
/resources/facility-management/      -- pillar: Facility Management
/resources/commercial-service/       -- pillar: Commercial Service
/resources/business-operations/      -- pillar: Business Operations
/resources/ai-for-contractors/       -- pillar: AI for Contractors
/resources/guides/[slug]             -- supporting guide pages
/resources/calculators/[slug]        -- interactive tools
/resources/checklists/[slug]         -- downloadable checklists
/resources/templates/[slug]          -- downloadable templates
```

Each pillar (`/resources/{topic}/`) is a hub page linking out to its own supporting pages (guides/calculators/checklists/templates tagged to that topic) and back to the homepage's relevant product section (e.g., HVAC pillar links to the homepage's Revenue Recovery and Customer 360 CRM sections).

## Pillar Pages (8, one per contractor content plan topic)

| Pillar | Search Intent | Primary Audience |
|---|---|---|
| HVAC | Informational → commercial | HVAC business owners/operators — the founder's own direct 24+ year background (see `FOUNDER_PROFILE.md`), the single strongest authenticity/E-E-A-T asset available |
| Electrical | Informational → commercial | Electrical contractors, adjacent trade |
| Plumbing | Informational → commercial | Plumbing contractors, adjacent trade |
| Mechanical | Informational → commercial | Mechanical contractors — directly adjacent to founder's facilities/mechanical background |
| Facility Management | Informational → commercial | Multi-site facilities managers — directly matches founder's Palo Alto Inc./Coastal Mechanical background |
| Commercial Service | Informational → commercial | Commercial service business owners across trades |
| Business Operations | Informational → transactional | Any trade business owner evaluating operational software |
| AI for Contractors | Informational → transactional | The highest-intent cluster — directly connects to the product itself |

## Topical Clusters (supporting pages per pillar)

Each pillar supports 6-10 topic-cluster pages. Representative examples (not exhaustive — full list belongs in `CONTENT_CALENDAR.md`'s topic backlog):
- **HVAC**: seasonal maintenance scheduling, missed-follow-up cost calculator, technician dispatch basics, HVAC customer retention.
- **Facility Management**: multi-site PM program structure, capital improvement planning basics, BAS/BMS 101 (real founder expertise).
- **AI for Contractors**: what "governed AI" means in plain language, human-approval AI vs. autonomous AI, AI adoption checklist for trade businesses.
- **Business Operations**: CRM basics for service businesses, revenue-recovery fundamentals, follow-up process design.

## Internal Linking Map

- Every pillar page links to: (a) 100% of its own cluster pages, (b) the homepage's most relevant product section anchor (`#features`, `#buster`, `#trust`), (c) the pricing section (`#pricing`).
- Every cluster page links to: (a) its parent pillar, (b) 2-3 related cluster pages across pillars where genuinely relevant (e.g., an HVAC seasonal-maintenance guide links to the Business Operations follow-up-process guide), (c) the homepage lead-capture form.
- The homepage's footer gains a "Resources" column once this section exists (not yet added — no pages built this pass).
- No orphan pages: every new page must be reachable from at least the resource hub and one pillar.

## Keyword Intent Map

| Intent Stage | Content Type | Example |
|---|---|---|
| Awareness (informational) | Pillar + top-of-cluster guides | "What is preventive maintenance scheduling" |
| Consideration (informational/commercial) | Mid-cluster guides, calculators, checklists | "How much does a missed follow-up cost my HVAC business" |
| Decision (commercial/transactional) | Bottom-of-cluster comparison/ROI content, templates | "Governed AI vs. autonomous AI for contractors" |
| Product (transactional) | Homepage sections, pricing, trial CTA | Existing homepage — untouched by this plan |

## Search Funnel

Awareness (pillar/cluster content, organic + AI search) → Consideration (calculators/checklists/templates capture engagement and build trust) → Decision (comparison/ROI content connects the real problem to the real product) → Product (homepage `#trust`, `#pricing`, lead form, trial CTA — all already built, untouched by this plan).
