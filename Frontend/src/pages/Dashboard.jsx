import { useAuth } from '../context/AuthContext.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import TeacherDashboard from './teacher/TeacherDashboard.jsx'
import StudentDashboard from './student/StudentDashboard.jsx'

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === 'teacher') return <TeacherDashboard />
  if (user?.role === 'student') return <StudentDashboard />
  return <AdminDashboard />
}
