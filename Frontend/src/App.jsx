import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Classes from './pages/admin/Classes.jsx'
import Teachers from './pages/admin/Teachers.jsx'
import Students from './pages/admin/Students.jsx'
import MarkAttendance from './pages/shared/MarkAttendance.jsx'
import AttendanceHistory from './pages/shared/AttendanceHistory.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<Classes />} />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute roles={['admin', 'student']}>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute roles={['admin', 'teacher']}>
              <Students />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/attendance"
          element={
            <ProtectedRoute roles={['admin', 'teacher']}>
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
     
        <Route path="/attendance/history" element={<AttendanceHistory />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
