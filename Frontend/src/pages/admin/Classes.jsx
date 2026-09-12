import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import { Field, Select, Input } from '../../components/ui/Field.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'

const emptyForm = { name: '', section: '', academicYear: '2024-2025', classTeacher: '' }

export default function Classes() {
  const { user } = useAuth()
  const canManage = user?.role === 'admin'

  const [rows, setRows] = useState([])
  const [teacherOptions, setTeacherOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadClassrooms()
    // Needed for the "Class Teacher" dropdown — GET /api/teacher has no role
    // restriction, any logged-in user can call it.
    api
      .get('/teacher')
      .then((res) => setTeacherOptions(res.data.data))
      .catch(() => {})
  }, [])

  async function loadClassrooms() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/classroom')
      setRows(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load classrooms.')
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
      name: row.name,
      section: row.section,
      academicYear: row.academicYear,
      classTeacher: row.classTeacher?._id || '',
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
        await api.put(`/classroom/${editingId}`, form)
      } else {
        await api.post('/classroom', form)
      }
      await loadClassrooms()
      setOpen(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save classroom.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    setDeleting(true)
    try {
      await api.delete(`/classroom/${deleteTarget._id}`)
      setRows((r) => r.filter((row) => row._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete classroom.')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [r.name, r.section, r.academicYear, r.classTeacher?.user?.name]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    )
  }, [rows, search])

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Classrooms</h1>
          <p className="text-sm text-ink-500 mt-1">Manage all classrooms and sections.</p>
        </div>
        {canManage && (
          <Button icon={Plus} onClick={openAddModal}>
            Add Classroom
          </Button>
        )}
      </div>

      <div className="mt-6 relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <Input
          placeholder="Search classes..."
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
                <th className="font-medium px-5 py-3">Class</th>
                <th className="font-medium px-5 py-3">Section</th>
                <th className="font-medium px-5 py-3">Academic Year</th>
                <th className="font-medium px-5 py-3">Class Teacher</th>
                {canManage && <th className="font-medium px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-ink-500">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-ink-500">
                    {rows.length === 0 ? 'No classrooms yet.' : 'No classes match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row._id} className="border-b border-ink-100 last:border-0">
                    <td className="px-5 py-3 text-ink-900 font-medium">{row.name}</td>
                    <td className="px-5 py-3 text-ink-700">{row.section}</td>
                    <td className="px-5 py-3 text-ink-700">{row.academicYear}</td>
                    <td className="px-5 py-3 text-ink-700">{row.classTeacher?.user?.name || '—'}</td>
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
          title={editingId ? 'Edit Classroom' : 'Add Classroom'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Class Name">
                <Select required value={form.name} onChange={update('name')}>
                  <option value="">Select Class</option>
                  {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Section">
                <Select required value={form.section} onChange={update('section')}>
                  <option value="">Select Section</option>
                  {['A', 'B', 'C'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Academic Year">
              <Select value={form.academicYear} onChange={update('academicYear')}>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </Select>
            </Field>

            <Field label="Class Teacher">
              <Select required value={form.classTeacher} onChange={update('classTeacher')}>
                <option value="">Select Teacher</option>
                {teacherOptions.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.user?.name}
                  </option>
                ))}
              </Select>
            </Field>

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Classroom'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete classroom?"
        message={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.name} ${deleteTarget.section}. This can't be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
