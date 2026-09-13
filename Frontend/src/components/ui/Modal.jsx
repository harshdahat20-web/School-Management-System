import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative flex flex-col bg-white rounded-xl2 shadow-xl w-full ${width} max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header is a normal flex item (not scrolling), so it can never
            overlap body content — no reliance on sticky positioning. */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h2 className="text-base font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
