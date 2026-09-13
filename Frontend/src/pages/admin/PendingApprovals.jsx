import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../lib/api.js'

export default function PendingApprovals() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approvingId, setApprovingId] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/user/pending')
      setRows(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load pending users.')
    } finally {
      setLoading(false)
    }
  }

  async function approve(id) {
    setApprovingId(id)
    try {
      await api.put(`/user/${id}/approve`)
      setRows((r) => r.filter((row) => row._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not approve user.')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-ink-900">Pending Approvals</h1>
      <p className="text-sm text-ink-500 mt-1">
        New student and teacher registrations waiting for approval.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-ink-500">Loading...</p>
      ) : rows.length === 0 ? (
        <Card className="mt-4 p-10 text-center text-sm text-ink-500">
          No pending registrations.
        </Card>
      ) : (
        <div className="space-y-3 mt-4">
          {rows.map((row) => (
            <Card key={row._id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-900">{row.name}</p>
                <p className="text-xs text-ink-500">
                  {row.email} · <span className="capitalize">{row.role}</span>
                </p>
              </div>
              <Button
                onClick={() => approve(row._id)}
                disabled={approvingId === row._id}
              >
                {approvingId === row._id ? 'Approving...' : 'Approve'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
