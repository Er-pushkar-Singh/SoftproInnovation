import React, { useState } from 'react'
import axios from 'axios'

const EyeIcon = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)           score++
  if (/[A-Z]/.test(pwd))         score++
  if (/[0-9]/.test(pwd))         score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const map = [
    { label: '',       color: '' },
    { label: 'Weak',   color: '#dc3545' },
    { label: 'Fair',   color: '#fd7e14' },
    { label: 'Good',   color: '#f5a623' },
    { label: 'Strong', color: '#28a745' },
  ]
  return { score, ...map[score] }
}

const ChangePassword = () => {
  const [form,    setForm]    = useState({ current: '', newPwd: '', confirm: '' })
  const [show,    setShow]    = useState({ current: false, newPwd: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [alert,   setAlert]   = useState(null)

  const strength = getStrength(form.newPwd)

  const handleChange = (e) => {
    setAlert(null)
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleShow = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.current)                return setAlert({ type: 'error', msg: 'Please enter your current password.' })
    if (form.newPwd.length < 8)      return setAlert({ type: 'error', msg: 'New password must be at least 8 characters.' })
    if (form.newPwd !== form.confirm) return setAlert({ type: 'error', msg: 'New passwords do not match.' })
    if (form.current === form.newPwd) return setAlert({ type: 'error', msg: 'New password must be different from current password.' })

    setLoading(true)
    try {
      // PATCH /api/user/change-password/:id — backend route ke hisab se
      const res = await axios.patch(
        `http://localhost:5000/api/user/change-password/${localStorage.getItem('id')}`,
        {
          oldPassword: form.current,
          newPassword: form.newPwd,
        }
      )

      if (res.data.msg === 'Password changed successfully') {
        setAlert({ type: 'success', msg: 'Password changed successfully! Please login again.' })
        setForm({ current: '', newPwd: '', confirm: '' })
      } else {
        // backend ka exact msg dikhao — "Incorrect old password" etc.
        setAlert({ type: 'error', msg: res.data.msg || 'Failed to change password.' })
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Change <span>Password</span></h1>
          <p className="dash-page-subtitle">Keep your account secure with a strong password</p>
        </div>
      </div>

      <div className="row g-4">

        {/* ── Form ── */}
        <div className="col-lg-6">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">🔐 Update Password</span>
            </div>
            <div className="dash-card-body">

              {alert && (
                <div className={`dash-alert ${alert.type}`}>
                  {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Current password */}
                <div className="dash-field">
                  <label>Current Password</label>
                  <div className="dash-field-wrap">
                    <input
                      type={show.current ? 'text' : 'password'}
                      name="current"
                      value={form.current}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      required
                    />
                    <span className="dash-field-eye" onClick={() => toggleShow('current')}>
                      <EyeIcon show={show.current} />
                    </span>
                  </div>
                </div>

                {/* New password */}
                <div className="dash-field">
                  <label>New Password</label>
                  <div className="dash-field-wrap">
                    <input
                      type={show.newPwd ? 'text' : 'password'}
                      name="newPwd"
                      value={form.newPwd}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      required
                    />
                    <span className="dash-field-eye" onClick={() => toggleShow('newPwd')}>
                      <EyeIcon show={show.newPwd} />
                    </span>
                  </div>

                  {/* Strength bar */}
                  {form.newPwd && (
                    <>
                      <div className="pwd-strength-bar">
                        <div
                          className="pwd-strength-fill"
                          style={{
                            width:      `${(strength.score / 4) * 100}%`,
                            background: strength.color,
                          }}
                        />
                      </div>
                      <div className="pwd-strength-label" style={{ color: strength.color }}>
                        {strength.label && `Password strength: ${strength.label}`}
                      </div>
                    </>
                  )}
                </div>

                {/* Confirm password */}
                <div className="dash-field">
                  <label>Confirm New Password</label>
                  <div className="dash-field-wrap">
                    <input
                      type={show.confirm ? 'text' : 'password'}
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                      required
                    />
                    <span className="dash-field-eye" onClick={() => toggleShow('confirm')}>
                      <EyeIcon show={show.confirm} />
                    </span>
                  </div>
                  {form.confirm && form.newPwd && (
                    <div style={{
                      fontSize: '0.75rem', marginTop: 4, fontWeight: 600,
                      color: form.confirm === form.newPwd ? '#28a745' : '#dc3545',
                    }}>
                      {form.confirm === form.newPwd ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>

                <button type="submit" className="dash-btn-primary" disabled={loading}>
                  {loading ? 'Updating…' : '🔐 Update Password'}
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* ── Tips ── */}
        <div className="col-lg-6">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">🛡️ Password Tips</span>
            </div>
            <div className="dash-card-body">
              {[
                ['✅', 'Use at least 8 characters'],
                ['✅', 'Include uppercase and lowercase letters'],
                ['✅', 'Add numbers and special characters (!@#$%)'],
                ['✅', 'Avoid common words or your name'],
                ['✅', 'Do not reuse old passwords'],
                ['✅', 'Use a unique password for this account'],
              ].map(([icon, tip]) => (
                <div key={tip} style={{
                  display: 'flex', gap: '0.7rem', alignItems: 'flex-start',
                  padding: '0.55rem 0', borderBottom: '1px solid var(--dash-table-border)',
                  fontSize: '0.88rem', color: 'var(--text-secondary)',
                }}>
                  <span>{icon}</span>
                  <span>{tip}</span>
                </div>
              ))}

              
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChangePassword