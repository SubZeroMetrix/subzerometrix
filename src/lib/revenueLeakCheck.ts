export type LeakCategoryId =
  | 'missed-calls'
  | 'stalled-estimates'
  | 'dormant-customers'
  | 'callback-cost'
  | 'follow-up-gaps'
  | 'owner-dependency'

export interface LeakCategory {
  id: LeakCategoryId
  title: string
  whatItMeans: string
  firstAction: string
}

export const LEAK_CATEGORIES: Record<LeakCategoryId, LeakCategory> = {
  'missed-calls': {
    id: 'missed-calls',
    title: 'Missed inbound calls',
    whatItMeans: 'Calls that go to voicemail during business hours are one of the most direct revenue leaks in a service business — most callers don\'t leave a message and just call the next name on the list.',
    firstAction: 'Pull your call log for the last 30 days and count how many calls during business hours weren\'t answered live. That number, multiplied by your average job value and close rate, is your rough exposure.',
  },
  'stalled-estimates': {
    id: 'stalled-estimates',
    title: 'Stalled estimates',
    whatItMeans: 'An estimate sitting with no follow-up and no won/lost status is neither closed nor actively being pursued — it\'s just aging out of anyone\'s attention.',
    firstAction: 'List every open estimate older than 14 days. Contact each one this week and log a real outcome — won, lost, or a specific next follow-up date.',
  },
  'dormant-customers': {
    id: 'dormant-customers',
    title: 'Dormant-customer reactivation',
    whatItMeans: 'A past customer who hasn\'t been contacted in a long time is quietly at risk of using a competitor next time they need work — without anyone noticing until it\'s too late.',
    firstAction: 'Pull customers with no activity in the last 12+ months and identify the ones due for maintenance, replacement, or a seasonal check-in. Reach out to the top 20.',
  },
  'callback-cost': {
    id: 'callback-cost',
    title: 'Callback and rework cost',
    whatItMeans: 'A callback tied to a job you already completed carries labor, travel, and materials cost that was never priced into that job — and it displaces work you could have billed instead.',
    firstAction: 'Track callbacks in dollars, not just count, for 30 days: labor, travel, materials given free, and the billable work the visit displaced.',
  },
  'follow-up-gaps': {
    id: 'follow-up-gaps',
    title: 'Follow-up gaps',
    whatItMeans: 'When leads, quotes, and past customers live across texts, a notebook, and memory instead of one tracked system, things fall through by default — not by exception.',
    firstAction: 'Pick one place (even a spreadsheet) and move every open lead and quote into it this week. The system matters less than having exactly one.',
  },
  'owner-dependency': {
    id: 'owner-dependency',
    title: 'Owner-dependent processes',
    whatItMeans: 'Revenue that only happens when the owner personally remembers to make it happen doesn\'t scale, and it\'s invisible until the owner is unavailable for a day.',
    firstAction: 'Pick the one revenue-generating task only you currently do consistently, and write down the exact steps — the first step toward someone else being able to do it.',
  },
}

export interface Question {
  id: string
  category: LeakCategoryId
  text: string
}

export const QUESTIONS: Question[] = [
  { id: 'q1', category: 'missed-calls', text: 'Do you know how many inbound calls went unanswered during business hours in the last 30 days?' },
  { id: 'q2', category: 'missed-calls', text: 'Does every missed call get a callback the same day?' },
  { id: 'q3', category: 'stalled-estimates', text: 'Do all open estimates have a clear won/lost status, or do some just sit indefinitely?' },
  { id: 'q4', category: 'stalled-estimates', text: 'Is there a set follow-up schedule for estimates that haven\'t been answered?' },
  { id: 'q5', category: 'dormant-customers', text: 'Do you have a list of customers who haven\'t used you in 12+ months?' },
  { id: 'q6', category: 'dormant-customers', text: 'Does anyone reach out to past customers who are due for repeat work?' },
  { id: 'q7', category: 'callback-cost', text: 'Do you track callback cost in dollars, not just as a count?' },
  { id: 'q8', category: 'follow-up-gaps', text: 'Do all open leads and quotes live in one place, rather than spread across texts, notes, and memory?' },
  { id: 'q9', category: 'owner-dependency', text: 'Could someone else run new-lead follow-up for a week if you were unavailable?' },
]

export type Answer = 'yes' | 'no' | 'unsure'

export interface LeakCheckResult {
  primaryCategory: LeakCategory
  verifiedGapQuestions: string[]
  unknownQuestions: string[]
}

/**
 * Selects the category with the most "no" (verified gap) answers. Ties are
 * broken by question order (earlier category wins) -- deterministic, not
 * an opaque score. "unsure" answers are surfaced separately as UNKNOWN,
 * never folded into the leak count.
 */
export function scoreLeakCheck(answers: Record<string, Answer>): LeakCheckResult {
  const gapCounts: Record<LeakCategoryId, number> = {
    'missed-calls': 0, 'stalled-estimates': 0, 'dormant-customers': 0,
    'callback-cost': 0, 'follow-up-gaps': 0, 'owner-dependency': 0,
  }
  const verifiedGapQuestions: string[] = []
  const unknownQuestions: string[] = []

  for (const q of QUESTIONS) {
    const a = answers[q.id]
    if (a === 'no') {
      gapCounts[q.category] += 1
      verifiedGapQuestions.push(q.text)
    } else if (a === 'unsure') {
      unknownQuestions.push(q.text)
    }
  }

  let primaryId: LeakCategoryId = QUESTIONS[0].category
  let maxCount = -1
  for (const q of QUESTIONS) {
    if (gapCounts[q.category] > maxCount) {
      maxCount = gapCounts[q.category]
      primaryId = q.category
    }
  }

  return {
    primaryCategory: LEAK_CATEGORIES[primaryId],
    verifiedGapQuestions,
    unknownQuestions,
  }
}
