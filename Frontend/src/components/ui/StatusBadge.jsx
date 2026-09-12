const styles = {
  present: 'bg-emerald-50 text-emerald-600',
  absent: 'bg-red-50 text-red-500',
  late: 'bg-amber-50 text-amber-600',
  leave: 'bg-ink-100 text-ink-500',
}

const dot = {
  present: 'bg-emerald-500',
  absent: 'bg-red-500',
  late: 'bg-amber-500',
  leave: 'bg-ink-500',
}

const label = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  leave: 'Leave',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] || styles.leave
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || dot.leave}`} />
      {label[status] || status}
    </span>
  )
}
