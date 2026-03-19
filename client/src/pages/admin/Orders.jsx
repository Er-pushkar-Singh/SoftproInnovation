import React, { useState, useEffect } from 'react'
import axios from 'axios'

const STATUS_FLOW = ['pending', 'confirmed', 'shipped', 'dispatched', 'outForDelivery', 'delivered']

const STATUS_LABELS = {
  pending:        { label: 'Pending',          color: '#f5a623', bg: 'rgba(245,166,35,.12)',  border: 'rgba(245,166,35,.3)'  },
  confirmed:      { label: 'Confirmed',         color: '#0aa8c7', bg: 'rgba(13,202,240,.12)', border: 'rgba(13,202,240,.3)'  },
  shipped:        { label: 'Shipped',           color: '#6f42c1', bg: 'rgba(111,66,193,.12)', border: 'rgba(111,66,193,.3)'  },
  dispatched:     { label: 'Dispatched',        color: '#fd7e14', bg: 'rgba(253,126,20,.12)', border: 'rgba(253,126,20,.3)'  },
  outForDelivery: { label: 'Out for Delivery',  color: '#20c997', bg: 'rgba(32,201,151,.12)', border: 'rgba(32,201,151,.3)'  },
  delivered:      { label: 'Delivered',         color: '#28a745', bg: 'rgba(40,167,69,.12)',  border: 'rgba(40,167,69,.3)'   },
  cancelled:      { label: 'Cancelled',         color: '#dc3545', bg: 'rgba(220,53,69,.12)',  border: 'rgba(220,53,69,.3)'   },
}

const PAYMENT_LABELS = {
  cod:    { label: 'Cash on Delivery', icon: '💵' },
  online: { label: 'Online',           icon: '📱' },
}

const PAYMENT_STATUS = {
  pending:   { label: 'Pending',   color: '#f5a623' },
  completed: { label: 'Completed', color: '#28a745' },
  failed:    { label: 'Failed',    color: '#dc3545' },
}

const StatusPill = ({ status }) => {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.05em',
      textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

const Orders = () => {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState(null)
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/order/orders')
      setOrders(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current)
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return null
    return STATUS_FLOW[idx + 1]
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      const order = orders.find(o => o._id === orderId)
      // COD + delivered => paymentStatus bhi completed ho jaye
      const isCoD = order?.paymentMethod === 'cod'
      const body  = {
        orderStatus: newStatus,
        ...(isCoD && newStatus === 'delivered' ? { paymentStatus: 'completed' } : {}),
      }
      await axios.patch(`http://localhost:5000/api/order/status/${orderId}`, body)
      setOrders(prev => prev.map(o =>
        o._id === orderId
          ? { ...o, orderStatus: newStatus, ...(isCoD && newStatus === 'delivered' ? { paymentStatus: 'completed' } : {}) }
          : o
      ))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return
    setUpdating(orderId)
    try {
      await axios.patch(`http://localhost:5000/api/order/status/${orderId}`, {
        orderStatus: 'cancelled',
      })
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o
      ))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.orderStatus === filter
    const matchSearch = search === '' ||
      String(o.orderId).toLowerCase().includes(search.toLowerCase()) ||
      String(o.userId).toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.orderStatus === 'pending').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
      <p>Loading orders…</p>
    </div>
  )

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">All <span>Orders</span></h1>
          <p className="dash-page-subtitle">Manage and update customer orders</p>
        </div>
        <button className="dash-btn-outline" onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Orders', num: stats.total,     cls: 's1', icon: '📦' },
          { label: 'Pending',      num: stats.pending,   cls: 's2', icon: '⏳' },
          { label: 'Delivered',    num: stats.delivered, cls: 's3', icon: '✅' },
          { label: 'Cancelled',    num: stats.cancelled, cls: 's4', icon: '❌' },
        ].map(s => (
          <div className="col-6 col-lg-3" key={s.label}>
            <div className={`dash-stat-card ${s.cls}`}>
              <span className="dash-stat-icon">{s.icon}</span>
              <div className="dash-stat-num">{s.num}</div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', minWidth: 220, maxWidth: 320 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Order ID or User ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: '2rem',
              background: 'var(--dash-input-bg)', border: '1.5px solid var(--dash-input-border)',
              borderRadius: 10, padding: '0.6rem 0.9rem 0.6rem 2rem',
              fontSize: '0.85rem', color: 'var(--text-primary)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', ...STATUS_FLOW, 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(prev => prev === f ? 'all' : f)}
              style={{
                padding: '0.38rem 0.85rem', borderRadius: 20, fontSize: '0.76rem',
                fontWeight: 700, cursor: 'pointer', border: '2px solid',
                borderColor: filter === f ? '#e05c2a' : '#888',
                background:  filter === f ? '#e05c2a' : '#f0f0f0',
                color:       filter === f ? '#ffffff' : '#222222',
                transition:  'all 0.15s', textTransform: 'capitalize',
                boxShadow:   filter === f ? '0 2px 8px rgba(224,92,42,.4)' : 'none',
              }}
            >
              {f === 'all' ? `All (${orders.length})` : STATUS_LABELS[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="dash-card">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No orders found.
          </div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Payment Method</th>
                  <th>Pay Status</th>
                  <th>Order Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const isUpdating  = updating === order._id
                  const nextStatus  = getNextStatus(order.orderStatus)
                  const isCancelled = order.orderStatus === 'cancelled'
                  const isDelivered = order.orderStatus === 'delivered'
                  const payInfo     = PAYMENT_LABELS[order.paymentMethod] || PAYMENT_LABELS.cod
                  const payStatus   = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending
                  const isExpanded  = expanded === order._id

                  return (
                    <React.Fragment key={order._id}>
                      <tr style={{ opacity: isUpdating ? 0.55 : 1, transition: 'opacity 0.2s' }}>

                        {/* Order ID — click to expand */}
                        <td>
                          <button onClick={() => setExpanded(isExpanded ? null : order._id)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontWeight: 700, color: 'var(--accent)',
                            fontFamily: 'var(--font-display)', fontSize: '0.92rem', padding: 0,
                          }}>
                            #{order.orderId} {isExpanded ? '▲' : '▼'}
                          </button>
                        </td>

                        {/* User ID — short */}
                        <td>
                          <span style={{
                            fontSize: '0.73rem', color: 'var(--text-muted)',
                            fontFamily: 'monospace', background: 'var(--dash-table-head)',
                            padding: '2px 7px', borderRadius: 6,
                          }}>
                            …{String(order.userId).slice(-8)}
                          </span>
                        </td>

                        {/* Payment method */}
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {payInfo.icon} {payInfo.label}
                          </span>
                        </td>

                        {/* Payment status */}
                        <td>
                          <span style={{
                            fontSize: '0.75rem', fontWeight: 700,
                            textTransform: 'uppercase', color: payStatus.color,
                          }}>
                            ● {payStatus.label}
                          </span>
                        </td>

                        {/* Order status */}
                        <td><StatusPill status={order.orderStatus} /></td>

                        {/* Date */}
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>

                            {/* → Next status */}
                            {nextStatus && !isCancelled && (
                              <button className='btn btn-primary'
                                onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                disabled={isUpdating}
                                 style={{
                                  background: 'rgba(169, 18, 183, 0.1)', color: '#1a098d',
                                  border: '1px solid rgba(16, 158, 40, 0.25)', borderRadius: 8,
                                  padding: '0.35rem 0.65rem', fontSize: '0.73rem',
                                  fontWeight: 600, cursor: isUpdating ? 'not-allowed' : 'pointer',
                                }}
                              >
                                → {STATUS_LABELS[nextStatus]?.label}
                              </button>
                            )}

                            {/* Delivered — done badge */}
                            {isDelivered && (
                              <span style={{
                                fontSize: '0.73rem', fontWeight: 700, color: '#28a745',
                                padding: '0.35rem 0.75rem', borderRadius: 8,
                                background: 'rgba(40,167,69,.1)', border: '1px solid rgba(40,167,69,.25)',
                              }}>✓ Done</span>
                            )}

                            {/* Cancel */}
                            {!isCancelled && !isDelivered && (
                              <button
                                onClick={() => handleCancel(order._id)}
                                disabled={isUpdating}
                                style={{
                                  background: 'rgba(220,53,69,.1)', color: '#dc3545',
                                  border: '1px solid rgba(220,53,69,.25)', borderRadius: 8,
                                  padding: '0.35rem 0.65rem', fontSize: '0.73rem',
                                  fontWeight: 600, cursor: isUpdating ? 'not-allowed' : 'pointer',
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded details row */}
                      {isExpanded && (
                        <tr style={{ background: 'var(--dash-table-row-hover)' }}>
                          <td colSpan={7} style={{ padding: '0.8rem 1.2rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Full User ID: </span>
                                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{order.userId}</span>
                              </div>
                              {order.transactionId && (
                                <div>
                                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Transaction ID: </span>
                                  <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{order.transactionId}</span>
                                </div>
                              )}
                              <div>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Payment: </span>
                                <span style={{ color: 'var(--text-primary)' }}>
                                  {PAYMENT_LABELS[order.paymentMethod]?.label} —{' '}
                                  <span style={{ color: PAYMENT_STATUS[order.paymentStatus]?.color, fontWeight: 700 }}>
                                    {PAYMENT_STATUS[order.paymentStatus]?.label}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default Orders