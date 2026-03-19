import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'

/* ── Icons ── */
const IcoDashboard = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IcoOrders = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 17H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4"/>
    <path d="M12 3v14"/><path d="m8 11 4-4 4 4"/>
  </svg>
)
const IcoCart = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const IcoProduct = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IcoLock = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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

/* ── Nav items — add/remove/change routes apne hisab se ── */
const NAV_ITEMS = [
  { to: '/user/dashboard',          label: 'Overview',        icon: <IcoDashboard /> },
  { to: '/user/dashboard/orders',   label: 'My Orders',       icon: <IcoOrders />,  },
  { to: '/user/dashboard/cart',     label: 'My Cart',         icon: <IcoCart />,     },
  { to: '/user/dashboard/profile',  label: 'My Profile',      icon: <IcoProduct /> },
  { to: '/user/dashboard/changepassword', label: 'Change Password', icon: <IcoLock /> },
  
]

/* ════════════════════════════════════════════════════
   UserDashboard — shell only (sidebar + Outlet)
   Apne routes App.jsx mein khud define karo.
  ═══════════════════════════════════════════════════ */
const UserDashboard = () => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const userName  = localStorage.getItem('name')  || 'User'
  const userEmail = localStorage.getItem('email') || 'user@example.com'
  const initials  = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  // Mobile: sidebar band ho jaye route change pe
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <>
      <Navbar />

      <div className="dash-shell">

        {/* ════ SIDEBAR ════ */}
        <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>

          {/* User info */}
          <div className="dash-user-block">
            <div className="dash-user-avatar">{initials}</div>
            <div className="dash-user-name">{userName}</div>
            <div className="dash-user-email">{userEmail}</div>
            <span className="dash-user-badge">Member</span>
          </div>

          {/* Nav links */}
          <div className="dash-nav-label">Main Menu</div>
          {NAV_ITEMS.map(({ to, label, icon, badge }) => (
            <Link
              key={to}
              to={to}
              className={`dash-nav-item${isActive(to) ? ' active' : ''}`}
            >
              {icon}
              {label}
              {badge && <span className="dash-nav-badge">{badge}</span>}
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

        {/* ════ MAIN — child routes render here ════ */}
        <main className="dash-main">
          <Outlet />
        </main>

      </div>

      {/* Mobile sidebar toggle */}
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

export default UserDashboard