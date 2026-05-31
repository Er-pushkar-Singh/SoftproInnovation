import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/user')
      setUsers(res.data.data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"? This action is irreversible.`)) {
      return
    }
    setDeletingId(id)
    try {
      const res = await axios.delete(`http://localhost:5000/api/user/${id}`)
      alert(res.data.msg || 'User deleted successfully.')
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete user. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredUsers = users.filter(u =>
    String(u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    String(u.mobile || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <p>Loading user database directory…</p>
      </div>
    )
  }

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Users <span>List</span></h1>
          <p className="dash-page-subtitle">View, search, and manage registered store customer accounts</p>
        </div>
        <button className="dash-btn-outline" onClick={fetchUsers}>🔄 Refresh Directory</button>
      </div>

      {/* Search Input Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: 260, maxWidth: 360, flex: 1 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or mobile number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: '2.2rem',
              background: 'var(--dash-input-bg)', border: '1.5px solid var(--dash-input-border)',
              borderRadius: 10, padding: '0.65rem 0.9rem 0.65rem 2.2rem',
              fontSize: '0.88rem', color: 'var(--text-primary)', outline: 'none',
              transition: 'border-color 0.18s',
            }}
          />
        </div>
      </div>

      {/* Users Card Table */}
      <div className="dash-card">
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            No registered users found matching your search.
          </div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                  const isDeleting = deletingId === user._id

                  return (
                    <tr key={user._id} style={{ opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                      <td>{index + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: '50%',
                            background: '#00d4ff', color: '#0a0a14',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,212,255,.2)'
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: …{String(user._id).slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{user.email}</td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{user.mobile || 'N/A'}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          disabled={isDeleting}
                          className="dash-btn-danger"
                          style={{
                            padding: '0.4rem 0.8rem', fontSize: '0.75rem',
                            borderRadius: 8, cursor: isDeleting ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isDeleting ? 'Deleting…' : 'Delete Account'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users