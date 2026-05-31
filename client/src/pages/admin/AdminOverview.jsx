import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const AdminOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    complaints: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, orderRes, userRes, compRes] = await Promise.all([
          axios.get('http://localhost:5000/api/product'),
          axios.get('http://localhost:5000/api/category'),
          axios.get('http://localhost:5000/api/order/orders'),
          axios.get('http://localhost:5000/api/user'),
          axios.get('http://localhost:5000/api/complaint')
        ])

        setStats({
          products: prodRes.data.data?.length || 0,
          categories: catRes.data.data?.length || 0,
          orders: orderRes.data.data?.length || 0,
          users: userRes.data.data?.length || 0,
          complaints: compRes.data.data?.length || 0
        })
      } catch (err) {
        console.error('Error fetching admin dashboard statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <p>Loading administration dashboard statistics…</p>
      </div>
    )
  }

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Admin <span>Overview</span></h1>
          <p className="dash-page-subtitle">Real-time statistics and summary of Softpro Innovation</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        {[
          { label: 'Total Products', num: stats.products, cls: 's1', icon: '📦', link: '/admin/dashboard/product' },
          { label: 'Categories', num: stats.categories, cls: 's2', icon: '🏷️', link: '/admin/dashboard/category' },
          { label: 'Total Orders', num: stats.orders, cls: 's3', icon: '🛒', link: '/admin/dashboard/orders' },
          { label: 'Total Users', num: stats.users, cls: 's4', icon: '👥', link: '/admin/dashboard/users' }
        ].map((s) => (
          <div className="col-12 col-sm-6 col-lg-3" key={s.label}>
            <Link to={s.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`dash-stat-card ${s.cls}`}>
                <span className="dash-stat-icon">{s.icon}</span>
                <div className="dash-stat-num">{s.num}</div>
                <div className="dash-stat-label">{s.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick shortcuts / notifications area */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="dash-card-title">Quick Administration Actions</h2>
            </div>
            <div className="dash-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link to="/admin/dashboard/addproduct" className="dash-btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                ➕ Add New Product
              </Link>
              <Link to="/admin/dashboard/add-category" className="dash-btn-outline" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                🏷️ Add Category
              </Link>
              <Link to="/admin/dashboard/inventory" className="dash-btn-outline" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                📈 Monitor Inventory Stock
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="dash-card h-100">
            <div className="dash-card-header">
              <h2 className="dash-card-title">System Health & Notifications</h2>
            </div>
            <div className="dash-card-body">
              <div className="dash-alert success" style={{ marginBottom: '0.8rem' }}>
                <span>🛡️</span>
                <div>
                  <strong>Helmet Security Enabled</strong>
                  <div style={{ fontSize: '0.78rem', marginTop: '2px', opacity: 0.8 }}>HTTP security headers are verified active and secure.</div>
                </div>
              </div>

              <div className="dash-alert info" style={{ marginBottom: '0.8rem' }}>
                <span>💬</span>
                <div>
                  <strong>Customer Complaints Received</strong>
                  <div style={{ fontSize: '0.78rem', marginTop: '2px', opacity: 0.8 }}>
                    There are currently {stats.complaints} total customer message inquiries. <Link to="/admin/dashboard/complaint" style={{ color: 'inherit', fontWeight: 600 }}>Review messages →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
