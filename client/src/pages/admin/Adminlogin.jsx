import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from "../../assets/images/spi.png"
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const Adminlogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setError('')
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', formData)
      if (res.data.msg === 'Login Successfully') {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', 'Admin')
        localStorage.setItem('id', res.data.id)
        localStorage.setItem('name', 'Administrator')
        localStorage.setItem('email', formData.email)
        navigate('/admin/dashboard')
      } else {
        setError(res.data.msg || 'Invalid administrator credentials.')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please check your server status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-page-wrap">

        <div className="auth-container">
          {/* Brand Logo */}
          <div className="auth-logo-row">
            <div className="auth-logo-mark" style={{ background: 'var(--accent, #e05c2a)' }}>
              <img src={logo} alt="sofptorinnovation" />
            </div>
            <div className="auth-brand">Softpro<span>Innovation</span></div>
          </div>

          {/* Card */}
          <div className="auth-card-box">
            <h1 className="auth-card-title">Admin <span>Portal</span></h1>
            <p className="auth-card-subtitle">Sign in to your administration dashboard</p>

            {error && (
              <div className="error-alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@softpro.com"
                  required
                  autoComplete="email"
                />
                <span className="field-icon"><IconMail /></span>
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <span className="field-icon" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? <IconEyeOff /> : <IconEye />}
                </span>
              </div>

              <button type="submit" className="btn-auth" style={{ marginTop: '1.5rem' }} disabled={loading}>
                {loading ? 'Authenticating Admin…' : 'Access Dashboard'}
              </button>

            </form>
          </div>

          <p className="auth-footer-text mt-3" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Authorized access only. All connection attempts and actions are logged for security audits.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Adminlogin