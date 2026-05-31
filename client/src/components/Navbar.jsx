import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from "../assets/images/spi.png"
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('si-theme') || 'light'
  })

  // Check login status
  const isLoggedIn = !!localStorage.getItem('id')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('si-theme', next)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact Us' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className={`si-navbar navbar navbar-expand-lg${scrolled ? ' scrolled' : ''}`}>
      <div className="container">

        {/* Brand */}
        <Link to="/" className="navbar-brand-wrap">
          <div className="brand-logo">
            <img src={logo} alt="" />
          </div>
          <div className="brand-name">Softpro<span>Innovation</span></div>
        </Link>

        {/* Mobile: theme + hamburger */}
        <div className="d-flex d-lg-none align-items-center gap-2">
          <button className="theme-toggle-btn" onClick={handleToggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button className="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#siNavMenu"
            aria-controls="siNavMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        {/* Collapsible menu */}
        <div className="collapse navbar-collapse" id="siNavMenu">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            {links.map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <Link to={to} className={`nav-link${isActive(to) ? ' active' : ''}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop action buttons */}
          <div className="nav-actions-group d-flex align-items-center gap-2">

            {/* Theme toggle */}
            <button className="theme-toggle-btn d-none d-lg-flex" onClick={handleToggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
              <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Agar logged in hai */}
            {isLoggedIn ? (
              <Link to="/user/dashboard" className="nav-btn-fill">
                👤 Dashboard
              </Link>
            ) : (
              <>
                {/* Cart */}
                <Link to="/user/dashboard/cart" className="nav-btn-cart">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Cart
                </Link>
                <Link to="/login" className="nav-btn-outline">Login</Link>
                <Link to="/register" className="nav-btn-fill">Register</Link>
              </>
            )}

          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar