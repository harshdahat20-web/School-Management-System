import { useEffect, useState } from 'react'
import { CalendarCheck, History, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myClasses, setMyClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // The backend has no GET /api/teacher/me yet — find this user's
        // Teacher record by matching the logged-in User id within the
        // full list (GET /api/teacher has no role restriction).
        const teachersRes = await api.get('/teacher')
        const me = teachersRes.data.data.find((t) => t.user?._id === user?.id)
        if (!me) {
          if (!cancelled) setLoading(false)
          return
        }

        const classroomsRes = await api.get('/classroom')
        const mine = classroomsRes.data.data.filter((c) => c.classTeacher?._id === me._id)

        const withCounts = await Promise.all(
          mine.map(async (c) => {
            const studentsRes = await api.get('/student', { params: { classRoom: c._id } })
            return { id: c._id, name: `${c.name} ${c.section}`, students: studentsRes.data.data.length }
          })
        )

        if (!cancelled) setMyClasses(withCounts)
      } catch {
        // leave myClasses empty on failure
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (user?.id) load()
    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-bold text-ink-900">Dashboard</h1>
      <p className="text-sm text-ink-500 mt-1">
        Welcome back, <span className="text-brand-500 font-medium">{user?.name || 'Teacher'}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-5 mt-6">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Button
              variant="primary"
              icon={CalendarCheck}
              className="w-full justify-start"
              onClick={() => navigate('/attendance')}
            >
              Mark Attendance
            </Button>
            <Button
              variant="ghost"
              icon={History}
              className="w-full justify-start"
              onClick={() => navigate('/attendance/history')}
            >
              Attendance History
            </Button>
          </div>

          <div className="mt-6 pt-5 border-t border-ink-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <p className="text-sm text-ink-500">Great teachers build better tomorrows.</p>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-4">My Classes</h2>
          {loading ? (
            <p className="text-sm text-ink-500">Loading...</p>
          ) : myClasses.length === 0 ? (
            <p className="text-sm text-ink-500">
              No classes assigned to you yet — ask an admin to set you as a class teacher.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myClasses.map((c) => (
                <div
                  key={c.id}
                  className="border border-ink-100 rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-ink-900">{c.name}</span>
                  <span className="text-xs text-ink-500">{c.students} Students</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
