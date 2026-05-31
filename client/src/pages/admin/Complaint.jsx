import React, { useState, useEffect } from 'react'
import axios from 'axios'

const STATUS_COLORS = {
  pending:  { color: '#f5a623', bg: 'rgba(245,166,35,.12)',  border: 'rgba(245,166,35,.3)'  },
  replied:  { color: '#28a745', bg: 'rgba(40,167,69,.12)',   border: 'rgba(40,167,69,.3)'   },
  closed:   { color: '#6c757d', bg: 'rgba(108,117,125,.12)', border: 'rgba(108,117,125,.3)' },
}

const StatusPill = ({ status }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.05em',
      textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{status}</span>
  )
}

const Complaint = () => {
  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [selected,   setSelected]   = useState(null)   // complaint open in modal
  const [reply,      setReply]      = useState('')
  const [sending,    setSending]    = useState(false)
  const [filter,     setFilter]     = useState('all')
  const [search,     setSearch]     = useState('')

  /* ── Fetch all ── */
  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/complaint')
      setComplaints(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComplaints() }, [])

  /* ── Reply ── */
  const handleReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    try {
      await axios.patch(`http://localhost:5000/api/complaint/reply/${selected._id}`, { reply })
      setComplaints(prev => prev.map(c =>
        c._id === selected._id ? { ...c, reply, status: 'replied' } : c
      ))
      setSelected(prev => ({ ...prev, reply, status: 'replied' }))
      setReply('')
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return
    try {
      await axios.delete(`http://localhost:5000/api/complaint/${id}`)
      setComplaints(prev => prev.filter(c => c._id !== id))
      if (selected?._id === id) setSelected(null)
    } catch (err) {
      console.error(err)
    }
  }

  /* ── Filter + Search ── */
  const filtered = complaints.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch = search === '' ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    total:   complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    replied: complaints.filter(c => c.status === 'replied').length,
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⏳</div>
      <p>Loading complaints…</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Customer <span>Complaints</span></h1>
          <p className="dash-page-subtitle">View, reply and manage customer messages</p>
        </div>
        <button className="dash-btn-outline" onClick={fetchComplaints}>🔄 Refresh</button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total',   num: stats.total,   cls: 's1', icon: '📩' },
          { label: 'Pending', num: stats.pending, cls: 's2', icon: '⏳' },
          { label: 'Replied', num: stats.replied, cls: 's3', icon: '✅' },
        ].map(s => (
          <div className="col-4" key={s.label}>
            <div className={`dash-stat-card ${s.cls}`}>
              <span className="dash-stat-icon">{s.icon}</span>
              <div className="dash-stat-num">{s.num}</div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', minWidth: 220, maxWidth: 320 }}>
          <input
            type="text"
            placeholder="Search name, email, subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'var(--dash-input-bg)',
              border: '1.5px solid var(--dash-input-border)',
              borderRadius: 10, padding: '0.6rem 0.9rem',
              fontSize: '0.85rem', color: 'var(--text-primary)', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'pending', 'replied', 'closed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.38rem 0.85rem', borderRadius: 20, fontSize: '0.76rem',
              fontWeight: 700, cursor: 'pointer', border: '2px solid',
              borderColor: filter === f ? '#e05c2a' : '#888',
              background:  filter === f ? '#e05c2a' : '#f0f0f0',
              color:       filter === f ? '#fff'    : '#222',
              transition: 'all 0.15s', textTransform: 'capitalize',
            }}>{f === 'all' ? `All (${complaints.length})` : f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="dash-card">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No complaints found.
          </div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.email}</td>
                    <td style={{ fontSize: '0.82rem' }}>{c.category || '—'}</td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.subject}
                    </td>
                    <td><StatusPill status={c.status} /></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => { setSelected(c); setReply(c.reply || '') }}
                          style={{
                            background: 'var(--accent)', color: '#fff',
                            border: 'none', borderRadius: 8,
                            padding: '0.35rem 0.75rem', fontSize: '0.73rem',
                            fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          {c.reply ? '✏️ Edit' : '💬 Reply'}
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          style={{
                            background: 'rgba(220,53,69,.1)', color: '#dc3545',
                            border: '1px solid rgba(220,53,69,.25)', borderRadius: 8,
                            padding: '0.35rem 0.65rem', fontSize: '0.73rem',
                            fontWeight: 600, cursor: 'pointer',
                          }}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Reply Modal ── */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          <div style={{
            background: 'var(--bg-card, #ffffff)', border: '1.5px solid var(--border, #e0ddd6)',
            borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 560,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,.25)',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-primary, #1a1a2e)', margin: 0 }}>
                  {selected.subject}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {selected.name} · {selected.email}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: 1,
              }}>✕</button>
            </div>

            {/* Status + Category */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <StatusPill status={selected.status} />
              {selected.category && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px',
                  borderRadius: 20, background: 'var(--dash-table-head)',
                  color: 'var(--text-secondary)', border: '1px solid var(--dash-card-border)',
                }}>{selected.category}</span>
              )}
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {new Date(selected.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Message */}
            <div style={{
              background: 'var(--section-alt, #f5f3ee)', border: '1px solid var(--border, #e0ddd6)',
              borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                Customer Message
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary, #1a1a2e)', lineHeight: 1.7, margin: 0 }}>
                {selected.message}
              </p>
            </div>

            {/* Previous reply */}
            {selected.reply && (
              <div style={{
                background: 'rgba(40,167,69,.06)', border: '1px solid rgba(40,167,69,.2)',
                borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#28a745', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                  Previous Reply
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
                  {selected.reply}
                </p>
              </div>
            )}

            {/* Reply textarea */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                {selected.reply ? 'Update Reply' : 'Write Reply'}
              </label>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Write your reply here…"
                rows={4}
                style={{
                  width: '100%', background: 'var(--bg-primary, #f5f3ee)',
                  border: '1.5px solid var(--border, #e0ddd6)',
                  borderRadius: 10, padding: '0.75rem 1rem',
                  fontSize: '0.9rem', color: 'var(--text-primary, #1a1a2e)',
                  outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--dash-input-border)'}
              />
            </div>

            {/* Modal actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setSelected(null)} className="dash-btn-outline">
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={sending || !reply.trim()}
                className="dash-btn-primary"
              >
                {sending ? '⏳ Sending…' : '📨 Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Complaint