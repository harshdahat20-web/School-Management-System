import { AlertTriangle } from 'lucide-react'
import Button from './Button.jsx'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onCancel} aria-hidden="true" />
      <div
        className="relative bg-white rounded-xl2 shadow-xl w-full max-w-sm p-6"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
          <AlertTriangle size={20} />
        </div>
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        <p className="text-sm text-ink-500 mt-1.5">{message}</p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
