import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api.js'

/**
 * user shape (from GET /api/user/me):
 *   { id, name, email, role: 'admin' | 'teacher' | 'student' }
 *
 * Auth is cookie-based (httpOnly `accessToken` set by the backend on
 * login) — there's no token to store in JS. On every page load we call
 * /api/user/me once to find out whether the cookie is still valid and
 * who's logged in.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true until the initial /me check resolves

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  async function refreshUser() {
    try {
      const res = await api.get('/user/me')
      setUser(res.data.data)
      return res.data.data
    } catch {
      setUser(null)
      return null
    }
  }

  async function login({ email, password }) {
    // Login response body doesn't include `role` — only /me does — so we
    // fetch the full profile right after the cookie is set.
    await api.post('/auth/login', { email, password })
    const me = await refreshUser()
    return me
  }

  async function register({ name, email, password }) {
    // Register does NOT log the user in (no cookie set) — caller should
    // redirect to /login afterwards, not /dashboard.
    const res = await api.post('/auth/register', { name, email, password })
    return res.data.data
  }

  async function registerStudent(formData) {
    return api.post('/student/self-register', formData)
  }

  async function registerTeacher(formData) {
    return api.post('/teacher/self-register', formData)
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, registerStudent, registerTeacher, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
