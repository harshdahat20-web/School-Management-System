import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import Card from '../components/ui/Card.jsx'
import { Field, Input } from '../components/ui/Field.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" />
        </div>

        <Card className="p-6">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-ink-900">Welcome Back</h1>
            <p className="text-sm text-ink-500 mt-1">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email address">
              <Input
                icon={Mail}
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label="Password">
              <Input
                icon={Lock}
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            {location.state?.justRegistered && !error && (
              <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                Account created — log in to continue.
              </p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 font-medium hover:underline">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
