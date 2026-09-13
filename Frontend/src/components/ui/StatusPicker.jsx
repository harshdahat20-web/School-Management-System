const OPTIONS = [
  { value: 'present', label: 'Present', active: 'bg-emerald-500 text-white', idle: 'text-emerald-600 hover:bg-emerald-50' },
  { value: 'absent', label: 'Absent', active: 'bg-red-500 text-white', idle: 'text-red-500 hover:bg-red-50' },
  { value: 'late', label: 'Late', active: 'bg-amber-500 text-white', idle: 'text-amber-600 hover:bg-amber-50' },
  { value: 'leave', label: 'Leave', active: 'bg-ink-500 text-white', idle: 'text-ink-500 hover:bg-ink-100' },
]

export default function StatusPicker({ value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-ink-100 p-0.5 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            value === opt.value ? opt.active : opt.idle
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
