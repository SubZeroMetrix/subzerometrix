// Email trigger route — called by Supabase webhooks or n8n automation
// Fires the correct Resend sequence based on trigger type

import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'SubZeroMetrix <noreply@subzerometrix.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subzerometrix.com'

type TriggerType = 'assessment_complete' | 'post_purchase' | 'day7' | 'day30' | 'day89_reassessment'

interface EmailTriggerBody {
  trigger: TriggerType
  lead_name: string
  lead_email: string
  business_type: string
  band: string
  score?: number
  assessment_id: string
  tier_purchased?: string
}

function getEmail(data: EmailTriggerBody): { subject: string; html: string } | null {
  const { trigger, lead_name, business_type, band, tier_purchased } = data
  const first = (lead_name?.split(' ')[0] || 'there').trim()
  const trade = business_type || 'trades'

  const bandColor: Record<string, string> = {
    'High Risk':        '#E05A4E',
    'Foundation Stage': '#4A90D9',
    'Launch Ready':     '#EF9F27',
    'Growth Ready':     '#1D9E75',
  }
  const color = bandColor[band] || '#4A90D9'

  const wrap = (content: string) => `<div style="font-family:-apple-system,sans-serif;background:#0A1628;color:#C8D4E0;padding:32px 24px;max-width:500px;margin:0 auto;border-radius:12px;">${content}</div>`
  const pill = `font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#5B8FB9;`
  const h1 = `font-size:22px;color:#E8EDF2;margin:12px 0;`
  const btn = (url: string, label: string) => `<a href="${url}" style="display:inline-block;background:#4A90D9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:16px 0;">${label}</a>`
  const fine = `font-size:11px;color:#5B8FB9;`

  if (trigger === 'assessment_complete') return {
    subject: `${first}, your MetrixScore™ is ready — don't lose it`,
    html: wrap(`
      <p style="${pill}">SubZeroMetrix · MetrixScore™</p>
      <h1 style="${h1}">Your score is calculated, ${first}.</h1>
      <p>You just completed the MetrixScore™ assessment for your <strong style="color:#E8EDF2;">${trade}</strong> business.</p>
      <p>Band: <strong style="color:${color};">${band}</strong> — the exact number and roadmap are locked.</p>
      <p>Unlock the full breakdown for as little as $9.99. The full roadmap with 90-day action plan is $19.99.</p>
      ${btn(`${APP_URL}/unlock`, 'Unlock My MetrixScore™ →')}
      <p style="${fine}">Your results are saved — but the longer you wait, the longer your business runs cold.</p>
    `),
  }

  if (trigger === 'post_purchase') return {
    subject: `Welcome, ${first} — your #1 priority this week`,
    html: wrap(`
      <p style="${pill}">SubZeroMetrix · ${tier_purchased ?? 'MetrixScore™'}</p>
      <h1 style="${h1}">You made the move most contractors don't.</h1>
      <p>Most ${trade} owners keep running on gut instinct. You just got the data.</p>
      <p>This week: open your report and act on <strong style="color:#E8EDF2;">Priority #1 only</strong>. One thing done is worth ten things planned.</p>
      ${btn(`${APP_URL}/report`, 'Open My Report →')}
      <p style="${fine}">Know another contractor who should check their temperature? Forward this — they'll thank you.</p>
    `),
  }

  if (trigger === 'day7') return {
    subject: `${first} — one week in. Have you started Priority #1?`,
    html: wrap(`
      <p style="${pill}">SubZeroMetrix · 7-day check-in</p>
      <h1 style="${h1}">One week since your MetrixScore™.</h1>
      <p>The businesses that heat up fastest act in week one. Even one small move.</p>
      <p>If you haven't touched Priority #1 yet — start today. 20 minutes is enough to begin.</p>
      ${btn(`${APP_URL}/report`, 'Back to My Roadmap →')}
    `),
  }

  if (trigger === 'day30') return {
    subject: `${first} — 30 days. Here's what businesses like yours did first`,
    html: wrap(`
      <p style="${pill}">SubZeroMetrix · 30-day check-in</p>
      <h1 style="${h1}">30 days. Time for a gut check.</h1>
      <p>Most ${trade} owners who act on their top priority in month one see a measurable impact by month two — whether that's a cleaner cash position, a tighter pricing model, or their first real system.</p>
      <p>Where are you? Open your roadmap and check off what you've done.</p>
      ${btn(`${APP_URL}/report`, 'Check My Progress →')}
    `),
  }

  if (trigger === 'day89_reassessment') return {
    subject: `${first} — your 90-day reassessment is ready`,
    html: wrap(`
      <p style="${pill}">SubZeroMetrix · Reassessment Time</p>
      <h1 style="${h1}">90 days. How hot is your ${trade} business now?</h1>
      <p>When you started, your band was <strong style="color:${color};">${band}</strong>.</p>
      <p>A lot can change in 90 days. Take the temperature again and see exactly how far you've moved — and where new gaps may have opened.</p>
      ${btn(`${APP_URL}/assessment`, 'Retake My Assessment →')}
      <p style="${fine}">New score unlocks at $9.99. Upgrade to Pro for the full delta report showing exactly what changed since last time.</p>
    `),
  }

  return null
}

export async function POST(req: NextRequest) {
  // Resend is optional — return graceful skip rather than crashing
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { status: 'skipped', reason: 'Email automation is not configured. Missing RESEND_API_KEY.' },
      { status: 202 }
    )
  }

  try {
    const body: EmailTriggerBody = await req.json()
    const email = getEmail(body)
    if (!email) return NextResponse.json({ error: 'Unknown trigger' }, { status: 400 })

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: [body.lead_email], subject: email.subject, html: email.html }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data }, { status: 500 })
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Email trigger error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
