import Card from './Card.jsx'

export default function StatCard({ icon: Icon, label, value, delta, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-violet-50 text-violet-600',
  }
  const positive = delta?.startsWith('+')

  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-ink-900 mt-4">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm text-ink-500">{label}</p>
        {delta && (
          <span
            className={`text-xs font-medium ${
              positive ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
    </Card>
  )
}
