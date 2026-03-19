import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import axios from 'axios'

/* ── Slider Data ── */
const SLIDES = [
  {
    eyebrow: 'New Arrival 2025',
    title:   ['Power Your', 'Next ', 'Big Project'],
    accent:  'Next ',
    desc:    'Explore Raspberry Pi 5, Arduino R4, ESP32-S3 boards and over 5,000 components. Fast shipping across India.',
    bg:      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80',
    cta1:    'Shop Now',
    cta2:    'View Catalog',
  },
  {
    eyebrow: 'Most Popular',
    title:   ['Raspberry Pi 5', 'Kits &', 'Accessories'],
    accent:  'Kits &',
    desc:    'Complete starter kits, camera modules, HATs, and peripherals for Raspberry Pi projects.',
    bg:      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1400&q=80',
    cta1:    'Explore Kits',
    cta2:    'Learn More',
  },
  {
    eyebrow: 'Arduino Corner',
    title:   ['Arduino Boards', 'For Every', 'Maker'],
    accent:  'Every',
    desc:    'UNO, Mega, Nano, Leonardo and the all-new R4 series. Pick your perfect development platform.',
    bg:      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=1400&q=80',
    cta1:    'Browse Arduino',
    cta2:    'Project Ideas',
  },
]

const TESTIMONIALS = [
  {
    text:     'Ordered an Arduino starter kit and received it within 24 hours in Lucknow. The quality is excellent and the components are well-labelled. Will definitely order again.',
    name:     'Arjun Sharma',
    role:     'Engineering Student, IIT Kanpur',
    initials: 'AS',
    stars:    5,
  },
  {
    text:     'Best place for Raspberry Pi components in India. The Raspberry Pi 5 kit came with everything I needed and the price is very competitive.',
    name:     'Priya Nair',
    role:     'IoT Developer, Bangalore',
    initials: 'PN',
    stars:    5,
  },
  {
    text:     'Great selection of ESP32 boards and sensors. I have been ordering from Softpro for two years now and the customer support is always helpful.',
    name:     'Rahul Mehta',
    role:     'Hobbyist Maker',
    initials: 'RM',
    stars:    4,
  },
]

/* ── Star renderer ── */
const Stars = ({ n = 0 }) => {
  const full  = Math.floor(n)
  const empty = 5 - Math.ceil(n)
  return (
    <span className="prod-stars-row">
      {'★'.repeat(full)}
      {n % 1 >= 0.5 ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

/* ════════════════════════════════════════════════════════
   Home
════════════════════════════════════════════════════════ */
const Home = () => {
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])

  const observerRef = useRef(null)

  /* Scroll animation observer */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [categories, products])

  /* Fetch from backend */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('http://localhost:5000/api/category/home'),
          axios.get('http://localhost:5000/api/product/products'),
        ])
        setCategories(catRes.data.data  || [])
        setProducts(prodRes.data.data   || [])
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <>
    <div>
      <Navbar/>
    </div>
      
      {/* ════ HERO SLIDER ════ */}
      <section className="si-hero  p-0 mt-0">
        <div
          id="heroCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="5000"
        >
          <div className="carousel-indicators">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to={i}
                className={i === 0 ? 'active' : ''}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {SLIDES.map((slide, i) => (
              <div className={`carousel-item${i === 0 ? ' active' : ''}`} key={i}>
                <div className="hero-slide">
                  <div className="hero-slide-bg" style={{ backgroundImage: `url(${slide.bg})` }} />
                  <div className="hero-overlay" />
                  <div className="container">
                    <div className="hero-content">
                      <span className="hero-eyebrow">{slide.eyebrow}</span>
                      <h1 className="hero-title">
                        {slide.title.map((part, pi) =>
                          part === slide.accent
                            ? <em key={pi}>{part}</em>
                            : <span key={pi}>{part}</span>
                        )}
                      </h1>
                      <p className="hero-desc">{slide.desc}</p>
                      <div className="hero-actions">
                        <Link to="/products" className="btn-hero-primary">{slide.cta1}</Link>
                        <Link to="/about"    className="btn-hero-secondary">{slide.cta2}</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" />
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      </section>

      {/* ════ STATS STRIP ════ */}
      <div className="stats-strip">
        <div className="container">
          <div className="row align-items-center text-center g-3">
            {[
              { num: '5,000+',  label: 'Products in Stock' },
              { num: '98%',     label: 'Customer Satisfaction' },
              { num: '24hr',    label: 'Dispatch Guarantee' },
              { num: '50,000+', label: 'Orders Delivered' },
            ].map(({ num, label }, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="col-auto d-none d-md-block"><div className="stat-divider" /></div>}
                <div className="col stat-item">
                  <div className="stat-num">{num}</div>
                  <div className="stat-label">{label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ════ POPULAR CATEGORIES ════ */}
      <section className="si-section">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col fade-up">
              <span className="section-eyebrow">Browse by Type</span>
              <h2 className="section-title">Popular <em>Categories</em></h2>
              <div className="section-divider" />
              <p className="section-desc">
                Find exactly what your project needs from our curated electronics families.
              </p>
            </div>
            {/* <div className="col-auto fade-up delay-2">
              <Link to="/category" className="nav-btn-outline">View All →</Link>
            </div> */}
          </div>

          {categories.length === 0 ? (
            <div className="si-empty-state">
              <span>📦</span>
              <p>Categories loading…</p>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {categories.map((cat, i) => (
                <div
                  className={`col-6 col-sm-4 col-lg-3 fade-up delay-${(i % 4) + 1}`}
                  key={cat._id}
                >
                  <Link to={`/category/${cat._id}`} style={{ textDecoration: 'none' }}>
                    <div className="si-cat-card">
                      <div className="si-cat-img-wrap">
                        <img
                          src={`http://localhost:5000/api/category/${cat.picture.replace(/\\/g, '/').split('/').pop()}`}
                          alt={cat.category}
                          className="si-cat-img"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <div className="si-cat-name">{cat.category}</div>
                      {cat.count && (
                        <div className="si-cat-count">{cat.count} products</div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ FEATURED PRODUCTS ════ */}
      <section className="si-section si-section-alt">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col fade-up">
              <span className="section-eyebrow">Handpicked for You</span>
              <h2 className="section-title">Featured <em>Products</em></h2>
              <div className="section-divider" />
              <p className="section-desc">
                Top-rated boards and components loved by engineers, students, and hobbyists.
              </p>
            </div>
            <div className="col-auto fade-up delay-2">
              <Link to="/products" className="nav-btn-outline">All Products →</Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="si-empty-state">
              <span>🔍</span>
              <p>Products loading…</p>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {products.map((product, i) => (
                <div
                  className={`col-12 col-sm-6 col-lg-3 fade-up delay-${(i % 4) + 1}`}
                  key={product._id}
                >
                  <div className="si-prod-card">

                    {/* Image area */}
                    <div className="si-prod-img-wrap">
                      {product.images ? (
                        <img
                          src={`http://localhost:5000/api/product/${product.images.replace(/\\/g, '/').split('/').pop()}`}
                          alt={product.name}
                          className="si-prod-img"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="si-prod-img-placeholder">
                          <span>📦</span>
                        </div>
                      )}

                      {/* Badge */}
                      {product.badge && (
                        <span className="si-prod-badge">{product.badge}</span>
                      )}

                      {/* Hover action buttons */}
                      <div className="si-prod-actions">
                        <Link to={`/product/${product._id}`} className="si-btn-view">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </Link>
                        <button className="si-btn-wish" title="Wishlist">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Info area */}
                    <div className="si-prod-body">
                      {/* category can be a populated object OR a plain string */}
                      {product.category && (
                        <div className="si-prod-cat">
                          {typeof product.category === 'object'
                            ? product.category.category   /* populated: {_id, category, ...} */
                            : product.category            /* plain string */
                          }
                        </div>
                      )}

                      <div className="si-prod-name">{product.name}</div>

                      {product.stars != null && (
                        <div className="si-prod-rating">
                          <Stars n={Number(product.stars)} />
                          {product.reviews && (
                            <span className="si-prod-reviews">({product.reviews})</span>
                          )}
                        </div>
                      )}

                      <div className="si-prod-footer">
                        <div className="si-prod-price-wrap">
                          <span className="si-prod-price">
                            ₹{Number(product.actualPrice).toLocaleString('en-IN')}
                          </span>
                          {product.old && (
                            <span className="si-prod-old">
                              ₹{Number(product.old).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <button className="si-btn-cart">+ Cart</button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section className="si-section">
        <div className="container">
          <div className="text-center mb-5 fade-up">
            <span className="section-eyebrow">What Makers Say</span>
            <h2 className="section-title">Loved by the <em>Community</em></h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div className={`col-md-4 fade-up delay-${i + 1}`} key={i}>
                <div className="testi-card h-100">
                  <div className="testi-quote">&ldquo;</div>
                  <div className="testi-stars">{'★'.repeat(t.stars)}</div>
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.initials}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ NEWSLETTER ════ */}
      <section className="si-section si-section-alt">
        <div className="container">
          <div className="newsletter-wrap fade-up">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <h2 className="newsletter-title">Stay Ahead of the Curve</h2>
                <p className="newsletter-desc">
                  Get launch alerts, project tutorials, and exclusive deals straight to your inbox.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="newsletter-form">
                  <input type="email" className="newsletter-input" placeholder="Your email address" />
                  <button className="btn-newsletter">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Home