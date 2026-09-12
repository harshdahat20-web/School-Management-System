import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import { Field, Input, Select, Textarea } from '../../components/ui/Field.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  admissionNumber: '',
  classRoom: '',
  rollNumber: '',
  dateOfBirth: '',
  gender: '',
  parentName: '',
  parentPhone: '',
  address: '',
}

export default function Students() {
  const { user } = useAuth()
  const canManage = user?.role === 'admin'

  const [rows, setRows] = useState([])
  const [classOptions, setClassOptions] = useState([])
  const [classFilter, setClassFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api
      .get('/classroom')
      .then((res) => setClassOptions(res.data.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadStudents()
  }, [classFilter])

  async function loadStudents() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/student', {
        params: classFilter ? { classRoom: classFilter } : {},
      })
      setRows(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load students.')
    } finally {
      setLoading(false)
    }
  }

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function openAddModal() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setOpen(true)
  }

  function openEditModal(row) {
    setEditingId(row._id)
    setForm({
      ...emptyForm,
      admissionNumber: row.admissionNumber || '',
      classRoom: row.classRoom?._id || '',
      rollNumber: row.rollNumber || '',
      dateOfBirth: row.dateOfBirth ? row.dateOfBirth.slice(0, 10) : '',
      gender: row.gender || '',
      parentName: row.parentName || '',
      parentPhone: row.parentPhone || '',
      address: row.address || '',
    })
    setFormError('')
    setOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (editingId) {
        // The Student document only owns these fields — name/email/password
        // live on User, and this endpoint (PUT /api/student/:id) can't
        // touch those, so they're intentionally left out of the edit payload.
        await api.put(`/student/${editingId}`, {
          admissionNumber: form.admissionNumber,
          classRoom: form.classRoom,
          rollNumber: form.rollNumber,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          parentName: form.parentName,
          parentPhone: form.parentPhone,
          address: form.address,
        })
      } else {
        await api.post('/student', form)
      }
      await loadStudents()
      setOpen(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save student.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    setDeleting(true)
    try {
      await api.delete(`/student/${deleteTarget._id}`)
      setRows((r) => r.filter((row) => row._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete student.')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  function classLabel(c) {
    return `${c.name} ${c.section}`
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [r.user?.name, r.admissionNumber, String(r.rollNumber), r.parentName]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    )
  }, [rows, search])

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Students</h1>
          <p className="text-sm text-ink-500 mt-1">Manage all students and their details.</p>
        </div>
        {canManage && (
          <Button icon={Plus} onClick={openAddModal}>
            Add Student
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="max-w-xs w-full">
          <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            {classOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {classLabel(c)}
              </option>
            ))}
          </Select>
        </div>
        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <Input
            placeholder="Search students..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 border-b border-ink-100">
                <th className="font-medium px-5 py-3">Roll No</th>
                <th className="font-medium px-5 py-3">Name</th>
                <th className="font-medium px-5 py-3">Admission No</th>
                <th className="font-medium px-5 py-3">Class</th>
                <th className="font-medium px-5 py-3">Parent Name</th>
                <th className="font-medium px-5 py-3">Parent Phone</th>
                {canManage && <th className="font-medium px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-center text-ink-500">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-center text-ink-500">
                    {rows.length === 0 ? 'No students found.' : 'No students match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row._id} className="border-b border-ink-100 last:border-0">
                    <td className="px-5 py-3 text-ink-700">{row.rollNumber}</td>
                    <td className="px-5 py-3 text-ink-900 font-medium">{row.user?.name}</td>
                    <td className="px-5 py-3 text-ink-700">{row.admissionNumber}</td>
                    <td className="px-5 py-3 text-ink-700">
                      {row.classRoom ? classLabel(row.classRoom) : '—'}
                    </td>
                    <td className="px-5 py-3 text-ink-700">{row.parentName}</td>
                    <td className="px-5 py-3 text-ink-700">{row.parentPhone}</td>
                    {canManage && (
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            className="text-brand-500 hover:text-brand-600"
                            aria-label="Edit"
                            onClick={() => openEditModal(row)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-600"
                            aria-label="Delete"
                            onClick={() => setDeleteTarget(row)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-ink-100">
          <p className="text-xs text-ink-500">
            Showing 1-{filtered.length} of {rows.length}
          </p>
        </div>
      </Card>

      {canManage && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={editingId ? 'Edit Student' : 'Add Student'}
          width="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingId && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name">
                    <Input
                      required
                      placeholder="Enter name"
                      value={form.name}
                      onChange={update('name')}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      required
                      placeholder="Enter email"
                      value={form.email}
                      onChange={update('email')}
                    />
                  </Field>
                </div>
                <Field label="Password">
                  <Input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Create password"
                    value={form.password}
                    onChange={update('password')}
                  />
                </Field>
              </>
            )}

            {editingId && (
              <p className="text-xs text-ink-500 bg-ink-100 rounded-lg px-3 py-2">
                Name, email, and password can't be changed here — only student-specific
                details below.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Admission Number">
                <Input
                  required
                  placeholder="Enter admission no"
                  value={form.admissionNumber}
                  onChange={update('admissionNumber')}
                />
              </Field>
              <Field label="Roll Number">
                <Input
                  type="number"
                  required
                  placeholder="Enter roll number"
                  value={form.rollNumber}
                  onChange={update('rollNumber')}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Class">
                <Select required value={form.classRoom} onChange={update('classRoom')}>
                  <option value="">Select class</option>
                  {classOptions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {classLabel(c)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Gender">
                <Select required value={form.gender} onChange={update('gender')}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
            </div>

            <Field label="Date of Birth">
              <Input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Parent Name">
                <Input
                  required
                  placeholder="Enter parent name"
                  value={form.parentName}
                  onChange={update('parentName')}
                />
              </Field>
              <Field label="Parent Phone">
                <Input
                  required
                  placeholder="Enter phone number"
                  value={form.parentPhone}
                  onChange={update('parentPhone')}
                />
              </Field>
            </div>

            <Field label="Address">
              <Textarea placeholder="Enter address" value={form.address} onChange={update('address')} />
            </Field>

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Student'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete student?"
        message={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.user?.name} and their login access. This can't be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
