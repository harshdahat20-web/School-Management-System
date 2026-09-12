import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  // Still checking the session cookie (GET /api/user/me) — avoid a flash
  // redirect to /login on page refresh while that's in flight.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-100">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return children
}
