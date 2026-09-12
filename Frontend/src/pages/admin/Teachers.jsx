import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, X as XIcon, Search } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import { Field, Input } from '../../components/ui/Field.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  employeeId: '',
  subjects: [],
  qualification: '',
  phone: '',
}

export default function Teachers() {
  const { user } = useAuth()
  const canManage = user?.role === 'admin'

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [subjectInput, setSubjectInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadTeachers()
  }, [])

  async function loadTeachers() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/teacher')
      setRows(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load teachers.')
    } finally {
      setLoading(false)
    }
  }

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function addSubject() {
    const s = subjectInput.trim()
    if (!s) return
    setForm((f) => ({ ...f, subjects: [...f.subjects, s] }))
    setSubjectInput('')
  }

  function removeSubject(i) {
    setForm((f) => ({ ...f, subjects: f.subjects.filter((_, idx) => idx !== i) }))
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
      employeeId: row.employeeId || '',
      subjects: row.subjects || [],
      qualification: row.qualification || '',
      phone: row.phone || '',
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
        // The Teacher document only owns these 4 fields — name/email/password
        // live on User, and this endpoint (PUT /api/teacher/:id) can't touch
        // those, so they're intentionally left out of the edit payload.
        await api.put(`/teacher/${editingId}`, {
          employeeId: form.employeeId,
          subjects: form.subjects,
          qualification: form.qualification,
          phone: form.phone,
        })
      } else {
        await api.post('/teacher', form)
      }
      await loadTeachers()
      setOpen(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save teacher.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    setDeleting(true)
    try {
      await api.delete(`/teacher/${deleteTarget._id}`)
      setRows((r) => r.filter((row) => row._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete teacher.')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [r.user?.name, r.user?.email, r.employeeId, ...(r.subjects || [])]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    )
  }, [rows, search])

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Teachers</h1>
          <p className="text-sm text-ink-500 mt-1">Manage your teaching staff.</p>
        </div>
        {canManage && (
          <Button icon={Plus} onClick={openAddModal}>
            Add Teacher
          </Button>
        )}
      </div>

      <div className="mt-6 relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <Input
          placeholder="Search teachers..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 border-b border-ink-100">
                <th className="font-medium px-5 py-3">Name</th>
                <th className="font-medium px-5 py-3">Email</th>
                <th className="font-medium px-5 py-3">Employee ID</th>
                <th className="font-medium px-5 py-3">Subjects</th>
                <th className="font-medium px-5 py-3">Phone</th>
                {canManage && <th className="font-medium px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-ink-500">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-ink-500">
                    {rows.length === 0 ? 'No teachers yet.' : 'No teachers match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row._id} className="border-b border-ink-100 last:border-0">
                    <td className="px-5 py-3 text-ink-900 font-medium">{row.user?.name}</td>
                    <td className="px-5 py-3 text-ink-700">{row.user?.email}</td>
                    <td className="px-5 py-3 text-ink-700">{row.employeeId}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(row.subjects || []).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 text-xs font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{row.phone}</td>
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
          title={editingId ? 'Edit Teacher' : 'Add Teacher'}
          width="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingId && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name">
                    <Input
                      required
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={update('name')}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      required
                      placeholder="teacher@example.com"
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
                Name, email, and password can't be changed here — only teacher-specific
                details below.
              </p>
            )}

            <Field label="Employee ID">
              <Input
                required
                placeholder="Enter employee ID"
                value={form.employeeId}
                onChange={update('employeeId')}
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
              {form.subjects.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.subjects.map((s, i) => (
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
                value={form.qualification}
                onChange={update('qualification')}
              />
            </Field>

            <Field label="Phone">
              <Input placeholder="Enter phone number" value={form.phone} onChange={update('phone')} />
            </Field>

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Teacher'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete teacher?"
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
