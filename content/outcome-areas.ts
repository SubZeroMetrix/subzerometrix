// Single source of truth for the 8 real Metrix Command Center outcome
// areas -- used by both the homepage "What Metrix Covers" section and
// the dedicated /features/[slug] SEO landing pages, so the two never
// drift out of sync. Content here must match the product exactly as it
// actually works (see CLAUDE.md -- no unsubstantiated claims); this was
// the pre-existing homepage copy, only relocated, not rewritten.
export interface OutcomeArea {
  slug: string
  title: string
  problem: string
  identifies: string
  nextStep: string
  approval: string
  /** Extra grounding paragraph shown only on the dedicated feature page, not the homepage card. */
  longDescription: string
}

export const OUTCOME_AREAS: OutcomeArea[] = [
  {
    slug: 'lead-follow-up',
    title: 'Lead Follow-Up',
    problem: 'New leads go days without a response and nobody notices until the lead is gone.',
    identifies: 'Leads waiting past a reasonable response window.',
    nextStep: 'Review the recommended follow-up and approve it, or handle it yourself.',
    approval: 'Approval required before any customer contact.',
    longDescription:
      'A lead that goes quiet for too long is rarely a training problem -- it is a visibility problem. Nobody can act on a follow-up they do not know is overdue. Metrix tracks how long a new lead has actually been waiting, against your own typical response pattern, and surfaces the ones that need attention before the opportunity is gone.',
  },
  {
    slug: 'estimate-recovery',
    title: 'Estimate Recovery',
    problem: 'A quote goes out and, without a deliberate decision, quietly becomes a lost sale.',
    identifies: 'Estimates aging past your typical close window.',
    nextStep: 'Approve a recommended follow-up on the estimates worth chasing.',
    approval: 'Approval required before any customer contact.',
    longDescription:
      'An estimate that sits open for two weeks is functionally a lost sale, even though it is still technically "open" in the system. Metrix identifies which open estimates have aged past your own typical close window and recommends who is worth a follow-up, so recoverable revenue does not just quietly expire.',
  },
  {
    slug: 'customer-reactivation',
    title: 'Customer Reactivation',
    problem: 'A previously active customer stops calling and nobody flags the change.',
    identifies: 'Customers whose activity has gone quiet relative to their history.',
    nextStep: 'Decide whether a reactivation outreach makes sense, then approve it.',
    approval: 'Approval required before any customer contact.',
    longDescription:
      'A once-regular customer going quiet is easy to miss until a competitor is already in their driveway. Metrix compares a customer\'s recent activity against their own history to flag the ones who have genuinely gone quiet, so reactivation is a deliberate decision, not a coincidence.',
  },
  {
    slug: 'reviews-and-referrals',
    title: 'Reviews and Referrals',
    problem: 'A completed job is a review/referral opportunity that expires the longer it sits unaddressed.',
    identifies: 'Recently completed jobs that haven\'t been asked for a review or referral yet.',
    nextStep: 'Approve the recommended ask while the experience is still fresh.',
    approval: 'Approval required before any customer contact.',
    longDescription:
      'A satisfied customer rarely leaves a review unprompted, and the right moment to ask closes fast. Metrix flags recently completed jobs that have not yet been asked for a review or referral, so the ask happens while the experience is still fresh instead of relying on it happening organically.',
  },
  {
    slug: 'daily-priorities',
    title: 'Daily Priorities',
    problem: 'Without one place to look, the owner is guessing what\'s actually urgent today.',
    identifies: 'The items across your business that most need attention right now.',
    nextStep: 'Start the day with a real list, not a guess.',
    approval: 'No approval needed to view -- approval still required for any resulting customer action.',
    longDescription:
      'With everything scattered across texts, notebooks, and memory, the owner is left guessing what deserves attention today instead of knowing. Metrix pulls the real state of leads, estimates, and follow-ups into one prioritized list, so the day starts with an actual picture, not a guess.',
  },
  {
    slug: 'customer-history',
    title: 'Customer History',
    problem: 'Context about a customer is scattered across notes, memory, and old messages.',
    identifies: 'A single record per customer and property, built as the relationship happens.',
    nextStep: 'Reference real history instead of relying on memory.',
    approval: 'No approval needed to view.',
    longDescription:
      'Customer context scattered across notes, memory, and old text threads means every conversation starts from scratch. Metrix builds a single record per customer and property as the relationship actually happens, so the full history is there to reference instead of relying on whoever remembers the last job.',
  },
  {
    slug: 'team-accountability',
    title: 'Team Accountability',
    problem: 'Without visibility, it\'s not fair to hold anyone accountable to numbers nobody can see.',
    identifies: 'What\'s open, what\'s overdue, and what\'s been completed, visible in one place.',
    nextStep: 'Use real visibility to manage the team, not memory or guesswork.',
    approval: 'No approval needed to view.',
    longDescription:
      'It is not fair to hold a team accountable to numbers nobody can actually see. Metrix makes what is open, what is overdue, and what has been completed visible in one place, so team accountability is based on real, shared visibility instead of memory or guesswork.',
  },
  {
    slug: 'business-visibility',
    title: 'Business Visibility',
    problem: 'Most owners can\'t see the true state of their pipeline without asking someone.',
    identifies: 'A real, current picture of leads, estimates, jobs, and follow-ups.',
    nextStep: 'Check the state of the business without a status meeting.',
    approval: 'No approval needed to view.',
    longDescription:
      'Most owners cannot see the true state of their own pipeline without asking someone else to check. Metrix maintains a real, current picture of leads, estimates, jobs, and follow-ups, so checking the state of the business does not require a status meeting.',
  },
]
