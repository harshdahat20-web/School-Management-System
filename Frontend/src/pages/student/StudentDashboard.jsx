import { useEffect, useMemo, useState } from 'react'
import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [me, setMe] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const studentsRes = await api.get('/student')
        const myRecord = studentsRes.data.data.find((s) => s.user?._id === user?.id)
        if (!myRecord) {
          if (!cancelled) setLoading(false)
          return
        }
        if (!cancelled) setMe(myRecord)

        const historyRes = await api.get(`/attendance/student/${myRecord._id}`)
        if (!cancelled) setHistory(historyRes.data.data)
      } catch {
        // leave me/history empty on failure
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (user?.id) load()
    return () => {
      cancelled = true
    }
  }, [user])

  const { percent, presentDays, totalDays } = useMemo(() => {
    if (history.length === 0) return { percent: 0, presentDays: 0, totalDays: 0 }
    const present = history.filter((h) => h.status === 'present').length
    return {
      percent: Math.round((present / history.length) * 100),
      presentDays: present,
      totalDays: history.length,
    }
  }, [history])

  const recent = history.slice(0, 5)

  if (loading) {
    return (
      <div className="max-w-5xl">
        <h1 className="text-xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500 mt-2">Loading...</p>
      </div>
    )
  }

  if (!me) {
    return (
      <div className="max-w-5xl">
        <h1 className="text-xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500 mt-2">
          No student profile is linked to your account yet — contact your school admin.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-bold text-ink-900">Dashboard</h1>
      <p className="text-sm text-ink-500 mt-1">Your academic overview.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.2fr] gap-5 mt-6">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-4">Profile</h2>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold mb-3">
              {(me.user?.name || '?')
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </div>
            <p className="text-sm font-semibold text-ink-900">{me.user?.name}</p>
            <p className="text-xs text-ink-500 mt-0.5">Admission No. {me.admissionNumber}</p>
            <p className="text-xs text-ink-500">
              {me.classRoom ? `${me.classRoom.name} ${me.classRoom.section}` : '—'} • Roll No.{' '}
              {me.rollNumber}
            </p>
          </div>

          <div className="mt-5 pt-5 border-t border-ink-100">
            <p className="text-xs font-medium text-ink-500 mb-2">Parent Details</p>
            <p className="text-sm text-ink-900 font-medium">{me.parentName}</p>
            <div className="flex items-center gap-1.5 text-xs text-ink-500 mt-1">
              <Phone size={12} />
              {me.parentPhone}
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col items-center justify-center text-center">
          <h2 className="text-sm font-semibold text-ink-900 self-start mb-2">
            Attendance Summary
          </h2>
          <div className="relative w-32 h-32 my-2">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#F1F5F9" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#10B981"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - percent / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-ink-900">{percent}%</span>
              <span className="text-[10px] text-ink-500">Overall</span>
            </div>
          </div>
          <p className="text-sm text-ink-700">
            Present Days: {presentDays} / {totalDays}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-900">Recent Attendance</h2>
          </div>
          <div className="space-y-2.5">
            {recent.length === 0 ? (
              <p className="text-sm text-ink-500">No attendance records yet.</p>
            ) : (
              recent.map((r) => (
                <div key={r._id} className="flex items-center justify-between">
                  <span className="text-sm text-ink-700">{formatDate(r.date)}</span>
                  <StatusBadge status={r.status} />
                </div>
              ))
            )}
          </div>
          <Link
            to="/attendance/history"
            className="inline-block text-sm text-brand-500 font-medium hover:underline mt-4"
          >
            View Full History →
          </Link>
        </Card>
      </div>
    </div>
  )
}
