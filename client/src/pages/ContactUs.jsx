import React, { useState, useEffect, useRef } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import axios from 'axios'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', category: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const observerRef = useRef(null)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    const res = await axios.post('http://localhost:5000/api/complaint', formData)
    if (res.data.msg === 'Message sent successfully') {
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', category: '', message: '' })
    }
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  return (
    <>
      <div className="contact-page">
        <Navbar />
        {/* Hero */}
        <div className="contact-hero">
          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="si-breadcrumb" style={{ color: 'rgba(255,255,255,.55)' }}>
              <a href="/" style={{ color: 'var(--accent)' }}>Home</a>
              <span style={{ color: 'rgba(255,255,255,.4)' }}>›</span>
              Contact Us
            </div>
            <h1 className="contact-hero-title">
              We&apos;d Love to <em>Hear</em> from You
            </h1>
            <p className="contact-hero-sub">
              Got a technical question, need help with an order, or just want to say hi?
              We respond to every message within one business day.
            </p>
          </div>
        </div>

        {/* Main content */}
        <section className="si-section">
          <div className="container">
            <div className="row g-5">

              {/* Left — info */}
              <div className="col-lg-4 fade-up">
                <div className="contact-info-card mb-4">
                  <h3 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                    Contact <em>Info</em>
                  </h3>

                  <div className="contact-info-item">
                    <div className="contact-info-icon"><i className="fas fa-map-marker-alt"></i></div>
                    <div>
                      <div className="contact-info-label">Address</div>
                      <div className="contact-info-val">Softpro House <br />
                        3/213, Sec-J, Jankipuram, Kursi Road <br />
                        Near Gudamba Police Station <br />
                        Lucknow - 226021,<br />Uttar Pradesh, India</div>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon"><i className="fa-solid fa-phone"></i></div>
                    <div>
                      <div className="contact-info-label">Phone</div>
                      <div className="contact-info-val">
                        <a href="tel:+916391276203">+91 63912 76203</a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon"><i className="fa-solid fa-envelope"></i></div>
                    <div>
                      <div className="contact-info-label">Email</div>
                      <div className="contact-info-val">
                        <a href="mailto:info@softproinnovation.com">info@softproinnovation.com</a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon"><i className="fa-solid fa-clock"></i></div>
                    <div>
                      <div className="contact-info-label">Business Hours</div>
                      <div className="contact-info-val">Mon – Sat: 9:00 AM – 7:00 PM</div>
                    </div>
                  </div>
                </div>

                {/* Quick help chips */}
                <div className="contact-info-card">
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Quick Help
                  </h4>
                  {[
                    { emoji: '📦', label: 'Track your order', href: '#!' },
                    { emoji: '↩️', label: 'Return & refund policy', href: '#!' },
                    { emoji: '🔧', label: 'Technical support', href: '#!' },
                    { emoji: '💼', label: 'Bulk / B2B orders', href: '#!' },
                  ].map(({ emoji, label, href }) => (
                    <a key={label} href={href} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0', borderBottom: '1px solid var(--border)',
                      color: 'var(--text-secondary)', fontSize: '0.9rem',
                      transition: 'color var(--transition-fast)',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      <span>{emoji}</span>
                      <span>{label}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>→</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right — form */}
              <div className="col-lg-8 fade-up delay-2">
                <div className="contact-form-card">
                  <h3 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
                    Send Us a <em>Message</em>
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>
                    Fill in the form and our team will get back to you within 24 hours.
                  </p>

                  {success && (
                    <div style={{
                      background: 'rgba(40,167,69,.1)', border: '1px solid rgba(40,167,69,.3)',
                      borderRadius: 'var(--radius-md)', padding: '0.9rem 1.2rem',
                      color: '#28a745', fontSize: '0.9rem', marginBottom: '1.5rem',
                      display: 'flex', gap: '0.5rem', alignItems: 'center',
                    }}>
                      ✅ Message sent successfully! We will be in touch soon.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">

                      <div className="col-sm-6">
                        <div className="form-field">
                          <label>Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Arjun Sharma"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="form-field">
                          <label>Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="form-field">
                          <label>Category</label>
                          <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="">Select a topic…</option>
                            <option>Order Inquiry</option>
                            <option>Technical Support</option>
                            <option>Returns & Refunds</option>
                            <option>Bulk / B2B Orders</option>
                            <option>Partnership</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="form-field">
                          <label>Subject</label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Brief summary"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-field">
                          <label>Message</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us how we can help…"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn-auth" disabled={loading}
                          style={{ width: 'auto', padding: '0.85rem 2.5rem' }}>
                          {loading ? 'Sending…' : 'Send Message'}
                        </button>
                      </div>

                    </div>
                  </form>
                </div>

              </div>

            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Contact