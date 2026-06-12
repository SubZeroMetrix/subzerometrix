'use client'

// ─────────────────────────────────────────────────────────────────────────────
// AccountDataPrivacyControls — Account-2K UI
// ─────────────────────────────────────────────────────────────────────────────
// Lets a signed-in user export or delete THEIR OWN synced cloud data, and (separately)
// clear device-local data. Honest by construction: nothing is claimed "deleted" unless
// every table succeeds; deletion requires explicit confirmation; auth-account deletion is
// labeled admin-assisted. No service-role, no public access — RLS owner-only via the
// browser anon client + session JWT.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Download, Trash2, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react'
import {
  exportAccountData, buildAccountDataExportJson, deleteAccountData,
  clearDeviceLocalSyncedData, getAccountPrivacyCopy,
  type AccountDataDeletion,
} from '@/lib/accountDataPrivacy'
import { getCurrentAccountUser } from '@/lib/accountAuth'

export default function AccountDataPrivacyControls() {
  const copy = getAccountPrivacyCopy()
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteResult, setDeleteResult] = useState<AccountDataDeletion | null>(null)
  const [localConfirm, setLocalConfirm] = useState(false)
  const [localMsg, setLocalMsg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const user = await getCurrentAccountUser()
        if (!cancelled) setSignedIn(user !== null)
      } catch {
        if (!cancelled) setSignedIn(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  async function handleExport() {
    setExporting(true); setExportMsg(null)
    try {
      const data = await exportAccountData()
      if (data.status === 'signed_out') { setExportMsg('Sign in to export your account data.'); return }
      if (data.status === 'unavailable') { setExportMsg('Account export is not available right now.'); return }
      const blob = new Blob([buildAccountDataExportJson(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'subzerometrix-account-data.json'
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
      const total = Object.values(data.rowCounts).reduce((s, n) => s + n, 0)
      const errCount = Object.keys(data.errors).length
      setExportMsg(`Exported ${total} row${total === 1 ? '' : 's'}${errCount > 0 ? ` (${errCount} table${errCount === 1 ? '' : 's'} unavailable)` : ''}.`)
    } catch {
      setExportMsg('Export failed. Your data was not changed.')
    } finally {
      setExporting(false)
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    setDeleting(true); setDeleteResult(null)
    try {
      setDeleteResult(await deleteAccountData())
    } catch {
      setDeleteResult(null)
    } finally {
      setDeleting(false)
    }
  }

  function handleClearLocal() {
    if (!localConfirm) return
    const { cleared } = clearDeviceLocalSyncedData()
    setLocalMsg(`Cleared ${cleared.length} item${cleared.length === 1 ? '' : 's'} from this device.`)
  }

  const btn = 'inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-[12px] font-semibold transition-all touch-target active:scale-[0.98]'

  return (
    <div className="space-y-5">
      <p className="text-[12px] text-brand-silver leading-relaxed">{copy.intro}</p>

      {signedIn === false && (
        <p className="text-[11px] text-brand-silver/70 glass-light rounded-xl px-4 py-3">
          You are not signed in on this device. These controls act on your own account data once you are signed in.
        </p>
      )}

      {/* Export */}
      <section className="glass rounded-2xl p-5">
        <p className="text-[13px] font-semibold text-brand-white mb-1">{copy.exportTitle}</p>
        <p className="text-[11px] text-brand-silver/80 leading-relaxed mb-3">{copy.exportDescription}</p>
        <button type="button" onClick={handleExport} disabled={exporting}
          className={`${btn} glass text-brand-white`}>
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export my data (JSON)
        </button>
        {exportMsg && <p className="text-[11px] text-brand-silver/70 mt-2">{exportMsg}</p>}
      </section>

      {/* Delete cloud */}
      <section className="glass rounded-2xl p-5">
        <p className="text-[13px] font-semibold text-brand-white mb-1">{copy.deleteTitle}</p>
        <p className="text-[11px] text-brand-silver/80 leading-relaxed mb-3">{copy.deleteDescription}</p>
        <label className="flex items-start gap-2 cursor-pointer mb-3">
          <input type="checkbox" checked={deleteConfirm} onChange={e => setDeleteConfirm(e.target.checked)} className="mt-0.5 accent-brand-accent" />
          <span className="text-[11px] text-brand-silver leading-relaxed">{copy.deleteConfirmLabel}</span>
        </label>
        <button type="button" onClick={handleDelete} disabled={!deleteConfirm || deleting}
          className={`${btn} ${deleteConfirm ? '' : 'opacity-50'}`}
          style={{ background: 'rgba(224,90,78,0.15)', color: '#E05A4E', border: '1px solid rgba(224,90,78,0.35)' }}>
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete my cloud data
        </button>
        {deleteResult && (
          <div className="mt-3 text-[11px]">
            {deleteResult.status === 'signed_out' ? (
              <p className="text-brand-silver/70">Sign in to delete your account data.</p>
            ) : deleteResult.status === 'unavailable' ? (
              <p className="text-brand-silver/70">Deletion is not available right now. Nothing was changed.</p>
            ) : deleteResult.allDeleted ? (
              <p className="inline-flex items-center gap-1.5" style={{ color: '#1D9E75' }}>
                <CheckCircle2 className="w-4 h-4" /> All your synced cloud data was deleted.
              </p>
            ) : (
              <p className="text-brand-silver/80">
                {deleteResult.results.filter(r => r.ok).length} of {deleteResult.results.length} tables cleared.
                Some could not be deleted — try again or contact support.
              </p>
            )}
          </div>
        )}
        <p className="text-[10px] text-brand-silver/50 mt-3 leading-relaxed">{copy.authAccountNote}</p>
      </section>

      {/* Device-local clear (separate) */}
      <section className="glass rounded-2xl p-5">
        <p className="text-[13px] font-semibold text-brand-white mb-1 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" style={{ color: '#EFB967' }} /> {copy.localTitle}
        </p>
        <p className="text-[11px] text-brand-silver/80 leading-relaxed mb-3">{copy.localDescription}</p>
        <label className="flex items-start gap-2 cursor-pointer mb-3">
          <input type="checkbox" checked={localConfirm} onChange={e => setLocalConfirm(e.target.checked)} className="mt-0.5 accent-brand-accent" />
          <span className="text-[11px] text-brand-silver leading-relaxed">{copy.localConfirmLabel}</span>
        </label>
        <button type="button" onClick={handleClearLocal} disabled={!localConfirm}
          className={`${btn} glass text-brand-white ${localConfirm ? '' : 'opacity-50'}`}>
          <Trash2 className="w-4 h-4" /> Clear data on this device
        </button>
        {localMsg && <p className="text-[11px] text-brand-silver/70 mt-2">{localMsg}</p>}
      </section>
    </div>
  )
}
