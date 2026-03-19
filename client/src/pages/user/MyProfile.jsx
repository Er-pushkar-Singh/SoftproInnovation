import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Profile = () => {
  const userId = localStorage.getItem('id')

  const [user,    setUser]    = useState(null)
  const [form,    setForm]    = useState({ name: '', email: '', mobile: '' })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [alert,   setAlert]   = useState(null)
  const [edited,  setEdited]  = useState(false)

  /* ── Fetch user ── */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${userId}`)
        const data = res.data.data
        setUser(data)
        setForm({ name: data.name || '', email: data.email || '', mobile: data.mobile || '' })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setAlert(null)
    setEdited(true)
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  /* ── Update user ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())   return setAlert({ type: 'error', msg: 'Name is required.' })
    if (!form.email.trim())  return setAlert({ type: 'error', msg: 'Email is required.' })
    if (!form.mobile.trim()) return setAlert({ type: 'error', msg: 'Mobile is required.' })

    setSaving(true)
    try {
      const res = await axios.patch(`http://localhost:5000/api/user/${userId}`, {
        name:   form.name,
        email:  form.email,
        mobile: form.mobile,
      })
      if (res.data.msg === 'User details updated successfully') {
        setAlert({ type: 'success', msg: 'Profile updated successfully!' })
        setEdited(false)
        // localStorage update
        localStorage.setItem('name',  form.name)
        localStorage.setItem('email', form.email)
      } else {
        setAlert({ type: 'error', msg: res.data.msg || 'Failed to update.' })
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Something went wrong. Try again.' })
    } finally {
      setSaving(false)
    }
  }

  const initials = form.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
      <p>Loading profile…</p>
    </div>
  )

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">My <span>Profile</span></h1>
          <p className="dash-page-subtitle">Manage your personal information</p>
        </div>
      </div>

      <div className="row g-4">

        {/* ── Left: Avatar Card ── */}
        <div className="col-lg-4">
          <div className="dash-card">
            <div className="dash-card-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>

              {/* Avatar */}
              <div style={{
                width:         96, height: 96,
                borderRadius:  '50%',
                background:    'var(--accent)',
                display:       'flex', alignItems: 'center', justifyContent: 'center',
                fontSize:      '2.2rem', fontWeight: 700, color: '#fff',
                fontFamily:    'var(--font-display)',
                boxShadow:     '0 6px 24px rgba(224,92,42,.4)',
                margin:        '0 auto 1.2rem',
              }}>
                {initials}
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {form.name || '—'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {form.email || '—'}
              </div>

              <span style={{
                display:       'inline-block', marginTop: 12,
                fontSize:      '0.65rem', fontWeight: 700,
                letterSpacing: '.08em', textTransform: 'uppercase',
                background:    'rgba(224,92,42,.15)', color: 'var(--accent)',
                border:        '1px solid rgba(224,92,42,.25)',
                borderRadius:  20, padding: '3px 14px',
              }}>Member</span>

              {/* Info rows */}
              <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                {[
                  { icon: '📧', label: 'Email',  val: form.email  },
                  { icon: '📱', label: 'Mobile', val: form.mobile },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    padding: '0.6rem 0', borderBottom: '1px solid var(--dash-card-border)',
                  }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{row.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em' }}>{row.label}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: 2, wordBreak: 'break-all' }}>{row.val || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── Right: Edit Form ── */}
        <div className="col-lg-8">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">✏️ Edit Profile</span>
              {edited && (
                <span style={{ fontSize: '0.75rem', color: '#f5a623', fontWeight: 600 }}>
                  ● Unsaved changes
                </span>
              )}
            </div>
            <div className="dash-card-body">

              {alert && (
                <div className={`dash-alert ${alert.type}`}>
                  {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                <div className="dash-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="dash-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="dash-field">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    className="dash-btn-primary"
                    disabled={saving || !edited}
                  >
                    {saving ? '⏳ Saving…' : '💾 Save Changes'}
                  </button>
                  {edited && (
                    <button
                      type="button"
                      className="dash-btn-outline"
                      onClick={() => {
                        setForm({ name: user.name || '', email: user.email || '', mobile: user.mobile || '' })
                        setEdited(false)
                        setAlert(null)
                      }}
                    >
                      Discard
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile