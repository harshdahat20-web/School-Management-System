import Card from './Card.jsx'

const TONES = {
  brand: 'bg-brand-500',
  green: 'bg-teal-500',
  amber: 'bg-amber-500',
  purple: 'bg-sky-500',
}

export default function StatCard({ icon: Icon, label, value, delta, tone = 'brand' }) {
  const positive = delta?.startsWith('+')

  return (
    <Card className="p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl2 flex items-center justify-center text-white shrink-0 ${TONES[tone]}`}
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ink-500">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-ink-900">{value}</p>
          {delta && (
            <span
              className={`text-xs font-medium ${positive ? 'text-teal-600' : 'text-red-500'}`}
            >
              {delta}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
