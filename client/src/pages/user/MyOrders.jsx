import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ALL_STEPS   = ['pending', 'confirmed', 'shipped', 'dispatched', 'outForDelivery', 'delivered']
const STEP_ICONS  = { pending: '📋', confirmed: '✅', shipped: '🚚', dispatched: '📤', outForDelivery: '🛵', delivered: '📦' }
const STEP_LABELS = { pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped', dispatched: 'Dispatched', outForDelivery: 'Out for Delivery', delivered: 'Delivered' }

const STATUS_COLORS = {
  pending:        { color: '#f5a623', bg: 'rgba(245,166,35,.12)',  border: 'rgba(245,166,35,.3)'  },
  confirmed:      { color: '#0aa8c7', bg: 'rgba(13,202,240,.12)', border: 'rgba(13,202,240,.3)'  },
  shipped:        { color: '#6f42c1', bg: 'rgba(111,66,193,.12)', border: 'rgba(111,66,193,.3)'  },
  dispatched:     { color: '#fd7e14', bg: 'rgba(253,126,20,.12)', border: 'rgba(253,126,20,.3)'  },
  outForDelivery: { color: '#20c997', bg: 'rgba(32,201,151,.12)', border: 'rgba(32,201,151,.3)'  },
  delivered:      { color: '#28a745', bg: 'rgba(40,167,69,.12)',  border: 'rgba(40,167,69,.3)'   },
  cancelled:      { color: '#dc3545', bg: 'rgba(220,53,69,.12)',  border: 'rgba(220,53,69,.3)'   },
}

const StatusPill = ({ status }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '.05em', textTransform: 'uppercase',
      padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {STEP_LABELS[status] || status}
    </span>
  )
}

const MyOrders = () => {
  const userId = localStorage.getItem('id')

  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/user/${userId}`)
        setOrders(res.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === filter)

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
      <p>Loading your orders…</p>
    </div>
  )

  /* ── Order detail view ── */
  if (selected) {
    const o = selected
    const currentStepIdx = ALL_STEPS.indexOf(o.orderStatus)
    return (
      <div>
        <button className="dash-btn-outline mb-4" onClick={() => setSelected(null)}>
          ← Back to Orders
        </button>

        <div className="dash-page-header">
          <div>
            <h1 className="dash-page-title">Order <span>#{o.orderId}</span></h1>
            <p className="dash-page-subtitle">
              Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <StatusPill status={o.orderStatus} />
        </div>

        {/* Tracking steps */}
        {o.orderStatus !== 'cancelled' && (
          <div className="dash-card mb-4">
            <div className="dash-card-header">
              <span className="dash-card-title">📍 Order Tracking</span>
            </div>
            <div className="dash-card-body">
              <div className="order-steps">
                {ALL_STEPS.map((step, idx) => {
                  const isDone    = idx <= currentStepIdx
                  const isCurrent = idx === currentStepIdx
                  return (
                    <div key={step} className={`order-step${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}>
                      <div className="order-step-dot">
                        {isDone ? '✓' : STEP_ICONS[step]}
                      </div>
                      <div className="order-step-label">{STEP_LABELS[step]}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Payment + Order info */}
        <div className="row g-3">
          <div className="col-md-7">
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">💳 Payment Details</span>
              </div>
              <div className="dash-card-body">
                <div className="cart-summary-row">
                  <span>Payment Method</span>
                  <span style={{ fontWeight: 600 }}>
                    {o.paymentMethod === 'online' ? '📱 Online' : '💵 Cash on Delivery'}
                  </span>
                </div>
                <div className="cart-summary-row">
                  <span>Payment Status</span>
                  <span style={{ fontWeight: 700, color: o.paymentStatus === 'completed' ? '#28a745' : '#f5a623' }}>
                    {o.paymentStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                  </span>
                </div>
                {o.transactionId && (
                  <div className="cart-summary-row">
                    <span>Transaction ID</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.82rem' }}>
                      {o.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">📦 Order Info</span>
              </div>
              <div className="dash-card-body">
                <div className="cart-summary-row">
                  <span>Order ID</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>#{o.orderId}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Status</span>
                  <StatusPill status={o.orderStatus} />
                </div>
                <div className="cart-summary-row">
                  <span>Date</span>
                  <span>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Orders list ── */
  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">My <span>Orders</span></h1>
          <p className="dash-page-subtitle">Track and manage all your purchases</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        {['all', ...ALL_STEPS, 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.38rem 0.85rem', borderRadius: 20, fontSize: '0.76rem',
            fontWeight: 700, cursor: 'pointer', border: '2px solid',
            borderColor: filter === f ? '#e05c2a' : '#888',
            background:  filter === f ? '#e05c2a' : '#f0f0f0',
            color:       filter === f ? '#ffffff' : '#222222',
            transition: 'all 0.15s',
          }}>
            {f === 'all' ? `All (${orders.length})` : STEP_LABELS[f] || f}
          </button>
        ))}
      </div>

      {/* Empty */}
      {orders.length === 0 ? (
        <div className="dash-card">
          <div className="cart-empty">
            <span className="cart-empty-icon">📦</span>
            <div className="cart-empty-title">No orders yet</div>
            <p className="cart-empty-desc">You haven't placed any orders. Start shopping!</p>
          </div>
        </div>
      ) : (
        <div className="dash-card">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Pay Status</th>
                  <th>Order Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No orders found.
                    </td>
                  </tr>
                ) : filtered.map((o,i) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>#{i+1}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {o.paymentMethod === 'online' ? '📱 Online' : '💵 COD'}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                        color: o.paymentStatus === 'completed' ? '#28a745' : '#f5a623',
                      }}>
                        ● {o.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td><StatusPill status={o.orderStatus} /></td>
                    <td>
                      <button
                        className="dash-btn-outline"
                        style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}
                        onClick={() => setSelected(o)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders