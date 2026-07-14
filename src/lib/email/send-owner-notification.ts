// Best-effort owner notification email. Failure here must never affect
// the caller's response -- the database write is the source of truth;
// this is a convenience alert on top of it. Uses Resend's plain REST API
// directly (no SDK dependency) so this stays a lightweight addition.

const OWNER_EMAIL = 'info@subzerometrix.com'
const FROM_EMAIL = 'SubZero Metrix Notifications <notifications@subzerometrix.com>'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Strips characters that could be used for email header injection if a
// field ever ended up somewhere header-adjacent (defense in depth --
// these values are never actually used as headers, only body content).
function sanitizeForEmail(value: string, maxLength: number): string {
  return value.replace(/[\r\n]/g, ' ').slice(0, maxLength)
}

export interface NotificationField {
  label: string
  value: string
}

export interface OwnerNotificationInput {
  submissionType: string
  recordId: string
  source: string | null
  fields: NotificationField[]
}

export async function sendOwnerNotification(input: OwnerNotificationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[owner-notification] RESEND_API_KEY not configured -- skipping email, record was still saved.')
    return
  }

  try {
    const timestamp = new Date().toISOString()
    const safeFields = input.fields
      .slice(0, 20)
      .map((f) => ({ label: sanitizeForEmail(f.label, 100), value: sanitizeForEmail(f.value, 1000) }))

    const fieldsHtml = safeFields
      .map((f) => `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:13px;vertical-align:top;">${escapeHtml(f.label)}</td><td style="padding:4px 0;color:#111827;font-size:13px;">${escapeHtml(f.value)}</td></tr>`)
      .join('')

    const html = `
      <div style="font-family:sans-serif;max-width:560px;">
        <p style="font-size:15px;color:#111827;"><strong>${escapeHtml(sanitizeForEmail(input.submissionType, 100))}</strong></p>
        <table style="border-collapse:collapse;">${fieldsHtml}</table>
        <p style="font-size:12px;color:#9ca3af;margin-top:16px;">
          Record ID: ${escapeHtml(input.recordId)}<br />
          Source: ${escapeHtml(sanitizeForEmail(input.source || 'unknown', 300))}<br />
          Submitted: ${escapeHtml(timestamp)}
        </p>
      </div>
    `.trim()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        subject: `[SubZeroMetrix] ${sanitizeForEmail(input.submissionType, 100)}`,
        html,
      }),
    })

    if (!res.ok) {
      // Never log the response body -- it could echo back submitted PII.
      console.error(`[owner-notification] Send failed with status ${res.status} for ${input.submissionType}`)
    }
  } catch (err) {
    console.error('[owner-notification] Error:', err instanceof Error ? err.message : 'unknown error')
  }
}
