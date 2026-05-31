import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'

/* ── SVG Icons ── */
const IcoDashboard = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IcoCategory = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
)
const IcoProduct = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IcoOrders = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const IcoUsers = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IcoInventory = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10H3M21 6H3M21 14H3M21 18H3"/>
  </svg>
)
const IcoComplaint = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IcoLogout = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IcoMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const NAV_ITEMS = [
  { to: '/admin/dashboard',           label: 'Overview',        icon: <IcoDashboard /> },
  { to: '/admin/dashboard/category',  label: 'Categories',      icon: <IcoCategory /> },
  { to: '/admin/dashboard/product',   label: 'Products',        icon: <IcoProduct /> },
  { to: '/admin/dashboard/orders',    label: 'Orders',          icon: <IcoOrders /> },
  { to: '/admin/dashboard/users',     label: 'Users List',      icon: <IcoUsers /> },
  { to: '/admin/dashboard/inventory', label: 'Inventory',       icon: <IcoInventory /> },
  { to: '/admin/dashboard/complaint', label: 'Complaints',      icon: <IcoComplaint /> },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')

  // Auth Guard
  useEffect(() => {
    if (!token || role !== 'Admin') {
      navigate('/admin/login', { replace: true })
    }
  }, [token, role, navigate])

  // Close sidebar on page shift for mobile views
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard'
    return location.pathname.startsWith(path) && path !== '/admin/dashboard'
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/admin/login')
  }

  if (!token || role !== 'Admin') {
    return null // Guard blank load
  }

  return (
    <>
      <Navbar />

      <div className="dash-shell">

        {/* ════ SIDEBAR ════ */}
        <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>

          {/* User Block info */}
          <div className="dash-user-block">
            <div className="dash-user-avatar" style={{ background: '#e05c2a', boxShadow: '0 4px 16px rgba(224,92,42,.35)' }}>AD</div>
            <div className="dash-user-name">Administrator</div>
            <div className="dash-user-email">admin@softpro.com</div>
            <span className="dash-user-badge" style={{ borderColor: 'rgba(224,92,42,.3)', background: 'rgba(224,92,42,.2)', color: '#e05c2a' }}>Admin</span>
          </div>

          {/* Nav links */}
          <div className="dash-nav-label">Admin Controls</div>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`dash-nav-item${isActive(to) ? ' active' : ''}`}
              style={isActive(to) ? { background: '#e05c2a', boxShadow: '0 4px 14px rgba(224,92,42,.35)' } : {}}
            >
              {icon}
              {label}
            </Link>
          ))}

          <div className="dash-sidebar-divider" />

          {/* Logout */}
          <div className="dash-sidebar-bottom">
            <button
              className="dash-nav-item"
              onClick={handleLogout}
              style={{
                width: '100%', background: 'none',
                border: 'none', cursor: 'pointer',
                color: '#ff6b6b',
              }}
            >
              <IcoLogout />
              Logout
            </button>
          </div>

        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 140,
              background: 'rgba(0,0,0,.45)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* ════ MAIN CONTENT OUTLET ════ */}
        <main className="dash-main">
          <Outlet />
        </main>

      </div>

      {/* Mobile sidebar toggle button */}
      <button
        className="dash-mobile-toggle"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        <IcoMenu />
      </button>
    </>
  )
}

export default Dashboard