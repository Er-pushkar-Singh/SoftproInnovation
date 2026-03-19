import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <circle cx="12" cy="17" r="1"/>
  </svg>
)

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' })
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleChange = (e) => {
    setError('')
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('http://localhost:5000/api/user/register', formData)
      alert('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError('Registration failed. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-wrap">
      <div className="auth-container" style={{ maxWidth: 520 }}>

        {/* Brand */}
        <div className="auth-logo-row">
          <div className="auth-logo-mark">S</div>
          <div className="auth-brand">Softpro<span>Innovation</span></div>
        </div>

        {/* Card */}
        <div className="auth-card-box">
          <h1 className="auth-card-title">Create an <span>account</span></h1>
          <p className="auth-card-subtitle">Join thousands of makers — it&apos;s free and takes 30 seconds</p>

          {error && (
            <div className="error-alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Arjun Sharma"
                  required
                  autoComplete="name"
                />
                <span className="field-icon"><IconUser /></span>
              </div>

              <div className="form-field">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 99999 99999"
                  required
                />
                <span className="field-icon"><IconPhone /></span>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              <span className="field-icon"><IconMail /></span>
            </div>

            <div className="form-field">
              <label htmlFor="password">Create Password</label>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                autoComplete="new-password"
              />
              <span className="field-icon" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? <IconEyeOff /> : <IconEye />}
              </span>
            </div>

            <div className="form-check-row" style={{ marginBottom: '1.5rem' }}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the{' '}
                <a href="#!">Terms &amp; Conditions</a>
                {' '}and{' '}
                <a href="#!">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

          </form>

          <div className="auth-divider">already a member?</div>

          <p className="auth-footer-text">
            Have an account?{' '}
            <Link to="/login">Sign in →</Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register