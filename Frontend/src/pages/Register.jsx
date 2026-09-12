import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import Card from '../components/ui/Card.jsx'
import { Field, Input } from '../components/ui/Field.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      // Register doesn't log the user in (backend sets no cookie here) —
      // send them to /login to sign in with their new account.
      navigate('/login', { state: { justRegistered: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account. Try again.')
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
            <h1 className="text-xl font-bold text-ink-900">Create Account</h1>
            <p className="text-sm text-ink-500 mt-1">Register to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name">
              <Input
                icon={User}
                required
                placeholder="Enter your name"
                value={form.name}
                onChange={update('name')}
              />
            </Field>

            <Field label="Email address">
              <Input
                icon={Mail}
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
              />
            </Field>

            <Field label="Password">
              <Input
                icon={Lock}
                type="password"
                required
                placeholder="Create a strong password"
                value={form.password}
                onChange={update('password')}
              />
            </Field>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-medium hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
