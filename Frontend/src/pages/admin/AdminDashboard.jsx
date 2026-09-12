import { useEffect, useState } from 'react'
import { Users, GraduationCap, Building2, CalendarCheck, UserPlus, Building, ClipboardPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../../components/ui/StatCard.jsx'
import Card from '../../components/ui/Card.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalStudents: null,
    totalTeachers: null,
    totalClasses: null,
    todayAttendancePct: null,
  })

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      try {
        const [studentsRes, teachersRes, classroomsRes] = await Promise.all([
          api.get('/student'),
          api.get('/teacher'),
          api.get('/classroom'),
        ])
        if (cancelled) return

        const classrooms = classroomsRes.data.data

        // No single endpoint aggregates "today's attendance" across every
        // class, so we fetch each class's attendance for today and combine.
        const today = todayISO()
        const attendanceLists = await Promise.all(
          classrooms.map((c) =>
            api
              .get('/attendance', { params: { classRoom: c._id, date: today } })
              .then((r) => r.data.data)
              .catch(() => [])
          )
        )
        const allToday = attendanceLists.flat()
        const presentCount = allToday.filter((a) => a.status === 'present').length
        const pct = allToday.length > 0 ? Math.round((presentCount / allToday.length) * 100) : null

        if (!cancelled) {
          setStats({
            totalStudents: studentsRes.data.data.length,
            totalTeachers: teachersRes.data.data.length,
            totalClasses: classrooms.length,
            todayAttendancePct: pct,
          })
        }
      } catch {
        // leave stats as null (renders as "—") if anything fails
      }
    }

    loadStats()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="max-w-6xl">
      <h1 className="text-xl font-bold text-ink-900">Dashboard</h1>
      <p className="text-sm text-ink-500 mt-1">
        Welcome back, <span className="text-brand-500 font-medium">{user?.name || 'Admin'}</span>!
        Here's what's happening at your school.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents ?? '—'} tone="brand" />
        <StatCard icon={GraduationCap} label="Total Teachers" value={stats.totalTeachers ?? '—'} tone="green" />
        <StatCard icon={Building2} label="Total Classes" value={stats.totalClasses ?? '—'} tone="amber" />
        <StatCard
          icon={CalendarCheck}
          label="Today's Attendance"
          value={stats.todayAttendancePct != null ? `${stats.todayAttendancePct}%` : '—'}
          tone="purple"
        />
      </div>

      <h2 className="text-sm font-semibold text-ink-900 mt-8 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction icon={UserPlus} label="Add Student" onClick={() => navigate('/students')} />
        <QuickAction icon={GraduationCap} label="Add Teacher" onClick={() => navigate('/teachers')} />
        <QuickAction icon={Building} label="Add Classroom" onClick={() => navigate('/classes')} />
      </div>

      <Card className="mt-8 p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-xl2 bg-brand-50 flex items-center justify-center mb-4">
          <ClipboardPlus size={28} className="text-brand-500" />
        </div>
        <h3 className="text-base font-semibold text-ink-900">Manage your school efficiently</h3>
        <p className="text-sm text-ink-500 mt-1">
          Use the sidebar to navigate through different sections.
        </p>
      </Card>
    </div>
  )
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 bg-white border border-ink-100 rounded-xl2 shadow-card py-6 hover:border-brand-500/40 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-ink-700">{label}</span>
    </button>
  )
}
