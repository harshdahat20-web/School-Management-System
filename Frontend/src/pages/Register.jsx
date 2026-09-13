import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import Card from '../components/ui/Card.jsx'
import { Field, Input, Select, Textarea } from '../components/ui/Field.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api.js'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  classRoom: '',
  dateOfBirth: '',
  gender: '',
  parentName: '',
  parentPhone: '',
  address: '',
}

export default function Register() {
  const [form, setForm] = useState(emptyForm)
  const [classOptions, setClassOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { registerStudent } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/classroom/public')
      .then((res) => setClassOptions(res.data.data))
      .catch(() => {})
  }, [])

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerStudent(form)

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" />
        </div>

        <Card className="p-6">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-ink-900">Student Registration</h1>
            <p className="text-sm text-ink-500 mt-1">
              Create your account to see your classes and attendance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <Field label="Password">
              <Input
                icon={Lock}
                type="password"
                required
                minLength={6}
                placeholder="Create a strong password"
                value={form.password}
                onChange={update('password')}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Class">
                <Select required value={form.classRoom} onChange={update('classRoom')}>
                  <option value="">Select your class</option>
                  {classOptions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.section}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Date of Birth">
                <Input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
              </Field>
            </div>

            <Field label="Gender">
              <Select value={form.gender} onChange={update('gender')}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Parent Name">
                <Input
                  placeholder="Enter parent name"
                  value={form.parentName}
                  onChange={update('parentName')}
                />
              </Field>
              <Field label="Parent Phone">
                <Input
                  placeholder="Enter phone number"
                  value={form.parentPhone}
                  onChange={update('parentPhone')}
                />
              </Field>
            </div>

            <Field label="Address">
              <Textarea
                placeholder="Enter address"
                value={form.address}
                onChange={update('address')}
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
          <p className="text-center text-xs text-ink-500 mt-2">
            Teacher or admin account? Contact your school administrator.
          </p>
        </Card>
      </div>
    </div>
  )
}
