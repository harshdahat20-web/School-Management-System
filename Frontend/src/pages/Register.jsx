import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, X as XIcon } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import Card from '../components/ui/Card.jsx'
import { Field, Input, Select, Textarea } from '../components/ui/Field.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api.js'

const emptyStudentForm = {
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

const emptyTeacherForm = {
  name: '',
  email: '',
  password: '',
  subjects: [],
  qualification: '',
  phone: '',
}

export default function Register() {
  const [mode, setMode] = useState('student')
  const [studentForm, setStudentForm] = useState(emptyStudentForm)
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm)
  const [subjectInput, setSubjectInput] = useState('')
  const [classOptions, setClassOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const { registerStudent, registerTeacher } = useAuth()

  useEffect(() => {
    api
      .get('/classroom/public')
      .then((res) => setClassOptions(res.data.data))
      .catch(() => {})
  }, [])

  function updateStudent(key) {
    return (e) => setStudentForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function updateTeacher(key) {
    return (e) => setTeacherForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function addSubject() {
    const s = subjectInput.trim()
    if (!s) return
    setTeacherForm((f) => ({ ...f, subjects: [...f.subjects, s] }))
    setSubjectInput('')
  }

  function removeSubject(i) {
    setTeacherForm((f) => ({ ...f, subjects: f.subjects.filter((_, idx) => idx !== i) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'student') {
        await registerStudent(studentForm)
      } else {
        await registerTeacher(teacherForm)
      }
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-10">
        <Card className="p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-ink-900">Registration submitted</h1>
          <p className="text-sm text-ink-500 mt-2">
            Your account is waiting for admin approval. You'll be able to log in once
            it's approved.
          </p>
          <Link to="/login">
            <Button className="mt-6 w-full">Back to Login</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" />
        </div>

        <Card className="p-6">
          <div className="flex rounded-lg bg-ink-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => setMode('student')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'student' ? 'bg-white text-brand-500 shadow-card' : 'text-ink-500'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setMode('teacher')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'teacher' ? 'bg-white text-brand-500 shadow-card' : 'text-ink-500'
              }`}
            >
              Teacher
            </button>
          </div>

          <div className="mb-5">
            <h1 className="text-xl font-bold text-ink-900">
              {mode === 'student' ? 'Student Registration' : 'Teacher Registration'}
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Your account will need admin approval before you can log in.
            </p>
          </div>

          {mode === 'student' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <Input
                    icon={User}
                    required
                    placeholder="Enter your name"
                    value={studentForm.name}
                    onChange={updateStudent('name')}
                  />
                </Field>
                <Field label="Email address">
                  <Input
                    icon={Mail}
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={studentForm.email}
                    onChange={updateStudent('email')}
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
                  value={studentForm.password}
                  onChange={updateStudent('password')}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Class">
                  <Select required value={studentForm.classRoom} onChange={updateStudent('classRoom')}>
                    <option value="">Select your class</option>
                    {classOptions.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.section}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Date of Birth">
                  <Input
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={updateStudent('dateOfBirth')}
                  />
                </Field>
              </div>

              <Field label="Gender">
                <Select value={studentForm.gender} onChange={updateStudent('gender')}>
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
                    value={studentForm.parentName}
                    onChange={updateStudent('parentName')}
                  />
                </Field>
                <Field label="Parent Phone">
                  <Input
                    placeholder="Enter phone number"
                    value={studentForm.parentPhone}
                    onChange={updateStudent('parentPhone')}
                  />
                </Field>
              </div>

              <Field label="Address">
                <Textarea
                  placeholder="Enter address"
                  value={studentForm.address}
                  onChange={updateStudent('address')}
                />
              </Field>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting…' : 'Register'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <Input
                    icon={User}
                    required
                    placeholder="Enter your name"
                    value={teacherForm.name}
                    onChange={updateTeacher('name')}
                  />
                </Field>
                <Field label="Email address">
                  <Input
                    icon={Mail}
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={teacherForm.email}
                    onChange={updateTeacher('email')}
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
                  value={teacherForm.password}
                  onChange={updateTeacher('password')}
                />
              </Field>

              <Field label="Subjects">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add subject (e.g. Math)"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSubject()
                      }
                    }}
                  />
                  <Button type="button" variant="ghost" onClick={addSubject}>
                    Add
                  </Button>
                </div>
                {teacherForm.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {teacherForm.subjects.map((s, i) => (
                      <span
                        key={s + i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 text-xs font-medium"
                      >
                        {s}
                        <button type="button" onClick={() => removeSubject(i)}>
                          <XIcon size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Qualification">
                <Input
                  placeholder="Enter qualification"
                  value={teacherForm.qualification}
                  onChange={updateTeacher('qualification')}
                />
              </Field>

              <Field label="Phone">
                <Input
                  placeholder="Enter phone number"
                  value={teacherForm.phone}
                  onChange={updateTeacher('phone')}
                />
              </Field>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting…' : 'Register'}
              </Button>
            </form>
          )}

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
