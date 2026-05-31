import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const STATUS_LABELS = {
  pending:        { label: 'Pending',         color: '#f5a623', bg: 'rgba(245,166,35,.12)',  border: 'rgba(245,166,35,.3)'  },
  confirmed:      { label: 'Confirmed',        color: '#0aa8c7', bg: 'rgba(13,202,240,.12)', border: 'rgba(13,202,240,.3)'  },
  shipped:        { label: 'Shipped',          color: '#6f42c1', bg: 'rgba(111,66,193,.12)', border: 'rgba(111,66,193,.3)'  },
  dispatched:     { label: 'Dispatched',       color: '#fd7e14', bg: 'rgba(253,126,20,.12)', border: 'rgba(253,126,20,.3)'  },
  outForDelivery: { label: 'Out for Delivery', color: '#20c997', bg: 'rgba(32,201,151,.12)', border: 'rgba(32,201,151,.3)'  },
  delivered:      { label: 'Delivered',        color: '#28a745', bg: 'rgba(40,167,69,.12)',  border: 'rgba(40,167,69,.3)'   },
  cancelled:      { label: 'Cancelled',        color: '#dc3545', bg: 'rgba(220,53,69,.12)',  border: 'rgba(220,53,69,.3)'   },
}

const STEPS = ['pending','confirmed','shipped','dispatched','outForDelivery','delivered']

const StatusPill = ({ status }) => {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pending
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.05em',
      textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{s.label}</span>
  )
}

const UserDashboardHome = () => {
  const userId   = localStorage.getItem('id')
  const navigate = useNavigate()

  const [user,    setUser]    = useState(null)
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/${userId}`),
          axios.get(`http://localhost:5000/api/order/user/${userId}`),
        ])
        setUser(userRes.data.data)
        setOrders(orderRes.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const latestOrder   = orders[0] || null
  const currentStepIdx = latestOrder ? STEPS.indexOf(latestOrder.orderStatus) : -1

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
      <p>Loading dashboard…</p>
    </div>
  )

  return (
    <div>
      {/* Page Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Welcome, <span>{user?.name || 'User'}</span> 👋</h1>
          <p className="dash-page-subtitle">Here's what's happening with your account</p>
        </div>
      </div>

      <div className="row g-4">

        {/* ── Card 1: User Profile ── */}
        <div className="col-lg-4">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <span className="dash-card-title">👤 My Profile</span>
              <Link to="/user/dashboard/profile" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                Edit →
              </Link>
            </div>
            <div className="dash-card-body">

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', fontWeight: 700, color: '#fff',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 16px rgba(224,92,42,.35)',
                  flexShrink: 0,
                }}>
                  {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {user?.name || '—'}
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '.08em',
                    textTransform: 'uppercase', background: 'rgba(224,92,42,.15)',
                    color: 'var(--accent)', border: '1px solid rgba(224,92,42,.25)',
                    borderRadius: 20, padding: '2px 10px', marginTop: 4, display: 'inline-block',
                  }}>Member</span>
                </div>
              </div>

              {/* Details */}
              {[
                { icon: '📧', label: 'Email',  val: user?.email  || '—' },
                { icon: '📱', label: 'Mobile', val: user?.mobile || '—' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.65rem 0', borderBottom: '1px solid var(--dash-card-border)',
                }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{row.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{row.label}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: 2, wordBreak: 'break-all' }}>{row.val}</div>
                  </div>
                </div>
              ))}

              {/* Quick links */}
              <div style={{ display: 'flex', gap: 8, marginTop: '1.2rem', flexWrap: 'wrap' }}>
                <Link to="/user/dashboard/orders" style={{
                  flex: 1, textAlign: 'center', padding: '0.5rem',
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                  border: '1px solid rgba(224,92,42,.2)', textDecoration: 'none',
                }}>📦 Orders</Link>
                <Link to="/user/dashboard/cart" style={{
                  flex: 1, textAlign: 'center', padding: '0.5rem',
                  background: 'var(--dash-table-head)', color: 'var(--text-primary)',
                  borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                  border: '1px solid var(--dash-card-border)', textDecoration: 'none',
                }}>🛒 Cart</Link>
                <Link to="/user/dashboard/changepassword" style={{
                  flex: 1, textAlign: 'center', padding: '0.5rem',
                  background: 'var(--dash-table-head)', color: 'var(--text-primary)',
                  borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                  border: '1px solid var(--dash-card-border)', textDecoration: 'none',
                }}>🔐 Password</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: Recent Order ── */}
        <div className="col-lg-8">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <span className="dash-card-title">🕐 Recent Order</span>
              <Link to="/user/dashboard/orders" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                View All →
              </Link>
            </div>
            <div className="dash-card-body">

              {!latestOrder ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 8 }}>📦</div>
                  <p style={{ marginBottom: '1rem' }}>No orders yet</p>
                  <Link to="/products" className="dash-btn-primary" style={{ textDecoration: 'none' }}>
                    Shop Now →
                  </Link>
                </div>
              ) : (
                <>
                  {/* Order info */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem',
                    padding: '0.9rem 1rem',
                    background: 'var(--dash-table-head)',
                    borderRadius: 12, border: '1px solid var(--dash-card-border)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Order ID</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>#{latestOrder.orderId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Date</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {new Date(latestOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Payment</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {latestOrder.paymentMethod === 'online' ? '📱 Online' : '💵 COD'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Status</div>
                      <StatusPill status={latestOrder.orderStatus} />
                    </div>
                  </div>

                  {/* Tracking stepper */}
                  {latestOrder.orderStatus !== 'cancelled' && (
                    <>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1rem' }}>
                        📍 Order Tracking
                      </div>
                      <div className="order-steps">
                        {STEPS.map((step, idx) => {
                          const isDone    = idx <= currentStepIdx
                          const isCurrent = idx === currentStepIdx
                          return (
                            <div key={step} className={`order-step${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}>
                              <div className="order-step-dot">
                                {isDone ? '✓' : (idx + 1)}
                              </div>
                              <div className="order-step-label">
                                {STATUS_LABELS[step]?.label || step}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}

                  {latestOrder.orderStatus === 'cancelled' && (
                    <div className="dash-alert error">
                      ❌ This order was cancelled.
                    </div>
                  )}

                  {/* Total orders summary */}
                  <div style={{
                    display: 'flex', gap: 12, marginTop: '1.5rem', flexWrap: 'wrap',
                  }}>
                    {[
                      { label: 'Total Orders',  val: orders.length,                                        color: 'var(--accent)' },
                      { label: 'Delivered',      val: orders.filter(o => o.orderStatus === 'delivered').length,  color: '#28a745' },
                      { label: 'Pending',        val: orders.filter(o => o.orderStatus === 'pending').length,    color: '#f5a623' },
                      { label: 'Cancelled',      val: orders.filter(o => o.orderStatus === 'cancelled').length,  color: '#dc3545' },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        flex: '1', minWidth: 80, textAlign: 'center',
                        padding: '0.8rem 0.5rem',
                        background: 'var(--dash-table-head)',
                        borderRadius: 10, border: '1px solid var(--dash-card-border)',
                      }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: stat.color }}>{stat.val}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserDashboardHome